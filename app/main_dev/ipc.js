import fs from "fs-extra";
import path from "path";
import { createLogger } from "./logging";
import { getWalletPath, getWalletDBPathFromWallets, getDcrdPath } from "./paths";
import { initWalletCfg, newWalletConfigCreation, getWalletCfg, readDcrdConfig } from "../config";
import { launchDCRD, launchDCRWallet, GetDcrdPID, GetDcrwPID, closeDCRD, closeDCRW, GetDcrwPort } from "./launch";

const logger = createLogger();
let watchingOnlyWallet;

export const getAvailableWallets = (network) => {
  // Attempt to find all currently available wallet.db's in the respective network direction in each wallets data dir
  const availableWallets = [];
  const isTestNet = network !== "mainnet";

  const walletsBasePath = getWalletPath(isTestNet);
  const walletDirs = fs.readdirSync(walletsBasePath);
  walletDirs.forEach(wallet => {
    const walletDirStat = fs.statSync(path.join(walletsBasePath, wallet));
    if (!walletDirStat.isDirectory()) return;

    const cfg = getWalletCfg(isTestNet, wallet);
    const lastAccess = cfg.get("lastaccess");
    const watchingOnly = cfg.get("iswatchonly");
    const isTrezor = cfg.get("trezor");
    const walletDbFilePath = getWalletDBPathFromWallets(isTestNet, wallet);
    const finished = fs.pathExistsSync(walletDbFilePath);
    availableWallets.push({ network, wallet, finished, lastAccess, watchingOnly, isTrezor });
  });

  return availableWallets;
};

export const deleteDaemon = (appData, testnet) => {
  let removeDaemonDirectory = getDcrdPath();
  if (appData) removeDaemonDirectory = appData;
  let removeDaemonDirectoryData = path.join(removeDaemonDirectory, "data", testnet ? "testnet3" : "mainnet");
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

export const startDaemon = async (params, testnet) => {
  if (GetDcrdPID() && GetDcrdPID() !== -1) {
    logger.log("info", "Skipping restart of daemon as it is already running " + GetDcrdPID());
    const appdata = params ? params.appdata : null;
    const newConfig = readDcrdConfig(appdata, testnet);

    newConfig.pid =  GetDcrdPID();
    return newConfig;
  }

  try {
    const started = await launchDCRD(params, testnet);
    return started;
  } catch (err) {
    logger.log("error", "error launching dcrd: " + err);
    return { err };
  }
};

export const createWallet = (testnet, walletPath) => {
  const newWalletDirectory = getWalletPath(testnet, walletPath);
  try {
    if (!fs.pathExistsSync(newWalletDirectory)){
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
  let removeWalletDirectory = getWalletPath(testnet, walletPath);
  try {
    if (fs.pathExistsSync(removeWalletDirectory)) {
      fs.removeSync(removeWalletDirectory);
    }
    return true;
  } catch (e) {
    logger.log("error", "error creating wallet: " + e);
    return false;
  }
};

export const startWallet = (mainWindow, daemonIsAdvanced, testnet, walletPath, reactIPC) => {
  if (GetDcrwPID()) {
    logger.log("info", "dcrwallet already started " + GetDcrwPID());
    mainWindow.webContents.send("dcrwallet-port", GetDcrwPort());
    return GetDcrwPID();
  }
  initWalletCfg(testnet, walletPath);
  try {
    return launchDCRWallet(mainWindow, daemonIsAdvanced, walletPath, testnet, reactIPC);
  } catch (e) {
    logger.log("error", "error launching dcrwallet: " + e);
  }
};

export const stopDaemon = () => {
  return closeDCRD();
};

export const stopWallet = () => {
  return closeDCRW();
};

export const setWatchingOnlyWallet = (isWatchingOnly) => {
  watchingOnlyWallet = isWatchingOnly;
};

export const getWatchingOnlyWallet = () => watchingOnlyWallet;
