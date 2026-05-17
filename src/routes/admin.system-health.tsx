import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader, Pill, StatCard, StatusPill } from "@/components/admin-ui";
import { latencySeries, systemHealth } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/system-health")({
  component: SystemHealth,
});

function SystemHealth() {
  const s = systemHealth;
  const hasDown = s.components.some((c) => c.status === "down");

  return (
    <div className="space-y-5">
      <PageHeader
        title="System health"
        subtitle="Live telemetry from the FlowSim control plane."
        meta={hasDown ? <Pill tone="danger">Partial outage</Pill> : <Pill tone="success">All systems nominal</Pill>}
      />

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-5">
        <StatCard label="API p95 latency" value={`${s.apiLatencyMs}ms`} delta="-8ms" tone="success" />
        <StatCard label="Error rate" value={`${s.errorRate}%`} delta="+0.04%" tone="warning" />
        <StatCard label="Webhook success" value={`${s.webhookSuccess}%`} tone="success" />
        <StatCard label="Queue backlog" value={s.queueBacklog} tone="warning" />
        <StatCard label="Uptime 30d" value={`${s.uptime}%`} tone="success" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border bg-card">
          <div className="border-b px-4 py-3">
            <h3 className="text-sm font-semibold">API latency (ms)</h3>
            <p className="text-xs text-muted-foreground">Public API p95, last 8 hours.</p>
          </div>
          <div className="h-56 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencySeries} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="t" stroke="var(--color-muted-foreground)" fontSize={10} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={10} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 11 }} />
                <Line type="monotone" dataKey="api" stroke="var(--color-primary)" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="border-b px-4 py-3">
            <h3 className="text-sm font-semibold">Webhook dispatcher latency</h3>
            <p className="text-xs text-muted-foreground">End-to-end p95 delivery time.</p>
          </div>
          <div className="h-56 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={latencySeries} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="wlat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-warning)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-warning)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="t" stroke="var(--color-muted-foreground)" fontSize={10} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={10} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 11 }} />
                <Area type="monotone" dataKey="webhook" stroke="var(--color-warning)" fill="url(#wlat)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-sm font-semibold">Component status</h3>
        </div>
        <ul className="divide-y">
          {s.components.map((c) => (
            <li key={c.name} className="flex items-center justify-between gap-3 px-4 py-2.5">
              <div className="flex items-center gap-2.5">
                <span
                  className={
                    "h-2 w-2 rounded-full " +
                    (c.status === "operational"
                      ? "bg-success"
                      : c.status === "degraded"
                      ? "bg-warning animate-pulse"
                      : "bg-destructive animate-pulse")
                  }
                />
                <span className="text-xs font-medium">{c.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                  {c.latency ? `${c.latency}ms` : "—"}
                </span>
                <StatusPill status={c.status} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
