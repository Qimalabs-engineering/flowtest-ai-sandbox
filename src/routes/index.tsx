import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Waves,
  Server,
  Workflow,
  Webhook,
  Activity,
  ShieldAlert,
  Sparkles,
  Check,
  Github,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FlowSim — Test fintech integrations before they break in production" },
      { name: "description", content: "FlowSim is a programmable sandbox for fintech teams to simulate payment providers, webhooks, failures, retries, and real-world transaction behavior." },
      { property: "og:title", content: "FlowSim — Fintech integration sandbox" },
      { property: "og:description", content: "Simulate banks, payment providers, webhooks, and failures before production." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Server, title: "Bank & Payment API Simulation", body: "Mock real provider behavior — Mock Bank NG, M-Pesa, Paystack, Flutterwave and more." },
  { icon: Workflow, title: "Scenario Engine", body: "Compose programmable scenarios: timeouts, partial failures, account mismatches, reversals." },
  { icon: Webhook, title: "Webhook Simulator", body: "Duplicate, delay, reorder, and retry webhook events to harden your idempotency layer." },
  { icon: Activity, title: "Transaction Timeline", body: "Every request, response, and webhook event captured on a single inspectable timeline." },
  { icon: ShieldAlert, title: "Failure Intelligence", body: "Group failures by root cause across providers and surface anomalies as they happen." },
  { icon: Sparkles, title: "AI Ops Assistant", body: "Ask why a transaction failed or generate a new scenario from a natural-language brief." },
];

const steps = [
  { n: 1, title: "Create a sandbox provider", body: "Pick from prebuilt simulators or define your own provider contract." },
  { n: 2, title: "Configure failure scenarios", body: "Compose rules: failure rate, delay, webhook behavior, trigger conditions." },
  { n: 3, title: "Send test transactions", body: "Hit the FlowSim API from your service exactly like production." },
  { n: 4, title: "Inspect timeline & AI explanation", body: "See what fired, what failed, and why — with an AI summary." },
];

const plans = [
  {
    name: "Starter", price: "$0", note: "For solo devs",
    features: ["2 providers", "100k simulated tx / mo", "Basic scenario engine", "Community support"],
    cta: "Start free",
  },
  {
    name: "Growth", price: "$149", note: "/ month", featured: true,
    features: ["Unlimited providers", "5M simulated tx / mo", "AI assistant", "Webhook replay & reorder", "Email support"],
    cta: "Start 14-day trial",
  },
  {
    name: "Enterprise", price: "Custom", note: "SLA & SSO",
    features: ["Dedicated infra", "Audit logs", "SAML SSO", "Custom providers", "Priority support"],
    cta: "Talk to sales",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Waves className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold">FlowSim</span>
          </Link>
          <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/app">Sign in</Link></Button>
            <Button asChild size="sm"><Link to="/app">Start free</Link></Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,oklch(0.42_0.18_265/.18),transparent_70%)]" />
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28 text-center">
          <Badge variant="secondary" className="mb-5 gap-1.5"><Sparkles className="h-3 w-3" /> Now with AI failure intelligence</Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
            Test fintech integrations <span className="text-primary">before they break</span> in production.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            FlowSim gives fintech teams a programmable sandbox to simulate payment providers, webhooks, failures, retries, and real-world transaction behavior.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg"><Link to="/app">Start Testing <ArrowRight className="ml-1.5 h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/app">View Demo</Link></Button>
          </div>

          <div className="mx-auto mt-14 max-w-4xl rounded-xl border bg-card p-2 shadow-2xl shadow-primary/10">
            <div className="rounded-lg bg-muted/50 p-4 text-left font-mono text-xs leading-relaxed text-muted-foreground">
              <p><span className="text-success">$</span> curl -X POST https://api.flowsim.dev/v1/transfers \</p>
              <p>{"  "}-H "Authorization: Bearer fs_sk_sandbox_•••" \</p>
              <p>{"  "}-d '&#123;"provider":"mpesa_sim","amount":2500,"scenario":"timeout_30s"&#125;'</p>
              <p className="mt-2 text-foreground">{"→ 504 Gateway Timeout · scenario matched: Timeout after 30 seconds"}</p>
              <p className="text-primary">{"→ webhook scheduled · attempt 1 of 5 · backoff 5s"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-b">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">The problem</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Production becomes your real test environment.</h2>
          </div>
          <div className="space-y-4 text-base text-muted-foreground">
            <p>Fintech sandboxes are too clean. They always return 200. They never time out. They never deliver a webhook twice. They never reorder events.</p>
            <p>So failures only show up after launch — in customer complaints, stuck transactions, and 2am incident channels.</p>
            <p className="text-foreground font-medium">FlowSim reproduces the messy parts on demand.</p>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">The solution</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">A programmable sandbox for the failures that matter.</h2>
            <p className="mt-3 text-muted-foreground">Compose scenarios, simulate webhooks, inspect timelines, and let AI explain what went wrong.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-3xl font-semibold tracking-tight">Everything you need to harden integrations</h2>
          <p className="mt-2 text-muted-foreground">Built by engineers who shipped payment rails to millions of users.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
      <section id="how" className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="rounded-xl border bg-card p-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-mono text-sm font-semibold">{s.n}</div>
                <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-b">
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
                    <Link to="/app">{p.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground"><Waves className="h-4 w-4" /></div>
              <span className="text-sm font-semibold">FlowSim</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">A programmable sandbox for fintech integrations.</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Product</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground">Features</a></li>
              <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
              <li><Link to="/app" className="hover:text-foreground">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">About</a></li>
              <li><a href="#" className="hover:text-foreground">Docs</a></li>
              <li><a href="#" className="hover:text-foreground">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 text-xs text-muted-foreground">
            <p>© 2026 FlowSim Labs. All sandbox, no real funds.</p>
            <div className="flex gap-3">
              <a href="#" aria-label="GitHub"><Github className="h-4 w-4" /></a>
              <a href="#" aria-label="Twitter"><Twitter className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
