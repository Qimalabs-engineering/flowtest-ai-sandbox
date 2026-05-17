import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, KeyRound, UserCog, Pause, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader, Pill, StatCard, StatusPill } from "@/components/admin-ui";
import {
  adminIncidents,
  adminIntegrations,
  adminScenarios,
  adminTransactions,
  getTenantById,
} from "@/lib/admin-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/tenants/$id")({
  loader: ({ params }) => {
    const tenant = getTenantById(params.id);
    if (!tenant) throw notFound();
    return { tenant };
  },
  component: TenantDetail,
});

function TenantDetail() {
  const { tenant } = Route.useLoaderData();
  const tx = adminTransactions.filter((t) => t.tenant === tenant.name).slice(0, 10);
  const incs = adminIncidents.filter((i) => i.affectedTenants.includes(tenant.name));
  const scs = adminScenarios.filter((s) => s.tenant === tenant.name);
  const igs = adminIntegrations.filter((i) => i.tenant === tenant.name);
  const act = (s: string) => toast.success(s);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/admin/tenants" className="inline-flex items-center gap-1 hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> Tenants
        </Link>
        <span>/</span>
        <span className="font-mono">{tenant.id}</span>
      </div>

      <PageHeader
        title={tenant.name}
        subtitle={`${tenant.plan} · ${tenant.region} · owner ${tenant.owner}`}
        meta={
          <>
            <StatusPill status={tenant.status} />
            <Pill tone="muted" dot={false}>{tenant.environment}</Pill>
            <Pill tone="info" dot={false}>created {tenant.createdAt}</Pill>
          </>
        }
        actions={
          <>
            <Button size="sm" variant="outline" onClick={() => act("Impersonating tenant")}>
              <UserCog className="mr-1.5 h-3.5 w-3.5" /> Impersonate
            </Button>
            <Button size="sm" variant="outline" onClick={() => act("API key regenerated")}>
              <KeyRound className="mr-1.5 h-3.5 w-3.5" /> Regenerate key
            </Button>
            <Button size="sm" variant="destructive" onClick={() => act(`${tenant.name} suspended`)}>
              <Pause className="mr-1.5 h-3.5 w-3.5" /> Suspend
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        <StatCard label="Tx (24h)" value={tenant.tx24h.toLocaleString()} delta="+6.1%" tone="success" />
        <StatCard label="Active scenarios" value={tenant.activeScenarios} />
        <StatCard label="Open incidents" value={incs.filter((i) => i.status !== "resolved").length} tone={incs.length ? "warning" : "muted"} />
        <StatCard label="Integrations" value={igs.length} hint={`${igs.filter((i) => i.status === "healthy").length} healthy`} />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="apikeys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-sm font-semibold">Tenant metadata</h3>
            <dl className="mt-3 grid grid-cols-2 gap-y-2 text-xs md:grid-cols-3">
              <Row k="Tenant ID" v={<span className="font-mono">{tenant.id}</span>} />
              <Row k="Slug" v={<span className="font-mono">{tenant.slug}</span>} />
              <Row k="Plan" v={tenant.plan} />
              <Row k="Environment" v={tenant.environment} />
              <Row k="Region" v={tenant.region} />
              <Row k="Status" v={<StatusPill status={tenant.status} />} />
              <Row k="Owner" v={tenant.owner} />
              <Row k="Created" v={tenant.createdAt} />
              <Row k="API key" v={<StatusPill status={tenant.apiKeyStatus} />} />
            </dl>
          </div>
        </TabsContent>

        <TabsContent value="apikeys">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">API keys</h3>
              <Button size="sm" variant="outline"><RefreshCw className="mr-1.5 h-3 w-3" /> Rotate all</Button>
            </div>
            <div className="mt-3 space-y-2">
              {["Server (sandbox)", "Server (replay)", "CI runner"].map((label, i) => (
                <div key={label} className="flex items-center justify-between rounded-md border p-2.5">
                  <div>
                    <div className="text-xs font-medium">{label}</div>
                    <div className="font-mono text-[11px] text-muted-foreground">
                      fs_sk_{tenant.slug}_••••{(i * 1117 + 4 + tenant.id.length).toString(16)}
                    </div>
                  </div>
                  <StatusPill status={i === 1 ? "rotating" : "active"} />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="webhooks">
          <div className="rounded-lg border bg-card p-4 text-xs">
            <div className="font-medium">Endpoint</div>
            <div className="font-mono text-[11px] text-muted-foreground">https://api.{tenant.slug}.dev/webhooks/flowsim</div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <div><div className="text-[11px] text-muted-foreground">Signing secret</div><div className="font-mono">whsec_••••a3f1</div></div>
              <div><div className="text-[11px] text-muted-foreground">Retry policy</div><div>exp backoff, 6 attempts</div></div>
              <div><div className="text-[11px] text-muted-foreground">Last delivery</div><div>2m ago · 200 OK</div></div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="integrations">
          <DenseTable
            cols={["Integration", "Kind", "Status", "Last sync", "Errors 24h"]}
            rows={igs.map((i) => [i.name, i.kind, <StatusPill status={i.status} />, i.lastSync, i.errors24h])}
            empty="No integrations connected."
          />
        </TabsContent>

        <TabsContent value="scenarios">
          <DenseTable
            cols={["Scenario", "Provider", "Behavior", "Priority", "Active"]}
            rows={scs.map((s) => [s.name, s.provider, s.behavior, s.priority, <StatusPill status={s.active ? "on" : "off"} />])}
            empty="No tenant scenarios configured."
          />
        </TabsContent>

        <TabsContent value="transactions">
          <DenseTable
            cols={["Reference", "Provider", "Amount", "Status", "Latency", "Time"]}
            rows={tx.map((t) => [
              <span className="font-mono text-[11px]">{t.reference}</span>,
              t.provider,
              `${t.currency} ${t.amount.toLocaleString()}`,
              <StatusPill status={t.status} />,
              `${t.latencyMs}ms`,
              new Date(t.createdAt).toLocaleTimeString(),
            ])}
            empty="No transactions yet."
          />
        </TabsContent>

        <TabsContent value="incidents">
          <DenseTable
            cols={["Incident", "Severity", "Status", "Provider", "Detected"]}
            rows={incs.map((i) => [i.title, <StatusPill status={i.severity} />, <StatusPill status={i.status} />, i.provider, new Date(i.detectedAt).toLocaleString()])}
            empty="No incidents associated with this tenant."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{k}</dt>
      <dd className="mt-0.5 text-xs">{v}</dd>
    </div>
  );
}

function DenseTable({ cols, rows, empty }: { cols: string[]; rows: React.ReactNode[][]; empty: string }) {
  if (rows.length === 0) {
    return <div className="rounded-md border border-dashed bg-muted/30 p-6 text-center text-xs text-muted-foreground">{empty}</div>;
  }
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {cols.map((c) => (
              <TableHead key={c} className="text-[11px] uppercase tracking-wider">{c}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r, i) => (
            <TableRow key={i}>
              {r.map((cell, j) => <TableCell key={j} className="text-xs">{cell}</TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
