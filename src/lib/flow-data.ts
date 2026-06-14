// Flow-centric data model. Production-faithful flow definitions per provider.
// Each FlowDefinition mirrors the real provider's state machine, event names,
// and failure modes. Instances are derived from existing transactions so the
// rest of the app keeps working while we adopt the new model.

import { transactions, type Transaction } from "./mock-data";

export type FlowType = "money_movement" | "account_funding" | "identity_verification";
export type StateKind = "initial" | "intermediate" | "terminal_success" | "terminal_failure";
export type Outcome = "success" | "failed" | "pending";

export interface FlowState {
  id: string;
  label: string;
  kind: StateKind;
  /** Layout column (0-based, left → right) */
  col: number;
  /** Layout row within column (0 = happy path) */
  row: number;
  description?: string;
}

export interface FlowTransition {
  from: string;
  to: string;
  /** Real provider event name that fires this transition */
  event: string;
  kind: "normal" | "failure";
  /** When kind = failure, the scenario this transition belongs to */
  scenarioId?: string;
}

export type FixKind = "retry" | "fallback" | "config_change" | "escalate";

export interface SuggestedFix {
  title: string;
  detail: string;
  kind: FixKind;
  /** State ids the fix applies to */
  appliesToStates: string[];
}

export interface FailureScenario {
  id: string;
  name: string;
  /** Provider-surfaced result indicator: gateway_response string, ResultCode, etc. */
  providerCode: string;
  /** Short human cause */
  cause: string;
  /** Client-visible symptom */
  symptom: string;
  /** Webhook event that fires under this scenario, if any */
  webhookEvent?: string;
  suggestedFixes: SuggestedFix[];
}

export interface WebhookSpec {
  name: string;
  emittedFrom: string; // state id
  description: string;
}

export interface FlowDefinition {
  id: string;
  name: string;
  provider: string;
  operation: string;
  flowType: FlowType;
  apiVersion: string;
  description: string;
  states: FlowState[];
  transitions: FlowTransition[];
  /** Ordered state ids representing the canonical success path */
  happyPath: string[];
  failureScenarios: FailureScenario[];
  webhooks: WebhookSpec[];
  /** Median end-to-end ms */
  p50Ms: number;
  p95Ms: number;
}

export interface FlowEvent {
  t: number; // ms offset from instance start
  kind: "state_enter" | "webhook" | "log" | "failure";
  stateId?: string;
  label: string;
  detail?: string;
}

export interface FailurePoint {
  atState: string;
  atTransitionEvent?: string;
  scenarioId: string;
  cause: string;
  providerCode: string;
  why: string;
}

export interface FlowInstance {
  id: string;
  reference: string;
  flowDefinitionId: string;
  startedAt: string;
  endedAt?: string;
  currentState: string;
  traveledStates: string[];
  events: FlowEvent[];
  outcome: Outcome;
  failurePoint?: FailurePoint;
  /** Back-link to the original transaction (for migration) */
  transactionId?: string;
}

// ============================================================
// Flow definitions
// ============================================================

