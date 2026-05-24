# FlowSim v2 — Lifecycle Platform Refactor

I read your direction end-to-end. Below is what I'll build, what I'll cut, and what I'd push back on — followed by the concrete file/route plan.

---

## What I agree with (and will build)

The big idea is right: FlowSim should be the **lifecycle loop** for fintech integrations, not a mock-API tool with a dashboard bolted on. The repositioning to **Sandbox → Scenario → Instance → Replay → Fix-validation**, with **Providers as the entry point** and **Monitoring + Ops Brain as the feedback edge**, is the correct product spine.

Specifically I'll build:

1. New IA and navigation
2. Providers page → Create-Sandbox wizard → Sandboxes list → Sandbox detail
3. Scenarios as a first-class authored object
4. Instances (replacing the generic "Transactions" surface) with the existing flow graph + four-questions panel already wired in
5. Dedicated **Replay** page with original-vs-replay comparison and a "fix validated" outcome
6. **Monitoring** page framed as *integration signals* (which provider, which flow, replayable?) — not generic observability
7. Ops Brain re-pointed at the new Instance/Replay primitives
8. Integrations page grouped by category (Code / Monitoring / Comms / Issue tracking)
9. **Code-repo and Slack surfaces treated as product, not settings** (see below)
10. Language pass: Sandbox / Flow / Scenario / Instance / Replay / Fix-validation everywhere

## Code-repo surface — provider-agnostic

You're right that this can't be GitHub-only. I'll build a **single Code Repository surface** that supports **GitHub, GitLab, Bitbucket** (and is structured so Azure DevOps / Gitea slot in later). Same screens, same flow, only the provider badge + auth shape differs.

Shared model:
```
RepoProvider = "github" | "gitlab" | "bitbucket"
RepoConnection { id, provider, account, status, lastSyncedAt }
Repository    { id, connectionId, provider, fullName, defaultBranch, language, framework }
RepoMapping   { repoId, sandboxId, providerId, flowIds[] }
```

Shared screens (one set, branded per provider):
- **Connect repository provider** — provider picker (GitHub / GitLab / Bitbucket) → auth screen → repo list
- **Repository list** — across all connected providers, with provider chip
- **Repo → Sandbox mapping** — same wizard regardless of source
- **Generated integration code panel** — language tabs (Node/Python/Go), framework auto-detected, with copy/download/"open PR" actions. Identical UX for all three providers.
- **Webhook handler + scenario test file generation** — same templates, same UX

Where providers differ (handled in one config map, not duplicated UI):
- Auth shape (GitHub App vs GitLab PAT vs Bitbucket OAuth) — shown in connect screen only
- "Open PR" wording becomes "Open Merge Request" on GitLab
- Repo URL format

This lives as **`/app/integrations/code`** (category landing) with per-connection detail at `/app/integrations/code/$connectionId`. Sandbox detail still has the "Generate integration code" CTA — it opens the same generator, scoped to whichever repo is mapped.

## Slack surface — product, not settings

Slack gets:
- Marketing-home **animated Slack thread** demoing `@flowsim` flow (CSS/Motion, no backend)
- In-app **Slack workspace connect** screen + channel routing rules + message preview
- Per-incident "Send to Slack" action on Ops Brain and Replay results
- Honest framing: animation + UI prototype, not a live bot (see below)

## What I'd push back on

These I'll **drop or scope down** unless you object:

- **"Production-faithful" fidelity tier promising real endpoints + real signatures.** In a frontend-only mock layer this would be a lie. I'll keep the three tiers as a labelled product concept (Template / Provider-like / Production-faithful) shown in UI, but copy will be honest: Production-faithful means *payload + error-code + webhook-name + signature-shape parity with the provider spec we ship*, not a live proxy.
- **Real OAuth for GitHub/GitLab/Bitbucket/Datadog/Sentry/Slack.** I'll build the connect UX and realistic mock data. Wiring real OAuth is a backend project.
- **Slack slash commands as a working bot.** Config + animated demo + message previews only.
- **Jira/ClickUp ticket creation that actually creates tickets.** Buttons + realistic "ticket created" preview, clearly a prototype.
- **"Generate fix suggestion" as a separate AI surface.** Already lives inside Ops Brain's Four Questions. I'll link, not duplicate.
- **Splitting Monitoring and Ops Brain into two unrelated pages.** They're the same loop. Monitoring = raw feed. Ops Brain = interpreted clusters. One-click jump between them.
- **Generic "Analytics"/vanity charts.** Cut from Overview — replaced with the operational cards you listed (active sandboxes, replay runs, fix validations passed, etc.).
- **Editing the Flow Designer.** Stays read-only as previously agreed.

## What I'd add that you didn't ask for

- **"Fix validated" badge** on Instances that have a passing replay — makes the loop visible.
- **"Replay this in sandbox" button** on every failed Instance, Monitoring event, and Ops Brain cluster — same component, same destination. One verb, everywhere.
- **Empty-state coaching** on Sandboxes/Scenarios/Replay.

