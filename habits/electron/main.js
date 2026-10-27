// Roz for Mac: the main window, the menu bar panel and the app menu.
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

function createMain() {
  mainWin = new BrowserWindow({
    width: 1180,
    height: 780,
    minWidth: 920,
    minHeight: 600,
    title: "Roz",
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
  tray.setToolTip("Roz");
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
    { role: "windowMenu" }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

ipcMain.handle("save-file", async (ev, name, text) => {
  const win = BrowserWindow.fromWebContents(ev.sender);
  const res = await dialog.showSaveDialog(win, {
    defaultPath: path.join(app.getPath("documents"), name),
    filters: [{ name: "Roz backup", extensions: ["json"] }]
  });
  if (res.canceled || !res.filePath) return false;
  await fs.promises.writeFile(res.filePath, text, "utf8");
  return true;
});

ipcMain.handle("open-file", async (ev) => {
  const win = BrowserWindow.fromWebContents(ev.sender);
  const res = await dialog.showOpenDialog(win, { properties: ["openFile"], filters: [{ name: "Roz backup", extensions: ["json"] }] });
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
  app.on("activate", showMain);
});

// On a Mac the app keeps running in the menu bar after the window closes.
app.on("window-all-closed", () => { if (!isMac) app.quit(); });
