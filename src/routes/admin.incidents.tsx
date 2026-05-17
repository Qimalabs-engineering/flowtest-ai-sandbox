import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GitCommit, MessageSquare, Send, Ticket, UserPlus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader, Pill, StatCard, StatusPill, Toolbar } from "@/components/admin-ui";
import { adminIncidents } from "@/lib/admin-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/incidents")({
  component: IncidentsPage,
});

function IncidentsPage() {
  const [severity, setSeverity] = useState("all");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState<typeof adminIncidents[number] | null>(null);

  const list = adminIncidents.filter((i) => {
    if (severity !== "all" && i.severity !== severity) return false;
    if (status !== "all" && i.status !== status) return false;
    return true;
  });

  const open_ = list.filter((i) => i.status !== "resolved").length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Incidents"
        subtitle="Cross-tenant incidents detected by Ops Brain."
        meta={<Pill tone={open_ ? "danger" : "success"}>{open_} active</Pill>}
      />

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        <StatCard label="Sev1 open" value={list.filter((i) => i.severity === "sev1" && i.status !== "resolved").length} tone="danger" delta="critical" />
        <StatCard label="Sev2 open" value={list.filter((i) => i.severity === "sev2" && i.status !== "resolved").length} tone="warning" />
        <StatCard label="Investigating" value={list.filter((i) => i.status === "investigating").length} tone="info" />
        <StatCard label="Mean time to mitigate" value="11m" delta="-2m" tone="success" hint="last 7d" />
      </div>

      <Toolbar>
        <Select value={severity} onValueChange={setSeverity}>
          <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All severities</SelectItem>
            <SelectItem value="sev1">Sev1</SelectItem>
            <SelectItem value="sev2">Sev2</SelectItem>
            <SelectItem value="sev3">Sev3</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-8 w-[160px] text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="investigating">Investigating</SelectItem>
            <SelectItem value="mitigated">Mitigated</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Pill tone="muted" dot={false} className="ml-auto">{list.length} shown</Pill>
      </Toolbar>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[11px] uppercase tracking-wider">Incident</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Sev</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Provider</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Tenants</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Owner</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-right">Confidence</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-right">Detected</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((i) => (
              <TableRow key={i.id} className="cursor-pointer" onClick={() => setOpen(i)}>
                <TableCell>
                  <div className="text-xs font-medium">{i.title}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">{i.id}</div>
                </TableCell>
                <TableCell><StatusPill status={i.severity} /></TableCell>
                <TableCell><StatusPill status={i.status} /></TableCell>
                <TableCell className="text-xs text-muted-foreground">{i.provider}</TableCell>
                <TableCell className="text-xs">{i.affectedTenants.length}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{i.owner ?? "—"}</TableCell>
                <TableCell className="text-right font-mono text-xs tabular-nums">{Math.round(i.confidence * 100)}%</TableCell>
                <TableCell className="text-right text-[11px] text-muted-foreground">{new Date(i.detectedAt).toLocaleTimeString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <SheetContent className="w-full sm:max-w-xl">
          {open && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <StatusPill status={open.severity} />
                  <StatusPill status={open.status} />
                </div>
                <SheetTitle className="text-base">{open.title}</SheetTitle>
                <SheetDescription className="font-mono text-[11px]">{open.id} · {open.provider}</SheetDescription>
              </SheetHeader>
              <div className="mt-5 space-y-5 text-xs">
                <div className="rounded-md border bg-muted/40 p-3">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">AI Hypothesis · {Math.round(open.confidence * 100)}% confidence</div>
                  <p className="mt-1 text-foreground/90">{open.hypothesis}</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Mini k="Linked logs" v={open.linkedLogs} icon={MessageSquare} />
                  <Mini k="Linked tx" v={open.linkedTx} icon={CheckCircle2} />
                  <Mini k="Code changes" v={open.linkedPRs} icon={GitCommit} />
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Timeline</div>
                  <ol className="mt-2 space-y-2 border-l pl-3">
                    {[
                      { t: "T+0", e: "Datadog alert: webhook_5xx_rate > 5%" },
                      { t: "T+12s", e: "Ops Brain correlated with PR #8a2f1c deploy" },
                      { t: "T+38s", e: "Hypothesis ranked · confidence 0.92" },
                      { t: "T+1m", e: "Slack notification sent to #fs-incidents" },
                      { t: "T+3m", e: "Jira FS-2104 auto-created" },
                    ].map((s, i) => (
                      <li key={i} className="relative">
                        <span className="absolute -left-[15px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                        <div className="font-mono text-[10px] text-muted-foreground">{s.t}</div>
                        <div>{s.e}</div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Suggested fix</div>
                  <pre className="mt-1 rounded-md border bg-foreground/5 p-2 font-mono text-[10px] leading-relaxed">
{`- in receiver/webhook_handler.ts:42
- if (event.type === 'charge.success') {
-   await processCharge(event)  // throws on null metadata
+ if (event.type === 'charge.success') {
+   if (!event.metadata) return res.status(200).end()
+   await processCharge(event)`}
                  </pre>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => toast.success("Owner assigned")}>
                    <UserPlus className="mr-1.5 h-3.5 w-3.5" /> Assign owner
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.success("Slack notified")}>
                    <Send className="mr-1.5 h-3.5 w-3.5" /> Notify Slack
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.success("Jira issue created")}>
                    <Ticket className="mr-1.5 h-3.5 w-3.5" /> Create Jira
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.success("Incident resolved")}>
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Resolve
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Mini({ k, v, icon: Icon }: { k: string; v: React.ReactNode; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-md border bg-background p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{k}</span>
        <Icon className="h-3 w-3 text-muted-foreground" />
      </div>
      <div className="mt-1 font-mono text-base font-semibold tabular-nums">{v}</div>
    </div>
  );
}
