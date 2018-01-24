import Promise from "promise";
import { ipcRenderer } from "electron";
import { isString } from "util";
import { withLog as log, logOptionNoResponseData } from "./app";

export const startDaemon = log((appData) => Promise
  .resolve(ipcRenderer.sendSync("start-daemon", appData))
  .then(pid => {
    if (pid) return pid;
    throw "Error starting daemon";
  }), "Start Daemon");

export const cleanShutdown = log(() => Promise
  .resolve(ipcRenderer.send("clean-shutdown"))
  .then(stopped => {
    if (!stopped) throw "Error shutting down app";
  }), "Clean Shutdown");

export const startWallet = log(() => Promise
  .resolve(ipcRenderer
    .sendSync("start-wallet"), "default-wallet", true)
  .then(pid => {
    if (pid) return pid;
    throw "Error starting wallet";
  }), "Start Wallet");

export const getBlockCount = log((rpcCreds, appData) => Promise
  .resolve(ipcRenderer.sendSync("check-daemon", "default-wallet", rpcCreds, appData))
  .then(block => isString(block) ? parseInt(block.trim()) : block)
  , "Get Block Count");

export const getDcrdLogs = log(() => Promise
  .resolve(ipcRenderer.sendSync("get-dcrd-logs"))
  .then(logs => {
    if (logs) return logs;
    throw "Error getting dcrd logs";
  }), "Get Dcrd Logs", logOptionNoResponseData());

export const getDcrwalletLogs = log(() => Promise
  .resolve(ipcRenderer.sendSync("get-dcrwallet-logs"))
  .then(logs => {
    if (logs) return logs;
    throw "Error getting dcrwallet logs";
  }), "Get Dcrwallet Logs", logOptionNoResponseData());

export const getDecreditonLogs = log(() => Promise
    .resolve(ipcRenderer.sendSync("get-decrediton-logs"))
    .then(logs => {
      if (logs) return logs;
      throw "Error getting decrediton logs";
    }), "Get Decrediton Logs", logOptionNoResponseData());

export const getAvailableWallets = log(() => Promise
    .resolve(ipcRenderer.sendSync("get-available-wallets"))
    .then(availableWallets => {
      if (availableWallets) return availableWallets;
      throw "Error getting avaiable wallets logs";
    }), "Get Available Wallets", logOptionNoResponseData());
