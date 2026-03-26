# 1. Architecture Summary
The current OTP Management Platform is a **frontend-only, mock-data-driven single-page application** implemented with plain HTML/CSS/JavaScript. The system is organized around a single application script (`app.js`) that contains state, seed data, routing, page rendering, business calculations, and UI interaction handlers.

At a high level, architecture is:
- static shell (`index.html`) + global styles (`style.css`),
- centralized in-memory state + enum/module configuration in `app.js`,
- hash-based route dispatcher rendering module/list/detail/form/dashboard/review pages,
- simulated operational behaviors (OCR/sync/import-like flows) without backend APIs.

# 2. Technology Stack

## HTML5 (`index.html`)
- **Role:** application shell and mounting points (`#nav`, `#content`, `#modal`, `#drawer`).

## CSS (`style.css`)
- **Role:** global styling system using CSS variables and class-based styles for layout, tables, forms, panels, badges, modals, drawer, status indicators.

## Vanilla JavaScript (`app.js`)
- **Role:** all application logic (state/model, routing, rendering, interactions, calculations, validations).

## Hash routing (`location.hash`)
- **Role:** client-side navigation without external routing library.

## In-memory mock data (`seedData()`)
- **Role:** runtime data source replacing backend/API persistence in current demo.

## Static file serving (no build step)
- **Role:** run as static site (e.g., Python HTTP server); no package manager scripts/toolchain in repo.

# 3. Repository Structure

```text
.
├── app.js                     # Core application logic (state, modules, routing, renderers, business rules)
├── index.html                 # App shell/layout and global UI mount points
├── style.css                  # Global style definitions and reusable class patterns
├── assets/
│   └── mock-pdf-page.svg      # Placeholder preview asset for file snapshot UI
├── docs/
│   ├── PROJECT_OVERVIEW.md
│   ├── BUSINESS_FLOW.md
│   ├── DATA_MODEL.md
│   ├── FEATURE_MAP.md
│   ├── PAGES_AND_USER_FLOWS.md
│   ├── DECISIONS.md
│   ├── ROADMAP.md
│   └── ARCHITECTURE.md        # This document
└── README.md                  # Project entry and run notes
```

Responsibility highlights:
- **`app.js`** acts as the de facto app entry, router, model layer, and controller layer.
- **`index.html`** defines the reusable shell used by every route-driven view.
- **`style.css`** is global and cross-module; no scoped or component CSS separation.
- **`docs/`** now contains project-level architecture/product references for continuation work.

# 4. Application Layering
Visible layering is logical (within one JS file), not physically separated by folders/modules.

## Layer A: Configuration and model definitions
- **Contains:** `state`, `enums`, `modules` definitions.
- **Role:** defines available entities, options, list/form/filter schemas, and module metadata.
- **Relation:** referenced by rendering and behavior layers.

## Layer B: Mock data initialization
- **Contains:** `seedData()` and seeded scenario adjustments.
- **Role:** populates lifecycle entities and relationships for demo runs.
- **Relation:** hydrates `state` consumed by all views/calculations.

## Layer C: Routing and page dispatch
- **Contains:** `route()` and global navigation action wiring.
- **Role:** maps hash routes to render functions (dashboard/mapping/module list/detail/form/special pages).
- **Relation:** orchestrates which rendering branch is active.

## Layer D: View rendering functions
- **Contains:** renderers for lists, details, forms, specialized modules, dashboard, mapping, admin pages.
- **Role:** generate HTML strings and bind interaction handlers.
- **Relation:** consumes state and invokes helper utilities/business logic.

## Layer E: Domain logic and utilities
- **Contains:** permission checks, calculations (`computePresignTotals`, mapping status, invoice remain), pickers/modals, audit updates, helper getters.
- **Role:** shared behavior and transformation logic across pages.
- **Relation:** called by renderers and action handlers.

## Layer F: UI-only operational simulations
- **Contains:** OCR simulation, sync simulation, preview toolbar toasts.
- **Role:** represent intended operations without external systems.
- **Relation:** modifies local `state` and UI feedback only.

