import { CheckCircle2, AlertCircle, MinusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Status = "validated" | "failed" | "pending" | "none";

const map: Record<Status, { label: string; cls: string; Icon: typeof CheckCircle2 }> = {
  validated: {
    label: "Fix validated",
    cls: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    Icon: CheckCircle2,
  },
  failed: {
    label: "Fix failed",
    cls: "bg-destructive/10 text-destructive border-destructive/30",
    Icon: AlertCircle,
  },
  pending: {
    label: "Replay pending",
    cls: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    Icon: MinusCircle,
  },
  none: {
    label: "Not replayed",
    cls: "bg-muted text-muted-foreground border-border",
    Icon: MinusCircle,
  },
};

export function FixValidationBadge({ status }: { status: Status }) {
  const { label, cls, Icon } = map[status];
  return (
    <Badge variant="outline" className={cls}>
      <Icon className="mr-1 h-3 w-3" />
      {label}
    </Badge>
  );
}
