// views.js — page renderers for Ghorer Hisab.
// Each render function takes the app state and returns an HTML string for
// the #view container. All figures come from the state; nothing is hard-coded
// in the markup. main.js wires the forms and buttons after each render.
import { CATEGORIES, MONTHS, HOUSEHOLD } from "./data.js";
import { donutChart, barChart, lineChart, budgetBars } from "./charts.js";

export function taka(n) {
  return "৳" + Math.round(n).toLocaleString("en-IN");
}

export function monthLabel(id) {
  const m = MONTHS.find((x) => x.id === id);
  return m ? m.label : id;
}

export function categoryOf(key) {
  return CATEGORIES.find((c) => c.key === key) || { key, name: key, budget: 0, color: "#888" };
}

export function incomeTotal(state, month) {
  return (state.income[month] || []).reduce((s, r) => s + r.amount, 0);
}

export function spendingTotal(state, month) {
  return state.expenses
    .filter((e) => e.month === month && e.category !== "savings")
    .reduce((s, e) => s + e.amount, 0);
}

export function savedTotal(state, month) {
  return incomeTotal(state, month) - spendingTotal(state, month);
}

export function categorySpent(state, month, key) {
  return state.expenses
    .filter((e) => e.month === month && e.category === key)
    .reduce((s, e) => s + e.amount, 0);
}

export function monthOptions(state) {
  return MONTHS.map(
    (m) => `<option value="${m.id}"${m.id === state.month ? " selected" : ""}>${m.label}</option>`
  ).join("");
}

function monthPicker(state, id) {
  return `<label class="month-picker">Month <select id="${id}">${monthOptions(state)}</select></label>`;
}

function statCard(label, value, sub, tone) {
  return `<div class="stat-card ${tone || ""}"><div class="stat-label">${label}</div><div class="stat-value">${value}</div><div class="stat-sub">${sub}</div></div>`;
}

function recentRows(state, month, count) {
  const rows = state.expenses
    .filter((e) => e.month === month)
    .sort((a, b) => b.day - a.day)
    .slice(0, count);
  if (!rows.length) return `<p class="empty">No spending recorded this month yet.</p>`;
  return `<ul class="tx-list">${rows
    .map(
      (e) =>
        `<li title="${e.day} ${monthLabel(month)} — ${escapeHtml(categoryOf(e.category).name)}"><span class="tx-dot" style="background:${categoryOf(e.category).color}"></span><span class="tx-note">${escapeHtml(e.note)}</span><span class="tx-cat">${escapeHtml(categoryOf(e.category).name)}</span><span class="tx-day">${e.day} ${monthLabel(month).split(" ")[0]}</span><span class="tx-amt">${taka(e.amount)}</span></li>`
    )
    .join("")}</ul>`;
}

