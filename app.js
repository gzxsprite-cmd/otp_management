const state = {
  currentUserId: 1,
  navSections: [
    {
      title: "业务模块",
      items: [
        { id: "salesforce", label: "Salesforce 快照", route: "#/module/salesforce" },
        { id: "pms", label: "PMS 项目清单", route: "#/module/pms" },
        { id: "presign", label: "代签合同/协议映射", route: "#/module/presign" },
        { id: "contract", label: "合同管理", route: "#/module/contract" },
        { id: "invoice", label: "回款/发票跟踪", route: "#/module/invoice" },
        { id: "dashboard", label: "OTP 总览看板", route: "#/dashboard" },
      ],
    },
    {
      title: "系统管理",
      items: [
        { id: "master", label: "主数据", route: "#/module/master" },
        { id: "users", label: "用户与组", route: "#/module/users" },
        { id: "permissions", label: "权限矩阵", route: "#/permissions" },
        { id: "audit", label: "审计日志", route: "#/audit" },
        { id: "sync", label: "同步任务与日志", route: "#/sync" },
      ],
    },
  ],
  users: [],
  groups: [],
  permissions: [],
  customerAssignments: [],
  master: {
    customers: [],
    productTypes: [],
    salesRegions: [],
    configurations: [],
  },
  snapshots: [],
  pmsProjects: [],
  pmsMilestones: [],
  preSignContracts: [],
  preSignLinks: [],
  contracts: [],
  invoices: [],
  syncJobs: [],
  syncLogs: [],
  auditLogs: [],
  ui: {
    columnPrefs: {},
    filterPrefs: {},
  },
};

const enums = {
  projectComplexity: ["pilot", "adaptation", "minor_change", "EC", "sw_decoupling"],
  projectPhase: ["future", "quotation", "running", "sop"],
  seStatus: ["SE1", "SE2", "SE3", "SE4"],
  ipOwnership: ["customer", "supplier", "joint", "undefined"],
  presignNominal: ["new_acquisition", "EC", "mixed"],
  presignStatus: ["draft", "in_signature", "signed_ready", "cancelled"],
  contractStatus: ["active", "voided"],
  ocrStatus: ["not_run", "running", "done", "failed"],
  permissionActions: ["view", "add", "change", "delete", "export", "run_sync", "approve_transition"],
};

const modules = {
  salesforce: {
    label: "Salesforce 快照",
    dataKey: "snapshots",
    listColumns: [
      { key: "pid", label: "PID" },
      { key: "configuration", label: "配置" },
      { key: "customer", label: "客户" },
      { key: "productType", label: "产品" },
      { key: "se_status", label: "SE 状态" },
      { key: "otp_amounts_text", label: "OTP 金额" },
      { key: "otc_amounts_text", label: "OTC 金额" },
      { key: "snapshot_date", label: "快照日期" },
    ],
    formFields: [
      "pid",
      "configuration_id",
      "customer_id",
      "product_type_id",
      "sales_region_id",
      "se_status",
      "otp_amounts_text",
      "otc_amounts_text",
      "snapshot_date",
    ],
    filters: ["pid", "configuration_id", "customer_id", "product_type_id", "sales_region_id", "se_status"],
    canEdit: (user) => hasPermission(user, "salesforce", "change"),
  },
  pms: {
    label: "PMS 项目清单",
    dataKey: "pmsProjects",
    listColumns: [
      { key: "pms_id", label: "PMS ID" },
      { key: "project_name", label: "项目名称" },
      { key: "customer", label: "客户" },
      { key: "productType", label: "产品" },
      { key: "project_complexity", label: "复杂度" },
      { key: "project_phase", label: "阶段" },
      { key: "sales_region", label: "销售区域" },
    ],
    filters: ["pms_id", "project_name", "customer_id", "product_type_id", "sales_region_id", "project_complexity", "project_phase"],
    canEdit: (user) => hasPermission(user, "pms", "change"),
  },
  presign: {
    label: "代签合同/协议映射",
    dataKey: "preSignContracts",
    listColumns: [
      { key: "customer", label: "客户" },
      { key: "customer_contract_no", label: "客户合同号" },
      { key: "contract_title", label: "合同标题" },
      { key: "productType", label: "产品" },
      { key: "customer_vehicle_project_name", label: "车型项目" },
      { key: "project_nominal_type", label: "名义类型" },
      { key: "ocr_status", label: "OCR 状态" },
      { key: "status", label: "状态" },
    ],
    filters: ["customer_id", "customer_contract_no", "contract_title", "product_type_id", "customer_vehicle_project_name", "project_nominal_type", "ocr_status"],
    canEdit: (user) => hasPermission(user, "presign", "change"),
  },
  contract: {
    label: "合同管理",
    dataKey: "contracts",
    listColumns: [
      { key: "internal_contract_id", label: "内部合同号" },
      { key: "customer", label: "客户" },
      { key: "customer_contract_no", label: "客户合同号" },
      { key: "contract_title", label: "合同标题" },
      { key: "productType", label: "产品" },
      { key: "signed_date", label: "签署日期" },
      { key: "derivation_status", label: "年度导出状态" },
      { key: "status", label: "状态" },
    ],
    filters: ["customer_id", "product_type_id", "internal_contract_id", "customer_contract_no", "signed_date", "derivation_status"],
    canEdit: (user) => hasPermission(user, "contract", "change"),
  },
  invoice: {
    label: "回款/发票跟踪",
    dataKey: "invoices",
    listColumns: [
      { key: "internal_contract_id", label: "合同号" },
      { key: "customer", label: "客户" },
      { key: "productType", label: "产品" },
      { key: "received_date", label: "回款日期" },
      { key: "received_amount", label: "金额" },
      { key: "currency", label: "币种" },
      { key: "received_year", label: "年度" },
    ],
    formFields: [
      "contract_id",
      "received_date",
      "received_amount",
      "currency",
      "payment_reference_no",
      "note",
    ],
    filters: ["customer_id", "product_type_id", "received_year", "received_month", "received_date"],
    canEdit: (user) => hasPermission(user, "invoice", "change"),
  },
  master: {
    label: "主数据",
    dataKey: "master",
    listColumns: [],
    filters: [],
  },
  users: {
    label: "用户与组",
    dataKey: "users",
    listColumns: [],
    filters: [],
  },
};

