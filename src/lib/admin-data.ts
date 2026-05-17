// Mock data for the Admin Control Panel.

export type Role = "super_admin" | "operator" | "support";

export const currentAdmin = {
  name: "Adaeze Okafor",
  email: "ada@flowsim.dev",
  role: "super_admin" as Role,
  initials: "AO",
};

export const can = (role: Role, action: "destructive" | "write" | "read") => {
  if (role === "super_admin") return true;
  if (role === "operator") return action !== "destructive" ? true : false;
  return action === "read";
};

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: "Free" | "Growth" | "Scale" | "Enterprise";
  environment: "Test Sandbox" | "Staging Mirror" | "Production Replay";
  apiKeyStatus: "active" | "rotating" | "revoked";
  activeScenarios: number;
  tx24h: number;
  status: "active" | "suspended" | "trialing";
  createdAt: string;
  region: string;
  owner: string;
}

export const tenants: Tenant[] = [
  { id: "ten_001", name: "Kuda Fintech", slug: "kuda", plan: "Enterprise", environment: "Production Replay", apiKeyStatus: "active", activeScenarios: 12, tx24h: 48230, status: "active", createdAt: "2024-04-12", region: "NG", owner: "ifeoma@kuda.com" },
  { id: "ten_002", name: "Chipper Cash", slug: "chipper", plan: "Scale", environment: "Staging Mirror", apiKeyStatus: "active", activeScenarios: 8, tx24h: 21044, status: "active", createdAt: "2024-06-02", region: "Multi", owner: "ops@chipper.cash" },
  { id: "ten_003", name: "Wave MM", slug: "wave", plan: "Scale", environment: "Test Sandbox", apiKeyStatus: "rotating", activeScenarios: 4, tx24h: 9180, status: "active", createdAt: "2024-07-19", region: "SN", owner: "platform@wave.com" },
  { id: "ten_004", name: "PiggyVest", slug: "piggy", plan: "Growth", environment: "Production Replay", apiKeyStatus: "active", activeScenarios: 5, tx24h: 6240, status: "active", createdAt: "2024-08-31", region: "NG", owner: "eng@piggyvest.com" },
  { id: "ten_005", name: "Tala", slug: "tala", plan: "Growth", environment: "Test Sandbox", apiKeyStatus: "active", activeScenarios: 3, tx24h: 1820, status: "trialing", createdAt: "2025-01-14", region: "KE", owner: "dev@tala.co" },
  { id: "ten_006", name: "Mono Finance", slug: "mono", plan: "Scale", environment: "Staging Mirror", apiKeyStatus: "revoked", activeScenarios: 0, tx24h: 0, status: "suspended", createdAt: "2024-03-04", region: "NG", owner: "abi@mono.co" },
  { id: "ten_007", name: "Yellow Card", slug: "yellow", plan: "Enterprise", environment: "Production Replay", apiKeyStatus: "active", activeScenarios: 15, tx24h: 33502, status: "active", createdAt: "2024-02-21", region: "Multi", owner: "platform@yellowcard.io" },
  { id: "ten_008", name: "Paga", slug: "paga", plan: "Growth", environment: "Test Sandbox", apiKeyStatus: "active", activeScenarios: 2, tx24h: 740, status: "active", createdAt: "2025-02-08", region: "NG", owner: "infra@paga.com" },
  { id: "ten_009", name: "Lemfi", slug: "lemfi", plan: "Free", environment: "Test Sandbox", apiKeyStatus: "active", activeScenarios: 1, tx24h: 120, status: "trialing", createdAt: "2025-04-02", region: "UK", owner: "tech@lemfi.com" },
];

export interface AdminProvider {
  id: string;
  name: string;
  type: "Bank" | "Mobile Money" | "Gateway" | "Card Processor";
  region: string;
  status: "enabled" | "degraded" | "disabled";
  usage24h: number;
  baseFailureRate: number;
  baseLatencyMs: number;
}

