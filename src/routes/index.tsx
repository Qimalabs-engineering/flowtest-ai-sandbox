import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Server,
  Workflow,
  Webhook,
  Activity,
  Brain,
  Sparkles,
  GitBranch,
  Bell,
  Check,
  AlertTriangle,
  PlugZap,
  Eye,
  GitMerge,
  TicketCheck,
  Banknote,
  TimerReset,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingHeader, MarketingFooter } from "@/components/marketing-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FlowSim — Test fintech integrations before they break in production" },
      { name: "description", content: "FlowSim helps fintech teams test integrations, simulate failures, and investigate production incidents — before they cost money." },
      { property: "og:title", content: "FlowSim — Fintech integration sandbox + AI incident copilot" },
      { property: "og:description", content: "Programmable sandbox, real-world failure simulation, and an AI incident copilot for payments, banking, and webhooks." },
    ],
  }),
  component: Landing,
});

const problems = [
  { icon: Server, title: "Fintech sandboxes are too clean", body: "Provider test environments always return 200. Real failures never surface.", tint: "info" },
  { icon: AlertTriangle, title: "Provider failures are hard to reproduce", body: "Timeouts, partial settlements, reversals — they never happen on demand.", tint: "warning" },
  { icon: Webhook, title: "Webhooks fail silently", body: "Duplicate, delayed, or reordered deliveries quietly corrupt your ledger.", tint: "destructive" },
  { icon: GitBranch, title: "Logs, code, Slack, tickets live apart", body: "Engineers context-switch across five tools just to start an investigation.", tint: "primary" },
  { icon: TimerReset, title: "Manual incident response is slow", body: "Hours lost correlating a 500 to the PR that shipped it.", tint: "success" },
] as const;

const tintMap: Record<string, string> = {
  info: "bg-info/10 text-info ring-1 ring-info/20",
  warning: "bg-warning/15 text-warning-foreground ring-1 ring-warning/30",
  destructive: "bg-destructive/10 text-destructive ring-1 ring-destructive/20",
  primary: "bg-primary/10 text-primary ring-1 ring-primary/20",
  success: "bg-success/10 text-success ring-1 ring-success/20",
};

const solutionPoints = [
  "Fintech API simulation",
  "Scenario-based failure testing",
  "Webhook simulation",
  "Transaction timelines",
  "Log and code correlation",
  "AI root cause analysis",
  "Slack, Jira, and ClickUp automation",
];

const steps = [
  { n: 1, title: "Connect your app or use FlowSim APIs", body: "Drop-in SDK or call FlowSim directly from your services." },
  { n: 2, title: "Configure providers & scenarios", body: "Pick simulators, set failure rules, define webhook behavior." },
  { n: 3, title: "Run test transactions & webhook flows", body: "Generate realistic traffic against your integration." },
  { n: 4, title: "Connect logs & GitHub", body: "Wire Datadog, CloudWatch, Sentry, and GitHub for full context." },
  { n: 5, title: "Let Ops Brain investigate & suggest fixes", body: "Get ranked hypotheses, evidence, and auto-created tickets." },
];

const integrations = [
  { name: "Datadog", body: "Pull APM traces and error logs into incidents." },
  { name: "CloudWatch", body: "Stream AWS logs alongside transaction events." },
  { name: "Sentry", body: "Attach matching exceptions to failed transactions." },
  { name: "GitHub", body: "Surface risky commits within the incident window." },
  { name: "Slack", body: "Route alerts to the right channel automatically." },
  { name: "Jira", body: "Open tickets with full evidence pre-attached." },
  { name: "ClickUp", body: "Auto-create tasks for triage and remediation." },
  { name: "PagerDuty", body: "Escalate critical incidents to the right on-call." },
];

const useCases = [
  { icon: Banknote, title: "Test bank transfer integrations" },
  { icon: Webhook, title: "Simulate webhook failures" },
  { icon: TimerReset, title: "Reproduce provider timeouts" },
  { icon: Eye, title: "Investigate failed transactions" },
  { icon: GitMerge, title: "Link incidents to code changes" },
  { icon: TicketCheck, title: "Auto-create Jira / ClickUp tickets" },
];

