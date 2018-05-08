import fs from "fs-extra";
import path from "path";
import parseArgs from "minimist";
import { OPTIONS } from "./constants";
import { createLogger } from "./logging";
import { getWalletPath, getWalletDBPathFromWallets, getDcrdPath, dcrdCfg, getDcrdRpcCert } from "./paths";
import { createTempDcrdConf, readDcrdConfig, initWalletCfg, newWalletConfigCreation } from "../config";
import { launchDCRD, launchDCRWallet, GetDcrdPID, GetDcrwPID, closeDCRW } from "./launch"

const argv = parseArgs(process.argv.slice(1), OPTIONS);
const debug = argv.debug || process.env.NODE_ENV === "development";
const logger = createLogger(debug);

export const getAvailableWallets = (network) => {
  // Attempt to find all currently available wallet.db's in the respective network direction in each wallets data dir
  const availableWallets = [];
  const isTestNet = network !== "mainnet";

  const walletsBasePath = getWalletPath(isTestNet);
  const walletDirs = fs.readdirSync(walletsBasePath);
  walletDirs.forEach(wallet => {
    const walletDirStat = fs.statSync(path.join(walletsBasePath, wallet));
    if (!walletDirStat.isDirectory()) return;

    const walletDbFilePath = getWalletDBPathFromWallets(isTestNet, wallet);
    const finished = fs.pathExistsSync(walletDbFilePath);
    availableWallets.push({ network, wallet, finished });
  });

  return availableWallets;
};

export const startDaemon = (mainWindow, daemonIsAdvanced, primaryInstance, appData, testnet) => {
  if (GetDcrdPID() && GetDcrdPID() !== -1) {
    logger.log("info", "Skipping restart of daemon as it is already running " + GetDcrdPID());
    return GetDcrdPID();
  }
  if(appData){
    logger.log("info", "launching dcrd with different appdata directory");
  }
  if (!daemonIsAdvanced && !primaryInstance) {
    logger.log("info", "Running on secondary instance. Assuming dcrd is already running.");
    let dcrdConfPath = getDcrdPath();
    if (!fs.existsSync(dcrdCfg(dcrdConfPath))) {
      dcrdConfPath = createTempDcrdConf();
    }
    return -1;
  }
  try {
    let dcrdConfPath = getDcrdPath();
    if (!fs.existsSync(dcrdCfg(dcrdConfPath))) {
      dcrdConfPath = createTempDcrdConf();
    }
    return launchDCRD(mainWindow, daemonIsAdvanced, dcrdConfPath, appData, testnet);
  } catch (e) {
    logger.log("error", "error launching dcrd: " + e);
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
}

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
}

export const startWallet = (mainWindow, daemonIsAdvanced, testnet, walletPath) => {
  if (GetDcrwPID()) {
    logger.log("info", "dcrwallet already started " + GetDcrwPID());
    mainWindow.webContents.send("dcrwallet-port", GetDcrwPort());
    event.returnValue = GetDcrwPID();
    return;
  }
  initWalletCfg(testnet, walletPath);
  try {
    return launchDCRWallet(mainWindow, daemonIsAdvanced, walletPath, testnet);
  } catch (e) {
    logger.log("error", "error launching dcrwallet: " + e);
  }
}

export const stopWallet = () => {
  return closeDCRW(GetDcrwPID());
}
