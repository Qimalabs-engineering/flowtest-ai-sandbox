import { cn } from "@/lib/utils";

type Tone = "success" | "destructive" | "warning" | "info" | "muted" | "primary";

const map: Record<string, Tone> = {
  successful: "success",
  delivered: "success",
  active: "success",
  failed: "destructive",
  reversed: "destructive",
  inactive: "muted",
  pending: "warning",
  retrying: "warning",
  degraded: "warning",
  sandbox: "info",
  staging: "warning",
  "production-simulation": "primary",
};

const toneClass: Record<Tone, string> = {
  success: "bg-success/10 text-success ring-success/20",
  destructive: "bg-destructive/10 text-destructive ring-destructive/20",
  warning: "bg-warning/15 text-warning-foreground ring-warning/30 dark:text-warning",
  info: "bg-info/10 text-info ring-info/20",
  muted: "bg-muted text-muted-foreground ring-border",
  primary: "bg-primary/10 text-primary ring-primary/20",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone = map[status] ?? "muted";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize",
        toneClass[tone],
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", {
        "bg-success": tone === "success",
        "bg-destructive": tone === "destructive",
        "bg-warning": tone === "warning",
        "bg-info": tone === "info",
        "bg-muted-foreground": tone === "muted",
        "bg-primary": tone === "primary",
      })} />
      {status.replace(/-/g, " ")}
    </span>
  );
}
