import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, AlertTriangle, GitCommit, Link2, Ticket, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { incidents, opsSummary, type Severity } from "@/lib/ops-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/ops-brain")({
  component: OpsBrainPage,
});

const sevTone: Record<Severity, string> = {
  critical: "bg-destructive/15 text-destructive ring-destructive/30",
  high: "bg-warning/20 text-warning-foreground ring-warning/30 dark:text-warning",
  medium: "bg-info/10 text-info ring-info/20",
  low: "bg-muted text-muted-foreground ring-border",
};

function OpsBrainPage() {
  const [q, setQ] = useState("");
  const [sev, setSev] = useState<string>("all");
  const filtered = useMemo(() => {
    return incidents.filter((i) =>
      (sev === "all" || i.severity === sev) &&
      (q === "" || (i.title + i.provider + i.service).toLowerCase().includes(q.toLowerCase())),
    );
  }, [q, sev]);

  const stats = [
    { label: "Active incidents", value: opsSummary.activeIncidents, icon: AlertTriangle, tone: "text-destructive" },
    { label: "Suspected regressions", value: opsSummary.regressions, icon: GitCommit, tone: "text-warning" },
    { label: "Failed tx linked to logs", value: opsSummary.failedTxLinked, icon: Link2, tone: "text-info" },
    { label: "Auto-created tickets", value: opsSummary.openTickets, icon: Ticket, tone: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" /> Ops Brain
          </h1>
          <p className="text-sm text-muted-foreground">AI-driven correlation across logs, deploys, transactions and alerts.</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs">{s.label}</CardDescription>
                <s.icon className={cn("h-4 w-4", s.tone)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Incident feed</CardTitle>
            <CardDescription>Real-time signals from connected sources.</CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search incidents…" className="pl-8 h-9 w-[220px]" />
            </div>
            <Select value={sev} onValueChange={setSev}>
              <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Incident</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Env</TableHead>
                <TableHead>Detected</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Linked</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="max-w-[280px]">
                    <div className="font-medium text-sm">{i.title}</div>
                    <div className="text-xs text-muted-foreground">{i.service} · {i.source}</div>
                  </TableCell>
                  <TableCell>
                    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset capitalize", sevTone[i.severity])}>{i.severity}</span>
                  </TableCell>
                  <TableCell className="text-sm">{i.provider}</TableCell>
                  <TableCell><StatusBadge status={i.environment} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(i.detectedAt).toLocaleTimeString()}</TableCell>
                  <TableCell><StatusBadge status={i.status === "investigating" ? "retrying" : i.status === "resolved" ? "delivered" : i.status === "monitoring" ? "pending" : "failed"} /></TableCell>
                  <TableCell className="text-sm">{Math.round(i.confidence * 100)}%</TableCell>
                  <TableCell className="font-mono text-xs">{i.linkedRef}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link to="/app/incident/$id" params={{ id: i.id }}>Investigate</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={9} className="text-center py-8 text-sm text-muted-foreground">No incidents match your filters.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
