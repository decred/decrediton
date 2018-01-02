import { ipcRenderer } from "electron";

export const onAppReloadRequested = cb => ipcRenderer.on("app-reload-requested", cb);

export const log = (level, ...args) => {
  ipcRenderer.send("main-log", ...[level, ...args]);
};
