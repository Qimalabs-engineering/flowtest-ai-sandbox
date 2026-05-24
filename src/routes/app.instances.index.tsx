import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Eye, PlayCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { transactions } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";
import { FailureBadge } from "@/components/failure-badge";
import { getInstanceByTxId, flowDefinitions } from "@/lib/flow-data";
import { sandboxes } from "@/lib/sandbox-data";

export const Route = createFileRoute("/app/instances/")({
  validateSearch: (s: Record<string, unknown>) => ({
    outcome: typeof s.outcome === "string" ? s.outcome : "all",
    sandbox: typeof s.sandbox === "string" ? s.sandbox : "all",
    flow: typeof s.flow === "string" ? s.flow : "all",
  }),
  component: InstancesList,
});

function InstancesList() {
  const search = Route.useSearch();
  const [q, setQ] = useState("");
  const [outcome, setOutcome] = useState(search.outcome);
  const [sandbox, setSandbox] = useState(search.sandbox);
  const [flow, setFlow] = useState(search.flow);

  const rows = useMemo(() => {
    return transactions.map((t) => {
      const inst = getInstanceByTxId(t.id);
      const sb = sandboxes.find((s) => s.provider === t.provider);
      return { t, inst, sb };
    });
  }, []);

  const filtered = rows.filter(({ t, inst, sb }) => {
    if (q && !t.reference.toLowerCase().includes(q.toLowerCase()) && !t.provider.toLowerCase().includes(q.toLowerCase())) return false;
    if (outcome !== "all" && inst?.outcome !== outcome) return false;
    if (sandbox !== "all" && sb?.id !== sandbox) return false;
    if (flow !== "all" && inst?.flowDefinitionId !== flow) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Instances</h1>
        <p className="text-sm text-muted-foreground">
          Every flow execution across your sandboxes — successes, failures, and replays.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center gap-2 border-b p-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search reference or provider…" className="pl-8 h-9" />
            </div>
            <Select value={outcome} onValueChange={setOutcome}>
              <SelectTrigger className="h-9 w-[150px]"><SelectValue placeholder="Outcome" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All outcomes</SelectItem>
                <SelectItem value="success">Successful</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sandbox} onValueChange={setSandbox}>
              <SelectTrigger className="h-9 w-[200px]"><SelectValue placeholder="Sandbox" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sandboxes</SelectItem>
                {sandboxes.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={flow} onValueChange={setFlow}>
              <SelectTrigger className="h-9 w-[180px]"><SelectValue placeholder="Flow" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All flows</SelectItem>
                {flowDefinitions.map((f) => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Sandbox</TableHead>
                <TableHead>Flow</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Started</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">No instances match your filters.</TableCell></TableRow>
              ) : filtered.map(({ t, inst, sb }) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs">{t.reference}</TableCell>
                  <TableCell className="text-muted-foreground">{sb?.name ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{inst?.flowDefinitionId ?? "—"}</TableCell>
                  <TableCell>
                    {inst?.failurePoint ? <FailureBadge instance={inst} /> : <StatusBadge status={t.status} />}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{new Date(t.createdAt).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-1">
                      {inst?.outcome === "failed" && (
                        <Button asChild variant="outline" size="sm">
                          <Link to="/app/replay/$instanceId" params={{ instanceId: inst.id }}>
                            <PlayCircle className="h-3.5 w-3.5 mr-1" /> Replay
                          </Link>
                        </Button>
                      )}
                      <Button asChild variant="ghost" size="sm">
                        <Link to="/app/instances/$id" params={{ id: t.id }}>
                          <Eye className="h-3.5 w-3.5 mr-1" /> View
                        </Link>
                      </Button>
                    </div>
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
