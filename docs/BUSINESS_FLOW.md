# 1. Flow Summary
The current demo represents an OTP lifecycle that connects upstream commercial/project signals to downstream contract and cash-collection tracking.

**Lifecycle line (implementation-based):**
`Salesforce Snapshot + PMS Project -> Pre-sign Contract Mapping/Allocation -> Contract -> Invoice/Payment Tracking -> Dashboard/Mapping Review`

In business terms, the platform appears to model how a project/customer opportunity is validated and linked, then translated into contractual commitments and eventually measured against incoming payments, with management visibility and exception review layered across the flow.

# 2. End-to-End Lifecycle Stages

## Stage 1 — Upstream source capture (Salesforce + PMS)
- **What it represents:** Initial business/project context from source systems.
- **Main objects:** `snapshots` (Salesforce), `pmsProjects`, `pmsMilestones`.
- **Tracked information:** PID/configuration/customer, SE status, OTP/OTC amount text, project phase/complexity, milestone fields.
- **Downstream connection:** Used as mapping inputs for pre-sign links/allocations and later lifecycle status evaluation.

## Stage 2 — Pre-sign contract intake and mapping
- **What it represents:** Pre-sign commercial agreement capture before formal contract finalization.
- **Main objects:** `preSignContracts`, `preSignLinks`, `preSignPmsAllocations`, `preSignSfAllocations`, `nonProjectCharges`, `preSignPaymentNodes`.
- **Tracked information:** Contract basics (customer, title, product, amounts, nominal type, status), OCR fields, non-project deductions, PMS/Salesforce allocation ratios/amounts, payment nodes.
- **Downstream connection:** Provides structured basis for formal contract creation and project traceability.

## Stage 3 — Contract formalization / derivation
- **What it represents:** Conversion from eligible pre-sign records into managed contract records.
- **Main objects:** `contracts`, `contractPaymentNodes`, and `presign_contract_id` linkage.
- **Tracked information:** Internal contract ID, signed dates/files, status, derived payment year text, payment schedule nodes.
- **Downstream connection:** Contract records anchor invoice/payment tracking and mapping status checks.

## Stage 4 — Invoice and payment tracking
- **What it represents:** Downstream financial realization tracking against contracts.
- **Main objects:** `invoices`.
- **Tracked information:** received date/year/month, amount, currency, payment reference, contract linkage.
- **Downstream connection:** Feeds lifecycle completion/health signals in mapping and dashboard views.

## Stage 5 — Cross-stage monitoring, governance, and operational control
- **What it represents:** Management/review layer across the full flow.
- **Main objects:** dashboard metrics/views, mapping status model, `auditLogs`, `syncJobs`, `syncLogs`, permissions/users/groups/master data.
- **Tracked information:** stage-level status icons (√/!/X), anomalies, invoice remaining indications, sync recency/status, actor/action logs.
- **Downstream connection:** Supports operational follow-up, reconciliation, and role-based oversight across all prior stages.

# 3. Cross-Stage Flow Logic
The demo implies these cross-stage lifecycle mechanics:
- **Record continuity through explicit keys/links:**
  - `preSignLinks` ties pre-sign contracts to PMS and Salesforce references.
  - `contracts` hold `presign_contract_id` to preserve upstream continuity.
  - Invoices are tied to contracts and then interpreted back into project-stage status.
- **Amount reconciliation as a core control point:**
  - Pre-sign stage calculates project total from contract total minus non-project charges.
  - PMS/Salesforce allocations are validated against that project total.
  - Payment-node totals are compared against contract totals.
- **Lifecycle health shown as cross-stage status, not only per-record pages:**
  - Mapping overview computes Salesforce/Contract/Invoice status and anomaly text.
  - Dashboard aggregates year/stage views and supports drill-down by stage.
- **Review/exception surface exists, but workflow enforcement is lightweight:**
  - Users can inspect anomalies and update comments/status fields in UI.
  - No fully modeled, multi-step approval workflow is demonstrated in code.

