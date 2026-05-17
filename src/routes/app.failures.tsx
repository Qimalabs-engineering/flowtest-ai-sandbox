import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, BookOpen, Activity, ArrowRight, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  flowDefinitions,
  failureClusters,
  getFlowDefinition,
  findScenario,
  stateLabel,
} from "@/lib/flow-data";

export const Route = createFileRoute("/app/failures")({
  component: FailuresPage,
});

function FailuresPage() {
  const [tab, setTab] = useState("live");
  const clusters = failureClusters();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <AlertTriangle className="h-5 w-5 text-destructive" /> Failures
        </h1>
        <p className="text-sm text-muted-foreground">
          Every failure tied to where it broke, why, and what to do about it.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="live">
            <Activity className="h-3.5 w-3.5 mr-1" /> Live ({clusters.length})
          </TabsTrigger>
          <TabsTrigger value="catalog">
            <BookOpen className="h-3.5 w-3.5 mr-1" /> Catalog
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-3 mt-4">
          {clusters.length === 0 && (
            <div className="rounded-lg border border-dashed bg-muted/30 p-8 text-center text-sm text-muted-foreground">
              No live failures. Everything is green.
            </div>
          )}
          {clusters.map((c, i) => {
            const def = getFlowDefinition(c.flowDefinitionId);
            const scenario = def ? findScenario(def, c.scenarioId) : undefined;
            if (!def || !scenario) return null;
            return (
              <Card key={i} className="border-destructive/30">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-xs font-mono font-semibold text-destructive">
                          {c.count}×
                        </span>
                        <span className="font-medium">{scenario.name}</span>
                        <span className="font-mono text-[11px] text-muted-foreground">{scenario.providerCode}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                        <span>{def.name}</span>
                        <ArrowRight className="h-3 w-3" />
                        <span>Failed at</span>
                        <span className="font-mono text-foreground">{stateLabel(def, c.atState)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{scenario.symptom}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-[10px] text-muted-foreground">
                        latest {new Date(c.latest).toLocaleTimeString()}
                      </span>
                      <div className="flex gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link to="/app/flows/$id" params={{ id: def.id }} search={{ scenario: c.scenarioId } as never}>
                            <Eye className="h-3.5 w-3.5 mr-1" /> Preview
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="catalog" className="mt-4 space-y-4">
          {flowDefinitions.map((def) => (
            <Card key={def.id}>
              <CardHeader className="border-b py-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-sm">{def.name}</CardTitle>
                    <p className="font-mono text-[10px] text-muted-foreground">{def.id}</p>
                  </div>
                  <Button asChild size="sm" variant="ghost">
                    <Link to="/app/flows/$id" params={{ id: def.id }}>Open flow</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y text-sm">
                  {def.failureScenarios.map((s) => {
                    const tx = def.transitions.find((t) => t.scenarioId === s.id);
                    return (
                      <li key={s.id} className="grid gap-3 px-4 py-3 md:grid-cols-[1fr_auto]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{s.name}</span>
                            <span className="rounded bg-destructive/10 px-1.5 py-0.5 font-mono text-[10px] text-destructive">
                              {s.providerCode}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">{s.cause}</p>
                          {tx && (
                            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                              At {stateLabel(def, tx.from)} → fires {tx.event}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
