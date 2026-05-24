import { Link, createFileRoute } from "@tanstack/react-router";
import { PlayCircle, ArrowRight, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FailureBadge } from "@/components/failure-badge";
import { FixValidationBadge } from "@/components/fix-validation-badge";
import { failedInstances, getFlowDefinition } from "@/lib/flow-data";
import { replayRuns, sandboxes } from "@/lib/sandbox-data";

export const Route = createFileRoute("/app/replay/")({
  component: ReplayHome,
});

function ReplayHome() {
  const failed = failedInstances();
  const validated = replayRuns.filter((r) => r.fixValidated === true).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Replay</h1>
        <p className="text-sm text-muted-foreground">
          Reproduce a failed instance in a sandbox, apply a fix, then prove it works. The loop ends with “fix validated.”
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <KPI label="Failed instances" value={`${failed.length}`} />
        <KPI label="Replay runs" value={`${replayRuns.length}`} />
        <KPI label="Fixes validated" value={`${validated}`} tone="ok" />
      </div>

      <Card>
        <CardHeader className="border-b py-3">
          <CardTitle className="text-base">Pick a failed instance to replay</CardTitle>
        </CardHeader>
        <CardContent className="divide-y p-0">
          {failed.slice(0, 8).map((inst) => {
            const def = getFlowDefinition(inst.flowDefinitionId);
            return (
              <div key={inst.id} className="flex items-center justify-between gap-3 p-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-xs">{inst.reference}</p>
                    <FailureBadge instance={inst} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{def?.name}</p>
                </div>
                <Button asChild size="sm">
                  <Link to="/app/replay/$instanceId" params={{ instanceId: inst.id }}>
                    <PlayCircle className="mr-1 h-3.5 w-3.5" /> Replay
                  </Link>
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b py-3">
          <CardTitle className="inline-flex items-center gap-2 text-base"><History className="h-4 w-4" /> Recent replay runs</CardTitle>
        </CardHeader>
        <CardContent className="divide-y p-0">
          {replayRuns.map((r) => {
            const sb = sandboxes.find((s) => s.id === r.sandboxId);
            const status = r.fixValidated === true ? "validated" : r.fixValidated === false ? "failed" : r.reproduced ? "pending" : "failed";
            return (
              <div key={r.id} className="flex items-center justify-between gap-3 p-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <FixValidationBadge status={status} />
                    <Badge variant="outline" className="font-normal">{sb?.name ?? r.sandboxId}</Badge>
                    <span className="text-xs text-muted-foreground">{new Date(r.startedAt).toLocaleString()}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{r.diffSummary}</p>
                </div>
                <Button asChild size="sm" variant="ghost">
                  <Link to="/app/replay/$instanceId" params={{ instanceId: `fi_${r.originalInstanceId}` }}>
                    Open <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function KPI({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "ok" }) {
  const toneCls = tone === "ok" ? "text-emerald-700 dark:text-emerald-400" : "text-foreground";
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className={`mt-1 text-2xl font-semibold ${toneCls}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
