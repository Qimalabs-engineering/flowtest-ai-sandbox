import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, X } from "lucide-react";
import { FixValidationBadge } from "@/components/fix-validation-badge";
import { stateLabel, type FlowDefinition, type FlowInstance } from "@/lib/flow-data";
import type { ReplayRun } from "@/lib/sandbox-data";

export function ReplayComparison({
  original,
  replay,
  run,
  definition,
}: {
  original: FlowInstance;
  replay: FlowInstance;
  run: ReplayRun;
  definition: FlowDefinition;
}) {
  const status = run.fixValidated === true ? "validated" : run.fixValidated === false ? "failed" : run.reproduced ? "pending" : "failed";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-muted/30 p-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Verdict</p>
          <p className="mt-0.5 text-sm">{run.diffSummary}</p>
        </div>
        <FixValidationBadge status={status} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SideCard title="Original" subtitle={original.reference} instance={original} definition={definition} accent="default" />
        <SideCard title="Replay" subtitle={`${run.durationMs} ms`} instance={replay} definition={definition} accent={status === "validated" ? "ok" : "warn"} />
      </div>
    </div>
  );
}

function SideCard({
  title, subtitle, instance, definition, accent,
}: {
  title: string;
  subtitle: string;
  instance: FlowInstance;
  definition: FlowDefinition;
  accent: "default" | "ok" | "warn";
}) {
  const ring =
    accent === "ok" ? "ring-1 ring-emerald-500/40" :
    accent === "warn" ? "ring-1 ring-amber-500/40" :
    "";

  return (
    <Card className={ring}>
      <CardHeader className="border-b py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{title}</CardTitle>
          <span className="font-mono text-xs text-muted-foreground">{subtitle}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <ol className="space-y-2">
          {instance.traveledStates.map((sid, i) => {
            const isFailure = instance.failurePoint?.atState === sid && i === instance.traveledStates.length - 2;
            const isTerminal = i === instance.traveledStates.length - 1;
            return (
              <li key={`${sid}-${i}`} className="flex items-center gap-2 text-sm">
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${
                  isFailure ? "bg-destructive text-destructive-foreground" :
                  isTerminal && instance.outcome === "success" ? "bg-emerald-500 text-white" :
                  isTerminal ? "bg-destructive text-destructive-foreground" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {isTerminal ? (instance.outcome === "success" ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />) : i + 1}
                </span>
                <span className={isFailure ? "text-destructive font-medium" : ""}>{stateLabel(definition, sid)}</span>
                {i < instance.traveledStates.length - 1 && <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />}
              </li>
            );
          })}
        </ol>
        {instance.failurePoint && (
          <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/5 p-2 text-xs">
            <Badge variant="outline" className="border-destructive/40 text-destructive font-mono">
              {instance.failurePoint.providerCode}
            </Badge>
            <p className="mt-1 text-foreground/80">{instance.failurePoint.cause}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
