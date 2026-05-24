// Sandbox-centric lifecycle data model.
// Layers on top of flow-data.ts. Pure mock; no backend.

import { flowDefinitions, type FlowDefinition } from "./flow-data";

export type FidelityTier = "template" | "provider_like" | "production_faithful";
export type SandboxStatus = "healthy" | "degraded" | "paused";
export type RepoProvider = "github" | "gitlab" | "bitbucket";

export interface Sandbox {
  id: string;
  name: string;
  /** matches FlowDefinition.provider */
  provider: string;
  fidelity: FidelityTier;
  /** flow definition ids enabled for this sandbox */
  flowIds: string[];
  status: SandboxStatus;
  createdAt: string;
  webhookUrl: string;
  apiBase: string;
  publishableKey: string;
  /** rolling 24h counters */
  instances24h: number;
  failures24h: number;
  replayRuns24h: number;
  fixValidated24h: number;
}

export interface MonitoringEvent {
  id: string;
  source: "datadog" | "sentry" | "cloudwatch" | "elk";
  occurredAt: string;
  /** plain-English signal title */
  title: string;
  /** which provider it points to */
  provider: string;
  /** which flow it most likely belongs to */
  flowId?: string;
  /** matched scenario id, if any */
  scenarioId?: string;
  /** can this be replayed in a sandbox right now */
  replayable: boolean;
  severity: "info" | "warn" | "error";
  count: number;
}

export interface ReplayRun {
  id: string;
  originalInstanceId: string;
  sandboxId: string;
  flowId: string;
  startedAt: string;
  durationMs: number;
  /** did the replay reach the same failure point? */
  reproduced: boolean;
  /** after a fix was applied, did the replay succeed? */
  fixValidated: boolean | null;
  diffSummary: string;
}

export interface RepoConnection {
  id: string;
  provider: RepoProvider;
  account: string;
  status: "connected" | "needs_reauth";
  lastSyncedAt: string;
  repoCount: number;
}

export interface Repository {
  id: string;
  connectionId: string;
  provider: RepoProvider;
  fullName: string;
  defaultBranch: string;
  language: "TypeScript" | "Python" | "Go";
  framework: string;
  /** sandbox ids this repo is mapped to */
  mappedSandboxIds: string[];
}

// ============================================================
// Seeds
// ============================================================

export const sandboxes: Sandbox[] = [
  {
    id: "sb_paystack_main",
    name: "Paystack — Checkout",
    provider: "Paystack Simulator",
    fidelity: "production_faithful",
    flowIds: ["paystack.charge"],
    status: "healthy",
    createdAt: "2026-05-12T09:14:00Z",
    webhookUrl: "https://api.acme.dev/webhooks/paystack",
    apiBase: "https://sb-paystack-main.flowsim.dev",
    publishableKey: "pk_sb_pstk_8f3a2c1d",
    instances24h: 1284,
    failures24h: 76,
    replayRuns24h: 18,
    fixValidated24h: 11,
  },
  {
    id: "sb_mpesa_kenya",
    name: "M-Pesa — KE Collections",
    provider: "M-Pesa Simulator",
    fidelity: "provider_like",
    flowIds: ["mpesa.stk_push"],
    status: "degraded",
    createdAt: "2026-05-08T16:02:00Z",
    webhookUrl: "https://api.acme.dev/webhooks/mpesa",
    apiBase: "https://sb-mpesa-ke.flowsim.dev",
    publishableKey: "pk_sb_mpsa_2b91efaa",
    instances24h: 642,
    failures24h: 121,
    replayRuns24h: 24,
    fixValidated24h: 9,
  },
  {
    id: "sb_mono_kyc",
    name: "Mono — KYC Tier 2",
    provider: "Mock Bank NG",
    fidelity: "production_faithful",
    flowIds: ["mono.kyc_tier2"],
    status: "healthy",
    createdAt: "2026-04-29T11:48:00Z",
    webhookUrl: "https://api.acme.dev/webhooks/mono",
    apiBase: "https://sb-mono-kyc.flowsim.dev",
    publishableKey: "pk_sb_mono_a47d10c2",
    instances24h: 318,
    failures24h: 22,
    replayRuns24h: 6,
    fixValidated24h: 5,
  },
  {
    id: "sb_paystack_staging",
    name: "Paystack — Staging",
    provider: "Paystack Simulator",
    fidelity: "template",
    flowIds: ["paystack.charge"],
    status: "paused",
    createdAt: "2026-05-20T08:00:00Z",
    webhookUrl: "https://staging.acme.dev/webhooks/paystack",
    apiBase: "https://sb-paystack-stg.flowsim.dev",
    publishableKey: "pk_sb_pstk_stg_11abcd",
    instances24h: 0,
    failures24h: 0,
    replayRuns24h: 0,
    fixValidated24h: 0,
  },
];

