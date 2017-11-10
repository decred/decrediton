import Promise from "promise";
import { ipcRenderer } from "electron";

export const startDaemon = (appData) => Promise
  .resolve(ipcRenderer.sendSync("start-daemon", appData))
  .then(pid => {
    if (pid) return pid;
    throw "Error starting daemon";
  });

export const cleanShutdown = () => Promise
  .resolve(ipcRenderer.send("clean-shutdown"))
  .then(stopped => {
    if (!stopped) throw "Error shutting down app";
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