const plans = [
  { name: "Developer", price: "$0", note: "Solo & evals", features: ["2 providers", "100k simulated tx / mo", "Basic scenarios", "Community support"], cta: "Start free" },
  { name: "Team", price: "$249", note: "/ month", featured: true, features: ["Unlimited providers", "5M simulated tx / mo", "Ops Brain + AI RCA", "Slack / Jira / ClickUp", "Email support"], cta: "Start 14-day trial" },
  { name: "Enterprise", price: "Custom", note: "SLA & SSO", features: ["Dedicated infra", "SAML SSO & audit logs", "Custom providers", "Solutions engineer", "Priority support"], cta: "Talk to sales" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        {/* Grid background */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.35] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
          style={{
            backgroundImage:
              "linear-gradient(to right, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        {/* Glow */}
        <div aria-hidden className="absolute left-1/2 top-[-10%] -z-10 h-[520px] w-[1100px] -translate-x-1/2 rounded-[100%] bg-primary/20 blur-[120px]" />
        <div aria-hidden className="absolute right-[-10%] top-[20%] -z-10 h-[320px] w-[520px] rounded-full bg-info/15 blur-[120px]" />

        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs font-medium backdrop-blur animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-muted-foreground">Now with</span>
            <span className="font-semibold">Ops Brain</span>
            <span className="text-muted-foreground">— AI incident copilot</span>
          </div>

          <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Test fintech integrations{" "}
            <span className="bg-gradient-to-br from-primary via-info to-primary bg-clip-text text-transparent">
              before they break
            </span>{" "}
            in production.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
            FlowSim gives fintech teams a programmable sandbox, real-world failure simulation, and an AI incident copilot for payments, banking, webhooks, and transaction operations.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="shadow-xl shadow-primary/25 hover:-translate-y-0.5 transition-transform">
              <Link to="/signup">Start testing free <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="backdrop-blur bg-card/60">
              <Link to="/app/overview">View live demo</Link>
            </Button>
          </div>

          <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-success" /> No real funds, ever</span>
            <span className="inline-flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-warning" /> Setup in under 5 min</span>
            <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> No credit card required</span>
          </div>

          {/* Code mockup */}
          <div className="relative mx-auto mt-16 max-w-4xl">
            <div aria-hidden className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-primary/30 via-info/20 to-primary/30 opacity-60 blur-2xl" />
            <div className="relative overflow-hidden rounded-xl border bg-[oklch(0.18_0.025_260)] text-left shadow-2xl">
              <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.65_0.22_25)]/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.78_0.16_75)]/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.7_0.17_155)]/60" />
                <span className="ml-3 font-mono text-[11px] text-white/40">~/flowsim · sandbox.sh</span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed text-white/80 md:text-sm">
{`$ `}<span className="text-[oklch(0.75_0.16_75)]">curl</span>{` -X POST https://api.flowsim.dev/v1/transfers \\
  -H `}<span className="text-[oklch(0.7_0.17_155)]">"Authorization: Bearer fs_sk_sandbox_•••"</span>{` \\
  -d `}<span className="text-[oklch(0.7_0.17_155)]">{`'{"provider":"mpesa_sim","amount":2500,"scenario":"timeout_30s"}'`}</span>{`

`}<span className="text-[oklch(0.78_0.16_75)]">→ 504 Gateway Timeout</span>{`  · scenario matched: Timeout after 30 seconds
`}<span className="text-[oklch(0.7_0.17_230)]">→ Ops Brain</span>{` opened `}<span className="text-white">INC-2418</span>{` · evidence: 2 logs, 1 commit, 1 alert`}
              </pre>
            </div>
          </div>

          {/* Logo strip */}
          <div className="mt-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Built to simulate the rails fintech teams rely on
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-semibold text-muted-foreground/70">
              {["Stripe", "M-Pesa", "Paystack", "Flutterwave", "Plaid", "Adyen", "Mambu"].map((n) => (
                <span key={n} className="opacity-80 hover:opacity-100 transition-opacity">{n}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">The problem</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Production becomes your real test environment.</h2>
            <p className="mt-3 text-muted-foreground">Then every failure becomes a 2am incident channel.</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {problems.map((p) => (
              <div
                key={p.title}
                className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tintMap[p.tint]}`}>
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                <div aria-hidden className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-primary/0 blur-2xl transition-all group-hover:bg-primary/10" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="border-b">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-24 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">The solution</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">One platform for simulation and investigation.</h2>
            <p className="mt-4 text-muted-foreground">FlowSim combines a fintech sandbox with an AI incident copilot, so you can reproduce failures and resolve them in the same place.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/signup">Get started</Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/docs">Read the docs</Link></Button>
            </div>
          </div>
          <div className="relative">
            <div aria-hidden className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/15 via-info/10 to-transparent blur-2xl" />
            <ul className="grid gap-2.5 rounded-2xl border bg-card p-3 shadow-lg shadow-primary/5">
              {solutionPoints.map((s) => (
                <li key={s} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-muted/60">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-success/15 text-success ring-1 ring-success/20">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-medium">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Features — bento */}
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Everything you need to harden integrations</h2>
            <p className="mt-3 text-muted-foreground">From simulation to investigation — all on one timeline.</p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-6">
            {/* Big card: Bank & Payment APIs */}
            <div className="group relative col-span-6 overflow-hidden rounded-2xl border bg-card p-7 md:col-span-4">
              <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                <Server className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight">Bank & Payment API simulation</h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">High-fidelity mocks for Bank NG, M-Pesa, Paystack, Flutterwave, and Stripe-style flows — including reversals, partial captures, and settlement delays.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Mock Bank NG", "M-Pesa", "Paystack", "Flutterwave", "Stripe-style"].map((t) => (
                  <span key={t} className="rounded-full border bg-background/70 px-2.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur">{t}</span>
                ))}
              </div>
            </div>

            {/* Scenario engine */}
            <div className="col-span-6 rounded-2xl border bg-card p-7 md:col-span-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-info/10 text-info ring-1 ring-info/20">
                <Workflow className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold tracking-tight">Scenario engine</h3>
              <p className="mt-2 text-sm text-muted-foreground">Compose programmable failures: timeouts, partial captures, mismatches.</p>
            </div>

            {/* Webhook */}
            <div className="col-span-6 rounded-2xl border bg-card p-7 md:col-span-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/15 text-warning-foreground ring-1 ring-warning/30">
                <Webhook className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold tracking-tight">Webhook simulator</h3>
              <p className="mt-2 text-sm text-muted-foreground">Duplicate, delay, reorder, and retry events to harden idempotency.</p>
            </div>

            {/* Ops Brain — dark accent */}
            <div className="relative col-span-6 overflow-hidden rounded-2xl border border-white/10 bg-[oklch(0.18_0.025_260)] p-7 text-white md:col-span-4">
              <div aria-hidden className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-primary/40 blur-3xl" />
              <div aria-hidden className="absolute right-0 bottom-0 h-40 w-40 rounded-full bg-info/30 blur-3xl" />
              <div className="relative flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                  <Brain className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">Ops Brain · AI</span>
              </div>
              <h3 className="relative mt-5 text-xl font-semibold tracking-tight">AI root cause analysis</h3>
              <p className="relative mt-2 max-w-md text-sm text-white/70">Ranked hypotheses with evidence pulled from logs, code, and Slack threads. Get to the cause in minutes, not hours.</p>
              <div className="relative mt-6 space-y-2">
                {[
                  { c: "bg-destructive", t: "Mpesa connector raises TimeoutError after 30s", p: "94%" },
                  { c: "bg-warning", t: "Retry policy disabled in commit 8af201d", p: "71%" },
                  { c: "bg-info", t: "Webhook delivery delayed by 18s", p: "43%" },
                ].map((h) => (
                  <div key={h.t} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs">
                    <span className={`h-2 w-2 rounded-full ${h.c}`} />
                    <span className="flex-1 truncate text-white/85">{h.t}</span>
                    <span className="font-mono text-white/60">{h.p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction timeline */}
            <div className="col-span-6 rounded-2xl border bg-card p-7 md:col-span-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 text-success ring-1 ring-success/20">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold tracking-tight">Transaction timeline</h3>
              <p className="mt-2 text-sm text-muted-foreground">Every request, response, and webhook on one inspectable timeline.</p>
              <div className="mt-5 space-y-2">
                {[
                  { c: "bg-success", t: "12:00:01 · Request sent to Stripe" },
                  { c: "bg-destructive", t: "12:00:31 · HTTP 504 Gateway Timeout" },
                  { c: "bg-primary", t: "12:00:32 · Ops Brain analyzing…" },
                ].map((e) => (
                  <div key={e.t} className="flex items-center gap-3 rounded-lg border bg-background/60 px-3 py-2 text-xs">
                    <span className={`h-2 w-2 rounded-full ${e.c}`} />
                    <span className="font-mono text-muted-foreground">{e.t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* GitHub correlation */}
            <div className="col-span-6 rounded-2xl border bg-card p-7 md:col-span-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                <GitBranch className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold tracking-tight">GitHub + logs correlation</h3>
              <p className="mt-2 text-sm text-muted-foreground">Tie failing transactions to risky commits and deploy windows.</p>
              <div className="mt-5 space-y-2">
                {[
                  { sha: "8af201d", msg: "feat: tighten timeout to 30s", risk: "high" },
                  { sha: "c12e9a4", msg: "refactor: drop retry middleware", risk: "high" },
                  { sha: "21bb730", msg: "chore: bump axios → 1.7", risk: "low" },
                ].map((c) => (
                  <div key={c.sha} className="flex items-center gap-3 rounded-lg border bg-background/60 px-3 py-2 text-xs">
                    <span className="font-mono text-muted-foreground">{c.sha}</span>
                    <span className="flex-1 truncate">{c.msg}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${c.risk === "high" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>{c.risk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sparkles AI */}
            <div className="col-span-6 rounded-2xl border bg-card p-7 md:col-span-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-info/10 text-info ring-1 ring-info/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold tracking-tight">Ops Brain investigation hub</h3>
              <p className="mt-2 text-sm text-muted-foreground">Linking incidents to logs, code, and Slack threads in one view.</p>
            </div>

            {/* Ticketing */}
            <div className="col-span-6 rounded-2xl border bg-card p-7 md:col-span-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/15 text-warning-foreground ring-1 ring-warning/30">
                <Bell className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold tracking-tight">Slack / Jira / ClickUp automation</h3>
              <p className="mt-2 text-sm text-muted-foreground">Auto-route alerts and open tickets with full incident context.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Workflow</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">How it works</h2>
            <p className="mt-3 text-muted-foreground">Five steps from your first simulated transaction to closed ticket.</p>
          </div>

          <div className="relative mt-14">
            <div aria-hidden className="absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {steps.map((s) => (
                <div key={s.n} className="relative rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-info text-primary-foreground font-mono text-sm font-semibold shadow-lg shadow-primary/30 ring-4 ring-background">
                    {s.n}
                  </div>
                  <h3 className="mt-4 text-sm font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Integrations</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Plugs into the tools you already use</h2>
              <p className="mt-3 text-muted-foreground">Bring your observability, code, and ops stack into every incident.</p>
            </div>
            <Button asChild variant="ghost" className="hidden md:inline-flex"><Link to="/app/integrations">Browse all <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </div>
          <div className="mt-10 grid gap-3 md:grid-cols-3 lg:grid-cols-4">
            {integrations.map((i) => (
              <div key={i.name} className="group flex items-start gap-3 rounded-2xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-background ring-1 ring-border text-foreground">
                  <PlugZap className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{i.name}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{i.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Use cases</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">What teams ship with FlowSim</h2>
          </div>
          <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {useCases.map((u) => (
              <div key={u.title} className="flex items-center gap-3 rounded-2xl border bg-card p-4 transition-colors hover:bg-muted/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                  <u.icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium">{u.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Simple, predictable pricing</h2>
            <p className="mt-3 text-muted-foreground">Start free. Scale when your traffic does.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3 md:items-stretch">
            {plans.map((p) => (
              <div
                key={p.name}
                className={
                  p.featured
                    ? "relative rounded-2xl border-2 border-primary bg-card p-8 shadow-2xl shadow-primary/15 md:-translate-y-2"
                    : "relative rounded-2xl border bg-card p-8"
                }
              >
                {p.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-info px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/30">
                    Most popular
                  </span>
                )}
                <h3 className="text-base font-semibold">{p.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight">{p.price}</span>
                  <span className="text-sm text-muted-foreground">{p.note}</span>
                </div>
                <Button asChild className="mt-6 w-full" variant={p.featured ? "default" : "outline"} size="lg">
                  <Link to="/signup">{p.cta}</Link>
                </Button>
                <ul className="mt-6 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="link"><Link to="/pricing">See full pricing <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary via-primary to-info p-12 text-center text-primary-foreground shadow-2xl shadow-primary/30">
            <div aria-hidden className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div aria-hidden className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div aria-hidden className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="relative">
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">Ship payment integrations with confidence.</h2>
              <p className="mx-auto mt-3 max-w-xl text-base text-primary-foreground/85">Simulate the failure. Investigate the incident. Close the ticket — all from FlowSim.</p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90">
                  <Link to="/signup">Start free</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground backdrop-blur">
                  <Link to="/app/overview">View demo dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