const paystackCharge: FlowDefinition = {
  id: "paystack.charge",
  name: "Paystack Charge",
  provider: "Paystack Simulator",
  operation: "Charge",
  flowType: "money_movement",
  apiVersion: "2024-01",
  description: "Card charge with optional 3DS step-up. Mirrors Paystack /charge API behavior including charge.success / charge.failed webhooks with real reason codes.",
  states: [
    { id: "initiated", label: "Initiated", kind: "initial", col: 0, row: 0, description: "Charge request received by Paystack." },
    { id: "processing", label: "Processing", kind: "intermediate", col: 1, row: 0, description: "Routed to issuer for authorization." },
    { id: "awaiting_3ds", label: "Awaiting 3DS", kind: "intermediate", col: 2, row: 1, description: "Issuer requires OTP / step-up." },
    { id: "success", label: "Success", kind: "terminal_success", col: 3, row: 0, description: "Charge approved. Emits charge.success." },
    { id: "failed", label: "Failed", kind: "terminal_failure", col: 3, row: 2, description: "Charge declined. Emits charge.failed." },
    { id: "abandoned", label: "Abandoned", kind: "terminal_failure", col: 3, row: 3, description: "User abandoned the OTP step." },
  ],
  transitions: [
    { from: "initiated", to: "processing", event: "charge.start", kind: "normal" },
    { from: "processing", to: "success", event: "charge.success", kind: "normal" },
    { from: "processing", to: "awaiting_3ds", event: "charge.3ds_required", kind: "normal" },
    { from: "awaiting_3ds", to: "success", event: "charge.success", kind: "normal" },
    { from: "processing", to: "failed", event: "charge.failed", kind: "failure", scenarioId: "card_declined" },
    { from: "processing", to: "failed", event: "charge.failed", kind: "failure", scenarioId: "insufficient_funds" },
    { from: "awaiting_3ds", to: "failed", event: "charge.failed", kind: "failure", scenarioId: "otp_invalid" },
    { from: "awaiting_3ds", to: "abandoned", event: "charge.abandoned", kind: "failure", scenarioId: "user_abandoned" },
  ],
  happyPath: ["initiated", "processing", "success"],
  failureScenarios: [
    {
      id: "card_declined",
      name: "Card declined by issuer",
      providerCode: "02",
      cause: "Issuer declined the authorization (gateway_response: \"Declined\").",
      symptom: "POST /charge returns 200 with data.status = \"failed\", reason_code 02. charge.failed webhook fires.",
      webhookEvent: "charge.failed",
      suggestedFixes: [
        { title: "Retry on a different rail", detail: "Fall back to bank transfer (NIP) for the same reference.", kind: "fallback", appliesToStates: ["processing"] },
        { title: "Surface localized message", detail: "Don't show \"02\" to the user. Map to \"Your bank declined this card.\"", kind: "config_change", appliesToStates: ["processing"] },
      ],
    },
    {
      id: "insufficient_funds",
      name: "Insufficient funds",
      providerCode: "51",
      cause: "Issuer reports insufficient balance on the card.",
      symptom: "charge.failed webhook with reason_code 51.",
      webhookEvent: "charge.failed",
      suggestedFixes: [
        { title: "Suggest a smaller amount", detail: "Prompt the user to enter a lower amount or split the payment.", kind: "fallback", appliesToStates: ["processing"] },
      ],
    },
    {
      id: "otp_invalid",
      name: "Invalid OTP",
      providerCode: "M1",
      cause: "User entered the wrong OTP three times during 3DS.",
      symptom: "charge.failed webhook fires from the awaiting_3ds state.",
      webhookEvent: "charge.failed",
      suggestedFixes: [
        { title: "Allow OTP resend", detail: "Expose a \"Resend OTP\" action before transitioning to failed.", kind: "retry", appliesToStates: ["awaiting_3ds"] },
        { title: "Escalate to support", detail: "Surface contact channel after 2 invalid OTP attempts.", kind: "escalate", appliesToStates: ["awaiting_3ds"] },
      ],
    },
    {
      id: "user_abandoned",
      name: "User abandoned 3DS",
      providerCode: "ABRT",
      cause: "User closed the 3DS window without entering OTP. Times out after 8 minutes.",
      symptom: "charge.abandoned webhook fires. No automatic retry.",
      webhookEvent: "charge.abandoned",
      suggestedFixes: [
        { title: "Send recovery email", detail: "Trigger a transactional email with a fresh checkout link within 5 minutes.", kind: "retry", appliesToStates: ["awaiting_3ds"] },
      ],
    },
  ],
  webhooks: [
    { name: "charge.success", emittedFrom: "success", description: "Fired once when the charge is approved." },
    { name: "charge.failed", emittedFrom: "failed", description: "Fired with reason_code matching the failure scenario." },
    { name: "charge.abandoned", emittedFrom: "abandoned", description: "Fired after 8min of inactivity on 3DS." },
  ],
  p50Ms: 1800,
  p95Ms: 7400,
};

