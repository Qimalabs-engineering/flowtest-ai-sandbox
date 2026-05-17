import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Workflow, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { flowDefinitions, flowInstances, type FlowType } from "@/lib/flow-data";

export const Route = createFileRoute("/app/flows")({
  component: FlowsPage,
});

const flowTypeLabel: Record<FlowType, string> = {
  money_movement: "Money movement",
  account_funding: "Account funding",
  identity_verification: "Identity verification",
};

function FlowsPage() {
  const [ft, setFt] = useState<string>("all");
  const filtered = flowDefinitions.filter((f) => ft === "all" || f.flowType === ft);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <Workflow className="h-5 w-5 text-primary" /> Flows
        </h1>
        <p className="text-sm text-muted-foreground">
          Production-faithful flow definitions. Each mirrors the real provider's state machine, events, and failure modes.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={ft} onValueChange={setFt}>
          <SelectTrigger className="h-9 w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All flow types</SelectItem>
            <SelectItem value="money_movement">Money movement</SelectItem>
            <SelectItem value="account_funding">Account funding</SelectItem>
            <SelectItem value="identity_verification">Identity verification</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((def) => {
          const instances = flowInstances.filter((i) => i.flowDefinitionId === def.id);
          const failures = instances.filter((i) => i.outcome === "failed").length;
          return (
            <Card key={def.id} className="fs-card-hover overflow-hidden">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-mono text-muted-foreground">{def.id}</div>
                    <h3 className="text-base font-semibold leading-tight mt-0.5">{def.name}</h3>
                  </div>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                    {flowTypeLabel[def.flowType]}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{def.description}</p>
                <div className="grid grid-cols-4 gap-2 border-y py-2 text-xs">
                  <Stat label="States" value={def.states.length} />
                  <Stat label="Scenarios" value={def.failureScenarios.length} />
                  <Stat label="Instances" value={instances.length} />
                  <Stat label="Failures" value={failures} tone={failures > 0 ? "destructive" : undefined} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{def.provider} · {def.apiVersion}</span>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/app/flows/$id" params={{ id: def.id }}>Open</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "destructive" }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`text-sm font-semibold font-mono ${tone === "destructive" ? "text-destructive" : ""}`}>{value}</div>
    </div>
  );
}
