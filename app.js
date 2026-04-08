const STORAGE_KEY = "projectops-mvp-state-v1";

const currencyFormatterCache = new Map();

const decimalFormatter = new Intl.NumberFormat("en-GB", {
  maximumFractionDigits: 1,
});

const sampleState = () => ({
  selectedProjectId: "proj-streamflow",
  projectFilter: "",
  filters: {
    search: "",
    source: "",
    category: "",
    project: "",
    billing: "",
    shared: "",
  },
  projects: [
    {
      id: "proj-portfolio",
      name: "Portfolio Site",
      slug: "portfolio-site",
      description: "Personal portfolio, landing page, and contact flow.",
      status: "active",
      owner: "Craig",
      tags: ["marketing", "brand"],
      environments: ["prod"],
      notes: "Small but public-facing. Keep domain and hosting tidy.",
    },
    {
      id: "proj-streamflow",
      name: "Streamflow",
      slug: "streamflow",
      description: "Video ingestion and creator-facing backend services.",
      status: "active",
      owner: "Craig",
      tags: ["backend", "media", "api"],
      environments: ["dev", "staging", "prod"],
      notes: "Primary spend sits here: AWS, API usage, and observability.",
    },
    {
      id: "proj-client-portal",
      name: "Client Portal",
      slug: "client-portal",
      description: "Freelance portal for invoices, docs, and status tracking.",
      status: "paused",
      owner: "Client",
      tags: ["freelance", "ops"],
      environments: ["prod"],
      notes: "Paused but not dead. Keep an eye on recurring SaaS.",
    },
    {
      id: "proj-homelab",
      name: "Homelab",
      slug: "homelab",
      description: "Self-hosted services, media tools, and utility containers.",
      status: "archived",
      owner: "Craig",
      tags: ["lab", "self-hosted"],
      environments: ["lab"],
      notes: "Archive candidate. A few services still bill monthly.",
    },
    {
      id: "proj-trading",
      name: "Trading Dashboard",
      slug: "trading-dashboard",
      description: "Live market monitoring and alerting with internal tools.",
      status: "active",
      owner: "Craig",
      tags: ["data", "monitoring"],
      environments: ["prod"],
      notes: "Shared observability with Streamflow and a separate AWS footprint.",
    },
  ],
  costItems: [
    {
      id: "cost-vercel",
      name: "Vercel Pro",
      source: "vercel",
      category: "hosting",
      billingType: "monthly",
      amount: 20,
      currency: "USD",
      startDate: "2025-01-01",
      renewalDate: "2026-05-01",
      projectId: "proj-portfolio",
      sharedCost: false,
      allocationMethod: "direct",
      notes: "Primary hosting for the public site.",
      createdAt: "2025-01-03",
    },
    {
      id: "cost-domain",
      name: "portfolio.dev domain",
      source: "registrar",
      category: "domain",
      billingType: "yearly",
      amount: 14.99,
      currency: "USD",
      startDate: "2025-03-14",
      renewalDate: "2026-03-14",
      projectId: "proj-portfolio",
      sharedCost: false,
      allocationMethod: "direct",
      notes: "Amortised monthly for run-rate reporting.",
      createdAt: "2025-03-14",
    },
    {
      id: "cost-aws",
      name: "AWS compute and storage",
      source: "aws",
      category: "compute",
      billingType: "monthly",
      amount: 240,
      currency: "USD",
      startDate: "2025-02-01",
      renewalDate: "",
      projectId: "proj-streamflow",
      sharedCost: false,
      allocationMethod: "direct",
      notes: "ECS, S3, and bandwidth for the video backend.",
      createdAt: "2025-02-01",
    },
    {
      id: "cost-openai",
      name: "OpenAI API spend",
      source: "openai",
      category: "ai",
      billingType: "usage_based",
      amount: 85,
      currency: "USD",
      startDate: "2025-02-12",
      renewalDate: "",
      projectId: "proj-streamflow",
      sharedCost: false,
      allocationMethod: "direct",
      notes: "Estimate based on the last 30 days.",
      createdAt: "2025-02-12",
    },
    {
      id: "cost-grafana",
      name: "Grafana Cloud",
      source: "grafana",
      category: "observability",
      billingType: "monthly",
      amount: 38,
      currency: "USD",
      startDate: "2025-01-20",
      renewalDate: "",
      projectId: null,
      sharedCost: true,
      allocationMethod: "percentage",
      allocations: [
        { projectId: "proj-streamflow", share: 50 },
        { projectId: "proj-trading", share: 50 },
      ],
      notes: "Split between two production services.",
      createdAt: "2025-01-20",
    },
    {
      id: "cost-github",
      name: "GitHub Pro",
      source: "github",
      category: "saas",
      billingType: "monthly",
      amount: 12,
      currency: "USD",
      startDate: "2025-01-01",
      renewalDate: "",
      projectId: null,
      sharedCost: true,
      allocationMethod: "split_evenly",
      allocations: [
        { projectId: "proj-portfolio", share: 33.34 },
        { projectId: "proj-streamflow", share: 33.33 },
        { projectId: "proj-client-portal", share: 33.33 },
      ],
      notes: "Core builder tooling shared across active work.",
      createdAt: "2025-01-01",
    },
    {
      id: "cost-sentry",
      name: "Sentry Team",
      source: "sentry",
      category: "observability",
      billingType: "monthly",
      amount: 29,
      currency: "USD",
      startDate: "2025-03-01",
      renewalDate: "",
      projectId: "proj-client-portal",
      sharedCost: false,
      allocationMethod: "direct",
      notes: "Still live for a paused client portal.",
      createdAt: "2025-03-01",
    },
    {
      id: "cost-cloudflare",
      name: "Cloudflare Domain Protection",
      source: "cloudflare",
      category: "domain",
      billingType: "yearly",
      amount: 20,
      currency: "USD",
      startDate: "2025-04-01",
      renewalDate: "2026-04-01",
      projectId: "proj-portfolio",
      sharedCost: false,
      allocationMethod: "direct",
      notes: "Annual protection amortised into monthly run rate.",
      createdAt: "2025-04-01",
    },
    {
      id: "cost-route53",
      name: "Route53 hosted zones",
      source: "aws",
      category: "domain",
      billingType: "monthly",
      amount: 8,
      currency: "USD",
      startDate: "2025-02-20",
      renewalDate: "",
      projectId: null,
      sharedCost: true,
      allocationMethod: "custom",
      allocations: [],
      notes: "Shared platform cost not assigned yet.",
      createdAt: "2025-02-20",
    },
    {
      id: "cost-homelab",
      name: "Homelab VPS",
      source: "hetzner",
      category: "compute",
      billingType: "monthly",
      amount: 18,
      currency: "USD",
      startDate: "2025-02-11",
      renewalDate: "",
      projectId: "proj-homelab",
      sharedCost: false,
      allocationMethod: "direct",
      notes: "Low-cost node that mostly sits idle now.",
      createdAt: "2025-02-11",
    },
  ],
  integrations: [
    {
      id: "aws",
      name: "AWS",
      status: "planned",
      source: "Cost Explorer / CUR",
      purpose: "Primary cloud spend and account-level service mapping",
      nextStep: "Pull monthly costs, then map services back to projects.",
      bullets: ["Account and linked-account import", "Service-level cost grouping", "Shared platform allocation"],
    },
    {
      id: "godaddy",
      name: "GoDaddy",
      status: "planned",
      source: "Domains and renewals",
      purpose: "Capture renewals, expiries, and ownership for project domains",
      nextStep: "Import registered domains and annual renewal dates.",
      bullets: ["Domain ownership", "Renewal tracking", "Amortised monthly run rate"],
    },
    {
      id: "csv",
      name: "CSV import",
      status: "ready",
      source: "Manual fallback",
      purpose: "Bridge the gap before every provider has an API connector",
      nextStep: "Allow simple recurring-cost imports from spreadsheets.",
      bullets: ["Recurring cost rows", "Renewal amortisation", "Project assignment and allocation"],
    },
  ],
};

const state = loadState();

const dom = {
  kpiGrid: document.getElementById("kpi-grid"),
  heroMonthly: document.getElementById("hero-monthly"),
  heroAnnual: document.getElementById("hero-annual"),
  heroBars: document.getElementById("hero-bars"),
  projectGrid: document.getElementById("project-grid"),
  projectMeta: document.getElementById("project-meta"),
  integrationGrid: document.getElementById("integration-grid"),
  integrationMeta: document.getElementById("integration-meta"),
  detailTitle: document.getElementById("detail-title"),
  detailStatus: document.getElementById("detail-status"),
  projectDetail: document.getElementById("project-detail"),
  costTableBody: document.querySelector("#cost-table tbody"),
  allocationView: document.getElementById("allocation-view"),
  wasteView: document.getElementById("waste-view"),
  projectForm: document.getElementById("project-form"),
  costForm: document.getElementById("cost-form"),
  projectSelect: document.getElementById("cost-project-select"),
  allocationEditor: document.getElementById("allocation-editor"),
  allocationRows: document.getElementById("allocation-rows"),
  sharedToggle: document.getElementById("shared-toggle"),
  searchCosts: document.getElementById("search-costs"),
  filterSource: document.getElementById("filter-source"),
  filterCategory: document.getElementById("filter-category"),
  filterProject: document.getElementById("filter-project"),
  filterBilling: document.getElementById("filter-billing"),
  filterShared: document.getElementById("filter-shared"),
  resetDemo: document.getElementById("reset-demo"),
  seedFresh: document.getElementById("seed-fresh"),
  jumpCreateProject: document.getElementById("jump-create-project"),
  jumpAddCost: document.getElementById("jump-add-cost"),
  projectFormTitle: document.getElementById("project-form-title"),
};

let allocationRowCounter = 0;

boot();

function boot() {
  syncAllocationEditor();
  populateFilters();
  syncFilterControls();
  render();
  bindEvents();
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return sampleState();
    const parsed = JSON.parse(raw);
    return {
      ...sampleState(),
      ...parsed,
      filters: { ...sampleState().filters, ...(parsed.filters || {}) },
    };
  } catch {
    return sampleState();
  }
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Fall back to in-memory state when persistent storage is unavailable.
  }
}

