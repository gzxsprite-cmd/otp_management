# 1. Data Model Summary
The current OTP Management Platform demo uses a **lifecycle-oriented, record-based in-memory model** implemented as JavaScript arrays under a single `state` object. The structure combines stage entities (Salesforce/PMS source records, pre-sign contracts, contracts, invoices) with linkage entities (pre-sign links and allocation tables) and governance entities (users/permissions/audit/sync/master data).

A single global "anchor ID" does not exist. Instead, cross-stage continuity is achieved through **explicit foreign-key-like references** (for example `presign_contract_id`, `contract_id`, `pms_project_id`, `sf_snapshot_id`, `customer_id`, `product_type_id`, `sales_region_id`).

**Relationship sketch (visible in code):**
`pmsProjects/snapshots -> preSignContracts (+ preSignLinks + allocations + payment nodes) -> contracts -> invoices`

# 2. Core Business Entities

## Lifecycle and source entities
- **`snapshots`**
  - **Business meaning:** Salesforce snapshot records used as upstream commercial reference.
  - **Where:** `state.snapshots`, `salesforce` module.
  - **Usage:** Listed/filtered as source data and linked to pre-sign via `preSignLinks` and `preSignSfAllocations`.

- **`pmsProjects`**
  - **Business meaning:** PMS project master records used for project-side lifecycle tracking.
  - **Where:** `state.pmsProjects`, `pms` module.
  - **Usage:** Linked to pre-sign contracts, used by mapping overview and anomaly/status logic.

- **`pmsMilestones`**
  - **Business meaning:** milestone schedule entries (e.g., SOP/PPAP/EV) for each PMS project.
  - **Where:** `state.pmsMilestones`.
  - **Usage:** project detail context and contract derivation status checks (implied).

- **`preSignContracts`**
  - **Business meaning:** pre-sign contract/agreement records before finalized contract stage.
  - **Where:** `state.preSignContracts`, `presign` module.
  - **Usage:** central operational object for mapping, allocations, OCR status, payment terms, and downstream contract derivation.

- **`contracts`**
  - **Business meaning:** formal contract records derived from pre-sign records.
  - **Where:** `state.contracts`, `contract` module.
  - **Usage:** parent object for contract payment nodes and invoice records.

- **`invoices`**
  - **Business meaning:** received-payment/invoice tracking records.
  - **Where:** `state.invoices`, `invoice` module.
  - **Usage:** used for lifecycle realization tracking and dashboard/mapping calculations.

## Linkage and allocation entities
- **`preSignLinks`**
  - **Business meaning:** explicit bridge object linking a pre-sign contract to PMS and/or Salesforce references.
  - **Where:** `state.preSignLinks`.
  - **Usage:** cross-stage traceability and contract/project linkage in mapping logic.

- **`preSignPmsAllocations` / `preSignSfAllocations`**
  - **Business meaning:** allocation splits of pre-sign project amount across PMS projects and Salesforce snapshots.
  - **Where:** `state.preSignPmsAllocations`, `state.preSignSfAllocations`.
  - **Usage:** ratio/amount validation, summary displays, and save-time consistency checks.

- **`nonProjectCharges`**
  - **Business meaning:** non-project charges deducted from pre-sign contract total before project allocation.
  - **Where:** `state.nonProjectCharges`.
  - **Usage:** compute project total and enforce allocation constraints.

- **`preSignPaymentNodes` / `contractPaymentNodes`**
  - **Business meaning:** staged payment schedules at pre-sign and contract levels.
  - **Where:** `state.preSignPaymentNodes`, `state.contractPaymentNodes`.
  - **Usage:** payment distribution validation and year-split derivation views.

## Governance and supporting entities
- **`master` (`customers`, `productTypes`, `salesRegions`, `configurations`)**: reference data used across forms/tables.
- **`users`, `groups`, `permissions`, `customerAssignments`**: role/user access scaffolding.
- **`auditLogs`**: entity action log entries.
- **`syncJobs`, `syncLogs`**: source sync simulation metadata.

# 3. Key Fields by Entity
Below are the high-signal fields (not an exhaustive dump).

## `snapshots` (Salesforce)
- **Identity:** `id`, `pid`, `configuration_id`.
- **Business classification:** `customer_id`, `product_type_id`, `sales_region_id`, `se_status`.
- **Value/time:** `otp_amounts_text`, `otc_amounts_text`, `snapshot_date`.
- **System metadata:** `source_batch_id`, `created_at`, `updated_at`, `is_deleted`.