function seedData() {
  state.groups = [
    { id: 1, name: "Admin" },
    { id: 2, name: "CA_Viewer" },
    { id: 3, name: "CM" },
    { id: 4, name: "PMO/PJM" },
    { id: 5, name: "Data_Operator" },
  ];
  state.users = [
    { id: 1, username: "admin", display_name: "管理员", email: "admin@otp.com", is_active: true, group_id: 1 },
    { id: 2, username: "ca_view", display_name: "CA 观察员", email: "ca@otp.com", is_active: true, group_id: 2 },
    { id: 3, username: "cm_liu", display_name: "合同经理 刘", email: "cm@otp.com", is_active: true, group_id: 3 },
    { id: 4, username: "pmo_chen", display_name: "PJM 陈", email: "pmo@otp.com", is_active: true, group_id: 4 },
    { id: 5, username: "data_ops", display_name: "数据运营", email: "ops@otp.com", is_active: true, group_id: 5 },
  ];

  state.master.salesRegions = [
    { id: 1, name: "华北", active: true },
    { id: 2, name: "华东", active: true },
    { id: 3, name: "华南", active: true },
    { id: 4, name: "欧洲", active: true },
  ];
  state.master.productTypes = [
    { id: 1, name: "IPB", active: true },
    { id: 2, name: "DPB", active: true },
    { id: 3, name: "ESP", active: true },
    { id: 4, name: "BWA", active: true },
  ];
  state.master.customers = Array.from({ length: 12 }, (_, i) => {
    const region = state.master.salesRegions[i % state.master.salesRegions.length];
    return {
      id: i + 1,
      legal_name: `客户集团 ${i + 1}`,
      short_name: `客户${i + 1}`,
      customer_group: i % 2 === 0 ? "重点" : "普通",
      sales_region_id: region.id,
      status: i % 4 === 0 ? "inactive" : "active",
      notes: "长期合作客户",
    };
  });
  state.master.configurations = Array.from({ length: 8 }, (_, i) => {
    const product = state.master.productTypes[i % state.master.productTypes.length];
    return { id: i + 1, name: `配置-${product.name}-${i + 1}`, product_type_id: product.id };
  });

  state.customerAssignments = [
    { id: 1, user_id: 3, customer_id: 1, role_on_customer: "CM", active: true },
    { id: 2, user_id: 3, customer_id: 2, role_on_customer: "CM", active: true },
    { id: 3, user_id: 3, customer_id: 3, role_on_customer: "backup", active: true },
  ];

  state.snapshots = Array.from({ length: 22 }, (_, i) => {
    const customer = state.master.customers[i % state.master.customers.length];
    const product = state.master.productTypes[i % state.master.productTypes.length];
    const region = state.master.salesRegions[customer.sales_region_id - 1];
    const config = state.master.configurations[i % state.master.configurations.length];
    return {
      id: i + 1,
      pid: `SF-PID-${1000 + i}`,
      configuration_id: config.id,
      customer_id: customer.id,
      product_type_id: product.id,
      sales_region_id: region.id,
      se_status: enums.seStatus[i % enums.seStatus.length],
      otp_amounts_text: `2024: ${120 + i}万\n2025: ${150 + i}万`,
      otc_amounts_text: `2024: ${80 + i}万\n2025: ${90 + i}万`,
      snapshot_date: `2024-0${(i % 9) + 1}-15`,
      source_batch_id: 1,
      created_at: "2024-01-01",
      updated_at: "2024-02-01",
      is_deleted: false,
    };
  });

  state.pmsProjects = Array.from({ length: 20 }, (_, i) => {
    const customer = state.master.customers[i % state.master.customers.length];
    const product = state.master.productTypes[i % state.master.productTypes.length];
    const region = state.master.salesRegions[customer.sales_region_id - 1];
    return {
      id: i + 1,
      pms_id: `PMS-${2000 + i}`,
      project_name: `项目 ${i + 1}`,
      customer_id: customer.id,
      product_type_id: product.id,
      sales_region_id: region.id,
      project_complexity: enums.projectComplexity[i % enums.projectComplexity.length],
      project_phase: enums.projectPhase[i % enums.projectPhase.length],
      mcrl0: `M0-${i}`,
      mcrl1: `M1-${i}`,
      mcrl2: `M2-${i}`,
      source_batch_id: 1,
      created_at: "2024-01-10",
      updated_at: "2024-02-05",
      is_deleted: false,
    };
  });
  state.pmsMilestones = state.pmsProjects.flatMap((project, i) => {
    return [
      {
        id: i * 3 + 1,
        pms_project_id: project.id,
        milestone_name: "SOP",
        planned_date: `2025-0${(i % 9) + 1}-20`,
        sequence: 1,
      },
      {
        id: i * 3 + 2,
        pms_project_id: project.id,
        milestone_name: "PPAP",
        planned_date: `2024-1${(i % 2) + 1}-15`,
        sequence: 2,
      },
      {
        id: i * 3 + 3,
        pms_project_id: project.id,
        milestone_name: "EV",
        planned_date: `2024-0${(i % 9) + 1}-05`,
        sequence: 3,
      },
    ];
  });

  state.preSignContracts = Array.from({ length: 10 }, (_, i) => {
    const customer = state.master.customers[i % state.master.customers.length];
    const product = state.master.productTypes[i % state.master.productTypes.length];
    return {
      id: i + 1,
      customer_id: customer.id,
      product_type_id: product.id,
      sales_region_id: customer.sales_region_id,
      customer_contract_no: `CUS-CT-${3000 + i}`,
      contract_title: `代签合同 ${i + 1}`,
      customer_vehicle_project_name: `车型项目-${i + 1}`,
      development_fee_name: "开发费",
      development_reason: "平台升级",
      total_amount_excl_tax: 120 + i,
      total_amount_incl_tax: 135 + i,
      payment_terms_text: "30%预付款，70%验收",
      ip_ownership: enums.ipOwnership[i % enums.ipOwnership.length],
      ip_notes: "IP 条款说明",
      source_file_name: `presign_${i + 1}.pdf`,
      source_file_type: "pdf",
      source_file_url: "#",
      ocr_status: enums.ocrStatus[i % enums.ocrStatus.length],
      ocr_extracted_json: i % 3 === 0 ? "{\"ocr\":\"sample\"}" : "",
      ocr_last_run_at: "2024-02-20",
      project_nominal_type: enums.presignNominal[i % enums.presignNominal.length],
      status: enums.presignStatus[i % enums.presignStatus.length],
      is_deleted: false,
      created_at: "2024-02-10",
      updated_at: "2024-02-18",
    };
  });

  state.preSignLinks = state.preSignContracts.flatMap((contract, i) => {
    const pmsProject = state.pmsProjects[i % state.pmsProjects.length];
    const snapshot = state.snapshots[i % state.snapshots.length];
    const links = [
      {
        id: i * 2 + 1,
        presign_contract_id: contract.id,
        link_type: "pms",
        pms_id: pmsProject.pms_id,
        pms_project_id: pmsProject.id,
        comment: "主项目映射",
      },
    ];
    if (contract.project_nominal_type !== "EC") {
      links.push({
        id: i * 2 + 2,
        presign_contract_id: contract.id,
        link_type: "salesforce",
        pid: snapshot.pid,
        configuration_id: snapshot.configuration_id,
        snapshot_ref_id: snapshot.id,
        comment: "Salesforce 引用",
      });
    }
    return links;
  });

  state.contracts = Array.from({ length: 8 }, (_, i) => {
    const pre = state.preSignContracts[i];
    return {
      id: i + 1,
      internal_contract_id: `CT-2024-${String(i + 1).padStart(5, "0")}`,
      presign_contract_id: pre.id,
      customer_id: pre.customer_id,
      product_type_id: pre.product_type_id,
      sales_region_id: pre.sales_region_id,
      customer_contract_no: pre.customer_contract_no,
      contract_title: pre.contract_title,
      signed_file_name: `signed_${i + 1}.pdf`,
      signed_file_url: "#",
      signed_date: `2024-0${(i % 9) + 1}-18`,
      archive_date: `2024-0${(i % 9) + 1}-20`,
      total_amount_excl_tax: pre.total_amount_excl_tax,
      total_amount_incl_tax: pre.total_amount_incl_tax,
      payment_terms_text: pre.payment_terms_text,
      ip_ownership: pre.ip_ownership,
      ip_notes: pre.ip_notes,
      derived_payment_years_text: "2024, 2025",
      derivation_status: i % 3 === 0 ? "missing_pms_milestone" : "ok",
      status: "active",
      is_deleted: false,
      created_at: "2024-03-01",
      updated_at: "2024-03-10",
    };
  });

  state.invoices = Array.from({ length: 30 }, (_, i) => {
    const contract = state.contracts[i % state.contracts.length];
    return {
      id: i + 1,
      contract_id: contract.id,
      customer_id: contract.customer_id,
      product_type_id: contract.product_type_id,
      sales_region_id: contract.sales_region_id,
      received_date: `2024-0${(i % 9) + 1}-0${(i % 7) + 1}`,
      received_amount: 20 + i,
      currency: "CNY",
      received_year: 2024,
      received_month: (i % 12) + 1,
      payment_reference_no: `PAY-${5000 + i}`,
      note: "回款记录",
      created_by: "cm_liu",
      created_at: "2024-03-01",
      updated_at: "2024-03-10",
      is_deleted: false,
    };
  });

  state.syncJobs = [
    { id: 1, job_type: "salesforce", last_run_at: "2024-03-20 09:00", last_status: "success", triggered_by: "data_ops", records_added: 12, records_updated: 8 },
    { id: 2, job_type: "pms", last_run_at: "2024-03-18 10:30", last_status: "success", triggered_by: "data_ops", records_added: 10, records_updated: 6 },
  ];
  state.syncLogs = [
    { id: 1, sync_job_id: 1, timestamp: "2024-03-20 09:00", level: "INFO", message: "Salesforce 同步完成" },
    { id: 2, sync_job_id: 2, timestamp: "2024-03-18 10:30", level: "INFO", message: "PMS 同步完成" },
  ];

  state.auditLogs = [
    { id: 1, entity_type: "Contract", entity_id: 1, action: "create", actor_user_id: 3, timestamp: "2024-03-01 09:20", changed_fields_json: "{}" },
    { id: 2, entity_type: "InvoiceReceipt", entity_id: 1, action: "create", actor_user_id: 3, timestamp: "2024-03-02 11:00", changed_fields_json: "{}" },
  ];
}

function hasPermission(user, moduleId, action) {
  const groupName = getGroup(user.group_id).name;
  if (groupName === "Admin") return true;
  if (groupName === "CA_Viewer") return action === "view" || action === "export";
  if (groupName === "CM") {
    if (["presign", "contract", "invoice"].includes(moduleId)) {
      return ["view", "add", "change", "delete", "export", "approve_transition"].includes(action);
    }
    if (["salesforce", "pms"].includes(moduleId)) {
      return action === "view" || action === "export";
    }
  }
  if (groupName === "PMO/PJM") {
    if (moduleId === "pms") {
      return ["view", "change", "export"].includes(action);
    }
    if (["contract", "invoice"].includes(moduleId)) {
      return action === "view";
    }
  }
  if (groupName === "Data_Operator") {
    if (["master", "salesforce", "pms"].includes(moduleId)) {
      return ["view", "add", "change", "delete", "export", "run_sync"].includes(action);
    }
    if (moduleId === "sync") return action === "run_sync" || action === "view";
  }
  return action === "view";
}

