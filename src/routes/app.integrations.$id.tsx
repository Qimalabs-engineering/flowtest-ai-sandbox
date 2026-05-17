import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, GitBranch, Rocket, ShieldAlert, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/status-badge";
import { integrations, githubRepos, ddServices } from "@/lib/ops-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/app/integrations/$id")({
  component: IntegrationDetail,
  notFoundComponent: () => (
    <div className="p-8 text-center text-sm text-muted-foreground">Integration not found.</div>
  ),
  loader: ({ params }) => {
    const i = integrations.find((x) => x.id === params.id);
    if (!i) throw notFound();
    return { integration: i };
  },
});

function IntegrationDetail() {
  const { integration } = Route.useLoaderData();
  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2">
          <Link to="/app/integrations"><ArrowLeft className="h-4 w-4 mr-1" /> Back to integrations</Link>
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg text-white text-xs font-semibold", integration.accent)}>{integration.initials}</div>
          <h1 className="text-2xl font-semibold tracking-tight">{integration.name}</h1>
          <StatusBadge status={integration.status === "connected" ? "active" : integration.status === "error" ? "failed" : "inactive"} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{integration.description}</p>
      </div>

      {integration.id === "github" ? <GithubDetail /> : integration.id === "datadog" ? <ObservabilityDetail /> : <GenericConfig /> }
    </div>
  );
}

function GithubDetail() {
  return (
    <Tabs defaultValue="repos">
      <TabsList>
        <TabsTrigger value="repos">Repositories</TabsTrigger>
        <TabsTrigger value="deploys">Deployments</TabsTrigger>
        <TabsTrigger value="risk">Risky changes</TabsTrigger>
        <TabsTrigger value="webhook">Webhook</TabsTrigger>
      </TabsList>
      <TabsContent value="repos" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monitored repositories</CardTitle>
            <CardDescription>Select repos and branches to watch for regression hunting.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Repository</TableHead>
                  <TableHead>Branches</TableHead>
                  <TableHead>Mapped service</TableHead>
                  <TableHead>Last deploy</TableHead>
                  <TableHead className="text-right">Risky</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {githubRepos.map((r) => (
                  <TableRow key={r.repo}>
                    <TableCell><Checkbox defaultChecked /></TableCell>
                    <TableCell className="font-mono text-xs">{r.repo}</TableCell>
                    <TableCell className="text-xs">{r.branches.map((b) => <span key={b} className="mr-1 inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5"><GitBranch className="h-3 w-3" />{b}</span>)}</TableCell>
                    <TableCell className="text-xs">{r.service}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.lastDeploy}</TableCell>
                    <TableCell className="text-right text-xs">{r.risky}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="deploys" className="mt-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Recent deployments</CardTitle></CardHeader>
          <CardContent>
            <ul className="divide-y">
              {["payments-core v4.21.0", "webhook-dispatcher v2.7.1", "name-verify v1.3.0"].map((d, i) => (
                <li key={d} className="flex items-center justify-between py-3 text-sm">
                  <div className="flex items-center gap-2"><Rocket className="h-4 w-4 text-primary" /> {d}</div>
                  <span className="text-xs text-muted-foreground">{["12 min ago", "3 hours ago", "yesterday"][i]}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="risk" className="mt-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Risky commits in last 24h</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { c: "a8f91c2", t: "Reduce provider timeout window", risk: 78 },
              { c: "d1c44ab", t: "Tighten name-match similarity threshold", risk: 61 },
              { c: "c91aa07", t: "Cache idempotency keys for 60s", risk: 32 },
            ].map((x) => (
              <div key={x.c} className="flex items-center justify-between rounded-md border p-3 text-sm">
                <div>
                  <div className="font-medium">{x.t}</div>
                  <div className="text-xs text-muted-foreground font-mono">{x.c}</div>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldAlert className={cn("h-4 w-4", x.risk > 60 ? "text-destructive" : "text-warning")} />
                  <span className="text-xs font-medium">Risk {x.risk}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="webhook" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Deployment webhook</CardTitle>
            <CardDescription>Configure GitHub to notify FlowSim on deploy events.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Payload URL</Label>
              <Input readOnly value="https://api.flowsim.dev/webhooks/github/deploy" className="font-mono text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label>Signing secret</Label>
              <Input readOnly value="whsec_••••••••••••3f9a" className="font-mono text-xs" />
            </div>
            <Button onClick={() => toast.success("Webhook re-tested (mock)")}>Send test event</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function ObservabilityDetail() {
  return (
    <Tabs defaultValue="services">
      <TabsList>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="alerts">Alert rules</TabsTrigger>
        <TabsTrigger value="mapping">Mapping</TabsTrigger>
      </TabsList>
      <TabsContent value="services" className="mt-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Connected services</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Log index</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead className="text-right">Errors / 24h</TableHead>
                  <TableHead className="text-right">p99 latency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ddServices.map((s) => (
                  <TableRow key={s.name}>
                    <TableCell className="text-sm font-medium">{s.name}</TableCell>
                    <TableCell className="font-mono text-xs">{s.index}</TableCell>
                    <TableCell><StatusBadge status={s.env} /></TableCell>
                    <TableCell className="text-right text-sm">{s.errors}</TableCell>
                    <TableCell className="text-right text-sm">{s.latencyMs}ms</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="alerts" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Imported alert rules</CardTitle>
            <CardDescription>Thresholds that map to incident severity in FlowSim.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ThresholdRow label="Error keywords" placeholder="timeout, refused, ECONNRESET" />
            <ThresholdRow label="Latency threshold (ms)" placeholder="2500" />
            <ThresholdRow label="Transaction failure rate (%)" placeholder="5" />
            <ThresholdRow label="Provider-specific: Choice Bank (%)" placeholder="3" />
            <ThresholdRow label="Provider-specific: M-Pesa (%)" placeholder="8" />
            <Button onClick={() => toast.success("Alert thresholds saved")}>Save thresholds</Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="mapping" className="mt-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Service name mapping</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">Map Datadog service names to FlowSim simulated services.</p>
            <MappingRow from="payments-core-prod" to="transfer-processor" />
            <MappingRow from="webhooks-prod" to="webhook-dispatcher" />
            <MappingRow from="name-verify-prod" to="name-verify" />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function ThresholdRow({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_2fr] sm:items-center">
      <Label>{label}</Label>
      <Input placeholder={placeholder} />
    </div>
  );
}
function MappingRow({ from, to }: { from: string; to: string }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <Input defaultValue={from} className="font-mono text-xs" />
      <Input defaultValue={to} className="font-mono text-xs" />
    </div>
  );
}

function GenericConfig() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Configuration</CardTitle>
        <CardDescription>Adjust connection scope and behaviour.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Auto-sync events</p>
            <p className="text-xs text-muted-foreground">Pull new events every 60 seconds.</p>
          </div>
          <Switch defaultChecked />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Forward to Ops Brain</p>
            <p className="text-xs text-muted-foreground">Let the AI correlate this source with incidents.</p>
          </div>
          <Switch defaultChecked />
        </div>
        <Button variant="outline"><Activity className="h-4 w-4 mr-1.5" /> Run sync now</Button>
      </CardContent>
    </Card>
  );
}
