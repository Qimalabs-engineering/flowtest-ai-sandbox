import { Link } from "@tanstack/react-router";
import { Waves, ShieldCheck, Zap, Brain } from "lucide-react";
import type { ReactNode } from "react";

const highlights = [
  { icon: Zap, title: "Simulate any failure", text: "Inject timeouts, declines, and webhook chaos in one click." },
  { icon: Brain, title: "AI incident replay", text: "Reproduce production bugs and get root-cause in minutes." },
  { icon: ShieldCheck, title: "All sandbox, no real funds", text: "Test fintech flows safely before they cost money." },
];

export function AuthShell({
  children,
  side,
}: {
  children: ReactNode;
  side: "signin" | "signup";
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-primary/25 blur-[120px]" />
        <div className="absolute -right-24 top-1/3 h-[26rem] w-[26rem] rounded-full bg-info/20 blur-[120px]" />
        <div className="absolute bottom-[-10rem] left-1/3 h-[24rem] w-[24rem] rounded-full bg-success/15 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, color-mix(in oklab, var(--border) 60%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--border) 60%, transparent) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden flex-col justify-between border-r border-border/60 bg-card/30 p-12 backdrop-blur-xl lg:flex">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/30">
              <Waves className="h-4 w-4" />
            </div>
            <span className="text-base font-semibold tracking-tight">FlowSim</span>
          </Link>

          <div className="fs-stagger max-w-md space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/50 px-3 py-1 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-success fs-pulse-soft" />
                The AI operating system for integrations
              </span>
              <h1 className="text-3xl font-semibold leading-tight tracking-tight">
                Build, break, and debug fintech integrations with confidence.
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground">
                FlowSim gives engineering teams a realistic sandbox to simulate failures,
                replay incidents, and ship reliable payment flows faster.
              </p>
            </div>

            <ul className="space-y-4">
              {highlights.map((h) => (
                <li key={h.title} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background/50 text-primary">
                    <h.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{h.title}</p>
                    <p className="text-xs text-muted-foreground">{h.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-muted-foreground">
            Trusted by integration teams · SOC 2 (soon) · No real funds, ever.
          </p>
        </div>

        {/* Form panel */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between p-6 lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Waves className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold">FlowSim</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
            <div className="fs-fade-up w-full max-w-sm">
              {children}
              <p className="mt-8 text-center text-xs text-muted-foreground">
                {side === "signin" ? (
                  <>
                    New to FlowSim?{" "}
                    <Link to="/signup" className="text-primary hover:underline">
                      Create an account
                    </Link>
                  </>
                ) : (
                  <>
                    Already on FlowSim?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
