import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RefreshCw, Eye, PlayCircle, Webhook as WebhookIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { webhooks } from "@/lib/mock-data";
import { sandboxes, getSandbox } from "@/lib/sandbox-data";
import { StatusBadge } from "@/components/status-badge";
import { toast } from "sonner";

export const Route = createFileRoute("/app/webhooks")({
  component: WebhooksPage,
});

// Deterministically attach each mock webhook to a sandbox so the page can
// be filtered the way the rest of the product is organized.
const enriched = webhooks.map((w, i) => {
  const sb = sandboxes[i % sandboxes.length];
  return { ...w, sandboxId: sb.id };
});

function WebhooksPage() {
  const [sandboxId, setSandboxId] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  const rows = useMemo(() => {
    return enriched.filter(
      (w) =>
        (sandboxId === "all" || w.sandboxId === sandboxId) &&
        (status === "all" || w.status === status),
    );
  }, [sandboxId, status]);

  const failed = rows.filter((r) => r.status === "failed").length;
  const retrying = rows.filter((r) => r.status === "retrying").length;
  const delivered = rows.filter((r) => r.status === "delivered").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <WebhookIcon className="h-5 w-5 text-primary" /> Webhooks
        </h1>
        <p className="text-sm text-muted-foreground">
          Delivery attempts grouped by sandbox. Retry, inspect payload, or replay the originating instance.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <KpiCard label="Delivered" value={delivered} tone="text-success" />
        <KpiCard label="Retrying" value={retrying} tone="text-warning" />
        <KpiCard label="Failed" value={failed} tone="text-destructive" />
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 border-b sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">Delivery log</CardTitle>
            <CardDescription>Most recent attempts across all targets.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={sandboxId} onValueChange={setSandboxId}>
              <SelectTrigger className="h-9 w-[200px]"><SelectValue placeholder="Sandbox" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sandboxes</SelectItem>
                {sandboxes.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="retrying">Retrying</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Sandbox</TableHead>
                <TableHead>Target URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Last attempt</TableHead>
                <TableHead>Response</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((w) => {
                const sb = getSandbox(w.sandboxId);
                return (
                  <TableRow key={w.id}>
                    <TableCell className="font-mono text-xs">{w.eventId}</TableCell>
                    <TableCell>
                      {sb ? (
                        <Link
                          to="/app/sandboxes/$id"
                          params={{ id: sb.id }}
                          className="text-xs font-medium hover:underline"
                        >
                          {sb.name}
                        </Link>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="max-w-[220px] truncate text-xs">{w.url}</TableCell>
                    <TableCell><StatusBadge status={w.status} /></TableCell>
                    <TableCell>{w.attempts}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(w.lastAttempt).toLocaleTimeString()}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{w.responseCode ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.success("Webhook retry queued")}
                      >
                        <RefreshCw className="h-3.5 w-3.5 mr-1" /> Retry
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast("Payload viewer (mock)")}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" /> Payload
                      </Button>
                      {w.status === "failed" && (
                        <Button asChild variant="ghost" size="sm">
                          <Link to="/app/replay">
                            <PlayCircle className="h-3.5 w-3.5 mr-1" /> Replay
                          </Link>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">
                    No deliveries match the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription className="text-xs">{label}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-semibold ${tone}`}>{value}</div>
      </CardContent>
    </Card>
  );
}
