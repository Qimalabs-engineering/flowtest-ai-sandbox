import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Boxes, Activity, PlayCircle, CheckCircle2, AlertTriangle,
  Brain, ArrowRight, Webhook, GitBranch, Plug,
} from "lucide-react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { FixValidationBadge } from "@/components/fix-validation-badge";
import {
  sandboxes, replayRuns, monitoringEvents, getSandbox,
} from "@/lib/sandbox-data";
import {
  failureClusters, getFlowDefinition, findScenario, stateLabel,
  flowInstances,
} from "@/lib/flow-data";

export const Route = createFileRoute("/app/overview")({
  component: Overview,
});

function Overview() {
  const totalInstances = sandboxes.reduce((a, s) => a + s.instances24h, 0);
  const totalFailures = sandboxes.reduce((a, s) => a + s.failures24h, 0);
  const totalReplays = sandboxes.reduce((a, s) => a + s.replayRuns24h, 0);
  const totalValidated = sandboxes.reduce((a, s) => a + s.fixValidated24h, 0);
  const activeSandboxes = sandboxes.filter((s) => s.status !== "paused").length;
  const replayableSignals = monitoringEvents.filter((e) => e.replayable).length;

  const loop = [
    { label: "Active sandboxes", value: activeSandboxes, sub: `${sandboxes.length} total`, icon: Boxes, tone: "text-primary" },
    { label: "Instances (24h)", value: totalInstances.toLocaleString(), sub: `${totalFailures} failed`, icon: Activity, tone: "text-info" },
    { label: "Replay runs (24h)", value: totalReplays, sub: `${replayableSignals} signals waiting`, icon: PlayCircle, tone: "text-warning" },
    { label: "Fixes validated (24h)", value: totalValidated, sub: "across all sandboxes", icon: CheckCircle2, tone: "text-success" },
  ];

  const recentInstances = flowInstances.slice(0, 6);
  const recentReplays = replayRuns.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">
            The lifecycle loop at a glance — sandboxes, failures replayed, fixes validated.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/app/sandboxes">Sandboxes <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
          <Button asChild>
            <Link to="/app/sandboxes/new">New sandbox</Link>
          </Button>
        </div>
      </div>

      {/* Loop KPIs */}
      <div className="fs-stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {loop.map((s) => (
          <Card key={s.label} className="fs-card-hover">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs">{s.label}</CardDescription>
                <s.icon className={`h-4 w-4 ${s.tone}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{s.value}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">{s.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sandbox health */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div>
            <CardTitle className="text-base">Sandbox health</CardTitle>
            <CardDescription>24h activity per sandbox.</CardDescription>
          </div>
          <Button asChild size="sm" variant="ghost">
            <Link to="/app/sandboxes">All sandboxes →</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sandbox</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Instances</TableHead>
                <TableHead className="text-right">Failures</TableHead>
                <TableHead className="text-right">Replays</TableHead>
                <TableHead className="text-right">Validated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sandboxes.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <Link to="/app/sandboxes/$id" params={{ id: s.id }} className="text-sm font-medium hover:underline">
                      {s.name}
                    </Link>
                    <div className="text-[10px] text-muted-foreground">{s.provider}</div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        s.status === "healthy" ? "bg-success/15 text-success"
                        : s.status === "degraded" ? "bg-warning/20 text-warning-foreground"
                        : "bg-muted text-muted-foreground"
                      }
                    >
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">{s.instances24h.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono text-sm text-destructive">{s.failures24h}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{s.replayRuns24h}</TableCell>
                  <TableCell className="text-right font-mono text-sm text-success">{s.fixValidated24h}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top failure clusters */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" /> Top failure clusters
              </CardTitle>
              <CardDescription className="text-xs">Where flows are breaking right now.</CardDescription>
            </div>
            <Button asChild size="sm" variant="ghost">
              <Link to="/app/failures">All →</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y text-sm">
              {failureClusters().slice(0, 5).map((c, i) => {
                const def = getFlowDefinition(c.flowDefinitionId);
                const scenario = def ? findScenario(def, c.scenarioId) : undefined;
                if (!def || !scenario) return null;
                return (
                  <li key={i} className="flex items-center justify-between gap-3 px-4 py-2.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="rounded-full bg-destructive/15 px-2 py-0.5 font-mono text-xs font-semibold text-destructive shrink-0">
                        {c.count}×
                      </span>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{scenario.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {def.name} · <span className="font-mono">{stateLabel(def, c.atState)}</span>
                        </div>
                      </div>
                    </div>
                    <Button asChild size="sm" variant="ghost">
                      <Link to="/app/replay/$instanceId" params={{ instanceId: c.sampleInstanceId }}>
                        <PlayCircle className="h-3.5 w-3.5 mr-1" /> Replay
                      </Link>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        {/* Replay activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <PlayCircle className="h-4 w-4 text-primary" /> Recent replays
              </CardTitle>
              <CardDescription className="text-xs">Reproducing failures and proving fixes.</CardDescription>
            </div>
            <Button asChild size="sm" variant="ghost">
              <Link to="/app/replay">All →</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y text-sm">
              {recentReplays.map((r) => {
                const sb = getSandbox(r.sandboxId);
                return (
                  <li key={r.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{r.diffSummary}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {sb?.name ?? r.sandboxId} · {new Date(r.startedAt).toLocaleString()}
                      </div>
                    </div>
                    <FixValidationBadge
                      status={r.fixValidated === true ? "validated" : r.fixValidated === false ? "failed" : "pending"}
                    />
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Recent instances */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div>
            <CardTitle className="text-base">Recent instances</CardTitle>
            <CardDescription>Latest flow runs across all sandboxes.</CardDescription>
          </div>
          <Button asChild size="sm" variant="ghost">
            <Link to="/app/instances">All →</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Flow</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Failure point</TableHead>
                <TableHead className="text-right">Started</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentInstances.map((i) => {
                const def = getFlowDefinition(i.flowDefinitionId);
                return (
                  <TableRow key={i.id}>
                    <TableCell className="font-mono text-xs">{i.reference}</TableCell>
                    <TableCell className="text-xs">{def?.name ?? i.flowDefinitionId}</TableCell>
                    <TableCell><StatusBadge status={i.outcome === "success" ? "delivered" : i.outcome === "failed" ? "failed" : "pending"} /></TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {i.failurePoint && def ? stateLabel(def, i.failurePoint.atState) : "—"}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {new Date(i.startedAt).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Connect surfaces */}
      <div className="fs-stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ConnectTile to="/app/ops-brain" icon={Brain} label="Ops Brain" desc="Correlate signals to flows." />
        <ConnectTile to="/app/code" icon={GitBranch} label="Code" desc="GitHub, GitLab, Bitbucket." />
        <ConnectTile to="/app/integrations" icon={Plug} label="Integrations" desc="Slack, Jira, ClickUp alerts." />
        <ConnectTile to="/app/webhooks" icon={Webhook} label="Webhooks" desc="Delivery log per sandbox." />
      </div>
    </div>
  );
}

function ConnectTile({
  to, icon: Icon, label, desc,
}: { to: string; icon: typeof Brain; label: string; desc: string }) {
  return (
    <Link
      to={to}
      className="group flex items-start gap-3 rounded-lg border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/20">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1 text-sm font-semibold">
          {label}
          <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">{desc}</div>
      </div>
    </Link>
  );
}
