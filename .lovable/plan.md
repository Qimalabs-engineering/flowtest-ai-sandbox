
## Goal

Shift FlowSim from "visualizes flows" to "lets users understand, reproduce, and fix fintech failures." Failures become the spine of the product; every view answers the four questions: **What happened? Where? Why? What now?**

This plan assumes the flow-based refactor from the previous plan is in place (FlowDefinition, FlowInstance, Flow Designer graph, `/app/failures`, `/app/instances`). It layers failure-first UX, Replay, and Scenario Overlay on top.

---

## 1. Failure as a first-class concept (cross-cutting)

A single `FailurePoint` primitive used everywhere:

```
FailurePoint {
  instanceId
  flowDefinitionId
  atState           // where it broke
  atTransition?     // which transition fired the failure
  scenarioId        // which FailureScenario matched (real provider error)
  cause             // short human label
  providerCode      // real error code, e.g. "02" / "ResultCode:1032"
  suggestedFix      // tied to the state, see Ops Brain section
  evidence[]        // events, webhooks, logs that prove it
}
```

A `<FailureBadge instance>` component (icon + state name + reason code) is reused in:
- Instances table (replaces the bare "failed" pill)
- Instance detail header
- Webhooks list (when a delivery is tied to a failed instance)
- Events stream
- Ops Brain cards
- `/app/failures` (already)
- Overview KPIs ("12 instances failed at `awaiting_otp` — Mono")

In timelines and graphs, the failure point is marked with a **red ring + pulse** on the offending state node and a **red dashed edge** for the failure transition. Hovering reveals the reason code + suggested fix.

## 2. The "Four Questions" panel

Every instance detail page (`/app/instances/$id`) and every Ops Brain incident card gets a fixed top panel with four short, structured cells:

```
┌─ What happened ─────────┬─ Where in the flow ───────┐
│ charge.failed           │ State: awaiting_3ds       │
│ "Declined by issuer"    │ Transition: submit_otp →  │
│ Code: 02                │   failed                  │
├─ Why ───────────────────┼─ What to do ──────────────┤
│ Issuer flagged the      │ 1. Retry with step-up     │
│ transaction (insufficient│ 2. Fall back to bank     │
│ funds suspected).       │    transfer rail          │
│ Scenario: card_declined │ Open runbook →            │
└─────────────────────────┴───────────────────────────┘
```

Same component reused on Ops Brain cards and `/app/failures` detail. This is the contract: any failure view that doesn't render these four answers is incomplete.

## 3. Ops Brain rework

`/app/ops-brain` becomes failure-attribution-first:

- Primary card layout puts **"Where in the flow"** at the top: a mini graph of the affected FlowDefinition with the failing state highlighted, plus a count badge ("47 instances failed here in the last hour").
- **Suggested fixes are tied to flow state**, not generic. Each `FailureScenario` in a provider spec declares `suggestedFixes[]` with: title, kind (`retry` | `fallback` | `config_change` | `escalate`), and which state(s) the fix applies to. Ops Brain renders the fixes whose state matches the failing state.
- Cluster cards: group active failures by `flowDefinition × atState × scenarioId` so on-call sees "47× Paystack charge failed at `awaiting_3ds` (code 02)" rather than 47 separate alerts.
- Each card has actions: **Replay one**, **Open in Flows**, **Open runbook**, **Acknowledge**.

## 4. Replay (UI only)

New route `/app/instances/$id/replay` (modal/drawer on the instance page is also fine).

Behavior:
- Reuses the instance graph component with a **playhead**.
- Controls: play / pause / step / speed (1×, 2×, 4×). Scrubber across the event timeline.
- As the playhead advances:
  - Traveled states light up in sequence with respect to original timestamps (compressed by speed)
  - Each event appears in a side log as it "happens"
  - Webhook deliveries animate as outbound pulses from the emitting state
- **Divergence highlight**: the FlowDefinition declares a `happyPath[]` (state sequence for the success terminal). The replay overlays the happy path as a faint blue track. The moment the actual instance leaves the happy path, the divergence point gets a yellow marker + label ("Diverged here: expected `processing → success`, got `processing → failed`"). From divergence onward, the actual path is drawn in red.
- A "Replay against current spec" toggle (disabled, tooltip "available when live sandbox is wired") signals where this becomes a real reproduction tool later.

