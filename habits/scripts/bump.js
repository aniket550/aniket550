// Raises the app version everywhere it is shown. Run on every update:
//   npm run bump            1.1.0 -> 1.1.1  (fixes, small changes)
//   npm run bump -- minor   1.1.1 -> 1.2.0  (new features, redesigns)
//   npm run bump -- major   1.2.0 -> 2.0.0
// package.json is the source; this mirrors it into package-lock.json and www/version.js.
// Android reads package.json in build.gradle, the Mac build and the release page read it directly.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const pkgPath = path.join(root, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const part = process.argv[2] || "patch";
let [maj, min, pat] = pkg.version.split(".").map(Number);
if (part === "major") { maj++; min = 0; pat = 0; }
else if (part === "minor") { min++; pat = 0; }
else if (part === "patch") pat++;
else if (/^\d+\.\d+\.\d+$/.test(part)) [maj, min, pat] = part.split(".").map(Number);
else { console.error("Use patch, minor, major or an exact x.y.z"); process.exit(1); }
const version = maj + "." + min + "." + pat;

pkg.version = version;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
const lockPath = path.join(root, "package-lock.json");
const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
lock.version = version;
lock.packages[""].version = version;
fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2) + "\n");
fs.writeFileSync(path.join(root, "www", "version.js"), "// Written by scripts/bump.js. Do not edit.\nwindow.ROJ_VERSION = " + JSON.stringify(version) + ";\n");
console.log("version " + version + " (add it to CHANGELOG.md)");