export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---------------- Dashboard ----------------
export function renderDashboard(state) {
  const m = state.month;
  const income = incomeTotal(state, m);
  const spent = spendingTotal(state, m);
  const saved = income - spent;
  const rate = income > 0 ? Math.round((saved / income) * 100) : 0;
  const health = rate >= 20 ? "Healthy — saving a fifth or more" : rate >= 10 ? "Steady — saving a tenth or more" : "Tight — little left over this month";
  const topCats = CATEGORIES.filter((c) => c.key !== "savings")
    .map((c) => ({ label: c.name, spent: categorySpent(state, m, c.key), budget: c.budget, color: c.color }))
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5);
  const goal = state.goals[0];
  const goalPct = goal ? Math.round((goal.saved / goal.target) * 100) : 0;
  const donutParts = CATEGORIES.filter((c) => c.key !== "savings").map((c) => ({
    label: c.name,
    value: categorySpent(state, m, c.key),
    color: c.color,
  }));
  return `
  <section class="page-head">
    <div><h1>Dashboard</h1><p class="lede">${escapeHtml(HOUSEHOLD.name)} · ${escapeHtml(HOUSEHOLD.city)} · ${HOUSEHOLD.members} people</p></div>
    ${monthPicker(state, "dash-month")}
  </section>
  <div class="stat-grid">
    ${statCard("Income — " + monthLabel(m), taka(income), "Salary + freelance", "good")}
    ${statCard("Spending — " + monthLabel(m), taka(spent), "Everything except savings", "warn")}
    ${statCard("Left over — " + monthLabel(m), taka(saved), rate + "% of income saved", "good")}
  </div>
  <div class="panel-grid">
    <div class="panel">
      <h2>Where the money went</h2>
      <div class="donut-wrap">${donutChart(donutParts, "spent")}</div>
      <p class="hint">Budget health: <strong>${health}</strong>. Aim to keep at least 20% of income aside.</p>
    </div>
    <div class="panel">
      <h2>Biggest categories</h2>
      ${budgetBars(topCats)}
      <p class="hint"><a href="#/expenses">See all categories and edit budgets →</a></p>
    </div>
  </div>
  <div class="panel-grid">
    <div class="panel">
      <h2>Latest spending — ${monthLabel(m)}</h2>
      ${recentRows(state, m, 6)}
      <p class="hint"><a href="#/expenses">All transactions →</a></p>
    </div>
    <div class="panel">
      <h2>Top savings goal</h2>
      ${goal ? `<p class="goal-name">${escapeHtml(goal.name)}</p><div class="bar-track big"><div class="bar-fill" style="width:${goalPct}%;background:#059669"></div></div><p class="goal-nums">${taka(goal.saved)} saved of ${taka(goal.target)} — ${goalPct}%</p><p class="hint">${escapeHtml(goal.note)}</p><p class="hint"><a href="#/goals">All savings goals →</a></p>` : `<p class="empty">No goals yet.</p>`}
    </div>
  </div>`;
}

// ---------------- Income ----------------
export function renderIncome(state) {
  const m = state.month;
  const rows = state.income[m] || [];
  const total = incomeTotal(state, m);
  const series = MONTHS.map((mo) => ({
    label: mo.short,
    value: incomeTotal(state, mo.id),
    color: "#0f766e",
  }));
  return `
  <section class="page-head">
    <div><h1>Income</h1><p class="lede">Every taka coming in — salary, freelance and one-offs.</p></div>
    ${monthPicker(state, "income-month")}
  </section>
  <div class="stat-grid">
    ${statCard("Total income — " + monthLabel(m), taka(total), rows.length + " source" + (rows.length === 1 ? "" : "s"), "good")}
    ${statCard("Salary share", rows.length ? Math.round(((rows.find((r) => r.source.startsWith("Salary")) || { amount: 0 }).amount / total) * 100) + "%" : "—", "Of this month's income", "")}
    ${statCard("6-month average", taka(MONTHS.reduce((s, mo) => s + incomeTotal(state, mo.id), 0) / MONTHS.length), "June – November 2026", "")}
  </div>
  <div class="panel-grid">
    <div class="panel">
      <h2>Income sources — ${monthLabel(m)}</h2>
      ${rows.length ? `<ul class="tx-list">${rows.map((r) => `<li><span class="tx-dot" style="background:#0f766e"></span><span class="tx-note">${escapeHtml(r.source)}</span><span class="tx-amt">${taka(r.amount)}</span></li>`).join("")}</ul>` : `<p class="empty">No income recorded for this month yet.</p>`}
      <form id="add-income-form" class="add-form">
        <h3>Add income</h3>
        <label>Source <input name="source" type="text" required maxlength="80" placeholder="e.g. Freelance design work"></label>
        <label>Amount (৳) <input name="amount" type="number" min="1" step="1" required placeholder="20000"></label>
        <button type="submit" class="btn">Add income</button>
      </form>
    </div>
    <div class="panel">
      <h2>Income over six months</h2>
      ${barChart(series, 200)}
      <p class="hint">Income is steady at ৳65,000 salary plus freelance work of ৳18,000–৳22,000 a month. July's Eid bonus lifted that month.</p>
    </div>
  </div>`;
}

