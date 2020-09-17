import fs from "fs";
import path from "path";
import Store from "electron-store";
import ini from "ini";
import { stakePoolInfo } from "./middleware/vspapi";
import {
  getGlobalCfgPath,
  getWalletPath,
  dcrwalletConf,
  getDcrdRpcCert,
  getBackupDirectory,
  getAppDataDirectory
} from "./main_dev/paths";
import * as cfgConstants from "constants/config";
import { makeFileBackup } from "helpers";
import { DCR } from "constants";

let config = null;
export function getGlobalCfg() {
  if (!config) {
    config = initGlobalCfg();
  }

  return config;
}

export function getWalletCfg(testnet, walletPath) {
  const config = new Store({ cwd: getWalletPath(testnet, walletPath) });
  return config;
}

// TODO: move this constants to constants directory file.
export function initWalletCfg(testnet, walletPath) {
  const config = new Store({ cwd: getWalletPath(testnet, walletPath) });
  if (!config.has("enableticketbuyer")) {
    config.set("enableticketbuyer", "0");
  }
  if (!config.has("balancetomaintain")) {
    config.set("balancetomaintain", "0");
  }
  if (!config.has("currency_display")) {
    config.set("currency_display", DCR);
  }
  if (!config.has("hiddenaccounts")) {
    const hiddenAccounts = Array();
    config.set("hiddenaccounts", hiddenAccounts);
  }
  if (!config.has("discoveraccounts")) {
    config.set("discoveraccounts", true);
  }
  if (!config.has("gaplimit")) {
    config.set("gaplimit", "20");
  }
  if (!config.has("iswatchonly")) {
    config.set("iswatchonly", false);
  }
  if (!config.has("politeia_last_access_time")) {
    config.set("politeia_last_access_time", 0);
  }
  if (!config.has("politeia_last_access_block")) {
    config.set("politeia_last_access_block", 0);
  }
  if (!config.has("trezor")) {
    config.set("trezor", false);
  }
  // TODO remove this from here before release, as it will be an optional
  // config option for now.
  if (!config.has("enableprivacy")) {
    config.set("enableprivacy", true);
  }
  if (!config.has("ln_address")) {
    config.set("ln_address", "");
  }
  if (!config.has("ln_port")) {
    config.set("ln_port", 10009);
  }
  if (!config.has("ln_certpath")) {
    config.set("ln_certpath", "");
  }
  if (!config.has("ln_macaroonpath")) {
    config.set("ln_macaroonpath", "");
  }

  stakePoolInfo(function (foundStakePoolConfigs) {
    if (foundStakePoolConfigs !== null) {
      updateStakePoolConfig(config, foundStakePoolConfigs);
    }
  });
  cleanWalletCfg(config);
  return config;
}

function cleanWalletCfg(config) {
  let key;
  const walletCfgFields = [
    "enableticketbuyer",
    "balancetomaintain",
    "currency_display",
    "ln_wallet_exists",
    "ln_account",
    "enableprivacy",
    "mixedaccount",
    "mixedaccbranch",
    "changeaccount",
    "hiddenaccounts",
    "discoveraccounts",
    "gaplimit",
    "iswatchonly",
    "stakepools",
    "lastaccess",
    "politeia_last_access_time",
    "politeia_last_access_block",
    "csppserver",
    "csppport"
  ];
  for (key in config.store) {
    let found = false;
    for (let i = 0; i < walletCfgFields.length; i++) {
      if (key == walletCfgFields[i]) {
        found = true;
      }
    }
    if (!found) {
      config.delete(key);
    }
  }
}

export function initGlobalCfg() {
  if (config) {
    return config;
  }
  config = new Store();
  Object.keys(cfgConstants.INITIAL_VALUES).map((key) => {
    if (!config.has(key)) {
      config.set(key, cfgConstants.INITIAL_VALUES[key]);
    }
  });
  cleanGlobalCfg(config);
  return config;
}

function cleanGlobalCfg(config) {
  const globalCfgFields = Object.keys(cfgConstants.INITIAL_VALUES);

  for (const key in config.store) {
    let found = false;
    for (let i = 0; i < globalCfgFields.length; i++) {
      if (key === globalCfgFields[i]) {
        found = true;
        break;
      }
    }
    if (!found) {
      config.delete(key);
    }
  }
}

