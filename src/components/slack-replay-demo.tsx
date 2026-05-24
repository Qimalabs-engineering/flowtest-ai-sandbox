import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  GitPullRequest,
  Hash,
  Lock,
  MessageSquare,
  PlayCircle,
  Plus,
  Search,
  Smile,
} from "lucide-react";

/**
 * Marketing-home animation styled as a real Slack workspace.
 * Loops a 5-beat story so the value prop is obvious without reading:
 *   0. Resting state — channel + alert visible
 *   1. FlowSim bot posts the production failure
 *   2. Engineer clicks "Replay in sandbox" (button press + reaction)
 *   3. Inline replay panel ticks through sandbox states
 *   4. "Fix validated" reply with Open PR button
 */

const TOTAL_STEPS = 5;

export function SlackReplayDemo() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % TOTAL_STEPS), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/30 via-info/20 to-transparent blur-2xl"
      />
      <div className="overflow-hidden rounded-xl border border-black/30 bg-[#1a1d21] text-left shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 border-b border-white/5 bg-[#222529] px-3 py-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <div className="ml-3 flex items-center gap-1.5 rounded bg-white/5 px-2 py-0.5 text-[10px] text-white/50">
            <Search className="h-3 w-3" /> Search Acme Pay
          </div>
        </div>

        <div className="grid grid-cols-[170px_1fr]">
          {/* Slack sidebar */}
          <aside className="border-r border-white/5 bg-[#19171d] px-2 py-3 text-[12px] text-white/70">
            <div className="flex items-center justify-between px-1.5 pb-2">
              <span className="text-[13px] font-bold text-white">Acme Pay</span>
              <ChevronDown className="h-3 w-3 text-white/50" />
            </div>

            <SideLabel>Channels</SideLabel>
            <SideRow icon={Hash} label="general" />
            <SideRow icon={Hash} label="engineering" />
            <SideRow icon={Hash} label="pay-alerts" active unread={step >= 1} />
            <SideRow icon={Lock} label="incidents" />
            <SideRow icon={Hash} label="mpesa-ops" />
            <button className="mt-1 flex items-center gap-1.5 px-1.5 py-0.5 text-[11px] text-white/40 hover:text-white/70">
              <Plus className="h-3 w-3" /> Add channels
            </button>

            <SideLabel>Apps</SideLabel>
            <SideRow icon={MessageSquare} label="FlowSim" appActive />
          </aside>

          {/* Main channel area */}
          <section className="flex h-[440px] flex-col bg-[#1a1d21]">
            {/* Channel header */}
            <header className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-white/55" />
                <span className="text-sm font-bold text-white">pay-alerts</span>
                <span className="ml-1 text-[11px] text-white/40">· 14</span>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> connected to FlowSim
              </span>
            </header>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-hidden px-4 pt-3">
              {/* Day divider */}
              <div className="relative flex items-center">
                <div className="h-px flex-1 bg-white/8" />
                <span className="mx-3 rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/50">
                  Today
                </span>
                <div className="h-px flex-1 bg-white/8" />
              </div>

              {/* 1. FlowSim bot alert */}
              <SlackMessage
                visible={step >= 1}
                app
                author="FlowSim"
                time="10:42 AM"
              >
                <div className="rounded-md border-l-4 border-destructive bg-white/[0.03] p-3">
                  <div className="flex items-center gap-2 text-[13px] text-white/90">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="font-semibold">38× card_declined · Paystack · Checkout</span>
                  </div>
                  <div className="mt-1 ml-6 text-[11.5px] text-white/55">
                    Failed at <span className="font-mono text-white/80">awaiting_pin</span> · sandbox{" "}
                    <span className="font-mono text-white/80">sb_paystack_main</span>
                  </div>
                  <div className="mt-2.5 ml-6 flex gap-1.5">
                    <button
                      className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-[12px] font-medium transition-all ${
                        step === 2
                          ? "scale-[0.97] border-primary/70 bg-primary text-primary-foreground shadow-inner"
                          : step >= 2
                          ? "border-white/10 bg-white/5 text-white/60"
                          : "border-white/15 bg-white/[0.04] text-white hover:bg-white/10"
                      }`}
                    >
                      <PlayCircle className="h-3.5 w-3.5" /> Replay in sandbox
                    </button>
                    <button className="rounded border border-white/15 bg-white/[0.04] px-2.5 py-1 text-[12px] text-white/80">
                      Open in FlowSim
                    </button>
                  </div>
                </div>
                {step >= 2 && (
                  <div className="mt-1.5 flex gap-1">
                    <Reaction emoji="👀" count={2} />
                    <Reaction emoji="🛠️" count={1} />
                  </div>
                )}
              </SlackMessage>

              {/* 2. Engineer reply */}
              <SlackMessage
                visible={step >= 2}
                author="alex"
                time="10:43 AM"
                avatarColor="bg-[#e8912d]"
                initial="A"
              >
                <div className="text-[13px] text-white/85">
                  on it — replaying now
                </div>
              </SlackMessage>

              {/* 3. Inline replay panel */}
              {step >= 3 && (
                <SlackMessage
                  visible
                  app
                  author="FlowSim"
                  time="10:43 AM"
                  threadLabel="Replay thread"
                >
                  <div className="rounded-md border border-white/10 bg-white/[0.025] p-2.5">
                    <div className="flex items-center gap-2 text-[12px] text-white/80">
                      <PlayCircle className="h-3.5 w-3.5 text-primary animate-pulse" />
                      <span>
                        Replaying <span className="font-mono text-white">sb_paystack_main</span>
                      </span>
                      <span className="ml-auto text-[10px] text-white/45">
                        {step >= 4 ? "1.4s" : "running…"}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 font-mono text-[10.5px]">
                      <StateChip label="initiated" done />
                      <Tick />
                      <StateChip label="awaiting_pin" done />
                      <Tick />
                      <StateChip
                        label="charge_processing"
                        done={step >= 4}
                        active={step === 3}
                      />
                      <Tick lit={step >= 4} />
                      <StateChip
                        label="charge_succeeded"
                        done={step >= 4}
                        tone="success"
                      />
                    </div>
                  </div>
                </SlackMessage>
              )}

              {/* 4. Fix validated */}
              {step >= 4 && (
                <SlackMessage visible app author="FlowSim" time="10:44 AM">
                  <div className="flex items-center gap-2 rounded-md border-l-4 border-success bg-success/10 p-2.5 text-[13px]">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="font-medium text-white/90">Fix validated</span>
                    <span className="text-[11px] text-white/55">
                      replay reached <span className="font-mono text-white/80">charge_succeeded</span>
                    </span>
                    <button className="ml-auto inline-flex items-center gap-1.5 rounded border border-white/15 bg-white/[0.05] px-2 py-0.5 text-[11px] text-white/85 hover:bg-white/10">
                      <GitPullRequest className="h-3 w-3" /> Open PR #482
                    </button>
                  </div>
                </SlackMessage>
              )}
            </div>

            {/* Composer */}
            <div className="m-3 rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-[12px] text-white/35">
              <div className="flex items-center gap-2">
                <Plus className="h-3.5 w-3.5" />
                <span>Message #pay-alerts</span>
                <Smile className="ml-auto h-3.5 w-3.5" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function SideLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 px-1.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-white/40">
      {children}
    </div>
  );
}

function SideRow({
  icon: Icon,
  label,
  active,
  unread,
  appActive,
}: {
  icon: typeof Hash;
  label: string;
  active?: boolean;
  unread?: boolean;
  appActive?: boolean;
}) {
  return (
    <div
      className={`mt-0.5 flex items-center gap-1.5 rounded px-1.5 py-1 text-[12px] ${
        active
          ? "bg-[#1164a3] text-white"
          : unread
          ? "text-white font-semibold"
          : "text-white/65"
      }`}
    >
      <Icon className="h-3 w-3" />
      <span className="truncate">{label}</span>
      {appActive && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-success" />
      )}
      {unread && !active && (
        <span className="ml-auto rounded-full bg-destructive px-1 text-[9px] font-bold text-white">
          1
        </span>
      )}
    </div>
  );
}

function SlackMessage({
  visible,
  app,
  author,
  time,
  avatarColor = "bg-[#5a3a8a]",
  initial,
  threadLabel,
  children,
}: {
  visible: boolean;
  app?: boolean;
  author: string;
  time: string;
  avatarColor?: string;
  initial?: string;
  threadLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex gap-2.5 transition-all duration-500 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-1 pointer-events-none"
      }`}
    >
      {app ? (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-info text-white shadow-md">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M3 12c0-4.97 4.03-9 9-9s9 4.03 9 9-4.03 9-9 9-9-4.03-9-9zm9-6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
          </svg>
        </div>
      ) : (
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[13px] font-semibold text-white ${avatarColor}`}
        >
          {initial}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[13.5px] font-bold text-white/95">{author}</span>
          {app && (
            <span className="rounded bg-white/10 px-1 py-px text-[8.5px] font-bold uppercase tracking-wide text-white/65">
              APP
            </span>
          )}
          <span className="text-[11px] text-white/40">{time}</span>
        </div>
        <div className="mt-0.5">{children}</div>
        {threadLabel && (
          <div className="mt-1.5 inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 text-[11px] text-info hover:bg-white/5">
            <MessageSquare className="h-3 w-3" />
            <span>{threadLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Reaction({ emoji, count }: { emoji: string; count: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-info/40 bg-info/10 px-1.5 py-px text-[10.5px] text-white/85">
      <span>{emoji}</span>
      <span className="text-info">{count}</span>
    </span>
  );
}

function StateChip({
  label,
  done,
  active,
  tone,
}: {
  label: string;
  done?: boolean;
  active?: boolean;
  tone?: "success";
}) {
  const cls = tone === "success" && done
    ? "border-success/40 bg-success/15 text-success"
    : done
    ? "border-white/15 bg-white/10 text-white/80"
    : active
    ? "border-primary/50 bg-primary/15 text-primary animate-pulse"
    : "border-white/8 bg-white/[0.02] text-white/35";
  return (
    <span className={`rounded border px-1.5 py-0.5 ${cls}`}>{label}</span>
  );
}

function Tick({ lit = true }: { lit?: boolean }) {
  return (
    <span className={`text-[10px] ${lit ? "text-white/35" : "text-white/15"}`}>
      →
    </span>
  );
}