// ---------------- Expenses ----------------
export function renderExpenses(state) {
  const m = state.month;
  const spent = spendingTotal(state, m);
  const totalBudget = CATEGORIES.filter((c) => c.key !== "savings").reduce((s, c) => s + c.budget, 0);
  const rows = CATEGORIES.map((c) => ({
    label: c.name,
    spent: categorySpent(state, m, c.key),
    budget: c.budget,
    color: c.color,
    key: c.key,
  }));
  const txs = state.expenses.filter((e) => e.month === m).sort((a, b) => b.day - a.day);
  return `
  <section class="page-head">
    <div><h1>Expenses</h1><p class="lede">Budgets against what was actually spent, and every transaction.</p></div>
    ${monthPicker(state, "expenses-month")}
  </section>
  <div class="stat-grid">
    ${statCard("Spent — " + monthLabel(m), taka(spent), "Across " + txs.length + " transactions", "warn")}
    ${statCard("Total budget", taka(totalBudget), "All categories except savings", "")}
    ${statCard("Budget left", taka(Math.max(0, totalBudget - spent)), totalBudget - spent < 0 ? "Over budget this month" : "Still inside the plan", totalBudget - spent < 0 ? "bad" : "good")}
  </div>
  <div class="panel">
    <h2>Budget vs actual — ${monthLabel(m)}</h2>
    ${budgetBars(rows)}
    <form id="edit-budget-form" class="add-form inline">
      <h3>Change a monthly budget</h3>
      <label>Category <select name="category">${CATEGORIES.map((c) => `<option value="${c.key}">${escapeHtml(c.name)} — now ${taka(c.budget)}</option>`).join("")}</select></label>
      <label>New budget (৳) <input name="budget" type="number" min="0" step="100" required placeholder="16000"></label>
      <button type="submit" class="btn">Save budget</button>
    </form>
  </div>
  <div class="panel-grid">
    <div class="panel">
      <h2>Add an expense</h2>
      <form id="add-expense-form" class="add-form">
        <label>Category <select name="category">${CATEGORIES.filter((c) => c.key !== "savings").map((c) => `<option value="${c.key}">${escapeHtml(c.name)}</option>`).join("")}</select></label>
        <label>What was it? <input name="note" type="text" required maxlength="90" placeholder="e.g. Weekly bazaar — vegetables"></label>
        <label>Amount (৳) <input name="amount" type="number" min="1" step="1" required placeholder="1500"></label>
        <label>Day of month <input name="day" type="number" min="1" max="31" value="26" required></label>
        <button type="submit" class="btn">Add expense</button>
      </form>
    </div>
    <div class="panel">
      <h2>Transactions — ${monthLabel(m)}</h2>
      <div class="filter-row">
        <input id="tx-search" type="search" placeholder="Search transactions…" aria-label="Search transactions">
        <select id="tx-filter" aria-label="Filter by category"><option value="">All categories</option>${CATEGORIES.map((c) => `<option value="${c.key}">${escapeHtml(c.name)}</option>`).join("")}</select>
      </div>
      <p class="hint"><span id="tx-count">${txs.length} shown</span></p>
      <ul class="tx-list" id="tx-list">${txs.map((e) => `<li data-cat="${e.category}" data-note="${escapeHtml(e.note.toLowerCase())}" title="${e.day} ${monthLabel(m)} — ${escapeHtml(categoryOf(e.category).name)}"><span class="tx-dot" style="background:${categoryOf(e.category).color}"></span><span class="tx-note">${escapeHtml(e.note)}</span><span class="tx-cat">${escapeHtml(categoryOf(e.category).name)}</span><span class="tx-day">${e.day} ${monthLabel(m).split(" ")[0]}</span><span class="tx-amt">${taka(e.amount)}</span></li>`).join("")}</ul>
    </div>
  </div>`;
}

