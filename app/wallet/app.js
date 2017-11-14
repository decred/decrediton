import { ipcRenderer } from "electron";

export const onAppReloadRequested = cb => ipcRenderer.on("app-reload-requested", cb);
