// The small, fixed bridge the web app may use on the Mac.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("rozDesktop", {
  platform: process.platform,
  saveFile: (name, text) => ipcRenderer.invoke("save-file", name, text),
  openFile: () => ipcRenderer.invoke("open-file"),
  setTheme: (theme) => ipcRenderer.send("set-theme", theme),
  openMain: () => ipcRenderer.send("open-main"),
  onCommand: (cb) => ipcRenderer.on("command", (ev, cmd) => cb(cmd)),
  widgetState: () => ipcRenderer.invoke("widget-state"),
  toggleWidget: () => ipcRenderer.invoke("widget-toggle"),
  widgetMenu: () => ipcRenderer.send("widget-menu"),
  syncInfo: () => ipcRenderer.invoke("sync-info"),
  setSync: (on) => ipcRenderer.invoke("sync-set", on),
  newSyncCode: () => ipcRenderer.invoke("sync-newcode"),
  widgetSnapshot: (snap) => ipcRenderer.send("widget-snapshot", snap),
  macVersion: process.platform === "darwin" && process.getSystemVersion ? process.getSystemVersion() : ""
});

if (process.platform === "darwin") {
  window.addEventListener("DOMContentLoaded", () => document.documentElement.classList.add("mac-app"));
}