No backend changes — replay reads the existing event log on the FlowInstance and animates it client-side with `requestAnimationFrame` + a timeline scheduler. ~250 LOC component.

## 5. Scenario Overlay

On `/app/flows/$id` (Flow Designer, read-only), add a **Scenario picker** in the toolbar listing the FlowDefinition's `failureScenarios[]`.

When a scenario is selected:
- The graph re-renders with normal transitions dimmed to 30% opacity.
- The failure transition(s) introduced by that scenario light up in red, animated dashed.
- Affected state(s) get a red ring.
- A side panel shows: scenario name, real provider error code, webhook(s) that will fire under this scenario, expected client-visible symptoms, suggested fixes.
- "Compare" mode: split view (normal | with scenario) so users can see exactly what the scenario changes.

Visual language is consistent everywhere:
- **Normal transition** — solid, neutral
- **Failure transition** — red, dashed, animated
- **Happy path** — faint blue track (replay only)
- **Divergence point** — yellow marker
- **Failure point** — red ring + pulse on the state node

## 6. Cross-page consistency pass

Update existing views so the failure narrative carries through:

- **`/app/overview`** — add a "Top failure points" widget: ranked list of `(flowDefinition, state, scenario)` with counts, click → filtered `/app/failures`.
- **`/app/instances`** — failed rows show `<FailureBadge>` with state + reason code inline, not a generic red dot.
- **`/app/webhooks`** — deliveries linked to failed instances get a failure chip and a "Jump to failure point" action.
- **`/app/events`** — events that triggered a failure transition are tagged with a red side-rail.
- **`/app/failures`** — Catalog tab adds "Preview in graph" link (opens `/app/flows/$id?scenario=...` with the overlay pre-applied). Live tab uses cluster cards identical to Ops Brain.
- **`/app/assistant`** — when the assistant references an incident, it renders the same Four Questions panel inline.

## 7. Flow Designer stays read-only

Explicitly: no node drag, no edge editing, no inline rename. The toolbar exposes only view controls (zoom, fit, scenario overlay, layout toggle). A small "Read-only — editing coming soon" hint sits in the toolbar so users don't hunt for an edit button.

---

## File plan

**New**
- `src/components/failure-badge.tsx`
- `src/components/four-questions-panel.tsx`
- `src/components/flow-replay.tsx` (graph + playhead + scheduler)
- `src/components/scenario-overlay-picker.tsx`
- `src/lib/replay-scheduler.ts` (timeline → frames)
- `src/routes/app.instances.$id.replay.tsx` (or modal — decide during build)

**Edited**
- `src/lib/flow-types.ts` — add `happyPath[]` to `FlowDefinition`, `suggestedFixes[]` to `FailureScenario`, `FailurePoint` type
- `src/components/flow-designer.tsx` — accept `scenarioOverlay` and `failurePoint` props
- `src/components/flow-instance-graph.tsx` — accept `playhead` and `divergencePoint` props
- `src/routes/app.flows.$id.tsx` — wire scenario picker
- `src/routes/app.instances.$id.tsx` — Four Questions panel + Replay button
- `src/routes/app.ops-brain.tsx` — cluster cards, "Where in the flow" mini graph, fixes-by-state
- `src/routes/app.overview.tsx` — top failure points widget
- `src/routes/app.instances.tsx`, `app.webhooks.tsx`, `app.events.tsx`, `app.failures.tsx` — `<FailureBadge>` integration
- Provider specs (`src/lib/providers/*/flows/*.ts`) — backfill `happyPath` and `suggestedFixes` on each scenario

## Scope boundary

UI/UX only. No real replay execution, no backend writes, no edit mode in the designer. All data comes from the existing mock layer + provider specs.

## Open question

For Replay UI: **inline drawer on the instance page** (less context loss, can see metadata while scrubbing) or **dedicated full-screen route** (more room for the graph + event log)? My default is **inline drawer** — say the word if you'd rather have the full-screen route.