## `pmsProjects` / `pmsMilestones`
- **Identity:** `id`, `pms_id`, `pid`.
- **Business definition:** `project_name`, `project_complexity`, `project_phase`.
- **Ownership/context:** `customer_id`, `product_type_id`, `sales_region_id`, `created_by`.
- **Lifecycle markers:** `mcrl0/mcrl1/mcrl2`, `anomaly_status`, `close_reason`, `comment`, `evidence_link_text`.
- **Milestones:** `pms_project_id`, `milestone_name`, `planned_date`, `sequence`.

## `preSignContracts`
- **Identity:** `id`, `customer_contract_no`, `contract_title`.
- **Classification/context:** `customer_id`, `product_type_id`, `sales_region_id`, `customer_vehicle_project_name`, `project_nominal_type`.
- **Financials/terms:** `total_amount_excl_tax`, `total_amount_incl_tax`, `payment_terms_text`.
- **IP and content:** `ip_ownership`, `ip_notes`, `development_fee_name`, `development_reason`.
- **Document/OCR:** `source_file_name`, `source_file_type`, `source_file_url`, `ocr_status`, `ocr_extracted_json`, `ocr_last_run_at`.
- **Lifecycle/system:** `status`, `is_deleted`, `created_at`, `updated_at`.

## `preSignLinks`
- **Identity/reference:** `id`, `presign_contract_id`, `link_type`.
- **PMS linkage fields:** `pms_project_id`, `pms_id`.
- **Salesforce linkage fields:** `snapshot_ref_id`, `pid`, `configuration_id`.
- **Context:** `comment`.

## `preSignPmsAllocations` / `preSignSfAllocations`
- **Identity/reference:** `id`, `presign_contract_id`.
- **Target reference:** `pms_project_id` or `sf_snapshot_id` (+ `pid`, `configuration_id` for SF).
- **Financial structure:** `allocation_ratio`, `allocation_amount_excl_tax`, `allocation_amount_incl_tax`.
- **Commentary:** `note`.

## `nonProjectCharges`
- **Identity/reference:** `id`, `presign_contract_id`.
- **Financial meaning:** `reason`, `amount_incl_tax`.
- **Context:** `note`.

## `contracts` / `contractPaymentNodes`
- **Identity:** `id`, `internal_contract_id`.
- **Upstream link:** `presign_contract_id`.
- **Business context:** `customer_id`, `product_type_id`, `sales_region_id`, `customer_contract_no`, `contract_title`.
- **Financial/terms:** `total_amount_excl_tax`, `total_amount_incl_tax`, `payment_terms_text`, `derived_payment_years_text`.
- **Contract lifecycle:** `signed_date`, `archive_date`, `derivation_status`, `status`.
- **Files/IP:** `signed_file_name`, `signed_file_url`, `ip_ownership`, `ip_notes`.
- **System metadata:** `is_deleted`, `created_at`, `updated_at`.
- **Payment nodes:** `contract_id`, `seq_no`, `node_name`, `pay_ratio`, `pay_amount`, `planned_year`.

## `invoices`
- **Identity/reference:** `id`, `contract_id`.
- **Business context:** `customer_id`, `product_type_id`, `sales_region_id`.
- **Value/time:** `received_date`, `received_year`, `received_month`, `received_amount`, `currency`.
- **Operational details:** `payment_reference_no`, `note`, `created_by`.
- **System metadata:** `created_at`, `updated_at`, `is_deleted`.

## Governance/support entities
- **`users` / `groups`:** `id`, display/login fields, `group_id`, active flag.
- **`permissions`:** (UI matrix-driven action model; module/action dimensions).
- **`auditLogs`:** `entity_type`, `entity_id`, `action`, `actor_user_id`, `timestamp`, `changed_fields_json`.
- **`syncJobs` / `syncLogs`:** job type, last run/status, record deltas, and log lines by `sync_job_id`.

# 4. Entity Relationships

## Primary lifecycle relationships
- **Pre-sign to contract:** `contracts.presign_contract_id -> preSignContracts.id` (one pre-sign may have zero/one contract in current flow).
- **Contract to invoice:** `invoices.contract_id -> contracts.id` (one contract to many invoice/receipt records).
- **Project/source to pre-sign via bridges:**
  - `preSignLinks.presign_contract_id -> preSignContracts.id`
  - `preSignLinks.pms_project_id -> pmsProjects.id` (when `link_type = "pms"`)
  - `preSignLinks.snapshot_ref_id -> snapshots.id` (when `link_type = "salesforce"`)

