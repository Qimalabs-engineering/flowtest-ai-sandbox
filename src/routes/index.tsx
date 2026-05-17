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
  ListChecks,
  Eye,
  GitMerge,
  TicketCheck,
  Banknote,
  TimerReset,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  { icon: Server, title: "Fintech sandboxes are too clean", body: "Provider test environments always return 200. Real failures never surface." },
  { icon: AlertTriangle, title: "Provider failures are hard to reproduce", body: "Timeouts, partial settlements, reversals — they never happen on demand." },
  { icon: Webhook, title: "Webhooks fail silently", body: "Duplicate, delayed, or reordered deliveries quietly corrupt your ledger." },
  { icon: GitBranch, title: "Logs, code, Slack, and tickets live apart", body: "Engineers context-switch across five tools just to start an investigation." },
  { icon: TimerReset, title: "Manual incident response is slow", body: "Hours lost correlating a 500 to the PR that shipped it." },
];

const solutionPoints = [
  "Fintech API simulation",
  "Scenario-based failure testing",
  "Webhook simulation",
  "Transaction timelines",
  "Log and code correlation",
  "AI root cause analysis",
  "Slack, Jira, and ClickUp automation",
];

const features = [
  { icon: Server, title: "Bank & Payment API Simulation", body: "Mock Bank NG, M-Pesa, Paystack, Flutterwave, Stripe-style flows." },
  { icon: Workflow, title: "Scenario Engine", body: "Compose programmable failures: timeouts, partial captures, mismatches." },
  { icon: Webhook, title: "Webhook Simulator", body: "Duplicate, delay, reorder, and retry events to harden idempotency." },
  { icon: Activity, title: "Transaction Timeline", body: "Every request, response, and webhook on one inspectable timeline." },
  { icon: Brain, title: "Ops Brain", body: "Investigation hub linking incidents to logs, code, and Slack threads." },
  { icon: Sparkles, title: "AI Root Cause Analysis", body: "Ranked hypotheses with evidence pulled from across your stack." },
  { icon: GitBranch, title: "GitHub + Logs Correlation", body: "Tie failing transactions to risky commits and deploy windows." },
  { icon: Bell, title: "Slack / Jira / ClickUp Automation", body: "Auto-route alerts and open tickets with full incident context." },
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
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,oklch(0.42_0.18_265/.18),transparent_70%)]" />
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28 text-center">
          <Badge variant="secondary" className="mb-5 gap-1.5"><Sparkles className="h-3 w-3" /> Now with Ops Brain — AI incident copilot</Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
            Test fintech integrations <span className="text-primary">before they break</span> in production.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            FlowSim gives fintech teams a programmable sandbox, real-world failure simulation, and an AI incident copilot for payments, banking, webhooks, and transaction operations.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg"><Link to="/signup">Start Testing <ArrowRight className="ml-1.5 h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/app/overview">View Demo</Link></Button>
          </div>

          <div className="mx-auto mt-14 max-w-4xl rounded-xl border bg-card p-2 shadow-2xl shadow-primary/10">
            <div className="rounded-lg bg-muted/50 p-4 text-left font-mono text-xs leading-relaxed text-muted-foreground">
              <p><span className="text-success">$</span> curl -X POST https://api.flowsim.dev/v1/transfers \</p>
              <p>{"  "}-H "Authorization: Bearer fs_sk_sandbox_•••" \</p>
              <p>{"  "}-d '&#123;"provider":"mpesa_sim","amount":2500,"scenario":"timeout_30s"&#125;'</p>
              <p className="mt-2 text-foreground">{"→ 504 Gateway Timeout · scenario matched: Timeout after 30 seconds"}</p>
              <p className="text-primary">{"→ Ops Brain opened incident INC-2418 · evidence: 2 logs, 1 commit, 1 alert"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">The problem</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Production becomes your real test environment.</h2>
            <p className="mt-3 text-muted-foreground">Then every failure becomes a 2am incident channel.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {problems.map((p) => (
              <Card key={p.title}>
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-destructive/10 text-destructive">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-3 text-base">{p.title}</CardTitle>
                </CardHeader>
                <CardContent><CardDescription className="text-sm">{p.body}</CardDescription></CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">The solution</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">One platform for simulation and investigation.</h2>
            <p className="mt-3 text-muted-foreground">FlowSim combines a fintech sandbox with an AI incident copilot, so you can reproduce failures and resolve them in the same place.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild><Link to="/signup">Get started</Link></Button>
              <Button asChild variant="outline"><Link to="/docs">Read the docs</Link></Button>
            </div>
          </div>
          <ul className="space-y-3">
            {solutionPoints.map((s) => (
              <li key={s} className="flex items-start gap-3 rounded-md border bg-card p-3 text-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary"><Check className="h-3.5 w-3.5" /></div>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Features */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-3xl font-semibold tracking-tight">Everything you need to harden integrations</h2>
          <p className="mt-2 text-muted-foreground">From simulation to investigation, on one timeline.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <Card key={f.title}>
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-3 text-base">{f.title}</CardTitle>
                </CardHeader>
                <CardContent><CardDescription className="text-sm">{f.body}</CardDescription></CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {steps.map((s) => (
              <div key={s.n} className="rounded-xl border bg-card p-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-mono text-sm font-semibold">{s.n}</div>
                <h3 className="mt-4 text-sm font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Plugs into the tools you already use</h2>
              <p className="mt-2 text-muted-foreground">Bring your observability, code, and ops stack into every incident.</p>
            </div>
            <Button asChild variant="ghost" className="hidden md:inline-flex"><Link to="/app/integrations">Browse all <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </div>
          <div className="mt-10 grid gap-3 md:grid-cols-3 lg:grid-cols-4">
            {integrations.map((i) => (
              <div key={i.name} className="flex items-start gap-3 rounded-xl border bg-card p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-foreground">
                  <PlugZap className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{i.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{i.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-3xl font-semibold tracking-tight">Use cases</h2>
          <p className="mt-2 text-muted-foreground">What teams ship with FlowSim.</p>
          <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {useCases.map((u) => (
              <div key={u.title} className="flex items-center gap-3 rounded-xl border bg-card p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <u.icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium">{u.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Simple, predictable pricing</h2>
            <p className="mt-2 text-muted-foreground">Start free. Scale when your traffic does.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {plans.map((p) => (
              <Card key={p.name} className={p.featured ? "border-primary shadow-lg shadow-primary/10 relative" : ""}>
                {p.featured && <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2">Most popular</Badge>}
                <CardHeader>
                  <CardTitle>{p.name}</CardTitle>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-semibold">{p.price}</span>
                    <span className="text-sm text-muted-foreground">{p.note}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 text-success" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full" variant={p.featured ? "default" : "outline"}>
                    <Link to="/signup">{p.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button asChild variant="link"><Link to="/pricing">See full pricing <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <ListChecks className="mx-auto h-8 w-8 text-primary" />
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">Ship payment integrations with confidence.</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Simulate the failure. Investigate the incident. Close the ticket — all from FlowSim.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg"><Link to="/signup">Start free</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/app/overview">View demo dashboard</Link></Button>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
