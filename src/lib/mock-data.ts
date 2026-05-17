export type TxStatus = "successful" | "failed" | "pending" | "reversed";
export type WebhookStatus = "delivered" | "failed" | "pending" | "retrying";

export interface Provider {
  id: string;
  name: string;
  type: string;
  country: string;
  status: "active" | "degraded" | "inactive";
  operations: string[];
  reliability: number;
}

export const providers: Provider[] = [
  { id: "p1", name: "Mock Bank NG", type: "Bank", country: "Nigeria", status: "active", operations: ["Transfer", "Balance", "Verify"], reliability: 99.2 },
  { id: "p2", name: "Choice Bank Simulator", type: "Bank", country: "Kenya", status: "active", operations: ["Transfer", "Balance"], reliability: 97.4 },
  { id: "p3", name: "M-Pesa Simulator", type: "Mobile Money", country: "Kenya", status: "degraded", operations: ["STK Push", "B2C", "C2B"], reliability: 88.1 },
  { id: "p4", name: "Paystack Simulator", type: "Payment Gateway", country: "Nigeria", status: "active", operations: ["Charge", "Refund", "Webhook"], reliability: 95.6 },
  { id: "p5", name: "Flutterwave Simulator", type: "Payment Gateway", country: "Multi", status: "active", operations: ["Charge", "Transfer", "Webhook"], reliability: 96.8 },
  { id: "p6", name: "Stripe Sandbox Mirror", type: "Payment Gateway", country: "Global", status: "inactive", operations: ["Charge", "Payouts"], reliability: 0 },
];

export interface Scenario {
  id: string;
  name: string;
  provider: string;
  operation: string;
  behavior: string;
  failureRate: number;
  delayMs: number;
  active: boolean;
}

export const scenarios: Scenario[] = [
  { id: "s1", name: "Always successful transfer", provider: "Mock Bank NG", operation: "Transfer", behavior: "Success 200", failureRate: 0, delayMs: 200, active: true },
  { id: "s2", name: "Timeout after 30 seconds", provider: "M-Pesa Simulator", operation: "STK Push", behavior: "Timeout", failureRate: 100, delayMs: 30000, active: true },
  { id: "s3", name: "Pending then successful webhook", provider: "Paystack Simulator", operation: "Charge", behavior: "Pending → Success", failureRate: 0, delayMs: 5000, active: true },
  { id: "s4", name: "Duplicate webhook delivery", provider: "Flutterwave Simulator", operation: "Webhook", behavior: "Duplicate x2", failureRate: 0, delayMs: 800, active: false },
  { id: "s5", name: "Out-of-order webhook events", provider: "Paystack Simulator", operation: "Webhook", behavior: "Reorder", failureRate: 0, delayMs: 1200, active: true },
  { id: "s6", name: "Insufficient funds", provider: "Mock Bank NG", operation: "Transfer", behavior: "Fail 402", failureRate: 100, delayMs: 300, active: true },
  { id: "s7", name: "Account name mismatch", provider: "Choice Bank Simulator", operation: "Verify", behavior: "Fail 422", failureRate: 100, delayMs: 250, active: false },
];

export interface Transaction {
  id: string;
  reference: string;
  provider: string;
  amount: number;
  currency: string;
  status: TxStatus;
  scenario: string;
  createdAt: string;
}

const refs = ["FLW", "PSK", "MPS", "MBN", "CHB"];
const currs = ["NGN", "KES", "USD", "GHS"];
const statuses: TxStatus[] = ["successful", "successful", "successful", "failed", "pending", "reversed"];

export const transactions: Transaction[] = Array.from({ length: 28 }).map((_, i) => {
  const p = providers[i % providers.length];
  const s = scenarios[i % scenarios.length];
  return {
    id: `t${i + 1}`,
    reference: `${refs[i % refs.length]}-${(1000000 + i * 137).toString(36).toUpperCase()}`,
    provider: p.name,
    amount: Math.round((Math.random() * 250000 + 500) * 100) / 100,
    currency: currs[i % currs.length],
    status: statuses[i % statuses.length],
    scenario: s.name,
    createdAt: new Date(Date.now() - i * 1000 * 60 * 17).toISOString(),
  };
});

export interface WebhookDelivery {
  id: string;
  eventId: string;
  url: string;
  status: WebhookStatus;
  attempts: number;
  lastAttempt: string;
  nextRetry: string | null;
  responseCode: number | null;
}

const wstatuses: WebhookStatus[] = ["delivered", "delivered", "failed", "retrying", "pending"];
export const webhooks: WebhookDelivery[] = Array.from({ length: 18 }).map((_, i) => ({
  id: `wh${i + 1}`,
  eventId: `evt_${Math.random().toString(36).slice(2, 10)}`,
  url: `https://api.client${(i % 4) + 1}.dev/webhooks/flowsim`,
  status: wstatuses[i % wstatuses.length],
  attempts: (i % 4) + 1,
  lastAttempt: new Date(Date.now() - i * 1000 * 60 * 9).toISOString(),
  nextRetry: i % 5 === 3 ? new Date(Date.now() + 60_000 * (i + 1)).toISOString() : null,
  responseCode: i % 5 === 2 ? 500 : i % 5 === 4 ? null : 200,
}));

export const failureTrend = Array.from({ length: 14 }).map((_, i) => ({
  day: `D${i + 1}`,
  failed: Math.round(8 + Math.sin(i / 2) * 6 + Math.random() * 4),
  success: Math.round(80 + Math.cos(i / 3) * 12 + Math.random() * 8),
}));

export const topFailing = [
  { provider: "M-Pesa Simulator", failures: 42 },
  { provider: "Paystack Simulator", failures: 27 },
  { provider: "Flutterwave Simulator", failures: 19 },
  { provider: "Mock Bank NG", failures: 8 },
];

export const apiKeys = [
  { id: "k1", name: "Backend service", key: "fs_sk_sandbox_••••3f9a", env: "sandbox", lastUsed: "2 minutes ago", permissions: ["read", "write"] },
  { id: "k2", name: "QA CI runner", key: "fs_sk_staging_••••71be", env: "staging", lastUsed: "1 hour ago", permissions: ["read", "write", "admin"] },
  { id: "k3", name: "Prod sim mirror", key: "fs_sk_prodsim_••••a02c", env: "production-simulation", lastUsed: "yesterday", permissions: ["read"] },
];

export const insights = [
  { tone: "warning", title: "Paystack Simulator timeout spike", body: "23% timeout rate today vs 4% baseline." },
  { tone: "destructive", title: "Webhook 500s", body: "12 webhooks failed due to 500 responses from your endpoint." },
  { tone: "info", title: "Pending transactions stalled", body: "8 transactions stuck in pending for >10 minutes." },
];
