import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ReplayComparison } from "@/components/replay-comparison";
import { FourQuestionsPanel } from "@/components/four-questions-panel";
import {
  getInstance,
  getFlowDefinition,
  type FlowInstance,
  type FailurePoint,
} from "@/lib/flow-data";
import { replayRuns, sandboxes, type ReplayRun } from "@/lib/sandbox-data";

export const Route = createFileRoute("/app/replay/$instanceId")({
  loader: ({ params }) => {
    const original = getInstance(params.instanceId);
    if (!original) throw notFound();
    return { original };
  },
  component: ReplayDetail,
  notFoundComponent: () => (
    <div className="p-6 text-sm text-muted-foreground">Instance not found.</div>
  ),
});

function synthesizeReplay(original: FlowInstance, run: ReplayRun): FlowInstance {
  if (run.fixValidated) {
    // Successful replay: take happy path
    const def = getFlowDefinition(original.flowDefinitionId)!;
    return {
      ...original,
      id: `${original.id}_replay`,
      traveledStates: [...def.happyPath],
      currentState: def.happyPath[def.happyPath.length - 1],
      outcome: "success",
      failurePoint: undefined,
    };
  }
  // Reproduced failure (or unrelated failure)
  return {
    ...original,
    id: `${original.id}_replay`,
  };
}

function ReplayDetail() {
  const { original } = Route.useLoaderData();
  const def = getFlowDefinition(original.flowDefinitionId);
  if (!def) return <div className="p-6 text-sm text-muted-foreground">Flow definition missing.</div>;

  // Match the most relevant prior run or fabricate one for demo
  const txId = original.transactionId;
  const existing = replayRuns.find((r) => r.originalInstanceId === txId);
  const run: ReplayRun = existing ?? {
    id: `rr_demo_${original.id}`,
    originalInstanceId: txId ?? original.id,
    sandboxId: sandboxes.find((s) => s.provider === def.provider)?.id ?? sandboxes[0].id,
    flowId: def.id,
    startedAt: new Date().toISOString(),
    durationMs: def.p50Ms,
    reproduced: true,
    fixValidated: null,
    diffSummary: "Replay reproduced the original failure. Apply a fix and re-run to validate.",
  };

  const replay = synthesizeReplay(original, run);
  const sb = sandboxes.find((s) => s.id === run.sandboxId);

  // For the four-questions panel, build a synthetic "fixed" view when validated
  const reviewInstance: FlowInstance = original.failurePoint ? original : {
    ...original,
    failurePoint: {
      atState: original.currentState,
      scenarioId: def.failureScenarios[0]?.id ?? "unknown",
      cause: "Inspect the original failure",
      providerCode: def.failureScenarios[0]?.providerCode ?? "N/A",
      why: "Open from a failed instance to populate this view",
    } satisfies FailurePoint,
  };

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-1">
          <Link to="/app/replay"><ArrowLeft className="mr-1 h-4 w-4" /> Replay</Link>
        </Button>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Replay <span className="font-mono">{original.reference}</span></h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sandbox: <Badge variant="outline" className="ml-1 font-normal">{sb?.name ?? run.sandboxId}</Badge> · Flow: <span className="font-mono">{def.id}</span>
            </p>
          </div>
          <Button variant="outline" onClick={() => toast.success("Sent to Slack #fintech-ops", { description: "Replay verdict shared." })}>
            <Send className="mr-1.5 h-4 w-4" /> Send to Slack
          </Button>
        </div>
      </div>

      <ReplayComparison original={original} replay={replay} run={run} definition={def} />

      <Card>
        <CardHeader className="border-b py-3"><CardTitle className="text-base">Four questions</CardTitle></CardHeader>
        <CardContent className="p-4">
          <FourQuestionsPanel instance={reviewInstance} />
        </CardContent>
      </Card>
    </div>
  );
}
