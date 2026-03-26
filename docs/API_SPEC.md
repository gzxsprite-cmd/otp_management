# 1. API Spec Summary
The current OTP Management Platform demo has **no real backend API implementation** in the repository. There is no `fetch`/`axios` service layer; data is initialized in `seedData()` and mutated in local in-memory `state` via UI handlers.

So the current API layer is best understood as:
- **implemented today:** implicit local data adapter behavior inside `app.js`,
- **strongly implied:** CRUD, linkage, workflow, review, and summary APIs needed to support existing pages,
- **maturity level:** low as a formal interface contract, medium as a UI-driven contract shape (because page/form/list behaviors are detailed).

# 2. API Surface Areas

## Surface: Module record listing and filtering
- **Purpose:** power list pages for `salesforce`, `pms`, `presign`, `contract`, `invoice`, and admin tables.
- **Evidence:** module `filters`, list rendering, filter input handling.

## Surface: Record detail retrieval
- **Purpose:** load detail views and related context by entity ID.
- **Evidence:** `#/module/:module/detail/:id`, `renderDetail()` patterns.

## Surface: Create/update/delete/restore actions
- **Purpose:** persist lifecycle/admin record changes and soft-delete operations.
- **Evidence:** form save handlers, `softDelete`, `restoreRecord`, audit updates.

## Surface: Linkage and allocation management
- **Purpose:** connect pre-sign records to PMS/Salesforce and manage allocation/charge/payment-node child collections.
- **Evidence:** `preSignLinks`, allocation arrays, picker workflows, save validations.

## Surface: Workflow transition actions
- **Purpose:** transition pre-sign records into contracts and maintain lifecycle progress.
- **Evidence:** contract wizard (`#/contracts/wizard`), status checks, derived fields.

## Surface: Mapping/reconciliation and anomaly review
- **Purpose:** return project-level reconciliation status, anomaly state, and drilldown data.
- **Evidence:** `getMappingStatus`, anomaly modal save logic, mapping filters.

## Surface: Dashboard summaries and drilldowns
- **Purpose:** provide stage/year aggregates and record drilldown datasets.
- **Evidence:** dashboard matrix calculations and drawer tab rendering.

## Surface: Governance operations
- **Purpose:** permissions matrix data, audit logs, sync jobs/logs, master and user/group maintenance.
- **Evidence:** dedicated routes/pages and associated state arrays/actions.

# 3. Likely Core Endpoints (Inferred)

> Note: These endpoints are **inferred from UI behavior**; they are not implemented server endpoints in current code.

## Generic module CRUD (highly implied)
- **Path:** `GET /api/{module}`
- **Method:** GET
- **Purpose:** list with filters for module pages.
- **Request params:** module-specific filter keys (from `modules[module].filters`), optional search.
- **Response shape:** `{ items: [...], total?: number }` with list-view fields.
- **Confidence:** **High** (UI relies on these operations conceptually).

- **Path:** `GET /api/{module}/{id}`
- **Method:** GET
- **Purpose:** detail retrieval.
- **Request params:** path `id`.
- **Response shape:** full entity record + possibly related blocks.
- **Confidence:** **High**.

- **Path:** `POST /api/{module}`
- **Method:** POST
- **Purpose:** create record.
- **Request params/body:** form payload by module.
- **Response shape:** created record.
- **Confidence:** **High**.

- **Path:** `PATCH /api/{module}/{id}`
- **Method:** PATCH
- **Purpose:** update record.
- **Request params/body:** changed fields.
- **Response shape:** updated record.
- **Confidence:** **High**.

- **Path:** `POST /api/{module}/{id}/soft-delete`
- **Method:** POST
- **Purpose:** soft delete.
- **Request params/body:** actor/context optional.
- **Response shape:** updated deletion flags.
- **Confidence:** **Medium** (UI uses soft delete semantics).

- **Path:** `POST /api/{module}/{id}/restore`
- **Method:** POST
- **Purpose:** restore soft-deleted record.
- **Request params/body:** actor/context optional.
- **Response shape:** restored record.
- **Confidence:** **Medium**.

## Pre-sign linkage/allocation actions
- **Path:** `GET /api/presign/{id}/links`
- **Method:** GET
- **Purpose:** retrieve PMS/Salesforce links.
- **Request params:** `id`.
- **Response shape:** `{ pms_links: [...], salesforce_links: [...] }` or flat link list.
- **Confidence:** **High**.

- **Path:** `PUT /api/presign/{id}/allocations`
- **Method:** PUT
- **Purpose:** replace/update PMS/SF allocations + non-project charges + payment nodes as one transaction.
- **Request body:** `{ pms_allocations, sf_allocations, non_project_charges, payment_nodes }`.
- **Response shape:** persisted child collections + validation result.
- **Confidence:** **High** (current save flow behaves this way internally).

