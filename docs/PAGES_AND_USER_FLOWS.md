# 1. Page Structure Summary
The current demo is organized as a **module-driven, hash-routed SPA** with a persistent app shell (sidebar + topbar) and route-switched content area. Navigation is primarily module/page based, but the content itself reflects lifecycle entities (Salesforce/PMS -> pre-sign -> contract -> invoice) plus analytical and governance views.

Top-level views include:
- lifecycle analytics/review pages (`#/dashboard`, `#/mapping`),
- operational module pages (`#/module/*`),
- governance/admin pages (`#/permissions`, `#/audit`, `#/sync`),
- and a special transition workflow (`#/contracts/wizard`).

# 2. Top-Level Navigation / Main Pages

## Dashboard
- **Route:** `#/dashboard`
- **Purpose:** stage/year management overview of OTP pipeline and receipts.
- **Main info:** matrix summaries, top customers, sync recency, drilldown content.
- **Page type:** dashboard + analysis.

## Mapping & 计算结果查看
- **Route:** `#/mapping`
- **Purpose:** project-level lifecycle reconciliation and anomaly review.
- **Main info:** project rows, status icons (Salesforce/Contract/Invoice), anomaly text, remaining percentages.
- **Page type:** review/reconciliation workspace.

## 代签合同/协议映射
- **Route:** `#/module/presign`
- **Purpose:** manage pre-sign records and mapping/allocation logic.
- **Main info:** pre-sign contracts, links, allocations, non-project charges, payment nodes, OCR/file context.
- **Page type:** operational list + detail workspace.

## 合同管理
- **Routes:** `#/module/contract`, `#/contracts/wizard`
- **Purpose:** maintain contracts and derive new contracts from signed-ready pre-sign records.
- **Main info:** contract records, payment nodes, contract wizard selections.
- **Page type:** operational list/detail + transition workflow.

## 回款/发票跟踪
- **Route:** `#/module/invoice`
- **Purpose:** track received payments/invoices by contract/time/value.
- **Main info:** invoice/receipt records with amount/date/currency dimensions.
- **Page type:** operational tracking list/detail.

## Salesforce 快照
- **Route:** `#/module/salesforce`
- **Purpose:** maintain source snapshot records used in downstream linkage.
- **Main info:** PID/configuration/customer/se-status/amount texts.
- **Page type:** source-data list/detail/form.

## PMS 项目清单
- **Route:** `#/module/pms`
- **Purpose:** manage project baseline and milestones.
- **Main info:** project identity, phase/complexity, MCRL fields, milestones.
- **Page type:** source-data list/detail/form.

## 主数据
- **Route:** `#/module/master`
- **Purpose:** maintain shared lookup tables.
- **Main info:** customers, product types, sales regions, configurations.
- **Page type:** admin/config maintenance.

## 用户与组
- **Route:** `#/module/users`
- **Purpose:** manage demo users and groups.
- **Main info:** user/group records and assignments.
- **Page type:** admin/config maintenance.

## 权限矩阵
- **Route:** `#/permissions`
- **Purpose:** visualize permission scope by role and module/action.
- **Main info:** matrix of actions per group/module.
- **Page type:** admin/control review.

## 审计日志
- **Route:** `#/audit`
- **Purpose:** inspect entity action history.
- **Main info:** actor/action/entity/timestamp log entries.
- **Page type:** governance review.

## 同步任务与日志
- **Route:** `#/sync`
- **Purpose:** monitor and run simulated sync jobs.
- **Main info:** sync jobs and log feed.
- **Page type:** operational admin view.

# 3. Key Secondary Views and Substructures

## Route-level subviews for modules
- Generic module routes support:
  - list: `#/module/:module`
  - create: `#/module/:module/new`
  - detail: `#/module/:module/detail/:id`
  - edit: `#/module/:module/edit/:id`

## Specialized detail/form structures
- **Pre-sign detail/form** uses embedded panels for:
  - file snapshot + OCR,
  - basic terms,
  - non-project charges,
  - payment nodes,
  - PMS/Salesforce allocation sections,
  - validation/mapping summary bars.
- **Contract form** includes pre-sign selection and payment node management.
- **PMS form** includes milestone row editor.

## Modal/drawer/tabs patterns
- **Modal pickers**: select linked pre-sign/PMS/Salesforce entities.
- **Mapping details tabs**: switch detail content by stage (Salesforce/Contract/Invoice) within expanded rows.
- **Dashboard drilldown drawer**: tabbed drilldown tables for stage inspection.
- **Global modal and drawer containers** are mounted in app shell and reused by flows.

# 4. Main User Flows

## Flow 1: Module browsing and record inspection
- **Start:** any module list page (`#/module/*`).
- **Steps:** apply filters -> open detail -> review related panels -> optionally jump to edit.
- **Goal:** inspect and manage records quickly.
- **Objects:** module-specific record arrays + related links.

