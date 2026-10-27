// Builds one self-contained HTML file (CSS, JS and font inlined) with example
// data, for previewing the design in a browser. Output: dist/preview.html
const fs = require("fs");
const path = require("path");

const www = (f) => fs.readFileSync(path.join(__dirname, "..", "www", f));
const font = "data:font/woff2;base64," + www("fonts/inter-latin.woff2").toString("base64");
const css = www("styles.css").toString().replace('url("fonts/inter-latin.woff2")', 'url("' + font + '")');
const html = [
  "<title>Roj Habit</title>",
  '<meta name="claude:viewport-fit-sides" content="cover">',
  "<style>" + css + "</style>",
  '<div id="app"></div>',
  "<script>window.ROZ_DEMO = true;</script>",
  "<script>" + www("core.js") + "</script>",
  "<script>" + www("app.js") + "</script>"
].join("\n");
fs.mkdirSync(path.join(__dirname, "..", "dist"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "..", "dist", "preview.html"), html);
console.log("dist/preview.html written (" + Math.round(html.length / 1024) + " KB)");
