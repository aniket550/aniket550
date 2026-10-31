// electron-builder afterSign: electron-builder signs the widget's binary but not with the
// widget's entitlements, and macOS only loads widgets that run in the sandbox. So sign the
// widget again with mac-widget/Widget/RojWidget.entitlements, then reseal the app around it.
// Both are ad-hoc signatures ("-"), like the rest of the app.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

exports.default = async function (context) {
  if (context.electronPlatformName !== "darwin") return;
  const app = path.join(context.appOutDir, context.packager.appInfo.productFilename + ".app");
  const appex = path.join(app, "Contents", "PlugIns", "RojWidget.appex");
  if (!fs.existsSync(appex)) return;
  const entitlements = path.join(__dirname, "..", "mac-widget", "Widget", "RojWidget.entitlements");
  const run = (args) => execFileSync("codesign", args, { stdio: "inherit" });
  run(["--force", "--sign", "-", "--timestamp=none", "--entitlements", entitlements, appex]);
  run(["--force", "--sign", "-", "--timestamp=none", "--preserve-metadata=entitlements,requirements,flags,runtime", app]);
  run(["--verify", "--deep", "--strict", app]);
  console.log("  • signed the widget with its sandbox entitlements");
};