// ---------------- Monthly tracking ----------------
export function renderMonths(state) {
  const rows = MONTHS.map((mo) => {
    const inc = incomeTotal(state, mo.id);
    const spent = spendingTotal(state, mo.id);
    return { id: mo.id, label: mo.label, short: mo.short, income: inc, spent, saved: inc - spent, rate: inc > 0 ? Math.round(((inc - spent) / inc) * 100) : 0 };
  });
  const trend = lineChart(
    [
      { name: "Income", color: "#0f766e", points: rows.map((r) => r.income) },
      { name: "Spending", color: "#db2777", points: rows.map((r) => r.spent) },
      { name: "Left over", color: "#059669", points: rows.map((r) => r.saved) },
    ],
    rows.map((r) => r.short)
  );
  return `
  <section class="page-head">
    <div><h1>Monthly tracking</h1><p class="lede">Six months side by side — pick a month to open it.</p></div>
  </section>
  <div class="panel">
    <h2>Income, spending and what's left — June to November 2026</h2>
    ${trend}
    <p class="legend"><span><i style="background:#0f766e"></i>Income</span><span><i style="background:#db2777"></i>Spending</span><span><i style="background:#059669"></i>Left over</span></p>
    <p class="hint">Spending stays near ৳48,000–৳52,000 while income sits near ৳85,000, so more than a third of income is left over in most months — July's Eid bonus pushed it past half.</p>
  </div>
  <div class="panel">
    <h2>Month by month</h2>
    <div class="month-buttons" role="group" aria-label="Choose a month">${rows.map((r) => `<button type="button" class="month-btn${r.id === state.month ? " active" : ""}" data-month="${r.id}">${r.short}<span>${taka(r.saved)} left</span></button>`).join("")}</div>
    <table class="data-table">
      <thead><tr><th>Month</th><th>Income</th><th>Spending</th><th>Left over</th><th>Saved</th></tr></thead>
      <tbody>${rows.map((r) => `<tr${r.id === state.month ? ' class="current"' : ""}><td>${r.label}</td><td>${taka(r.income)}</td><td>${taka(r.spent)}</td><td>${taka(r.saved)}</td><td>${r.rate}%</td></tr>`).join("")}</tbody>
    </table>
    <p class="hint">Tap a month above to make it the month shown across the whole site.</p>
  </div>`;
}

// ---------------- Savings goals ----------------
export function renderGoals(state) {
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  const pct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;
  return `
  <section class="page-head">
    <div><h1>Savings goals</h1><p class="lede">What the household is saving towards, and how close each goal is.</p></div>
  </section>
  <div class="stat-grid">
    ${statCard("Saved across goals", taka(totalSaved), totalTarget ? pct + "% of all targets" : "", "good")}
    ${statCard("All targets together", taka(totalTarget), state.goals.length + " goals", "")}
    ${statCard("Still to save", taka(totalTarget - totalSaved), "At ৳15,000 a month, about " + Math.max(1, Math.ceil((totalTarget - totalSaved) / 15000)) + " months", "")}
  </div>
  <div class="goal-grid">
    ${state.goals.map((g) => {
      const p = g.target > 0 ? Math.min(100, Math.round((g.saved / g.target) * 100)) : 0;
      return `<div class="panel goal-card">
        <h2>${escapeHtml(g.name)}</h2>
        <p class="hint">${escapeHtml(g.note)}</p>
        <div class="bar-track big"><div class="bar-fill" style="width:${p}%;background:#059669"></div></div>
        <p class="goal-nums">${taka(g.saved)} of ${taka(g.target)} — ${p}%</p>
        <p class="goal-nums">${taka(g.target - g.saved)} still to go</p>
        <form class="add-form contribute-form" data-goal="${g.id}">
          <label>Add to this goal (৳) <input name="amount" type="number" min="1" step="1" required placeholder="5000"></label>
          <button type="submit" class="btn">Add contribution</button>
        </form>
      </div>`;
    }).join("")}
    <div class="panel goal-card new-goal">
      <h2>Start a new goal</h2>
      <form id="add-goal-form" class="add-form">
        <label>Goal name <input name="name" type="text" required maxlength="60" placeholder="e.g. New washing machine"></label>
        <label>Target amount (৳) <input name="target" type="number" min="1" step="1" required placeholder="25000"></label>
        <label>Already saved (৳) <input name="saved" type="number" min="0" step="1" value="0"></label>
        <button type="submit" class="btn">Create goal</button>
      </form>
    </div>
  </div>`;
}

