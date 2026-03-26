# 1. Roadmap Summary
The current OTP Management Platform is a **high-fidelity, frontend-only prototype** with broad lifecycle coverage and in-memory business logic. This roadmap is therefore a **stabilization-first roadmap**: preserve the strong lifecycle structure already present, then progressively deepen flow behavior, data semantics, and integration readiness.

Priority principle used here:
1. protect and clarify what already works (structure + terminology),
2. complete highest-value end-to-end flows,
3. harden data/linkage semantics,
4. expand governance/workflow rigor,
5. prepare production-grade architecture.

# 2. Current Baseline
- The demo already covers major lifecycle modules: `salesforce`, `pms`, `presign`, `contract`, `invoice`, plus `dashboard` and `mapping` review views.
- Governance/admin surfaces are present (`master`, `users`, `permissions`, `audit`, `sync`) and integrated into navigation.
- Cross-stage traceability intent is strong through explicit links and allocation child records (`preSignLinks`, `preSignPmsAllocations`, `preSignSfAllocations`, payment nodes).
- UX patterns are consistent: list -> detail -> edit/new, table-heavy filters, modal pickers, drawer/tab drilldowns.
- Data model is rich but implicit (array-based in-memory `state`, seed-driven structures, no formal schema enforcement).
- Integration-like capabilities (OCR, sync) are represented mostly as simulation/placeholder behavior.
- The codebase is simple to run (static SPA), but maintainability risk is growing due to large single-file logic and schema-light implementation.

# 3. Recommended Roadmap Stages

## Stage 1: Foundation Stabilization (Docs + Structure)
- **Objective:** lock down naming, route conventions, and baseline entity/flow semantics already present.
- **Why now:** prevents drift while feature count is increasing.
- **Work in scope:**
  - normalize key field naming conventions (`presign_contract_id` vs `pre_sign_contract_id`),
  - document canonical route map and module ownership boundaries,
  - define a minimal formal schema dictionary from current entities,
  - add lightweight code structure boundaries (split oversized app file by domain).
- **Not focus yet:** deep new business features or external integrations.

## Stage 2: Core Flow Completion
- **Objective:** make top user journeys reliably complete, not only UI-present.
- **Why now:** pre-sign -> contract -> invoice -> mapping feedback is the product core.
- **Work in scope:**
  - tighten transition rules between pre-sign statuses and contract creation,
  - complete validation/error feedback for allocation/payment flows,
  - improve global and module search/filter behavior consistency,
  - close obvious placeholder interactions or mark them clearly.
- **Not focus yet:** advanced analytics redesign or broad new modules.

## Stage 3: Data & Linkage Hardening
- **Objective:** formalize cross-entity semantics and reconciliation rules.
- **Why now:** mapping/review quality depends on reliable linkage semantics.
- **Work in scope:**
  - define cardinality and mandatory-link rules,
  - formalize anomaly logic inputs/outputs,
  - establish deterministic derived fields (invoice remain, derivation status),
  - introduce data contract tests against seed scenarios.
- **Not focus yet:** full production infrastructure.

## Stage 4: Workflow & Governance Expansion
- **Objective:** evolve from UI-level controls to stronger process governance.
- **Why now:** existing permissions/audit/sync pages imply governance expectations.
- **Work in scope:**
  - formal state-machine and approval transitions,
  - stronger role-permission semantics and action gating model,
  - richer audit/event model and resolution trace for anomalies,
  - operational sync semantics (job states, failures, retries).
- **Not focus yet:** scale/performance optimization for large production loads.

## Stage 5: Production-Readiness Preparation
- **Objective:** prepare architecture and delivery model for real deployment.
- **Why now:** only after semantics and flows are stabilized.
- **Work in scope:**
  - API and persistence design aligned to finalized model,
  - backend authorization and audit persistence,
  - test strategy (unit/integration/e2e) and CI pipeline,
  - observability and operational rollout requirements.
- **Not focus yet:** net-new scope expansion before core stability.

# 4. Priority Workstreams

## Workstream: Entity and naming normalization
- **Current state:** rich entities exist, but mixed naming conventions and implicit schema.
- **Next step:** define canonical field/key naming and publish a schema dictionary.
- **Priority:** **High**.