function normalizeCost(cost) {
  const annualised =
    cost.billingType === "monthly"
      ? cost.amount
      : cost.billingType === "yearly"
        ? cost.amount / 12
        : cost.billingType === "usage_based"
          ? cost.amount
          : cost.amount / 12;

  return Number.isFinite(annualised) ? annualised : 0;
}

function statusLabel(status) {
  if (status === "active") return "Active";
  if (status === "paused") return "Paused";
  if (status === "ready") return "Ready";
  if (status === "planned") return "Planned";
  return "Archived";
}

function money(value, currency = "USD") {
  const safeCurrency = currency || "USD";
  let formatter = currencyFormatterCache.get(safeCurrency);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: safeCurrency,
      maximumFractionDigits: 0,
    });
    currencyFormatterCache.set(safeCurrency, formatter);
  }
  return formatter.format(Number.isFinite(value) ? value : 0);
}

function formatPercent(value) {
  return `${decimalFormatter.format(value)}%`;
}

function projectById(projectId) {
  return state.projects.find((project) => project.id === projectId) || null;
}

function derivedCostRows() {
  return state.costItems.map((cost) => {
    const monthly = normalizeCost(cost);
    const yearly = monthly * 12;
    const project = cost.projectId ? projectById(cost.projectId) : null;
    const allocations = sharedAllocations(cost);
    return {
      ...cost,
      monthly,
      yearly,
      project,
      allocations,
    };
  });
}