export const adminProviders: AdminProvider[] = [
  { id: "pv_001", name: "Mock Bank NG", type: "Bank", region: "NG", status: "enabled", usage24h: 84210, baseFailureRate: 1.4, baseLatencyMs: 220 },
  { id: "pv_002", name: "Choice Bank Simulator", type: "Bank", region: "KE", status: "degraded", usage24h: 12044, baseFailureRate: 6.8, baseLatencyMs: 1840 },
  { id: "pv_003", name: "M-Pesa Simulator", type: "Mobile Money", region: "KE", status: "enabled", usage24h: 41200, baseFailureRate: 4.1, baseLatencyMs: 900 },
  { id: "pv_004", name: "Paystack Simulator", type: "Gateway", region: "NG", status: "enabled", usage24h: 38240, baseFailureRate: 2.0, baseLatencyMs: 410 },
  { id: "pv_005", name: "Flutterwave Simulator", type: "Gateway", region: "Multi", status: "enabled", usage24h: 51820, baseFailureRate: 1.8, baseLatencyMs: 380 },
  { id: "pv_006", name: "Stripe Sandbox Mirror", type: "Card Processor", region: "Global", status: "disabled", usage24h: 0, baseFailureRate: 0, baseLatencyMs: 0 },
  { id: "pv_007", name: "Wave MM Sim", type: "Mobile Money", region: "SN", status: "enabled", usage24h: 6210, baseFailureRate: 3.2, baseLatencyMs: 720 },
];

export interface AdminScenario {
  id: string;
  name: string;
  scope: "global" | "tenant";
  tenant?: string;
  provider: string;
  condition: string;
  behavior: string;
  duration: string;
  priority: number;
  active: boolean;
  forcedUntil?: string;
}

export const adminScenarios: AdminScenario[] = [
  { id: "sc_g1", name: "Force Choice Bank timeouts", scope: "global", provider: "Choice Bank Simulator", condition: "operation = transfer", behavior: "Timeout 30s", duration: "10m", priority: 100, active: true, forcedUntil: new Date(Date.now() + 8 * 60_000).toISOString() },
  { id: "sc_g2", name: "M-Pesa STK degraded mode", scope: "global", provider: "M-Pesa Simulator", condition: "all", behavior: "+800ms latency", duration: "1h", priority: 70, active: true },
  { id: "sc_g3", name: "Paystack 500 webhook spike", scope: "global", provider: "Paystack Simulator", condition: "event = charge.success", behavior: "20% return 500", duration: "30m", priority: 80, active: false },
  { id: "sc_t1", name: "Kuda — duplicate webhooks", scope: "tenant", tenant: "Kuda Fintech", provider: "Paystack Simulator", condition: "all webhooks", behavior: "Duplicate x2", duration: "ongoing", priority: 60, active: true },
  { id: "sc_t2", name: "Wave — insufficient funds 30%", scope: "tenant", tenant: "Wave MM", provider: "Mock Bank NG", condition: "amount > 1000", behavior: "Fail 402", duration: "ongoing", priority: 50, active: true },
  { id: "sc_t3", name: "Chipper — out-of-order events", scope: "tenant", tenant: "Chipper Cash", provider: "Flutterwave Simulator", condition: "webhooks", behavior: "Reorder", duration: "ongoing", priority: 40, active: false },
];

export interface AdminTransaction {
  id: string;
  reference: string;
  tenant: string;
  provider: string;
  amount: number;
  currency: string;
  status: "successful" | "failed" | "pending" | "reversed";
  scenario: string | null;
  createdAt: string;
  latencyMs: number;
}

const tenantNames = tenants.map((t) => t.name);
const provNames = adminProviders.map((p) => p.name);
const currs = ["NGN", "KES", "USD", "GHS", "ZAR"];
const stats: AdminTransaction["status"][] = ["successful", "successful", "successful", "successful", "failed", "pending", "reversed", "successful"];

export const adminTransactions: AdminTransaction[] = Array.from({ length: 64 }).map((_, i) => {
  const status = stats[i % stats.length];
  return {
    id: `atx_${i + 1}`,
    reference: `FS-${(2_000_000 + i * 73).toString(36).toUpperCase()}`,
    tenant: tenantNames[i % tenantNames.length],
    provider: provNames[i % provNames.length],
    amount: Math.round((Math.random() * 400_000 + 200) * 100) / 100,
    currency: currs[i % currs.length],
    status,
    scenario: i % 3 === 0 ? adminScenarios[i % adminScenarios.length].name : null,
    createdAt: new Date(Date.now() - i * 1000 * 47).toISOString(),
    latencyMs: 120 + Math.round(Math.random() * 1800),
  };
});

