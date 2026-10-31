// Roj Habit for Mac: the main window, the menu bar panel, the desktop widget and the app menu.
const { app, BrowserWindow, Menu, Tray, ipcMain, dialog, nativeImage, nativeTheme, protocol, net, screen, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const { pathToFileURL } = require("url");

const WWW = path.join(__dirname, "..", "www");
const isMac = process.platform === "darwin";

// Serve the app from app://roz/ so both windows share one origin (and one localStorage).
protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: { standard: true, secure: true, supportFetchAPI: true } }]);

let mainWin = null;
let trayWin = null;
let tray = null;
let widgetWin = null;

function createMain() {
  mainWin = new BrowserWindow({
    width: 1180,
    height: 780,
    minWidth: 920,
    minHeight: 600,
    title: "Roj Habit",
    show: false,
    titleBarStyle: isMac ? "hiddenInset" : "default",
    trafficLightPosition: { x: 18, y: 18 },
    vibrancy: isMac ? "sidebar" : undefined,
    visualEffectState: "followWindow",
    backgroundColor: isMac ? "#00000000" : "#F4F1EC",
    webPreferences: { preload: path.join(__dirname, "preload.js"), contextIsolation: true, sandbox: true }
  });
  mainWin.loadURL("app://roz/index.html");
  mainWin.once("ready-to-show", () => mainWin.show());
  mainWin.on("closed", () => { mainWin = null; });
  mainWin.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: "deny" }; });
}

function showMain() {
  if (!mainWin) createMain();
  else { mainWin.show(); mainWin.focus(); }
}

// Menu bar panel: today's habits, one click away.
function createTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, "trayTemplate.png"));
  icon.setTemplateImage(true);
  tray = new Tray(icon);
  tray.setToolTip("Roj Habit");
  trayWin = new BrowserWindow({
    width: 340,
    height: 460,
    show: false,
    frame: false,
    resizable: false,
    movable: false,
    fullscreenable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    vibrancy: isMac ? "popover" : undefined,
    backgroundColor: isMac ? "#00000000" : "#F4F1EC",
    webPreferences: { preload: path.join(__dirname, "preload.js"), contextIsolation: true, sandbox: true }
  });
  trayWin.loadURL("app://roz/index.html#tray");
  trayWin.on("blur", () => trayWin.hide());
  tray.on("click", () => {
    if (trayWin.isVisible()) { trayWin.hide(); return; }
    const b = tray.getBounds();
    const area = screen.getDisplayNearestPoint({ x: b.x, y: b.y }).workArea;
    const [w] = trayWin.getSize();
    const x = Math.min(Math.max(area.x + 8, Math.round(b.x + b.width / 2 - w / 2)), area.x + area.width - w - 8);
    trayWin.setPosition(x, Math.round(b.y + b.height + 4));
    trayWin.webContents.reload(); // the day may have changed since it was last opened
    trayWin.show();
    trayWin.focus();
  });
}

// Desktop widget: a small card with today's habits, in three sizes. It remembers its size, where it was put and
// whether it was on, in widget.json next to the app's data.
const widgetFile = () => path.join(app.getPath("userData"), "widget.json");
function widgetPrefs() {
  try { return JSON.parse(fs.readFileSync(widgetFile(), "utf8")) || {}; } catch (e) { return {}; }
}
function saveWidgetPrefs(change) {
  try { fs.writeFileSync(widgetFile(), JSON.stringify(Object.assign(widgetPrefs(), change))); } catch (e) { /* not worth stopping for */ }
}

// Apple's widget sizes on the Mac.
const WIDGET_SIZES = { small: [170, 170], medium: [364, 170], large: [364, 382] };
const widgetSize = (p) => (WIDGET_SIZES[p.size] ? p.size : "medium");

function createWidget() {
  const p = widgetPrefs();
  const [w, h] = WIDGET_SIZES[widgetSize(p)];
  const area = screen.getPrimaryDisplay().workArea;
  // A saved spot on a screen that is no longer attached would leave the widget out of sight.
  const onScreen = p.x != null && screen.getAllDisplays().some((d) => {
    const a = d.workArea;
    return p.x + 40 > a.x && p.x + 40 < a.x + a.width && p.y + 20 > a.y && p.y + 20 < a.y + a.height;
  });
  widgetWin = new BrowserWindow({
    width: w,
    height: h,
    x: onScreen ? p.x : area.x + area.width - w - 20,
    y: onScreen ? p.y : area.y + 20,
    show: false,
    frame: false,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    alwaysOnTop: !!p.onTop,
    // Clear window: the page draws the card, so it can have widget-round corners.
    transparent: true,
    hasShadow: true,
    backgroundColor: "#00000000",
    webPreferences: { preload: path.join(__dirname, "preload.js"), contextIsolation: true, sandbox: true }
  });
  if (isMac) widgetWin.setVisibleOnAllWorkspaces(true, { skipTransformProcessType: true });
  widgetWin.loadURL("app://roz/index.html#widget/" + widgetSize(p));
  widgetWin.once("ready-to-show", () => {
    widgetWin.showInactive();
    if (isMac) widgetWin.invalidateShadow();
  });
  widgetWin.on("moved", () => {
    const [x, y] = widgetWin.getPosition();
    saveWidgetPrefs({ x: x, y: y });
  });
  widgetWin.on("closed", () => { widgetWin = null; });
}

