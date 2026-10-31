// Renders the picture Android shows for the Roj Habit widget in the widget picker.
// It mirrors android/app/src/main/res/layout/widget_today.xml with example habits.
// Run once after changing the widget's look: node scripts/widget-preview.js
const { chromium } = require("playwright");
const path = require("path");

const out = path.join(__dirname, "..", "android/app/src/main/res/drawable-nodpi/widget_preview.png");

// Segmented ring like RojWidget.ring(): one piece per habit, marigold as it fills.
function ring(fracs, size, stroke) {
  const r = (size - stroke) / 2, c = size / 2, circ = 2 * Math.PI * r, n = fracs.length;
  const gap = stroke + 4, seg = circ / n - gap;
  return fracs.map((f, i) => {
    const off = -(i * (seg + gap)) - gap / 2;
    return `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="rgba(232,150,46,.22)" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${seg} ${circ}" stroke-dashoffset="${off}" transform="rotate(-90 ${c} ${c})"/>` +
      (f ? `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="#E8962E" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${seg * f} ${circ}" stroke-dashoffset="${off}" transform="rotate(-90 ${c} ${c})"/>` : "");
  }).join("");
}
function bubble(color, state) {
  if (state === "done") return `<svg width="22" height="22"><circle cx="11" cy="11" r="11" fill="${color}"/><path d="M6.4 11.4l3.3 3.1 6.2-6.6" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  if (state) { // a count habit part way: a faint ring, the filled share and the count
    const circ = 2 * Math.PI * 10, f = state[0] / state[1];
    return `<svg width="22" height="22"><circle cx="11" cy="11" r="10" fill="none" stroke="${color}" stroke-opacity=".25" stroke-width="2"/><circle cx="11" cy="11" r="10" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-dasharray="${circ * f} ${circ}" transform="rotate(-90 11 11)"/><text x="11" y="11" text-anchor="middle" dominant-baseline="central" font-size="9.5" font-weight="700" fill="#17181B">${state[0]}</text></svg>`;
  }
  return `<svg width="22" height="22"><circle cx="11" cy="11" r="10" fill="none" stroke="${color}" stroke-opacity=".7" stroke-width="2"/></svg>`;
}
const habits = [
  ["Walk 8,000 steps", "#3F8F8C", ""],
  ["Read 10 pages", "#C2704B", ""],
  ["Drink water", "#4C84BC", [5, 8], "5/8"],
  ["Meditate", "#7F72BE", "done"],
  ["Sleep by 11", "#626875", "done"]
];

const html = `<!doctype html><html><head><style>
  body { margin: 0; background: transparent; font-family: Roboto, "Inter", system-ui, sans-serif; }
  .w { width: 330px; padding: 16px; border-radius: 26px; background: #FCFAF6; box-sizing: border-box; }
  .head { display: flex; align-items: center; gap: 14px; }
  .ring { position: relative; width: 60px; height: 60px; display: grid; place-items: center; }
  .ring svg { position: absolute; inset: 0; }
  .ring b { position: relative; font-size: 15px; color: #17181B; }
  .date { font-size: 11px; font-weight: 500; letter-spacing: .1em; color: #77736B; }
  .title { margin-top: 2px; font-size: 20px; font-weight: 700; letter-spacing: -.02em; color: #17181B; }
  .title .d { color: #A85B0C; } .title .l { color: #A9A49B; }
  .rows { margin-top: 10px; }
  .row { display: flex; align-items: center; height: 34px; gap: 12px; }
  .row span { flex: 1; font-size: 14px; font-weight: 500; color: #17181B; }
  .row.done span { color: #77736B; }
  .row em { font-style: normal; font-size: 12px; font-weight: 500; color: #77736B; }
</style></head><body><div class="w">
  <div class="head"><div class="ring"><svg width="60" height="60">${ring([0, 0, 0.62, 1, 1], 60, 6.5)}</svg><b>40%</b></div>
  <div><div class="date">SATURDAY 31 OCT</div><div class="title"><span class="d">2</span> down, <span class="l">3</span> to go.</div></div></div>
  <div class="rows">${habits.map((h) => `<div class="row${h[2] === "done" ? " done" : ""}">${bubble(h[1], h[2])}<span>${h[0]}</span>${h[3] ? `<em>${h[3]}</em>` : ""}</div>`).join("")}</div>
</div></body></html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  await page.setContent(html);
  await page.locator(".w").screenshot({ path: out, omitBackground: true });
  await browser.close();
  console.log("written", path.relative(process.cwd(), out));
})();
