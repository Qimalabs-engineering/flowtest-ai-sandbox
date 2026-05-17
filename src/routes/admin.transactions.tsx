import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PageHeader, Pill, StatusPill, Toolbar } from "@/components/admin-ui";
import { adminProviders, adminTransactions, tenants } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/transactions")({
  component: TransactionsPage,
});

function TransactionsPage() {
  const [q, setQ] = useState("");
  const [tenant, setTenant] = useState("all");
  const [provider, setProvider] = useState("all");
  const [status, setStatus] = useState("all");
  const [range, setRange] = useState("24h");
  const [open, setOpen] = useState<typeof adminTransactions[number] | null>(null);

  const list = useMemo(
    () =>
      adminTransactions.filter((t) => {
        if (q && !`${t.reference} ${t.scenario ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
        if (tenant !== "all" && t.tenant !== tenant) return false;
        if (provider !== "all" && t.provider !== provider) return false;
        if (status !== "all" && t.status !== status) return false;
        return true;
      }),
    [q, tenant, provider, status],
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Transactions"
        subtitle="Global transaction stream across all tenants."
        actions={<Button size="sm" variant="outline"><Download className="mr-1.5 h-3.5 w-3.5" /> Export</Button>}
      />

      <Toolbar>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="reference, scenario…" className="h-8 pl-8 text-xs" />
        </div>
        <Select value={tenant} onValueChange={setTenant}>
          <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tenants</SelectItem>
            {tenants.map((t) => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={provider} onValueChange={setProvider}>
          <SelectTrigger className="h-8 w-[160px] text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All providers</SelectItem>
            {adminProviders.map((p) => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-8 w-[120px] text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="successful">Successful</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reversed">Reversed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="h-8 w-[100px] text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last 1h</SelectItem>
            <SelectItem value="24h">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7d</SelectItem>
          </SelectContent>
        </Select>
        <Pill tone="muted" dot={false} className="ml-auto">{list.length} rows</Pill>
      </Toolbar>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[11px] uppercase tracking-wider">Reference</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Tenant</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Provider</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-right">Amount</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Scenario</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-right">Latency</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.slice(0, 40).map((t) => (
              <TableRow key={t.id} className="cursor-pointer" onClick={() => setOpen(t)}>
                <TableCell className="font-mono text-[11px]">{t.reference}</TableCell>
                <TableCell className="text-xs">{t.tenant}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{t.provider}</TableCell>
                <TableCell className="text-right font-mono text-xs tabular-nums">{t.currency} {t.amount.toLocaleString()}</TableCell>
                <TableCell><StatusPill status={t.status} /></TableCell>
                <TableCell className="text-[11px] text-muted-foreground">{t.scenario ?? "—"}</TableCell>
                <TableCell className="text-right font-mono text-xs tabular-nums">{t.latencyMs}ms</TableCell>
                <TableCell className="text-right text-[11px] text-muted-foreground">{new Date(t.createdAt).toLocaleTimeString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          {open && (
            <>
              <SheetHeader>
                <SheetTitle className="font-mono text-sm">{open.reference}</SheetTitle>
                <SheetDescription>{open.tenant} · {open.provider}</SheetDescription>
              </SheetHeader>
              <div className="mt-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <Field k="Status" v={<StatusPill status={open.status} />} />
                  <Field k="Amount" v={`${open.currency} ${open.amount.toLocaleString()}`} />
                  <Field k="Latency" v={`${open.latencyMs}ms`} />
                  <Field k="Scenario" v={open.scenario ?? "—"} />
                  <Field k="Created" v={new Date(open.createdAt).toLocaleString()} />
                  <Field k="Internal ID" v={<span className="font-mono">{open.id}</span>} />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Request payload</div>
                  <pre className="mt-1 max-h-48 overflow-auto rounded-md border bg-muted/40 p-2 font-mono text-[10px] leading-relaxed">
{JSON.stringify({
  amount: open.amount,
  currency: open.currency,
  provider: open.provider,
  metadata: { tenant_id: open.tenant, ref: open.reference },
}, null, 2)}
                  </pre>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Provider response</div>
                  <pre className="mt-1 max-h-48 overflow-auto rounded-md border bg-muted/40 p-2 font-mono text-[10px] leading-relaxed">
{JSON.stringify({
  status: open.status,
  code: open.status === "failed" ? 402 : 200,
  scenario_matched: open.scenario,
  duration_ms: open.latencyMs,
}, null, 2)}
                  </pre>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Field({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="mt-0.5">{v}</div>
    </div>
  );
}
