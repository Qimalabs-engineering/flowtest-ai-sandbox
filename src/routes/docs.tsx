import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Rocket, Code2, Webhook, Brain, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketingHeader, MarketingFooter } from "@/components/marketing-shell";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Docs — FlowSim" },
      { name: "description", content: "FlowSim documentation: quickstart, scenarios, webhooks, and Ops Brain." },
    ],
  }),
  component: DocsPage,
});

const sections = [
  { icon: Rocket, title: "Quickstart", body: "Send your first simulated transaction in under 5 minutes." },
  { icon: Code2, title: "API reference", body: "Endpoints for transfers, providers, scenarios, and webhooks." },
  { icon: Webhook, title: "Webhook simulator", body: "Duplicate, delay, reorder, and replay webhook events." },
  { icon: Brain, title: "Ops Brain", body: "Investigate incidents with logs, code, and AI root cause." },
];

function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingHeader />
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Badge variant="secondary" className="gap-1.5"><BookOpen className="h-3 w-3" /> Docs preview</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">FlowSim documentation</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Full docs are landing soon. In the meantime, here's where you'll find each topic.
          </p>
        </div>
      </section>

      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-14 grid gap-4 md:grid-cols-2">
          {sections.map((s) => (
            <Card key={s.title}>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <CardTitle className="mt-3 text-base">{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{s.body}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Prefer to explore the product?</h2>
          <p className="mt-2 text-muted-foreground">Spin up the dashboard with seeded sandbox data.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button asChild><Link to="/app/overview">Open dashboard <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
            <Button asChild variant="outline"><Link to="/signup">Create an account</Link></Button>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
