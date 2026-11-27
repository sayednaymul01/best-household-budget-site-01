// Ghorer Hisab — seed data for a sample Dhaka household.
// All figures are in Bangladeshi Taka (৳). One row per transaction:
// [month, day, category, note, amount].
// Categories: rent, groceries, transport, utilities, education, health,
// entertainment, savings. "savings" rows are money moved to a goal, not spending.

export const HOUSEHOLD = {
  name: "The Rahman household",
  city: "Dhaka",
  members: 4,
  currency: "৳",
  month: "2026-11",
};

export const CATEGORIES = [
  { key: "rent", name: "Rent", budget: 18000, color: "#0f766e", hint: "House rent, Mirpur" },
  { key: "groceries", name: "Groceries & Food", budget: 16000, color: "#16a34a", hint: "Bazaar, fish, meat, rice" },
  { key: "transport", name: "Transport", budget: 6000, color: "#0284c7", hint: "Bus, rickshaw, CNG, fuel" },
  { key: "utilities", name: "Utilities", budget: 5500, color: "#d97706", hint: "Electricity, gas, water, internet" },
  { key: "education", name: "Education", budget: 8000, color: "#7c3aed", hint: "School fees, books, tuition" },
  { key: "health", name: "Health", budget: 4000, color: "#db2777", hint: "Medicine, doctor, tests" },
  { key: "entertainment", name: "Entertainment", budget: 3500, color: "#ea580c", hint: "Outings, streaming, Eid gifts" },
  { key: "savings", name: "Savings", budget: 15000, color: "#059669", hint: "Moved to savings goals" },
];

export const MONTHS = [
  { id: "2026-06", label: "June 2026", short: "Jun" },
  { id: "2026-07", label: "July 2026", short: "Jul" },
  { id: "2026-08", label: "August 2026", short: "Aug" },
  { id: "2026-09", label: "September 2026", short: "Sep" },
  { id: "2026-10", label: "October 2026", short: "Oct" },
  { id: "2026-11", label: "November 2026", short: "Nov" },
];

// Monthly income: [month, source, amount]
export const INCOME_ROWS = [
  ["2026-06", "Salary — accounts officer", 65000],
  ["2026-06", "Freelance design work", 18000],
  ["2026-07", "Salary — accounts officer", 65000],
  ["2026-07", "Freelance design work", 21000],
  ["2026-07", "Eid bonus", 12000],
  ["2026-08", "Salary — accounts officer", 65000],
  ["2026-08", "Freelance design work", 19500],
  ["2026-09", "Salary — accounts officer", 65000],
  ["2026-09", "Freelance design work", 22000],
  ["2026-10", "Salary — accounts officer", 65000],
  ["2026-10", "Freelance design work", 20000],
  ["2026-10", "Old phone sold", 6500],
  ["2026-11", "Salary — accounts officer", 65000],
  ["2026-11", "Freelance design work", 20000],
];