## Flow 2: Pre-sign mapping and allocation preparation
- **Start:** `#/module/presign/new` or `#/module/presign/edit/:id`.
- **Steps:** enter pre-sign basics -> run/clear OCR simulation -> maintain non-project charges -> define payment nodes -> map PMS/Salesforce -> set allocations -> save with validations.
- **Goal:** prepare traceable, internally consistent pre-sign records for downstream contract conversion.
- **Objects:** `preSignContracts`, `preSignLinks`, allocation tables, payment nodes.

## Flow 3: Pre-sign to contract transition
- **Start:** `#/contracts/wizard`.
- **Steps:** choose a `signed_ready` pre-sign -> provide signed file -> create contract -> return to contract module.
- **Goal:** convert pre-sign records into formal contracts with upstream linkage retained.
- **Objects:** `preSignContracts`, `preSignLinks`, `contracts`.

## Flow 4: Contract and invoice lifecycle tracking
- **Start:** `#/module/contract` then `#/module/invoice`.
- **Steps:** review contract details/payment nodes -> add receipt records in invoice module -> revisit mapping/dashboard for impact.
- **Goal:** track downstream financial realization against contractual structure.
- **Objects:** `contracts`, `contractPaymentNodes`, `invoices`.

## Flow 5: Mapping reconciliation and anomaly review
- **Start:** `#/mapping`.
- **Steps:** filter/search projects -> inspect status icons/remain percentages -> expand row -> switch stage tabs -> optionally adjust anomaly metadata.
- **Goal:** detect and review lifecycle mismatches or exceptions.
- **Objects:** `pmsProjects`, `snapshots`, `preSignLinks`, `contracts`, `invoices`.

## Flow 6: Dashboard to drilldown analysis
- **Start:** `#/dashboard`.
- **Steps:** switch dashboard view/grouping -> inspect matrix/cards -> open drilldown drawer -> switch drawer tabs.
- **Goal:** move from high-level KPIs to record-level context.
- **Objects:** aggregated snapshot/contract/invoice subsets.

## Flow 7: Governance and operations maintenance
- **Start:** `#/module/master`, `#/module/users`, `#/permissions`, `#/audit`, `#/sync`.
- **Steps:** maintain reference/admin records -> inspect permission matrix/audit logs -> run sync simulation and monitor logs.
- **Goal:** support administrative consistency and operational transparency.
- **Objects:** master dictionaries, users/groups/permissions, audit/sync records.

# 5. Drill-Down and Navigation Logic
- Navigation uses **hash routes** and route parsing (`location.hash`).
- Main drill-down patterns:
  - table action buttons (`view`, `edit`, `delete`) from list pages,
  - detail-to-edit transition buttons,
  - expandable mapping rows with tabbed detail sections,
  - dashboard cards/matrix interactions opening drawer drilldowns,
  - picker modals for linking records.
- Route params (`module`, `action`, `id`) govern list/detail/form rendering.
- There is no classic breadcrumb component; “返回列表” and route-targeted buttons provide back-navigation.
- Global quick action (`+ 快速新建`) routes directly to pre-sign creation.

# 6. Action Patterns Visible in the UI
- Filter and search in list/review pages.
- View detail and related records.
- Create/edit/delete/restore (module and permission dependent).
- Link records through modal pickers.
- Enter and validate financial splits (allocation ratios/amounts, payment nodes, non-project deductions).
- Switch views/tabs/toggles (amount view, mapping tabs, dashboard grouping).
- Trigger simulated operational actions (OCR extraction simulation, sync run).
- Review status/anomaly indicators and supporting details.

# 7. UX Gaps / Flow Ambiguities
- Some controls are intentionally demo-like (e.g., preview toolbar “not implemented”, OCR simulation messaging).
- Workflow transitions are present but not fully orchestrated (status fields exist without a formal multi-step approval UX).
- Global search appears in shell, but deeper search semantics across all modules are not fully explicit.
- Permission handling is UI logic; security behavior outside frontend interactions is undefined.
- Navigation conveys lifecycle continuity, but a dedicated end-to-end guided journey page is not present.
- Error/retry feedback for operations (especially sync/integration-like actions) is simplified.

# 8. Practical Guidance for Future Development
Use this document as a navigation/flow baseline:
- preserve route and interaction consistency when adding pages,
- prioritize completing partially wired high-value flows (pre-sign -> contract -> invoice -> mapping feedback),
- use identified gaps to define UX hardening backlog items,
- keep lifecycle drilldown behavior coherent across dashboard and mapping views.

# 9. Confidence Notes

## Confidently extracted from the repo
- Main routes/modules and their top-level purposes are explicit in navigation and route handlers.
- Page patterns (list/detail/form, modal pickers, drawer drilldowns, mapping tabs) are concretely implemented.
- Core user journeys around pre-sign mapping, contract creation, invoice tracking, and reconciliation are visibly represented.

## Still uncertain / requires human confirmation
- Final production UX for approval gates, exception resolution workflow, and escalation paths.
- Intended depth of global search and cross-module contextual navigation.
- Which simulated controls are placeholders vs planned production features.
- Priority order for flow hardening between operational modules and governance/admin areas.
