# 1. Known Gaps Summary
The current OTP Management Platform demo shows strong lifecycle breadth, but the biggest maturity gaps are in **workflow closure, data semantics formalization, API/service depth, and architectural structure**. Many screens/actions are present and useful for exploration, yet several behaviors remain simulation-level or UI-only.

This document should be read as a **practical maturity-gap inventory** to guide disciplined next steps, not as a criticism list.

# 2. Product / Business Gaps

## Gap: Lifecycle transitions are visible but not fully governed
- **What appears incomplete:** status progression is represented in UI but not modeled as a strict end-to-end workflow/approval process.
- **Evidence:** pre-sign statuses and wizard transitions exist, but no explicit global state-machine contract is present.
- **Why it matters:** downstream reliability depends on clear transition rules and eligibility criteria.

## Gap: Management/review views are richer than supporting operational closure
- **What appears incomplete:** dashboard/mapping provide strong visibility, but remediation workflows are limited.
- **Evidence:** mapping shows anomalies and statuses; anomaly editing exists, yet resolution lifecycle and accountability path are shallow.
- **Why it matters:** review without robust follow-through can create monitoring-only behavior.

## Gap: Stage coverage is broad, but some actions remain demonstration-depth
- **What appears incomplete:** OCR/sync/import-like actions are represented but not integrated with real systems.
- **Evidence:** simulated OCR messages and sync mutations in local state.
- **Why it matters:** business stakeholders may overestimate operational readiness.

## Gap: Role semantics are partially represented but not policy-complete
- **What appears incomplete:** role-based action gating exists but business ownership boundaries and approval authority are not fully defined.
- **Evidence:** permission matrix and `hasPermission()` logic are present, but no persisted/authoritative policy contract.
- **Why it matters:** governance scope affects workflow design and API authorization.

# 3. Data / Model Gaps

## Gap: No formal schema contract
- **What appears incomplete/inconsistent:** entity structure is implicit in JS objects and handlers, not centralized in typed schemas.
- **Evidence:** in-memory `state` + `seedData()` define model shape; no schema/type files.
- **Why it matters:** increases risk of drift between pages, validations, and future APIs.

## Gap: Naming inconsistency in linkage fields
- **What appears incomplete/inconsistent:** similar concepts use mixed key naming styles.
- **Evidence:** both `presign_contract_id` and `pre_sign_contract_id` patterns appear.
- **Why it matters:** complicates query contracts and integration mapping.

## Gap: Cardinality and ownership rules are implied, not formalized
- **What appears incomplete/inconsistent:** parent-child and many-to-many relationships are implemented procedurally, without explicit constraints.
- **Evidence:** links/allocations/nodes are array-managed and replaced in save handlers.
- **Why it matters:** ambiguous cardinality blocks robust persistence/API design.

## Gap: Derived metrics logic is code-embedded and not contractized
- **What appears incomplete/inconsistent:** mapping status, anomaly classification, invoice remaining are computed inline.
- **Evidence:** calculation functions derive cross-stage outcomes from current in-memory data.
- **Why it matters:** backend parity and testability require explicit rule contracts.

# 4. UX / Flow Gaps

## Gap: Placeholder interactions reduce flow certainty
- **What appears incomplete:** some toolbar/actions are explicitly non-implemented or simulated.
- **Evidence:** preview toolbar uses demo toast; OCR flow is simulated.
- **Why it matters:** users cannot distinguish final interactions from demo placeholders without documentation.

## Gap: Global search intent is present, semantics are shallow
- **What appears incomplete:** search input exists in shell, but deep cross-module search behavior is limited.
- **Evidence:** global search routes to Salesforce filter path; no full federated search model.
- **Why it matters:** cross-entity navigation at scale depends on predictable search semantics.

## Gap: Flow continuity across pages is partly implicit
- **What appears incomplete:** users can navigate stage by stage, but explicit guided lifecycle progression UX is limited.
- **Evidence:** module-based navigation and route links exist, but no dedicated “next-step” orchestration path.
- **Why it matters:** onboarding and process compliance become harder for non-expert users.

## Gap: Error/retry UX depth is minimal
- **What appears incomplete:** failure handling and retry guidance for operations are lightweight.
- **Evidence:** sync/OCR actions provide simplified success-style feedback.
- **Why it matters:** robust operational behavior requires clear failure states and resolution guidance.