export interface AdminIncident {
  id: string;
  title: string;
  severity: "sev1" | "sev2" | "sev3";
  status: "open" | "investigating" | "mitigated" | "resolved";
  affectedTenants: string[];
  provider: string;
  detectedAt: string;
  confidence: number;
  owner: string | null;
  hypothesis: string;
  linkedTx: number;
  linkedLogs: number;
  linkedPRs: number;
}

export const adminIncidents: AdminIncident[] = [
  { id: "inc_4821", title: "Webhook retries exhausted for Paystack charge.success", severity: "sev1", status: "investigating", affectedTenants: ["Kuda Fintech", "PiggyVest", "Yellow Card"], provider: "Paystack Simulator", detectedAt: new Date(Date.now() - 9 * 60_000).toISOString(), confidence: 0.92, owner: "Adaeze O.", hypothesis: "Receiver endpoint returns 500 after deploy 8a2f1c — correlation 0.94 with webhook_delivery_failed spike.", linkedTx: 142, linkedLogs: 318, linkedPRs: 1 },
  { id: "inc_4820", title: "M-Pesa STK push latency spike (p95 4.2s → 11.8s)", severity: "sev2", status: "open", affectedTenants: ["Chipper Cash", "Wave MM"], provider: "M-Pesa Simulator", detectedAt: new Date(Date.now() - 22 * 60_000).toISOString(), confidence: 0.81, owner: null, hypothesis: "Simulator queue backpressure — STK push worker pool saturated.", linkedTx: 88, linkedLogs: 102, linkedPRs: 0 },
  { id: "inc_4819", title: "Duplicate webhook deliveries on Flutterwave charge events", severity: "sev2", status: "mitigated", affectedTenants: ["Chipper Cash"], provider: "Flutterwave Simulator", detectedAt: new Date(Date.now() - 90 * 60_000).toISOString(), confidence: 0.88, owner: "Tunde A.", hypothesis: "Scenario sc_t3 misfiring after migration; idempotency key collision.", linkedTx: 22, linkedLogs: 41, linkedPRs: 2 },
  { id: "inc_4818", title: "Choice Bank transfer 422 surge", severity: "sev3", status: "resolved", affectedTenants: ["Wave MM"], provider: "Choice Bank Simulator", detectedAt: new Date(Date.now() - 6 * 3600_000).toISOString(), confidence: 0.74, owner: "Adaeze O.", hypothesis: "Account name mismatch validator too strict in scenario sc_t2.", linkedTx: 17, linkedLogs: 26, linkedPRs: 1 },
  { id: "inc_4817", title: "Slack notifier rate-limited", severity: "sev3", status: "open", affectedTenants: ["Kuda Fintech"], provider: "—", detectedAt: new Date(Date.now() - 130 * 60_000).toISOString(), confidence: 0.65, owner: null, hypothesis: "Channel #fs-alerts hit Slack tier-2 rate limit at 14:02 UTC.", linkedTx: 0, linkedLogs: 88, linkedPRs: 0 },
];

export interface AdminIntegration {
  id: string;
  name: string;
  kind: "Observability" | "Source Control" | "Comms" | "Issues";
  tenant: string;
  status: "healthy" | "degraded" | "error" | "disabled";
  lastSync: string;
  errors24h: number;
}

export const adminIntegrations: AdminIntegration[] = [
  { id: "ig_1", name: "Datadog", kind: "Observability", tenant: "Kuda Fintech", status: "healthy", lastSync: "12s ago", errors24h: 0 },
  { id: "ig_2", name: "Datadog", kind: "Observability", tenant: "Chipper Cash", status: "degraded", lastSync: "4m ago", errors24h: 12 },
  { id: "ig_3", name: "GitHub", kind: "Source Control", tenant: "Kuda Fintech", status: "healthy", lastSync: "1m ago", errors24h: 0 },
  { id: "ig_4", name: "GitHub", kind: "Source Control", tenant: "Yellow Card", status: "healthy", lastSync: "3m ago", errors24h: 0 },
  { id: "ig_5", name: "Slack", kind: "Comms", tenant: "Kuda Fintech", status: "error", lastSync: "27m ago", errors24h: 41 },
  { id: "ig_6", name: "Slack", kind: "Comms", tenant: "PiggyVest", status: "healthy", lastSync: "1m ago", errors24h: 0 },
  { id: "ig_7", name: "Jira", kind: "Issues", tenant: "Kuda Fintech", status: "healthy", lastSync: "2m ago", errors24h: 0 },
  { id: "ig_8", name: "ClickUp", kind: "Issues", tenant: "Chipper Cash", status: "degraded", lastSync: "8m ago", errors24h: 4 },
  { id: "ig_9", name: "Sentry", kind: "Observability", tenant: "Wave MM", status: "disabled", lastSync: "—", errors24h: 0 },
];