## Allocation and schedule child structures
- `preSignPmsAllocations.presign_contract_id -> preSignContracts.id` and `...pms_project_id -> pmsProjects.id`.
- `preSignSfAllocations.presign_contract_id -> preSignContracts.id` and `...sf_snapshot_id -> snapshots.id`.
- `nonProjectCharges.presign_contract_id -> preSignContracts.id`.
- `preSignPaymentNodes.pre_sign_contract_id -> preSignContracts.id`.
- `contractPaymentNodes.contract_id -> contracts.id`.

## Reference-data relationships
- Most lifecycle entities carry `customer_id`, `product_type_id`, `sales_region_id` to join against `master` dictionaries.

## Cardinality observations (implementation-level)
- Many cardinalities are **effectively one-to-many** through array filters and repeated child records.
- A true many-to-many between pre-sign and upstream objects is represented through `preSignLinks` plus allocation tables.
- Some cardinalities are enforced by UI behavior rather than formal schema constraints.

# 5. Identifiers and Linking Logic
Visible identifier strategy:
- Each entity uses a numeric `id` generated in-memory.
- Business-facing IDs coexist with numeric IDs (e.g., `pid`, `pms_id`, `internal_contract_id`, `customer_contract_no`, `payment_reference_no`).

Linking logic characteristics:
- **Explicit references dominate** (`presign_contract_id`, `contract_id`, `pms_project_id`, `sf_snapshot_id`, `snapshot_ref_id`).
- **No global lifecycle anchor ID** is defined across all stages.
- Cross-stage joins in views are performed through lookup/filter operations in frontend code.
- Linking is partly **explicit and saved** (bridge/allocation records) and partly **derived in analytics** (mapping status calculations).
- Since data is in-memory mock state, referential integrity is implemented procedurally in save handlers, not by database constraints.

# 6. Status, Time, and Value Dimensions

## Status dimensions
- `se_status` on snapshots (`SE1`..`SE4`).
- `project_phase`, `project_complexity`, and anomaly fields on PMS projects.
- `project_nominal_type`, `ocr_status`, and `status` on pre-sign contracts.
- `derivation_status`, `status` on contracts.
- Sync job `last_status`, plus audit action entries.

## Time dimensions
- Source snapshots: `snapshot_date`.
- Lifecycle timestamps: `created_at`, `updated_at` on many entities.
- Contract timing: `signed_date`, `archive_date`.
- Payment timing: `received_date`, `received_year`, `received_month`.
- Schedule timing: milestone dates and payment node `planned_year`.

## Value/financial dimensions
- Contract/pre-sign totals (`total_amount_excl_tax`, `total_amount_incl_tax`).
- Allocation ratios and split amounts (incl/excl tax).
- Non-project charges deducted from project total.
- Payment node ratio/amount and invoice received amount/currency.

## Ownership/responsibility dimensions
- `created_by`, `actor_user_id`, `group_id`, and customer assignments imply operational ownership and accountability.

# 7. Model Strengths in the Current Demo
- Clear separation between lifecycle entities, linkage entities, and governance/support entities.
- Strong traceability intent through explicit bridge keys and allocation child tables.
- Consistent recurring dimensions (status, time, value, reference data) across modules.
- Practical support for management/reporting layers (dashboard/mapping) using operational records.

# 8. Data Model Gaps / Ambiguities
- No formal schema file or typed contract (all model semantics are implicit in JS state + UI handlers).
- Referential integrity and uniqueness rules are not centrally enforced (save logic enforces only selected checks).
- Naming is mostly consistent but mixed conventions exist (e.g., `pre_sign_contract_id` vs `presign_contract_id`).
- Some entities/fields are present mainly for UI simulation and may not yet map to final business semantics.
- Cardinalities and lifecycle rules are partly inferred from UI behavior, not formally documented.
- Permission model structure exists in state, but full persisted permission schema is not evident.

# 9. Recommendations for Future Structuring
Use this document as the baseline for incremental model formalization:
- Convert current implicit structure into a formal schema (ERD + field dictionary + constraints).
- Standardize naming and key conventions across all modules before backend/API implementation.
- Define explicit lifecycle transition rules and required linkage constraints per stage.
- Use these entities/relationships as the source for API contract design and persistence modeling.

# 10. Confidence Notes

## Confidently inferred from the repo
- Core lifecycle entities and linking objects are directly visible in `state`, module definitions, and seed data.
- Cross-stage continuity is implemented through explicit reference fields and bridge/allocation records.
- The current model is frontend-only, in-memory, and operationally simulated without backend persistence.

## Still uncertain / requires human confirmation
- Final production cardinalities and uniqueness constraints.
- Definitive lifecycle state machine and approval-rule semantics.
- Whether all current fields (especially simulation/support fields) should persist in production.
- Final ownership/governance model for permissions and compliance-grade audit requirements.