function getGroup(groupId) {
  return state.groups.find((g) => g.id === groupId) || { id: 0, name: "Unknown" };
}

function getUser() {
  return state.users.find((u) => u.id === state.currentUserId);
}

function renderNav() {
  const nav = document.getElementById("nav");
  nav.innerHTML = "";
  state.navSections.forEach((section) => {
    const title = document.createElement("div");
    title.className = "subtle";
    title.textContent = section.title;
    nav.appendChild(title);
    section.items.forEach((item) => {
      const link = document.createElement("a");
      link.href = item.route;
      link.textContent = item.label;
      link.dataset.route = item.route;
      nav.appendChild(link);
    });
  });
}

function setActiveNav() {
  const links = document.querySelectorAll(".sidebar a");
  links.forEach((link) => {
    link.classList.toggle("active", link.dataset.route === location.hash);
  });
}

function getCustomer(customerId) {
  return state.master.customers.find((c) => c.id === customerId);
}

function getProduct(productId) {
  return state.master.productTypes.find((p) => p.id === productId);
}

function getRegion(regionId) {
  return state.master.salesRegions.find((r) => r.id === regionId);
}

function getConfiguration(configId) {
  return state.master.configurations.find((c) => c.id === configId);
}

function listData(moduleId) {
  if (moduleId === "master" || moduleId === "users") return [];
  return state[modules[moduleId].dataKey] || [];
}

function applyPermissionScope(moduleId, records) {
  const user = getUser();
  const group = getGroup(user.group_id).name;
  if (group === "Admin" || group === "CA_Viewer" || group === "Data_Operator") return records;
  if (group === "CM") {
    const assignedCustomers = state.customerAssignments.filter((a) => a.user_id === user.id && a.active).map((a) => a.customer_id);
    return records.filter((record) => !record.customer_id || assignedCustomers.includes(record.customer_id));
  }
  return records;
}

function renderList(moduleId) {
  const module = modules[moduleId];
  const content = document.getElementById("content");
  const user = getUser();
  const records = applyPermissionScope(moduleId, listData(moduleId));
  const filterPrefs = state.ui.filterPrefs[moduleId] || {};
  const search = filterPrefs.search || "";

  const filtered = records.filter((record) => {
    if (search && !JSON.stringify(record).toLowerCase().includes(search.toLowerCase())) return false;
    return Object.entries(filterPrefs).every(([key, value]) => {
      if (!value || key === "search") return true;
      return String(record[key] || "").includes(value);
    });
  });

  const columns = module.listColumns;
  const columnPrefs = state.ui.columnPrefs[moduleId] || columns.map((c) => c.key);
  const visibleColumns = columns.filter((c) => columnPrefs.includes(c.key));

  content.innerHTML = `
    <div class="panel">
      <div class="page-title">${module.label}</div>
      <div class="filters">
        <input placeholder="关键字搜索" data-filter="search" value="${search}" />
        ${module.filters
          .map((filter) => `
            <input placeholder="过滤 ${filter}" data-filter="${filter}" value="${filterPrefs[filter] || ""}" />
          `)
          .join("")}
      </div>
      <div class="bulk-actions">
        <button id="bulkDelete">批量软删除</button>
        <button id="bulkRestore">批量恢复</button>
        <button id="bulkExport">批量导出</button>
        ${moduleId === "invoice" ? '<button id="bulkImport">批量导入(模拟)</button>' : ""}
        ${moduleId === "presign" ? '<button id="runOcr">运行 OCR</button>' : ""}
      </div>
      <div class="column-toggle">
        ${columns
          .map(
            (col) => `
          <label><input type="checkbox" data-column="${col.key}" ${columnPrefs.includes(col.key) ? "checked" : ""} /> ${col.label}</label>
        `
          )
          .join("")}
      </div>
      <div class="form-actions">
        ${hasPermission(user, moduleId, "add") ? `<button class="primary" id="createBtn">新建</button>` : ""}
        ${moduleId === "contract" ? `<button id="wizardBtn">合同创建向导</button>` : ""}
      </div>
    </div>
    <div class="panel">
      <table class="table">
        <thead>
          <tr>
            <th><input type="checkbox" id="selectAll" /></th>
            ${visibleColumns.map((col) => `<th>${col.label}</th>`).join("")}
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${filtered
            .map((record) => {
              const rowClass = record.is_deleted ? "deleted" : "";
              return `
              <tr class="${rowClass}">
                <td><input type="checkbox" class="row-select" data-id="${record.id}" /></td>
                ${visibleColumns
                  .map((col) => `<td>${formatCell(moduleId, record, col.key)}</td>`)
                  .join("")}
                <td>
                  <button data-action="view" data-id="${record.id}">查看</button>
                  ${hasPermission(user, moduleId, "change") ? `<button data-action="edit" data-id="${record.id}">编辑</button>` : ""}
                  ${hasPermission(user, moduleId, "delete") ? `<button class="danger" data-action="delete" data-id="${record.id}">删除</button>` : ""}
                </td>
              </tr>`;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;

  content.querySelectorAll("[data-filter]").forEach((input) => {
    input.addEventListener("input", (e) => {
      const key = e.target.dataset.filter;
      state.ui.filterPrefs[moduleId] = { ...filterPrefs, [key]: e.target.value };
      renderList(moduleId);
    });
  });

  content.querySelectorAll("[data-column]").forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const colKey = e.target.dataset.column;
      const current = new Set(columnPrefs);
      if (e.target.checked) current.add(colKey);
      else current.delete(colKey);
      state.ui.columnPrefs[moduleId] = Array.from(current);
      renderList(moduleId);
    });
  });

  if (content.querySelector("#createBtn")) {
    content.querySelector("#createBtn").addEventListener("click", () => {
      location.hash = `#/module/${moduleId}/new`;
    });
  }

  if (content.querySelector("#wizardBtn")) {
    content.querySelector("#wizardBtn").addEventListener("click", () => {
      location.hash = "#/contracts/wizard";
    });
  }

  content.querySelectorAll("button[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      const id = Number(btn.dataset.id);
      if (action === "view") location.hash = `#/module/${moduleId}/detail/${id}`;
      if (action === "edit") location.hash = `#/module/${moduleId}/edit/${id}`;
      if (action === "delete") softDelete(moduleId, id);
    });
  });

  const selectAll = content.querySelector("#selectAll");
  selectAll?.addEventListener("change", (e) => {
    content.querySelectorAll(".row-select").forEach((cb) => {
      cb.checked = e.target.checked;
    });
  });

  content.querySelector("#bulkDelete")?.addEventListener("click", () => bulkAction(moduleId, "delete"));
  content.querySelector("#bulkRestore")?.addEventListener("click", () => bulkAction(moduleId, "restore"));
  content.querySelector("#bulkExport")?.addEventListener("click", () => alert("已生成 CSV 导出（模拟）"));
  content.querySelector("#bulkImport")?.addEventListener("click", () => simulateInvoiceImport());
  content.querySelector("#runOcr")?.addEventListener("click", () => runOcrForSelected());
}

function formatCell(moduleId, record, key) {
  if (key === "customer") return getCustomer(record.customer_id)?.short_name || "";
  if (key === "productType") return getProduct(record.product_type_id)?.name || "";
  if (key === "sales_region") return getRegion(record.sales_region_id)?.name || "";
  if (key === "configuration") return getConfiguration(record.configuration_id)?.name || record.configuration_name || "";
  if (key === "internal_contract_id") return record.internal_contract_id || (getContract(record.contract_id)?.internal_contract_id ?? "");
  return record[key] ?? "";
}

function bulkAction(moduleId, action) {
  const ids = Array.from(document.querySelectorAll(".row-select:checked")).map((cb) => Number(cb.dataset.id));
  ids.forEach((id) => {
    if (action === "delete") softDelete(moduleId, id);
    if (action === "restore") restoreRecord(moduleId, id);
  });
}

function softDelete(moduleId, id) {
  const records = listData(moduleId);
  const record = records.find((r) => r.id === id);
  if (!record) return;
  record.is_deleted = true;
  record.deleted_at = new Date().toISOString();
  record.deleted_by = getUser().username;
  addAuditLog(moduleId, id, "delete");
  renderList(moduleId);
}

