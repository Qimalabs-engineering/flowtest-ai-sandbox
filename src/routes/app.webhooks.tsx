import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { webhooks } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";
import { toast } from "sonner";

export const Route = createFileRoute("/app/webhooks")({
  component: WebhooksPage,
});

function WebhooksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Webhooks</h1>
        <p className="text-sm text-muted-foreground">Delivery attempts, retries, and response codes.</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event ID</TableHead>
                <TableHead>Target URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Last attempt</TableHead>
                <TableHead>Next retry</TableHead>
                <TableHead>Response</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((w) => (
                <TableRow key={w.id}>
                  <TableCell className="font-mono text-xs">{w.eventId}</TableCell>
                  <TableCell className="text-xs truncate max-w-[220px]">{w.url}</TableCell>
                  <TableCell><StatusBadge status={w.status} /></TableCell>
                  <TableCell>{w.attempts}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(w.lastAttempt).toLocaleTimeString()}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{w.nextRetry ? new Date(w.nextRetry).toLocaleTimeString() : "—"}</TableCell>
                  <TableCell className="font-mono text-xs">{w.responseCode ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast.success("Webhook retry queued")}>
                      <RefreshCw className="h-3.5 w-3.5 mr-1" /> Retry
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => toast("Payload viewer (mock)")}>
                      <Eye className="h-3.5 w-3.5 mr-1" /> Payload
                    </Button>
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