- **Path:** `POST /api/presign/{id}/ocr-run`
- **Method:** POST
- **Purpose:** trigger OCR extraction.
- **Request body:** file reference.
- **Response shape:** extracted fields + confidence metadata.
- **Confidence:** **Medium** (currently simulated).

## Contract transition actions
- **Path:** `POST /api/contracts/from-presign`
- **Method:** POST
- **Purpose:** create contract from selected signed-ready pre-sign.
- **Request body:** `{ presign_contract_id, signed_file_name }`.
- **Response shape:** created contract + derived fields (`derivation_status`, years).
- **Confidence:** **High**.

## Mapping and anomaly actions
- **Path:** `GET /api/mapping/projects`
- **Method:** GET
- **Purpose:** mapping overview rows with status dimensions.
- **Request params:** mapping filters (`project_phase`, status fields, anomaly state, range filters, search).
- **Response shape:** project rows + computed status summary fields.
- **Confidence:** **Medium** (computation currently client-side).

- **Path:** `PATCH /api/mapping/projects/{id}/anomaly`
- **Method:** PATCH
- **Purpose:** update anomaly status/reason/comment/evidence.
- **Request body:** anomaly fields.
- **Response shape:** updated project anomaly block.
- **Confidence:** **High**.

## Dashboard summary/drilldown
- **Path:** `GET /api/dashboard/summary`
- **Method:** GET
- **Purpose:** stage/year aggregate matrix + top customers.
- **Request params:** `view_type`, `grouping`, `year`.
- **Response shape:** aggregate metrics and card payloads.
- **Confidence:** **Medium**.

- **Path:** `GET /api/dashboard/drilldown`
- **Method:** GET
- **Purpose:** detail rows behind a selected stage/year/tab.
- **Request params:** `stage`, `year`, `tab`, optional customer scope.
- **Response shape:** records table rows.
- **Confidence:** **Medium**.

## Sync and audit
- **Path:** `GET /api/sync/jobs`, `GET /api/sync/logs`
- **Method:** GET
- **Purpose:** read sync status/logs.
- **Response shape:** job list / log list.
- **Confidence:** **High**.

- **Path:** `POST /api/sync/jobs/{job_type}/run`
- **Method:** POST
- **Purpose:** trigger sync.
- **Response shape:** run result + updated counters/timestamp.
- **Confidence:** **High** (currently simulated).

- **Path:** `GET /api/audit/logs`
- **Method:** GET
- **Purpose:** query audit records.
- **Request params:** entity, actor, date range filters (inferred).
- **Response shape:** audit entries.
- **Confidence:** **Medium**.

# 4. Entity-Oriented API Needs

## `snapshots`
- **List/detail:** filter by `pid`, `configuration_id`, `customer_id`, `product_type_id`, `sales_region_id`, `se_status`.
- **Create/update:** maintain source snapshot data.
- **Relationship needs:** referenced by pre-sign links and SF allocations.
- **Review/status needs:** supports mapping status calculations.

## `pmsProjects` and `pmsMilestones`
- **List/detail:** filter by project identity/phase/complexity and MCRL fields.
- **Create/update:** project + milestone maintenance.
- **Relationship needs:** linked from pre-sign; used in mapping and anomaly review.
- **Review/status needs:** anomaly fields and phase dimensions.

## `preSignContracts`
- **List/detail:** filter by customer/contract/title/nominal/status fields.
- **Create/update:** core pre-sign form payload.
- **Relationship/linkage:** links to PMS/Salesforce; owns allocations, charges, payment nodes.
- **Action needs:** OCR run, allocation validation save, status transition.

## `preSignLinks`, `preSignPmsAllocations`, `preSignSfAllocations`, `nonProjectCharges`, `preSignPaymentNodes`
- **List/detail:** usually contextual under a `preSignContracts` parent.
- **Create/update:** batch replace/patch during pre-sign save.
- **Relationship needs:** child collections plus target references (`pms_project_id`, `sf_snapshot_id`).
- **Action needs:** link/unlink and recompute validation.

## `contracts` and `contractPaymentNodes`
- **List/detail:** contract retrieval with derivation status and linked fields.
- **Create/update:** direct form save and wizard-based creation from pre-sign.
- **Relationship needs:** upstream `presign_contract_id`, downstream invoices.
- **Action needs:** contract node editing and lifecycle status updates.

## `invoices`
- **List/detail:** filter by customer/product/date/year/month.
- **Create/update:** receipt records with amount/currency/reference.
- **Relationship needs:** `contract_id` linkage.
- **Review/status needs:** feed mapping and dashboard summaries.

## Governance entities (`master`, `users`, `groups`, `permissions`, `auditLogs`, `syncJobs`, `syncLogs`)
- **List/detail/update needs:** admin maintenance and observability pages.
- **Action needs:** permission matrix retrieval/update (implied), sync run, audit query.