export interface AdminJob {
  id: string;
  type: "webhook.deliver" | "scenario.execute" | "ai.analyze" | "integration.sync" | "retry";
  queue: "default" | "webhooks" | "ai" | "integrations";
  status: "queued" | "running" | "succeeded" | "failed" | "retrying";
  attempts: number;
  nextRun: string | null;
  error: string | null;
  tenant: string;
  enqueuedAt: string;
}

export const adminJobs: AdminJob[] = Array.from({ length: 22 }).map((_, i) => {
  const types: AdminJob["type"][] = ["webhook.deliver", "scenario.execute", "ai.analyze", "integration.sync", "retry"];
  const queues: AdminJob["queue"][] = ["default", "webhooks", "ai", "integrations"];
  const ss: AdminJob["status"][] = ["queued", "running", "succeeded", "failed", "retrying", "running", "succeeded"];
  const s = ss[i % ss.length];
  return {
    id: `job_${10240 + i}`,
    type: types[i % types.length],
    queue: queues[i % queues.length],
    status: s,
    attempts: (i % 4) + (s === "failed" || s === "retrying" ? 2 : 1),
    nextRun: s === "retrying" ? new Date(Date.now() + (i + 1) * 30_000).toISOString() : null,
    error: s === "failed" || s === "retrying" ? "Receiver returned 500 — connection reset" : null,
    tenant: tenantNames[i % tenantNames.length],
    enqueuedAt: new Date(Date.now() - i * 12_000).toISOString(),
  };
});

export const queueDepths = [
  { queue: "default", depth: 12, processed1h: 8420, p95Ms: 180 },
  { queue: "webhooks", depth: 47, processed1h: 22041, p95Ms: 410 },
  { queue: "ai", depth: 3, processed1h: 220, p95Ms: 8200 },
  { queue: "integrations", depth: 9, processed1h: 1804, p95Ms: 640 },
];

export const systemHealth = {
  apiLatencyMs: 142,
  errorRate: 0.42,
  webhookSuccess: 98.6,
  queueBacklog: 71,
  uptime: 99.98,
  components: [
    { name: "Public API", status: "operational", latency: 142 },
    { name: "Webhook Dispatcher", status: "degraded", latency: 410 },
    { name: "Scenario Engine", status: "operational", latency: 36 },
    { name: "Ops Brain (AI)", status: "operational", latency: 1280 },
    { name: "Integration Bus", status: "operational", latency: 220 },
    { name: "Datadog Connector", status: "degraded", latency: 2100 },
    { name: "Slack Connector", status: "down", latency: 0 },
    { name: "Postgres (primary)", status: "operational", latency: 6 },
    { name: "Redis (queues)", status: "operational", latency: 2 },
  ],
};

export const latencySeries = Array.from({ length: 32 }).map((_, i) => ({
  t: `${String(Math.floor(i / 4)).padStart(2, "0")}:${String((i % 4) * 15).padStart(2, "0")}`,
  api: 110 + Math.round(Math.sin(i / 3) * 30 + Math.random() * 24),
  webhook: 320 + Math.round(Math.cos(i / 2) * 80 + Math.random() * 60),
}));

export const txSeries = Array.from({ length: 24 }).map((_, i) => ({
  hour: `${String(i).padStart(2, "0")}:00`,
  success: 2200 + Math.round(Math.sin(i / 3) * 800 + Math.random() * 400),
  failed: 80 + Math.round(Math.cos(i / 4) * 60 + Math.random() * 40),
}));

export const providerReliability = adminProviders
  .filter((p) => p.status !== "disabled")
  .map((p) => ({ name: p.name.replace(" Simulator", "").replace(" Sim", ""), reliability: +(100 - p.baseFailureRate).toFixed(1) }));

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  environment: "all" | "Test Sandbox" | "Staging Mirror" | "Production Replay";
  status: "on" | "off" | "rollout";
  rollout: number;
  owner: string;
}

