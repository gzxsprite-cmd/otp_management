# 1. Decisions Summary
The current OTP Management Platform demo already embodies decisions across product scope, lifecycle modeling, data linkage, UX structure, and prototyping approach. These decisions are not recorded as formal ADRs, but they are visible in route design, state/entity shape, mapping logic, and page interactions. The dominant pattern is a lifecycle-aware operational prototype that prioritizes cross-stage traceability and review visibility over backend completeness.

# 2. Product / Scope Decisions

## Decision: Organize product scope by lifecycle-aligned modules
- **Chosen:** The product is split into source modules (Salesforce/PMS), operational lifecycle modules (presign/contract/invoice), and governance/review modules (dashboard/mapping/permissions/audit/sync/master/users).
- **Evidence:** Sidebar navigation groups and route mapping.
- **Likely product benefit:** Keeps business flow discoverable and easier to extend by stage/module.
- **Uncertain:** Final module boundaries and whether additional lifecycle stages are needed.

## Decision: Treat the platform as both operational workspace and management review surface
- **Chosen:** Operational CRUD pages coexist with analytical/review pages (Dashboard + Mapping).
- **Evidence:** Dedicated `#/dashboard` and `#/mapping` routes plus module list/detail/forms.
- **Likely product benefit:** Supports both day-to-day data operations and supervisory reconciliation.
- **Uncertain:** Which audience is primary and which views should drive future prioritization.

## Decision: Emphasize traceability rather than simple data entry
- **Chosen:** Features explicitly connect upstream/downstream objects and expose anomaly/reconciliation status.
- **Evidence:** `preSignLinks`, mapping status icons, anomaly model, contract wizard from pre-sign.
- **Likely product benefit:** Aligns with lifecycle integrity and reduces manual cross-system reconciliation effort.
- **Uncertain:** Depth of required traceability rules in production (e.g., mandatory links, approval checks).

## Decision: Include governance surfaces early (permissions/audit/sync)
- **Chosen:** Governance and operations monitoring pages are present in the demo scope.
- **Evidence:** `#/permissions`, `#/audit`, `#/sync`, and related state entities.
- **Likely product benefit:** Signals enterprise-readiness intent and accountability expectations.
- **Uncertain:** Production-grade enforcement and compliance requirements are not finalized.

# 3. Data / Modeling Decisions

## Decision: Use explicit stage-specific entities instead of one merged lifecycle table
- **Chosen:** Separate arrays/objects for snapshots, projects, pre-sign, contracts, invoices, and supporting entities.
- **Evidence:** `state` structure and module `dataKey` mappings.
- **Likely rationale:** Clear separation of concerns and easier UI module implementation.
- **Risk/ambiguity:** Cross-entity consistency must be maintained manually without schema constraints.

## Decision: Implement lifecycle continuity through reference IDs and bridge objects
- **Chosen:** Linking is done through fields like `presign_contract_id`, `contract_id`, `pms_project_id`, `sf_snapshot_id` and `preSignLinks`.
- **Evidence:** Seed data link generation, mapping resolution functions, contract wizard derivation.
- **Likely rationale:** Makes relationship intent explicit and supports mapping/reconciliation views.
- **Risk/ambiguity:** No single anchor ID or formal referential integrity layer.

## Decision: Model allocation and schedule as child collections
- **Chosen:** Pre-sign and contract records have child tables for allocations, non-project charges, and payment nodes.
- **Evidence:** `preSignPmsAllocations`, `preSignSfAllocations`, `nonProjectCharges`, `preSignPaymentNodes`, `contractPaymentNodes`.
- **Likely rationale:** Captures complex financial decomposition needed for validation and stage calculations.
- **Risk/ambiguity:** Cardinality/business-rule completeness is enforced in UI logic, not schema.

## Decision: Use recurring status/time/value dimensions across entities
- **Chosen:** Status enums, date fields, amount fields, and ownership metadata are repeated across modules.
- **Evidence:** entity fields and enums (`presignStatus`, `seStatus`, `projectPhase`, dates/amounts).
- **Likely rationale:** Enables cross-module filtering, comparison, and dashboard aggregation.
- **Risk/ambiguity:** Normalization and naming consistency need stronger formalization.

# 4. UX / Interaction Decisions

## Decision: List-first workflow with detail/edit drilldown
- **Chosen:** Most modules use list pages as entry point, then detail/edit/new routes.
- **Evidence:** Route patterns `#/module/:module`, `/detail/:id`, `/edit/:id`, `/new`.
- **Why useful:** Familiar operator flow and scalable for many records.
- **Tradeoff/uncertainty:** Discoverability of deep lifecycle relationships depends on secondary views.

