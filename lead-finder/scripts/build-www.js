// Copies the web app into www/ for the Android app, plus one file with Capacitor and its plugins.
// The app has no bundler, so the plugins' browser builds are joined in load order
// (each defines a global such as capacitorHaptics, read by app.js).
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const www = path.join(root, "www");
const mod = (p) => path.join(root, "node_modules", p);

fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(path.join(www, "vendor"), { recursive: true });

const files = ["index.html", "styles.css", "app.js", "data.js", "version.js", "icon.svg", "icon-180.png", "icon-512.png", "manifest.webmanifest", "fonts/inter-latin.woff2"];
for (const f of files) {
  fs.mkdirSync(path.dirname(path.join(www, f)), { recursive: true });
  fs.copyFileSync(path.join(root, f), path.join(www, f));
}

const parts = [
  mod("@capacitor/core/dist/capacitor.js"),
  mod("@capacitor/synapse/dist/synapse.js"),
  "var synapse = outsystemsSynapse;", // the filesystem build expects this global name
  mod("@capacitor/haptics/dist/plugin.js"),
  mod("@capacitor/app/dist/plugin.js"),
  mod("@capacitor/app-launcher/dist/plugin.js"),
  mod("@capacitor/share/dist/plugin.js"),
  mod("@capacitor/filesystem/dist/plugin.js"),
];
const bundle = parts
  .map((p) => (p.endsWith(".js") ? fs.readFileSync(p, "utf8").replace(/\/\/# sourceMappingURL=.*$/m, "") : p))
  .join(";\n");
fs.writeFileSync(path.join(www, "vendor", "capacitor.js"), bundle);

// The web version doesn't load Capacitor; the app version loads it before everything else.
const indexPath = path.join(www, "index.html");
const html = fs.readFileSync(indexPath, "utf8");
if (!html.includes('<script src="version.js"></script>')) throw new Error("index.html: version.js script tag not found");
fs.writeFileSync(indexPath, html.replace('<script src="version.js"></script>', '<script src="vendor/capacitor.js"></script>\n  <script src="version.js"></script>'));
console.log("www/ built with", files.length, "files and vendor/capacitor.js");
