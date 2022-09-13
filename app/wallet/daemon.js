import { ipcRenderer } from "electron";
import { withLog as log, logOptionNoResponseData } from "./app";
import { isPlainString as isString } from "helpers/strings";
import { invoke } from "helpers/electronRenderer";

export const getHeightSynced = () => ipcRenderer.sendSync("get-height-synced");

export const checkDecreditonVersion = log(
  () => Promise.resolve(ipcRenderer.sendSync("check-version")),
  "Check Decrediton release version"
);

export const startDaemon = log(
  (params, testnet) => invoke("start-daemon", params, testnet),
  "Start Daemon"
);

export const deleteDaemonData = log(
  (appData, testnet) =>
    Promise.resolve(ipcRenderer.sendSync("delete-daemon", appData, testnet)),
  "Delete Daemon Data"
);

export const cleanShutdown = async () => {
  // FIXME: clean-shutdown currently never fails. Revise this.
  const stopped = await invoke("clean-shutdown");
  if (!stopped) throw "Error shutting down app";
  return stopped;
};

export const setIsWatchingOnly = log(
  (isWatchingOnly) =>
    Promise.resolve(
      ipcRenderer.sendSync("set-is-watching-only", isWatchingOnly)
    ).then((saved) => {
      if (saved) return saved;
      throw "Error opening wallet";
    }),
  "Set Watching Only"
);

export const getIsWatchingOnly = log(
  () =>
    Promise.resolve(ipcRenderer.sendSync("get-is-watching-only")).then(
      (isWatchingOnly) => {
        return isWatchingOnly;
      }
    ),
  "Get Watching Only"
);

export const createNewWallet = log(
  (walletPath, testnet) =>
    Promise.resolve(
      ipcRenderer.sendSync("create-wallet", walletPath, testnet)
    ).then((created) => {
      if (created) return created;
      throw "Error creating wallet";
    }),
  "Create Wallet"
);

export const removeWallet = log(
  (walletPath, testnet) =>
    Promise.resolve(
      ipcRenderer.sendSync("remove-wallet", walletPath, testnet)
    ).then((pid) => {
      if (pid) return pid;
      throw "Error removing wallet";
    }),
  "Remove Wallet"
);

export const stopDaemon = log(
  () =>
    Promise.resolve(ipcRenderer.sendSync("stop-daemon")).then((stopped) => {
      return stopped;
    }),
  "Stop Daemon"
);

export const stopWallet = log(
  () =>
    Promise.resolve(ipcRenderer.sendSync("stop-wallet")).then((stopped) => {
      return stopped;
    }),
  "Stop Wallet"
);

export const startWallet = log(
  (walletPath, testnet, rpcCreds, gapLimit, disableCoinTypeUpgrades) =>
    invoke(
      "start-wallet",
      walletPath,
      testnet,
      rpcCreds,
      gapLimit,
      disableCoinTypeUpgrades
    ),
  "Start Wallet"
);

export const setPreviousWallet = log(
  (cfg) => Promise.resolve(ipcRenderer.sendSync("set-previous-wallet", cfg)),
  "Set Previous Wallet"
);

export const getPreviousWallet = log(
  () => Promise.resolve(ipcRenderer.sendSync("get-previous-wallet")),
  "Get Previous Wallet",
  logOptionNoResponseData()
);

export const getBlockCount = log(async () => {
  const info = await invoke("check-daemon");
  const blockCount = isString(info.blockCount)
    ? parseInt(info.blockCount.trim())
    : info.blockCount;
  const syncHeight = isString(info.syncHeight)
    ? parseInt(info.syncHeight.trim())
    : info.syncHeight;

  return { blockCount, syncHeight };
}, "Get Block Count");

export const setHeightSynced = log(
  () =>
    Promise.resolve(ipcRenderer.sendSync("set-height-synced", true)).then(
      (saved) => {
        if (!saved) throw "Error set height saved";
        return;
      }
    ),
  "set height is synced"
);

export const getDaemonInfo = log(async (rpcCreds) => {
  const info = await invoke("daemon-getinfo", rpcCreds);
  const isTestnet = info ? info.testnet : null;
  return { isTestnet };
}, "Get Daemon network info");

export const getAvailableWallets = log(
  (network) =>
    Promise.resolve(
      ipcRenderer.sendSync("get-available-wallets", network)
    ).then((availableWallets) => {
      if (availableWallets) return availableWallets;
      throw "Error getting available wallets logs";
    }),
  "Get Available Wallets",
  logOptionNoResponseData()
);

export const getDcrwalletGrpcKeyCert = () =>
  ipcRenderer.sendSync("get-dcrwallet-grpc-cert-key");

export const reloadAllowedExternalRequests = log(
  () =>
    Promise.resolve(ipcRenderer.sendSync("reload-allowed-external-request")),
  "Reload allowed external request"
);

export const allowExternalRequest = log(
  (requestType) =>
    Promise.resolve(
      ipcRenderer.sendSync("allow-external-request", requestType)
    ),
  "Allow External Request"
);

export const connectDaemon = log(async (params) => {
  try {
    return await invoke("connect-daemon", params);
  } catch (error) {
    throw { connected: false, error: error.toString() };
  }
}, "Connect Daemon");

// TODO create a wallet/log and move those method not related to daemon to there.

export const cleanPrivacyLogs = () =>
  Promise.resolve(ipcRenderer.sendSync("clean-privacy-logs"));

export const getDcrdLastLogLine = () =>
  Promise.resolve(ipcRenderer.sendSync("get-last-log-line-dcrd"));

export const getDcrwalletLastLogLine = () =>
  Promise.resolve(ipcRenderer.sendSync("get-last-log-line-dcrwallet"));

export const getDcrlndLastLogLine = () =>
  Promise.resolve(ipcRenderer.sendSync("get-last-log-line-dcrlnd"));

export const getPrivacyLogs = () =>
  Promise.resolve(ipcRenderer.sendSync("get-privacy-logs"));

export const getDcrdLogs = () =>
  Promise.resolve(ipcRenderer.sendSync("get-dcrd-logs")).then((logs) => {
    if (logs) return logs;
    throw "Error getting dcrd logs";
  });

export const getDcrwalletLogs = () =>
  Promise.resolve(ipcRenderer.sendSync("get-dcrwallet-logs")).then((logs) => {
    if (logs) return logs;
    throw "Error getting dcrwallet logs";
  });

export const getDcrlndLogs = () =>
  Promise.resolve(ipcRenderer.sendSync("get-dcrlnd-logs")).then((logs) => {
    if (logs) return logs;
    throw "Error getting dcrlnd logs";
  });

export const getDecreditonLogs = () =>
  Promise.resolve(ipcRenderer.sendSync("get-decrediton-logs")).then((logs) => {
    if (logs) return logs;
    throw "Error getting decrediton logs";
  });

export const getDexLogs = (walletPath) =>
  Promise.resolve(ipcRenderer.sendSync("get-dex-logs", walletPath));
