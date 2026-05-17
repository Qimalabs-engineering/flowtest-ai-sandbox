import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  Workflow,
  AlertOctagon,
  Plug,
  CheckCircle2,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
  activityFeed,
  adminIncidents,
  adminOverview,
  providerReliability,
  txSeries,
} from "@/lib/admin-data";

export const Route = createFileRoute("/admin/overview")({
  component: AdminOverviewPage,
});

const iconFor = (k: string) => {
  if (k === "tenant") return Building2;
  if (k === "scenario") return Workflow;
  if (k === "incident") return AlertOctagon;
  if (k === "integration") return Plug;
  return CheckCircle2;
};

function AdminOverviewPage() {
  const o = adminOverview;
  return (
    <div className="space-y-5">
      <PageHeader
        title="Operations overview"
        subtitle="Real-time view of the FlowSim control plane."
        meta={
          <>
            <Pill tone="success">All regions operational</Pill>
            <Pill tone="muted" dot={false}>Last refresh: just now</Pill>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 xl:grid-cols-8">
        <StatCard label="Total tenants" value={o.totalTenants} delta={`${o.activeTenants} active`} tone="success" />
        <StatCard label="Active tenants" value={o.activeTenants} hint="last 24h" />
        <StatCard label="Tx (24h)" value={o.tx24h.toLocaleString()} delta="+8.4%" tone="success" />
        <StatCard label="Failure rate" value={`${o.failureRate}%`} delta="+0.3%" tone="warning" />
        <StatCard label="Webhook success" value={`${o.webhookSuccess}%`} delta="-0.2%" tone="warning" />
        <StatCard label="Active incidents" value={o.activeIncidents} delta="2 sev1" tone="danger" />
        <StatCard label="Queue backlog" value={o.queueBacklog} delta="webhooks 47" tone="warning" />
        <StatCard label="API req / min" value={o.apiReqPerMin.toLocaleString()} delta="+12%" tone="info" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border bg-card lg:col-span-2">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <h3 className="text-sm font-semibold">Transactions — last 24h</h3>
              <p className="text-xs text-muted-foreground">Hourly success vs failure across all tenants.</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-success" />Success</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-destructive" />Failed</span>
            </div>
          </div>
          <div className="h-64 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={txSeries} margin={{ top: 6, right: 6, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="ovS" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ovF" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-destructive)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-destructive)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="hour" stroke="var(--color-muted-foreground)" fontSize={10} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={10} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 11 }} />
                <Area type="monotone" dataKey="success" stroke="var(--color-success)" fill="url(#ovS)" />
                <Area type="monotone" dataKey="failed" stroke="var(--color-destructive)" fill="url(#ovF)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="border-b px-4 py-3">
            <h3 className="text-sm font-semibold">Provider reliability</h3>
            <p className="text-xs text-muted-foreground">% of successful operations, last 24h.</p>
          </div>
          <div className="h-64 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={providerReliability} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" domain={[80, 100]} stroke="var(--color-muted-foreground)" fontSize={10} />
                <YAxis dataKey="name" type="category" stroke="var(--color-muted-foreground)" fontSize={10} width={120} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 11 }} />
                <Bar dataKey="reliability" radius={[0, 4, 4, 0]}>
                  {providerReliability.map((p) => (
                    <Cell key={p.name} fill={p.reliability >= 97 ? "var(--color-success)" : p.reliability >= 93 ? "var(--color-warning)" : "var(--color-destructive)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border bg-card lg:col-span-2">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="text-sm font-semibold">Active incidents</h3>
            <Link to="/admin/incidents" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[11px] uppercase tracking-wider">Incident</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider">Sev</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider">Tenants</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-right">Detected</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminIncidents.slice(0, 5).map((i) => (
                <TableRow key={i.id}>
                  <TableCell>
                    <div className="text-xs font-medium">{i.title}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">{i.id} · {i.provider}</div>
                  </TableCell>
                  <TableCell><StatusPill status={i.severity} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{i.affectedTenants.length}</TableCell>
                  <TableCell><StatusPill status={i.status} /></TableCell>
                  <TableCell className="text-right text-[11px] text-muted-foreground">
                    {new Date(i.detectedAt).toLocaleTimeString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="border-b px-4 py-3">
            <h3 className="text-sm font-semibold">Recent activity</h3>
            <p className="text-xs text-muted-foreground">System & operator events.</p>
          </div>
          <ol className="divide-y">
            {activityFeed.map((a) => {
              const Icon = iconFor(a.kind);
              return (
                <li key={a.id} className="flex gap-3 p-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border bg-background">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-xs font-medium">{a.title}</p>
                      <span className="shrink-0 text-[10px] text-muted-foreground">{a.at}</span>
                    </div>
                    <p className="truncate text-xs text-foreground/80">{a.subject}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{a.meta}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