function sharedAllocations(cost) {
  if (!cost.sharedCost || !Array.isArray(cost.allocations)) return [];
  const totalShare = cost.allocations.reduce((sum, allocation) => sum + Number(allocation.share || 0), 0);
  const safeDenominator = totalShare > 0 ? totalShare : 100;
  return cost.allocations
    .map((allocation) => {
      const project = projectById(allocation.projectId);
      if (!project) return null;
      const share = Number(allocation.share || 0);
      return {
        project,
        share,
        amount: normalizeCost(cost) * (share / safeDenominator),
      };
    })
    .filter(Boolean);
}

function projectMetrics(project) {
  const relatedCosts = derivedCostRows().filter((cost) => {
    if (cost.sharedCost) {
      return cost.allocations.some((allocation) => allocation.project.id === project.id);
    }
    return cost.projectId === project.id;
  });

  const direct = relatedCosts
    .filter((cost) => !cost.sharedCost && cost.projectId === project.id)
    .reduce((sum, cost) => sum + cost.monthly, 0);

  const shared = relatedCosts
    .filter((cost) => cost.sharedCost)
    .reduce((sum, cost) => {
      const allocation = cost.allocations.find((entry) => entry.project.id === project.id);
      return sum + (allocation ? allocation.amount : 0);
    }, 0);

  const total = direct + shared;
  const yearly = total * 12;
  const categoryBreakdown = buildCategoryBreakdown(relatedCosts, project.id);
  const renewals = relatedCosts
    .filter((cost) => cost.renewalDate)
    .sort((a, b) => String(a.renewalDate).localeCompare(String(b.renewalDate)))
    .slice(0, 5);

  return {
    direct,
    shared,
    total,
    yearly,
    relatedCosts,
    categoryBreakdown,
    renewals,
  };
}

