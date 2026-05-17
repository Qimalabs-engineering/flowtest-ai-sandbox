import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw, Power, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader, Pill, StatusPill, Toolbar } from "@/components/admin-ui";
import { adminIntegrations } from "@/lib/admin-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/integrations")({
  component: IntegrationsAdmin,
});

function IntegrationsAdmin() {
  const counts = {
    healthy: adminIntegrations.filter((i) => i.status === "healthy").length,
    degraded: adminIntegrations.filter((i) => i.status === "degraded").length,
    error: adminIntegrations.filter((i) => i.status === "error").length,
    disabled: adminIntegrations.filter((i) => i.status === "disabled").length,
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Integrations control"
        subtitle="Status of all tenant integrations across Datadog, GitHub, Slack, Jira, and ClickUp."
      />

      <Toolbar>
        <Pill tone="success">{counts.healthy} healthy</Pill>
        <Pill tone="warning">{counts.degraded} degraded</Pill>
        <Pill tone="danger">{counts.error} errored</Pill>
        <Pill tone="muted">{counts.disabled} disabled</Pill>
      </Toolbar>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[11px] uppercase tracking-wider">Integration</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Tenant</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Kind</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Last sync</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-right">Errors 24h</TableHead>
              <TableHead className="text-right text-[11px] uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminIntegrations.map((i) => (
              <TableRow key={i.id}>
                <TableCell>
                  <div className="text-xs font-medium">{i.name}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">{i.id}</div>
                </TableCell>
                <TableCell className="text-xs">{i.tenant}</TableCell>
                <TableCell><Pill tone="muted" dot={false}>{i.kind}</Pill></TableCell>
                <TableCell><StatusPill status={i.status} /></TableCell>
                <TableCell className="text-xs text-muted-foreground">{i.lastSync}</TableCell>
                <TableCell className={`text-right font-mono text-xs tabular-nums ${i.errors24h > 0 ? "text-destructive" : ""}`}>
                  {i.errors24h}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => toast.success(`${i.name} re-syncing`)}>
                      <RefreshCw className="mr-1 h-3 w-3" /> Re-sync
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => toast.success("Opening logs")}>
                      <FileText className="mr-1 h-3 w-3" /> Logs
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-destructive" onClick={() => toast.success(`${i.name} disabled`)}>
                      <Power className="mr-1 h-3 w-3" /> Disable
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