export const EXPENSE_ROWS = [
  // ---- June 2026 ----
  ["2026-06", 1, "rent", "House rent — Mirpur, 2-bed flat", 18000],
  ["2026-06", 2, "groceries", "Karwan Bazar — rice 25 kg, oil, spices", 3850],
  ["2026-06", 4, "transport", "Monthly bus pass + rickshaw", 2400],
  ["2026-06", 6, "groceries", "Fish & chicken — weekly shop", 1980],
  ["2026-06", 7, "utilities", "Electricity bill (DESCO)", 2350],
  ["2026-06", 8, "education", "School fees — two children", 6000],
  ["2026-06", 9, "groceries", "Vegetables, eggs, milk", 1640],
  ["2026-06", 12, "health", "Pharmacy — fever medicine", 850],
  ["2026-06", 14, "groceries", "Eid groceries — meat, sweets", 4200],
  ["2026-06", 15, "entertainment", "Eid outing — family lunch out", 2800],
  ["2026-06", 18, "utilities", "Gas + water bill", 1450],
  ["2026-06", 20, "transport", "CNG & rickshaw fares", 1750],
  ["2026-06", 22, "groceries", "Weekly bazaar — vegetables, fruit", 1890],
  ["2026-06", 25, "education", "Tuition — maths teacher", 2000],
  ["2026-06", 27, "utilities", "Broadband internet (monthly)", 1200],
  ["2026-06", 28, "savings", "Moved to emergency fund", 10000],
  // ---- July 2026 ----
  ["2026-07", 1, "rent", "House rent — Mirpur, 2-bed flat", 18000],
  ["2026-07", 3, "groceries", "Karwan Bazar — rice, lentils, oil", 3620],
  ["2026-07", 5, "transport", "Monthly bus pass + rickshaw", 2350],
  ["2026-07", 7, "utilities", "Electricity bill (DESCO)", 2480],
  ["2026-07", 8, "education", "School fees — two children", 6000],
  ["2026-07", 10, "groceries", "Fish, chicken & vegetables", 2210],
  ["2026-07", 13, "health", "Dental check-up — daughter", 1500],
  ["2026-07", 16, "groceries", "Weekly bazaar — fruit, eggs", 1780],
  ["2026-07", 18, "utilities", "Gas + water bill", 1420],
  ["2026-07", 21, "transport", "CNG fares — office trips", 1980],
  ["2026-07", 24, "groceries", "Monthly dry goods top-up", 2140],
  ["2026-07", 25, "education", "Tuition — maths teacher", 2000],
  ["2026-07", 26, "entertainment", "Cinema — family movie night", 1650],
  ["2026-07", 27, "utilities", "Broadband internet (monthly)", 1200],
  ["2026-07", 29, "savings", "Moved to emergency fund", 12000],
  // ---- August 2026 ----
  ["2026-08", 1, "rent", "House rent — Mirpur, 2-bed flat", 18000],
  ["2026-08", 2, "groceries", "Karwan Bazar — rice 25 kg, oil", 3710],
  ["2026-08", 5, "transport", "Monthly bus pass + rickshaw", 2500],
  ["2026-08", 7, "utilities", "Electricity bill (DESCO)", 2610],
  ["2026-08", 8, "education", "School fees — two children", 6000],
  ["2026-08", 11, "groceries", "Fish & meat — weekly shop", 2340],
  ["2026-08", 14, "health", "Eye test + new glasses", 3200],
  ["2026-08", 17, "groceries", "Vegetables, eggs, milk", 1720],
  ["2026-08", 19, "utilities", "Gas + water bill", 1480],
  ["2026-08", 22, "transport", "CNG & rickshaw fares", 1820],
  ["2026-08", 24, "groceries", "Weekly bazaar — fruit, spices", 1960],
  ["2026-08", 25, "education", "Tuition — maths teacher", 2000],
  ["2026-08", 26, "entertainment", "Streaming + books", 1150],
  ["2026-08", 27, "utilities", "Broadband internet (monthly)", 1200],
  ["2026-08", 30, "savings", "Moved to emergency fund", 11000],
  // ---- September 2026 ----
  ["2026-09", 1, "rent", "House rent — Mirpur, 2-bed flat", 18000],
  ["2026-09", 3, "groceries", "Karwan Bazar — rice, oil, lentils", 3580],
  ["2026-09", 5, "transport", "Monthly bus pass + rickshaw", 2450],
  ["2026-09", 7, "utilities", "Electricity bill (DESCO)", 2290],
  ["2026-09", 8, "education", "School fees — two children", 6000],
  ["2026-09", 10, "groceries", "Fish, chicken & vegetables", 2080],
  ["2026-09", 13, "health", "Pharmacy — vitamins, first aid", 940],
  ["2026-09", 16, "groceries", "Weekly bazaar — fruit, eggs", 1830],
  ["2026-09", 18, "utilities", "Gas + water bill", 1440],
  ["2026-09", 21, "transport", "CNG fares — office trips", 1760],
  ["2026-09", 24, "groceries", "Monthly dry goods top-up", 2010],
  ["2026-09", 25, "education", "Tuition + exam fees", 2600],
  ["2026-09", 26, "entertainment", "Family day out — zoo trip", 2100],
  ["2026-09", 27, "utilities", "Broadband internet (monthly)", 1200],
  ["2026-09", 29, "savings", "Moved to emergency fund", 13000],
  // ---- October 2026 ----
  ["2026-10", 1, "rent", "House rent — Mirpur, 2-bed flat", 18000],
  ["2026-10", 2, "groceries", "Karwan Bazar — rice 25 kg, oil", 3690],
  ["2026-10", 4, "transport", "Monthly bus pass + rickshaw", 2550],
  ["2026-10", 7, "utilities", "Electricity bill (DESCO)", 2420],
  ["2026-10", 8, "education", "School fees — two children", 6000],
  ["2026-10", 11, "groceries", "Fish & chicken — weekly shop", 2260],
  ["2026-10", 14, "health", "Doctor visit — check-up", 1800],
  ["2026-10", 17, "groceries", "Vegetables, eggs, milk", 1790],
  ["2026-10", 19, "utilities", "Gas + water bill", 1470],
  ["2026-10", 22, "transport", "CNG & rickshaw fares", 1890],
  ["2026-10", 24, "groceries", "Weekly bazaar — fruit, spices", 1920],
  ["2026-10", 25, "education", "Tuition — maths teacher", 2000],
  ["2026-10", 26, "entertainment", "Streaming + family dinner out", 2400],
  ["2026-10", 27, "utilities", "Broadband internet (monthly)", 1200],
  ["2026-10", 30, "savings", "Moved to education fund", 12000],
  // ---- November 2026 (current month) ----
  ["2026-11", 1, "rent", "House rent — Mirpur, 2-bed flat", 18000],
  ["2026-11", 2, "groceries", "Karwan Bazar — rice 25 kg, oil, spices", 3780],
  ["2026-11", 3, "transport", "Monthly bus pass + rickshaw", 2400],
  ["2026-11", 5, "groceries", "Fish & chicken — weekly shop", 2140],
  ["2026-11", 7, "utilities", "Electricity bill (DESCO)", 2380],
  ["2026-11", 8, "education", "School fees — two children", 6000],
  ["2026-11", 9, "groceries", "Vegetables, eggs, milk", 1690],
  ["2026-11", 11, "health", "Pharmacy — cough syrup, vitamins", 1120],
  ["2026-11", 13, "groceries", "Weekly bazaar — fruit, dates", 1870],
  ["2026-11", 15, "entertainment", "Family movie night + snacks", 1950],
  ["2026-11", 17, "transport", "CNG fares — office trips", 1640],
  ["2026-11", 18, "utilities", "Gas + water bill", 1450],
  ["2026-11", 20, "groceries", "Monthly dry goods top-up", 2080],
  ["2026-11", 22, "education", "Tuition — maths teacher", 2000],
  ["2026-11", 24, "utilities", "Broadband internet (monthly)", 1200],
  ["2026-11", 25, "savings", "Moved to emergency fund", 12000],
];

