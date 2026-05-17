import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  actions,
  meta,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b pb-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
        )}
        {meta && <div className="mt-2 flex flex-wrap gap-2">{meta}</div>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "muted";
const toneMap: Record<Tone, string> = {
  neutral: "bg-foreground/5 text-foreground ring-foreground/10",
  success: "bg-success/10 text-success ring-success/20",
  warning: "bg-warning/15 text-warning-foreground ring-warning/30 dark:text-warning",
  danger: "bg-destructive/10 text-destructive ring-destructive/20",
  info: "bg-info/10 text-info ring-info/20",
  muted: "bg-muted text-muted-foreground ring-border",
};
const dotMap: Record<Tone, string> = {
  neutral: "bg-foreground/60",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  info: "bg-info",
  muted: "bg-muted-foreground",
};

export function Pill({
  tone = "neutral",
  children,
  dot = true,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        toneMap[tone],
        className,
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dotMap[tone])} />}
      {children}
    </span>
  );
}

export function StatCard({
  label,
  value,
  delta,
  tone = "neutral",
  hint,
}: {
  label: string;
  value: ReactNode;
  delta?: string;
  tone?: Tone;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-3 transition-colors hover:border-foreground/20">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {delta && <Pill tone={tone} dot={false}>{delta}</Pill>}
      </div>
      <div className="mt-1.5 font-mono text-xl font-semibold tabular-nums text-foreground">
        {value}
      </div>
      {hint && <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
}

const statusTone: Record<string, Tone> = {
  active: "success",
  enabled: "success",
  healthy: "success",
  operational: "success",
  on: "success",
  succeeded: "success",
  resolved: "success",
  delivered: "success",
  trialing: "info",
  rotating: "info",
  rollout: "info",
  running: "info",
  investigating: "info",
  queued: "muted",
  off: "muted",
  disabled: "muted",
  inactive: "muted",
  mitigated: "info",
  degraded: "warning",
  pending: "warning",
  retrying: "warning",
  open: "warning",
  failed: "danger",
  error: "danger",
  revoked: "danger",
  suspended: "danger",
  down: "danger",
  reversed: "danger",
  sev1: "danger",
  sev2: "warning",
  sev3: "info",
};

export function StatusPill({ status }: { status: string }) {
  const tone = statusTone[status.toLowerCase()] ?? "neutral";
  return <Pill tone={tone}>{status.replace(/_/g, " ")}</Pill>;
}

export function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-2">
      {children}
    </div>
  );
}

export function EmptyHint({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-dashed bg-muted/30 p-6 text-center text-xs text-muted-foreground">
      {children}
    </div>
  );
}
