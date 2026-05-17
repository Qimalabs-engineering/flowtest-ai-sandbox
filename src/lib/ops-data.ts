export type ConnStatus = "connected" | "not_connected" | "error";
export type IntegrationCategory = "Observability" | "Code" | "Communication" | "Issue Tracking";

export interface Integration {
  id: string;
  name: string;
  category: IntegrationCategory;
  description: string;
  status: ConnStatus;
  lastSynced: string | null;
  initials: string;
  accent: string; // tailwind bg class
}

export const integrations: Integration[] = [
  { id: "datadog", name: "Datadog", category: "Observability", description: "Logs, metrics, traces and APM for fintech services.", status: "connected", lastSynced: "2m ago", initials: "DD", accent: "bg-[#632ca6]" },
  { id: "newrelic", name: "New Relic", category: "Observability", description: "Full-stack observability for transaction flows.", status: "not_connected", lastSynced: null, initials: "NR", accent: "bg-[#008c99]" },
  { id: "grafana", name: "Grafana Cloud", category: "Observability", description: "Dashboards and alerting on simulated traffic.", status: "connected", lastSynced: "14m ago", initials: "GC", accent: "bg-[#f46800]" },
  { id: "sentry", name: "Sentry", category: "Observability", description: "Exception tracking from SDKs and webhooks.", status: "error", lastSynced: "1h ago", initials: "SE", accent: "bg-[#362d59]" },
  { id: "cloudwatch", name: "CloudWatch", category: "Observability", description: "AWS log groups and custom metrics.", status: "not_connected", lastSynced: null, initials: "CW", accent: "bg-[#e7157b]" },
  { id: "opensearch", name: "OpenSearch / ELK", category: "Observability", description: "Index sandbox logs for ad-hoc queries.", status: "connected", lastSynced: "30m ago", initials: "OS", accent: "bg-[#005eb8]" },

  { id: "github", name: "GitHub", category: "Code", description: "Repos, PRs and deploy events for regression hunting.", status: "connected", lastSynced: "just now", initials: "GH", accent: "bg-[#1f2328]" },
  { id: "gitlab", name: "GitLab", category: "Code", description: "Pipelines, MRs and protected branches.", status: "not_connected", lastSynced: null, initials: "GL", accent: "bg-[#fc6d26]" },
  { id: "bitbucket", name: "Bitbucket", category: "Code", description: "Workspace repos and pull requests.", status: "not_connected", lastSynced: null, initials: "BB", accent: "bg-[#2684ff]" },

  { id: "slack", name: "Slack", category: "Communication", description: "Send incident alerts and AI hypotheses to channels.", status: "connected", lastSynced: "1m ago", initials: "SL", accent: "bg-[#4a154b]" },
  { id: "teams", name: "Microsoft Teams", category: "Communication", description: "Post adaptive cards into incident channels.", status: "not_connected", lastSynced: null, initials: "MT", accent: "bg-[#4b53bc]" },

  { id: "jira", name: "Jira", category: "Issue Tracking", description: "Auto-create issues from incidents.", status: "connected", lastSynced: "5m ago", initials: "JR", accent: "bg-[#0052cc]" },
  { id: "clickup", name: "ClickUp", category: "Issue Tracking", description: "Sync tasks with priority mapping.", status: "not_connected", lastSynced: null, initials: "CU", accent: "bg-[#7b68ee]" },
  { id: "linear", name: "Linear", category: "Issue Tracking", description: "Create issues with severity to priority mapping.", status: "connected", lastSynced: "9m ago", initials: "LN", accent: "bg-[#5e6ad2]" },
];

export type Severity = "critical" | "high" | "medium" | "low";
export type IncidentStatus = "investigating" | "monitoring" | "resolved" | "open";

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  provider: string;
  service: string;
  environment: string;
  detectedAt: string;
  status: IncidentStatus;
  confidence: number;
  linkedRef: string;
  source: string;
}

export const incidents: Incident[] = [
  {
    id: "inc-2041",
    title: "Transfer timeout spike on Choice Bank simulator",
    severity: "high",
    provider: "Choice Bank Simulator",
    service: "transfer-processor",
    environment: "sandbox",
    detectedAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    status: "investigating",
    confidence: 0.92,
    linkedRef: "a8f91c2",
    source: "Datadog · APM",
  },
  {
    id: "inc-2040",
    title: "Webhook delivery failures after recent deploy",
    severity: "critical",
    provider: "Paystack Simulator",
    service: "webhook-dispatcher",
    environment: "staging",
    detectedAt: new Date(Date.now() - 1000 * 60 * 47).toISOString(),
    status: "investigating",
    confidence: 0.86,
    linkedRef: "PR #482",
    source: "Sentry",
  },
  {
    id: "inc-2039",
    title: "Account name mismatch increased for NGN transfers",
    severity: "medium",
    provider: "Mock Bank NG",
    service: "name-verify",
    environment: "sandbox",
    detectedAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    status: "monitoring",
    confidence: 0.71,
    linkedRef: "d1c44ab",
    source: "Grafana Cloud",
  },
  {
    id: "inc-2038",
    title: "Pending transactions not resolving after callback delay",
    severity: "high",
    provider: "M-Pesa Simulator",
    service: "callback-reconciler",
    environment: "sandbox",
    detectedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    status: "open",
    confidence: 0.78,
    linkedRef: "f02b9e1",
    source: "OpenSearch",
  },
  {
    id: "inc-2037",
    title: "Elevated 5xx from idempotency cache",
    severity: "low",
    provider: "Flutterwave Simulator",
    service: "idempotency-cache",
    environment: "staging",
    detectedAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
    status: "resolved",
    confidence: 0.64,
    linkedRef: "c91aa07",
    source: "Datadog",
  },
];