export const featureFlags: FeatureFlag[] = [
  { id: "ff_1", name: "AI Ops Brain", description: "Cross-source incident investigation and hypothesis ranking.", environment: "all", status: "on", rollout: 100, owner: "Platform" },
  { id: "ff_2", name: "Slack auto-notify", description: "Post incident summaries to tenant-configured Slack channel.", environment: "all", status: "rollout", rollout: 60, owner: "Integrations" },
  { id: "ff_3", name: "GitHub commit correlation", description: "Correlate incidents with recent merges + PRs.", environment: "Staging Mirror", status: "rollout", rollout: 35, owner: "Ops Brain" },
  { id: "ff_4", name: "Production Replay mode", description: "Replay production-shaped failure patterns in a safe sandbox.", environment: "Production Replay", status: "on", rollout: 100, owner: "Core" },
  { id: "ff_5", name: "Auto-create Jira issues", description: "Open Jira tickets for sev1/sev2 incidents.", environment: "all", status: "rollout", rollout: 20, owner: "Integrations" },
  { id: "ff_6", name: "Self-serve impersonation", description: "Allow support role to impersonate tenants.", environment: "all", status: "off", rollout: 0, owner: "Security" },
  { id: "ff_7", name: "Scenario priority engine v2", description: "Deterministic priority resolution across overlapping scenarios.", environment: "Test Sandbox", status: "rollout", rollout: 80, owner: "Scenario" },
];

export interface AuditLog {
  id: string;
  admin: string;
  action: string;
  resource: string;
  resourceId: string;
  tenant: string | null;
  timestamp: string;
  metadata: Record<string, string>;
}

const adminUsers = ["Adaeze O.", "Tunde A.", "Mei L.", "Chinedu K."];
const actions = [
  "tenant.suspend",
  "tenant.api_key.regenerate",
  "scenario.force",
  "scenario.disable",
  "incident.assign",
  "incident.resolve",
  "integration.resync",
  "integration.disable",
  "feature_flag.toggle",
  "tenant.impersonate.start",
  "tenant.impersonate.end",
  "job.retry",
];

export const auditLogs: AuditLog[] = Array.from({ length: 28 }).map((_, i) => ({
  id: `audit_${9000 + i}`,
  admin: adminUsers[i % adminUsers.length],
  action: actions[i % actions.length],
  resource: actions[i % actions.length].split(".")[0],
  resourceId: i % 3 === 0 ? tenants[i % tenants.length].id : `res_${1000 + i}`,
  tenant: i % 3 === 0 ? tenants[i % tenants.length].name : null,
  timestamp: new Date(Date.now() - i * 9 * 60_000).toISOString(),
  metadata: { ip: `10.0.${i % 256}.${(i * 7) % 256}`, ua: "Console/Web" },
}));

export const adminOverview = {
  totalTenants: tenants.length,
  activeTenants: tenants.filter((t) => t.status === "active").length,
  tx24h: adminTransactions.length * 4120,
  failureRate: 2.1,
  webhookSuccess: 98.6,
  activeIncidents: adminIncidents.filter((i) => i.status !== "resolved").length,
  queueBacklog: queueDepths.reduce((a, b) => a + b.depth, 0),
  apiReqPerMin: 4280,
};

export const activityFeed = [
  { id: "a1", kind: "tenant", icon: "tenant", title: "New tenant created", subject: "Lemfi", meta: "Free plan • Test Sandbox", at: "2m ago" },
  { id: "a2", kind: "scenario", icon: "scenario", title: "Global scenario forced", subject: "Force Choice Bank timeouts", meta: "Adaeze O. • duration 10m", at: "6m ago" },
  { id: "a3", kind: "incident", icon: "incident", title: "Sev1 incident detected", subject: "Webhook retries exhausted (Paystack)", meta: "3 tenants affected • confidence 92%", at: "9m ago" },
  { id: "a4", kind: "integration", icon: "integration", title: "Integration connected", subject: "GitHub → Yellow Card", meta: "by Tunde A.", at: "14m ago" },
  { id: "a5", kind: "tenant", icon: "tenant", title: "API key regenerated", subject: "Wave MM", meta: "Adaeze O.", at: "21m ago" },
  { id: "a6", kind: "incident", icon: "incident", title: "Incident mitigated", subject: "Duplicate webhooks (Flutterwave)", meta: "by Tunde A.", at: "38m ago" },
  { id: "a7", kind: "scenario", icon: "scenario", title: "Tenant scenario disabled", subject: "Chipper — out-of-order events", meta: "Mei L.", at: "52m ago" },
];

export const getTenantById = (id: string) => tenants.find((t) => t.id === id);
