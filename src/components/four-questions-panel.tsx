import { AlertCircle, MapPin, HelpCircle, Wrench, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getFlowDefinition,
  findScenario,
  stateLabel,
  type FlowInstance,
  type SuggestedFix,
} from "@/lib/flow-data";

interface Props {
  instance: FlowInstance;
  className?: string;
}

const fixKindLabel: Record<SuggestedFix["kind"], string> = {
  retry: "Retry",
  fallback: "Fallback",
  config_change: "Config",
  escalate: "Escalate",
};

export function FourQuestionsPanel({ instance, className }: Props) {
  const def = getFlowDefinition(instance.flowDefinitionId);
  if (!def || !instance.failurePoint) {
    return null;
  }
  const fp = instance.failurePoint;
  const scenario = findScenario(def, fp.scenarioId);
  const fixes = (scenario?.suggestedFixes ?? []).filter((f) =>
    f.appliesToStates.includes(fp.atState),
  );

  return (
    <div
      className={cn(
        "grid gap-px overflow-hidden rounded-lg bg-border ring-1 ring-border sm:grid-cols-2",
        className,
      )}
    >
      <Cell
        icon={<AlertCircle className="h-3.5 w-3.5 text-destructive" />}
        title="What happened"
      >
        <div className="space-y-1">
          <div className="font-medium text-foreground">
            {scenario?.webhookEvent ?? fp.atTransitionEvent ?? "Failure"}
          </div>
          <div className="text-muted-foreground">{scenario?.name ?? fp.cause}</div>
          <div className="font-mono text-[11px] text-muted-foreground">
            Code: {fp.providerCode}
          </div>
        </div>
      </Cell>

      <Cell
        icon={<MapPin className="h-3.5 w-3.5 text-warning" />}
        title="Where in the flow"
      >
        <div className="space-y-1">
          <div>
            <span className="text-muted-foreground">State:</span>{" "}
            <span className="font-mono font-medium text-foreground">
              {stateLabel(def, fp.atState)}
            </span>
          </div>
          {fp.atTransitionEvent && (
            <div className="text-muted-foreground">
              Transition: <span className="font-mono">{fp.atTransitionEvent}</span>
            </div>
          )}
          <div className="text-[11px] text-muted-foreground">
            Flow: {def.name} · {def.apiVersion}
          </div>
        </div>
      </Cell>

      <Cell
        icon={<HelpCircle className="h-3.5 w-3.5 text-info" />}
        title="Why"
      >
        <div className="space-y-1">
          <p className="text-foreground/90">{fp.why}</p>
          {scenario && (
            <p className="text-[11px] text-muted-foreground">
              Scenario: <span className="font-mono">{scenario.id}</span>
            </p>
          )}
        </div>
      </Cell>

      <Cell
        icon={<Wrench className="h-3.5 w-3.5 text-primary" />}
        title="What to do"
      >
        {fixes.length === 0 ? (
          <p className="text-muted-foreground">No specific fixes for this state.</p>
        ) : (
          <ol className="space-y-1.5">
            {fixes.map((f, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-0.5 inline-flex h-4 min-w-[2.5rem] items-center justify-center rounded bg-muted px-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {fixKindLabel[f.kind]}
                </span>
                <div>
                  <div className="font-medium text-foreground">{f.title}</div>
                  <div className="text-muted-foreground">{f.detail}</div>
                </div>
              </li>
            ))}
          </ol>
        )}
        <button className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline">
          Open runbook <ExternalLink className="h-3 w-3" />
        </button>
      </Cell>
    </div>
  );
}

function Cell({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card p-3.5 text-xs">
      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {title}
      </div>
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}
