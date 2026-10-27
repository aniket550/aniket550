// Renders every app icon from SVG with the preinstalled Playwright Chromium.
// Run once after changing the design: node scripts/icons.js
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const BLUE = "#3F82CC", CLAY = "#C96A42", SAGE = "#4F8C63";

// Three arcs of the Day Ring. r: radius, w: stroke, all in a 1024 box centred at c.
function arcs(c, r, w, colors) {
  const circ = 2 * Math.PI * r, seg = circ / 3 - (w + 0.07 * r);
  return colors.map((col, i) => {
    const off = -(i * circ / 3) - (circ / 3 - seg) / 2;
    return `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="${seg} ${circ}" stroke-dashoffset="${off}" transform="rotate(-90 ${c} ${c})"/>`;
  }).join("");
}
const paper = `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBF9F5"/><stop offset="1" stop-color="#ECE7DF"/></linearGradient></defs>`;

const icons = {
  // macOS: 824px rounded square on a 1024 canvas, with the system-style drop shadow.
  mac: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${paper}
    <defs><filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-opacity="0.28"/></filter></defs>
    <rect x="100" y="100" width="824" height="824" rx="185" fill="url(#g)" filter="url(#s)"/>${arcs(512, 238, 76, [BLUE, CLAY, SAGE])}</svg>`,
  // Android legacy icon (rounded square) and round icon.
  square: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${paper}<rect x="32" y="32" width="960" height="960" rx="220" fill="url(#g)"/>${arcs(512, 290, 90, [BLUE, CLAY, SAGE])}</svg>`,
  round: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${paper}<circle cx="512" cy="512" r="480" fill="url(#g)"/>${arcs(512, 270, 86, [BLUE, CLAY, SAGE])}</svg>`,
  // Adaptive icon foreground: art must sit inside the central 66/108 safe zone.
  foreground: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${arcs(512, 248, 80, [BLUE, CLAY, SAGE])}</svg>`,
  // Menu bar template image: black on transparent, macOS tints it.
  tray: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${arcs(512, 380, 150, ["#000", "#000", "#000"])}</svg>`
};

const out = [
  ["mac", 1024, "build/icon.png"],
  ["tray", 16, "electron/trayTemplate.png"],
  ["tray", 32, "electron/trayTemplate@2x.png"]
];
const dens = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
for (const [d, k] of Object.entries(dens)) {
  const res = "android/app/src/main/res/mipmap-" + d + "/";
  out.push(["square", 48 * k, res + "ic_launcher.png"]);
  out.push(["round", 48 * k, res + "ic_launcher_round.png"]);
  out.push(["foreground", 108 * k, res + "ic_launcher_foreground.png"]);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const [name, size, file] of out) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${icons[name]}`);
    await page.screenshot({ path: path.join(root, file), omitBackground: true });
  }
  await browser.close();
  console.log("wrote " + out.length + " icons");
})();
