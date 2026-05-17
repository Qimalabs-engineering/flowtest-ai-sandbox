import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, SkipForward, RotateCcw, AlertTriangle, Webhook, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { FlowDesigner } from "@/components/flow-designer";
import {
  getFlowDefinition,
  stateLabel,
  type FlowEvent,
  type FlowInstance,
} from "@/lib/flow-data";

interface FlowReplayProps {
  instance: FlowInstance;
  className?: string;
}

const SPEEDS = [1, 2, 4, 8] as const;

export function FlowReplay({ instance, className }: FlowReplayProps) {
  const def = getFlowDefinition(instance.flowDefinitionId);
  const totalMs = useMemo(() => {
    if (!instance.events.length) return 1000;
    return instance.events[instance.events.length - 1].t + 500;
  }, [instance.events]);

  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(2);
  const [t, setT] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    lastTickRef.current = performance.now();
    const tick = (now: number) => {
      const dt = now - lastTickRef.current;
      lastTickRef.current = now;
      setT((prev) => {
        const next = prev + dt * speed;
        if (next >= totalMs) {
          setPlaying(false);
          return totalMs;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, speed, totalMs]);

  if (!def) return <div className="text-sm text-muted-foreground">Flow definition not found.</div>;

  const happyPathSet = new Set(def.happyPath);
  const reachedEvents = instance.events.filter((e) => e.t <= t);
  const reachedStates = reachedEvents
    .filter((e) => e.kind === "state_enter" && e.stateId)
    .map((e) => e.stateId!);
  const activeState = reachedStates[reachedStates.length - 1] ?? instance.traveledStates[0];

  // Divergence: first traveled state not in the happy path
  const divergenceState = instance.traveledStates.find((s) => !happyPathSet.has(s));

  const failureState = instance.failurePoint?.atState;
  const failureTransition = instance.failurePoint?.atTransitionEvent;
  const reachedFailure =
    !!instance.failurePoint &&
    reachedEvents.some((e) => e.kind === "failure");

  function reset() {
    setT(0);
    setPlaying(false);
  }
  function step() {
    const nextEvt = instance.events.find((e) => e.t > t);
    if (nextEvt) setT(nextEvt.t + 1);
    else setT(totalMs);
    setPlaying(false);
  }

  return (
    <div className={cn("grid gap-4 lg:grid-cols-[1fr_280px]", className)}>
      <div className="space-y-3">
        <div className="rounded-lg border bg-card p-3">
          <FlowDesigner
            definition={def}
            traveledStates={reachedStates.length ? reachedStates : [instance.traveledStates[0]]}
            activeStateId={playing ? activeState : undefined}
            failureStateId={reachedFailure ? failureState : undefined}
            failureTransitionEvent={reachedFailure ? failureTransition : undefined}
            showHappyPath
            divergenceStateId={divergenceState && reachedStates.includes(divergenceState) ? divergenceState : undefined}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3">
          <Button size="sm" variant={playing ? "secondary" : "default"} onClick={() => setPlaying((p) => !p)}>
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span className="ml-1">{playing ? "Pause" : "Play"}</span>
          </Button>
          <Button size="sm" variant="outline" onClick={step}>
            <SkipForward className="h-3.5 w-3.5" />
            <span className="ml-1">Step</span>
          </Button>
          <Button size="sm" variant="ghost" onClick={reset}>
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="ml-1">Reset</span>
          </Button>
          <div className="flex items-center gap-1 ml-2">
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={cn(
                  "rounded px-2 py-0.5 text-xs font-mono",
                  speed === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                )}
              >
                {s}×
              </button>
            ))}
          </div>
          <div className="ml-auto text-xs font-mono text-muted-foreground">
            {(t / 1000).toFixed(2)}s / {(totalMs / 1000).toFixed(2)}s
          </div>
        </div>

        <div className="rounded-lg border bg-card p-3">
          <Slider
            value={[t]}
            min={0}
            max={totalMs}
            step={20}
            onValueChange={([v]) => {
              setT(v);
              setPlaying(false);
            }}
          />
        </div>

        {divergenceState && (
          <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/5 p-3 text-xs">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 text-warning shrink-0" />
            <div>
              <div className="font-medium">Diverged from happy path</div>
              <div className="text-muted-foreground">
                Expected next state from <span className="font-mono">{
                  def.happyPath[Math.max(0, def.happyPath.indexOf(instance.traveledStates[instance.traveledStates.indexOf(divergenceState) - 1] ?? def.happyPath[0]))]
                }</span>, got <span className="font-mono text-destructive">{stateLabel(def, divergenceState)}</span>.
              </div>
            </div>
          </div>
        )}

        <button
          disabled
          className="w-full rounded-lg border border-dashed border-border bg-muted/30 px-3 py-2 text-left text-xs text-muted-foreground"
          title="Available when the live sandbox is wired up"
        >
          Replay against current spec <span className="text-[10px]">(coming soon)</span>
        </button>
      </div>

      {/* Event log */}
      <div className="rounded-lg border bg-card">
        <div className="border-b px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Event log
        </div>
        <ol className="max-h-[480px] overflow-y-auto p-2 text-xs">
          {instance.events.map((e, i) => {
            const reached = e.t <= t;
            return <EventRow key={i} event={e} reached={reached} />;
          })}
        </ol>
      </div>
    </div>
  );
}

function EventRow({ event, reached }: { event: FlowEvent; reached: boolean }) {
  const icon =
    event.kind === "failure" ? (
      <AlertTriangle className="h-3 w-3 text-destructive" />
    ) : event.kind === "webhook" ? (
      <Webhook className="h-3 w-3 text-info" />
    ) : (
      <ArrowRight className="h-3 w-3 text-primary" />
    );
  return (
    <li
      className={cn(
        "flex gap-2 rounded px-2 py-1.5 transition-opacity",
        !reached && "opacity-35",
        event.kind === "failure" && reached && "bg-destructive/5 border-l-2 border-destructive",
      )}
    >
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-medium leading-tight truncate">{event.label}</span>
          <span className="font-mono text-[10px] text-muted-foreground shrink-0">
            +{(event.t / 1000).toFixed(2)}s
          </span>
        </div>
        {event.detail && (
          <div className="text-[11px] text-muted-foreground truncate">{event.detail}</div>
        )}
      </div>
    </li>
  );
}
