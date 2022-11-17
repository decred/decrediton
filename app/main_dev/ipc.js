import fs from "fs";
import path from "path";
import { createLogger } from "./logging";
import { getWalletPath, getWalletDb, getDcrdPath } from "./paths";
import {
  initWalletCfg,
  newWalletConfigCreation,
  getWalletCfg,
  checkNoLegacyWalletConfig
} from "../config";
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
  launchDex,
  initCheckDex,
  initDexCall,
  createWalletDexCall,
  userDexCall,
  loginDexCall,
  logoutDexCall,
  exportSeedDexCall,
  GetDexPID,
  closeDcrlnd,
  closeDex,
  setDcrdRpcCredentials,
  GetDexCreds
} from "./launch";
import { MAINNET } from "constants";
import * as cfgConstants from "constants/config";

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
    const lastAccess = cfg.get(cfgConstants.LAST_ACCESS);
    const isWatchingOnly = cfg.get(cfgConstants.IS_WATCH_ONLY);
    const isTrezor = cfg.get(cfgConstants.TREZOR);
    const isPrivacy = cfg.get(cfgConstants.MIXED_ACCOUNT_CFG);
    const walletDbFilePath = getWalletDb(isTestNet, wallet);
    const finished = fs.existsSync(walletDbFilePath);
    const isLN = cfg.get(cfgConstants.LN_WALLET_EXISTS);
    const displayWalletGradient = cfg.get(cfgConstants.DISPLAY_WALLET_GRADIENT);
    availableWallets.push({
      network,
      wallet,
      finished,
      lastAccess,
      isWatchingOnly,
      isTrezor,
      isPrivacy,
      isLN,
      displayWalletGradient
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
    if (fs.existsSync(removeDaemonDirectoryData)) {
      fs.rmSync(removeDaemonDirectoryData, {
        force: true,
        recursive: true,
        maxRetries: 30
      });
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
    return await launchDCRD(reactIPC, testnet, appdata);
  } catch (err) {
    logger.log("error", "error launching dcrd: " + err);
    throw err;
  }
};

export const createWallet = (testnet, walletPath) => {
  const newWalletDirectory = getWalletPath(testnet, walletPath);
  try {
    if (!fs.existsSync(newWalletDirectory)) {
      fs.mkdirSync(newWalletDirectory, { recursive: true });

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
    if (fs.existsSync(removeWalletDirectory)) {
      fs.rmSync(removeWalletDirectory, {
        force: true,
        recursive: true,
        maxRetries: 30
      });
      return true;
    }
    return false;
  } catch (e) {
    logger.log("error", "error creating wallet: " + e);
    return false;
  }
};

export const startWallet = async (
  mainWindow,
  daemonIsAdvanced,
  testnet,
  walletPath,
  reactIPC,
  rpcUser,
  rpcPass,
  rpcHost,
  rpcListen,
  gapLimit,
  disableCoinTypeUpgrades
) => {
  if (GetDcrwPID()) {
    logger.log("info", "dcrwallet already started " + GetDcrwPID());
    return { pid: GetDcrwPID(), port: GetDcrwPort() };
  }
  initWalletCfg(testnet, walletPath);
  checkNoLegacyWalletConfig(
    testnet,
    walletPath,
    rpcUser && rpcPass && rpcHost && rpcListen
  );
  try {
    return await launchDCRWallet(
      mainWindow,
      daemonIsAdvanced,
      walletPath,
      testnet,
      reactIPC,
      rpcUser,
      rpcPass,
      rpcHost,
      rpcListen,
      gapLimit,
      disableCoinTypeUpgrades
    );
  } catch (e) {
    logger.log("error", "error launching dcrwallet: " + e);
    throw e;
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
      `Skipping restart of dcrlnd as it is already running ${GetDcrlndPID()}`
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
    logger.log("error", `error launching dcrlnd: ${e}`);
    return e;
  }
};

export const startDex = async (walletPath, testnet, locale) => {
  if (GetDexPID()) {
    logger.log(
      "info",
      `Skipping restart of DEX as it is already running ${GetDexPID()}`
    );
    const creds = GetDexCreds();
    return { wasRunning: true, ...creds };
  }

  try {
    const started = await launchDex(walletPath, testnet, locale);
    return started;
  } catch (e) {
    logger.log("error", `error launching dex: ${e}`);
    return e;
  }
};

export const checkInitDex = async () => {
  if (!GetDexPID()) {
    logger.log("info", "Skipping check of init since dex is not runnning");
    return false;
  }

  try {
    const init = await initCheckDex();
    return init;
  } catch (e) {
    logger.log("error", `error checking init dex: ${e}`);
    return e;
  }
};

export const initDex = async (passphrase, seed) => {
  if (!GetDexPID()) {
    logger.log("info", "Skipping init since dex is not runnning");
    return false;
  }

  try {
    const init = await initDexCall(passphrase, seed);
    return init;
  } catch (e) {
    logger.log("error", `error init dex: ${e}`);
    return e;
  }
};

export const loginDex = async (passphrase) => {
  if (!GetDexPID()) {
    logger.log("info", "Skipping login since dex is not runnning");
    return false;
  }

  try {
    const login = await loginDexCall(passphrase);
    return login;
  } catch (e) {
    logger.log("error", `error login dex: ${e}`);
    return e;
  }
};

export const exportSeed = async (passphrase) => {
  if (!GetDexPID()) {
    logger.log("info", "Skipping export seed since dex is not runnning");
    return false;
  }

  try {
    const login = await exportSeedDexCall(passphrase);
    return login;
  } catch (e) {
    logger.log("error", `error export seed dex: ${e}`);
    return e;
  }
};

export const logoutDex = async () => {
  if (!GetDexPID()) {
    logger.log("info", "Skipping login since dex is not runnning");
    return false;
  }

  try {
    const login = await logoutDexCall();
    return login;
  } catch (e) {
    logger.log("error", `error logout dex: ${e}`);
    return e;
  }
};

export const createWalletDex = async (
  assetID,
  walletType,
  passphrase,
  appPassphrase,
  account,
  rpcuser,
  rpcpass,
  rpclisten,
  rpccert
) => {
  if (!GetDexPID()) {
    logger.log("info", "Skipping create wallet since dex is not runnning");
    return false;
  }

  try {
    const createWallet = await createWalletDexCall(
      assetID,
      walletType,
      passphrase,
      appPassphrase,
      account,
      rpcuser,
      rpcpass,
      rpclisten,
      rpccert
    );
    return createWallet;
  } catch (e) {
    logger.log("error", `error create wallet dex: ${e}`);
    return e;
  }
};

export const userDex = async () => {
  if (!GetDexPID()) {
    logger.log("info", "Skipping user request since dex is not runnning");
    return false;
  }

  try {
    const user = await userDexCall();
    return user;
  } catch (e) {
    logger.log("error", `error user dex: ${e}`);
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

export const stopDex = () => closeDex();

export const removeDcrlnd = (walletName, testnet) => {
  const walletPath = getWalletPath(testnet, walletName);
  const dcrlndRoot = path.join(walletPath, "dcrlnd");
  try {
    if (fs.existsSync(dcrlndRoot)) {
      fs.rmSync(dcrlndRoot, { recursive: true, force: true, maxRetries: 30 });
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
