import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { scenarios, providers } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/scenarios")({
  component: ScenariosPage,
});

function ScenariosPage() {
  const [q, setQ] = useState("");
  const [list, setList] = useState(scenarios);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    provider: "",
    operation: "",
    trigger: "",
    response: "",
    webhook: "",
    delay: "200",
    failureRate: "0",
    active: true,
  });

  const filtered = list.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.provider || !form.operation) {
      toast.error("Name, provider, and operation are required.");
      return;
    }
    setList((prev) => [
      {
        id: `s${prev.length + 1}`,
        name: form.name,
        provider: form.provider,
        operation: form.operation,
        behavior: form.response || "Success 200",
        failureRate: Number(form.failureRate),
        delayMs: Number(form.delay),
        active: form.active,
      },
      ...prev,
    ]);
    toast.success("Scenario created");
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Scenario Engine</h1>
          <p className="text-sm text-muted-foreground">Define how providers respond, fail, and emit webhooks.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-1.5 h-4 w-4" /> New scenario</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create scenario</DialogTitle>
              <DialogDescription>Configure simulated provider behavior for a specific operation.</DialogDescription>
            </DialogHeader>
            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 grid gap-1.5">
                <Label htmlFor="name">Scenario name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Timeout after 30 seconds" />
              </div>
              <div className="grid gap-1.5">
                <Label>Provider</Label>
                <Select value={form.provider} onValueChange={(v) => setForm({ ...form, provider: v })}>
                  <SelectTrigger><SelectValue placeholder="Select provider" /></SelectTrigger>
                  <SelectContent>
                    {providers.map((p) => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="op">Operation</Label>
                <Input id="op" value={form.operation} onChange={(e) => setForm({ ...form, operation: e.target.value })} placeholder="Transfer" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="trigger">Trigger condition</Label>
                <Input id="trigger" value={form.trigger} onChange={(e) => setForm({ ...form, trigger: e.target.value })} placeholder="amount > 50000" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="resp">Response behavior</Label>
                <Input id="resp" value={form.response} onChange={(e) => setForm({ ...form, response: e.target.value })} placeholder="Fail 402 — Insufficient funds" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="wh">Webhook behavior</Label>
                <Input id="wh" value={form.webhook} onChange={(e) => setForm({ ...form, webhook: e.target.value })} placeholder="Delayed 5s" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="delay">Delay (ms)</Label>
                <Input id="delay" type="number" value={form.delay} onChange={(e) => setForm({ ...form, delay: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="rate">Failure rate (%)</Label>
                <Input id="rate" type="number" min={0} max={100} value={form.failureRate} onChange={(e) => setForm({ ...form, failureRate: e.target.value })} />
              </div>
              <div className="sm:col-span-2 flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Active</p>
                  <p className="text-xs text-muted-foreground">Scenario will match incoming requests.</p>
                </div>
                <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              </div>
              <DialogFooter className="sm:col-span-2">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit">Create scenario</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="border-b p-3">
            <div className="relative max-w-sm">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search scenarios…" className="pl-8 h-9" />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scenario</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Operation</TableHead>
                <TableHead>Behavior</TableHead>
                <TableHead>Failure %</TableHead>
                <TableHead>Delay</TableHead>
                <TableHead className="text-right">Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">No scenarios match your search.</TableCell></TableRow>
              ) : filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-muted-foreground">{s.provider}</TableCell>
                  <TableCell>{s.operation}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{s.behavior}</TableCell>
                  <TableCell>{s.failureRate}%</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{s.delayMs}ms</TableCell>
                  <TableCell className="text-right"><Switch defaultChecked={s.active} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