function restoreRecord(moduleId, id) {
  const records = listData(moduleId);
  const record = records.find((r) => r.id === id);
  if (!record) return;
  record.is_deleted = false;
  record.deleted_at = null;
  record.deleted_by = null;
  addAuditLog(moduleId, id, "restore");
  renderList(moduleId);
}

function addAuditLog(moduleId, entityId, action) {
  state.auditLogs.unshift({
    id: state.auditLogs.length + 1,
    entity_type: moduleId,
    entity_id: entityId,
    action,
    actor_user_id: getUser().id,
    timestamp: new Date().toLocaleString(),
    changed_fields_json: "{}",
  });
}

function renderDetail(moduleId, id) {
  const module = modules[moduleId];
  const record = listData(moduleId).find((r) => r.id === id);
  const content = document.getElementById("content");
  if (!record) {
    content.innerHTML = "<div class='panel'>记录不存在</div>";
    return;
  }
  const auditLogs = state.auditLogs.filter((log) => log.entity_type === moduleId && log.entity_id === id).slice(0, 10);
  content.innerHTML = `
    <div class="panel">
      <div class="page-title">${module.label} / 详情</div>
      <div class="form-actions">
        <button onclick="location.hash='#/module/${moduleId}'">返回列表</button>
        ${hasPermission(getUser(), moduleId, "change") ? `<button class="primary" onclick="location.hash='#/module/${moduleId}/edit/${id}'">编辑</button>` : ""}
      </div>
    </div>
    <div class="panel">
      <div class="form-grid">
        ${Object.entries(record)
          .map(([key, value]) => {
            if (key === "is_deleted") return "";
            return `<div><div class="subtle">${key}</div><div>${value ?? ""}</div></div>`;
          })
          .join("")}
      </div>
    </div>
    <div class="panel">
      <div class="page-title">关联对象</div>
      ${renderRelated(moduleId, record)}
    </div>
    <div class="panel">
      <div class="page-title">审计日志</div>
      <div class="audit-log">
        ${auditLogs.map((log) => `<div>${log.timestamp} · ${getUserById(log.actor_user_id)?.display_name || ""} · ${log.action}</div>`).join("")}
      </div>
    </div>
  `;
}

function renderRelated(moduleId, record) {
  if (moduleId === "presign") {
    const links = state.preSignLinks.filter((link) => link.presign_contract_id === record.id);
    return `
      <table class="table">
        <thead><tr><th>类型</th><th>PID/PMS</th><th>配置</th><th>备注</th></tr></thead>
        <tbody>
          ${links
            .map(
              (link) => `
            <tr>
              <td>${link.link_type}</td>
              <td>${link.link_type === "pms" ? link.pms_id : link.pid}</td>
              <td>${link.configuration_id ? getConfiguration(link.configuration_id)?.name : ""}</td>
              <td>${link.comment || ""}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  }
  if (moduleId === "contract") {
    const invoices = state.invoices.filter((inv) => inv.contract_id === record.id);
    return `
      <table class="table">
        <thead><tr><th>回款日期</th><th>金额</th><th>参考号</th></tr></thead>
        <tbody>
          ${invoices
            .map(
              (inv) => `
            <tr>
              <td>${inv.received_date}</td>
              <td>${inv.received_amount}</td>
              <td>${inv.payment_reference_no}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  }
  if (moduleId === "pms") {
    const milestones = state.pmsMilestones.filter((m) => m.pms_project_id === record.id);
    return `
      <table class="table">
        <thead><tr><th>里程碑</th><th>计划日期</th></tr></thead>
        <tbody>
          ${milestones
            .map(
              (ms) => `
            <tr>
              <td>${ms.milestone_name}</td>
              <td>${ms.planned_date || ""}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  }
  return "<div class='subtle'>暂无关联对象</div>";
}

function renderForm(moduleId, id = null) {
  const module = modules[moduleId];
  const content = document.getElementById("content");
  const record = id ? listData(moduleId).find((r) => r.id === id) : null;
  const isEdit = Boolean(record);

  if (moduleId === "presign") {
    return renderPreSignForm(record);
  }
  if (moduleId === "contract" && !record) {
    location.hash = "#/contracts/wizard";
    return;
  }
  if (moduleId === "pms") {
    return renderPmsForm(record);
  }

  content.innerHTML = `
    <div class="panel">
      <div class="page-title">${module.label} / ${isEdit ? "编辑" : "新建"}</div>
      <form id="recordForm" class="form-grid"></form>
      <div class="form-actions">
        <button type="button" onclick="location.hash='#/module/${moduleId}'">取消</button>
        <button class="primary" id="saveBtn">保存</button>
      </div>
    </div>
  `;
  const form = content.querySelector("#recordForm");
  const fields = module.formFields || Object.keys(record || modules[moduleId].listColumns.reduce((acc, col) => ({ ...acc, [col.key]: "" }), {}));
  fields.forEach((key) => {
    if (key === "id" || key === "is_deleted") return;
    const value = record ? record[key] : "";
    form.insertAdjacentHTML("beforeend", renderFieldInput(key, value));
  });
  content.querySelector("#saveBtn").addEventListener("click", () => {
    const formData = new FormData(form.closest("form") || form);
    const payload = normalizePayload(Object.fromEntries(formData.entries()));
    if (isEdit) {
      Object.assign(record, payload);
      addAuditLog(moduleId, record.id, "update");
    } else {
      payload.id = listData(moduleId).length + 1;
      payload.is_deleted = false;
      listData(moduleId).push(payload);
      addAuditLog(moduleId, payload.id, "create");
    }
    location.hash = `#/module/${moduleId}`;
  });
}

