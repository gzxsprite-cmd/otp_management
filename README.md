# OTP Management Platform Demo

## Overview
OTP Management Platform Demo is a single-page, front-end-heavy prototype for managing One-Time Payment (OTP) business flow from upstream opportunity/snapshot data through pre-sign mapping, contract lifecycle, and invoice collection tracking. The current implementation focuses on linking Salesforce/PMS/project data, allocation visibility, and auditability across stages so teams can review consistency between expected amounts, signed contract structures, and received payments.

## What This Demo Currently Covers

### Major modules and pages
- **Dashboard** (`#/dashboard`): OTP matrix, stage drill-down, and top-customer views.
- **Mapping Overview** (`#/mapping`): cross-stage mapping status and project-level traceability views.
- **Pre-sign Management** (`#/module/presign`): pre-sign contract list, detail, create/edit with allocations and payment nodes.
- **Contract Management** (`#/module/contract`): contract list/detail plus contract wizard from signed pre-sign records.
- **Invoice Tracking** (`#/module/invoice`): payment receipt tracking against contracts.
- **Salesforce Snapshot** (`#/module/salesforce`): upstream snapshot records.
- **PMS Project List** (`#/module/pms`): project list and milestone management.
- **Master Data** (`#/module/master`): customers, product types, sales regions, configurations.
- **Users & Groups** (`#/module/users`): demo user/group maintenance.
- **Permissions Matrix** (`#/permissions`): module-action authorization matrix view.
- **Audit Logs** (`#/audit`) and **Sync Jobs/Logs** (`#/sync`): traceability and data-sync simulation.

### Key business objects represented in code
- `preSignContracts`, `contracts`, `invoices`.
- `snapshots` (Salesforce), `pmsProjects`, `pmsMilestones`.
- Mapping/link entities: `preSignLinks`, `preSignPmsAllocations`, `preSignSfAllocations`, `nonProjectCharges`, `preSignPaymentNodes`, `contractPaymentNodes`.
- Governance/supporting entities: `users`, `groups`, `permissions`, `auditLogs`, `syncJobs`, `syncLogs`, and `master` dictionaries.

### Main workflows represented
1. **Snapshot/project ingestion and maintenance** through Salesforce/PMS modules.
2. **Pre-sign workflow** including file metadata, OCR simulation, non-project deduction, PMS/Salesforce allocation, and payment-node definition.
3. **Contract derivation path** from pre-sign records to contract records (including wizard flow).
4. **Invoice/receipt tracking** tied to contract context.
5. **Cross-stage monitoring** via dashboard and mapping pages, with role-based UI actions and audit/history traces.

## Core Value of the Current Platform
- **End-to-end visibility** across opportunity snapshot → pre-sign mapping → contract → invoice stages.
- **Allocation transparency** through explicit project/non-project amount splits and validation hints.
- **Cross-source linkage** between Salesforce snapshots, PMS projects, and contract entities.
- **Operational traceability** via permissions matrix, audit logs, and sync-job/log views.

## Main Project Structure

```text
.
├── app.js                 # Main SPA logic: state, mock data seeding, routing, module rendering, business calculations
├── index.html             # Application shell (sidebar/topbar/content containers)
├── style.css              # Global styles and component-level UI styling
├── assets/
│   └── mock-pdf-page.svg  # Placeholder preview asset for document snapshots
└── README.md              # Project entry documentation
```

### Implementation notes
- The app is implemented as a **vanilla JavaScript hash-routed SPA** (no framework build step in repo).
- `app.js` centralizes:
  - state/data model definitions,
  - demo seed data generation,
  - route parsing and page dispatch,
  - module list/detail/form renderers,
  - pre-sign/contract allocation and validation logic.
- There is **no backend service** in this repository; all business data is in-memory mock/demo data seeded at runtime.

## How to Run the Project

Because the repository currently contains static frontend assets without package scripts, run it with a simple static server.

### Option A (Python, recommended)
```bash
python -m http.server 8000
```
Then open:
- `http://127.0.0.1:8000/index.html#/dashboard`

### Option B (any static file server)
Use any equivalent static web server and open `index.html` with hash routes.

> Notes:
> - No `package.json`/npm scripts are present in the current repository.
> - No build, bundle, or test pipeline is defined in this codebase yet.

## Current Status
- **Maturity**: high-fidelity, mock-data-driven demo/prototype.
- **Architecture**: frontend-only SPA with in-memory state.
- **Business flow coverage**: broad module coverage with interactive workflows, but not yet production-integrated (no real APIs, persistence, or deployment pipeline in repo).

## Recommended Documentation Next
- `docs/PROJECT_OVERVIEW.md`
- `docs/BUSINESS_FLOW.md`
- `docs/DATA_MODEL.md`
- `docs/FEATURE_MAP.md`
- `docs/PAGES_AND_USER_FLOWS.md`
- `docs/DECISIONS.md`
- `docs/ROADMAP.md`
