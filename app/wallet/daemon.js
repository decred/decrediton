import Promise from "promise";
import { ipcRenderer } from "electron";
import { isString } from "util";
import { withLog as log, logOptionNoResponseData } from "./app";

export const checkDecreditonVersion = log(() => Promise
  .resolve(ipcRenderer.sendSync("check-version"))
, "Check Decrediton release version");

export const startDaemon = log((appData, testnet) => Promise
  .resolve(ipcRenderer.sendSync("start-daemon", appData, testnet))
  .then(pid => {
    if (pid) return pid;
    throw "Error starting daemon";
  }), "Start Daemon");

export const deleteDaemonData = log((appData, testnet) => Promise
  .resolve(ipcRenderer.sendSync("delete-daemon", appData, testnet)), "Delete Daemon Data");

export const cleanShutdown = () => {
  return new Promise(resolve => {
    ipcRenderer.send("clean-shutdown");
    ipcRenderer.on("clean-shutdown-finished", (event, stopped) => {
      if(!stopped)
        throw "Error shutting down app";
      resolve(stopped);
    });
  });
};

export const setIsWatchingOnly = log( isWatchingOnly => Promise
  .resolve(ipcRenderer.sendSync("set-is-watching-only", isWatchingOnly))
  .then( saved => {
    if (saved) return saved;
    throw "Error opening wallet";
  }), "Set Watching Only");

export const getIsWatchingOnly = log( () => Promise
  .resolve(ipcRenderer.sendSync("get-is-watching-only"))
  .then( isWatchingOnly => {
    return isWatchingOnly;
  }), "Get Watching Only");

export const createNewWallet = log((walletPath, testnet) => Promise
  .resolve(ipcRenderer.sendSync("create-wallet", walletPath, testnet))
  .then(created => {
    if (created) return created;
    throw "Error creating wallet";
  }), "Create Wallet");

export const removeWallet = log((walletPath, testnet) => Promise
  .resolve(ipcRenderer.sendSync("remove-wallet", walletPath, testnet))
  .then(pid => {
    if (pid) return pid;
    throw "Error creating wallet";
  }), "Remove Wallet");

export const stopDaemon = log(() => Promise
  .resolve(ipcRenderer.sendSync("stop-daemon"))
  .then(stopped => {
    return stopped;
  }), "Stop Daemon");

export const stopWallet = log(() => Promise
  .resolve(ipcRenderer.sendSync("stop-wallet"))
  .then(stopped => {
    return stopped;
  }), "Stop Wallet");

export const startWallet = log((walletPath, testnet) => new Promise((resolve, reject) => {
  let pid, port;

  // resolveCheck must be done both on the dcrwallet-port event and on the
  // return of the sendSync call because we can't be certain which will happen first
  const resolveCheck = () => pid && port ? resolve({ pid, port }) : null;

  ipcRenderer.once("dcrwallet-port", (e, p) => { port = p; resolveCheck(); });
  pid = ipcRenderer.sendSync("start-wallet", walletPath, testnet);
  if (!pid) reject("Error starting wallet");
  resolveCheck();
}), "Start Wallet");

export const setPreviousWallet = log((cfg) => Promise
  .resolve(ipcRenderer.sendSync("set-previous-wallet", cfg))
, "Set Previous Wallet");

export const getPreviousWallet = log(() => Promise
  .resolve(ipcRenderer.sendSync("get-previous-wallet"))
, "Get Previous Wallet", logOptionNoResponseData());

export const getBlockCount = log((rpcCreds, testnet) => new Promise(resolve => {
  ipcRenderer.once("check-daemon-response", (e, info) => {
    const blockCount = isString(info.blockCount) ? parseInt(info.blockCount.trim()) : info.blockCount;
    const syncHeight = isString(info.syncHeight) ? parseInt(info.syncHeight.trim()) : info.syncHeight;
    resolve({ blockCount, syncHeight });
  });
  ipcRenderer.send("check-daemon", rpcCreds, testnet);
}), "Get Block Count");

export const getDaemonInfo = log((rpcCreds) => new Promise(resolve => {
  ipcRenderer.once("check-getinfo-response", (e, info) => {
    const isTestNet = info ? info.testnet : null;
    resolve({ isTestNet });
  });
  ipcRenderer.send("get-info", rpcCreds);
}), "Get Daemon network info");

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

export const getAvailableWallets = log((network) => Promise
  .resolve(ipcRenderer.sendSync("get-available-wallets", network))
  .then(availableWallets => {
    if (availableWallets) return availableWallets;
    throw "Error getting available wallets logs";
  }), "Get Available Wallets", logOptionNoResponseData());

export const reloadAllowedExternalRequests = log(() => Promise
  .resolve(ipcRenderer.sendSync("reload-allowed-external-request"))
, "Reload allowed external request");

export const allowExternalRequest = log(requestType => Promise
  .resolve(ipcRenderer.sendSync("allow-external-request", requestType))
, "Allow External Request");

export const allowStakePoolHost = log(host => Promise
  .resolve(ipcRenderer.sendSync("allow-stakepool-host", host))
, "Allow StakePool Host");

export const getDcrdLastLogLine = () => Promise
  .resolve(ipcRenderer.sendSync("get-last-log-line-dcrd"));

export const getDcrwalletLastLogLine = () => Promise
  .resolve(ipcRenderer.sendSync("get-last-log-line-dcrwallet"));
