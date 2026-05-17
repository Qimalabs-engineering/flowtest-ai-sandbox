import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  Clock,
  Webhook,
  Activity,
  Wallet,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { transactions, failureTrend, topFailing } from "@/lib/mock-data";
import { incidents, opsSummary } from "@/lib/ops-data";
import { failureClusters, getFlowDefinition, findScenario, stateLabel } from "@/lib/flow-data";
import { StatusBadge } from "@/components/status-badge";
import { Brain, Plug, Ticket, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/app/overview")({
  component: Overview,
});

const stats = [
  { label: "Total simulated", value: "184,920", delta: "+12.4%", up: true, icon: Activity },
  { label: "Successful", value: "168,402", delta: "+9.1%", up: true, icon: CheckCircle2 },
  { label: "Failed", value: "9,318", delta: "+3.2%", up: false, icon: XCircle },
  { label: "Pending", value: "1,204", delta: "-0.8%", up: true, icon: Clock },
  { label: "Webhook delivery", value: "98.4%", delta: "+0.6%", up: true, icon: Webhook },
  { label: "Provider uptime", value: "99.1%", delta: "+0.1%", up: true, icon: Wallet },
];

const opsStats = [
  { label: "Connected integrations", value: opsSummary.connectedIntegrations, icon: Plug },
  { label: "Active incidents", value: opsSummary.activeIncidents, icon: AlertTriangle },
  { label: "AI investigations", value: opsSummary.investigationsCompleted, icon: Brain },
  { label: "Auto-created issues", value: opsSummary.autoIssues, icon: Ticket },
];

function Overview() {
  const recent = transactions.slice(0, 6);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">Sandbox activity across all providers in the last 24h.</p>
        </div>
        <Button asChild>
          <Link to="/app/transactions">View transactions</Link>
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs">{s.label}</CardDescription>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold">{s.value}</div>
              <div className={`mt-1 inline-flex items-center gap-0.5 text-xs ${s.up ? "text-success" : "text-destructive"}`}>
                {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {s.delta}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Failure trend</CardTitle>
            <CardDescription>Successful vs failed simulated transactions, last 14 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={failureTrend}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-5)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-chart-5)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="success" stroke="var(--color-chart-2)" fill="url(#g1)" />
                <Area type="monotone" dataKey="failed" stroke="var(--color-chart-5)" fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top failing providers</CardTitle>
            <CardDescription>By count of failed simulations.</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topFailing} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis dataKey="provider" type="category" stroke="var(--color-muted-foreground)" fontSize={11} width={140} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="failures" fill="var(--color-chart-5)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {opsStats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs">{s.label}</CardDescription>
                <s.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle>Recent incidents</CardTitle>
            <CardDescription>Cross-source signals investigated by Ops Brain.</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm"><Link to="/app/ops-brain">Open Ops Brain</Link></Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Incident</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead className="text-right">Detected</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.slice(0, 4).map((i) => (
                <TableRow key={i.id} className="cursor-pointer">
                  <TableCell>
                    <Link to="/app/incident/$id" params={{ id: i.id }} className="hover:underline text-sm font-medium">{i.title}</Link>
                    <div className="text-xs text-muted-foreground">{i.service}</div>
                  </TableCell>
                  <TableCell className="text-sm">{i.provider}</TableCell>
                  <TableCell className="capitalize text-xs">{i.severity}</TableCell>
                  <TableCell className="text-sm">{Math.round(i.confidence * 100)}%</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">{new Date(i.detectedAt).toLocaleTimeString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent transactions</CardTitle>
          <CardDescription>Latest activity from your sandbox providers.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Scenario</TableHead>
                <TableHead className="text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs">{t.reference}</TableCell>
                  <TableCell>{t.provider}</TableCell>
                  <TableCell>{t.currency} {t.amount.toLocaleString()}</TableCell>
                  <TableCell><StatusBadge status={t.status} /></TableCell>
                  <TableCell className="text-muted-foreground text-xs">{t.scenario}</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {new Date(t.createdAt).toLocaleTimeString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
