import Promise from "promise";
import { ipcRenderer } from "electron";

export const startDaemon = (appData) => Promise
  .resolve(ipcRenderer.sendSync("start-daemon", appData))
  .then(pid => {
    if (pid) return pid;
    throw "Error starting daemon";
  });

export const stopDaemon = () => Promise
  .resolve(ipcRenderer.sendSync("stop-daemon"))
  .then(stopped => {
    if (!stopped) throw "Error stopping daemon";
  });

export const startWallet = () => Promise
  .resolve(ipcRenderer
    .sendSync("start-wallet"))
  .then(pid => {
    if (pid) return pid;
    throw "Error starting wallet";
  });

export const getBlockCount = (rpcCreds, appData) => Promise
  .resolve(ipcRenderer
    .sendSync("check-daemon", rpcCreds, appData));
