import path from "path";
import os from "os";
import fs from "fs-extra";
import { initWalletCfg, newWalletConfigCreation } from "config";
import { TESTNET, MAINNET } from "constants";

// In all the functions below the Windows path is constructed based on
// os.homedir() rather than using process.env.LOCALAPPDATA because in my tests
// that was available when using the standalone node but not there when using
// electron in production mode.
export function getAppDataDirectory() {
  if (os.platform() == "win32") {
    return path.join(os.homedir(), "AppData", "Local", "Decrediton");
  } else if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library","Application Support","decrediton");
  } else {
    return path.join(os.homedir(),".config","decrediton");
  }
}

// getGlobalCfgPath gets decrediton's config.json file.
// example of result in unix: ~/.config/decrediton/config.json
export function getGlobalCfgPath() {
  return path.resolve(getAppDataDirectory(), "config.json");
}

// getWalletsDirectoryPath gets the wallets directory.
export function getWalletsDirectoryPath() {
  return path.join(getAppDataDirectory(), "wallets");
}

// getWalletsDirectoryPathNetwork gets the wallets directory.
// Example in unix if testnet equals true: ~/.config/decrediton/wallets/testnet
export function getWalletsDirectoryPathNetwork(testnet) {
  return path.join(getAppDataDirectory(), "wallets", testnet ? TESTNET : MAINNET);
}

// getWalletPath returns the directory of a selected wallet byt its name.
// a wallet name represent the directory it is located in.
export function getWalletPath(testnet, walletName = "") {
  const testnetStr = testnet ? TESTNET : MAINNET;
  return path.join(getWalletsDirectoryPath(), testnetStr, walletName);
}

// getWalletDb Returns the wallet.db file from a specific wallet.
// walletPath represents the wallet name decrediton has loaded.
export function getWalletDb(testnet, walletPath) {
  return path.join(
    getWalletsDirectoryPath(), testnet ? TESTNET : MAINNET,
    walletPath, testnet ? "testnet3" : MAINNET, "wallet.db"
  );
}

// dcrdCfg gets the dcrd.conf file from a specified path
export function dcrdCfg(configPath) {
  return path.resolve(configPath, "dcrd.conf");
}

// dcrwalletCfg gets the dcrwallet.conf file from a specified path
export function dcrwalletCfg(configPath) {
  return path.resolve(configPath, "dcrwallet.conf");
}

// getDcrdPath gets the default dcrd path.
export function getDcrdPath() {
  if (os.platform() == "win32") {
    return path.join(os.homedir(), "AppData", "Local", "Dcrd");
  } if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library","Application Support","dcrd");
  } else {
    return path.join(os.homedir(),".dcrd");
  }
}

// getDcrdRpcCert gets rpc.cert file from a specified path.
// if no path is informed it gets from the default path.
export function getDcrdRpcCert (appDataPath) {
  return path.resolve(appDataPath ? appDataPath : getDcrdPath(), "rpc.cert");
}

export function getExecutablePath(name, custombinpath) {
  let binPath = custombinpath ? custombinpath :
    process.env.NODE_ENV === "development"
      ? path.join(__dirname, "..", "..", "bin")
      : path.join(process.resourcesPath, "bin");
  let execName = os.platform() !== "win32" ? name : name + ".exe";

  return path.join(binPath, execName);
}

// getDirectoryLogs gets the logs directory
export function getDirectoryLogs(dir) {
  return path.join(dir, "logs");
}

// checkAndInitWalletCfg checks for existing old wallet.db directories and copy its
// wallet.db file to the new decrediton wallets path.
// TODO deprecate this code as most decrediton are updated to 1.4.0 version.
export function checkAndInitWalletCfg (testnet) {
  const walletDirectory = getWalletPath(testnet, "default-wallet");
  const configJson = path.join(walletDirectory, "config.json");
  const oldWalletDbPath = path.join(getAppDataDirectory(), testnet ? "testnet3" : MAINNET);

  if (!fs.pathExistsSync(walletDirectory) && fs.pathExistsSync(oldWalletDbPath)) {
    fs.mkdirsSync(walletDirectory);
    fs.copySync(getDecreditonWalletDBPath(testnet), path.join(walletDirectory, testnet ? "testnet3" : MAINNET, "wallet.db"));

    // copy over existing config.json if it exists
    if (fs.pathExistsSync(getGlobalCfgPath())) {
      fs.copySync(getGlobalCfgPath(), configJson);
    }

    // create new configs for default mainnet wallet
    initWalletCfg(testnet, "default-wallet");
    newWalletConfigCreation(testnet, "default-wallet");
  }
}

// getPoliteiaPath gets the politeia path which proposals are cached.
export function getPoliteiaPath () {
  return path.join(getAppDataDirectory(), "politeia");
}

// setPoliteiaPath sets the politeia path which proposals are cached.
export function setPoliteiaPath () {
  try {
    const politeiaPath = getPoliteiaPath();
    if (fs.pathExistsSync(politeiaPath)) {
      return;
    }
    fs.mkdirSync(politeiaPath);
  } catch (err) {
    throw err;
  }  
}

// getProposalPathFromPoliteia gets a proposal by its token or return empty string
// if proposal is not foud.
export function getProposalPathFromPoliteia (token) {
  const proposalPath = path.join(getPoliteiaPath(), token);
  if (fs.pathExistsSync(proposalPath)) {
    return proposalPath;
  }
  return "";
}

// setPoliteiaProposalPath mkdir if directory of proposal does not exists.
export function setPoliteiaProposalPath (token) {
  try {
    let proposalPath = getProposalPathFromPoliteia(token);
    if (fs.pathExistsSync(proposalPath)) {
      return;
    }
    proposalPath = path.join(getPoliteiaPath(), token)
    fs.mkdirSync(proposalPath);
    return proposalPath;
  } catch (err) {
    throw err;
  }
}

// saveEligibleTickets receives a proposal token and its eligible tickets object.
// it checks if proposal path exists, creates it if it does not exist.
// and write a eligibletickets.json file, with { eligibleTickets: [tickets]) }
export function saveEligibleTickets (token, eligibleTickets) {
  let proposalPath = getProposalPathFromPoliteia(token);
  if (!fs.pathExistsSync(proposalPath)) {
    proposalPath = setPoliteiaProposalPath(token);
  }
  const fullPath = path.join(proposalPath, "eligibletickets.json");
  fs.writeFile(fullPath, JSON.stringify(eligibleTickets));
}

// getEligibleTickets get the eligibletickets.json from the proposal Path
export function getEligibleTickets (proposalPath) {
  const fullPath = path.join(proposalPath, "eligibletickets.json")
  const eligibleTickets = fs.readFileSync(fullPath);
  return JSON.parse(eligibleTickets);
}