function resizeWidget(size) {
  if (!widgetWin || !WIDGET_SIZES[size]) return;
  saveWidgetPrefs({ size: size });
  widgetWin.setContentSize(WIDGET_SIZES[size][0], WIDGET_SIZES[size][1]);
  widgetWin.loadURL("app://roz/index.html#widget/" + size);
  if (isMac) setTimeout(() => widgetWin && widgetWin.invalidateShadow(), 300);
}

function setWidget(on) {
  saveWidgetPrefs({ show: on });
  if (on && !widgetWin) createWidget();
  if (!on && widgetWin) widgetWin.close();
  const item = Menu.getApplicationMenu() && Menu.getApplicationMenu().getMenuItemById("widget");
  if (item) item.checked = on;
  if (mainWin) mainWin.webContents.send("command", on ? "widget-on" : "widget-off");
  return on;
}

function send(cmd) {
  showMain();
  mainWin.webContents.send("command", cmd);
}

function buildMenu() {
  const template = [
    ...(isMac ? [{ role: "appMenu" }] : []),
    {
      label: "File",
      submenu: [
        { label: "New Habit", accelerator: "CmdOrCtrl+N", click: () => send("new-habit") },
        { type: "separator" },
        { label: "Export Backup…", accelerator: "CmdOrCtrl+E", click: () => send("export") },
        { label: "Import Backup…", click: () => send("import") },
        { type: "separator" },
        { role: "close" }
      ]
    },
    { role: "editMenu" },
    {
      label: "View",
      submenu: [
        { label: "Today", accelerator: "CmdOrCtrl+1", click: () => send("today") },
        { label: "Progress", accelerator: "CmdOrCtrl+2", click: () => send("progress") },
        { label: "Habits", accelerator: "CmdOrCtrl+3", click: () => send("habits") },
        { label: "Settings", accelerator: "CmdOrCtrl+,", click: () => send("settings") },
        { type: "separator" },
        { label: "Previous Day", accelerator: "CmdOrCtrl+[", click: () => send("prev-day") },
        { label: "Next Day", accelerator: "CmdOrCtrl+]", click: () => send("next-day") },
        { type: "separator" },
        { role: "togglefullscreen" },
        ...(app.isPackaged ? [] : [{ role: "toggleDevTools" }])
      ]
    },
    {
      role: "window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        { type: "separator" },
        { label: "Desktop Widget", id: "widget", type: "checkbox", checked: !!widgetPrefs().show, click: (item) => setWidget(item.checked) },
        { type: "separator" },
        { role: "front" }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

ipcMain.handle("save-file", async (ev, name, text) => {
  const win = BrowserWindow.fromWebContents(ev.sender);
  const res = await dialog.showSaveDialog(win, {
    defaultPath: path.join(app.getPath("documents"), name),
    filters: [{ name: "Roj Habit backup", extensions: ["json"] }]
  });
  if (res.canceled || !res.filePath) return false;
  await fs.promises.writeFile(res.filePath, text, "utf8");
  return true;
});

ipcMain.handle("open-file", async (ev) => {
  const win = BrowserWindow.fromWebContents(ev.sender);
  const res = await dialog.showOpenDialog(win, { properties: ["openFile"], filters: [{ name: "Roj Habit backup", extensions: ["json"] }] });
  if (res.canceled || !res.filePaths.length) return null;
  return fs.promises.readFile(res.filePaths[0], "utf8");
});

ipcMain.on("set-theme", (ev, theme) => {
  nativeTheme.themeSource = theme === "light" || theme === "dark" ? theme : "system";
});

ipcMain.on("open-main", () => {
  if (trayWin) trayWin.hide();
  showMain();
});

ipcMain.handle("widget-state", () => !!widgetWin);
ipcMain.handle("widget-toggle", () => setWidget(!widgetWin));

ipcMain.on("widget-menu", (ev) => {
  if (!widgetWin || ev.sender !== widgetWin.webContents) return;
  const size = widgetSize(widgetPrefs());
  Menu.buildFromTemplate([
    { label: "Open Roj Habit", click: showMain },
    { type: "separator" },
    ...["small", "medium", "large"].map((s) => ({ label: s[0].toUpperCase() + s.slice(1), type: "radio", checked: size === s, click: () => resizeWidget(s) })),
    { type: "separator" },
    { label: "Keep on Top", type: "checkbox", checked: widgetWin.isAlwaysOnTop(), click: (item) => { widgetWin.setAlwaysOnTop(item.checked); saveWidgetPrefs({ onTop: item.checked }); } },
    { type: "separator" },
    { label: "Hide Widget", click: () => setWidget(false) }
  ]).popup({ window: widgetWin });
});

app.whenReady().then(() => {
  protocol.handle("app", (req) => {
    const { pathname } = new URL(req.url);
    const file = path.normalize(path.join(WWW, decodeURIComponent(pathname)));
    if (!file.startsWith(WWW + path.sep)) return new Response("Not found", { status: 404 });
    return net.fetch(pathToFileURL(file).toString());
  });
  buildMenu();
  createMain();
  if (isMac) createTray();
  if (widgetPrefs().show) createWidget();
  app.on("activate", showMain);
});

// On a Mac the app keeps running in the menu bar after the window closes.
app.on("window-all-closed", () => { if (!isMac) app.quit(); });
