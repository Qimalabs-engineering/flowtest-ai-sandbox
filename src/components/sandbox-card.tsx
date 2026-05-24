import { Link } from "@tanstack/react-router";
import { Activity, AlertTriangle, ArrowRight, CircleDot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fidelityLabels, type Sandbox } from "@/lib/sandbox-data";

const statusStyles: Record<Sandbox["status"], string> = {
  healthy: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  degraded: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  paused: "bg-muted text-muted-foreground border-border",
};

export function SandboxCard({ sb }: { sb: Sandbox }) {
  const fid = fidelityLabels[sb.fidelity];
  const failRate = sb.instances24h > 0 ? Math.round((sb.failures24h / sb.instances24h) * 1000) / 10 : 0;

  return (
    <Link
      to="/app/sandboxes/$id"
      params={{ id: sb.id }}
      className="group block focus:outline-none"
    >
      <Card className="transition-shadow group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ring">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <CardTitle className="text-base truncate">{sb.name}</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground truncate">{sb.provider}</p>
            </div>
            <Badge variant="outline" className={statusStyles[sb.status]}>
              <CircleDot className="mr-1 h-3 w-3" />
              {sb.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <Badge variant="secondary" className="font-normal">{fid.label}</Badge>
            <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{fid.blurb}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-md border bg-muted/30 p-2 text-xs">
            <Stat icon={<Activity className="h-3 w-3" />} label="24h" value={sb.instances24h.toLocaleString()} />
            <Stat icon={<AlertTriangle className="h-3 w-3" />} label="fail %" value={`${failRate}%`} tone={failRate > 10 ? "warn" : "default"} />
            <Stat label="fix ✓" value={`${sb.fixValidated24h}`} tone="ok" />
          </div>
          <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
            <span className="truncate">{sb.flowIds.length} flow{sb.flowIds.length === 1 ? "" : "s"}</span>
            <span className="inline-flex items-center gap-1 text-foreground/70 group-hover:text-foreground">
              Open <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function Stat({ icon, label, value, tone = "default" }: { icon?: React.ReactNode; label: string; value: string; tone?: "default" | "warn" | "ok" }) {
  const toneCls =
    tone === "warn" ? "text-amber-700 dark:text-amber-400"
    : tone === "ok" ? "text-emerald-700 dark:text-emerald-400"
    : "text-foreground";
  return (
    <div className="flex flex-col">
      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
        {icon}{label}
      </span>
      <span className={`mt-0.5 text-sm font-medium ${toneCls}`}>{value}</span>
    </div>
  );
}