function buildCategoryBreakdown(costs, projectId) {
  const bucket = new Map();
  costs.forEach((cost) => {
    if (cost.sharedCost) {
      cost.allocations.forEach((allocation) => {
        if (allocation.project.id !== projectId) return;
        bucket.set(cost.category, (bucket.get(cost.category) || 0) + allocation.amount);
      });
      return;
    }
    if (cost.projectId === projectId) {
      bucket.set(cost.category, (bucket.get(cost.category) || 0) + cost.monthly);
    }
  });
  return [...bucket.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

function portfolioMetrics() {
  const costs = derivedCostRows();
  const activeProjects = state.projects.filter((project) => project.status === "active");
  const monthly = costs.reduce((sum, cost) => sum + cost.monthly, 0);
  const yearly = monthly * 12;
  const shared = costs.filter((cost) => cost.sharedCost).length;
  const orphaned = costs.filter((cost) => cost.sharedCost && (!cost.allocations || cost.allocations.length === 0)).length;
  const archivedBurn = state.projects
    .filter((project) => project.status === "archived")
    .reduce((sum, project) => sum + projectMetrics(project).total, 0);

  return {
    monthly,
    yearly,
    activeProjects: activeProjects.length,
    totalProjects: state.projects.length,
    shared,
    orphaned,
    archivedBurn,
    categoryBreakdown: buildPortfolioCategoryBreakdown(costs),
    projectRanking: state.projects
      .map((project) => ({ project, ...projectMetrics(project) }))
      .sort((a, b) => b.total - a.total),
  };
}

function buildPortfolioCategoryBreakdown(costs) {
  const bucket = new Map();
  costs.forEach((cost) => {
    if (cost.sharedCost && cost.allocations.length > 0) {
      cost.allocations.forEach((allocation) => {
        bucket.set(cost.category, (bucket.get(cost.category) || 0) + allocation.amount);
      });
      return;
    }
    if (!cost.sharedCost) {
      bucket.set(cost.category, (bucket.get(cost.category) || 0) + cost.monthly);
    }
  });
  return [...bucket.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

function topSources() {
  const costs = derivedCostRows();
  const bucket = new Map();
  costs.forEach((cost) => {
    bucket.set(cost.source, (bucket.get(cost.source) || 0) + cost.monthly);
  });
  return [...bucket.entries()]
    .map(([source, amount]) => ({ source, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4);
}

function render() {
  const portfolio = portfolioMetrics();
  const selectedProject = projectById(state.selectedProjectId) || state.projects[0];
  if (!selectedProject) return;
  state.selectedProjectId = selectedProject.id;

  renderPortfolioKpis(portfolio);
  renderIntegrations();
  renderProjectGrid(portfolio.projectRanking);
  renderProjectDetail(selectedProject);
  renderCostTable();
  renderAllocationView();
  renderWasteView();
  renderHero(portfolio);
  persistState();
}

function renderHero(portfolio) {
  dom.heroMonthly.textContent = money(portfolio.monthly);
  dom.heroAnnual.textContent = `Annualised run rate ${money(portfolio.yearly)}`;
  dom.heroBars.innerHTML = "";
  topSources().forEach((entry, index) => {
    const row = document.createElement("div");
    row.className = "stacked-bar";
    const rowHeader = document.createElement("div");
    rowHeader.className = "stacked-bar-row";
    rowHeader.innerHTML = `<span>${escapeHtml(entry.source)}</span><span>${money(entry.amount)}</span>`;
    const track = document.createElement("div");
    track.className = "stacked-bar-track";
    const fill = document.createElement("div");
    fill.className = "stacked-bar-fill";
    fill.style.width = `${portfolio.monthly > 0 ? (entry.amount / portfolio.monthly) * 100 : 0}%`;
    fill.style.opacity = `${1 - index * 0.1}`;
    track.appendChild(fill);
    row.appendChild(rowHeader);
    row.appendChild(track);
    dom.heroBars.appendChild(row);
  });
}

function renderPortfolioKpis(portfolio) {
  const topProjects = portfolio.projectRanking.slice(0, 3);
  const activeProjects = state.projects.filter((project) => project.status === "active");
  const categoryBreakdown = portfolio.categoryBreakdown.slice(0, 3);
  const orphaned = derivedCostRows().filter((cost) => cost.sharedCost && cost.allocations.length === 0).length;
  const recentChanges = derivedCostRows()
    .slice()
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
    .slice(0, 3);

  dom.kpiGrid.innerHTML = "";
  dom.kpiGrid.append(
    kpiCard("Total monthly spend", money(portfolio.monthly), `${money(portfolio.yearly)} annualised run rate`),
    kpiCard("Active projects", String(activeProjects.length), `${state.projects.length} projects total`),
    kpiCard(
      "Shared allocations",
      String(portfolio.shared),
      portfolio.archivedBurn > 0
        ? `${orphaned} orphaned shared costs, ${money(portfolio.archivedBurn)} archived burn`
        : `${orphaned} orphaned shared costs, no archived burn`,
    ),
    kpiCard(
      "Top categories",
      categoryBreakdown.length ? categoryBreakdown.map((item) => item.category).join(" • ") : "No spend yet",
      "Most operational spend sits here",
    ),
  );

  dom.projectMeta.textContent = `${topProjects.length} highest-cost projects surfaced • ${recentChanges.length} recent changes`;
}

function renderIntegrations() {
  const integrations = state.integrations || [];
  dom.integrationGrid.innerHTML = "";
  integrations.forEach((integration) => {
    const card = document.createElement("article");
    card.className = "integration-card";
    card.innerHTML = `
      <div class="integration-card-header">
        <div>
          <h3>${escapeHtml(integration.name)}</h3>
          <p>${escapeHtml(integration.source)}</p>
        </div>
        <span class="pill ${integration.status === "ready" ? "good" : "warn"}">${escapeHtml(statusLabel(integration.status))}</span>
      </div>
      <p>${escapeHtml(integration.purpose)}</p>
      <div class="integration-points">
        ${integration.bullets.map((item) => `<div class="integration-point">${escapeHtml(item)}</div>`).join("")}
      </div>
      <div class="detail-card">
        <div class="detail-label">Next step</div>
        <div class="detail-value">${escapeHtml(integration.nextStep)}</div>
      </div>
    `;
    dom.integrationGrid.appendChild(card);
  });
  dom.integrationMeta.textContent = `${integrations.length} sources mapped • AWS and GoDaddy first`;
}

function kpiCard(label, value, caption) {
  const card = document.createElement("div");
  card.className = "kpi-card";
  card.innerHTML = `
    <div class="kpi-label">${escapeHtml(label)}</div>
    <div class="kpi-value">${escapeHtml(value)}</div>
    <div class="kpi-caption">${escapeHtml(caption)}</div>
  `;
  return card;
}

function renderProjectGrid(ranking) {
  dom.projectGrid.innerHTML = "";
  ranking.forEach(({ project, total, direct, shared, categoryBreakdown }) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `project-card ${project.id === state.selectedProjectId ? "active" : ""}`;
    card.innerHTML = `
      <div class="project-head">
        <div>
          <div class="project-name">${escapeHtml(project.name)}</div>
          <div class="project-desc">${escapeHtml(project.description)}</div>
        </div>
        <span class="pill ${statusClass(project.status)}">${escapeHtml(statusLabel(project.status))}</span>
      </div>
      <div class="project-cost">
        <strong>${money(total)}</strong>
        <span>${money(total * 12)} yearly projection</span>
      </div>
      <div class="project-foot">
        <span class="pill">Direct ${money(direct)}</span>
        <span class="pill">Shared ${money(shared)}</span>
        <span class="pill">${project.tags.slice(0, 2).map(escapeHtml).join(" • ") || "No tags"}</span>
      </div>
      <div class="stacked-bar-track">
        <div
          class="stacked-bar-fill"
          style="width:${Math.min(100, total / Math.max(1, ranking[0]?.total || 1) * 100)}%"
        ></div>
      </div>
    `;
    card.addEventListener("click", () => {
      state.selectedProjectId = project.id;
      render();
    });
    dom.projectGrid.appendChild(card);
  });
}

function renderProjectDetail(project) {
  const metrics = projectMetrics(project);
  dom.detailTitle.textContent = project.name;
  dom.detailStatus.className = `pill ${statusClass(project.status)}`;
  dom.detailStatus.textContent = statusLabel(project.status);

  const categories = metrics.categoryBreakdown
    .map((item) => `
      <div class="progress-row">
        <div class="progress-row-head">
          <span>${escapeHtml(item.category)}</span>
          <span>${money(item.amount)}</span>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${metrics.total > 0 ? (item.amount / metrics.total) * 100 : 0}%"></div></div>
      </div>
    `)
    .join("");

  const renewals = metrics.renewals.length
    ? metrics.renewals
        .map(
          (cost) => `
          <div class="timeline-row">
            <div class="timeline-row-head">
              <strong>${escapeHtml(cost.name)}</strong>
              <span class="pill">${escapeHtml(cost.renewalDate)}</span>
            </div>
            <div class="muted small">${escapeHtml(cost.source)} • ${escapeHtml(cost.category)}</div>
          </div>
        `,
        )
        .join("")
    : `<div class="empty-state">No upcoming renewals on this project.</div>`;

  dom.projectDetail.innerHTML = `
    <div class="detail-card">
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">Monthly cost</span>
          <span class="detail-value">${money(metrics.total)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Yearly projection</span>
          <span class="detail-value">${money(metrics.yearly)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Direct costs</span>
          <span class="detail-value">${money(metrics.direct)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Shared allocation</span>
          <span class="detail-value">${money(metrics.shared)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Owner</span>
          <span class="detail-value">${escapeHtml(project.owner || "Unassigned")}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Environments</span>
          <span class="detail-value">${escapeHtml(project.environments.join(", ") || "None")}</span>
        </div>
      </div>
    </div>

    <div class="detail-card">
      <h4>Category breakdown</h4>
      <div class="progress-list">${categories || "<div class='empty-state'>No categories yet.</div>"}</div>
    </div>

    <div class="detail-card">
      <h4>Linked assets</h4>
      <div class="bullet-list">
        ${
          metrics.relatedCosts.length
            ? metrics.relatedCosts
                .map(
                  (cost) => `
              <div class="inline-item">
                <strong>${escapeHtml(cost.name)}</strong>
                <span class="muted small">${escapeHtml(cost.source)} • ${escapeHtml(cost.billingType)} • ${money(cost.monthly)} monthly</span>
              </div>
            `,
                )
                .join("")
            : "<div class='empty-state'>No costs linked to this project.</div>"
        }
      </div>
    </div>

    <div class="detail-card">
      <h4>Renewal timeline</h4>
      <div class="timeline-list">${renewals}</div>
    </div>

    <div class="detail-card">
      <h4>Notes</h4>
      <div class="muted small">${escapeHtml(project.notes || "No notes yet.")}</div>
    </div>
  `;
}

function renderCostTable() {
  const costs = derivedCostRows().filter(matchesCostFilters);
  dom.costTableBody.innerHTML = "";

  costs.forEach((cost) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <strong>${escapeHtml(cost.name)}</strong>
        <div class="muted small">${escapeHtml(cost.notes || "")}</div>
      </td>
      <td>${escapeHtml(cost.source)}</td>
      <td>${escapeHtml(cost.category)}</td>
      <td>${escapeHtml(cost.billingType)}</td>
      <td>${assignmentLabel(cost)}</td>
      <td class="num">${money(cost.monthly)}</td>
      <td class="num">${money(cost.yearly)}</td>
    `;
    dom.costTableBody.appendChild(tr);
  });

  if (!costs.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="7"><div class="empty-state">No cost items match the current filters.</div></td>`;
    dom.costTableBody.appendChild(tr);
  }
}

function renderAllocationView() {
  const sharedCosts = derivedCostRows().filter((cost) => cost.sharedCost);
  const assigned = sharedCosts.filter((cost) => cost.allocations.length > 0);
  const orphaned = sharedCosts.filter((cost) => cost.allocations.length === 0);

  const content = [];
  if (assigned.length) {
    content.push(
      `<div class="detail-card">
        <h4>Assigned shared costs</h4>
        <div class="allocation-list">
          ${assigned
            .map(
              (cost) => `
              <div class="allocation-row">
                <div class="allocation-row-head">
                  <strong>${escapeHtml(cost.name)}</strong>
                  <span class="pill">${money(cost.monthly)}</span>
                </div>
                <div class="muted small">${cost.allocations
                  .map((allocation) => `${escapeHtml(allocation.project.name)} ${formatPercent(allocation.share)}`)
                  .join(" • ")}</div>
              </div>
            `,
            )
            .join("")}
        </div>
      </div>`,
    );
  }

  if (orphaned.length) {
    content.push(
      `<div class="detail-card">
        <h4>Orphaned shared costs</h4>
        <div class="allocation-list">
          ${orphaned
            .map(
              (cost) => `
              <div class="allocation-row">
                <div class="allocation-row-head">
                  <strong>${escapeHtml(cost.name)}</strong>
                  <span class="pill bad">${money(cost.monthly)}</span>
                </div>
                <div class="muted small">Shared but not allocated to any project.</div>
              </div>
            `,
            )
            .join("")}
        </div>
      </div>`,
    );
  }

  if (!content.length) {
    content.push(`<div class="empty-state">No shared costs yet.</div>`);
  }

  dom.allocationView.innerHTML = content.join("");
}

function renderWasteView() {
  const archived = state.projects
    .filter((project) => project.status === "archived")
    .map((project) => ({ project, metrics: projectMetrics(project) }))
    .filter(({ metrics }) => metrics.total > 0);

  const unassigned = derivedCostRows().filter((cost) => !cost.sharedCost && !cost.projectId);
  const duplicates = findDuplicateTooling();

  const parts = [];

  if (archived.length) {
    parts.push(`
      <div class="detail-card">
        <h4>Archived projects still costing money</h4>
        <div class="waste-list">
          ${archived
            .map(
              ({ project, metrics }) => `
              <div class="waste-row">
                <div class="waste-row-head">
                  <strong>${escapeHtml(project.name)}</strong>
                  <span class="pill warn">${money(metrics.total)} monthly</span>
                </div>
                <div class="muted small">${escapeHtml(project.description)}</div>
              </div>
            `,
            )
            .join("")}
        </div>
      </div>
    `);
  }

  if (unassigned.length) {
    parts.push(`
      <div class="detail-card">
        <h4>Unassigned subscriptions</h4>
        <div class="waste-list">
          ${unassigned
            .map(
              (cost) => `
              <div class="waste-row">
                <div class="waste-row-head">
                  <strong>${escapeHtml(cost.name)}</strong>
                  <span class="pill bad">${money(cost.monthly)} monthly</span>
                </div>
                <div class="muted small">${escapeHtml(cost.source)} • no project attached</div>
              </div>
            `,
            )
            .join("")}
        </div>
      </div>
    `);
  }

  if (duplicates.length) {
    parts.push(`
      <div class="detail-card">
        <h4>Duplicate tooling signals</h4>
        <div class="waste-list">
          ${duplicates
            .map(
              (entry) => `
              <div class="waste-row">
                <div class="waste-row-head">
                  <strong>${escapeHtml(entry.label)}</strong>
                  <span class="pill">${entry.count} places</span>
                </div>
                <div class="muted small">${escapeHtml(entry.projects)}</div>
              </div>
            `,
            )
            .join("")}
        </div>
      </div>
    `);
  }

  if (!parts.length) {
    parts.push(`<div class="empty-state">No obvious waste detected. Nice work keeping the portfolio tidy.</div>`);
  }

  dom.wasteView.innerHTML = parts.join("");
}

function findDuplicateTooling() {
  const bucket = new Map();
  derivedCostRows().forEach((cost) => {
    const key = `${cost.source}::${cost.name}`.toLowerCase();
    const entry = bucket.get(key) || { label: `${cost.source} • ${cost.name}`, count: 0, projectNames: new Set() };
    entry.count += 1;
    if (cost.project) entry.projectNames.add(cost.project.name);
    if (cost.sharedCost && cost.allocations.length) {
      cost.allocations.forEach((allocation) => entry.projectNames.add(allocation.project.name));
    }
    bucket.set(key, entry);
  });

  return [...bucket.values()]
    .filter((entry) => entry.count > 1 || entry.projectNames.size > 1)
    .map((entry) => ({
      label: entry.label,
      count: entry.count,
      projects: [...entry.projectNames].join(" • "),
    }))
    .slice(0, 4);
}

function matchesCostFilters(cost) {
  const { search, source, category, project, billing, shared } = state.filters;
  const haystack = `${cost.name} ${cost.source} ${cost.category} ${cost.billingType} ${cost.project?.name || ""} ${cost.notes || ""}`.toLowerCase();
  if (search && !haystack.includes(search.toLowerCase())) return false;
  if (source && cost.source !== source) return false;
  if (category && cost.category !== category) return false;
  if (project) {
    const projectName = cost.project?.id || "";
    const projectNameSlug = cost.project?.slug || "";
    const sharedProjectIds = cost.sharedCost ? cost.allocations.map((allocation) => allocation.project.id) : [];
    if (projectName !== project && projectNameSlug !== project && !sharedProjectIds.includes(project)) return false;
  }
  if (billing && cost.billingType !== billing) return false;
  if (shared === "direct" && cost.sharedCost) return false;
  if (shared === "shared" && !cost.sharedCost) return false;
  if (shared === "orphan" && !(cost.sharedCost && cost.allocations.length === 0)) return false;
  return true;
}

function assignmentLabel(cost) {
  if (cost.sharedCost) {
    if (!cost.allocations.length) return `<span class="pill bad">Unassigned</span>`;
    return `<span class="pill warn">Shared</span> ${cost.allocations
      .map((allocation) => escapeHtml(`${allocation.project.name} ${formatPercent(allocation.share)}`))
      .join("<br />")}`;
  }
  if (cost.project) return `<span class="pill good">${escapeHtml(cost.project.name)}</span>`;
  return `<span class="pill bad">Unassigned</span>`;
}

function statusClass(status) {
  if (status === "active") return "good";
  if (status === "paused") return "warn";
  return "bad";
}

function bindEvents() {
  dom.projectForm.addEventListener("submit", handleProjectSubmit);
  dom.costForm.addEventListener("submit", handleCostSubmit);
  dom.sharedToggle.addEventListener("change", syncAllocationEditor);
  dom.searchCosts.addEventListener("input", handleFilterChange);
  dom.filterSource.addEventListener("change", handleFilterChange);
  dom.filterCategory.addEventListener("change", handleFilterChange);
  dom.filterProject.addEventListener("change", handleFilterChange);
  dom.filterBilling.addEventListener("change", handleFilterChange);
  dom.filterShared.addEventListener("change", handleFilterChange);
  dom.resetDemo.addEventListener("click", () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage failures and just reload the in-memory demo state.
    }
    location.reload();
  });
  dom.seedFresh.addEventListener("click", () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleState()));
    } catch {
      // Ignore storage failures and just reload the in-memory demo state.
    }
    location.reload();
  });
  dom.jumpCreateProject.addEventListener("click", () => {
    dom.projectForm.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  dom.jumpAddCost.addEventListener("click", () => {
    dom.costForm.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.getElementById("add-allocation-row").addEventListener("click", () => {
    addAllocationRow();
  });
}

function handleFilterChange() {
  state.filters.search = dom.searchCosts.value.trim();
  state.filters.source = dom.filterSource.value;
  state.filters.category = dom.filterCategory.value;
  state.filters.project = dom.filterProject.value;
  state.filters.billing = dom.filterBilling.value;
  state.filters.shared = dom.filterShared.value;
  render();
}

function handleProjectSubmit(event) {
  event.preventDefault();
  const formData = new FormData(dom.projectForm);
  const name = String(formData.get("name") || "").trim();
  if (!name) return;
  const slug = String(formData.get("slug") || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
  const project = {
    id: `proj-${slug}-${Date.now().toString(36)}`,
    name,
    slug,
    description: String(formData.get("description") || "").trim(),
    status: String(formData.get("status") || "active"),
    owner: String(formData.get("owner") || "").trim(),
    tags: splitList(String(formData.get("tags") || "")),
    environments: splitList(String(formData.get("environments") || "")),
    notes: String(formData.get("notes") || "").trim(),
  };
  state.projects.unshift(project);
  state.selectedProjectId = project.id;
  dom.projectForm.reset();
  dom.projectForm.querySelector('[name="status"]').value = "active";
  render();
}

function handleCostSubmit(event) {
  event.preventDefault();
  const formData = new FormData(dom.costForm);
  const sharedCost = dom.sharedToggle.checked;
  const projectId = String(formData.get("projectId") || "");
  const allocations = sharedCost ? readAllocationRows() : [];
  const cost = {
    id: `cost-${Date.now().toString(36)}`,
    name: String(formData.get("name") || "").trim(),
    source: String(formData.get("source") || "").trim(),
    category: String(formData.get("category") || "misc"),
    billingType: String(formData.get("billingType") || "monthly"),
    amount: Number(formData.get("amount") || 0),
    currency: String(formData.get("currency") || "USD").trim() || "USD",
    startDate: String(formData.get("startDate") || ""),
    renewalDate: String(formData.get("renewalDate") || ""),
    projectId: sharedCost ? null : projectId || null,
    sharedCost,
    allocationMethod: String(formData.get("allocationMethod") || "direct"),
    allocations,
    notes: String(formData.get("notes") || "").trim(),
    createdAt: new Date().toISOString().slice(0, 10),
  };

  if (!cost.name || !cost.source || !Number.isFinite(cost.amount)) return;
  state.costItems.unshift(cost);
  dom.costForm.reset();
  dom.sharedToggle.checked = false;
  syncAllocationEditor();
  populateFilters();
  render();
}

function readAllocationRows() {
  const rows = [...dom.allocationRows.querySelectorAll(".allocation-row-editor")];
  const allocations = rows
    .map((row) => {
      const projectId = row.querySelector('[data-role="allocation-project"]').value;
      const share = Number(row.querySelector('[data-role="allocation-share"]').value || 0);
      return projectId ? { projectId, share } : null;
    })
    .filter(Boolean);
  return allocations;
}

function syncAllocationEditor() {
  const isShared = dom.sharedToggle.checked;
  dom.allocationEditor.classList.toggle("hidden", !isShared);
  if (!isShared) {
    dom.allocationRows.innerHTML = "";
    return;
  }
  if (dom.allocationRows.children.length === 0) {
    addAllocationRow();
    addAllocationRow();
  }
}

function addAllocationRow(prefill = {}) {
  const row = document.createElement("div");
  row.className = "allocation-row-editor";
  row.dataset.rowId = String(++allocationRowCounter);
  row.innerHTML = `
    <select class="select-input" data-role="allocation-project"></select>
    <input class="text-input" data-role="allocation-share" type="number" min="0" step="0.01" value="${prefill.share ?? 50}" />
    <button class="delete-button" type="button">Remove</button>
  `;
  const select = row.querySelector('[data-role="allocation-project"]');
  state.projects
    .filter((project) => project.status !== "archived")
    .forEach((project) => {
      const option = document.createElement("option");
      option.value = project.id;
      option.textContent = project.name;
      if (prefill.projectId === project.id) option.selected = true;
      select.appendChild(option);
    });
  if (!select.value && state.projects.length) {
    select.value = state.projects[0].id;
  }
  row.querySelector("button").addEventListener("click", () => {
    row.remove();
    if (!dom.allocationRows.children.length) addAllocationRow();
  });
  dom.allocationRows.appendChild(row);
}

function populateFilters() {
  fillSelect(dom.filterSource, uniqueValues("source"), "All sources");
  fillSelect(dom.filterCategory, uniqueValues("category"), "All categories");
  fillSelect(dom.filterProject, state.projects.map((project) => ({ value: project.id, label: project.name })), "All projects");
  fillSelect(
    dom.filterBilling,
    [
      { value: "monthly", label: "Monthly" },
      { value: "yearly", label: "Yearly" },
      { value: "usage_based", label: "Usage-based" },
      { value: "one_off", label: "One-off" },
    ],
    "All billing types",
  );

  dom.projectSelect.innerHTML = "";
  const directPlaceholder = document.createElement("option");
  directPlaceholder.value = "";
  directPlaceholder.textContent = "Unassigned";
  dom.projectSelect.appendChild(directPlaceholder);
  state.projects.forEach((project) => {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = project.name;
    dom.projectSelect.appendChild(option);
  });
}

function syncFilterControls() {
  dom.searchCosts.value = state.filters.search || "";
  dom.filterSource.value = state.filters.source || "";
  dom.filterCategory.value = state.filters.category || "";
  dom.filterProject.value = state.filters.project || "";
  dom.filterBilling.value = state.filters.billing || "";
  dom.filterShared.value = state.filters.shared || "";
}

function fillSelect(select, values, placeholder) {
  const current = select.value;
  select.innerHTML = "";
  const option = document.createElement("option");
  option.value = "";
  option.textContent = placeholder;
  select.appendChild(option);
  values.forEach((entry) => {
    const item = typeof entry === "string" ? { value: entry, label: entry } : entry;
    const opt = document.createElement("option");
    opt.value = item.value;
    opt.textContent = item.label;
    select.appendChild(opt);
  });
  select.value = values.some((entry) => (typeof entry === "string" ? entry : entry.value) === current) ? current : "";
}

function uniqueValues(field) {
  return [...new Set(state.costItems.map((cost) => cost[field]).filter(Boolean))]
    .sort()
    .map((value) => ({ value, label: value }));
}

function splitList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