export function getSandbox(id: string): Sandbox | undefined {
  return sandboxes.find((s) => s.id === id);
}

export function getSandboxFlows(sb: Sandbox): FlowDefinition[] {
  return flowDefinitions.filter((f) => sb.flowIds.includes(f.id));
}

export const fidelityLabels: Record<FidelityTier, { label: string; blurb: string }> = {
  template: {
    label: "Template",
    blurb: "Generic shape. Good for wiring auth and routes.",
  },
  provider_like: {
    label: "Provider-like",
    blurb: "Provider-shaped payloads + common error codes + named webhooks.",
  },
  production_faithful: {
    label: "Production-faithful",
    blurb: "Full payload + error-code + webhook-signature parity with our shipped spec. Still a sandbox — does not call the provider.",
  },
};

// ============================================================
// Monitoring events
// ============================================================

export const monitoringEvents: MonitoringEvent[] = [
  {
    id: "me_1",
    source: "datadog",
    occurredAt: "2026-05-24T07:42:00Z",
    title: "Spike in charge.failed (reason=02) on /checkout",
    provider: "Paystack Simulator",
    flowId: "paystack.charge",
    scenarioId: "card_declined",
    replayable: true,
    severity: "error",
    count: 38,
  },
  {
    id: "me_2",
    source: "sentry",
    occurredAt: "2026-05-24T06:11:00Z",
    title: "Unhandled exception: STKPush callback parse failed",
    provider: "M-Pesa Simulator",
    flowId: "mpesa.stk_push",
    scenarioId: "user_cancelled",
    replayable: true,
    severity: "error",
    count: 14,
  },
  {
    id: "me_3",
    source: "cloudwatch",
    occurredAt: "2026-05-23T22:08:00Z",
    title: "p95 latency > 24s on awaiting_pin",
    provider: "M-Pesa Simulator",
    flowId: "mpesa.stk_push",
    replayable: true,
    severity: "warn",
    count: 1,
  },
  {
    id: "me_4",
    source: "elk",
    occurredAt: "2026-05-23T18:51:00Z",
    title: "Manual review queue backlog > 4h SLA",
    provider: "Mock Bank NG",
    flowId: "mono.kyc_tier2",
    replayable: false,
    severity: "warn",
    count: 1,
  },
  {
    id: "me_5",
    source: "datadog",
    occurredAt: "2026-05-23T14:23:00Z",
    title: "Webhook delivery 5xx from acme.dev/webhooks/paystack",
    provider: "Paystack Simulator",
    flowId: "paystack.charge",
    replayable: true,
    severity: "error",
    count: 9,
  },
  {
    id: "me_6",
    source: "sentry",
    occurredAt: "2026-05-23T09:02:00Z",
    title: "ID mismatch rate climbing on KYC Tier 2",
    provider: "Mock Bank NG",
    flowId: "mono.kyc_tier2",
    scenarioId: "id_mismatch",
    replayable: true,
    severity: "warn",
    count: 6,
  },
];

// ============================================================
// Replay runs
// ============================================================

