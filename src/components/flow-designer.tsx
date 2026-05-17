import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { FlowDefinition, FlowState, FlowTransition } from "@/lib/flow-data";

const COL_W = 180;
const ROW_H = 90;
const NODE_W = 132;
const NODE_H = 52;
const PAD = 24;

export interface FlowDesignerProps {
  definition: FlowDefinition;
  /** Highlight a single failure scenario: dim normal transitions, light failure path. */
  scenarioId?: string;
  /** Mark a specific state as the failure point (red ring + pulse). */
  failureStateId?: string;
  /** States the actual instance traveled (drawn in solid, others faint). Optional. */
  traveledStates?: string[];
  /** The transition event that triggered failure (for emphasis). */
  failureTransitionEvent?: string;
  /** Currently active state (replay playhead). */
  activeStateId?: string;
  /** Show the happy path as a faint blue track. */
  showHappyPath?: boolean;
  /** State id where the actual path diverged from happy path. */
  divergenceStateId?: string;
  className?: string;
}

function stateColors(kind: FlowState["kind"]) {
  switch (kind) {
    case "initial":
      return "fill-[color:var(--color-card)] stroke-[color:var(--color-border)]";
    case "intermediate":
      return "fill-[color:var(--color-card)] stroke-[color:var(--color-border)]";
    case "terminal_success":
      return "fill-[color:color-mix(in_oklab,var(--color-success)_15%,var(--color-card))] stroke-[color:var(--color-success)]";
    case "terminal_failure":
      return "fill-[color:color-mix(in_oklab,var(--color-destructive)_15%,var(--color-card))] stroke-[color:var(--color-destructive)]";
  }
}

