# 1. Guide Purpose
This guide is the project-specific onboarding and working reference for the current OTP Management Platform demo. It explains how to safely extend a **frontend-only, hash-routed, in-memory SPA** whose behavior is concentrated in `app.js`.

Because core lifecycle logic (mapping, allocation, contract derivation, anomaly review) is already encoded in current patterns, contributors should extend existing conventions instead of treating this as a blank new app.

# 2. How to Read This Project First
Recommended reading order before any implementation work:
1. **`README.md`** — baseline scope, run mode, and maturity context.
2. **`docs/PROJECT_OVERVIEW.md`** — what the platform is trying to represent.
3. **`docs/BUSINESS_FLOW.md` + `docs/PAGES_AND_USER_FLOWS.md`** — lifecycle flow and user navigation.
4. **`docs/DATA_MODEL.md` + `docs/API_SPEC.md`** — entities, linkage assumptions, inferred interfaces.
5. **`docs/FEATURE_MAP.md` + `docs/KNOWN_GAPS.md`** — current feature coverage and maturity boundaries.
6. **`docs/ARCHITECTURE.md` + `docs/DECISIONS.md` + `docs/ROADMAP.md`** — technical shape, existing choices, and direction.
7. **Code walkthrough in `app.js`** in this order:
   - `state`, `enums`, `modules`
   - `seedData()`
   - generic render flow (`renderList`, `renderDetail`, `renderForm`)
   - specialized flows (`presign`, `contract`, `mapping`, `dashboard`)
   - route + global actions (`route()`, `initGlobalActions()`).
8. **`index.html` + `style.css`** — shell mounts and reusable style vocabulary.

# 3. Key Project Areas to Understand

## A. Route and navigation model
- **Why it matters:** all page behavior depends on hash routes and route params.
- **Inspect first:** `state.navSections`, `route()`, and module route branches.

## B. Lifecycle flow representation
- **Why it matters:** business value is in continuity across Salesforce/PMS -> pre-sign -> contract -> invoice -> mapping/dashboard.
- **Inspect first:** pre-sign form/detail, contract wizard, mapping overview, dashboard drilldown.

## C. Entity/linkage model in `state`
- **Why it matters:** linkage keys and child collections drive core calculations and validations.
- **Inspect first:** `preSignLinks`, allocations, payment nodes, `contracts`, `invoices`, and seed relationships.

## D. Shared interaction patterns
- **Why it matters:** consistency relies on reusing list/detail/form, modal pickers, drawer tabs, and status badges.
- **Inspect first:** generic renderers + `openLinkPicker`/`openPresignPicker` + drilldown drawer logic.

## E. Prototype boundary (mock vs real)
- **Why it matters:** no backend/service layer exists; several operations are simulation-level.
- **Inspect first:** save handlers, `runSync`, OCR simulation, and `docs/API_SPEC.md`.

# 4. Safe Change Principles
- Keep route conventions consistent (`#/module/:module`, `new`, `detail/:id`, `edit/:id`).
- Reuse `modules` metadata and existing list/detail/form patterns instead of inventing parallel page structures.
- Preserve entity/link naming consistency; avoid creating alternate keys for the same relationship.
- Prefer shared helper/rule functions over copying business logic into multiple handlers.
- Do not introduce isolated mock data paths that bypass canonical `state` relationships.
- Mark simulated behavior explicitly if still non-production.
- Update impacted docs in the same PR as code changes.

# 5. How to Add or Extend Features
Practical sequence for this repo:
1. Identify target lifecycle entity/flow in `BUSINESS_FLOW.md` and `DATA_MODEL.md`.
2. Find closest existing pattern in `app.js` (module/list/detail/form/wizard/review).
3. Extend `state` + `modules` metadata first (fields/filters/list columns).
4. Implement UI and save behavior by reusing existing patterns.
5. Validate cross-stage effects (mapping status, dashboard summaries, linked records).
6. If behavior is simulated, keep boundary explicit and documented.
7. Update relevant docs (`FEATURE_MAP`, `PAGES_AND_USER_FLOWS`, `DATA_MODEL`, `API_SPEC`, `CHANGELOG`).

