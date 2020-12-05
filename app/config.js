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
import { DCR } from "constants";
import * as cfgConstants from "constants/config";

export function getGlobalCfg() {
  const config = new Store();
  return config;
}

export function getWalletCfg(testnet, walletPath) {
  const config = new Store({ cwd: getWalletPath(testnet, walletPath) });
  return config;
}

// TODO: move this constants to constants directory file.
export function initWalletCfg(testnet, walletPath) {
  const config = new Store({ cwd: getWalletPath(testnet, walletPath) });
  if (!config.has(cfgConstants.ENABLE_TICKET_BUYER)) {
    config.set(cfgConstants.ENABLE_TICKET_BUYER, "0");
  }
  if (!config.has(cfgConstants.BALANCE_TO_MAINTAIN)) {
    config.set(cfgConstants.BALANCE_TO_MAINTAIN, "0");
  }
  if (!config.has(cfgConstants.CURRENCY_DISPLAY)) {
    config.set(cfgConstants.CURRENCY_DISPLAY, DCR);
  }
  if (!config.has(cfgConstants.HIDDEN_ACCOUNTS)) {
    const hiddenAccounts = Array();
    config.set(cfgConstants.HIDDEN_ACCOUNTS, hiddenAccounts);
  }
  if (!config.has(cfgConstants.DISCOVER_ACCOUNTS)) {
    config.set(cfgConstants.DISCOVER_ACCOUNTS, true);
  }
  if (!config.has(cfgConstants.GAP_LIMIT)) {
    config.set(cfgConstants.GAP_LIMIT, "20");
  }
  if (!config.has(cfgConstants.IS_WATCH_ONLY)) {
    config.set(cfgConstants.IS_WATCH_ONLY, false);
  }
  if (!config.has(cfgConstants.POLITEIA_LAST_ACCESS_TIME)) {
    config.set(cfgConstants.POLITEIA_LAST_ACCESS_TIME, 0);
  }
  if (!config.has(cfgConstants.POLITEIA_LAST_ACCESS_BLOCK)) {
    config.set(cfgConstants.POLITEIA_LAST_ACCESS_BLOCK, 0);
  }
  if (!config.has(cfgConstants.TREZOR)) {
    config.set(cfgConstants.TREZOR, false);
  }
  if (!config.has(cfgConstants.VSP_IS_LEGACY)) {
    config.set(cfgConstants.VSP_IS_LEGACY, false);
  }
  if (!config.has(cfgConstants.ENABLE_PRIVACY)) {
    config.set(cfgConstants.ENABLE_PRIVACY, true);
  }
  if (!config.has(cfgConstants.LN_ADDRESS)) {
    config.set(cfgConstants.LN_ADDRESS, "");
  }
  if (!config.has(cfgConstants.LN_PORT)) {
    config.set(cfgConstants.LN_PORT, 10009);
  }
  if (!config.has(cfgConstants.LN_CERTPATH)) {
    config.set(cfgConstants.LN_CERTPATH, "");
  }
  if (!config.has(cfgConstants.LN_MACAROONPATH)) {
    config.set(cfgConstants.LN_MACAROONPATH, "");
  }
  // if privacy if configured, set send_from_unmixed if not set.
  if (!config.has(cfgConstants.SEND_FROM_UNMIXED) && config.has(cfgConstants.MIXED_ACCOUNT_CFG)) {
    config.set(cfgConstants.SEND_FROM_UNMIXED, false);
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
    cfgConstants.ENABLE_TICKET_BUYER,
    cfgConstants.BALANCE_TO_MAINTAIN,
    cfgConstants.CURRENCY_DISPLAY,
    cfgConstants.LN_WALLET_EXISTS,
    cfgConstants.LN_ACCOUNT,
    cfgConstants.ENABLE_PRIVACY,
    cfgConstants.SEND_FROM_UNMIXED,
    cfgConstants.MIXED_ACCOUNT_CFG,
    cfgConstants.MIXED_ACC_BRANCH,
    cfgConstants.CHANGE_ACCOUNT_CFG,
    cfgConstants.HIDDEN_ACCOUNTS,
    cfgConstants.DISCOVER_ACCOUNTS,
    cfgConstants.GAP_LIMIT,
    cfgConstants.IS_WATCH_ONLY,
    cfgConstants.STAKEPOOLS,
    cfgConstants.LAST_ACCESS,
    cfgConstants.POLITEIA_LAST_ACCESS_TIME,
    cfgConstants.POLITEIA_LAST_ACCESS_BLOCK,
    cfgConstants.CSPP_SERVER,
    cfgConstants.CSPP_PORT,
    cfgConstants.DISMISS_BACKUP_MSG_REDEEM_SCRIPT,
    cfgConstants.VSP_IS_LEGACY,
    cfgConstants.REMEMBERED_VSP_HOST,
    cfgConstants.ALLOW_EXTERNAL_REQUESTS
  ];
  for (key in config.store) {
    let found = false;
    for (let i = 0; i < walletCfgFields.length; i++) {
      if (key == walletCfgFields[i]) {
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
