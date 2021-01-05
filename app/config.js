import fs from "fs";
import Store from "electron-store";
import ini from "ini";
import { stakePoolInfo } from "./middleware/vspapi";
import {
  getGlobalCfgPath,
  getWalletPath,
  dcrwalletConf,
  getDcrdRpcCert
} from "./main_dev/paths";
import * as cfgConstants from "constants/config";

export function getGlobalCfg() {
  const config = new Store();
  return config;
}

export function getWalletCfg(testnet, walletPath) {
  const config = new Store({ cwd: getWalletPath(testnet, walletPath) });
  return config;
}

export function initWalletCfg(testnet, walletPath) {
  const config = new Store({ cwd: getWalletPath(testnet, walletPath) });
  Object.keys(cfgConstants.WALLET_INITIAL_VALUE).map((key) => {
    if (!config.has(key)) {
      config.set(key, cfgConstants.WALLET_INITIAL_VALUE[key]);
    }
  });

  stakePoolInfo((foundStakePoolConfigs) => {
    if (foundStakePoolConfigs !== null) {
      updateStakePoolConfig(config, foundStakePoolConfigs);
    }
  });
  cleanWalletCfg(config);
  return config;
}

// remove unecessary config keys if exists
function cleanWalletCfg(config) {
  const walletCfgFields = Object.keys(cfgConstants.WALLET_INITIAL_VALUE);

  for (const key in config.store) {
    let found = false;
    for (let i = 0; i < walletCfgFields.length; i++) {
      if (key === walletCfgFields[i]) {
        found = true;
        break;
      }
    }
    if (!found) {
      config.delete(key);
    }
  }
}

export function initGlobalCfg() {
  const config = new Store();
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
  let fileContents;
  try {
    fileContents = fs.readFileSync(getGlobalCfgPath(), "utf8");
  } catch (err) {
    return null;
  }

  try {
    JSON.parse(fileContents);
  } catch (err) {
    console.error(err);
    return err;
  }

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
    config.has(cfgConstants.STAKEPOOLS) && Array.isArray(config.get(cfgConstants.STAKEPOOLS))
      ? config.get(cfgConstants.STAKEPOOLS)
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
    config.set(cfgConstants.STAKEPOOLS, newStakePoolConfigs);
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
