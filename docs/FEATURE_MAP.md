# 1. Feature Map Summary
The current OTP Management Platform demo provides a **module-driven, lifecycle-oriented feature set** implemented as a hash-routed SPA. Feature coverage spans operational record management (Salesforce/PMS/pre-sign/contract/invoice), analytical/review views (Dashboard, Mapping & 计算结果查看), and administrative/governance surfaces (Master Data, Users & Groups, Permissions Matrix, Audit Logs, Sync Jobs/Logs).

The system is organized primarily by **functional modules aligned to lifecycle stages**, with cross-cutting review and governance pages layered on top.

# 2. Major Functional Modules

## A. Lifecycle Analytics & Review

### Dashboard (`#/dashboard`)
- **Business purpose:** high-level OTP performance/coverage review across stages and years.
- **Main pages/components:** matrix-style stage summary, top-customer cards, drilldown drawer.
- **Feature type:** analytical + review-oriented.

### Mapping & 计算结果查看 (`#/mapping`)
- **Business purpose:** cross-stage linkage/reconciliation at project level.
- **Main pages/components:** mapping status table, filter bar, status icons, anomaly display, expandable row details with tabs.
- **Feature type:** review-oriented + reconciliation support.

## B. OTP Operational Modules

### 代签合同/协议映射 (`#/module/presign`)
- **Business purpose:** manage pre-sign contract records and perform PMS/Salesforce mapping and amount allocation.
- **Main pages/components:** list/detail/edit/new pages, OCR simulation area, non-project charge section, payment-node editor, allocation tables, mapping summary/validation hints.
- **Feature type:** operational + validation-heavy.

### 合同管理 (`#/module/contract`, `#/contracts/wizard`)
- **Business purpose:** create and maintain formal contracts from pre-sign records.
- **Main pages/components:** contract list/detail/edit, contract creation wizard from signed-ready pre-sign, contract payment nodes.
- **Feature type:** operational + transition-oriented.

### 回款/发票跟踪 (`#/module/invoice`)
- **Business purpose:** track received payments/invoice receipts against contracts.
- **Main pages/components:** invoice list/detail/form with date/amount/currency/reference dimensions.
- **Feature type:** operational + tracking.

## C. Source / Upstream Data Modules

### Salesforce 快照 (`#/module/salesforce`)
- **Business purpose:** maintain upstream snapshot references used in downstream mapping.
- **Main pages/components:** table, filters, add/edit/detail patterns.
- **Feature type:** operational source-data management.

### PMS 项目清单 (`#/module/pms`)
- **Business purpose:** manage project-side records and milestone context.
- **Main pages/components:** project list/forms, milestone rows, phase/complexity dimensions, anomaly fields.
- **Feature type:** operational source-data + review support.

## D. Governance / Administration

### 主数据 (`#/module/master`)
- **Business purpose:** maintain shared reference dictionaries used by lifecycle entities.
- **Main pages/components:** embedded master tables for customers/product types/sales regions/configurations.
- **Feature type:** administrative.

### 用户与组 (`#/module/users`)
- **Business purpose:** manage demo users/groups and role assignment context.
- **Main pages/components:** users/groups tables and maintenance actions.
- **Feature type:** administrative.

### 权限矩阵 (`#/permissions`)
- **Business purpose:** visualize role-to-module action permissions.
- **Main pages/components:** matrix table by role/group and module/action scope.
- **Feature type:** administrative + control-oriented.

### 审计日志 (`#/audit`)
- **Business purpose:** show entity-level action history.
- **Main pages/components:** audit log table/list.
- **Feature type:** governance/review.

### 同步任务与日志 (`#/sync`)
- **Business purpose:** monitor and trigger simulated source synchronization.
- **Main pages/components:** sync job table, run actions, sync log feed.
- **Feature type:** operational administration.

# 3. Page-Level Feature Inventory

## Global shell (all pages)
- **Purpose:** app navigation and common entry actions.
- **Main elements:** sidebar module nav, global search input/button, quick-add button, current-user chip, modal and drawer containers.
- **Main actions:** route switching, quick create flow entry, user switch/search triggers.
- **Main objects:** UI state + current user context.

## Generic module list pages (`#/module/:module`)
- **Purpose:** browse module records.
- **Main elements:** filters, tabular list, list actions.
- **Main actions:** filter/search, open detail/edit/new, delete/restore (where available).
- **Main objects:** module-specific arrays (`snapshots`, `pmsProjects`, `preSignContracts`, `contracts`, `invoices`).

## Generic detail pages (`#/module/:module/detail/:id`)
- **Purpose:** view record details + related context.
- **Main elements:** key-value field grid, module-specific related tables, audit snippets.
- **Main actions:** return to list, edit (permission-dependent).
- **Main objects:** selected record + related linked data.

## Generic form pages (`#/module/:module/new|edit/:id`)
- **Purpose:** create/update records.
- **Main elements:** form fields from module definitions, save/cancel controls.
- **Main actions:** save normalized payload into in-memory state.
- **Main objects:** module-specific record schema.

