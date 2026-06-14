import { useMemo, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Server,
  Boxes,
  Sparkles,
  Plus,
  X,
  ShieldCheck,
  AlertTriangle,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { providers } from "@/lib/mock-data";
import { flowDefinitions } from "@/lib/flow-data";
import { sandboxes } from "@/lib/sandbox-data";

export const Route = createFileRoute("/app/sandboxes/new")({
  validateSearch: (s: Record<string, unknown>) => ({
    provider: typeof s.provider === "string" ? s.provider : undefined,
  }),
  component: NewSandboxWizard,
});

const steps = ["Provider", "APIs", "Scenarios", "Review"] as const;
const stepBlurb = [
  "Pick the provider you want to simulate.",
  "Choose which APIs this sandbox should expose.",
  "Pick the failures to test — or describe them and let AI build them.",
  "Confirm and create your sandbox.",
];

interface CustomScenario {
  id: string;
  name: string;
  source: "custom" | "ai";
}

function NewSandboxWizard() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [step, setStep] = useState(0);

  const [provider, setProvider] = useState<string>(search.provider ?? "");
  const [name, setName] = useState<string>("");
  const [selectedFlows, setSelectedFlows] = useState<string[]>([]);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [customScenarios, setCustomScenarios] = useState<CustomScenario[]>([]);
  const [customDraft, setCustomDraft] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");

  const availableFlows = useMemo(
    () => flowDefinitions.filter((f) => !provider || f.provider === provider),
    [provider],
  );

  // Scenarios derived from the chosen APIs
  const availableScenarios = useMemo(() => {
    const out: { id: string; name: string; code: string; cause: string; flowName: string }[] = [];
    for (const f of flowDefinitions) {
      if (!selectedFlows.includes(f.id)) continue;
      for (const s of f.failureScenarios) {
        out.push({ id: s.id, name: s.name, code: s.providerCode, cause: s.cause, flowName: f.name });
      }
    }
    return out;
  }, [selectedFlows]);

  const providerOptions = useMemo(() => {
    const used = new Set(flowDefinitions.map((f) => f.provider));
    return providers
      .filter((p) => used.has(p.name))
      .concat(providers.filter((p) => !used.has(p.name)));
  }, []);

  const totalScenarios = selectedScenarios.length + customScenarios.length;

  const canNext = () => {
    if (step === 0) return !!provider && name.trim().length > 1;
    if (step === 1) return selectedFlows.length > 0;
    if (step === 2) return totalScenarios > 0;
    return true;
  };

  const addCustom = () => {
    const value = customDraft.trim();
    if (!value) return;
    setCustomScenarios((prev) => [...prev, { id: `c_${Date.now()}`, name: value, source: "custom" }]);
    setCustomDraft("");
  };

  const generateFromAi = () => {
    const value = aiPrompt.trim();
    if (!value) return;
    // Mock interpretation — would call the AI gateway to synthesize scenarios
    const generated: CustomScenario[] = value
      .split(/\n|\.|,/)
      .map((s) => s.trim())
      .filter((s) => s.length > 4)
      .slice(0, 4)
      .map((s, i) => ({ id: `ai_${Date.now()}_${i}`, name: s.charAt(0).toUpperCase() + s.slice(1), source: "ai" as const }));
    if (generated.length === 0) {
      generated.push({ id: `ai_${Date.now()}`, name: value, source: "ai" });
    }
    setCustomScenarios((prev) => [...prev, ...generated]);
    setAiPrompt("");
    toast.success("AI drafted scenarios", {
      description: `${generated.length} scenario${generated.length === 1 ? "" : "s"} added from your description.`,
    });
  };

  const removeCustom = (id: string) =>
    setCustomScenarios((prev) => prev.filter((c) => c.id !== id));

  const handleCreate = () => {
    toast.success(`Sandbox "${name}" created`, {
      description: `${selectedFlows.length} API${selectedFlows.length === 1 ? "" : "s"} · ${totalScenarios} scenario${totalScenarios === 1 ? "" : "s"} ready to replay.`,
    });
    const target = sandboxes[0]?.id ?? "sb_paystack_main";
    navigate({ to: "/app/sandboxes/$id", params: { id: target } });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-1">
          <Link to="/app/sandboxes">
            <ArrowLeft className="mr-1 h-4 w-4" /> Sandboxes
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Create a sandbox</h1>
        <p className="text-sm text-muted-foreground">
          Select a provider, pick the APIs, then choose the failures you want to test.
        </p>
      </div>

      <Stepper current={step} />

      <Card>
        <CardContent className="space-y-5 p-6">
          <div>
            <h2 className="text-base font-semibold">{steps[step]}</h2>
            <p className="text-sm text-muted-foreground">{stepBlurb[step]}</p>
          </div>

          {/* Step 0 — Provider */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="grid gap-2 sm:grid-cols-2">
                {providerOptions.map((p) => {
                  const active = provider === p.name;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setProvider(p.name);
                        setSelectedFlows([]);
                        setSelectedScenarios([]);
                      }}
                      className={`rounded-lg border p-3 text-left transition-colors ${active ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">{p.name}</span>
                        {active && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {p.type} · {p.country}
                      </p>
                    </button>
                  );
                })}
              </div>
              <div>
                <Label htmlFor="sb-name">Sandbox name</Label>
                <Input
                  id="sb-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Paystack — Checkout"
                  className="mt-1.5"
                />
              </div>
            </div>
          )}

          {/* Step 1 — APIs */}
          {step === 1 && (
            <div className="space-y-2">
              {availableFlows.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No APIs shipped for this provider yet. Pick another provider to continue.
                </p>
              )}
              {availableFlows.map((f) => {
                const checked = selectedFlows.includes(f.id);
                return (
                  <label
                    key={f.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${checked ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) => {
                        setSelectedFlows((prev) =>
                          v ? [...prev, f.id] : prev.filter((id) => id !== f.id),
                        );
                        if (!v) {
                          const codes = f.failureScenarios.map((s) => s.id);
                          setSelectedScenarios((prev) => prev.filter((id) => !codes.includes(id)));
                        }
                      }}
                      className="mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">{f.name}</p>
                        <Badge variant="outline" className="text-xs font-normal">
                          {f.apiVersion}
                        </Badge>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {f.description}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {f.failureScenarios.length} ready-made scenarios · {f.webhooks.length} webhooks
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          {/* Step 2 — Scenarios */}
          {step === 2 && (
            <div className="space-y-6">
              {/* AI prompt */}
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">Describe it, let AI build it</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Type the failure in plain English and the AI agent turns it into testable scenarios.
                </p>
                <Textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Card gets declined then the webhook arrives twice, 30s apart"
                  className="mt-3 min-h-[72px]"
                />
                <div className="mt-2 flex justify-end">
                  <Button size="sm" onClick={generateFromAi} disabled={!aiPrompt.trim()}>
                    <Wand2 className="mr-1.5 h-4 w-4" /> Generate scenarios
                  </Button>
                </div>
              </div>

              {/* Ready-made scenarios */}
              <div>
                <p className="mb-2 text-sm font-medium">Ready-made for your APIs</p>
                {availableScenarios.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No built-in scenarios for the selected APIs. Add your own below.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {availableScenarios.map((s) => {
                      const checked = selectedScenarios.includes(s.id);
                      return (
                        <label
                          key={s.id}
                          className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${checked ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(v) =>
                              setSelectedScenarios((prev) =>
                                v ? [...prev, s.id] : prev.filter((id) => id !== s.id),
                              )
                            }
                            className="mt-0.5"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium">{s.name}</p>
                              <Badge
                                variant="outline"
                                className="border-destructive/40 font-mono text-xs text-destructive"
                              >
                                {s.code}
                              </Badge>
                            </div>
                            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                              {s.cause}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Custom scenarios */}
              <div>
                <p className="mb-2 text-sm font-medium">Your custom scenarios</p>
                <div className="flex gap-2">
                  <Input
                    value={customDraft}
                    onChange={(e) => setCustomDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustom();
                      }
                    }}
                    placeholder="e.g. Issuer timeout after 25s"
                  />
                  <Button variant="outline" onClick={addCustom} disabled={!customDraft.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {customScenarios.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {customScenarios.map((c) => (
                      <span
                        key={c.id}
                        className="inline-flex items-center gap-1.5 rounded-md border bg-card px-2.5 py-1 text-xs"
                      >
                        {c.source === "ai" ? (
                          <Sparkles className="h-3 w-3 text-primary" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 text-muted-foreground" />
                        )}
                        {c.name}
                        <button type="button" onClick={() => removeCustom(c.id)} className="text-muted-foreground hover:text-foreground">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3 — Review */}
          {step === 3 && (
            <div className="space-y-4">
              <ReviewRow label="Name" value={name || "—"} />
              <ReviewRow label="Provider" value={provider || "—"} />
              <ReviewRow
                label="APIs"
                value={
                  selectedFlows.length
                    ? availableFlows
                        .filter((f) => selectedFlows.includes(f.id))
                        .map((f) => f.name)
                        .join(", ")
                    : "—"
                }
              />
              <ReviewRow label="Scenarios" value={`${totalScenarios} selected`} />

              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs">
                <p className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" /> Safe by design
                </p>
                <p className="mt-1 text-muted-foreground">
                  This sandbox never calls the real provider. It returns provider-shaped responses and
                  signed webhooks for the scenarios you chose.
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

function ReviewRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b pb-2 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={`text-right ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
    </div>
  );
}

function Stepper({ current }: { current: number }) {
  const icons = [Server, Boxes, Sparkles, Check];
  return (
    <ol className="flex items-center gap-2 overflow-x-auto">
      {steps.map((label, i) => {
        const Icon = icons[i];
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium ${
                done
                  ? "border-primary bg-primary text-primary-foreground"
                  : active
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground"
              }`}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
            </div>
            <span className={`text-xs ${active ? "font-medium" : "text-muted-foreground"}`}>
              {label}
            </span>
            {i < steps.length - 1 && <span className="mx-1 h-px w-6 bg-border" />}
          </li>
        );
      })}
    </ol>
  );
}
