import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Power, Settings2, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader, Pill, StatusPill, Toolbar } from "@/components/admin-ui";
import { adminProviders } from "@/lib/admin-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/providers")({
  component: ProvidersPage,
});

function ProvidersPage() {
  const [list, setList] = useState(adminProviders);

  const toggle = (id: string, next: boolean) => {
    setList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: next ? "enabled" : "disabled" } : p)),
    );
    toast.success(`Provider ${next ? "enabled" : "disabled"}`);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Simulated providers"
        subtitle="Enable, disable, and configure simulated banks, mobile money, and gateways."
        actions={<Button size="sm" variant="outline"><Settings2 className="mr-1.5 h-3.5 w-3.5" /> Defaults</Button>}
      />

      <Toolbar>
        <Pill tone="success">{list.filter((p) => p.status === "enabled").length} enabled</Pill>
        <Pill tone="warning">{list.filter((p) => p.status === "degraded").length} degraded</Pill>
        <Pill tone="muted">{list.filter((p) => p.status === "disabled").length} disabled</Pill>
        <div className="ml-auto text-[11px] text-muted-foreground">{list.length} total</div>
      </Toolbar>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[11px] uppercase tracking-wider">Provider</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Type</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Region</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-right">Usage 24h</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-right">Fail %</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-right">Latency p95</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-right">Enabled</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="text-xs font-medium">{p.name}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">{p.id}</div>
                </TableCell>
                <TableCell><Pill tone="muted" dot={false}>{p.type}</Pill></TableCell>
                <TableCell className="text-xs">{p.region}</TableCell>
                <TableCell><StatusPill status={p.status} /></TableCell>
                <TableCell className="text-right font-mono text-xs tabular-nums">{p.usage24h.toLocaleString()}</TableCell>
                <TableCell className="text-right font-mono text-xs tabular-nums">{p.baseFailureRate}%</TableCell>
                <TableCell className="text-right font-mono text-xs tabular-nums">{p.baseLatencyMs}ms</TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex">
                    <Switch
                      checked={p.status !== "disabled"}
                      onCheckedChange={(v) => toggle(p.id, v)}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toast.success("Opening usage")}>
                      <LineChart className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toast.success("Opening behavior defaults")}>
                      <Power className="h-3.5 w-3.5" />
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
