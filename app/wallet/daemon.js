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
  .resolve(ipcRenderer.sendSync("check-daemon", rpcCreds, appData))
  .then(block => parseInt(block.trim()));

export const getDcrdLogs = () => Promise
  .resolve(ipcRenderer.sendSync("get-dcrd-logs"))
  .then(logs => {
    if (logs) return logs;
    throw "Error getting dcrd logs";
  });

export const getDcrwalletLogs = () => Promise
  .resolve(ipcRenderer.sendSync("get-dcrwallet-logs"))
  .then(logs => {
    if (logs) return logs;
    throw "Error getting dcrwallet logs";
  });

export const getDecreditonLogs = () => Promise
    .resolve(ipcRenderer.sendSync("get-decrediton-logs"))
    .then(logs => {
      if (logs) return logs;
      throw "Error getting decrediton logs";
    });
