import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Webhook, AlertTriangle, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FlowDesigner } from "@/components/flow-designer";
import { getFlowDefinition, stateLabel } from "@/lib/flow-data";

export const Route = createFileRoute("/app/flows/$id")({
  loader: ({ params }) => {
    const def = getFlowDefinition(params.id);
    if (!def) throw notFound();
    return { def };
  },
  component: FlowDetail,
  notFoundComponent: () => (
    <div className="p-8 text-center text-sm text-muted-foreground">Flow definition not found.</div>
  ),
});

function FlowDetail() {
  const { def } = Route.useLoaderData();
  const [scenarioId, setScenarioId] = useState<string>("none");

  const activeScenario = def.failureScenarios.find((s) => s.id === scenarioId);
  const scenarioTransitions = activeScenario
    ? def.transitions.filter((t) => t.scenarioId === activeScenario.id)
    : [];
  const failureStateId = scenarioTransitions[0]?.from;

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
          <Link to="/app/flows"><ArrowLeft className="h-4 w-4 mr-1" /> Back to flows</Link>
        </Button>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="font-mono text-xs text-muted-foreground">{def.id} · {def.apiVersion}</div>
            <h1 className="text-2xl font-semibold tracking-tight">{def.name}</h1>
            <p className="text-sm text-muted-foreground max-w-2xl">{def.description}</p>
          </div>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
            Read-only · editing coming soon
          </span>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b">
          <div>
            <CardTitle className="text-base">Flow graph</CardTitle>
            <p className="text-xs text-muted-foreground">
              Solid = normal transition. Red dashed = failure transition.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Scenario overlay:</span>
            <Select value={scenarioId} onValueChange={setScenarioId}>
              <SelectTrigger className="h-9 w-[260px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <span className="flex items-center gap-2"><EyeOff className="h-3.5 w-3.5" /> No overlay</span>
                </SelectItem>
                {def.failureScenarios.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    <span className="flex items-center gap-2">
                      <Eye className="h-3.5 w-3.5 text-destructive" />
                      {s.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <FlowDesigner
            definition={def}
            scenarioId={activeScenario?.id}
            failureStateId={failureStateId}
          />
        </CardContent>
      </Card>

      {activeScenario && (
        <Card className="border-destructive/30">
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <CardTitle className="text-base">{activeScenario.name}</CardTitle>
              <span className="rounded bg-destructive/10 px-1.5 py-0.5 font-mono text-[10px] text-destructive">
                {activeScenario.providerCode}
              </span>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 p-4 md:grid-cols-2">
            <div className="space-y-2 text-sm">
              <div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Cause</div>
                <p>{activeScenario.cause}</p>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Client-visible symptom</div>
                <p className="text-muted-foreground">{activeScenario.symptom}</p>
              </div>
              {activeScenario.webhookEvent && (
                <div className="flex items-center gap-2 pt-1">
                  <Webhook className="h-3.5 w-3.5 text-info" />
                  <span className="font-mono text-xs">{activeScenario.webhookEvent}</span>
                  <span className="text-xs text-muted-foreground">emitted</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                <Wrench className="h-3 w-3" /> Suggested fixes
              </div>
              <ul className="space-y-2 text-sm">
                {activeScenario.suggestedFixes.map((f, i) => (
                  <li key={i} className="rounded border bg-muted/30 p-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-background px-1.5 py-0.5 text-[10px] uppercase font-medium">{f.kind}</span>
                      <span className="font-medium">{f.title}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{f.detail}</p>
                    <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                      Applies at: {f.appliesToStates.map((s) => stateLabel(def, s)).join(", ")}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b"><CardTitle className="text-base">States ({def.states.length})</CardTitle></CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y text-sm">
              {def.states.map((s) => (
                <li key={s.id} className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className={
                      "h-2 w-2 rounded-full " +
                      (s.kind === "terminal_success" ? "bg-success" :
                       s.kind === "terminal_failure" ? "bg-destructive" :
                       s.kind === "initial" ? "bg-primary" : "bg-muted-foreground")
                    } />
                    <span className="font-medium">{s.label}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{s.id}</span>
                    <span className="ml-auto text-[10px] uppercase text-muted-foreground">{s.kind}</span>
                  </div>
                  {s.description && <p className="ml-4 mt-0.5 text-xs text-muted-foreground">{s.description}</p>}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b"><CardTitle className="text-base">Webhooks ({def.webhooks.length})</CardTitle></CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y text-sm">
              {def.webhooks.map((w) => (
                <li key={w.name} className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <Webhook className="h-3.5 w-3.5 text-info" />
                    <span className="font-mono">{w.name}</span>
                    <span className="ml-auto text-[10px] text-muted-foreground">from {stateLabel(def, w.emittedFrom)}</span>
                  </div>
                  <p className="ml-5 mt-0.5 text-xs text-muted-foreground">{w.description}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