const mpesaStkPush: FlowDefinition = {
  id: "mpesa.stk_push",
  name: "M-Pesa STK Push",
  provider: "M-Pesa Simulator",
  operation: "STK Push",
  flowType: "account_funding",
  apiVersion: "Daraja v2.0",
  description: "C2B STK Push. Mirrors Safaricom Daraja STKPush including the ~20s PIN window and CallbackURL semantics.",
  states: [
    { id: "initiated", label: "Initiated", kind: "initial", col: 0, row: 0, description: "STK Push request accepted." },
    { id: "awaiting_pin", label: "Awaiting PIN", kind: "intermediate", col: 1, row: 0, description: "Prompt sent to subscriber's handset. ~20s window." },
    { id: "processing", label: "Processing", kind: "intermediate", col: 2, row: 0, description: "PIN entered, debit being attempted." },
    { id: "success", label: "Success", kind: "terminal_success", col: 3, row: 0, description: "ResultCode 0. Receipt issued." },
    { id: "failed", label: "Failed", kind: "terminal_failure", col: 3, row: 2, description: "Non-zero ResultCode returned." },
    { id: "timed_out", label: "Timed out", kind: "terminal_failure", col: 3, row: 3, description: "Subscriber did not respond in time." },
  ],
  transitions: [
    { from: "initiated", to: "awaiting_pin", event: "STKPushRequest", kind: "normal" },
    { from: "awaiting_pin", to: "processing", event: "STKPushAck", kind: "normal" },
    { from: "processing", to: "success", event: "Callback:ResultCode=0", kind: "normal" },
    { from: "awaiting_pin", to: "timed_out", event: "Callback:ResultCode=1037", kind: "failure", scenarioId: "pin_timeout" },
    { from: "awaiting_pin", to: "failed", event: "Callback:ResultCode=1032", kind: "failure", scenarioId: "user_cancelled" },
    { from: "processing", to: "failed", event: "Callback:ResultCode=1", kind: "failure", scenarioId: "insufficient_balance" },
  ],
  happyPath: ["initiated", "awaiting_pin", "processing", "success"],
  failureScenarios: [
    {
      id: "pin_timeout",
      name: "Subscriber did not enter PIN",
      providerCode: "ResultCode:1037",
      cause: "DS timeout user cannot be reached.",
      symptom: "Callback fires after ~60s with ResultCode 1037.",
      webhookEvent: "stkpush.callback",
      suggestedFixes: [
        { title: "Auto-retry once", detail: "Re-send STK Push if user hasn't responded after 90s. Cap at 2 attempts.", kind: "retry", appliesToStates: ["awaiting_pin"] },
        { title: "Offer Paybill fallback", detail: "Show Paybill + Account number so user can pay manually.", kind: "fallback", appliesToStates: ["awaiting_pin"] },
      ],
    },
    {
      id: "user_cancelled",
      name: "Request cancelled by user",
      providerCode: "ResultCode:1032",
      cause: "Subscriber pressed cancel on the STK prompt.",
      symptom: "Callback fires immediately with ResultCode 1032.",
      webhookEvent: "stkpush.callback",
      suggestedFixes: [
        { title: "Ask why", detail: "Show an in-app prompt to capture cancellation reason.", kind: "config_change", appliesToStates: ["awaiting_pin"] },
      ],
    },
    {
      id: "insufficient_balance",
      name: "Insufficient M-Pesa balance",
      providerCode: "ResultCode:1",
      cause: "Subscriber's M-Pesa wallet has less than the requested amount.",
      symptom: "Callback fires with ResultCode 1 after PIN entry.",
      webhookEvent: "stkpush.callback",
      suggestedFixes: [
        { title: "Suggest top-up", detail: "Offer a deep link to M-Pesa top-up and retry.", kind: "fallback", appliesToStates: ["processing"] },
      ],
    },
  ],
  webhooks: [
    { name: "stkpush.callback", emittedFrom: "success", description: "Callback to your CallbackURL with ResultCode + receipt." },
  ],
  p50Ms: 14000,
  p95Ms: 28000,
};

