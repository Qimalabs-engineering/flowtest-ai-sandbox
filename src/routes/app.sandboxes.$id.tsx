import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, Copy, Play, Webhook, KeyRound, Activity, AlertTriangle, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { getSandbox, getSandboxFlows, fidelityLabels } from "@/lib/sandbox-data";

export const Route = createFileRoute("/app/sandboxes/$id")({
  loader: ({ params }) => {
    const sb = getSandbox(params.id);
    if (!sb) throw notFound();
    return { sb };
  },
  component: SandboxDetail,
  notFoundComponent: () => (
    <div className="p-6">
      <p className="text-sm text-muted-foreground">Sandbox not found.</p>
      <Button asChild variant="ghost" size="sm" className="mt-2"><Link to="/app/sandboxes">Back to sandboxes</Link></Button>
    </div>
  ),
});

function SandboxDetail() {
  const { sb } = Route.useLoaderData();
  const flows = getSandboxFlows(sb);
  const fid = fidelityLabels[sb.fidelity as keyof typeof fidelityLabels];

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  const failRate = sb.instances24h > 0 ? Math.round((sb.failures24h / sb.instances24h) * 1000) / 10 : 0;

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-1">
          <Link to="/app/sandboxes"><ArrowLeft className="mr-1 h-4 w-4" /> Sandboxes</Link>
        </Button>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{sb.name}</h1>
              <Badge variant="outline" className="capitalize">
                <CircleDot className="mr-1 h-3 w-3" />{sb.status}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{sb.provider} · <Badge variant="secondary" className="ml-1 font-normal">{fid.label}</Badge></p>
          </div>
          <Button>
            <Play className="mr-1.5 h-4 w-4" /> Run scenario
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <KPI icon={<Activity className="h-3.5 w-3.5" />} label="Instances (24h)" value={sb.instances24h.toLocaleString()} />
        <KPI icon={<AlertTriangle className="h-3.5 w-3.5" />} label="Failure rate" value={`${failRate}%`} tone={failRate > 10 ? "warn" : "default"} />
        <KPI label="Replay runs" value={`${sb.replayRuns24h}`} />
        <KPI label="Fixes validated" value={`${sb.fixValidated24h}`} tone="ok" />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="keys">Keys</TabsTrigger>
          <TabsTrigger value="flows">Flows</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Fidelity</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">{fid.blurb}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Enabled flows</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {flows.map((f) => (
                <Link key={f.id} to="/app/flows/$id" params={{ id: f.id }} className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/40">
                  <div>
                    <p className="text-sm font-medium">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.failureScenarios.length} scenarios · {f.webhooks.length} webhooks</p>
                  </div>
                  <Badge variant="outline" className="font-normal">{f.apiVersion}</Badge>
                </Link>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keys" className="space-y-3 pt-4">
          <CredRow icon={<KeyRound className="h-4 w-4" />} label="Publishable key" value={sb.publishableKey} onCopy={copy} />
          <CredRow icon={<Activity className="h-4 w-4" />} label="API base" value={sb.apiBase} onCopy={copy} />
        </TabsContent>

        <TabsContent value="flows" className="pt-4">
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              Manage which flows are exposed in this sandbox. (Read-only in this preview.)
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="pt-4">
          <CredRow icon={<Webhook className="h-4 w-4" />} label="Delivery URL" value={sb.webhookUrl} onCopy={copy} />
        </TabsContent>

        <TabsContent value="code" className="pt-4">
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              Generate integration code mapped to a connected repository. Coming next: language tabs and one-click PR/MR.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function KPI({ icon, label, value, tone = "default" }: { icon?: React.ReactNode; label: string; value: string; tone?: "default" | "warn" | "ok" }) {
  const toneCls =
    tone === "warn" ? "text-amber-700 dark:text-amber-400"
    : tone === "ok" ? "text-emerald-700 dark:text-emerald-400"
    : "text-foreground";
  return (
    <Card>
      <CardContent className="p-4">
        <p className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">{icon}{label}</p>
        <p className={`mt-1 text-2xl font-semibold ${toneCls}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function CredRow({ icon, label, value, onCopy }: { icon: React.ReactNode; label: string; value: string; onCopy: (v: string, l: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/20 p-3">
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="truncate font-mono text-sm">{value}</p>
        </div>
      </div>
      <Button size="sm" variant="ghost" onClick={() => onCopy(value, label)}>
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}
