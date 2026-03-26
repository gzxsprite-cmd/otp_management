# CHANGELOG

## 1. Changelog Policy
- This changelog starts from the **current observable repository baseline**.
- Earlier release-by-release history is not reliably reconstructable from repository contents alone.
- Future entries should be appended using consistent version headings and categories.
- Entries should clearly distinguish documentation, feature, flow, data-model, and technical changes.

## 2. Versioning Approach
- Use **`v0.x`** while the project remains a prototype/demo with evolving semantics.
- Promote to **`v1.0.0`** only after core lifecycle rules, data contracts, and key flows are stabilized.
- Use incremental patch/minor updates for iterative Codex-driven improvements:
  - `v0.x.0` for broader scope updates,
  - `v0.x.y` for smaller refinements/fixes/docs.

## 3. Current Baseline Release

## [v0.1.0] - Current Baseline

### Added
- Frontend-only OTP Management Platform SPA with hash routing and static shell (`index.html`, `style.css`, `app.js`).
- In-memory state and seeded demo dataset (`seedData()`) covering Salesforce/PMS, pre-sign, contract, invoice, governance entities.
- Main routes/pages: `#/dashboard`, `#/mapping`, `#/module/{salesforce|pms|presign|contract|invoice|master|users}`, `#/permissions`, `#/audit`, `#/sync`, `#/contracts/wizard`.
- Pre-sign mapping/allocation capabilities including link pickers, non-project charges, payment nodes, and validation hints.
- Contract wizard transition from signed-ready pre-sign records.
- Mapping overview with status/anomaly logic and dashboard drilldown views.
- Governance/admin surfaces: permissions matrix, audit logs, sync jobs/logs, master data, users/groups.
- Documentation baseline under `docs/` (architecture, flow, data model, feature map, user flows, decisions, roadmap, API spec, known gaps).
- Placeholder asset for file preview (`assets/mock-pdf-page.svg`).

### Present in current baseline
- Module-driven list/detail/form interaction patterns with in-memory create/edit/delete/restore behavior.
- Role-gated UI actions via frontend permission logic.
- Simulated OCR/sync/import-like operations and local audit updates.
- No backend API/service calls; no persistence beyond runtime state.
- No package-managed build pipeline or automated test suite in repository.

### Known limitations of this baseline
- Workflow semantics are partly implicit and not formalized as a strict state machine.
- Data contracts and linkage rules are embedded in frontend code rather than centralized schemas.
- Several operational features are simulation-level, not real integrations.
- Single-file app logic (`app.js`) concentrates many responsibilities.

## 4. Recommended Entry Categories
- **Added**: new features, pages, entities, or capabilities introduced.
- **Changed**: behavior updates that alter existing logic or outputs.
- **Refined**: UX/flow/structure improvements without major semantic shifts.
- **Fixed**: bug corrections and correctness improvements.
- **Removed**: deleted features, paths, or deprecated structures.
- **Documented**: docs/spec/guidance updates with no runtime behavior change.

## 5. Future Entry Template

```markdown
## [v0.x.x] - YYYY-MM-DD

### Added
- ...

### Changed
- ...

### Refined
- ...

### Fixed
- ...

### Removed
- ...

### Documented
- ...

### Known limitations
- ...
```

## 6. Confidence Notes

### Confidently based on current repo state
- The baseline includes a runnable static SPA with broad OTP lifecycle module coverage and extensive project documentation.
- Core flows and governance pages are present at demo depth, powered by in-memory seeded state.

### Not recoverable from repo alone
- Precise historical release chronology before this baseline.
- Reliable historical release dates and semantic version transitions.
- Exact prior change grouping by release category.
