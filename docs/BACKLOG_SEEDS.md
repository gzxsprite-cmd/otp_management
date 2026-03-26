# 1. Backlog Seeds Summary
This document is a practical source of **grounded next-step backlog candidates** for the current OTP Management Platform demo. Seeds were derived from observable repo structure: existing routes/pages, data/linkage patterns, simulated actions, known gaps, and roadmap direction.

These items are **not confirmed commitments**. They are intentionally scoped as seed ideas that can be promoted into real tasks after dependency checks and (where needed) business confirmation.

# 2. Seed Categories
- **User Flow Completion**
- **Data Model & Linkage Hardening**
- **Review / Exception Depth**
- **Dashboard & Analysis Maturity**
- **Technical Hardening**
- **Documentation & Consistency**

# 3. Seed Inventory

## Seed 1: Formalize pre-sign -> contract transition guards
- **Category:** User Flow Completion
- **Improve/Add:** codify explicit transition checks and user feedback for wizard eligibility and status changes.
- **Repo evidence:** `signed_ready` gating exists, but broader transition policy is implicit.
- **Why it matters:** prevents lifecycle drift and inconsistent contract creation behavior.
- **Priority:** High
- **Size:** Medium
- **Dependencies:** confirm lifecycle state-machine expectations.

## Seed 2: Consolidate allocation validation rules into shared domain helpers
- **Category:** Data Model & Linkage Hardening
- **Improve/Add:** move repeated allocation/payment validation logic into centralized functions.
- **Repo evidence:** substantial inline validations in pre-sign save path.
- **Why it matters:** reduces duplication and inconsistency risk.
- **Priority:** High
- **Size:** Medium
- **Dependencies:** naming/schema stabilization.

## Seed 3: Standardize linkage field naming conventions
- **Category:** Data Model & Linkage Hardening
- **Improve/Add:** unify key names for pre-sign linkage and payment-node references.
- **Repo evidence:** mixed patterns around pre-sign linkage IDs.
- **Why it matters:** enables clean API contracts and predictable joins.
- **Priority:** High
- **Size:** Small
- **Dependencies:** `DATA_MODEL.md` and `API_SPEC.md` alignment.

## Seed 4: Define explicit parent-child write contract for pre-sign child collections
- **Category:** Data Model & Linkage Hardening
- **Improve/Add:** formalize how links/allocations/charges/payment nodes are saved transactionally.
- **Repo evidence:** current save flow replaces multiple collections procedurally.
- **Why it matters:** critical for backend persistence design and data integrity.
- **Priority:** High
- **Size:** Medium
- **Dependencies:** lifecycle and API boundary confirmation.

## Seed 5: Deepen anomaly resolution workflow
- **Category:** Review / Exception Depth
- **Improve/Add:** move from simple anomaly field edit to clearer resolution lifecycle steps.
- **Repo evidence:** mapping anomaly modal updates fields but closure semantics are shallow.
- **Why it matters:** improves accountability and operational follow-through.
- **Priority:** Medium
- **Size:** Medium
- **Dependencies:** business ownership and review policy clarification.

## Seed 6: Strengthen global search behavior beyond single-route shortcut
- **Category:** User Flow Completion
- **Improve/Add:** make global search semantics explicit (scope, ranking, result navigation).
- **Repo evidence:** shell search exists but routes primarily into one module context.
- **Why it matters:** improves cross-entity usability and discoverability.
- **Priority:** Medium
- **Size:** Medium
- **Dependencies:** decide search scope and result model.

## Seed 7: Expand dashboard drilldown consistency and context persistence
- **Category:** Dashboard & Analysis Maturity
- **Improve/Add:** preserve user context between matrix selection and drawer tabs; align drilldown field sets.
- **Repo evidence:** dashboard drilldown exists but state/context depth can be improved.
- **Why it matters:** improves analytical usability for management review.
- **Priority:** Medium
- **Size:** Small
- **Dependencies:** none critical.

## Seed 8: Introduce baseline route and calculation smoke tests
- **Category:** Technical Hardening
- **Improve/Add:** add minimal automated checks for route rendering and key calculations.
- **Repo evidence:** no test harness/CI present.
- **Why it matters:** reduces regression risk as features grow.
- **Priority:** High
- **Size:** Medium
- **Dependencies:** agree on lightweight test/tool strategy.

