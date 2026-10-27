// Renders every app icon from SVG with the preinstalled Playwright Chromium.
// Run once after changing the design: node scripts/icons.js
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
// The logo (same shapes as brandMark in www/app.js): a sunrise tile, the day as an arc,
// bright up to the sun and faint after it.
const tileFill = `<defs>
  <linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFC45C"/><stop offset=".55" stop-color="#F59A3A"/><stop offset="1" stop-color="#E5672E"/></linearGradient>
  <radialGradient id="h" cx=".3" cy="0" r=".9"><stop offset="0" stop-color="#FFF" stop-opacity=".45"/><stop offset=".6" stop-color="#FFF" stop-opacity="0"/></radialGradient></defs>`;
// cx, cy: centre of the arc; k: scale against the 1024 design.
function glyph(cx, cy, k, color) {
  const r = 270 * k, w = 92 * k, a = (50 * Math.PI) / 180;
  const sx = cx + r * Math.cos(a), sy = cy - r * Math.sin(a);
  return `<path d="M${sx} ${sy}A${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="none" stroke="${color}" stroke-opacity=".42" stroke-width="${w}" stroke-linecap="round"/>` +
    `<path d="M${cx - r} ${cy}A${r} ${r} 0 0 1 ${sx} ${sy}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>` +
    `<circle cx="${sx}" cy="${sy}" r="${122 * k}" fill="${color}" fill-opacity=".28"/><circle cx="${sx}" cy="${sy}" r="${80 * k}" fill="${color}"/>`;
}
const tile = (x, y, size, rx) => `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${rx}" fill="url(#b)"/><rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${rx}" fill="url(#h)"/>`;

const icons = {
  // macOS: 824px rounded square on a 1024 canvas, with the system-style drop shadow.
  mac: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${tileFill}
    <defs><filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-opacity="0.28"/></filter></defs>
    <g filter="url(#s)">${tile(100, 100, 824, 185)}</g>${glyph(512, 602, 0.8, "#FFF")}</svg>`,
  // Android legacy square and round icons.
  square: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${tileFill}${tile(32, 32, 960, 220)}${glyph(512, 625, 0.93, "#FFF")}</svg>`,
  round: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${tileFill}<circle cx="512" cy="512" r="480" fill="url(#b)"/><circle cx="512" cy="512" r="480" fill="url(#h)"/>${glyph(512, 615, 0.85, "#FFF")}</svg>`,
  // Adaptive icon: full-bleed gradient behind, the white glyph inside the central 66/108 safe zone.
  background: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${tileFill}<rect width="1024" height="1024" fill="url(#b)"/><rect width="1024" height="1024" fill="url(#h)"/></svg>`,
  foreground: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${glyph(512, 590, 0.72, "#FFF")}</svg>`,
  // Menu bar template image: black on transparent, macOS tints it. Too small for a sun on the arc, so it rises inside.
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
  out.push(["background", 108 * k, res + "ic_launcher_background.png"]);
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