function renderPreSignForm(record) {
  const content = document.getElementById("content");
  const isEdit = Boolean(record);
  const links = record ? state.preSignLinks.filter((l) => l.presign_contract_id === record.id) : [];
  content.innerHTML = `
    <div class="panel">
      <div class="page-title">代签合同/协议 / ${isEdit ? "编辑" : "新建"}</div>
      <form id="presignForm">
        <div class="form-grid">
          ${renderSelect("customer_id", "客户", state.master.customers, record?.customer_id)}
          ${renderSelect("product_type_id", "产品类型", state.master.productTypes, record?.product_type_id)}
          ${renderSelect("sales_region_id", "销售区域", state.master.salesRegions, record?.sales_region_id)}
          <label><div class="subtle">客户合同号</div><input name="customer_contract_no" value="${record?.customer_contract_no || ""}" required /></label>
          <label><div class="subtle">合同标题</div><input name="contract_title" value="${record?.contract_title || ""}" required /></label>
          <label><div class="subtle">车型项目</div><input name="customer_vehicle_project_name" value="${record?.customer_vehicle_project_name || ""}" /></label>
          <label><div class="subtle">开发费名称</div><input name="development_fee_name" value="${record?.development_fee_name || ""}" /></label>
          <label><div class="subtle">开发原因</div><input name="development_reason" value="${record?.development_reason || ""}" /></label>
          <label><div class="subtle">不含税金额</div><input name="total_amount_excl_tax" type="number" value="${record?.total_amount_excl_tax || ""}" /></label>
          <label><div class="subtle">含税金额</div><input name="total_amount_incl_tax" type="number" value="${record?.total_amount_incl_tax || ""}" /></label>
          <label><div class="subtle">付款条款</div><textarea name="payment_terms_text">${record?.payment_terms_text || ""}</textarea></label>
          ${renderSelect("ip_ownership", "IP 归属", enums.ipOwnership, record?.ip_ownership, true)}
          <label><div class="subtle">IP 备注</div><input name="ip_notes" value="${record?.ip_notes || ""}" /></label>
          <label><div class="subtle">文件类型</div><input name="source_file_type" value="${record?.source_file_type || "pdf"}" /></label>
          ${renderSelect("ocr_status", "OCR 状态", enums.ocrStatus, record?.ocr_status, true)}
          ${renderSelect("project_nominal_type", "名义类型", enums.presignNominal, record?.project_nominal_type, true)}
          ${renderSelect("status", "状态", enums.presignStatus, record?.status, true)}
        </div>
        <div class="panel">
          <div class="page-title">项目映射</div>
          <div id="linkRows"></div>
          <button type="button" id="addLink">+ 添加映射</button>
        </div>
      </form>
      <div class="form-actions">
        <button type="button" onclick="location.hash='#/module/presign'">取消</button>
        <button class="primary" id="savePresign">保存</button>
      </div>
      <div class="subtle" id="validationHint"></div>
    </div>
  `;

  const linkRows = content.querySelector("#linkRows");
  const renderLinks = (currentLinks) => {
    linkRows.innerHTML = currentLinks
      .map(
        (link, idx) => `
        <div class="form-grid" data-link-index="${idx}">
          ${renderSelect("link_type", "类型", ["pms", "salesforce"], link.link_type, true)}
          <label><div class="subtle">PID/PMS ID</div><input name="pid_or_pms" value="${link.link_type === "pms" ? link.pms_id || "" : link.pid || ""}" /></label>
          <label><div class="subtle">配置</div><input name="configuration_id" value="${link.configuration_id || ""}" /></label>
          <label><div class="subtle">备注</div><input name="comment" value="${link.comment || ""}" /></label>
        </div>
      `
      )
      .join("");
  };
  let currentLinks = links.length ? links.map((l) => ({ ...l })) : [{ link_type: "pms" }];
  renderLinks(currentLinks);

  content.querySelector("#addLink").addEventListener("click", () => {
    currentLinks.push({ link_type: "pms" });
    renderLinks(currentLinks);
  });

  content.querySelector("#savePresign").addEventListener("click", () => {
    const form = content.querySelector("#presignForm");
    const formData = new FormData(form);
    const payload = normalizePayload(Object.fromEntries(formData.entries()));

    const parsedLinks = Array.from(linkRows.querySelectorAll("[data-link-index]")).map((row) => {
      const linkType = row.querySelector("select[name='link_type']")?.value || "pms";
      const pidOrPms = row.querySelector("input[name='pid_or_pms']")?.value;
      const configurationId = row.querySelector("input[name='configuration_id']")?.value;
      return {
        link_type: linkType,
        pid: linkType === "salesforce" ? pidOrPms : null,
        pms_id: linkType === "pms" ? pidOrPms : null,
        configuration_id: configurationId ? Number(configurationId) : null,
        comment: row.querySelector("input[name='comment']")?.value || "",
      };
    });

    const hasPms = parsedLinks.some((l) => l.link_type === "pms" && l.pms_id);
    const needSalesforce = ["new_acquisition", "mixed"].includes(payload.project_nominal_type);
    const hasSalesforce = parsedLinks.some((l) => l.link_type === "salesforce" && l.pid);

    if (!hasPms) {
      content.querySelector("#validationHint").textContent = "校验失败：必须至少映射 1 条 PMS 项目。";
      return;
    }
    if (needSalesforce && !hasSalesforce) {
      content.querySelector("#validationHint").textContent = "校验失败：名义类型为新开发/混合时必须映射 Salesforce 项目。";
      return;
    }

    if (isEdit) {
      Object.assign(record, payload);
      addAuditLog("presign", record.id, "update");
      state.preSignLinks = state.preSignLinks.filter((l) => l.presign_contract_id !== record.id);
      parsedLinks.forEach((link) => {
        state.preSignLinks.push({
          ...link,
          id: state.preSignLinks.length + 1,
          presign_contract_id: record.id,
        });
      });
    } else {
      const newId = state.preSignContracts.length + 1;
      state.preSignContracts.push({ id: newId, ...payload, is_deleted: false });
      parsedLinks.forEach((link) => {
        state.preSignLinks.push({
          ...link,
          id: state.preSignLinks.length + 1,
          presign_contract_id: newId,
        });
      });
      addAuditLog("presign", newId, "create");
    }
    location.hash = "#/module/presign";
  });
}

function renderPmsForm(record) {
  const content = document.getElementById("content");
  const isEdit = Boolean(record);
  const milestones = record ? state.pmsMilestones.filter((m) => m.pms_project_id === record.id) : [];
  content.innerHTML = `
    <div class="panel">
      <div class="page-title">PMS 项目 / ${isEdit ? "编辑" : "新建"}</div>
      <form id="pmsForm">
        <div class="form-grid">
          <label><div class="subtle">PMS ID</div><input name="pms_id" value="${record?.pms_id || ""}" /></label>
          <label><div class="subtle">项目名称</div><input name="project_name" value="${record?.project_name || ""}" /></label>
          ${renderSelect("customer_id", "客户", state.master.customers, record?.customer_id)}
          ${renderSelect("product_type_id", "产品类型", state.master.productTypes, record?.product_type_id)}
          ${renderSelect("sales_region_id", "销售区域", state.master.salesRegions, record?.sales_region_id)}
          ${renderSelect("project_complexity", "复杂度", enums.projectComplexity, record?.project_complexity, true)}
          ${renderSelect("project_phase", "项目阶段", enums.projectPhase, record?.project_phase, true)}
          <label><div class="subtle">MCRL0</div><input name="mcrl0" value="${record?.mcrl0 || ""}" /></label>
          <label><div class="subtle">MCRL1</div><input name="mcrl1" value="${record?.mcrl1 || ""}" /></label>
          <label><div class="subtle">MCRL2</div><input name="mcrl2" value="${record?.mcrl2 || ""}" /></label>
        </div>
      </form>
      <div class="panel">
        <div class="page-title">里程碑计划</div>
        <div id="milestoneRows"></div>
        <button type="button" id="addMilestone">+ 添加里程碑</button>
      </div>
      <div class="form-actions">
        <button type="button" onclick="location.hash='#/module/pms'">取消</button>
        <button class="primary" id="savePms">保存</button>
      </div>
    </div>
  `;
  const milestoneRows = content.querySelector("#milestoneRows");
  const renderMilestones = (current) => {
    milestoneRows.innerHTML = current
      .map(
        (ms, idx) => `
        <div class="form-grid" data-ms-index="${idx}">
          <label><div class="subtle">里程碑</div><input name="milestone_name" value="${ms.milestone_name || ""}" /></label>
          <label><div class="subtle">计划日期</div><input name="planned_date" value="${ms.planned_date || ""}" /></label>
        </div>
      `
      )
      .join("");
  };
  let currentMilestones = milestones.length ? milestones.map((m) => ({ ...m })) : [{ milestone_name: "SOP" }];
  renderMilestones(currentMilestones);

  content.querySelector("#addMilestone").addEventListener("click", () => {
    currentMilestones.push({ milestone_name: "" });
    renderMilestones(currentMilestones);
  });

  content.querySelector("#savePms").addEventListener("click", () => {
    const form = content.querySelector("#pmsForm");
    const formData = new FormData(form);
    const payload = normalizePayload(Object.fromEntries(formData.entries()));
    if (isEdit) {
      Object.assign(record, payload);
      addAuditLog("pms", record.id, "update");
      state.pmsMilestones = state.pmsMilestones.filter((m) => m.pms_project_id !== record.id);
      currentMilestones = Array.from(milestoneRows.querySelectorAll("[data-ms-index]")).map((row, idx) => {
        return {
          id: state.pmsMilestones.length + idx + 1,
          pms_project_id: record.id,
          milestone_name: row.querySelector("input[name='milestone_name']")?.value || "",
          planned_date: row.querySelector("input[name='planned_date']")?.value || "",
          sequence: idx + 1,
        };
      });
      state.pmsMilestones.push(...currentMilestones);
    } else {
      const newId = state.pmsProjects.length + 1;
      state.pmsProjects.push({ id: newId, ...payload, is_deleted: false });
      const rows = Array.from(milestoneRows.querySelectorAll("[data-ms-index]")).map((row, idx) => {
        return {
          id: state.pmsMilestones.length + idx + 1,
          pms_project_id: newId,
          milestone_name: row.querySelector("input[name='milestone_name']")?.value || "",
          planned_date: row.querySelector("input[name='planned_date']")?.value || "",
          sequence: idx + 1,
        };
      });
      state.pmsMilestones.push(...rows);
      addAuditLog("pms", newId, "create");
    }
    location.hash = "#/module/pms";
  });
}

function renderSelect(name, label, options, selected, isEnum = false) {
  const opts = options
    .map((option) => {
      if (isEnum) {
        return `<option value="${option}" ${option === selected ? "selected" : ""}>${option}</option>`;
      }
      return `<option value="${option.id}" ${option.id === Number(selected) ? "selected" : ""}>${option.name || option.short_name}</option>`;
    })
    .join("");
  return `
    <label>
      <div class="subtle">${label}</div>
      <select name="${name}">${opts}</select>
    </label>
  `;
}

function normalizePayload(payload) {
  Object.keys(payload).forEach((key) => {
    if (key.endsWith("_id")) payload[key] = Number(payload[key]);
    if (key.includes("amount")) payload[key] = Number(payload[key]);
  });
  return payload;
}