const monoKyc: FlowDefinition = {
  id: "mono.kyc_tier2",
  name: "Mono KYC Tier 2",
  provider: "Mock Bank NG",
  operation: "Identity Verification",
  flowType: "identity_verification",
  apiVersion: "2024-03",
  description: "Tier-2 KYC: BVN + government ID with OCR and optional manual review.",
  states: [
    { id: "submitted", label: "Submitted", kind: "initial", col: 0, row: 0, description: "User submitted BVN + ID upload." },
    { id: "document_received", label: "Document received", kind: "intermediate", col: 1, row: 0 },
    { id: "ocr_processing", label: "OCR processing", kind: "intermediate", col: 2, row: 0, description: "Extracting name + DOB + ID number." },
    { id: "manual_review", label: "Manual review", kind: "intermediate", col: 3, row: 1, description: "Operator review queue. SLA 4h." },
    { id: "verified", label: "Verified", kind: "terminal_success", col: 4, row: 0 },
    { id: "rejected", label: "Rejected", kind: "terminal_failure", col: 4, row: 2 },
    { id: "expired", label: "Expired", kind: "terminal_failure", col: 4, row: 3 },
  ],
  transitions: [
    { from: "submitted", to: "document_received", event: "doc.uploaded", kind: "normal" },
    { from: "document_received", to: "ocr_processing", event: "ocr.start", kind: "normal" },
    { from: "ocr_processing", to: "verified", event: "kyc.verified", kind: "normal" },
    { from: "ocr_processing", to: "manual_review", event: "ocr.uncertain", kind: "normal" },
    { from: "manual_review", to: "verified", event: "review.approved", kind: "normal" },
    { from: "manual_review", to: "rejected", event: "review.rejected", kind: "failure", scenarioId: "id_mismatch" },
    { from: "ocr_processing", to: "rejected", event: "ocr.unreadable", kind: "failure", scenarioId: "doc_unreadable" },
    { from: "submitted", to: "expired", event: "kyc.expired", kind: "failure", scenarioId: "submission_expired" },
  ],
  happyPath: ["submitted", "document_received", "ocr_processing", "verified"],
  failureScenarios: [
    {
      id: "id_mismatch",
      name: "Name on ID does not match BVN",
      providerCode: "ID_MISMATCH",
      cause: "OCR extracted a name that doesn't match the BVN record after manual review.",
      symptom: "kyc.verification_failed webhook with reason: \"id_mismatch\".",
      webhookEvent: "kyc.verification_failed",
      suggestedFixes: [
        { title: "Prompt for re-upload", detail: "Ask user to upload a clearer photo of the same ID before rejecting.", kind: "retry", appliesToStates: ["manual_review"] },
        { title: "Allow alternate ID", detail: "Let the user upload a passport or driver's licence as fallback.", kind: "fallback", appliesToStates: ["manual_review"] },
      ],
    },
    {
      id: "doc_unreadable",
      name: "Document unreadable",
      providerCode: "DOC_UNREADABLE",
      cause: "Image too blurry / glare prevents OCR extraction.",
      symptom: "kyc.verification_failed webhook with reason: \"doc_unreadable\".",
      webhookEvent: "kyc.verification_failed",
      suggestedFixes: [
        { title: "Re-capture in-app", detail: "Open the camera with edge-detection overlay and resubmit.", kind: "retry", appliesToStates: ["ocr_processing"] },
      ],
    },
    {
      id: "submission_expired",
      name: "Submission expired",
      providerCode: "EXPIRED",
      cause: "User started KYC but didn't complete document upload within 24h.",
      symptom: "kyc.expired webhook fires. Session must be restarted.",
      webhookEvent: "kyc.expired",
      suggestedFixes: [
        { title: "Send reminder", detail: "Send a push notification at the 12h and 22h marks.", kind: "retry", appliesToStates: ["submitted"] },
      ],
    },
  ],
  webhooks: [
    { name: "kyc.verified", emittedFrom: "verified", description: "Identity confirmed. Tier-2 unlocked." },
    { name: "kyc.verification_failed", emittedFrom: "rejected", description: "Includes reason field matching the scenario." },
    { name: "kyc.expired", emittedFrom: "expired", description: "Session timed out before completion." },
  ],
  p50Ms: 22000,
  p95Ms: 240000,
};

export const flowDefinitions: FlowDefinition[] = [paystackCharge, mpesaStkPush, monoKyc];

export function getFlowDefinition(id: string): FlowDefinition | undefined {
  return flowDefinitions.find((f) => f.id === id);
}

// ============================================================
// Derive FlowInstances from existing transactions
// ============================================================

function pickDefinitionForTx(tx: Transaction): FlowDefinition {
  if (tx.provider.includes("M-Pesa")) return mpesaStkPush;
  if (tx.provider.includes("Mock Bank")) return monoKyc;
  return paystackCharge;
}

function pickFailureScenario(def: FlowDefinition, tx: Transaction): FailureScenario {
  // Deterministic pseudo-random
  const seed = tx.id.charCodeAt(tx.id.length - 1);
  const idx = seed % def.failureScenarios.length;
  return def.failureScenarios[idx];
}

function buildEvents(def: FlowDefinition, traveled: string[], failure?: FailurePoint): FlowEvent[] {
  const events: FlowEvent[] = [];
  let t = 0;
  const stepGap = Math.max(200, Math.floor(def.p50Ms / Math.max(1, def.happyPath.length)));
  for (let i = 0; i < traveled.length; i++) {
    const sid = traveled[i];
    const state = def.states.find((s) => s.id === sid);
    events.push({ t, kind: "state_enter", stateId: sid, label: `Enter ${state?.label ?? sid}`, detail: state?.description });
    // webhook emitted from this state?
    const wh = def.webhooks.find((w) => w.emittedFrom === sid);
    if (wh) {
      events.push({ t: t + 80, kind: "webhook", stateId: sid, label: `Webhook: ${wh.name}`, detail: wh.description });
    }
    t += stepGap + Math.floor((sid.charCodeAt(0) * 13) % 600);
  }
  if (failure) {
    events.push({
      t: t + 120,
      kind: "failure",
      stateId: failure.atState,
      label: `Failure: ${failure.cause}`,
      detail: `${failure.providerCode} — ${failure.atTransitionEvent ?? ""}`.trim(),
    });
  }
  return events;
}

