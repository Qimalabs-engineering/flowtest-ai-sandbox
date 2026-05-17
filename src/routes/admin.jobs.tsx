import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader, StatCard, StatusPill, Toolbar } from "@/components/admin-ui";
import { adminJobs, queueDepths } from "@/lib/admin-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/jobs")({
  component: JobsPage,
});

function JobsPage() {
  const [queue, setQueue] = useState("all");
  const [status, setStatus] = useState("all");
  const list = adminJobs.filter((j) => (queue === "all" || j.queue === queue) && (status === "all" || j.status === status));

  return (
    <div className="space-y-5">
      <PageHeader title="Jobs & queues" subtitle="Background workers, retries, and queue depth." />

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        {queueDepths.map((q) => (
          <StatCard
            key={q.queue}
            label={`queue: ${q.queue}`}
            value={q.depth}
            delta={`${q.processed1h.toLocaleString()} / 1h`}
            tone={q.depth > 30 ? "warning" : "success"}
            hint={`p95 ${q.p95Ms}ms`}
          />
        ))}
      </div>

      <Toolbar>
        <Select value={queue} onValueChange={setQueue}>
          <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All queues</SelectItem>
            <SelectItem value="default">default</SelectItem>
            <SelectItem value="webhooks">webhooks</SelectItem>
            <SelectItem value="ai">ai</SelectItem>
            <SelectItem value="integrations">integrations</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="queued">Queued</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="retrying">Retrying</SelectItem>
            <SelectItem value="succeeded">Succeeded</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto text-[11px] text-muted-foreground">{list.length} jobs</div>
      </Toolbar>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[11px] uppercase tracking-wider">Job</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Queue</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-right">Attempts</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Tenant</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Next run</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Error</TableHead>
              <TableHead className="text-right text-[11px] uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((j) => (
              <TableRow key={j.id}>
                <TableCell>
                  <div className="font-mono text-xs">{j.type}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">{j.id}</div>
                </TableCell>
                <TableCell className="font-mono text-xs">{j.queue}</TableCell>
                <TableCell><StatusPill status={j.status} /></TableCell>
                <TableCell className="text-right font-mono text-xs tabular-nums">{j.attempts}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{j.tenant}</TableCell>
                <TableCell className="text-[11px] text-muted-foreground">
                  {j.nextRun ? new Date(j.nextRun).toLocaleTimeString() : "—"}
                </TableCell>
                <TableCell className="max-w-[220px] truncate text-[11px] text-destructive">{j.error ?? "—"}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs"
                      disabled={j.status === "succeeded"}
                      onClick={() => toast.success(`Retrying ${j.id}`)}
                    >
                      <RefreshCw className="mr-1 h-3 w-3" /> Retry
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs text-destructive"
                      disabled={j.status === "succeeded" || j.status === "failed"}
                      onClick={() => toast.success(`Cancelled ${j.id}`)}
                    >
                      <X className="mr-1 h-3 w-3" /> Cancel
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
