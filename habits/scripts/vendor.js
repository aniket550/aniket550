// Bundles Capacitor and its plugins into www/vendor/capacitor.js.
// The app has no bundler, so the plugins' browser builds are joined in load order.
const fs = require("fs");
const path = require("path");

const mod = (p) => path.join(__dirname, "..", "node_modules", p);
const parts = [
  mod("@capacitor/core/dist/capacitor.js"),
  mod("@capacitor/synapse/dist/synapse.js"),
  "var synapse = outsystemsSynapse;", // the filesystem build expects this global name
  mod("@capacitor/preferences/dist/plugin.js"),
  mod("@capacitor/haptics/dist/plugin.js"),
  mod("@capacitor/app/dist/plugin.js"),
  mod("@capacitor/share/dist/plugin.js"),
  mod("@capacitor/filesystem/dist/plugin.js")
];

const out = parts
  .map((p) => (p.endsWith(".js") ? fs.readFileSync(p, "utf8").replace(/\/\/# sourceMappingURL=.*$/m, "") : p))
  .join(";\n");
fs.mkdirSync(path.join(__dirname, "..", "www", "vendor"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "..", "www", "vendor", "capacitor.js"), out);
console.log("www/vendor/capacitor.js written");