# 6. Common Change Types and Where to Touch

## Add a new module/page
- **Touch:** `state.navSections`, `modules`, route branch, renderer(s), optional styles/docs.
- **Likely files:** `app.js`, `style.css`, `README.md`, docs.

## Extend list/detail for existing module
- **Touch:** module `listColumns`, `filters`, detail renderer, related table sections.
- **Likely files:** `app.js`, `docs/DATA_MODEL.md`, `docs/FEATURE_MAP.md`.

## Add/rename an entity field
- **Touch:** `state` seed shape, form inputs/save normalization, list/detail display, derived logic.
- **Likely files:** `app.js`, `docs/DATA_MODEL.md`, `docs/API_SPEC.md`.

## Change navigation or route behavior
- **Touch:** `state.navSections`, `route()`, action buttons using `location.hash`.
- **Likely files:** `app.js`, `docs/PAGES_AND_USER_FLOWS.md`.

## Refine mock scenarios or calculations
- **Touch:** `seedData()` adjustments and helper computations.
- **Likely files:** `app.js`, `docs/BUSINESS_FLOW.md`, `docs/KNOWN_GAPS.md` if semantics change.

## Deepen operational actions (OCR/sync/wizard/anomaly)
- **Touch:** module-specific handlers + shared helper functions + audit updates.
- **Likely files:** `app.js`, `docs/API_SPEC.md`, `docs/DECISIONS.md`.

# 7. Things Most Likely to Break Consistency
- **Route drift:** adding ad-hoc paths that bypass current module/action conventions.
- **Naming drift:** introducing alternate linkage keys (already sensitive around pre-sign IDs).
- **Rule duplication:** replicating validation/status logic in many handlers.
- **Doc drift:** changing behavior/data without updating corresponding docs.
- **Flow drift:** adding standalone screens not connected to lifecycle navigation.
- **Mock-contract drift:** treating simulated behaviors as if they were finalized production semantics.

# 8. Minimum Documentation Update Rules
When code changes, update docs in same PR:
- **Page/flow changes** -> `docs/PAGES_AND_USER_FLOWS.md`, `docs/FEATURE_MAP.md`
- **Entity/linkage changes** -> `docs/DATA_MODEL.md`, `docs/API_SPEC.md`
- **Architecture/refactor changes** -> `docs/ARCHITECTURE.md`
- **Business rule/semantic changes** -> `docs/BUSINESS_FLOW.md`, `docs/DECISIONS.md`
- **Priority/direction changes** -> `docs/ROADMAP.md`, `docs/KNOWN_GAPS.md`
- **Any delivered change** -> append `docs/CHANGELOG.md`

# 9. Recommended Development Discipline for Future Codex Sessions
- Inspect existing patterns first; extend before reinventing.
- Keep edits traceable: include code + doc updates together.
- Prefer small, coherent changes over broad speculative rewrites.
- Treat current in-memory behavior as prototype baseline, not production truth.
- Escalate ambiguous lifecycle semantics for human confirmation before hard-coding.
- Avoid introducing toolchain assumptions (project currently has no package scripts/build/test pipeline).

# 10. Confidence Notes

## Confidently based on current repo structure
- The app is centered on `app.js` with centralized state, hash routing, and mixed render/business logic.
- Existing docs in `/docs` provide broad project context and should remain synchronized.
- Consistency depends on preserving established route, entity, and interaction patterns.

## Still uncertain / requires human confirmation
- Final production-grade lifecycle/approval semantics and mandatory linkage rules.
- Which simulated actions (OCR/sync/import-like behavior) are temporary vs long-term.
- Final backend/API boundary and enforcement model for permissions/audit.
