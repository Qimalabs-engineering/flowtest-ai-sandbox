import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, AlertTriangle, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { flowDefinitions, stateLabel } from "@/lib/flow-data";

interface ScenarioRow {
  flowId: string;
  flowName: string;
  provider: string;
  id: string;
  name: string;
  providerCode: string;
  cause: string;
  atStates: string[];
  webhookEvent?: string;
  fixCount: number;
}

function allScenarios(): ScenarioRow[] {
  const out: ScenarioRow[] = [];
  for (const f of flowDefinitions) {
    for (const s of f.failureScenarios) {
      const atStates = f.transitions.filter((t) => t.scenarioId === s.id).map((t) => stateLabel(f, t.from));
      out.push({
        flowId: f.id,
        flowName: f.name,
        provider: f.provider,
        id: s.id,
        name: s.name,
        providerCode: s.providerCode,
        cause: s.cause,
        atStates: Array.from(new Set(atStates)),
        webhookEvent: s.webhookEvent,
        fixCount: s.suggestedFixes.length,
      });
    }
  }
  return out;
}

export const Route = createFileRoute("/app/scenarios")({
  component: ScenariosPage,
});

function ScenariosPage() {
  const [q, setQ] = useState("");
  const rows = allScenarios();
  const filtered = rows.filter((r) => {
    if (!q) return true;
    const needle = q.toLowerCase();
    return r.name.toLowerCase().includes(needle)
      || r.provider.toLowerCase().includes(needle)
      || r.providerCode.toLowerCase().includes(needle)
      || r.flowName.toLowerCase().includes(needle);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Scenarios</h1>
        <p className="text-sm text-muted-foreground">
          Real provider failure modes you can replay against any sandbox. Each one is a first-class object: cause, code, where it strikes, and the fixes that resolve it.
        </p>
      </div>

      <Card>
        <CardContent className="p-3">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search scenarios, codes, providers…" className="pl-8 h-9" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 && (
          <Card className="sm:col-span-2 lg:col-span-3">
            <CardContent className="py-12 text-center text-sm text-muted-foreground">No scenarios match.</CardContent>
          </Card>
        )}
        {filtered.map((s) => (
          <Card key={`${s.flowId}-${s.id}`} className="group flex flex-col">
            <CardContent className="flex flex-1 flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-tight">{s.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.provider} · {s.flowName}</p>
                </div>
                <Badge variant="outline" className="border-destructive/40 text-destructive font-mono text-xs whitespace-nowrap">
                  {s.providerCode}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-3">{s.cause}</p>

              <div className="flex flex-wrap items-center gap-1.5">
                {s.atStates.map((st) => (
                  <span key={st} className="inline-flex items-center gap-1 rounded-md border bg-muted/40 px-2 py-0.5 text-[10px]">
                    <AlertTriangle className="h-3 w-3 text-destructive" /> {st}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between border-t pt-3 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  {s.webhookEvent && <Badge variant="secondary" className="font-mono text-[10px]">{s.webhookEvent}</Badge>}
                  <span className="text-muted-foreground">{s.fixCount} fix{s.fixCount === 1 ? "" : "es"}</span>
                </div>
                <Button asChild size="sm" variant="ghost" className="-mr-2">
                  <Link to="/app/flows/$id" params={{ id: s.flowId }}>
                    Open flow <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
