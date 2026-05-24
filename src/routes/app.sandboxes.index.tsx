import { Link, createFileRoute } from "@tanstack/react-router";
import { Plus, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SandboxCard } from "@/components/sandbox-card";
import { sandboxes } from "@/lib/sandbox-data";

export const Route = createFileRoute("/app/sandboxes/")({
  component: SandboxesList,
});

function SandboxesList() {
  const healthy = sandboxes.filter((s) => s.status === "healthy").length;
  const totalInstances = sandboxes.reduce((a, s) => a + s.instances24h, 0);
  const totalFailures = sandboxes.reduce((a, s) => a + s.failures24h, 0);
  const totalFixValidated = sandboxes.reduce((a, s) => a + s.fixValidated24h, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sandboxes</h1>
          <p className="text-sm text-muted-foreground">
            Provider-scoped environments. Each sandbox runs flows against one provider spec at a chosen fidelity.
          </p>
        </div>
        <Button asChild>
          <Link to="/app/sandboxes/new"><Plus className="mr-1.5 h-4 w-4" /> New sandbox</Link>
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <KPI label="Sandboxes" value={`${sandboxes.length}`} sub={`${healthy} healthy`} />
        <KPI label="Instances (24h)" value={totalInstances.toLocaleString()} />
        <KPI label="Failures (24h)" value={totalFailures.toLocaleString()} tone={totalFailures > 0 ? "warn" : "default"} />
        <KPI label="Fixes validated" value={`${totalFixValidated}`} tone="ok" />
      </div>

      {sandboxes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Boxes className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">No sandboxes yet</p>
              <p className="text-sm text-muted-foreground">Pick a provider to scaffold one in under a minute.</p>
            </div>
            <Button asChild><Link to="/app/sandboxes/new">Create your first sandbox</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sandboxes.map((sb) => <SandboxCard key={sb.id} sb={sb} />)}
        </div>
      )}
    </div>
  );
}

function KPI({ label, value, sub, tone = "default" }: { label: string; value: string; sub?: string; tone?: "default" | "warn" | "ok" }) {
  const toneCls =
    tone === "warn" ? "text-amber-700 dark:text-amber-400"
    : tone === "ok" ? "text-emerald-700 dark:text-emerald-400"
    : "text-foreground";
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className={`mt-1 text-2xl font-semibold ${toneCls}`}>{value}</p>
        {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}