# 5. Technical / Architecture Gaps

## Gap: Single-file concentration of responsibilities
- **What appears incomplete:** `app.js` mixes state, routing, rendering, validation, and business logic.
- **Evidence:** monolithic script with most platform logic in one file.
- **Why it matters:** maintainability, testing, and safe iteration become harder over time.

## Gap: No real service/API abstraction layer
- **What appears incomplete:** no `fetch`/`axios` calls, API client, or data repository boundaries.
- **Evidence:** all CRUD and actions mutate local in-memory state.
- **Why it matters:** backend integration will require significant refactoring if deferred.

## Gap: No persistence or concurrent data handling
- **What appears incomplete:** all data is runtime-only and local.
- **Evidence:** `seedData()` on startup; no storage/database integration.
- **Why it matters:** cannot validate multi-user consistency or durable lifecycle history.

## Gap: No automated quality gate
- **What appears incomplete:** no test harness, no CI/build scripts in repo.
- **Evidence:** static-file project without package scripts or test setup.
- **Why it matters:** regression risk grows with each new feature.

## Gap: Validation/business rules are scattered
- **What appears incomplete:** important checks are concentrated in UI handlers rather than a central rule layer.
- **Evidence:** allocation and save validations embedded in module-specific form logic.
- **Why it matters:** duplicated or diverging rules can cause inconsistent outcomes.

# 6. Gaps That Require Human Clarification

## Question area: Canonical lifecycle transition policy
- **Why repo is insufficient:** status fields exist, but final approval/state semantics are not formally defined.
- **Needed clarification:** authoritative transition table (who can move what state, with required conditions).

## Question area: Mandatory linkage semantics
- **Why repo is insufficient:** PMS/Salesforce link requirements are partly coded and partly inferred from nominal types.
- **Needed clarification:** explicit mandatory/optional linkage rules by business scenario.

## Question area: System-of-record boundaries
- **Why repo is insufficient:** snapshots/PMS/contracts/invoices are local demo entities with no integration contract.
- **Needed clarification:** source-of-truth ownership per entity and sync directionality.

## Question area: Governance depth expectations
- **Why repo is insufficient:** permissions/audit/sync pages exist but production policy rigor is unknown.
- **Needed clarification:** target compliance/audit requirements and role boundary model.

## Question area: Placeholder vs intended final behavior
- **Why repo is insufficient:** some interactions are simulated but not uniformly marked for future replacement.
- **Needed clarification:** definitive list of prototype-only behaviors and expected production replacements.

# 7. Priority Gap Assessment

## High priority
- Formalize core lifecycle transition and linkage semantics.
- Normalize data schema/naming and relationship contracts.
- Introduce API/service boundaries for critical flows.
- Reduce monolithic `app.js` coupling for maintainability.
- Add minimal automated checks for core calculations/routes.

## Medium priority
- Deepen anomaly remediation and review closure workflow.
- Harden global search/filter semantics across modules.
- Improve error/retry UX patterns for simulated operations.
- Clarify governance role boundaries and permission policy model.

## Lower priority
- Advanced analytical/reporting enhancements beyond current dashboard/mapping baseline.
- UI polish improvements that do not affect flow integrity.
- Broader feature expansion before core semantics are stabilized.

# 8. Practical Guidance for Future Development
- Use this file as a **pre-feature checklist** before adding new modules/screens.
- Close high-priority foundational gaps first, especially model/linkage/API semantics.
- Require explicit human confirmation for ambiguity items before backend/workflow hardening.
- Reassess this gap list at the end of each development cycle and move resolved items into decision records.

# 9. Confidence Notes

## Confidently observed in the repo
- The demo has broad lifecycle/module coverage with strong UI-level traceability intent.
- Several important behaviors are simulated or local-state-only (OCR/sync/API-equivalent actions).
- Major technical constraints are architectural concentration, absent service layer, and no automated tests.

## Still uncertain / requires human confirmation
- Final business workflow semantics and mandatory linkage policies.
- Production governance/compliance requirements for permissions/audit.
- Definitive integration ownership and API contract boundaries.
- Which current demo interactions are intentionally temporary vs strategic long-term patterns.