export function FlowDesigner({
  definition,
  scenarioId,
  failureStateId,
  traveledStates,
  failureTransitionEvent,
  activeStateId,
  showHappyPath,
  divergenceStateId,
  className,
}: FlowDesignerProps) {
  const { width, height, nodes } = useMemo(() => {
    const cols = Math.max(...definition.states.map((s) => s.col)) + 1;
    const rows = Math.max(...definition.states.map((s) => s.row)) + 1;
    const w = cols * COL_W + PAD * 2;
    const h = rows * ROW_H + PAD * 2;
    const nodes = new Map<string, { x: number; y: number; cx: number; cy: number }>();
    for (const s of definition.states) {
      const x = PAD + s.col * COL_W + (COL_W - NODE_W) / 2;
      const y = PAD + s.row * ROW_H + (ROW_H - NODE_H) / 2;
      nodes.set(s.id, { x, y, cx: x + NODE_W / 2, cy: y + NODE_H / 2 });
    }
    return { width: w, height: h, nodes };
  }, [definition]);

  const happyEdges = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i < definition.happyPath.length - 1; i++) {
      set.add(`${definition.happyPath[i]}->${definition.happyPath[i + 1]}`);
    }
    return set;
  }, [definition]);

  const traveledSet = traveledStates ? new Set(traveledStates) : null;
  const traveledEdges = useMemo(() => {
    if (!traveledStates || traveledStates.length < 2) return new Set<string>();
    const set = new Set<string>();
    for (let i = 0; i < traveledStates.length - 1; i++) {
      set.add(`${traveledStates[i]}->${traveledStates[i + 1]}`);
    }
    return set;
  }, [traveledStates]);

  function edgePath(t: FlowTransition) {
    const a = nodes.get(t.from);
    const b = nodes.get(t.to);
    if (!a || !b) return "";
    const x1 = a.x + NODE_W;
    const y1 = a.cy;
    const x2 = b.x;
    const y2 = b.cy;
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  }

  function transitionEmphasis(t: FlowTransition): {
    cls: string;
    strokeDasharray?: string;
    opacity: number;
    label?: boolean;
  } {
    const key = `${t.from}->${t.to}`;
    const isFailure = t.kind === "failure";
    const isScenarioActive =
      !!scenarioId && isFailure && t.scenarioId === scenarioId;
    const isScenarioMode = !!scenarioId;
    const isTraveled = traveledEdges.has(key);
    const isFailureLine =
      !!failureTransitionEvent &&
      isFailure &&
      t.event === failureTransitionEvent &&
      isTraveled;

    if (isScenarioMode) {
      if (isScenarioActive) {
        return {
          cls: "stroke-[color:var(--color-destructive)]",
          strokeDasharray: "6 4",
          opacity: 1,
          label: true,
        };
      }
      return {
        cls: isFailure
          ? "stroke-[color:var(--color-destructive)]"
          : "stroke-[color:var(--color-muted-foreground)]",
        strokeDasharray: isFailure ? "4 4" : undefined,
        opacity: 0.18,
      };
    }

    if (traveledStates) {
      if (isFailureLine) {
        return {
          cls: "stroke-[color:var(--color-destructive)]",
          strokeDasharray: "6 4",
          opacity: 1,
          label: true,
        };
      }
      if (isTraveled) {
        return {
          cls: "stroke-[color:var(--color-primary)]",
          opacity: 1,
          label: true,
        };
      }
      return {
        cls: isFailure
          ? "stroke-[color:var(--color-destructive)]"
          : "stroke-[color:var(--color-muted-foreground)]",
        strokeDasharray: isFailure ? "4 4" : undefined,
        opacity: 0.18,
      };
    }

    return {
      cls: isFailure
        ? "stroke-[color:var(--color-destructive)]"
        : "stroke-[color:var(--color-muted-foreground)]",
      strokeDasharray: isFailure ? "4 4" : undefined,
      opacity: isFailure ? 0.7 : 0.55,
      label: true,
    };
  }

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ minWidth: width, width: "100%", height }}
        className="block"
        role="img"
        aria-label={`${definition.name} flow graph`}
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-[color:var(--color-muted-foreground)]" />
          </marker>
          <marker
            id="arrow-fail"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-[color:var(--color-destructive)]" />
          </marker>
          <marker
            id="arrow-active"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-[color:var(--color-primary)]" />
          </marker>
        </defs>

        {/* Happy-path track underlay */}
        {showHappyPath &&
          definition.transitions
            .filter((t) => happyEdges.has(`${t.from}->${t.to}`))
            .map((t, i) => (
              <path
                key={`hp-${i}`}
                d={edgePath(t)}
                fill="none"
                strokeWidth={8}
                className="stroke-[color:var(--color-info)]"
                opacity={0.12}
              />
            ))}

        {/* Transitions */}
        {definition.transitions.map((t, i) => {
          const em = transitionEmphasis(t);
          const isFail = t.kind === "failure" && em.opacity > 0.5;
          const isActive =
            traveledStates && traveledEdges.has(`${t.from}->${t.to}`) && !isFail;
          const marker = isFail
            ? "url(#arrow-fail)"
            : isActive
            ? "url(#arrow-active)"
            : "url(#arrow)";
          const a = nodes.get(t.from);
          const b = nodes.get(t.to);
          const lx = a && b ? (a.x + NODE_W + b.x) / 2 : 0;
          const ly = a && b ? (a.cy + b.cy) / 2 - 8 : 0;

          return (
            <g key={`tr-${i}`} opacity={em.opacity}>
              <path
                d={edgePath(t)}
                fill="none"
                strokeWidth={isFail || isActive ? 2 : 1.5}
                strokeDasharray={em.strokeDasharray}
                markerEnd={marker}
                className={cn(em.cls, em.strokeDasharray && "fs-dash-flow")}
              />
              {em.label && (
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  className={cn(
                    "fill-[color:var(--color-muted-foreground)] font-mono",
                    isFail && "fill-[color:var(--color-destructive)]",
                  )}
                  fontSize={9}
                  style={{ paintOrder: "stroke", stroke: "var(--color-background)", strokeWidth: 3, strokeLinejoin: "round" }}
                >
                  {t.event}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {definition.states.map((s) => {
          const n = nodes.get(s.id)!;
          const isFailurePoint = failureStateId === s.id;
          const isActive = activeStateId === s.id;
          const isTraveled = traveledSet?.has(s.id);
          const isDivergence = divergenceStateId === s.id;
          const dim = (scenarioId || traveledStates) && !isTraveled && !isFailurePoint && scenarioId !== undefined ? 0.4 : 1;
          return (
            <g key={s.id} opacity={dim}>
              {isFailurePoint && (
                <rect
                  x={n.x - 6}
                  y={n.y - 6}
                  width={NODE_W + 12}
                  height={NODE_H + 12}
                  rx={12}
                  className="fill-[color:var(--color-destructive)] fs-pulse-failure"
                  opacity={0.18}
                />
              )}
              {isActive && !isFailurePoint && (
                <rect
                  x={n.x - 5}
                  y={n.y - 5}
                  width={NODE_W + 10}
                  height={NODE_H + 10}
                  rx={11}
                  className="fill-[color:var(--color-primary)] fs-pulse-primary"
                  opacity={0.2}
                />
              )}
              <rect
                x={n.x}
                y={n.y}
                width={NODE_W}
                height={NODE_H}
                rx={8}
                strokeWidth={isFailurePoint ? 2 : 1.25}
                className={cn(stateColors(s.kind))}
              />
              <text
                x={n.cx}
                y={n.cy - 4}
                textAnchor="middle"
                className="fill-[color:var(--color-foreground)] font-medium"
                fontSize={12}
              >
                {s.label}
              </text>
              <text
                x={n.cx}
                y={n.cy + 11}
                textAnchor="middle"
                className="fill-[color:var(--color-muted-foreground)] font-mono"
                fontSize={9}
              >
                {s.id}
              </text>
              {isDivergence && (
                <g>
                  <circle
                    cx={n.x + NODE_W - 6}
                    cy={n.y + 6}
                    r={7}
                    className="fill-[color:var(--color-warning)] stroke-[color:var(--color-background)]"
                    strokeWidth={2}
                  />
                  <text
                    x={n.x + NODE_W - 6}
                    y={n.y + 9}
                    textAnchor="middle"
                    className="fill-[color:var(--color-warning-foreground,white)]"
                    fontSize={9}
                    fontWeight={700}
                  >
                    !
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
