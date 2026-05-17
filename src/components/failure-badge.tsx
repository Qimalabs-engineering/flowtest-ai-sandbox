import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFlowDefinition, findScenario, type FlowInstance } from "@/lib/flow-data";

interface FailureBadgeProps {
  instance: FlowInstance;
  className?: string;
  /** Compact: just icon + code. Default shows state + code. */
  compact?: boolean;
}

export function FailureBadge({ instance, className, compact }: FailureBadgeProps) {
  if (!instance.failurePoint) {
    return (
      <span className={cn("inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground", className)}>
        {instance.outcome}
      </span>
    );
  }
  const def = getFlowDefinition(instance.flowDefinitionId);
  const scenario = def ? findScenario(def, instance.failurePoint.scenarioId) : undefined;
  const stateLabel = def?.states.find((s) => s.id === instance.failurePoint!.atState)?.label ?? instance.failurePoint.atState;

  return (
    <span
      title={scenario?.name ?? instance.failurePoint.cause}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive ring-1 ring-inset ring-destructive/20",
        className,
      )}
    >
      <AlertTriangle className="h-3 w-3" />
      {compact ? (
        <span className="font-mono">{instance.failurePoint.providerCode}</span>
      ) : (
        <>
          <span>at</span>
          <span className="font-mono">{stateLabel}</span>
          <span className="text-destructive/70">·</span>
          <span className="font-mono">{instance.failurePoint.providerCode}</span>
        </>
      )}
    </span>
  );
}
