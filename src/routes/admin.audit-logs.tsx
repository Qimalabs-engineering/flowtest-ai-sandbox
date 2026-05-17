import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { PageHeader, Pill, Toolbar } from "@/components/admin-ui";
import { auditLogs } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/audit-logs")({
  component: AuditLogsPage,
});

function AuditLogsPage() {
  const [q, setQ] = useState("");
  const [admin, setAdmin] = useState("all");

  const list = auditLogs.filter((l) => {
    if (q && !`${l.action} ${l.resource} ${l.resourceId} ${l.tenant ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (admin !== "all" && l.admin !== admin) return false;
    return true;
  });

  const adminUsers = Array.from(new Set(auditLogs.map((l) => l.admin)));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Audit logs"
        subtitle="Every administrator action, tamper-evident and immutable."
        actions={<Button size="sm" variant="outline"><Download className="mr-1.5 h-3.5 w-3.5" /> Export CSV</Button>}
      />

      <Toolbar>
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="action, resource, tenant…" className="h-8 pl-8 text-xs" />
        </div>
        <Select value={admin} onValueChange={setAdmin}>
          <SelectTrigger className="h-8 w-[180px] text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All operators</SelectItem>
            {adminUsers.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
        <Pill tone="muted" dot={false} className="ml-auto">{list.length} events</Pill>
      </Toolbar>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[11px] uppercase tracking-wider">Timestamp</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Operator</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Action</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Resource</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Tenant</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Metadata</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-mono text-[11px] text-muted-foreground">
                  {new Date(l.timestamp).toLocaleString()}
                </TableCell>
                <TableCell className="text-xs">{l.admin}</TableCell>
                <TableCell>
                  <span className="font-mono text-[11px]">{l.action}</span>
                </TableCell>
                <TableCell>
                  <div className="text-xs capitalize">{l.resource}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">{l.resourceId}</div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{l.tenant ?? "—"}</TableCell>
                <TableCell className="font-mono text-[10px] text-muted-foreground">
                  ip={l.metadata.ip} ua={l.metadata.ua}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
