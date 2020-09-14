import fs from "fs-extra";
import path from "path";
import { createLogger } from "./logging";
import { getWalletPath, getWalletDb, getDcrdPath } from "./paths";
import { initWalletCfg, newWalletConfigCreation, getWalletCfg } from "config";
import {
  launchDCRD,
  launchDCRWallet,
  GetDcrwPID,
  closeDCRD,
  closeDCRW,
  GetDcrwPort,
  launchDCRLnd,
  GetDcrlndPID,
  GetDcrlndCreds,
  closeDcrlnd,
  setDcrdRpcCredentials
} from "./launch";
import { MAINNET } from "constants";

const logger = createLogger();
let watchingOnlyWallet;
let dcrdIsRemote;

// getAvailableWallets attempts to find all currently available wallet.db's
// in the respective network direction in each wallets data dir.
export const getAvailableWallets = (network) => {
  const availableWallets = [];
  const isTestNet = network !== MAINNET;

  const walletsBasePath = getWalletPath(isTestNet);
  const walletDirs = fs.readdirSync(walletsBasePath);
  walletDirs.forEach((wallet) => {
    const walletDirStat = fs.statSync(path.join(walletsBasePath, wallet));
    if (!walletDirStat.isDirectory()) return;

    const cfg = getWalletCfg(isTestNet, wallet);
    const lastAccess = cfg.get("lastaccess");
    const watchingOnly = cfg.get("iswatchonly");
    const isTrezor = cfg.get("trezor");
    const isPrivacy = cfg.get("mixedaccount");
    const walletDbFilePath = getWalletDb(isTestNet, wallet);
    const finished = fs.pathExistsSync(walletDbFilePath);
    availableWallets.push({
      network,
      wallet,
      finished,
      lastAccess,
      watchingOnly,
      isTrezor,
      isPrivacy
    });
  });

  return availableWallets;
};

export const deleteDaemon = (appData, testnet) => {
  let removeDaemonDirectory = getDcrdPath();
  if (appData) removeDaemonDirectory = appData;
  const removeDaemonDirectoryData = path.join(
    removeDaemonDirectory,
    "data",
    testnet ? "testnet3" : MAINNET
  );
  try {
    if (fs.pathExistsSync(removeDaemonDirectoryData)) {
      fs.removeSync(removeDaemonDirectoryData);
      logger.log("info", "removing " + removeDaemonDirectoryData);
    }
    return true;
  } catch (e) {
    logger.log("error", "error deleting daemon data: " + e);
    return false;
  }
};

// startDaemon checks for rpc credentials parameters, which are
// { rpcuser, rpcpass, rpccert, rpchost, rpcport }, if they are defined
// dcrdIsRemote is set to true. Otherwise startDaemon checks for appdata
// parameter and if it is defined startDaemon launches dcrd with appdata's
// value if it is valid.
// startDaemon returns an object of format:
// { appdata, rpc_user, rpc_pass, rpc_cert, rpc_host, rpc_port }
export const startDaemon = async (params, testnet, reactIPC) => {
  if (dcrdIsRemote) {
    logger.log(
      "info",
      "Skipping restart of daemon as it is connected as remote"
    );
    return;
  }

  try {
    const rpcCreds = params && params.rpcCreds;
    if (rpcCreds) {
      setDcrdRpcCredentials(rpcCreds);
      dcrdIsRemote = true;
      logger.log("info", "dcrd is connected as remote");
      return rpcCreds;
    }

    const appdata = params && params.appdata;
    const started = await launchDCRD(reactIPC, testnet, appdata);
    return started;
  } catch (err) {
    logger.log("error", "error launching dcrd: " + err);
    return { err };
  }
};

export const createWallet = (testnet, walletPath) => {
  const newWalletDirectory = getWalletPath(testnet, walletPath);
  try {
    if (!fs.pathExistsSync(newWalletDirectory)) {
      fs.mkdirsSync(newWalletDirectory);

      // create new configs for new wallet
      initWalletCfg(testnet, walletPath);
      newWalletConfigCreation(testnet, walletPath);
    }
    return true;
  } catch (e) {
    logger.log("error", "error creating wallet: " + e);
    return false;
  }
};

export const removeWallet = (testnet, walletPath) => {
  if (!walletPath) return;
  const removeWalletDirectory = getWalletPath(testnet, walletPath);
  try {
    if (fs.pathExistsSync(removeWalletDirectory)) {
      fs.removeSync(removeWalletDirectory);
      return true;
    }
    return false;
  } catch (e) {
    logger.log("error", "error creating wallet: " + e);
    return false;
  }
};

export const startWallet = (
  mainWindow,
  daemonIsAdvanced,
  testnet,
  walletPath,
  reactIPC
) => {
  if (GetDcrwPID()) {
    logger.log("info", "dcrwallet already started " + GetDcrwPID());
    mainWindow.webContents.send("dcrwallet-port", GetDcrwPort());
    return GetDcrwPID();
  }
  initWalletCfg(testnet, walletPath);
  try {
    return launchDCRWallet(
      mainWindow,
      daemonIsAdvanced,
      walletPath,
      testnet,
      reactIPC
    );
  } catch (e) {
    logger.log("error", "error launching dcrwallet: " + e);
  }
};

export const startDcrlnd = async (
  walletAccount,
  walletPort,
  rpcCreds,
  walletPath,
  testnet,
  autopilotEnabled
) => {
  if (GetDcrlndPID() && GetDcrlndPID() !== -1) {
    logger.log(
      "info",
      "Skipping restart of dcrlnd as it is already running " + GetDcrlndPID()
    );
    const creds = GetDcrlndCreds();
    return { wasRunning: true, ...creds };
  }

  try {
    const started = await launchDCRLnd(
      walletAccount,
      walletPort,
      rpcCreds,
      walletPath,
      testnet,
      autopilotEnabled
    );
    return started;
  } catch (e) {
    logger.log("error", "error launching dcrlnd: " + e);
    return e;
  }
};

export const stopDaemon = () => {
  return closeDCRD();
};

export const stopWallet = () => {
  return closeDCRW();
};

export const stopDcrlnd = () => {
  return closeDcrlnd();
};

export const removeDcrlnd = (walletName, testnet) => {
  const walletPath = getWalletPath(testnet, walletName);
  const dcrlndRoot = path.join(walletPath, "dcrlnd");
  try {
    if (fs.pathExistsSync(dcrlndRoot)) {
      fs.removeSync(dcrlndRoot);
      return true;
    }
    return false;
  } catch (e) {
    logger.log("error", "error removing dcrlnd dir: " + e);
    return false;
  }
};

export const lnScbInfo = (walletPath, testnet) => {
  const netPath = testnet ? "testnet" : "mainnet";
  const dcrlndRoot = path.join(walletPath, "dcrlnd");
  const chainRoot = path.join(dcrlndRoot, "data", "chain", "decred", netPath);
  const channelBackupPath = path.join(chainRoot, "channel.backup");
  const scbFstat = fs.statSync(channelBackupPath);
  const channelBackupMTime = scbFstat.mtime;
  return { channelBackupPath, channelBackupMTime };
};

export const setWatchingOnlyWallet = (isWatchingOnly) => {
  watchingOnlyWallet = isWatchingOnly;
};

export const getWatchingOnlyWallet = () => watchingOnlyWallet;
