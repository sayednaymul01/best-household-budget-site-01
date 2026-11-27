// main.js — router, state and interactions for Ghorer Hisab.
// State lives in memory and is mirrored to localStorage when the browser
// allows it; if storage is blocked the site still works fully in memory.
import { CATEGORIES, MONTHS, HOUSEHOLD, buildSeed } from "./data.js";
import {
  renderDashboard,
  renderIncome,
  renderExpenses,
  renderMonths,
  renderGoals,
  renderReports,
  monthLabel,
} from "./views.js";

const STORAGE_KEY = "ghorer-hisab-v1";
const ROUTES = {
  "": renderDashboard,
  income: renderIncome,
  expenses: renderExpenses,
  months: renderMonths,
  goals: renderGoals,
  reports: renderReports,
};
const TITLES = {
  "": "Dashboard",
  income: "Income",
  expenses: "Expenses",
  months: "Monthly tracking",
  goals: "Savings goals",
  reports: "Reports",
};

function defaultState() {
  const seed = buildSeed();
  return {
    month: HOUSEHOLD.month,
    budgets: Object.fromEntries(CATEGORIES.map((c) => [c.key, c.budget])),
    income: seed.income,
    expenses: seed.expenses,
    goals: seed.goals,
    nextTx: seed.expenses.length + 1,
    nextGoal: seed.goals.length + 1,
  };
}

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.expenses) || !parsed.income) return defaultState();
    const base = defaultState();
    return {
      ...base,
      ...parsed,
      budgets: { ...base.budgets, ...(parsed.budgets || {}) },
    };
  } catch {
    return defaultState();
  }
}

function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked: the in-memory state is still the truth.
  }
}

let state = loadState();

// Apply the live budgets into the category list the views read.
function syncBudgets() {
  for (const c of CATEGORIES) {
    if (typeof state.budgets[c.key] === "number") c.budget = state.budgets[c.key];
  }
}

function route() {
  const hash = window.location.hash.replace(/^#\/?/, "").split("?")[0];
  const key = ROUTES[hash] ? hash : "";
  return key;
}

function render() {
  syncBudgets();
  const key = route();
  const view = document.getElementById("view");
  view.innerHTML = ROUTES[key](state);
  document.title = "Ghorer Hisab — " + TITLES[key];
  for (const link of document.querySelectorAll(".nav-link")) {
    const target = link.getAttribute("href").replace(/^#\/?/, "");
    link.classList.toggle("active", target === key);
    link.setAttribute("aria-current", target === key ? "page" : "false");
  }
  wirePage(key);
  window.scrollTo(0, 0);
}

function monthSelects() {
  return document.querySelectorAll('select[id$="-month"]');
}

function wireMonthPickers() {
  for (const sel of monthSelects()) {
    sel.addEventListener("change", () => {
      if (MONTHS.some((m) => m.id === sel.value)) {
        state.month = sel.value;
        saveState(state);
        render();
      }
    });
  }
}

function numberField(form, name) {
  const el = form.elements[name];
  const v = Number(el.value);
  return Number.isFinite(v) ? v : NaN;
}

function wirePage(key) {
  wireMonthPickers();

  const incomeForm = document.getElementById("add-income-form");
  if (incomeForm) {
    incomeForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const source = incomeForm.elements.source.value.trim();
      const amount = numberField(incomeForm, "amount");
      if (!source || !(amount > 0)) return;
      (state.income[state.month] ||= []).push({ source, amount });
      saveState(state);
      render();
    });
  }

  const expenseForm = document.getElementById("add-expense-form");
  if (expenseForm) {
    expenseForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const category = expenseForm.elements.category.value;
      const note = expenseForm.elements.note.value.trim();
      const amount = numberField(expenseForm, "amount");
      const day = numberField(expenseForm, "day");
      if (!note || !(amount > 0) || !(day >= 1 && day <= 31)) return;
      state.expenses.push({
        id: "tx" + state.nextTx++,
        month: state.month,
        day: Math.floor(day),
        category,
        note,
        amount,
      });
      saveState(state);
      render();
    });
  }

  const budgetForm = document.getElementById("edit-budget-form");
  if (budgetForm) {
    budgetForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const category = budgetForm.elements.category.value;
      const budget = numberField(budgetForm, "budget");
      if (!(budget >= 0)) return;
      state.budgets[category] = budget;
      saveState(state);
      render();
    });
  }

  const search = document.getElementById("tx-search");
  const filter = document.getElementById("tx-filter");
  if (search && filter) {
    const apply = () => {
      const q = search.value.trim().toLowerCase();
      const cat = filter.value;
      let shown = 0;
      for (const li of document.querySelectorAll("#tx-list li")) {
        const ok =
          (!cat || li.dataset.cat === cat) &&
          (!q || li.dataset.note.includes(q));
        li.style.display = ok ? "" : "none";
        if (ok) shown++;
      }
      const count = document.getElementById("tx-count");
      if (count) count.textContent = shown + " shown";
    };
    search.addEventListener("input", apply);
    filter.addEventListener("change", apply);
  }

  for (const btn of document.querySelectorAll(".month-btn")) {
    btn.addEventListener("click", () => {
      state.month = btn.dataset.month;
      saveState(state);
      render();
    });
  }

  for (const form of document.querySelectorAll(".contribute-form")) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const amount = numberField(form, "amount");
      if (!(amount > 0)) return;
      const goal = state.goals.find((g) => g.id === form.dataset.goal);
      if (!goal) return;
      goal.saved += amount;
      state.expenses.push({
        id: "tx" + state.nextTx++,
        month: state.month,
        day: new Date().getDate(),
        category: "savings",
        note: "Contribution — " + goal.name,
        amount,
      });
      saveState(state);
      render();
    });
  }

  const goalForm = document.getElementById("add-goal-form");
  if (goalForm) {
    goalForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const name = goalForm.elements.name.value.trim();
      const target = numberField(goalForm, "target");
      const saved = numberField(goalForm, "saved") || 0;
      if (!name || !(target > 0) || saved < 0) return;
      state.goals.push({ id: "goal" + state.nextGoal++, name, target, saved, note: "Started " + monthLabel(state.month) });
      saveState(state);
      render();
    });
  }
}

window.addEventListener("hashchange", render);

// The footer button restores the sample household: clear the saved state
// and reload the seed data. It lives outside #view, so wire it once.
const resetBtn = document.getElementById("reset-data");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing stored, or storage blocked: in-memory state is reset anyway.
    }
    state = defaultState();
    render();
  });
}

render();