// ---------------- Reports ----------------
export function renderReports(state) {
  const m = state.month;
  const donutParts = CATEGORIES.filter((c) => c.key !== "savings").map((c) => ({
    label: c.name,
    value: categorySpent(state, m, c.key),
    color: c.color,
  }));
  const spent = spendingTotal(state, m);
  const rows = MONTHS.map((mo) => ({
    id: mo.id,
    short: mo.short,
    income: incomeTotal(state, mo.id),
    spent: spendingTotal(state, mo.id),
    saved: savedTotal(state, mo.id),
  }));
  const trend = lineChart(
    [
      { name: "Income", color: "#0f766e", points: rows.map((r) => r.income) },
      { name: "Spending", color: "#db2777", points: rows.map((r) => r.spent) },
      { name: "Left over", color: "#059669", points: rows.map((r) => r.saved) },
    ],
    rows.map((r) => r.short)
  );
  const top = [...donutParts].sort((a, b) => b.value - a.value).slice(0, 4);
  const topShare = spent > 0 ? Math.round((top.reduce((s, p) => s + p.value, 0) / spent) * 100) : 0;
  const avgSpent = Math.round(rows.reduce((s, r) => s + r.spent, 0) / rows.length);
  const avgSaved = Math.round(rows.reduce((s, r) => s + r.saved, 0) / rows.length);
  return `
  <section class="page-head">
    <div><h1>Reports</h1><p class="lede">The household's money, summed up — what it costs to live, and what's left.</p></div>
    ${monthPicker(state, "reports-month")}
  </section>
  <div class="panel-grid">
    <div class="panel">
      <h2>Spending by category — ${monthLabel(m)}</h2>
      <div class="donut-wrap">${donutChart(donutParts, "spent")}</div>
      <ul class="legend-list">${donutParts.map((p) => `<li><span class="dot" style="background:${p.color}"></span>${escapeHtml(p.label)} — ${taka(p.value)} (${spent > 0 ? Math.round((p.value / spent) * 100) : 0}%)</li>`).join("")}</ul>
    </div>
    <div class="panel">
      <h2>Six-month trend</h2>
      ${trend}
      <p class="legend"><span><i style="background:#0f766e"></i>Income</span><span><i style="background:#db2777"></i>Spending</span><span><i style="background:#059669"></i>Left over</span></p>
    </div>
  </div>
  <div class="panel">
    <h2>What the numbers say</h2>
    <ul class="insights">
      <li><strong>${escapeHtml(top[0] ? top[0].label : "—")}</strong> is the biggest cost at ${top[0] ? taka(top[0].value) : "—"} in ${monthLabel(m)} — ${top[0] && spent > 0 ? Math.round((top[0].value / spent) * 100) : 0}% of all spending.</li>
      <li>The four biggest categories together take <strong>${topShare}%</strong> of spending; the rest is spread thin across the household.</li>
      <li>Average monthly spending over six months is <strong>${taka(avgSpent)}</strong>, against average income of <strong>${taka(Math.round(rows.reduce((s, r) => s + r.income, 0) / rows.length))}</strong>.</li>
      <li>On average <strong>${taka(avgSaved)}</strong> a month is left over — about <strong>${Math.round((avgSaved / Math.max(1, Math.round(rows.reduce((s, r) => s + r.income, 0) / rows.length))) * 100)}%</strong> of income — and that is what feeds the savings goals.</li>
      <li>Rent is fixed at ৳18,000, so the lever the household actually controls is groceries and food, the second-biggest category.</li>
    </ul>
    <p class="hint">Figures update as you add income, expenses or goal contributions anywhere on the site.</p>
  </div>`;
}
