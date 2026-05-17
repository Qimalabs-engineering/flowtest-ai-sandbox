import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, MoreHorizontal, UserCog, KeyRound, Pause, ArrowRightLeft } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader, Pill, StatusPill, Toolbar } from "@/components/admin-ui";
import { tenants } from "@/lib/admin-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/tenants")({
  component: TenantsPage,
});

function TenantsPage() {
  const [q, setQ] = useState("");
  const [env, setEnv] = useState("all");
  const [status, setStatus] = useState("all");

  const list = useMemo(
    () =>
      tenants.filter((t) => {
        if (q && !`${t.name} ${t.owner} ${t.id}`.toLowerCase().includes(q.toLowerCase())) return false;
        if (env !== "all" && t.environment !== env) return false;
        if (status !== "all" && t.status !== status) return false;
        return true;
      }),
    [q, env, status],
  );

  const act = (label: string, t: string) => toast.success(`${label} — ${t}`);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Tenants"
        subtitle={`${tenants.length} workspaces across all environments.`}
        actions={<Button size="sm">+ Provision tenant</Button>}
      />

      <Toolbar>
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, owner, or tenant ID…"
            className="h-8 pl-8 text-xs"
          />
        </div>
        <Select value={env} onValueChange={setEnv}>
          <SelectTrigger className="h-8 w-[160px] text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All environments</SelectItem>
            <SelectItem value="Test Sandbox">Test Sandbox</SelectItem>
            <SelectItem value="Staging Mirror">Staging Mirror</SelectItem>
            <SelectItem value="Production Replay">Production Replay</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="trialing">Trialing</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto text-[11px] text-muted-foreground">
          Showing <span className="font-mono text-foreground">{list.length}</span> of {tenants.length}
        </div>
      </Toolbar>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[11px] uppercase tracking-wider">Tenant</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Environment</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">API key</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-right">Scenarios</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-right">Tx (24h)</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Created</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((t) => (
              <TableRow key={t.id}>
                <TableCell>
                  <Link
                    to="/admin/tenants/$id"
                    params={{ id: t.id }}
                    className="text-xs font-medium hover:underline"
                  >
                    {t.name}
                  </Link>
                  <div className="font-mono text-[10px] text-muted-foreground">
                    {t.id} · {t.owner}
                  </div>
                </TableCell>
                <TableCell><Pill tone="muted" dot={false}>{t.environment}</Pill></TableCell>
                <TableCell><StatusPill status={t.apiKeyStatus} /></TableCell>
                <TableCell className="text-right font-mono text-xs tabular-nums">{t.activeScenarios}</TableCell>
                <TableCell className="text-right font-mono text-xs tabular-nums">{t.tx24h.toLocaleString()}</TableCell>
                <TableCell><StatusPill status={t.status} /></TableCell>
                <TableCell className="text-xs text-muted-foreground">{t.createdAt}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem className="text-xs" asChild>
                        <Link to="/admin/tenants/$id" params={{ id: t.id }}>View details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-xs" onClick={() => act("Impersonating", t.name)}>
                        <UserCog className="mr-2 h-3.5 w-3.5" /> Impersonate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-xs" onClick={() => act("API key regenerated for", t.name)}>
                        <KeyRound className="mr-2 h-3.5 w-3.5" /> Regenerate API key
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-xs" onClick={() => act("Environment switched for", t.name)}>
                        <ArrowRightLeft className="mr-2 h-3.5 w-3.5" /> Switch environment
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-xs text-destructive" onClick={() => act("Suspended", t.name)}>
                        <Pause className="mr-2 h-3.5 w-3.5" /> Suspend tenant
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
