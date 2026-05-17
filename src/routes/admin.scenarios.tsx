import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Zap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { PageHeader, Pill, StatusPill, Toolbar } from "@/components/admin-ui";
import { adminProviders, adminScenarios } from "@/lib/admin-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/scenarios")({
  component: ScenariosAdmin,
});

function ScenariosAdmin() {
  const [list, setList] = useState(adminScenarios);
  const [scope, setScope] = useState<"all" | "global" | "tenant">("all");
  const [forceOpen, setForceOpen] = useState(false);

  const filtered = list.filter((s) => scope === "all" || s.scope === scope);

  const forceOutage = (e: React.FormEvent) => {
    e.preventDefault();
    setForceOpen(false);
    toast.success("Outage scenario forced for 10 minutes");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Scenario control"
        subtitle="Global overrides and forced behaviors across all tenants and providers."
        actions={
          <>
            <Button size="sm" variant="outline"><Plus className="mr-1.5 h-3.5 w-3.5" /> Template</Button>
            <Dialog open={forceOpen} onOpenChange={setForceOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Zap className="mr-1.5 h-3.5 w-3.5" /> Force scenario</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Force scenario</DialogTitle>
                  <DialogDescription>This will override tenant scenarios for the selected duration.</DialogDescription>
                </DialogHeader>
                <form onSubmit={forceOutage} className="grid gap-3">
                  <div className="grid gap-1.5">
                    <Label className="text-xs">Provider</Label>
                    <Select defaultValue={adminProviders[1].name}>
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {adminProviders.map((p) => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-1.5">
                      <Label className="text-xs">Behavior</Label>
                      <Input defaultValue="Timeout 30s" className="h-9" />
                    </div>
                    <div className="grid gap-1.5">
                      <Label className="text-xs">Duration</Label>
                      <Select defaultValue="10m">
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5m">5 minutes</SelectItem>
                          <SelectItem value="10m">10 minutes</SelectItem>
                          <SelectItem value="30m">30 minutes</SelectItem>
                          <SelectItem value="1h">1 hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="text-xs">Condition</Label>
                    <Input defaultValue="operation = transfer" className="h-9 font-mono text-xs" />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setForceOpen(false)}>Cancel</Button>
                    <Button type="submit"><Zap className="mr-1.5 h-3.5 w-3.5" /> Force now</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <Toolbar>
        <Select value={scope} onValueChange={(v: typeof scope) => setScope(v)}>
          <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All scopes</SelectItem>
            <SelectItem value="global">Global</SelectItem>
            <SelectItem value="tenant">Tenant</SelectItem>
          </SelectContent>
        </Select>
        <Pill tone="warning">{list.filter((s) => s.forcedUntil).length} actively forced</Pill>
        <div className="ml-auto text-[11px] text-muted-foreground">{filtered.length} scenarios</div>
      </Toolbar>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[11px] uppercase tracking-wider">Scenario</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Scope</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Provider</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Condition</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Behavior</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Duration</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-right">Priority</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-right">Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <div className="text-xs font-medium">{s.name}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">
                    {s.id}{s.tenant ? ` · ${s.tenant}` : ""}
                    {s.forcedUntil && (
                      <span className="ml-1.5 text-warning">
                        · forced until {new Date(s.forcedUntil).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Pill tone={s.scope === "global" ? "info" : "muted"} dot={false}>{s.scope}</Pill>
                </TableCell>
                <TableCell className="text-xs">{s.provider}</TableCell>
                <TableCell className="font-mono text-[11px] text-muted-foreground">{s.condition}</TableCell>
                <TableCell className="text-xs">{s.behavior}</TableCell>
                <TableCell className="text-xs">{s.duration}</TableCell>
                <TableCell className="text-right font-mono text-xs tabular-nums">{s.priority}</TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex">
                    <Switch
                      checked={s.active}
                      onCheckedChange={(v) => {
                        setList((prev) => prev.map((p) => (p.id === s.id ? { ...p, active: v } : p)));
                        toast.success(`${s.name} ${v ? "enabled" : "paused"}`);
                      }}
                    />
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

// Inputs/labels referenced