## Decision: Use table-heavy review UX with status icons and filters
- **Chosen:** Core pages rely on dense tables, filters, and status markers (√/!/X).
- **Evidence:** Mapping overview and module list rendering patterns.
- **Why useful:** Efficient for reconciliation-style tasks and exception triage.
- **Tradeoff/uncertainty:** May require UX refinement for non-expert users.

## Decision: Pair overview analytics with drilldown components
- **Chosen:** Dashboard and mapping include expandable/tabbed details and drawer drilldowns.
- **Evidence:** Mapping row expansion tabs; dashboard drawer tab switching.
- **Why useful:** Preserves high-level visibility while allowing focused investigation.
- **Tradeoff/uncertainty:** Navigation context persistence and breadcrumb clarity are minimal.

## Decision: Use modals/pickers for relationship selection
- **Chosen:** Link selection (PMS/Salesforce/pre-sign) is done via modal pickers.
- **Evidence:** `openLinkPicker`, `openPresignPicker`, modal filter/confirm flows.
- **Why useful:** Centralizes relationship selection without leaving the current form.
- **Tradeoff/uncertainty:** Scalability/performance for large datasets is unproven.

# 5. Technical / Prototyping Decisions

## Decision: Frontend-only, in-memory prototype
- **Chosen:** All data is stored in client-side `state` and seeded via `seedData()`.
- **Evidence:** No backend/API layer; arrays initialized and mutated in `app.js`.
- **Likely reason:** Fast iteration and demo portability.
- **Watchouts:** No persistence, concurrency control, or backend-grade validation.

## Decision: Hash-routed vanilla JavaScript SPA
- **Chosen:** Routing based on `location.hash` with custom dispatcher.
- **Evidence:** `route()` and `hashchange` listener.
- **Likely reason:** Zero-build simplicity and low setup overhead.
- **Watchouts:** Maintainability and modularity challenges as scope grows.

## Decision: Schema-light, behavior-in-code approach
- **Chosen:** Entity shape and rules are embedded in render/save functions and seed data.
- **Evidence:** absence of formal schema files; validations in form handlers.
- **Likely reason:** flexible prototyping and quick iteration.
- **Watchouts:** Higher risk of drift/inconsistency across modules.

## Decision: Simulate integrations and intelligent features
- **Chosen:** OCR and sync behaviors are simulated within UI logic.
- **Evidence:** OCR mock messages/results; `runSync` updates in local state/logs.
- **Likely reason:** represent workflow intent before real integrations exist.
- **Watchouts:** Users may over-assume production readiness if not clearly labeled.

# 6. Tradeoffs Visible in the Current Demo
- **Breadth vs depth:** broad lifecycle/module coverage is strong, but many workflows are shallowly enforced.
- **Business realism vs technical rigor:** UI and entities reflect business scenarios, but backend constraints/contracts are absent.
- **Traceability intent vs formal semantics:** linkage objects and status logic exist, yet canonical lifecycle semantics remain partly implicit.
- **Speed of iteration vs long-term maintainability:** single-file, schema-light approach accelerates prototyping but increases future refactor cost.
- **Operational usability vs governance completeness:** permissions/audit/sync pages exist, but enterprise-grade controls are not yet proven.

# 7. Open Decisions / Questions Still Not Settled
- What is the final lifecycle state machine for pre-sign, contract, anomaly, and approval transitions?
- Which linkage rules are mandatory (e.g., Salesforce mapping for each nominal type) in production?
- What are the authoritative systems-of-record and API contracts for snapshots, PMS, contracts, and invoices?
- How should referential integrity/cardinality be enforced once persistence is introduced?
- Which simulated behaviors (OCR/sync/preview actions) will become real integrations, and with what SLAs?
- How should role permissions move from frontend gating to enforceable backend authorization?
- What level of audit immutability/compliance is required?

# 8. How to Use This Document Going Forward
- Treat it as the baseline of **already-embedded decisions** before adding new architecture/features.
- Use it to distinguish stable structural choices from temporary prototype shortcuts.
- Require human confirmation for items listed as open before deep backend/workflow implementation.
- Update this document whenever a current “open question” becomes a formal decision.

# 9. Confidence Notes

## Confidently inferred from the repo
- Lifecycle/module structure, route patterns, and main UI interaction models are directly implemented.
- Data linkage strategy via explicit IDs and bridge/allocation tables is clearly present.
- Prototype strategy (frontend-only, seeded state, simulated integrations) is explicit.

## Still uncertain / requires human confirmation
- Final product scope boundary and primary persona prioritization.
- Canonical production workflow/approval semantics and rule strictness.
- Production data governance, security, and integration non-functional requirements.
- Long-term technical architecture target beyond current SPA prototype.