# 4. Key Business Objects Along the Flow
- **`snapshots` (Salesforce snapshot stage):** upstream opportunity/reference data; relates to PMS and mapping checks.
- **`pmsProjects` / `pmsMilestones` (project planning/execution stage):** project identity and phase/milestone context used for mapping and status logic.
- **`preSignContracts` (pre-contract commercial stage):** central pre-sign agreement record; links upstream sources and carries key financial terms.
- **`preSignLinks` (cross-source linkage layer):** explicit link object connecting pre-sign contracts to PMS or Salesforce references.
- **`preSignPmsAllocations` / `preSignSfAllocations` (allocation control layer):** split project amounts across PMS/Salesforce targets.
- **`nonProjectCharges` (allocation adjustment layer):** deducts non-project amounts before project allocation calculations.
- **`preSignPaymentNodes` / `contractPaymentNodes` (payment schedule layer):** staged expected payment structure used in validation and yearly derivation.
- **`contracts` (formal agreement stage):** operational contract entity derived from pre-sign.
- **`invoices` (cash realization stage):** received payment records tied to contracts and later mapped to lifecycle status.
- **`auditLogs`, `syncJobs`, `syncLogs`, `permissions`, `users`, `groups`, `master` (governance/support layer):** accountability, synchronization simulation, role access, and shared reference data.

# 5. User Actions Implied by the Demo
Based on pages/forms/tables and route behavior, users can:
- Create, edit, view, and soft-delete records in major operational modules.
- Link pre-sign records to PMS/Salesforce entities through picker-based mapping actions.
- Enter or adjust allocations, non-project charges, and payment nodes with validation hints.
- Convert eligible pre-sign records into contracts via contract wizard flow.
- Record invoice receipts and track receipt timing/amount dimensions.
- Filter and inspect cross-stage mapping status, anomalies, and drilldown details.
- Review audit entries, monitor sync jobs/logs, and use permission-scoped actions.

# 6. Flow Gaps or Unclear Transitions
The current demo leaves several lifecycle transitions partially defined:
- **Transition criteria are mostly implicit:** status fields exist (e.g., pre-sign statuses), but end-to-end state-machine rules are not fully formalized.
- **Approval/governance depth is limited:** permissions exist, but detailed approval chains/SLA/escalation logic are not explicit.
- **Integration boundaries are simulated:** sync pages/logs exist, but external system contracts and error-handling behavior are not production-defined.
- **Financial rule completeness is uncertain:** allocation checks are present, yet full accounting/tax policy handling is not fully documented.
- **Anomaly closure semantics are lightweight:** mapping anomalies can be shown/closed, but root-cause taxonomy and remediation workflow are not deeply modeled.
- **Data persistence and historical integrity are not proven:** all lifecycle behaviors run on in-memory seeded data.

# 7. Practical Interpretation for Future Development
Use this document as the working reference for **current lifecycle intent**, not final process policy:
- Treat it as the baseline map for product discussions and requirement refinement.
- Use it to align data model evolution and page-level feature expansion.
- Validate each ambiguous transition in stakeholder workshops before backend/workflow implementation.

# 8. Confidence Notes

## Confidently inferred from the repo
- The demo clearly models a connected path from source data (Salesforce/PMS) through pre-sign mapping, contract management, invoice tracking, and cross-stage monitoring.
- `preSignLinks`, `presign_contract_id`, allocation tables, and mapping status logic are key continuity mechanisms across stages.
- Governance/support pages (permissions, audit, sync, users/master data) are part of the intended operational environment.
- The implementation is frontend-only with seeded in-memory data.

## Still uncertain / requires human confirmation
- Exact production transition rules for status changes and mandatory approvals.
- Formal business ownership and handoff responsibility between roles at each stage.
- Production integration contract details with external source/finance systems.
- Final exception-handling process, audit/compliance depth, and policy-grade financial rules.