function renderFieldInput(key, value) {
  if (key === "customer_id") return renderSelect(key, "客户", state.master.customers, value);
  if (key === "product_type_id") return renderSelect(key, "产品类型", state.master.productTypes, value);
  if (key === "sales_region_id") return renderSelect(key, "销售区域", state.master.salesRegions, value);
  if (key === "configuration_id") return renderSelect(key, "配置", state.master.configurations, value);
  if (key === "se_status") return renderSelect(key, "SE 状态", enums.seStatus, value, true);
  if (key === "contract_id") {
    const options = state.contracts.map((c) => ({ id: c.id, name: c.internal_contract_id }));
    return renderSelect(key, "合同", options, value);
  }
  return `
    <label>
      <div class="subtle">${key}</div>
      <input name="${key}" value="${value ?? ""}" />
    </label>
  `;
}

function renderMasterData() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <div class="panel">
      <div class="page-title">主数据维护</div>
      <div class="grid-2">
        ${renderMasterTable("客户", "customers", state.master.customers, ["short_name", "legal_name", "status"], ["short_name", "legal_name", "status", "customer_group", "sales_region_id"]) }
        ${renderMasterTable("产品类型", "productTypes", state.master.productTypes, ["name", "active"], ["name", "active"]) }
        ${renderMasterTable("销售区域", "salesRegions", state.master.salesRegions, ["name", "active"], ["name", "active"]) }
        ${renderMasterTable("配置", "configurations", state.master.configurations, ["name", "product_type_id"], ["name", "product_type_id"]) }
      </div>
    </div>
  `;

  bindMasterActions();
}

function renderMasterTable(title, key, data, fields, formFields) {
  return `
    <div class="panel">
      <div class="page-title">${title}</div>
      <div class="form-grid">
        ${formFields
          .map(
            (field) => `
            <label>
              <div class="subtle">${field}</div>
              <input data-master-field="${field}" data-master-key="${key}" />
            </label>
          `
          )
          .join("")}
      </div>
      <div class="form-actions">
        <button class="primary" data-master-add="${key}">新增</button>
      </div>
      <table class="table">
        <thead><tr>${fields.map((f) => `<th>${f}</th>`).join("")}<th>操作</th></tr></thead>
        <tbody>
          ${data
            .map(
              (row) => `<tr>${fields
                .map((f) => `<td>${row[f]}</td>`)
                .join("")}<td>
                <button data-master-edit="${key}" data-id="${row.id}">编辑</button>
                <button class="danger" data-master-delete="${key}" data-id="${row.id}">删除</button>
              </td></tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function bindMasterActions() {
  document.querySelectorAll("[data-master-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.masterAdd;
      const inputs = Array.from(document.querySelectorAll(`[data-master-key='${key}']`));
      const payload = inputs.reduce((acc, input) => {
        acc[input.dataset.masterField] = input.value;
        return acc;
      }, {});
      if (!payload.name && !payload.short_name) return;
      payload.id = state.master[key].length + 1;
      state.master[key].push(payload);
      renderMasterData();
    });
  });
  document.querySelectorAll("[data-master-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.masterEdit;
      const id = Number(btn.dataset.id);
      const record = state.master[key].find((r) => r.id === id);
      if (!record) return;
      Object.keys(record).forEach((field) => {
        if (field === "id") return;
        const value = prompt(`编辑 ${field}`, record[field]);
        if (value !== null) record[field] = value;
      });
      renderMasterData();
    });
  });
  document.querySelectorAll("[data-master-delete]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.masterDelete;
      const id = Number(btn.dataset.id);
      state.master[key] = state.master[key].filter((r) => r.id !== id);
      renderMasterData();
    });
  });
}

function renderUsers() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <div class="panel">
      <div class="page-title">用户与组</div>
      <div class="grid-2">
        <div class="panel">
          <div class="page-title">用户列表</div>
          <div class="form-grid">
            <label><div class="subtle">用户名</div><input id="userUsername" /></label>
            <label><div class="subtle">显示名</div><input id="userDisplay" /></label>
            <label><div class="subtle">邮箱</div><input id="userEmail" /></label>
            ${renderSelect("userGroup", "所属组", state.groups, state.groups[0]?.id)}
          </div>
          <div class="form-actions">
            <button class="primary" id="addUser">新增用户</button>
          </div>
          <table class="table">
            <thead><tr><th>用户名</th><th>显示名</th><th>邮箱</th><th>组</th><th>操作</th></tr></thead>
            <tbody>
              ${state.users
                .map(
                  (user) => `
                <tr>
                  <td>${user.username}</td>
                  <td>${user.display_name}</td>
                  <td>${user.email}</td>
                  <td>${getGroup(user.group_id).name}</td>
                  <td>
                    <button data-user-edit="${user.id}">编辑</button>
                    <button class="danger" data-user-delete="${user.id}">删除</button>
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
        <div class="panel">
          <div class="page-title">角色组</div>
          <div class="form-grid">
            <label><div class="subtle">组名</div><input id="groupName" /></label>
          </div>
          <div class="form-actions">
            <button class="primary" id="addGroup">新增组</button>
          </div>
          <table class="table">
            <thead><tr><th>组名</th><th>操作</th></tr></thead>
            <tbody>
              ${state.groups
                .map(
                  (group) => `
                <tr>
                  <td>${group.name}</td>
                  <td>
                    <button data-group-edit="${group.id}">编辑</button>
                    <button class="danger" data-group-delete="${group.id}">删除</button>
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <div class="page-title">客户分配</div>
          <table class="table">
            <thead><tr><th>用户</th><th>客户</th><th>角色</th><th>状态</th></tr></thead>
            <tbody>
              ${state.customerAssignments
                .map(
                  (assignment) => `
                <tr>
                  <td>${getUserById(assignment.user_id)?.display_name || ""}</td>
                  <td>${getCustomer(assignment.customer_id)?.short_name || ""}</td>
                  <td>${assignment.role_on_customer}</td>
                  <td>${assignment.active ? "启用" : "停用"}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  content.querySelector("#addUser").addEventListener("click", () => {
    const username = content.querySelector("#userUsername").value;
    const display = content.querySelector("#userDisplay").value;
    const email = content.querySelector("#userEmail").value;
    const groupId = Number(content.querySelector("select[name='userGroup']").value);
    if (!username) return;
    state.users.push({ id: state.users.length + 1, username, display_name: display, email, is_active: true, group_id: groupId });
    renderUsers();
  });
  content.querySelectorAll("[data-user-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const user = state.users.find((u) => u.id === Number(btn.dataset.userEdit));
      if (!user) return;
      user.display_name = prompt("显示名", user.display_name) ?? user.display_name;
      user.email = prompt("邮箱", user.email) ?? user.email;
      renderUsers();
    });
  });
  content.querySelectorAll("[data-user-delete]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.users = state.users.filter((u) => u.id !== Number(btn.dataset.userDelete));
      renderUsers();
    });
  });
  content.querySelector("#addGroup").addEventListener("click", () => {
    const name = content.querySelector("#groupName").value;
    if (!name) return;
    state.groups.push({ id: state.groups.length + 1, name });
    renderUsers();
  });
  content.querySelectorAll("[data-group-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = state.groups.find((g) => g.id === Number(btn.dataset.groupEdit));
      if (!group) return;
      group.name = prompt("组名", group.name) ?? group.name;
      renderUsers();
    });
  });
  content.querySelectorAll("[data-group-delete]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.groups = state.groups.filter((g) => g.id !== Number(btn.dataset.groupDelete));
      renderUsers();
    });
  });
}

function getUserById(id) {
  return state.users.find((u) => u.id === id);
}