export const opsSummary = {
  activeIncidents: 4,
  regressions: 2,
  failedTxLinked: 318,
  openTickets: 7,
  connectedIntegrations: integrations.filter((i) => i.status === "connected").length,
  investigationsCompleted: 26,
  autoIssues: 11,
};

export const sampleLogs = [
  { ts: "12:04:18.214", service: "transfer-processor", level: "ERROR", trace: "9ab21f", msg: "Upstream timeout after 10000ms calling choice-bank-sim/transfer" },
  { ts: "12:04:18.012", service: "transfer-processor", level: "WARN", trace: "9ab21f", msg: "Retry attempt 2/2 — provider unresponsive" },
  { ts: "12:04:17.901", service: "transfer-processor", level: "INFO", trace: "9ab21f", msg: "Initiating transfer ref FLW-XK9Q amount 12500 NGN" },
  { ts: "12:03:52.741", service: "webhook-dispatcher", level: "ERROR", trace: "771ace", msg: "Webhook POST returned 500 from customer endpoint" },
  { ts: "12:03:14.503", service: "transfer-processor", level: "ERROR", trace: "5fa2b1", msg: "Upstream timeout after 10000ms calling choice-bank-sim/transfer" },
];

export const linkedCommit = {
  repo: "fintech/payments-core",
  pr: "Reduce provider timeout window for retry budget",
  commit: "a8f91c2",
  author: "ada.iro",
  files: ["src/providers/choice-bank/client.ts", "config/timeouts.yaml"],
  risk: 78,
  summary: "Lowered upstream HTTP timeout from 30s to 10s and capped retries at 2 to enforce SLO budget.",
};

export const suggestedFixes = [
  { id: "f1", title: "Revert commit a8f91c2", confidence: 0.91, reason: "Highest correlation with failure spike onset.", impact: "Restores prior 30s timeout. Eliminates regression within 2m.", level: "high" },
  { id: "f2", title: "Increase provider timeout to 25s", confidence: 0.74, reason: "Choice Bank p99 latency is 18.4s today.", impact: "Reduces timeout errors by ~85%.", level: "medium" },
  { id: "f3", title: "Add exponential retry backoff", confidence: 0.68, reason: "Bursty retries amplify upstream pressure.", impact: "Smooths load, modest latency tradeoff.", level: "medium" },
  { id: "f4", title: "Create reconciliation job for stuck transactions", confidence: 0.62, reason: "8 transactions stuck in pending >10m.", impact: "Auto-resolves dangling state every 5m.", level: "low" },
  { id: "f5", title: "Add alert threshold for >5% timeout rate", confidence: 0.58, reason: "Current detection lagged by 11m.", impact: "Cuts MTTD by ~70%.", level: "low" },
];

export const evidenceTimeline = [
  { ts: "12:01:02", kind: "deploy", title: "Deploy payments-core v4.21.0 to sandbox", source: "GitHub Actions" },
  { ts: "12:01:14", kind: "commit", title: "Commit a8f91c2 — reduce provider timeout", source: "GitHub" },
  { ts: "12:03:48", kind: "log", title: "Datadog log spike: upstream timeout x214", source: "Datadog" },
  { ts: "12:04:01", kind: "tx", title: "Failed transactions surge: 38 in 60s", source: "FlowSim" },
  { ts: "12:04:33", kind: "slack", title: "Slack alert posted to #fintech-incidents", source: "Slack" },
  { ts: "12:05:10", kind: "issue", title: "Jira FNT-1284 created — High severity", source: "Jira" },
];

export const githubRepos = [
  { repo: "fintech/payments-core", branches: ["main", "release/4.21"], service: "transfer-processor", lastDeploy: "12 min ago", risky: 2 },
  { repo: "fintech/webhook-dispatcher", branches: ["main"], service: "webhook-dispatcher", lastDeploy: "3 hours ago", risky: 1 },
  { repo: "fintech/name-verify", branches: ["main", "feat/fuzzy-match"], service: "name-verify", lastDeploy: "yesterday", risky: 0 },
];

export const ddServices = [
  { name: "transfer-processor", index: "logs-prod-payments", env: "sandbox", errors: 214, latencyMs: 18420 },
  { name: "webhook-dispatcher", index: "logs-prod-webhooks", env: "sandbox", errors: 47, latencyMs: 932 },
  { name: "name-verify", index: "logs-prod-verify", env: "sandbox", errors: 12, latencyMs: 410 },
];
