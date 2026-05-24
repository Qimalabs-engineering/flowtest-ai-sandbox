import { useMemo, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Copy, Server, Webhook, ShieldCheck, FileCode2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { providers } from "@/lib/mock-data";
import { flowDefinitions } from "@/lib/flow-data";
import { fidelityLabels, sandboxes, type FidelityTier } from "@/lib/sandbox-data";

export const Route = createFileRoute("/app/sandboxes/new")({
  validateSearch: (s: Record<string, unknown>) => ({
    provider: typeof s.provider === "string" ? s.provider : undefined,
  }),
  component: NewSandboxWizard,
});

const steps = ["Provider", "APIs", "Fidelity", "Webhook", "Review"] as const;

function NewSandboxWizard() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [step, setStep] = useState(0);

  const [provider, setProvider] = useState<string>(search.provider ?? "");
  const [name, setName] = useState<string>("");
  const [selectedFlows, setSelectedFlows] = useState<string[]>([]);
  const [fidelity, setFidelity] = useState<FidelityTier>("provider_like");
  const [webhookUrl, setWebhookUrl] = useState<string>("https://api.example.com/webhooks");

  const availableFlows = useMemo(
    () => flowDefinitions.filter((f) => !provider || f.provider === provider),
    [provider],
  );

  const providerOptions = useMemo(() => {
    const used = new Set(flowDefinitions.map((f) => f.provider));
    return providers.filter((p) => used.has(p.name)).concat(
      providers.filter((p) => !used.has(p.name)),
    );
  }, []);

  const canNext = () => {
    if (step === 0) return !!provider && name.trim().length > 1;
    if (step === 1) return selectedFlows.length > 0;
    if (step === 3) return /^https?:\/\//.test(webhookUrl);
    return true;
  };

  const handleCreate = () => {
    // Mock create — would persist to backend
    toast.success(`Sandbox "${name}" created`, {
      description: `${selectedFlows.length} flow${selectedFlows.length === 1 ? "" : "s"} enabled at ${fidelityLabels[fidelity].label} fidelity.`,
    });
    const target = sandboxes[0]?.id ?? "sb_paystack_main";
    navigate({ to: "/app/sandboxes/$id", params: { id: target } });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-2 mb-1">
            <Link to="/app/sandboxes"><ArrowLeft className="mr-1 h-4 w-4" /> Sandboxes</Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">New sandbox</h1>
          <p className="text-sm text-muted-foreground">5 steps. Takes about a minute.</p>
        </div>
      </div>

      <Stepper current={step} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{steps[step]}</CardTitle>
          <CardDescription>{stepDescription(step)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block text-sm">Provider</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {providerOptions.map((p) => {
                    const active = provider === p.name;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setProvider(p.name)}
                        className={`rounded-md border p-3 text-left transition-colors ${active ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">{p.name}</span>
                          {active && <Check className="h-4 w-4 text-primary" />}
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{p.type} · {p.country}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <Label htmlFor="sb-name">Sandbox name</Label>
                <Input id="sb-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Paystack — Checkout" className="mt-1.5" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-2">
              {availableFlows.length === 0 && (
                <p className="text-sm text-muted-foreground">No flows shipped for this provider yet. You can still create the sandbox and request flows later.</p>
              )}
              {availableFlows.map((f) => {
                const checked = selectedFlows.includes(f.id);
                return (
                  <label key={f.id} className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors ${checked ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) => {
                        setSelectedFlows((prev) => v ? [...prev, f.id] : prev.filter((id) => id !== f.id));
                      }}
                      className="mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">{f.name}</p>
                        <Badge variant="outline" className="font-normal text-xs">{f.apiVersion}</Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{f.description}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {f.failureScenarios.length} failure scenarios · {f.webhooks.length} webhooks
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          {step === 2 && (
            <RadioGroup value={fidelity} onValueChange={(v) => setFidelity(v as FidelityTier)} className="space-y-2">
              {(Object.keys(fidelityLabels) as FidelityTier[]).map((tier) => (
                <label key={tier} className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors ${fidelity === tier ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                  <RadioGroupItem value={tier} className="mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{fidelityLabels[tier].label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{fidelityLabels[tier].blurb}</p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="wh-url">Webhook URL</Label>
                <Input id="wh-url" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://api.example.com/webhooks" className="mt-1.5 font-mono text-sm" />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  We'll sign deliveries with HMAC-SHA256 using the same header name the real provider uses.
                </p>
              </div>
              <div className="rounded-md border bg-muted/30 p-3 text-xs">
                <p className="font-medium">Signature header preview</p>
                <code className="mt-1 block font-mono">
                  {provider.includes("Paystack") ? "x-paystack-signature: <sig>" :
                   provider.includes("M-Pesa") ? "x-daraja-signature: <sig>" :
                   "x-flowsim-signature: <sig>"}
                </code>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <ReviewRow label="Name" value={name || "—"} />
              <ReviewRow label="Provider" value={provider || "—"} />
              <ReviewRow label="Flows" value={selectedFlows.length ? selectedFlows.join(", ") : "—"} />
              <ReviewRow label="Fidelity" value={fidelityLabels[fidelity].label} />
              <ReviewRow label="Webhook" value={webhookUrl} mono />

              <div className="rounded-md border bg-emerald-500/5 border-emerald-500/30 p-3 text-xs">
                <p className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" /> Honest framing
                </p>
                <p className="mt-1 text-muted-foreground">
                  This sandbox does not call the real provider. It returns provider-shaped responses and signed webhooks for the scenarios you choose to test.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        {step < steps.length - 1 ? (
          <Button disabled={!canNext()} onClick={() => setStep((s) => s + 1)}>
            Next <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleCreate}>
            <Check className="mr-1 h-4 w-4" /> Create sandbox
          </Button>
        )}
      </div>
    </div>
  );
}

function stepDescription(step: number): string {
  return [
    "Pick a provider and name the sandbox.",
    "Choose which flows this sandbox should expose.",
    "How closely should responses match the real provider spec?",
    "Where should we deliver signed webhooks?",
    "Confirm and create.",
  ][step];
}

function ReviewRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b pb-2 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={`text-right ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
    </div>
  );
}

function Stepper({ current }: { current: number }) {
  const icons = [Server, FileCode2, ShieldCheck, Webhook, Check];
  return (
    <ol className="flex items-center gap-2 overflow-x-auto">
      {steps.map((label, i) => {
        const Icon = icons[i];
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium ${
              done ? "border-primary bg-primary text-primary-foreground" :
              active ? "border-primary text-primary" :
              "border-border text-muted-foreground"
            }`}>
              {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
            </div>
            <span className={`text-xs ${active ? "font-medium" : "text-muted-foreground"}`}>{label}</span>
            {i < steps.length - 1 && <span className="mx-1 h-px w-6 bg-border" />}
          </li>
        );
      })}
    </ol>
  );
}