# 5. Query, Filter, and Search Parameters
Recurring patterns visible in UI and module config:
- **Module filter params:** from `modules[module].filters` (e.g., status/date/customer/product fields).
- **Keyword-like search:** global search field and mapping/module filter text fields.
- **Route param addressing:** `module`, `action`, `id` drive detail/edit context.
- **Linked-record queries:** pre-sign links by `presign_contract_id`; contracts by project mapping; invoices by `contract_id`.
- **No visible pagination/sorting contract:** current list rendering is in-memory; pagination/sort are not formalized.

# 6. Action APIs Implied by the UI

## Save/create/update actions
- **User action:** save forms across modules.
- **Likely API behavior:** create/update records and return canonical entity.
- **Current repo status:** local in-memory mutation (real in demo, no network API).

## Delete/restore actions
- **User action:** delete and restore in list pages.
- **Likely API behavior:** soft-delete toggle endpoints with actor metadata.
- **Current repo status:** local `is_deleted`, `deleted_at`, `deleted_by` updates.

## Linking and allocation actions
- **User action:** pick PMS/SF links and set allocation rows.
- **Likely API behavior:** upsert/replace linkage and child allocation collections.
- **Current repo status:** local save logic replacing child arrays.

## Contract wizard transition
- **User action:** create contract from selected `signed_ready` pre-sign.
- **Likely API behavior:** transition endpoint that copies fields and sets derivation fields.
- **Current repo status:** local action in wizard handler.

## Anomaly update action
- **User action:** save anomaly status/reason/comment/evidence from modal.
- **Likely API behavior:** patch anomaly fields for a PMS project/review record.
- **Current repo status:** local project mutation.

## Sync run action
- **User action:** click run sync for Salesforce/PMS.
- **Likely API behavior:** trigger async sync job and return updated job/log state.
- **Current repo status:** simulated local data mutation.

## OCR action
- **User action:** run/clear OCR in pre-sign form.
- **Likely API behavior:** process file and return extracted contract fields.
- **Current repo status:** simulated local field fill + message.

# 7. Data Contract Patterns
- **Shared numeric `id` pattern** across entities, plus business IDs (`pid`, `pms_id`, `internal_contract_id`, `customer_contract_no`).
- **List + detail contract pattern:** list columns and filters are explicit per module, detail adds related records and summaries.
- **Parent-child write pattern:** pre-sign save bundles multiple child collections (links/allocations/charges/payment nodes).
- **Summary + drilldown pattern:** dashboard and mapping compute higher-level status from base entities and expose detail drilldowns.
- **Repeated status/value/time dimensions:** status fields, date fields, amount fields recur across entities.
- **Soft-delete metadata pattern:** `is_deleted` (+ `deleted_at`, `deleted_by` where applicable).

# 8. Current API Readiness
Current API readiness is **prototype-level**:
- strong UI-driven contract signals,
- no actual HTTP/service layer,
- no centralized endpoint schema,
- useful baseline for backend design once data semantics are formalized.

In short: interface needs are clear, formal API implementation is not yet started in code.

# 9. Gaps / Ambiguities in the Current API Layer
- No `fetch`/`axios` service abstraction or backend endpoint implementation.
- Endpoint boundaries are implied by pages/actions, not formally declared.
- List/detail/filter semantics are module-specific and not centralized in a shared API contract file.
- Pagination/sorting semantics are absent in current UI contracts.
- Relationship operations are functionally present but not normalized as explicit REST action contracts.
- Transaction semantics for multi-entity saves (pre-sign + allocations + links + charges + nodes) are unspecified.
- Authorization semantics exist in UI gating, but backend authz contract is undefined.
- Async job semantics (sync/OCR states, retries, failures) are only shallowly represented.

# 10. Practical Guidance for Future API Design
- Treat current UI flows as the source for initial endpoint prioritization.
- Start with high-value lifecycle endpoints: `presign`, linkage/allocations, contract wizard transition, invoice tracking, mapping summary.
- Standardize shared list/detail response envelopes and filter conventions early.
- Keep inferred endpoints labeled as provisional until data model/cardinality rules are finalized.
- Avoid building broad generic APIs before stabilizing entity naming and linkage semantics.

# 11. Confidence Notes

## Confidently extracted from the repo
- The repo currently has no real API layer; data and actions are local state operations.
- UI behavior strongly implies CRUD + linkage + summary + action endpoints across lifecycle modules.
- Key action patterns (save/delete/restore/link/wizard/anomaly/sync/OCR) are clearly represented in event handlers.

## Still uncertain / requires human confirmation
- Final endpoint boundaries and resource ownership (especially for mapping and anomaly semantics).
- Transaction boundaries for multi-collection operations in pre-sign saves.
- Pagination/sorting/global search contracts for production scale.
- Backend authorization, audit immutability, and integration failure/retry contracts.
