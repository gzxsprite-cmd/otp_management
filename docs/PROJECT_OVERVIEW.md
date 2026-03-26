# 1. Project Summary
OTP Management Platform is a front-end, hash-routed single-page demo that models the lifecycle of OTP-related business records from source snapshots and project mapping to pre-sign contracts, formal contracts, and invoice/payment tracking. In its current implementation, it represents a lifecycle management and traceability system prototype intended to make cross-stage amount consistency, linkage status, and operational visibility easier to review.

# 2. Business Background
Based on the implemented navigation, modules, and entity relationships, the likely business context is a process where commercial and delivery data exist across multiple sources (e.g., Salesforce snapshots, PMS projects, contract records, and invoice receipts).

The demo structure implies common coordination pain points:
- Lifecycle records are split across stages and systems, making end-to-end status hard to see in one place.
- Upstream/downstream linkage (snapshot ↔ project ↔ contract ↔ invoice) requires reconciliation.
- Amount consistency (total amount, non-project deductions, allocation splits, payment nodes, received payments) needs reviewable checks.
- Cross-role visibility and accountability are needed, reflected by permission matrix, audit logs, and sync-log pages.

# 3. Core Objective
The current platform appears to aim to:
- Create one operational workspace for OTP lifecycle data across source, mapping, contract, and payment stages.
- Improve traceability between key business objects through explicit links and mapping views.
- Provide management-ready visibility through dashboard summaries and stage-level drilldowns.
- Support review of amount allocation consistency (PMS/Salesforce allocations, payment nodes, and invoice progress).
- Strengthen process transparency with permissions, audit trails, and sync monitoring surfaces.

# 4. Target Users
Likely target users inferred from groups, permissions, and module design:
- **Admin**: maintains users/groups/permissions and oversees broad platform configuration and governance views.
- **Contract/Commercial role (CM)**: manages pre-sign mapping, contract records, and payment node structures.
- **PMO/PJM / project operations**: associates PMS project data and tracks project-related mapping/allocation completeness.
- **Data operators**: maintain source snapshots, run/monitor sync jobs, and keep operational data up to date.
- **Business viewers/reviewers (e.g., CA_Viewer)**: consume dashboard, mapping, audit, and lifecycle status views for tracking and review.

# 5. Scope Implied by the Current Demo
Currently implemented scope includes:
- **Lifecycle stages represented in UI/routes**:
  - Dashboard and mapping overview.
  - Source domains: Salesforce snapshot and PMS project list.
  - Transaction domains: pre-sign contracts, contracts, invoices.
  - Governance domains: master data, users/groups, permissions, audit logs, sync jobs/logs.
- **Core entities represented in in-memory model**:
  - `snapshots`, `pmsProjects`, `pmsMilestones`.
  - `preSignContracts`, `preSignLinks`, `preSignPmsAllocations`, `preSignSfAllocations`, `nonProjectCharges`, `preSignPaymentNodes`.
  - `contracts`, `contractPaymentNodes`, `invoices`.
  - `users`, `groups`, `permissions`, `auditLogs`, `syncJobs`, `syncLogs`, `master` data dictionaries.
- **Business capabilities surfaced by the demo**:
  - List/detail/create/edit flows across key modules.
  - Pre-sign allocation logic and validation messaging.
  - Contract creation wizard from signed pre-sign records.
  - Mapping status display and stage drilldown views.
  - Role-based action gating at UI level.

# 6. Out of Scope / Boundary Assumptions
The current demo does **not** yet demonstrate:
- Real backend/API/database integration (data is seeded and kept in-memory at runtime).
- Production workflow orchestration/approvals beyond UI-level transitions.
- Production-grade security enforcement (permission behavior is demo logic in frontend code).
- Persistent audit/compliance guarantees suitable for regulated production use.
- Automated test coverage, CI/CD, or deployment pipeline definition in this repository.
- Finalized data contracts with external enterprise systems.

# 7. Product Positioning
This project should be understood as a **lifecycle visibility and traceability prototype** for OTP-related business management:
- It is not only a dashboard: it includes operational records, mappings, forms, and stage transitions.
- It is not only a data-entry tool: it emphasizes cross-stage linkage, allocation checks, and review surfaces.
- It is not yet a production system: current evidence points to concept validation through a high-fidelity frontend demo.

# 8. Current Maturity
Current maturity is best described as:
- **High-fidelity business demo** with realistic modules and workflows.
- **Frontend-dominant prototype** with no backend persistence.
- **Mock-data-driven concept validation** of lifecycle coverage, transparency, and operational navigation.

# 9. Recommended Follow-up Documents
- `docs/BUSINESS_FLOW.md`
- `docs/DATA_MODEL.md`
- `docs/FEATURE_MAP.md`
- `docs/PAGES_AND_USER_FLOWS.md`
- `docs/DECISIONS.md`
- `docs/ROADMAP.md`

## Confidence Notes

### Confidently inferred from the repo
- The app is a hash-routed SPA with moduleized pages and navigation covering dashboard, mapping, source modules, lifecycle modules, and governance modules.
- In-memory state includes explicit entities for snapshots, PMS, pre-sign allocations, contracts, invoices, permissions, audit, and sync logs.
- The pre-sign and contract flows include allocation/payment-node/business-check surfaces that support lifecycle traceability and amount review.
- No backend/service layer is present in repository structure; runtime is static frontend files plus seeded data.

### Still uncertain / requires human confirmation
- Exact enterprise process ownership and formal role definitions beyond demo group names.
- Final business policy details for allocation rules, exception handling, and approval gates.
- Integration boundaries and target systems-of-record for production rollout.
- Compliance, data governance, and operational SLAs expected in production.