// Savings goals: [name, target, saved, note]
export const GOAL_ROWS = [
  ["Emergency fund", 100000, 62500, "Six months of rent, for hard times"],
  ["Children's education fund", 200000, 85000, "School and university ahead"],
  ["New fridge", 45000, 12000, "Replace the old one before summer"],
  ["Eid & family festivals", 30000, 18000, "Gifts, food and new clothes"],
];

// Monthly totals implied by the rows above (income / spending excl. savings
// / left over / moved to goals), for a quick check against the site:
//   2026-06: 83000 / 52360 / 30640 / 10000   2026-09: 87000 / 48280 / 38720 / 13000
//   2026-07: 98000 / 48330 / 49670 / 12000   2026-10: 91500 / 49390 / 42110 / 12000
//   2026-08: 84500 / 49690 / 34810 / 11000   2026-11: 85000 / 49700 / 35300 / 12000
// Goals hold ৳177,500 saved against ৳375,000 of targets (47%).
export function buildSeed() {
  const income = {};
  for (const [month, source, amount] of INCOME_ROWS) {
    (income[month] ||= []).push({ source, amount });
  }
  const expenses = EXPENSE_ROWS.map(([month, day, category, note, amount], i) => ({
    id: "tx" + (i + 1),
    month,
    day,
    category,
    note,
    amount,
  }));
  const goals = GOAL_ROWS.map(([name, target, saved, note], i) => ({
    id: "goal" + (i + 1),
    name,
    target,
    saved,
    note,
  }));
  return { income, expenses, goals };
}
