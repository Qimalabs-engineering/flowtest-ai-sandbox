import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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

interface Msg { role: "user" | "assistant"; content: string }

const seed: Msg[] = [
  { role: "assistant", content: "Hi Ada — I monitor your sandbox in real time. Ask me about failures, providers, or scenarios." },
];

function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      { role: "user", content: text },
      { role: "assistant", content: mockReply(text) },
    ]);
    setInput("");
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
          <CardContent className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                )}>
                  {m.content}
                </div>
              </div>
            ))}
          </CardContent>
          <div className="border-t p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button key={s} onClick={() => send(s)} className="rounded-full border bg-background px-2.5 py-1 text-xs text-muted-foreground hover:bg-accent">
                  {s}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex gap-2"
            >
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask the FlowSim assistant…" />
              <Button type="submit" size="icon"><Send className="h-4 w-4" /></Button>
            </form>
          </div>
        </Card>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Live insights</h2>
        {insights.map((i, idx) => {
          const Icon = i.tone === "warning" ? AlertTriangle : i.tone === "destructive" ? ShieldAlert : Info;
          const toneCls = i.tone === "warning"
            ? "border-warning/30 bg-warning/5"
            : i.tone === "destructive"
              ? "border-destructive/30 bg-destructive/5"
              : "border-info/30 bg-info/5";
          return (
            <Card key={idx} className={cn(toneCls)}>
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
  );
}

function mockReply(q: string) {
  const t = q.toLowerCase();
  if (t.includes("fail")) return "Across the last 24h, M-Pesa Simulator accounts for 42% of failures, mostly STK Push timeouts driven by the 'Timeout after 30 seconds' scenario.";
  if (t.includes("webhook")) return "12 webhook deliveries failed today with HTTP 500 from your endpoint. Mean retry latency is 14s. Consider adding idempotency keys.";
  if (t.includes("scenario") || t.includes("generate")) return "Created scenario 'Provider timeout — 25s' for Paystack Simulator on Charge with failureRate=100% and delay=25000ms. Toggle it on from Scenarios to start using.";
  return "Latest sandbox health: 98.4% webhook delivery, 99.1% provider uptime, 8 stuck pending transactions older than 10 minutes.";
}
