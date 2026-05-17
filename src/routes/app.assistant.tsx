import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, AlertTriangle, Info, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { insights } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/assistant")({
  component: AssistantPage,
});

const suggestions = [
  "Why did this transaction fail?",
  "Which provider is failing the most?",
  "Why are webhooks delayed?",
  "Generate a test scenario for provider timeouts",
];

interface Msg { role: "user" | "assistant"; content: string; pending?: boolean }

const seed: Msg[] = [
  { role: "assistant", content: "Hi Ada — I monitor your sandbox in real time. Ask me about failures, providers, or scenarios." },
];

function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const send = (text: string) => {
    if (!text.trim() || thinking) return;
    const reply = mockReply(text);
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setThinking(true);

    // Simulate "thinking" then stream tokens
    window.setTimeout(() => {
      setThinking(false);
      setMessages((m) => [...m, { role: "assistant", content: "", pending: true }]);
      const tokens = reply.split(/(\s+)/);
      let i = 0;
      const tick = () => {
        i += 1;
        setMessages((m) => {
          const next = m.slice();
          const last = next[next.length - 1];
          if (last?.pending) last.content = tokens.slice(0, i).join("");
          return next;
        });
        if (i < tokens.length) {
          window.setTimeout(tick, 22);
        } else {
          setMessages((m) => m.map((x, idx) => (idx === m.length - 1 ? { ...x, pending: false } : x)));
        }
      };
      window.setTimeout(tick, 60);
    }, 520);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> AI Assistant
          </h1>
          <p className="text-sm text-muted-foreground">Ask about failures, webhook delays, or generate scenarios.</p>
        </div>
        <Card className="flex h-[60vh] flex-col">
          <CardContent ref={scrollerRef} className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex fs-fade-up", m.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap",
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                  m.pending && "fs-caret",
                )}>
                  {m.content || (m.pending ? "" : "")}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex justify-start fs-fade-in">
                <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-2.5 text-sm text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                  <span>FlowSim is analyzing</span>
                  <span className="inline-flex gap-0.5">
                    <span className="h-1 w-1 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1 w-1 rounded-full bg-current animate-bounce" style={{ animationDelay: "120ms" }} />
                    <span className="h-1 w-1 rounded-full bg-current animate-bounce" style={{ animationDelay: "240ms" }} />
                  </span>
                </div>
              </div>
            )}
          </CardContent>
          <div className="border-t p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button key={s} onClick={() => send(s)} className="rounded-full border bg-background px-2.5 py-1 text-xs text-muted-foreground hover:bg-accent hover:-translate-y-px active:scale-[0.97]">
                  {s}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex gap-2"
            >
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask the FlowSim assistant…" disabled={thinking} />
              <Button type="submit" size="icon" disabled={thinking}><Send className="h-4 w-4" /></Button>
            </form>
          </div>
        </Card>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Live insights</h2>
        <div className="space-y-3 fs-stagger">
          {insights.map((i, idx) => {
            const Icon = i.tone === "warning" ? AlertTriangle : i.tone === "destructive" ? ShieldAlert : Info;
            const toneCls = i.tone === "warning"
              ? "border-warning/30 bg-warning/5"
              : i.tone === "destructive"
                ? "border-destructive/30 bg-destructive/5 fs-pulse-soft"
                : "border-info/30 bg-info/5";
            return (
              <Card key={idx} className={cn(toneCls, "fs-card-hover")}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Icon className="h-4 w-4" /> {i.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs">{i.body}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function mockReply(q: string) {
  const t = q.toLowerCase();
  if (t.includes("fail")) return "Across the last 24h, M-Pesa Simulator accounts for 42% of failures, mostly STK Push timeouts driven by the 'Timeout after 30 seconds' scenario.";
  if (t.includes("webhook")) return "12 webhook deliveries failed today with HTTP 500 from your endpoint. Mean retry latency is 14s. Consider adding idempotency keys.";
  if (t.includes("scenario") || t.includes("generate")) return "Created scenario 'Provider timeout — 25s' for Paystack Simulator on Charge with failureRate=100% and delay=25000ms. Toggle it on from Scenarios to start using.";
  return "Latest sandbox health: 98.4% webhook delivery, 99.1% provider uptime, 8 stuck pending transactions older than 10 minutes.";
}
