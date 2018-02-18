import Promise from "promise";
import { ipcRenderer } from "electron";
import { isString } from "util";
import { withLog as log, logOptionNoResponseData } from "./app";

export const startDaemon = log((walletPath, appData, testnet) => Promise
  .resolve(ipcRenderer.sendSync("start-daemon", walletPath, appData, testnet))
  .then(pid => {
    if (pid) return pid;
    throw "Error starting daemon";
  }), "Start Daemon");

export const cleanShutdown = log(() => Promise
  .resolve(ipcRenderer.send("clean-shutdown"))
  .then(stopped => {
    if (!stopped) throw "Error shutting down app";
  }), "Clean Shutdown");

export const createNewWallet = log((walletPath, testnet) => Promise
  .resolve(ipcRenderer.sendSync("create-wallet", walletPath, testnet))
  .then(pid => {
    if (pid) return pid;
    throw "Error creating wallet";
  }), "Create Wallet");

export const removeWallet = log((walletPath, testnet) => Promise
  .resolve(ipcRenderer.sendSync("remove-wallet", walletPath, testnet))
  .then(pid => {
    if (pid) return pid;
    throw "Error creating wallet";
  }), "Remove Wallet");

export const startWallet = log((walletPath, testnet) => new Promise((resolve, reject) => {
  let pid, port;

  // resolveCheck must be done both on the dcrwallet-port event and on the
  // return of the sendSync call because we can't be certain which will happen first
  const resolveCheck = () => pid && port ? resolve({pid, port}) : null;

  ipcRenderer.once("dcrwallet-port", (e, p) => { port = p; resolveCheck(); });
  pid = ipcRenderer.sendSync("start-wallet", walletPath, testnet);
  if (!pid) reject("Error starting wallet");
  resolveCheck();
}), "Start Wallet");

export const getBlockCount = log((walletPath, rpcCreds, testnet) => Promise
  .resolve(ipcRenderer.sendSync("check-daemon", walletPath, rpcCreds, testnet))
  .then(block => isString(block) ? parseInt(block.trim()) : block)
  , "Get Block Count");

export const getDcrdLogs = log(() => Promise
  .resolve(ipcRenderer.sendSync("get-dcrd-logs"))
  .then(logs => {
    if (logs) return logs;
    throw "Error getting Hxd logs";
}), "Get Hxd Logs", logOptionNoResponseData());

export const getDcrwalletLogs = log(() => Promise
  .resolve(ipcRenderer.sendSync("get-dcrwallet-logs"))
  .then(logs => {
    if (logs) return logs;
    throw "Error getting Hxwallet logs";
}), "Get Hxwallet Logs", logOptionNoResponseData());

export const getDecreditonLogs = log(() => Promise
  .resolve(ipcRenderer.sendSync("get-decrediton-logs"))
  .then(logs => {
    if (logs) return logs;
    throw "Error getting Hxify logs";
}), "Get Hxify Logs", logOptionNoResponseData());

export const getAvailableWallets = log(() => Promise
  .resolve(ipcRenderer.sendSync("get-available-wallets"))
  .then(availableWallets => {
    if (availableWallets) return availableWallets;
    throw "Error getting avaiable wallets logs";
  }), "Get Available Wallets", logOptionNoResponseData());
