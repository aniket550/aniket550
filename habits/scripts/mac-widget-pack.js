// electron-builder afterPack: puts the WidgetKit widget (built from mac-widget/ by CI) inside
// the Mac app: the widget in Contents/PlugIns, its reload helper in Contents/MacOS.
// Without a built widget (a local build) the app is packed as before.
const fs = require("fs");
const path = require("path");

const built = path.join(__dirname, "..", "mac-widget", "build", "Release");

exports.default = async function (context) {
  if (context.electronPlatformName !== "darwin") return;
  const appex = path.join(built, "RojWidget.appex");
  if (!fs.existsSync(appex)) {
    console.log("  • no mac-widget build, packing without the widget");
    return;
  }
  const app = path.join(context.appOutDir, context.packager.appInfo.productFilename + ".app");
  fs.mkdirSync(path.join(app, "Contents", "PlugIns"), { recursive: true });
  fs.cpSync(appex, path.join(app, "Contents", "PlugIns", "RojWidget.appex"), { recursive: true, verbatimSymlinks: true });
  fs.copyFileSync(path.join(built, "RojWidgetReload"), path.join(app, "Contents", "MacOS", "RojWidgetReload"));
  fs.chmodSync(path.join(app, "Contents", "MacOS", "RojWidgetReload"), 0o755);
  console.log("  • added the Roj Habit widget");
};
