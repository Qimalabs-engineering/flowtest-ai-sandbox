import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingHeader, MarketingFooter } from "@/components/marketing-shell";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — FlowSim" },
      { name: "description", content: "Transparent pricing for FlowSim: simulate fintech integrations, investigate incidents, and automate ops tickets." },
      { property: "og:title", content: "FlowSim Pricing" },
      { property: "og:description", content: "Developer, Team, and Enterprise plans for the fintech integration sandbox." },
    ],
  }),
  component: PricingPage,
});

const plans = [
  {
    name: "Developer", price: "$0", note: "Solo & evals",
    features: ["2 simulated providers", "100k simulated tx / mo", "Basic scenario engine", "Webhook simulator (basic)", "Community support"],
    cta: "Start free",
  },
  {
    name: "Team", price: "$249", note: "/ month", featured: true,
    features: ["Unlimited providers", "5M simulated tx / mo", "Advanced scenarios + replay", "Ops Brain + AI root cause", "Slack / Jira / ClickUp automation", "Email + chat support"],
    cta: "Start 14-day trial",
  },
  {
    name: "Enterprise", price: "Custom", note: "SLA & SSO",
    features: ["Dedicated infra & region pinning", "SAML SSO & audit logs", "Custom provider contracts", "Solutions engineer", "99.9% uptime SLA", "Priority support"],
    cta: "Talk to sales",
  },
];

const compare = [
  ["Simulated providers", "2", "Unlimited", "Unlimited"],
  ["Simulated transactions / mo", "100k", "5M", "Custom"],
  ["Scenario engine", "Basic", "Advanced + replay", "Advanced + custom"],
  ["Webhook simulator", "Basic", "Full (reorder, replay)", "Full"],
  ["Ops Brain (AI RCA)", "—", "Included", "Included"],
  ["Slack / Jira / ClickUp", "—", "Included", "Included"],
  ["SSO + audit logs", "—", "—", "Included"],
  ["Support", "Community", "Email + chat", "Priority + SE"],
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingHeader />
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Pricing that scales with your traffic.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Start free. Upgrade when you need Ops Brain, replay, and ticket automation.</p>
        </div>
      </section>

      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-14 grid gap-4 md:grid-cols-3">
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
      </section>

      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">Compare plans</h2>
          <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Feature</th>
                  <th className="px-4 py-3 font-medium">Developer</th>
                  <th className="px-4 py-3 font-medium">Team</th>
                  <th className="px-4 py-3 font-medium">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {compare.map((row) => (
                  <tr key={row[0]} className="border-t">
                    {row.map((cell, i) => (
                      <td key={i} className={i === 0 ? "px-4 py-3 font-medium" : "px-4 py-3 text-muted-foreground"}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