export const replayRuns: ReplayRun[] = [
  {
    id: "rr_1",
    originalInstanceId: "t3",
    sandboxId: "sb_paystack_main",
    flowId: "paystack.charge",
    startedAt: "2026-05-24T07:55:00Z",
    durationMs: 2140,
    reproduced: true,
    fixValidated: true,
    diffSummary: "Reproduced card_declined. Fallback to bank transfer succeeded on retry.",
  },
  {
    id: "rr_2",
    originalInstanceId: "t9",
    sandboxId: "sb_mpesa_kenya",
    flowId: "mpesa.stk_push",
    startedAt: "2026-05-24T06:30:00Z",
    durationMs: 18900,
    reproduced: true,
    fixValidated: false,
    diffSummary: "Reproduced pin_timeout. Auto-retry hit cap. Needs Paybill fallback wired.",
  },
  {
    id: "rr_3",
    originalInstanceId: "t14",
    sandboxId: "sb_mono_kyc",
    flowId: "mono.kyc_tier2",
    startedAt: "2026-05-23T20:11:00Z",
    durationMs: 22400,
    reproduced: true,
    fixValidated: true,
    diffSummary: "Reproduced id_mismatch. Alternate-ID fallback verified.",
  },
  {
    id: "rr_4",
    originalInstanceId: "t21",
    sandboxId: "sb_paystack_main",
    flowId: "paystack.charge",
    startedAt: "2026-05-23T15:08:00Z",
    durationMs: 1980,
    reproduced: false,
    fixValidated: null,
    diffSummary: "Could not reproduce: original used pk_live_*, sandbox using pk_test_*. Check env.",
  },
];

// ============================================================
// Code repository connections (provider-agnostic)
// ============================================================

export const repoProviderMeta: Record<RepoProvider, { label: string; auth: string; mrLabel: string }> = {
  github: { label: "GitHub", auth: "GitHub App", mrLabel: "Open pull request" },
  gitlab: { label: "GitLab", auth: "Personal access token", mrLabel: "Open merge request" },
  bitbucket: { label: "Bitbucket", auth: "OAuth 2.0", mrLabel: "Open pull request" },
};

export const repoConnections: RepoConnection[] = [
  { id: "rc_gh_acme", provider: "github", account: "acme-fintech", status: "connected", lastSyncedAt: "2026-05-24T07:00:00Z", repoCount: 12 },
  { id: "rc_gl_payments", provider: "gitlab", account: "payments-platform", status: "connected", lastSyncedAt: "2026-05-23T18:14:00Z", repoCount: 5 },
  { id: "rc_bb_legacy", provider: "bitbucket", account: "acme-legacy", status: "needs_reauth", lastSyncedAt: "2026-05-12T11:00:00Z", repoCount: 3 },
];

export const repositories: Repository[] = [
  { id: "r1", connectionId: "rc_gh_acme", provider: "github", fullName: "acme-fintech/checkout-api", defaultBranch: "main", language: "TypeScript", framework: "Express", mappedSandboxIds: ["sb_paystack_main"] },
  { id: "r2", connectionId: "rc_gh_acme", provider: "github", fullName: "acme-fintech/mobile-app", defaultBranch: "main", language: "TypeScript", framework: "React Native", mappedSandboxIds: [] },
  { id: "r3", connectionId: "rc_gl_payments", provider: "gitlab", fullName: "payments-platform/mpesa-bridge", defaultBranch: "main", language: "Go", framework: "Chi", mappedSandboxIds: ["sb_mpesa_kenya"] },
  { id: "r4", connectionId: "rc_bb_legacy", provider: "bitbucket", fullName: "acme-legacy/kyc-worker", defaultBranch: "master", language: "Python", framework: "FastAPI", mappedSandboxIds: ["sb_mono_kyc"] },
];

export function getRepoConnection(id: string): RepoConnection | undefined {
  return repoConnections.find((c) => c.id === id);
}
