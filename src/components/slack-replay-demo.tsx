import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Hash, PlayCircle } from "lucide-react";

/**
 * Marketing-home animation that loops a Slack thread:
 * (1) production failure posted → (2) engineer clicks replay → (3) fix validated.
 * Pure CSS-driven, no Slack API calls.
 */
export function SlackReplayDemo() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % 4), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div
        aria-hidden
        className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/30 via-info/20 to-transparent blur-2xl"
      />
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[oklch(0.16_0.02_260)] text-left shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)]">
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs text-white/80">
          <Hash className="h-3.5 w-3.5 text-white/50" />
          <span className="font-semibold">pay-alerts</span>
          <span className="text-white/40">· 14 members</span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> live
          </span>
        </div>

        <div className="space-y-3 p-4">
          {/* 1. Production failure alert */}
          <Bubble visible={step >= 0} app>
            <div className="flex items-start gap-2 rounded border-l-4 border-destructive bg-destructive/10 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
              <div className="flex-1 text-sm text-white/90">
                <div className="font-semibold">38× card_declined · Paystack · Checkout</div>
                <div className="mt-0.5 text-[11px] text-white/55">
                  Failed at <span className="font-mono text-white/80">awaiting_pin</span> · sandbox{" "}
                  <span className="font-mono text-white/80">sb_paystack_main</span>
                </div>
                <div className="mt-2 flex gap-1.5">
                  <button
                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                      step >= 1
                        ? "bg-primary text-primary-foreground ring-2 ring-primary/60 scale-[1.03]"
                        : "bg-primary/80 text-primary-foreground"
                    }`}
                  >
                    <PlayCircle className="h-3 w-3" /> Replay in sandbox
                  </button>
                  <button className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white/80">
                    Open in FlowSim
                  </button>
                </div>
              </div>
            </div>
          </Bubble>

          {/* 2. Engineer reply */}
          <Bubble visible={step >= 2} avatar="A" author="alex" time="10:43 AM">
            <span className="text-sm text-white/85">replaying now…</span>
          </Bubble>

          {/* 3. Fix validated */}
          <Bubble visible={step >= 3} app author="FlowSim" time="10:44 AM">
            <div className="flex items-center gap-2 rounded border-l-4 border-success bg-success/10 p-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="font-medium text-white/90">Fix validated</span>
              <span className="text-[11px] text-white/55">
                replay reached <span className="font-mono text-white/80">charge_succeeded</span>
              </span>
            </div>
          </Bubble>
        </div>
      </div>
    </div>
  );
}

function Bubble({
  visible, app, author = "FlowSim", time = "10:42 AM", avatar, children,
}: {
  visible: boolean;
  app?: boolean;
  author?: string;
  time?: string;
  avatar?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex gap-3 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      {avatar ? (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-primary/25 text-sm font-semibold text-primary">
          {avatar}
        </div>
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-white text-[oklch(0.16_0.02_260)]">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M5 15a2 2 0 1 1-2-2h2zM6 15a2 2 0 1 1 4 0v5a2 2 0 1 1-4 0zM9 5a2 2 0 1 1 2 2H9zM9 6a2 2 0 1 1 0 4H4a2 2 0 1 1 0-4zM19 9a2 2 0 1 1 2 2h-2zM18 9a2 2 0 1 1-4 0V4a2 2 0 1 1 4 0zM15 19a2 2 0 1 1-2-2h2zM15 18a2 2 0 1 1 0-4h5a2 2 0 1 1 0 4z" />
          </svg>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-white/90">{author}</span>
          {app && (
            <span className="rounded bg-white/15 px-1 py-0 text-[9px] font-bold uppercase text-white/70">APP</span>
          )}
          <span className="text-[11px] text-white/45">{time}</span>
        </div>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}
