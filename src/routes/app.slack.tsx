import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Hash, Plug, PlayCircle, Bell, MessageSquare, CheckCircle2,
  AlertTriangle, Send,
} from "lucide-react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sandboxes } from "@/lib/sandbox-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/slack")({
  component: SlackPage,
});

type Routing = { sandboxId: string; channel: string; alerts: { failures: boolean; replayReady: boolean; fixValidated: boolean } };

const initialRouting: Routing[] = sandboxes.map((s, i) => ({
  sandboxId: s.id,
  channel: ["#pay-alerts", "#mpesa-ops", "#kyc-incidents", "#pay-staging"][i] ?? "#flowsim",
  alerts: { failures: true, replayReady: i % 2 === 0, fixValidated: true },
}));

function SlackPage() {
  const [connected, setConnected] = useState(true);
  const [routing, setRouting] = useState<Routing[]>(initialRouting);

  const update = (sandboxId: string, patch: Partial<Routing>) =>
    setRouting((rs) => rs.map((r) => (r.sandboxId === sandboxId ? { ...r, ...patch } : r)));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <SlackMark className="h-5 w-5" /> Slack
          </h1>
          <p className="text-sm text-muted-foreground">
            Where production failures meet your team. Route alerts per sandbox, then replay straight from the thread.
          </p>
        </div>
        {connected ? (
          <Badge className="bg-success/15 text-success">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Connected to acme-fintech
          </Badge>
        ) : (
          <Button onClick={() => setConnected(true)}>
            <Plug className="h-4 w-4 mr-1.5" /> Connect Slack workspace
          </Button>
        )}
      </div>

      {!connected && (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            Connect Slack to start routing failures and replaying incidents from a thread.
          </CardContent>
        </Card>
      )}

      {connected && (
        <>
          {/* Live preview */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" /> What your team sees
              </CardTitle>
              <CardDescription>An example of how FlowSim posts into a Slack channel.</CardDescription>
            </CardHeader>
            <CardContent className="bg-muted/30 p-4">
              <SlackPreview />
            </CardContent>
          </Card>

          {/* Routing */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" /> Alert routing per sandbox
              </CardTitle>
              <CardDescription>Each sandbox can post to its own channel, with its own alert rules.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y p-0">
              {routing.map((r) => {
                const sb = sandboxes.find((s) => s.id === r.sandboxId)!;
                return (
                  <div key={r.sandboxId} className="grid gap-3 px-4 py-4 md:grid-cols-[1fr_auto] md:items-center">
                    <div className="space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to="/app/sandboxes/$id"
                          params={{ id: sb.id }}
                          className="font-medium text-sm hover:underline"
                        >
                          {sb.name}
                        </Link>
                        <Badge variant="outline" className="text-[10px]">
                          {sb.fidelity}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Label className="text-xs text-muted-foreground">Channel</Label>
                        <div className="relative">
                          <Hash className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            value={r.channel.replace(/^#/, "")}
                            onChange={(e) => update(r.sandboxId, { channel: "#" + e.target.value.replace(/^#/, "") })}
                            className="h-7 w-[180px] pl-6 text-xs"
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 pt-1">
                        <AlertToggle
                          label="New failures"
                          icon={AlertTriangle}
                          checked={r.alerts.failures}
                          onChange={(v) => update(r.sandboxId, { alerts: { ...r.alerts, failures: v } })}
                        />
                        <AlertToggle
                          label="Replay ready"
                          icon={PlayCircle}
                          checked={r.alerts.replayReady}
                          onChange={(v) => update(r.sandboxId, { alerts: { ...r.alerts, replayReady: v } })}
                        />
                        <AlertToggle
                          label="Fix validated"
                          icon={CheckCircle2}
                          checked={r.alerts.fixValidated}
                          onChange={(v) => update(r.sandboxId, { alerts: { ...r.alerts, fixValidated: v } })}
                        />
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => toast.success(`Test alert sent to ${r.channel}`)}>
                      <Send className="h-3.5 w-3.5 mr-1" /> Test
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function AlertToggle({
  label, icon: Icon, checked, onChange,
}: { label: string; icon: typeof AlertTriangle; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-xs">
      <Switch checked={checked} onCheckedChange={onChange} />
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      {label}
    </label>
  );
}

function SlackPreview() {
  return (
    <div className="mx-auto max-w-2xl rounded-lg border bg-background shadow-sm">
      <div className="flex items-center gap-2 border-b px-4 py-2 text-xs">
        <Hash className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-semibold">pay-alerts</span>
        <span className="text-muted-foreground">· 14 members</span>
      </div>
      <div className="space-y-3 p-4">
        <SlackMessage
          author="FlowSim"
          time="10:42 AM"
          body={
            <>
              <div className="flex items-start gap-2 rounded border-l-4 border-destructive bg-destructive/5 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
                <div className="flex-1 text-sm">
                  <div className="font-semibold">38× card_declined (reason=02) — Paystack · Checkout</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    Failed at <span className="font-mono">awaiting_pin</span> · sandbox <span className="font-mono">sb_paystack_main</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <Button size="sm">
                  <PlayCircle className="h-3.5 w-3.5 mr-1" /> Replay in sandbox
                </Button>
                <Button size="sm" variant="outline">Open in FlowSim</Button>
              </div>
            </>
          }
        />
        <SlackMessage
          author="alex"
          time="10:43 AM"
          avatar="A"
          body={<span className="text-sm">replaying now…</span>}
        />
        <SlackMessage
          author="FlowSim"
          time="10:44 AM"
          body={
            <div className="flex items-center gap-2 rounded border-l-4 border-success bg-success/5 p-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="font-medium">Fix validated</span>
              <span className="text-xs text-muted-foreground">replay reached <span className="font-mono">charge_succeeded</span></span>
            </div>
          }
        />
      </div>
    </div>
  );
}

function SlackMessage({
  author, time, body, avatar,
}: { author: string; time: string; body: React.ReactNode; avatar?: string }) {
  return (
    <div className="flex gap-3">
      {avatar ? (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-primary/15 text-sm font-semibold text-primary">
          {avatar}
        </div>
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-foreground">
          <SlackMark className="h-5 w-5 text-background" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold">{author}</span>
          {!avatar && (
            <span className="rounded bg-muted px-1 py-0 text-[9px] font-bold uppercase text-muted-foreground">APP</span>
          )}
          <span className="text-[11px] text-muted-foreground">{time}</span>
        </div>
        <div className="mt-1">{body}</div>
      </div>
    </div>
  );
}

export function SlackMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M5 15a2 2 0 1 1-2-2h2zM6 15a2 2 0 1 1 4 0v5a2 2 0 1 1-4 0zM9 5a2 2 0 1 1 2 2H9zM9 6a2 2 0 1 1 0 4H4a2 2 0 1 1 0-4zM19 9a2 2 0 1 1 2 2h-2zM18 9a2 2 0 1 1-4 0V4a2 2 0 1 1 4 0zM15 19a2 2 0 1 1-2-2h2zM15 18a2 2 0 1 1 0-4h5a2 2 0 1 1 0 4z" />
    </svg>
  );
}