## Pre-sign detail/edit/new (specialized)
- **Purpose:** lifecycle mapping/allocation control before contract finalization.
- **Main elements:** file preview + OCR controls, contract basics, non-project charges, payment nodes, PMS/Salesforce allocation sections, amount-view toggle, validation summaries.
- **Main actions:** add/remove/edit charge/payment/allocation rows; picker-based mapping; equal-split shortcuts; save with validation checks.
- **Main objects:** `preSignContracts`, `preSignLinks`, `preSignPmsAllocations`, `preSignSfAllocations`, `nonProjectCharges`, `preSignPaymentNodes`.

## Contract wizard (`#/contracts/wizard`)
- **Purpose:** create contract from signed-ready pre-sign.
- **Main elements:** pre-sign selector, signed-file input, creation hint area.
- **Main actions:** enforce selection, generate contract record, copy key fields, derive status/year hints.
- **Main objects:** `preSignContracts`, `preSignLinks`, `contracts`.

## Mapping overview (`#/mapping`)
- **Purpose:** project-level reconciliation and exception view.
- **Main elements:** search/filter controls, status columns (Salesforce/Contract/Invoice), remaining percentage, anomaly indicator, expandable details tabs.
- **Main actions:** filter rows, expand details, inspect stage-specific evidence, edit anomaly fields via modal.
- **Main objects:** `pmsProjects`, `snapshots`, `preSignLinks`, `contracts`, `invoices`, `contractPaymentNodes`.

## Dashboard (`#/dashboard`)
- **Purpose:** management-level stage and year visibility.
- **Main elements:** view/grouping controls, matrix tables, top customer cards, drilldown drawer tabs.
- **Main actions:** switch view dimensions, open drilldowns, inspect stage-year record slices.
- **Main objects:** snapshot/contract/invoice aggregates and filters.

## Master / Users / Permissions / Audit / Sync pages
- **Purpose:** governance and system administration scaffolding.
- **Main elements:** editable tables (master/users/groups), permission matrix, audit list, sync jobs/logs panels.
- **Main actions:** maintain reference/admin records, inspect controls/logs, trigger sync simulation.
- **Main objects:** `master`, `users`, `groups`, `permissions`, `auditLogs`, `syncJobs`, `syncLogs`.

# 4. Cross-Cutting Features
- **Hash-based navigation and module routing** across all major surfaces.
- **Role-aware action gating** (view/add/change/delete/export/run_sync/approve_transition).
- **Reusable table/list pattern** with module-specific filters and list columns.
- **Detail + edit dual pattern** with permission-conditioned edit entry.
- **Status visualization** using labels/icons and anomaly markers (notably in mapping).
- **Drilldown patterns** via drawer/modal/tab combinations.
- **Linkage display and reconciliation hints** (PMS/Salesforce links, allocation summaries, invoice remain logic).
- **Audit/sync observability surfaces** for operational transparency.

# 5. Feature-to-Business Mapping
- **Source modules (Salesforce/PMS) -> Data readiness for downstream lifecycle steps.**
- **Pre-sign mapping/allocation features -> Traceable conversion from commercial intent to project/contract allocation basis.**
- **Contract wizard + contract pages -> Controlled transition from pre-sign agreement to managed contract record.**
- **Invoice tracking -> Visibility into downstream financial realization.**
- **Mapping overview -> Faster cross-stage reconciliation and anomaly review at project level.**
- **Dashboard -> Management-level visibility by stage/year/customer dimensions.**
- **Permissions/audit/sync/admin pages -> Basic operational governance and maintainability scaffolding.**

# 6. Features That Look Partially Implemented
- OCR, file preview toolbar, and several actions are demo/placeholder-like (simulated extraction and toasts).
- Sync operations are simulated in frontend state (no real connectors or background job infrastructure).
- Permission behavior is UI-level logic; full security enforcement model is not shown.
- Some transition behaviors are implicit (status fields present, but full workflow engine is absent).
- Allocation and validation are substantial, but still rely on in-memory state and client-side checks only.
- Generic CRUD patterns exist, but persistence, concurrency, and error handling are not production-grade.

# 7. Features Missing from the Current Demo
Likely missing or unclear (not confirmed requirements):
- Backend APIs, persistent storage, and integration error/retry architecture.
- Formal workflow state machine with approvals/escalations/SLA timers.
- Configurable rule engine for allocation/reconciliation policies.
- Strong identity/authentication model beyond local demo user switching.
- Full audit immutability/compliance guarantees and retention policies.
- Automated test coverage and CI/CD quality gates.
- Import/export/reporting depth beyond current list/filter/drilldown views.

# 8. Practical Use of This Feature Map
Use this document as a **scope baseline**:
- Track what already exists before adding new features.
- Support backlog grooming and gap analysis by module/page.
- Align engineering implementation with visible product intent.
- Prevent over-promising by separating implemented UI capability from production-grade behavior.

# 9. Confidence Notes

## Confidently extracted from the repo
- Module and route coverage is explicit in navigation and route handlers.
- Major feature surfaces (list/detail/form, mapping review, dashboard drilldowns, pre-sign allocation, contract wizard, governance pages) are directly implemented.
- Cross-cutting patterns (filters, status icons, modal/drawer interactions, audit/sync visibility) are clearly represented.

## Still uncertain / requires human confirmation
- Which current demo features are intended for production parity vs prototype illustration.
- Final workflow/approval semantics behind status fields and anomaly handling.
- Required depth for enterprise security, audit compliance, and integration reliability.
- Priority and sequencing of missing features for roadmap planning.