## Seed 9: Split `app.js` into domain-focused modules
- **Category:** Technical Hardening
- **Improve/Add:** refactor by concerns (state/model, routing, renderers, utilities, domain logic).
- **Repo evidence:** one large file mixes most responsibilities.
- **Why it matters:** maintainability and parallel development safety.
- **Priority:** High
- **Size:** Large
- **Dependencies:** stabilize naming and route conventions first.

## Seed 10: Introduce explicit service adapter boundary (still mock-backed initially)
- **Category:** Technical Hardening
- **Improve/Add:** create a data-access interface layer to isolate future API integration.
- **Repo evidence:** no fetch/axios/service abstraction today.
- **Why it matters:** lowers migration cost from in-memory to backend API.
- **Priority:** Medium
- **Size:** Medium
- **Dependencies:** endpoint shape baseline from `API_SPEC.md`.

## Seed 11: Clarify simulation labels in UI for OCR/sync/preview actions
- **Category:** User Flow Completion
- **Improve/Add:** ensure simulation-only actions are visibly marked and documented in-page.
- **Repo evidence:** OCR/sync are simulated; preview toolbar has demo placeholder behavior.
- **Why it matters:** avoids confusion about production readiness.
- **Priority:** Medium
- **Size:** Small
- **Dependencies:** none.

## Seed 12: Add structured docs sync checklist to PR workflow
- **Category:** Documentation & Consistency
- **Improve/Add:** require mapped doc updates based on change type.
- **Repo evidence:** many docs now exist and can drift without explicit discipline.
- **Why it matters:** keeps architecture/flow/model docs trustworthy.
- **Priority:** High
- **Size:** Small
- **Dependencies:** team agreement on documentation policy.

# 4. Best Near-Term Seeds
1. **Formalize pre-sign -> contract transition guards** — stabilizes the core lifecycle hinge.
2. **Consolidate allocation validation rules** — reduces critical logic duplication.
3. **Standardize linkage field naming** — foundational for API and persistence alignment.
4. **Define pre-sign child-collection write contract** — prevents data-integrity ambiguity.
5. **Add baseline route/calculation smoke tests** — immediate regression protection.
6. **Split `app.js` by domain concerns (phase 1)** — improves maintainability and reviewability.
7. **Clarify simulation labels in UI** — prevents misleading readiness expectations.
8. **Add docs sync checklist discipline** — keeps multi-doc architecture coherent.

# 5. Seeds That Need Human Clarification First

## Seed: Lifecycle state-machine enforcement
- **Why clarification needed:** repo shows statuses but not final approval semantics.
- **Clarification required:** transition matrix, actor permissions, required evidence per transition.

## Seed: Mandatory linkage policy by scenario
- **Why clarification needed:** linkage behavior is partly coded and partly inferred.
- **Clarification required:** when PMS/Salesforce links are mandatory, optional, or exceptional.

## Seed: Anomaly resolution lifecycle expansion
- **Why clarification needed:** current anomaly model is editable but governance depth is unclear.
- **Clarification required:** resolution ownership, closure criteria, reopen rules, audit expectations.

## Seed: Permission model hardening
- **Why clarification needed:** frontend gating exists but backend authz target is unknown.
- **Clarification required:** final role boundaries, policy source of truth, enforcement layers.

## Seed: Service/API abstraction rollout strategy
- **Why clarification needed:** no live backend integration path is committed.
- **Clarification required:** incremental integration plan, entity ownership, and API contract ownership.

# 6. How to Use These Seeds in Future Codex Work
- Pick seeds aligned with current docs and architecture instead of opening unrelated scope.
- Validate dependency notes before implementation (especially naming/semantics/API dependencies).
- Prefer one seed -> one scoped task -> one coherent PR.
- Update related docs and changelog with each seed implementation.
- For clarification-dependent seeds, capture answers first, then implement.

# 7. Confidence Notes

## Confidently derived from the current repo
- Seeds around transition hardening, validation consolidation, naming consistency, and technical modularization are strongly supported by visible code structure.
- Test/CI baseline and service-adapter seeds are justified by the absence of automated/tested integration layers.
- Documentation-discipline seeds are warranted due to the now-large `docs/` footprint.

## Still uncertain / requires human confirmation
- Exact lifecycle/approval policy details and anomaly governance semantics.
- Final mandatory linkage rules across nominal types and scenarios.
- Backend/API ownership boundaries and rollout sequencing.
- Long-term balance between feature breadth and governance hardening.
