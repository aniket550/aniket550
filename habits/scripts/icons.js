// Renders every app icon from SVG with the preinstalled Playwright Chromium.
// Run once after changing the design: node scripts/icons.js
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const INK = "#1B1C20", SUN = "#E8962E";

// The Day Arc mark: a half circle (the day) with the sun on it. c = centre of the circle, all in a 1024 box.
function mark(cx, cy, r, w, ink, sun, sunR) {
  const a = (50 * Math.PI) / 180;
  const sx = cx + r * Math.cos(a), sy = cy - r * Math.sin(a);
  return `<path d="M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="none" stroke="${ink}" stroke-width="${w}" stroke-linecap="round"/>` +
    `<circle cx="${sx}" cy="${sy}" r="${sunR + w * 0.35}" fill="#FBF9F5"/><circle cx="${sx}" cy="${sy}" r="${sunR}" fill="${sun}"/>`;
}
const paper = `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBF9F5"/><stop offset="1" stop-color="#ECE7DF"/></linearGradient></defs>`;

const icons = {
  // macOS: 824px rounded square on a 1024 canvas, with the system-style drop shadow.
  mac: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${paper}
    <defs><filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-opacity="0.28"/></filter></defs>
    <rect x="100" y="100" width="824" height="824" rx="185" fill="url(#g)" filter="url(#s)"/>${mark(512, 640, 250, 74, INK, SUN, 66)}</svg>`,
  // Android legacy icon (rounded square) and round icon.
  square: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${paper}<rect x="32" y="32" width="960" height="960" rx="220" fill="url(#g)"/>${mark(512, 660, 300, 88, INK, SUN, 80)}</svg>`,
  round: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${paper}<circle cx="512" cy="512" r="480" fill="url(#g)"/>${mark(512, 650, 280, 84, INK, SUN, 74)}</svg>`,
  // Adaptive icon foreground: art must sit inside the central 66/108 safe zone.
  foreground: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${mark(512, 620, 236, 70, INK, SUN, 62)}</svg>`,
  // Menu bar template image: black on transparent, macOS tints it.
  // Too small for a sun on the arc, so it rises inside it.
  tray: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path d="M132 820 A380 380 0 0 1 892 820" fill="none" stroke="#000" stroke-width="140" stroke-linecap="round"/><circle cx="512" cy="700" r="140" fill="#000"/></svg>`
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