---

## Information architecture

Final left-nav:

```
Overview
Providers
Sandboxes
Flows
Scenarios
Instances
Replay
Monitoring
Ops Brain
Integrations
─────────────
API Keys
Settings
```

Removed top-level entries: `Transactions`, `Failures`, `Webhooks`. They fold into Instances (with filters) and Sandbox-detail tabs. Failures stays as a *lens* (badges, filters), not a page.

## Route plan

**New routes**
- `app.sandboxes.index.tsx` — list
- `app.sandboxes.new.tsx` — 5-step wizard (Provider → APIs → Fidelity → Webhook → Review)
- `app.sandboxes.$id.tsx` — detail (overview / keys / APIs / scenarios / instances / webhooks / integration code)
- `app.instances.index.tsx` — list (rename of transactions, richer filters)
- `app.instances.$id.tsx` — detail (graph + timeline + payloads + four-questions + replay drawer)
- `app.replay.index.tsx` — failed-instance picker + replay history + comparison
- `app.replay.$instanceId.tsx` — original vs replay side-by-side, "fix validated" verdict
- `app.monitoring.tsx` — production signal feed with "Replay this" CTA
- `app.scenarios.$id.tsx` — scenario builder/editor
- `app.integrations.code.tsx` — code-repo provider landing (GitHub/GitLab/Bitbucket)
- `app.integrations.code.$connectionId.tsx` — repo list + mapping + code generation per connection
- `app.integrations.slack.tsx` — workspace connect + channel routing + message preview

**Reworked**
- `app.overview.tsx`, `app.providers.tsx`, `app.ops-brain.tsx`, `app.integrations.tsx` (category grouping), `app.scenarios.tsx`, marketing `index.tsx` (Slack animation)

**Retired (with redirects)**
- `app.transactions.tsx`, `app.transaction.$id.tsx` → `/app/instances`
- `app.failures.tsx` → `/app/instances?outcome=failed`
- `app.webhooks.tsx` → sandbox-detail tab

## Component plan

**New**
- `components/sandbox-wizard/*`
- `components/sandbox-card.tsx`, `provider-card.tsx`
- `components/scenario-builder.tsx`
- `components/replay-comparison.tsx` — two-column diff + verdict chip
- `components/monitoring-source-card.tsx` — Datadog/Sentry/CW/ELK tiles
- `components/repo-provider-picker.tsx` — GitHub/GitLab/Bitbucket selector
- `components/repo-connect-flow.tsx` — provider-aware connect (one component, one config map)
- `components/integration-code-panel.tsx` — language tabs, copy/download, "Open PR / Merge Request"
- `components/slack-animation.tsx` — looping animated thread (Motion, no backend)
- `components/slack-message-preview.tsx`
- `components/fix-validation-badge.tsx`

**Reused as-is**: `flow-designer`, `flow-replay`, `four-questions-panel`, `failure-badge`.

## Data plan (mock layer)

Extend `lib/flow-data.ts`; add:
- `lib/sandbox-data.ts` — Sandbox, Scenario, MonitoringEvent, ReplayRun + seeds
- `lib/repo-data.ts` — RepoConnection, Repository, RepoMapping seeded across all three providers
- `lib/code-generators.ts` — language × framework × provider templates

`FlowInstance` gains `sandboxId` and `scenarioMatchedId`.

Seed enough mock data so every page has signal: 3–5 sandboxes, 8–10 scenarios, 6 monitoring events, 4 replay runs (mix of passed/failed), 2 GitHub repos + 1 GitLab + 1 Bitbucket.

## Fidelity tiers — honest copy

In the wizard and on sandbox cards:
- **Template** — generic shape, useful for wiring.
- **Provider-like** — provider-shaped payloads, common error codes, named webhooks.
- **Production-faithful** — full payload + error-code + webhook-signature parity with our shipped provider spec. *Still a sandbox — does not call the provider.*

## Out of scope this pass

- Real OAuth for any external service
- Real code generation against a live repo (preview only, templated)
- Real Slack bot / slash commands
- Editable Flow Designer
- Backend / Lovable Cloud

## Build order

1. IA + sidebar + redirects from retired routes
2. Data layer: Sandbox, Scenario, MonitoringEvent, ReplayRun, RepoConnection + seeds
3. Providers → Wizard → Sandboxes list → Sandbox detail
4. Scenarios list + builder
5. Instances rename + sandbox/scenario fields
6. Replay page + comparison (the differentiator — gets care)
7. Monitoring page
8. Ops Brain rewire
9. Integrations regroup + **Code provider-agnostic flow (GitHub/GitLab/Bitbucket)** + Slack config + integration-code panel
10. Overview rewrite
11. Marketing home Slack animation
12. Copy pass

App stays runnable between batches.

---

## One thing to confirm before I start

**Fidelity tiers**: accept the honest framing (parity with our spec, still a sandbox), or design as if real-provider proxying exists today? The first is shippable now; the second is a promise I can't keep on the frontend.

Say "go" and I start with steps 1–3.