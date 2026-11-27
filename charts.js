// charts.js — small hand-rolled SVG chart builders. No libraries.
// Every builder takes plain data and returns an SVG string. All numbers
// are formatted by the caller; these functions only draw.

function esc(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Donut: parts = [{label, value, color}]. Centre shows the total.
export function donutChart(parts, totalLabel, size = 220) {
  const total = parts.reduce((s, p) => s + p.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const inner = r - 26;
  const hole = size / 2 - 26;
  let angle = -Math.PI / 2;
  let arcs = "";
  for (const p of parts) {
    if (p.value <= 0 || total <= 0) continue;
    const frac = p.value / total;
    const a0 = angle;
    const a1 = angle + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1);
    const yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0);
    const yi0 = cy + inner * Math.sin(a0);
    arcs += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${p.color}"><title>${esc(p.label)} — ${esc(p.value.toLocaleString("en-IN"))}</title></path>`;
    angle = a1;
  }
  const totalText = total.toLocaleString("en-IN");
  return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category donut chart" class="chart-svg">${arcs}<circle cx="${cx}" cy="${cy}" r="${hole - 6}" fill="none"/><text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-total">৳${totalText}</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" class="donut-label">${esc(totalLabel)}</text></svg>`;
}

// Vertical bars: values = [{label, value, color}]. Good for monthly totals.
export function barChart(values, height = 180, maxValue = 0) {
  const width = 560;
  const padL = 8;
  const padB = 26;
  const padT = 12;
  const max = maxValue || Math.max(...values.map((v) => v.value), 1);
  const slot = (width - padL * 2) / values.length;
  const barW = Math.min(56, slot * 0.62);
  let bars = "";
  let labels = "";
  let valueLabels = "";
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    const h = Math.max(2, ((height - padT - padB) * v.value) / max);
    const x = padL + slot * i + (slot - barW) / 2;
    const y = height - padB - h;
    bars += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW}" height="${h.toFixed(1)}" rx="4" fill="${v.color}"><title>${esc(v.label)} — ৳${v.value.toLocaleString("en-IN")}</title></rect>`;
    valueLabels += `<text x="${(x + barW / 2).toFixed(1)}" y="${(y - 4).toFixed(1)}" text-anchor="middle" class="chart-value">৳${Math.round(v.value / 1000)}k</text>`;
    labels += `<text x="${(padL + slot * i + slot / 2).toFixed(1)}" y="${height - 8}" text-anchor="middle" class="chart-label">${esc(v.label)}</text>`;
  }
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Bar chart" class="chart-svg" preserveAspectRatio="xMidYMid meet">${bars}${valueLabels}${labels}</svg>`;
}

// Line chart with up to three series: series = [{name, color, points: [numbers]}],
// labels = x-axis labels. Draws a grid, the lines and dots.
export function lineChart(series, labels, height = 200) {
  const width = 560;
  const padL = 46;
  const padR = 12;
  const padT = 14;
  const padB = 28;
  const all = series.flatMap((s) => s.points);
  const max = Math.max(...all, 1);
  const top = Math.ceil(max / 10000) * 10000;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const x = (i) => padL + (innerW * i) / (labels.length - 1 || 1);
  const y = (v) => padT + innerH * (1 - v / top);
  let grid = "";
  for (let g = 0; g <= 4; g++) {
    const gy = padT + (innerH * g) / 4;
    const val = Math.round((top * (4 - g)) / 4 / 1000);
    grid += `<line x1="${padL}" y1="${gy}" x2="${width - padR}" y2="${gy}" class="grid-line"/><text x="${padL - 6}" y="${gy + 4}" text-anchor="end" class="chart-label">${val}k</text>`;
  }
  let lines = "";
  let dots = "";
  for (const s of series) {
    const pts = s.points.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
    lines += `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
    s.points.forEach((v, i) => {
      dots += `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="3.5" fill="${s.color}"><title>${esc(s.name)} ${esc(labels[i])} — ৳${v.toLocaleString("en-IN")}</title></circle>`;
    });
  }
  let xlabels = "";
  labels.forEach((lab, i) => {
    xlabels += `<text x="${x(i).toFixed(1)}" y="${height - 8}" text-anchor="middle" class="chart-label">${esc(lab)}</text>`;
  });
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Trend line chart" class="chart-svg" preserveAspectRatio="xMidYMid meet">${grid}${lines}${dots}${xlabels}</svg>`;
}

// Horizontal budget bars: rows = [{label, spent, budget, color}].
// Returns a list of labelled bars with spent vs budget text.
export function budgetBars(rows) {
  return rows
    .map((r) => {
      const pct = r.budget > 0 ? Math.min(100, Math.round((r.spent / r.budget) * 100)) : 0;
      const over = r.spent > r.budget;
      return `<div class="budget-row"><div class="budget-head"><span class="budget-name"><span class="dot" style="background:${r.color}"></span>${esc(r.label)}</span><span class="budget-nums">৳${r.spent.toLocaleString("en-IN")} of ৳${r.budget.toLocaleString("en-IN")}</span></div><div class="bar-track"><div class="bar-fill${over ? " over" : ""}" style="width:${pct}%;background:${r.color}"></div></div><div class="budget-pct">${pct}% used${over ? " — over budget" : ""}</div></div>`;
    })
    .join("");
}
