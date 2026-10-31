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
  widgetSize: (height) => ipcRenderer.send("widget-size", height),
  widgetMenu: () => ipcRenderer.send("widget-menu")
});

if (process.platform === "darwin") {
  window.addEventListener("DOMContentLoaded", () => document.documentElement.classList.add("mac-app"));
}