function renderPermissionsMatrix() {
  const content = document.getElementById("content");
  const modulesList = ["salesforce", "pms", "presign", "contract", "invoice", "master", "sync", "dashboard"];
  content.innerHTML = `
    <div class="panel">
      <div class="page-title">权限矩阵</div>
      <table class="table">
        <thead>
          <tr>
            <th>组</th>
            ${modulesList.map((m) => `<th>${modules[m]?.label || m}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${state.groups
            .map(
              (group) => `
            <tr>
              <td>${group.name}</td>
              ${modulesList
                .map((moduleId) => `
                <td>
                  ${enums.permissionActions
                    .map((action) => {
                      const allowed = hasPermission({ group_id: group.id }, moduleId, action);
                      return `<div class="toggle"><input type="checkbox" ${allowed ? "checked" : ""} />${action}</div>`;
                    })
                    .join("")}
                </td>
              `)
                .join("")}
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <div class="subtle">说明：矩阵展示逻辑权限示例；实际后端可按客户与销售区域做对象级过滤。</div>
    </div>
  `;
}

function renderAuditLogs() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <div class="panel">
      <div class="page-title">审计日志</div>
      <table class="table">
        <thead><tr><th>时间</th><th>用户</th><th>对象</th><th>操作</th><th>字段</th></tr></thead>
        <tbody>
          ${state.auditLogs
            .slice(0, 50)
            .map(
              (log) => `
            <tr>
              <td>${log.timestamp}</td>
              <td>${getUserById(log.actor_user_id)?.display_name || ""}</td>
              <td>${log.entity_type}#${log.entity_id}</td>
              <td>${log.action}</td>
              <td>${log.changed_fields_json}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderSyncJobs() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <div class="panel">
      <div class="page-title">同步任务与日志</div>
      <div class="form-actions">
        <button class="primary" id="runSalesforceSync">运行 Salesforce 同步</button>
        <button class="primary" id="runPmsSync">运行 PMS 同步</button>
      </div>
      <table class="table">
        <thead><tr><th>任务</th><th>上次执行</th><th>状态</th><th>新增</th><th>更新</th><th>触发人</th></tr></thead>
        <tbody>
          ${state.syncJobs
            .map(
              (job) => `
            <tr>
              <td>${job.job_type}</td>
              <td>${job.last_run_at}</td>
              <td>${job.last_status}</td>
              <td>${job.records_added}</td>
              <td>${job.records_updated}</td>
              <td>${job.triggered_by}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <div class="page-title">日志</div>
      <table class="table">
        <thead><tr><th>时间</th><th>级别</th><th>信息</th></tr></thead>
        <tbody>
          ${state.syncLogs
            .slice(0, 20)
            .map(
              (log) => `
            <tr>
              <td>${log.timestamp}</td>
              <td>${log.level}</td>
              <td>${log.message}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;

  content.querySelector("#runSalesforceSync").addEventListener("click", () => runSync("salesforce"));
  content.querySelector("#runPmsSync").addEventListener("click", () => runSync("pms"));
}

function runSync(type) {
  const now = new Date().toLocaleString();
  const job = state.syncJobs.find((j) => j.job_type === type);
  if (type === "salesforce") {
    const added = 3;
    const startId = state.snapshots.length + 1;
    for (let i = 0; i < added; i += 1) {
      const customer = state.master.customers[(startId + i) % state.master.customers.length];
      state.snapshots.push({
        id: startId + i,
        pid: `SF-PID-${1200 + i}`,
        configuration_id: state.master.configurations[i % state.master.configurations.length].id,
        customer_id: customer.id,
        product_type_id: state.master.productTypes[i % state.master.productTypes.length].id,
        sales_region_id: customer.sales_region_id,
        se_status: enums.seStatus[i % enums.seStatus.length],
        otp_amounts_text: `2025: ${200 + i}万`,
        otc_amounts_text: `2025: ${120 + i}万`,
        snapshot_date: "2024-04-15",
        source_batch_id: 2,
        created_at: now,
        updated_at: now,
        is_deleted: false,
      });
    }
    job.records_added = added;
  }
  if (type === "pms") {
    const added = 2;
    const startId = state.pmsProjects.length + 1;
    for (let i = 0; i < added; i += 1) {
      const customer = state.master.customers[(startId + i) % state.master.customers.length];
      state.pmsProjects.push({
        id: startId + i,
        pms_id: `PMS-${2500 + i}`,
        project_name: `新增项目 ${i + 1}`,
        customer_id: customer.id,
        product_type_id: state.master.productTypes[i % state.master.productTypes.length].id,
        sales_region_id: customer.sales_region_id,
        project_complexity: enums.projectComplexity[i % enums.projectComplexity.length],
        project_phase: enums.projectPhase[i % enums.projectPhase.length],
        mcrl0: "M0",
        mcrl1: "M1",
        mcrl2: "M2",
        source_batch_id: 2,
        created_at: now,
        updated_at: now,
        is_deleted: false,
      });
    }
    job.records_added = added;
  }
  job.last_run_at = now;
  job.last_status = "success";
  job.triggered_by = getUser().username;
  state.syncLogs.unshift({ id: state.syncLogs.length + 1, sync_job_id: job.id, timestamp: now, level: "INFO", message: `${type} 同步完成` });
  renderSyncJobs();
}

function simulateInvoiceImport() {
  const now = new Date().toISOString().split("T")[0];
  for (let i = 0; i < 3; i += 1) {
    const contract = state.contracts[i % state.contracts.length];
    state.invoices.push({
      id: state.invoices.length + 1,
      contract_id: contract.id,
      customer_id: contract.customer_id,
      product_type_id: contract.product_type_id,
      sales_region_id: contract.sales_region_id,
      received_date: now,
      received_amount: 50 + i,
      currency: "CNY",
      received_year: 2024,
      received_month: new Date().getMonth() + 1,
      payment_reference_no: `IMP-${6000 + i}`,
      note: "批量导入",
      created_by: getUser().username,
      created_at: now,
      updated_at: now,
      is_deleted: false,
    });
  }
  renderList("invoice");
}

function runOcrForSelected() {
  const ids = Array.from(document.querySelectorAll(".row-select:checked")).map((cb) => Number(cb.dataset.id));
  ids.forEach((id) => {
    const record = state.preSignContracts.find((r) => r.id === id);
    if (record) {
      record.ocr_status = "done";
      record.ocr_extracted_json = "{\"total_amount\":\"模拟识别\"}";
      record.ocr_last_run_at = new Date().toLocaleString();
    }
  });
  renderList("presign");
}

function renderContractWizard() {
  const content = document.getElementById("content");
  const availablePresigns = state.preSignContracts.filter((p) => p.status === "signed_ready" && !state.contracts.some((c) => c.presign_contract_id === p.id));
  content.innerHTML = `
    <div class="panel">
      <div class="page-title">合同创建向导</div>
      <div class="subtle">选择 1 条已准备签署的代签合同</div>
      <select id="presignSelect">
        <option value="">请选择</option>
        ${availablePresigns
          .map(
            (p) => `<option value="${p.id}">${p.customer_contract_no} - ${p.contract_title}</option>`
          )
          .join("")}
      </select>
      <label><div class="subtle">上传签署文件</div><input id="signedFile" placeholder="signed_file.pdf" /></label>
      <div class="form-actions">
        <button onclick="location.hash='#/module/contract'">取消</button>
        <button class="primary" id="createContract">创建合同</button>
      </div>
      <div class="subtle" id="wizardHint"></div>
    </div>
  `;
  content.querySelector("#createContract").addEventListener("click", () => {
    const presignId = Number(content.querySelector("#presignSelect").value);
    const signedFile = content.querySelector("#signedFile").value || "signed_file.pdf";
    if (!presignId) {
      content.querySelector("#wizardHint").textContent = "请选择 1 条代签合同。";
      return;
    }
    const presign = state.preSignContracts.find((p) => p.id === presignId);
    const newId = state.contracts.length + 1;
    const internalId = `CT-${new Date().getFullYear()}-${String(newId).padStart(5, "0")}`;
    const linkedPms = state.preSignLinks.filter((l) => l.presign_contract_id === presignId && l.link_type === "pms");
    const derivedYears = linkedPms.length ? "2025, 2026" : "";
    const derivationStatus = linkedPms.length ? "ok" : "missing_pms_milestone";
    state.contracts.push({
      id: newId,
      internal_contract_id: internalId,
      presign_contract_id: presignId,
      customer_id: presign.customer_id,
      product_type_id: presign.product_type_id,
      sales_region_id: presign.sales_region_id,
      customer_contract_no: presign.customer_contract_no,
      contract_title: presign.contract_title,
      signed_file_name: signedFile,
      signed_file_url: "#",
      signed_date: new Date().toISOString().split("T")[0],
      archive_date: new Date().toISOString().split("T")[0],
      total_amount_excl_tax: presign.total_amount_excl_tax,
      total_amount_incl_tax: presign.total_amount_incl_tax,
      payment_terms_text: presign.payment_terms_text,
      ip_ownership: presign.ip_ownership,
      ip_notes: presign.ip_notes,
      derived_payment_years_text: derivedYears,
      derivation_status: derivationStatus,
      status: "active",
      is_deleted: false,
      created_at: new Date().toLocaleString(),
      updated_at: new Date().toLocaleString(),
    });
    addAuditLog("contract", newId, "create");
    location.hash = "#/module/contract";
  });
}

function getContract(id) {
  return state.contracts.find((c) => c.id === id);
}

function renderDashboard() {
  const content = document.getElementById("content");
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2, currentYear + 3];
  const viewType = state.ui.dashboardView || "internal";

  const totals = computeDashboardTotals(viewType, years);
  content.innerHTML = `
    <div class="panel">
      <div class="page-title">OTP 总览看板</div>
      <div class="form-actions">
        <button class="${viewType === "internal" ? "primary" : ""}" id="internalView">内部视图</button>
        <button class="${viewType === "global" ? "primary" : ""}" id="globalView">全局视图</button>
      </div>
    </div>
    <div class="panel">
      <table class="table matrix-table">
        <thead><tr><th>阶段</th>${years.map((y) => `<th>${y}</th>`).join("")}</tr></thead>
        <tbody>
          ${["SE3", "SE4", "Contract", "Invoice"].map((stage) => {
            return `<tr>
              <td>${stage}</td>
              ${years
                .map((year) => {
                  const value = totals[stage][year] || 0;
                  return `<td><button data-stage="${stage}" data-year="${year}">${value.toFixed(1)}</button></td>`;
                })
                .join("")}
            </tr>`;
          })}
        </tbody>
      </table>
    </div>
    <div class="grid-2">
      <div class="panel">
        <div class="page-title">当前年度 OTP Top 客户</div>
        ${renderTopCustomers(currentYear)}
      </div>
      <div class="panel">
        <div class="page-title">数据新鲜度</div>
        <div class="stat-card">Salesforce 上次同步：${state.syncJobs.find((j) => j.job_type === "salesforce")?.last_run_at || "-"}</div>
        <div class="stat-card">PMS 上次同步：${state.syncJobs.find((j) => j.job_type === "pms")?.last_run_at || "-"}</div>
      </div>
    </div>
  `;

  content.querySelector("#internalView").addEventListener("click", () => {
    state.ui.dashboardView = "internal";
    renderDashboard();
  });
  content.querySelector("#globalView").addEventListener("click", () => {
    state.ui.dashboardView = "global";
    renderDashboard();
  });

  content.querySelectorAll("button[data-stage]").forEach((btn) => {
    btn.addEventListener("click", () => {
      openDrilldown(btn.dataset.stage, Number(btn.dataset.year));
    });
  });
}

function computeDashboardTotals(viewType, years) {
  const totals = {
    SE3: {},
    SE4: {},
    Contract: {},
    Invoice: {},
  };
  years.forEach((y) => {
    totals.SE3[y] = 0;
    totals.SE4[y] = 0;
    totals.Contract[y] = 0;
    totals.Invoice[y] = 0;
  });

  const snapshots = state.snapshots.filter((s) => ["SE3", "SE4"].includes(s.se_status));
  snapshots.forEach((snapshot) => {
    const stage = snapshot.se_status;
    years.forEach((year) => {
      if (snapshot.otp_amounts_text.includes(String(year))) {
        totals[stage][year] += 1.0;
      }
    });
  });

  const contracts = filterContractsByView(viewType);
  contracts.forEach((contract) => {
    years.forEach((year) => {
      if (contract.derived_payment_years_text?.includes(String(year))) {
        totals.Contract[year] += 1.5;
      }
    });
  });

  const invoices = filterInvoicesByView(viewType);
  invoices.forEach((inv) => {
    if (years.includes(inv.received_year)) totals.Invoice[inv.received_year] += Number(inv.received_amount) / 10;
  });

  return totals;
}

function filterContractsByView(viewType) {
  if (viewType === "internal") {
    return state.contracts.filter((c) => hasPmsMapping(c.presign_contract_id));
  }
  return state.contracts.filter((c) => hasPilotPms(c.presign_contract_id));
}

function filterInvoicesByView(viewType) {
  const contractIds = filterContractsByView(viewType).map((c) => c.id);
  return state.invoices.filter((inv) => contractIds.includes(inv.contract_id));
}

function hasPmsMapping(presignId) {
  return state.preSignLinks.some((l) => l.presign_contract_id === presignId && l.link_type === "pms");
}

function hasPilotPms(presignId) {
  const pmsLinks = state.preSignLinks.filter((l) => l.presign_contract_id === presignId && l.link_type === "pms");
  return pmsLinks.some((link) => {
    const project = state.pmsProjects.find((p) => p.id === link.pms_project_id);
    return project && ["pilot", "adaptation"].includes(project.project_complexity);
  });
}

function renderTopCustomers(year) {
  const totals = {};
  filterInvoicesByView(state.ui.dashboardView || "internal").forEach((inv) => {
    if (inv.received_year !== year) return;
    totals[inv.customer_id] = (totals[inv.customer_id] || 0) + inv.received_amount;
  });
  const rows = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([customerId, amount]) => `<div class="stat-card">${getCustomer(Number(customerId))?.short_name || ""}: ${amount} 万</div>`)
    .join("");
  return rows || "<div class='subtle'>暂无数据</div>";
}

function openDrilldown(stage, year) {
  const drawer = document.getElementById("drawer");
  const tabs = [
    { id: "salesforce", label: "Salesforce 快照" },
    { id: "contract", label: "合同" },
    { id: "invoice", label: "回款" },
  ];
  const tabContent = renderDrilldownTab(stage, year, "salesforce");
  drawer.innerHTML = `
    <div class="page-title">${stage} · ${year} 明细</div>
    <div class="tabs">
      ${tabs.map((tab) => `<button data-tab="${tab.id}" ${tab.id === "salesforce" ? "class='active'" : ""}>${tab.label}</button>`).join("")}
      <button onclick="closeDrawer()">关闭</button>
    </div>
    <div id="drawerContent">${tabContent}</div>
  `;
  drawer.classList.remove("hidden");
  drawer.querySelectorAll("button[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      drawer.querySelectorAll("button[data-tab]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      drawer.querySelector("#drawerContent").innerHTML = renderDrilldownTab(stage, year, btn.dataset.tab);
    });
  });
}

function renderDrilldownTab(stage, year, tab) {
  if (tab === "salesforce") {
    const snapshots = state.snapshots.filter((s) => s.se_status === stage && s.otp_amounts_text.includes(String(year)));
    return renderTableFromRecords(snapshots, ["pid", "configuration_id", "customer_id", "se_status"]);
  }
  if (tab === "contract") {
    const contracts = filterContractsByView(state.ui.dashboardView || "internal").filter((c) => c.derived_payment_years_text?.includes(String(year)));
    return renderTableFromRecords(contracts, ["internal_contract_id", "customer_id", "contract_title", "derived_payment_years_text"]);
  }
  const invoices = filterInvoicesByView(state.ui.dashboardView || "internal").filter((inv) => inv.received_year === year);
  return renderTableFromRecords(invoices, ["internal_contract_id", "customer_id", "received_date", "received_amount"]);
}

function renderTableFromRecords(records, fields) {
  return `
    <table class="table">
      <thead><tr>${fields.map((f) => `<th>${f}</th>`).join("")}</tr></thead>
      <tbody>
        ${records
          .map(
            (rec) => `
          <tr>
            ${fields
              .map((field) => {
                if (field === "internal_contract_id") return `<td>${rec.internal_contract_id || getContract(rec.contract_id)?.internal_contract_id || ""}</td>`;
                if (field === "customer_id") return `<td>${getCustomer(rec.customer_id)?.short_name || ""}</td>`;
                if (field === "configuration_id") return `<td>${getConfiguration(rec.configuration_id)?.name || ""}</td>`;
                return `<td>${rec[field] ?? ""}</td>`;
              })
              .join("")}
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function closeDrawer() {
  document.getElementById("drawer").classList.add("hidden");
}

function initGlobalActions() {
  document.getElementById("currentUser").textContent = `${getUser().display_name} (${getGroup(getUser().group_id).name})`;
  document.getElementById("switchUserBtn").addEventListener("click", () => {
    const next = state.users[(state.users.findIndex((u) => u.id === state.currentUserId) + 1) % state.users.length];
    state.currentUserId = next.id;
    initGlobalActions();
    route();
  });
  document.getElementById("searchBtn").addEventListener("click", () => {
    const query = document.getElementById("globalSearch").value;
    state.ui.filterPrefs.salesforce = { search: query };
    location.hash = "#/module/salesforce";
  });
  document.getElementById("quickAddBtn").addEventListener("click", () => {
    location.hash = "#/module/presign/new";
  });
}

function route() {
  setActiveNav();
  const hash = location.hash || "#/dashboard";
  const [base, module, action, id] = hash.replace("#/", "").split("/");

  if (hash === "#/dashboard") return renderDashboard();
  if (hash === "#/permissions") return renderPermissionsMatrix();
  if (hash === "#/audit") return renderAuditLogs();
  if (hash === "#/sync") return renderSyncJobs();
  if (hash === "#/contracts/wizard") return renderContractWizard();

  if (base === "module") {
    if (module === "master") return renderMasterData();
    if (module === "users") return renderUsers();
    if (!action) return renderList(module);
    if (action === "new") return renderForm(module);
    if (action === "detail") return renderDetail(module, Number(id));
    if (action === "edit") return renderForm(module, Number(id));
  }
}

seedData();
renderNav();
initGlobalActions();
window.addEventListener("hashchange", route);
route();