export function validateGlobalCfgFile() {
  const fileContents = fs.readFileSync(getGlobalCfgPath(), "utf8");
  try {
    JSON.parse(fileContents);
  } catch (err) {
    const backupSrc = path.resolve(getBackupDirectory(), "config.json");
    const backupConfigJson = fs.readFileSync(backupSrc, "utf8");
    const parsedBackupCfg = JSON.parse(backupConfigJson);
    if (parsedBackupCfg) {
      makeFileBackup(backupSrc, getAppDataDirectory());
      return null;
    }

    return err;
  }

  // make a config.json backup if fileContents is valid.
  makeFileBackup(getGlobalCfgPath(), getBackupDirectory());
  return null;
}

export function getWalletCert(certPath) {
  let cert;
  certPath = getDcrdRpcCert(certPath);
  try {
    cert = fs.readFileSync(certPath);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(certPath + " does not exist");
    } else if (err.code === "EACCES") {
      console.log(certPath + " permission denied");
    } else {
      console.error(certPath + " " + err);
    }
    return null;
  }

  return cert;
}

export function getDcrdCert(dcrdCertPath) {
  if (dcrdCertPath)
    if (fs.existsSync(dcrdCertPath)) return fs.readFileSync(dcrdCertPath);

  const certPath = getDcrdRpcCert();

  const cert = fs.readFileSync(certPath);
  return cert;
}

export function updateStakePoolConfig(config, foundStakePoolConfigs) {
  const currentStakePoolConfigs =
    config.has("stakepools") && Array.isArray(config.get("stakepools"))
      ? config.get("stakepools")
      : [];

  const currentConfigsByHost = currentStakePoolConfigs.reduce((l, s) => {
    l[s.Host] = s;
    return l;
  }, {});

  if (foundStakePoolConfigs !== null) {
    const newStakePoolConfigs = foundStakePoolConfigs.map((s) => {
      const current = currentConfigsByHost[s.Host];
      delete currentConfigsByHost[s.Host];
      return current ? { ...current, ...s } : s;
    });
    Object.keys(currentConfigsByHost).forEach((v) =>
      newStakePoolConfigs.push(currentConfigsByHost[v])
    );
    config.set("stakepools", newStakePoolConfigs);
  }
}

export function getConfigData(configKey) {
  const config = getGlobalCfg();
  return config.get(configKey);
}

export function getRemoteCredentials() {
  return getConfigData(cfgConstants.REMOTE_CREDENTIALS);
}

export function getAppdataPath() {
  return getConfigData(cfgConstants.APPDATA);
}

export function getDaemonIsAdvanced() {
  return getConfigData(cfgConstants.DAEMON_ADVANCED);
}

export function getIsSpv() {
  return getConfigData(cfgConstants.SPV_MODE);
}

export function setConfigData(key, value) {
  const config = getGlobalCfg();
  return config.set(key, value);
}

export function setAppdataPath(appdataPath) {
  const credentialKeys = cfgConstants.setDaemonRemoteCredentials(
    "",
    "",
    "",
    "",
    ""
  );
  setConfigData(cfgConstants.REMOTE_CREDENTIALS, credentialKeys);
  return setConfigData(cfgConstants.APPDATA, appdataPath);
}

export function setRemoteCredentials(
  rpcuser,
  rpcpass,
  rpccert,
  rpchost,
  rpcport
) {
  setConfigData(cfgConstants.APPDATA, "");
  const credentials = cfgConstants.setDaemonRemoteCredentials(
    rpcuser,
    rpcpass,
    rpccert,
    rpchost,
    rpcport
  );
  return setConfigData(cfgConstants.REMOTE_CREDENTIALS, credentials);
}

export function setLastHeight(height) {
  return setConfigData(cfgConstants.LAST_HEIGHT, height);
}

export function newWalletConfigCreation(testnet, walletPath) {
  // TODO: set random user/password
  const dcrwConf = {
    "Application Options": {
      tlscurve: "P-256",
      noinitialload: "1",
      onetimetlskey: "1",
      grpclisten: "127.0.0.1:0",
      appdata: getWalletPath(testnet, walletPath),
      testnet: testnet ? "1" : "0",
      nolegacyrpc: "1"
    }
  };
  fs.writeFileSync(
    dcrwalletConf(getWalletPath(testnet, walletPath)),
    ini.stringify(dcrwConf)
  );
}
