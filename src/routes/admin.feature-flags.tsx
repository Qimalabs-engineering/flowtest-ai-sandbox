import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader, Pill, StatusPill, Toolbar } from "@/components/admin-ui";
import { featureFlags } from "@/lib/admin-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/feature-flags")({
  component: FeatureFlagsPage,
});

function FeatureFlagsPage() {
  const [flags, setFlags] = useState(featureFlags);

  const update = (id: string, patch: Partial<(typeof flags)[number]>) => {
    setFlags((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Feature flags" subtitle="Roll out, restrict, and kill-switch FlowSim capabilities." />

      <Toolbar>
        <Pill tone="success">{flags.filter((f) => f.status === "on").length} fully on</Pill>
        <Pill tone="info">{flags.filter((f) => f.status === "rollout").length} in rollout</Pill>
        <Pill tone="muted">{flags.filter((f) => f.status === "off").length} disabled</Pill>
      </Toolbar>

      <div className="space-y-2.5">
        {flags.map((f) => (
          <div key={f.id} className="rounded-lg border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold">{f.name}</h3>
                  <StatusPill status={f.status} />
                  <Pill tone="muted" dot={false}>{f.environment}</Pill>
                  <Pill tone="muted" dot={false}>owner: {f.owner}</Pill>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{f.description}</p>
                <div className="font-mono text-[10px] text-muted-foreground">{f.id}</div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Select
                  value={f.environment}
                  onValueChange={(v: typeof f.environment) => {
                    update(f.id, { environment: v });
                    toast.success(`${f.name} scope → ${v}`);
                  }}
                >
                  <SelectTrigger className="h-8 w-[160px] text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All environments</SelectItem>
                    <SelectItem value="Test Sandbox">Test Sandbox</SelectItem>
                    <SelectItem value="Staging Mirror">Staging Mirror</SelectItem>
                    <SelectItem value="Production Replay">Production Replay</SelectItem>
                  </SelectContent>
                </Select>
                <Switch
                  checked={f.status !== "off"}
                  onCheckedChange={(v) => {
                    update(f.id, { status: v ? (f.rollout === 100 ? "on" : "rollout") : "off" });
                    toast.success(`${f.name} ${v ? "enabled" : "disabled"}`);
                  }}
                />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Rollout</span>
                  <span className="font-mono tabular-nums">{f.rollout}%</span>
                </div>
                <Slider
                  value={[f.rollout]}
                  max={100}
                  step={5}
                  onValueChange={(v) =>
                    update(f.id, {
                      rollout: v[0],
                      status: f.status === "off" ? "off" : v[0] === 100 ? "on" : v[0] === 0 ? "off" : "rollout",
                    })
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
