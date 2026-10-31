// Renders every app icon from SVG with the preinstalled Playwright Chromium.
// Run once after changing the design: node scripts/icons.js
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
// The logo comes from www/brand.js, the same code the app draws its header mark with.
const B = require("../www/brand.js");
const defs = "<defs>" + B.paperDefs("i") + "</defs>";
const strokes = (cx, cy, r, w, ink) => '<g filter="url(#ir)">' + B.ring(cx, cy, r, w, ink) + "</g>";

const icons = {
  // macOS: 824px rounded square on a 1024 canvas, with the system-style drop shadow.
  mac: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${defs}
    <defs><filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-opacity="0.26"/></filter></defs>
    <g filter="url(#s)">${B.tile("i", 100, 100, 824, 185)}</g>${strokes(512, 512, 240, 94)}</svg>`,
  // Android legacy square and round icons.
  square: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${defs}${B.tile("i", 32, 32, 960, 220)}${strokes(512, 512, 282, 108)}</svg>`,
  round: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${defs}<circle cx="512" cy="512" r="480" fill="url(#ip)"/><circle cx="512" cy="512" r="480" fill="#000" filter="url(#ig)"/>${strokes(512, 512, 262, 100)}</svg>`,
  // Adaptive icon: paper behind, the strokes inside the central 66/108 safe zone.
  background: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${defs}${B.tile("i", 0, 0, 1024, 0)}</svg>`,
  foreground: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${defs}${strokes(512, 512, 222, 86)}</svg>`,
  // Menu bar template image: black on transparent, macOS tints it.
  tray: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${defs}${strokes(512, 512, 360, 170, "#000")}</svg>`
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