## Workstream: Pre-sign -> contract -> invoice flow depth
- **Current state:** flow is present and interactive, but partially rule-driven in frontend handlers.
- **Next step:** formalize transition preconditions, validation outcomes, and error handling.
- **Priority:** **High**.

## Workstream: Linkage and reconciliation semantics
- **Current state:** `preSignLinks` + mapping status logic are strong but mostly code-embedded.
- **Next step:** externalize/linkage rules and anomaly semantics into documented contracts.
- **Priority:** **High**.

## Workstream: UX consistency and navigation hardening
- **Current state:** consistent patterns exist; some controls are simulated or shallow.
- **Next step:** standardize interaction contracts (list/detail/edit, modal confirm, drilldown context persistence).
- **Priority:** **Medium**.

## Workstream: Governance feature depth (permissions/audit/sync)
- **Current state:** governance pages exist, mostly demonstration depth.
- **Next step:** define enforceable permission model, richer audit event taxonomy, sync lifecycle states.
- **Priority:** **Medium**.

## Workstream: Technical modularization and quality guardrails
- **Current state:** single large app script, no automated tests/pipeline.
- **Next step:** modularize by domain and add baseline tests + CI checks.
- **Priority:** **High**.

## Workstream: Integration readiness
- **Current state:** OCR/sync are simulated.
- **Next step:** specify integration contracts and replace simulation points incrementally.
- **Priority:** **Low** (until Stage 1–3 stabilize).

# 5. Near-Term Recommendations
1. Publish a canonical entity + field glossary based on current `state` objects.
2. Standardize ID/link naming across pre-sign/contract/payment-node fields.
3. Define and implement explicit transition guards for `presign` statuses and contract wizard eligibility.
4. Consolidate repeated validation logic for allocations/payment nodes into shared helpers.
5. Convert placeholder actions (or clearly tag them) to reduce UX ambiguity.
6. Add route/flow smoke tests for critical paths (`presign`, wizard, `contract`, `invoice`, `mapping`).
7. Split `app.js` by domains (routing, data model, module renderers, calculations, utilities).
8. Add a minimal CI check set (lint/style + smoke validation script).

# 6. Medium-Term Recommendations
- Move from implicit UI logic to explicit lifecycle state machine definitions.
- Introduce formal persistence/API contracts for core entities and linkage objects.
- Strengthen reconciliation engine behavior (deterministic anomaly classification and resolution lifecycle).
- Expand permission and audit semantics from display-level to enforceable policy model.
- Improve dashboard/mapping analytical depth only after flow and data semantics are stable.

# 7. Risks of Expanding Too Fast
- **Semantic drift:** adding features before naming/schema stabilization can create incompatible entity semantics.
- **Flow fragmentation:** new screens may bypass or duplicate core lifecycle transitions.
- **Logic duplication debt:** more UI-only rules in multiple places will increase inconsistency and bug risk.
- **False production confidence:** simulated OCR/sync behavior may be mistaken for real operational readiness.
- **Navigation inconsistency:** ad-hoc route additions can break the current module-first mental model.
- **Testing gap amplification:** feature growth without baseline tests will reduce confidence in reconciliation outcomes.

# 8. Suggested Backlog Framing
Frame backlog by **flow + hardening layer** rather than isolated UI tickets:
- **Layer A (Flow integrity):** complete pre-sign -> contract -> invoice -> mapping loops.
- **Layer B (Data integrity):** naming/schema/cardinality/link-rule consistency.
- **Layer C (Interaction integrity):** route consistency, drilldown continuity, error/feedback quality.
- **Layer D (Governance integrity):** permission, audit, sync semantics.
- **Layer E (Technical hardening):** modularization, tests, CI, integration contracts.

Use each ticket template with: affected entities, affected routes, validation rules, and rollback/fallback behavior.

# 9. Confidence Notes

## Confidently inferred from the repo
- The project has broad lifecycle/module/page coverage and strong traceability intent already implemented.
- Core flows and reconciliation features exist but are mostly frontend-embedded.
- Governance/admin surfaces are present and should be evolved rather than replaced.
- The technical baseline is prototype-first (static SPA + in-memory state + simulated integrations).

## Still uncertain / requires human confirmation
- Which business rules are mandatory vs optional in production.
- Final role/approval policy and audit/compliance depth.
- Production architecture target (monolith vs services, data ownership boundaries).
- Prioritization between governance hardening and additional business feature breadth.