# 5. Routing and Page Composition
- Routing is implemented with `location.hash` parsing inside `route()`.
- Route style is mostly flat + parameterized module paths:
  - `#/dashboard`, `#/mapping`, `#/permissions`, `#/audit`, `#/sync`, `#/contracts/wizard`
  - `#/module/:module`
  - `#/module/:module/new`
  - `#/module/:module/detail/:id`
  - `#/module/:module/edit/:id`
- There is a persistent shell layout (sidebar + topbar + content section) in `index.html`; route views render into `#content`.
- Navigation links in `state.navSections` drive sidebar structure and active-link highlighting.
- Route params (`module`, `action`, `id`) are used for entity detail/edit composition.

# 6. Data Flow and State Handling
- Data originates from `seedData()` at startup; there are no network fetches to backend APIs.
- `state` is centralized and mutable; most actions update arrays directly.
- Render functions read from `state`, compute derived values, and re-render relevant sections/pages.
- Form submissions are handled in JS event listeners; payloads are normalized and applied directly to in-memory collections.
- Cross-entity computations (allocation totals, mapping status, invoice remain) are computed locally from current state snapshots.
- Many actions are real within the demo context (create/edit/validate/link), but external operations (OCR/sync/integration) are simulated.

# 7. Reuse and Shared Patterns
- **Shared app shell:** consistent sidebar/topbar/content layout across all routes.
- **Reusable module framework:** `modules` metadata drives generic list/detail/form behavior for several entities.
- **Shared helper functions:** lookup/access helpers (`getCustomer`, `getProduct`, etc.), permission checks, normalization utilities.
- **Reusable table/form patterns:** filters + table rendering + action buttons across modules.
- **Reusable modal/drawer pattern:** generic modal container for pickers and a shared drawer for dashboard drilldowns.
- **Shared status visualization vocabulary:** badges/status icons and anomaly markers reused in mapping/review surfaces.

# 8. Current Strengths of the Architecture
- End-to-end lifecycle breadth is already represented in one runnable static application.
- Centralized state and module metadata make behavior transparent and easy to inspect.
- Hash routing and single-file deployment keep setup friction very low.
- Cross-stage linkage and reconciliation logic are explicit in code and easy to trace.
- Documentation coverage in `docs/` is now broad, supporting onboarding and planning.

# 9. Architectural Risks / Weak Points
- **Separation-of-concerns risk:** one large `app.js` mixes model, routing, rendering, and business logic.
- **Schema centralization risk:** no formal typed schema/contract; data semantics live in ad hoc code paths.
- **Mutation coupling risk:** direct in-place state mutation can increase regression risk as scope grows.
- **Validation duplication risk:** business checks appear in multiple handlers without a strict shared rule engine.
- **Scalability risk:** current rendering/event pattern is fine for demo scale but may degrade with larger data/feature sets.
- **Integration illusion risk:** simulated OCR/sync can mask production complexity if not clearly bounded.
- **No automated quality gate:** absent test/build pipeline increases fragility during expansion.

# 10. Practical Guidance for Future Development
- Preserve existing module/route conventions while refactoring into clearer domain files.
- Extract formal data contracts (entity schemas, relationship rules) before deep backend integration.
- Consolidate repeated business calculations/validations into shared domain services.
- Treat simulated operations as explicit stubs and replace incrementally behind stable interfaces.
- Add minimal automated checks early (route smoke checks + core calculation tests) before broad feature expansion.

# 11. Confidence Notes

## Confidently extracted from the repo
- The project is a frontend-only, hash-routed, in-memory SPA with no backend/API implementation.
- `app.js` is the architectural center for state, routing, rendering, and domain logic.
- Shared UI patterns (module lists/forms, modal pickers, drawer drilldowns, status visuals) are clearly implemented.

## Still uncertain / requires human confirmation
- Intended long-term code/module decomposition strategy beyond current single-file approach.
- Final production architecture target (API boundaries, persistence model, service split).
- Required non-functional architecture constraints (security, compliance, scalability, observability).
- Which current simulated behaviors are temporary vs strategically permanent abstractions.
