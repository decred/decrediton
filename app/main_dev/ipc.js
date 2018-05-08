import fs from "fs-extra";
import path from "path";
import parseArgs from "minimist";
import { OPTIONS } from "./constants";
import { createLogger } from "./logging";
import { getWalletPath, getWalletDBPathFromWallets, getDcrdPath, dcrdCfg, getDcrdRpcCert } from "./paths";
import { launchDCRD } from "./launch";
import { createTempDcrdConf, readDcrdConfig } from "../config";
import { GetDcrdPID } from "./launch"

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
