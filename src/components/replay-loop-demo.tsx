import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  GitPullRequest,
  PlayCircle,
} from "lucide-react";

/**
 * Marketing animation that shows the core FlowSim loop:
 *   Production failure  →  Replay in sandbox  →  Fix validated
 * Three columns light up in sequence so the value prop reads in 4 seconds
 * without needing to parse a Slack thread.
 */
export function ReplayLoopDemo() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % 4), 1600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/30 via-info/20 to-transparent blur-2xl"
      />
      <div className="rounded-2xl border border-white/10 bg-[oklch(0.16_0.02_260)] p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)]">
        {/* Three stage panels */}
        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-2">
          <Stage
            active={step >= 0}
            done={step >= 1}
            tone="destructive"
            icon={AlertTriangle}
            label="Production"
            title="card_declined"
            sub="×38 · Paystack"
          />
          <Arrow lit={step >= 1} />
          <Stage
            active={step >= 1 && step < 3}
            done={step >= 2}
            tone="primary"
            icon={PlayCircle}
            label="Replay in sandbox"
            title="sb_paystack_main"
            sub={step >= 1 ? "awaiting_pin → charge_succeeded" : "awaiting_pin"}
            pulse={step >= 1 && step < 3}
          />
          <Arrow lit={step >= 2} />
          <Stage
            active={step >= 2}
            done={step >= 3}
            tone="success"
            icon={CheckCircle2}
            label="Fix validated"
            title="PR #482 ready"
            sub="merge with confidence"
          />
        </div>

        {/* Tiny footer strip — what just happened */}
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] text-white/60">
          <Boxes className="h-3.5 w-3.5 text-white/40" />
          <span className="font-mono text-white/70">sb_paystack_main</span>
          <span className="text-white/30">·</span>
          <span>
            replayed real failure, reached{" "}
            <span className="font-mono text-success">charge_succeeded</span>
          </span>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-white/55">
            <GitPullRequest className="h-3 w-3" /> auto-PR
          </span>
        </div>
      </div>
    </div>
  );
}

function Stage({
  active,
  done,
  tone,
  icon: Icon,
  label,
  title,
  sub,
  pulse,
}: {
  active: boolean;
  done: boolean;
  tone: "destructive" | "primary" | "success";
  icon: typeof AlertTriangle;
  label: string;
  title: string;
  sub: string;
  pulse?: boolean;
}) {
  const toneRing =
    tone === "destructive"
      ? "ring-destructive/60 bg-destructive/15 text-destructive"
      : tone === "primary"
      ? "ring-primary/60 bg-primary/15 text-primary"
      : "ring-success/60 bg-success/15 text-success";
  const lit = active || done;
  return (
    <div
      className={`flex flex-col rounded-xl border p-3 transition-all duration-500 ${
        lit
          ? "border-white/15 bg-white/[0.04]"
          : "border-white/5 bg-white/[0.015] opacity-50"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`relative inline-flex h-7 w-7 items-center justify-center rounded-md ring-1 transition-all ${toneRing} ${
            lit ? "" : "grayscale opacity-60"
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
          {pulse && (
            <span
              aria-hidden
              className={`absolute inset-0 rounded-md ring-2 ${
                tone === "primary" ? "ring-primary/50" : ""
              } animate-ping`}
            />
          )}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
          {label}
        </span>
      </div>
      <div className="mt-2 truncate font-mono text-[12px] font-semibold text-white/90">
        {title}
      </div>
      <div className="mt-0.5 truncate text-[11px] text-white/55">{sub}</div>
    </div>
  );
}

function Arrow({ lit }: { lit: boolean }) {
  return (
    <div className="flex items-center justify-center">
      <ArrowRight
        className={`h-4 w-4 transition-all duration-500 ${
          lit ? "text-primary translate-x-0.5" : "text-white/15"
        }`}
      />
    </div>
  );
}
