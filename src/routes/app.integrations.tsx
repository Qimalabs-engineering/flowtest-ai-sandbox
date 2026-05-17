import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Settings2, Plug, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { integrations, type Integration, type IntegrationCategory } from "@/lib/ops-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/app/integrations")({
  component: IntegrationsPage,
});

const categories: IntegrationCategory[] = ["Observability", "Code", "Communication", "Issue Tracking"];

function statusMeta(s: Integration["status"]) {
  if (s === "connected") return { label: "Connected", cls: "bg-success/10 text-success ring-success/20" };
  if (s === "error") return { label: "Error", cls: "bg-destructive/10 text-destructive ring-destructive/20" };
  return { label: "Not connected", cls: "bg-muted text-muted-foreground ring-border" };
}

function IntegrationsPage() {
  const [selected, setSelected] = useState<Integration | null>(null);
  const grouped = useMemo(() => {
    return categories.map((c) => ({ category: c, items: integrations.filter((i) => i.category === c) }));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Plug className="h-5 w-5 text-primary" /> Integrations
          </h1>
          <p className="text-sm text-muted-foreground">Connect observability, code, communication and issue trackers so FlowSim can investigate failures end-to-end.</p>
        </div>
      </div>

      <Tabs defaultValue="All">
        <TabsList>
          <TabsTrigger value="All">All</TabsTrigger>
          {categories.map((c) => <TabsTrigger key={c} value={c}>{c}</TabsTrigger>)}
        </TabsList>
        <TabsContent value="All" className="mt-4 space-y-8">
          {grouped.map((g) => (
            <section key={g.category} className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{g.category}</h2>
              <Grid items={g.items} onConnect={setSelected} />
            </section>
          ))}
        </TabsContent>
        {categories.map((c) => (
          <TabsContent key={c} value={c} className="mt-4">
            <Grid items={integrations.filter((i) => i.category === c)} onConnect={setSelected} />
          </TabsContent>
        ))}
      </Tabs>

      <ConnectModal integration={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function Grid({ items, onConnect }: { items: Integration[]; onConnect: (i: Integration) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((i) => {
        const s = statusMeta(i.status);
        const hasDetail = i.id === "github" || i.id === "datadog";
        return (
          <Card key={i.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg text-white text-xs font-semibold", i.accent)}>
                  {i.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base flex items-center gap-2">{i.name}</CardTitle>
                  <CardDescription className="text-xs mt-0.5 line-clamp-2">{i.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="mt-auto space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 ring-1 ring-inset", s.cls)}>
                  {i.status === "error" && <AlertCircle className="h-3 w-3" />}
                  {i.status === "connected" && <Check className="h-3 w-3" />}
                  {s.label}
                </span>
                <span className="text-muted-foreground">{i.lastSynced ? `Synced ${i.lastSynced}` : "Never synced"}</span>
              </div>
              <div className="flex gap-2">
                {i.status === "connected" ? (
                  <>
                    {hasDetail ? (
                      <Button asChild size="sm" variant="outline" className="flex-1">
                        <Link to="/app/integrations/$id" params={{ id: i.id }}><Settings2 className="h-3.5 w-3.5 mr-1" /> Configure</Link>
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => onConnect(i)}>
                        <Settings2 className="h-3.5 w-3.5 mr-1" /> Configure
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => toast.success(`${i.name} disconnected (mock)`) }>Disconnect</Button>
                  </>
                ) : (
                  <Button size="sm" className="flex-1" onClick={() => onConnect(i)}>Connect</Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function ConnectModal({ integration, onClose }: { integration: Integration | null; onClose: () => void }) {
  const open = !!integration;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        {integration && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg text-white text-xs font-semibold", integration.accent)}>{integration.initials}</div>
                <div>
                  <DialogTitle>Connect {integration.name}</DialogTitle>
                  <DialogDescription>{integration.description}</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success(`${integration.name} connected (mock)`);
                onClose();
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="token">API key / token</Label>
                <Input id="token" type="password" placeholder="••••••••••••••••" required />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="org">Organization / workspace</Label>
                  <Input id="org" placeholder="acme-fintech" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="proj">Default project</Label>
                  <Input id="proj" placeholder="payments-core" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Environment mapping</Label>
                <Select defaultValue="sandbox">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sandbox">Sandbox</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production-simulation">Production sim</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="rounded-md border bg-muted/40 p-3 text-xs">
                <p className="font-medium mb-1">Permissions summary</p>
                <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">
                  <li>Read logs, traces and metrics</li>
                  <li>Read repositories and pull requests</li>
                  <li>Post messages on your behalf (where applicable)</li>
                </ul>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                <Button type="submit">Authorize & connect</Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