function buildInstance(tx: Transaction): FlowInstance {
  const def = pickDefinitionForTx(tx);
  const isFailed = tx.status === "failed" || tx.status === "reversed";
  const isPending = tx.status === "pending";

  let traveled: string[];
  let currentState: string;
  let failurePoint: FailurePoint | undefined;
  let outcome: Outcome;

  if (isFailed) {
    const scenario = pickFailureScenario(def, tx);
    const failTransition = def.transitions.find((tr) => tr.scenarioId === scenario.id);
    const failAtState = failTransition?.from ?? def.happyPath[1] ?? def.happyPath[0];
    const failTerminal = failTransition?.to ?? def.states.find((s) => s.kind === "terminal_failure")?.id ?? "failed";
    // Walk happy path up to the failure-from state, then jump to terminal
    const upTo = def.happyPath.indexOf(failAtState);
    const prefix = upTo >= 0 ? def.happyPath.slice(0, upTo + 1) : [def.happyPath[0], failAtState];
    traveled = [...prefix, failTerminal];
    currentState = failTerminal;
    failurePoint = {
      atState: failAtState,
      atTransitionEvent: failTransition?.event,
      scenarioId: scenario.id,
      cause: scenario.cause,
      providerCode: scenario.providerCode,
      why: scenario.symptom,
    };
    outcome = "failed";
  } else if (isPending) {
    // Stop midway along happy path
    const midpoint = Math.max(1, Math.floor(def.happyPath.length / 2));
    traveled = def.happyPath.slice(0, midpoint);
    currentState = traveled[traveled.length - 1];
    outcome = "pending";
  } else {
    traveled = [...def.happyPath];
    currentState = traveled[traveled.length - 1];
    outcome = "success";
  }

  return {
    id: `fi_${tx.id}`,
    reference: tx.reference,
    flowDefinitionId: def.id,
    startedAt: tx.createdAt,
    endedAt: outcome === "pending" ? undefined : new Date(new Date(tx.createdAt).getTime() + def.p50Ms).toISOString(),
    currentState,
    traveledStates: traveled,
    events: buildEvents(def, traveled, failurePoint),
    outcome,
    failurePoint,
    transactionId: tx.id,
  };
}

export const flowInstances: FlowInstance[] = transactions.map(buildInstance);

export function getInstance(id: string): FlowInstance | undefined {
  return flowInstances.find((i) => i.id === id);
}

export function getInstanceByTxId(txId: string): FlowInstance | undefined {
  return flowInstances.find((i) => i.transactionId === txId);
}

// ============================================================
// Failure aggregation for cluster cards & top-failure widgets
// ============================================================

export interface FailureCluster {
  flowDefinitionId: string;
  atState: string;
  scenarioId: string;
  count: number;
  latest: string; // ISO
  sampleInstanceId: string;
}

export function failureClusters(): FailureCluster[] {
  const map = new Map<string, FailureCluster>();
  for (const inst of flowInstances) {
    if (!inst.failurePoint) continue;
    const key = `${inst.flowDefinitionId}::${inst.failurePoint.atState}::${inst.failurePoint.scenarioId}`;
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
      if (inst.startedAt > existing.latest) {
        existing.latest = inst.startedAt;
        existing.sampleInstanceId = inst.id;
      }
    } else {
      map.set(key, {
        flowDefinitionId: inst.flowDefinitionId,
        atState: inst.failurePoint.atState,
        scenarioId: inst.failurePoint.scenarioId,
        count: 1,
        latest: inst.startedAt,
        sampleInstanceId: inst.id,
      });
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

export function failedInstances(): FlowInstance[] {
  return flowInstances.filter((i) => i.outcome === "failed");
}

export function findScenario(def: FlowDefinition, scenarioId: string): FailureScenario | undefined {
  return def.failureScenarios.find((s) => s.id === scenarioId);
}

export function stateLabel(def: FlowDefinition, stateId: string): string {
  return def.states.find((s) => s.id === stateId)?.label ?? stateId;
}
