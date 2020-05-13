import fs from "fs";
import Store from "electron-store";
import ini from "ini";
import { stakePoolInfo } from "./middleware/stakepoolapi";
import {
  getAppDataDirectory,
  getGlobalCfgPath,
  dcrdCfg,
  getWalletPath,
  dcrwalletConf,
  getDcrdRpcCert,
  getDcrdPath
} from "./main_dev/paths";
import * as cfgConstants from "constants/config";
import { DCR } from "constants";

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
  if (!config.has("mixedaccount")) {
    config.set("mixedaccount", "");
  }
  if (!config.has("changeaccount")) {
    config.set("changeaccount", "");
  }
  if (!config.has("csppserver")) {
    config.set("csppserver", "");
  }
  if (!config.has("csppport")) {
    config.set("csppport", "");
  }
  if (!config.has("mixedaccbranch")) {
    config.set("mixedaccbranch", "");
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

// readDcrdConfig reads top level entries from dcrd.conf file. If appdata is
// not defined, we read dcrd.conf file from our app directory. If it does not
// exist, a new conf file is created with random rpc_user and rpc_pass.
// return { appdata, rpc_cert, rpc_user, rpc_pass, rpc_host, rpc_port }
export function readDcrdConfig(testnet, appdata) {
  try {
    const newCfg = {};
    newCfg.rpc_host = "127.0.0.1";
    newCfg.rpc_port = testnet ? "19109" : "9109";

    if (appdata) {
      newCfg.appdata = appdata;
      newCfg.rpc_cert = `${appdata}/rpc.cert`;
      if (fs.existsSync(dcrdCfg(appdata))) {
        newCfg.configFile = appdata;
      } else {
        // if dcrd.conf from appdata does not exist, we use dcrd.conf from the decrediton dir.
        newCfg.configFile = getAppDataDirectory();
      }
    } else {
      newCfg.rpc_cert = `${getDcrdPath()}/rpc.cert`;
      newCfg.appdata = getDcrdPath();
      newCfg.configFile = getAppDataDirectory();
    }

    // if dcrd.conf file is from decrediton dir and does not exist we create a
    // new one.
    if (
      newCfg.configFile === getAppDataDirectory() &&
      !fs.existsSync(dcrdCfg(newCfg.configFile))
    ) {
      createTempDcrdConf(testnet);
    }
    const readCfg = ini.parse(
      Buffer.from(fs.readFileSync(dcrdCfg(newCfg.configFile))).toString()
    );

    let userFound,
      passFound = false;
    // Look through all top level config entries
    for (const [key, value] of Object.entries(readCfg)) {
      if (key === "rpcuser") {
        newCfg.rpc_user = value;
        userFound = true;
      }
      if (key === "rpcpass") {
        newCfg.rpc_pass = value;
        passFound = true;
      }
      if (key === "rpclisten") {
        const splitListen = value.split(":");
        if (splitListen.length >= 2) {
          newCfg.rpc_host = splitListen[0];
          newCfg.rpc_port = splitListen[1];
        }
      }
      if (!userFound && !passFound) {
        // If user and pass aren't found on the top level, look through all
        // next level config entries
        for (const [key2, value2] of Object.entries(value)) {
          if (key2 === "rpcuser") {
            newCfg.rpc_user = value2;
            userFound = true;
          }
          if (key2 === "rpcpass") {
            newCfg.rpc_pass = value2;
            passFound = true;
          }
          if (key2 === "rpclisten") {
            const splitListen = value2.split(":");
            if (splitListen.length >= 2) {
              newCfg.rpc_host = splitListen[0];
              newCfg.rpc_port = splitListen[1];
            }
          }
        }
      }
    }
    return newCfg;
  } catch (err) {
    console.error(err);
  }
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

function makeRandomString(length) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

// createTempDcrdConf creates a temp dcrd conf file and writes it
// to decreditons config directory: getAppDataDirectory()
function createTempDcrdConf(testnet) {
  let dcrdConf = {};
  if (!fs.existsSync(dcrdCfg(getAppDataDirectory()))) {
    const port = testnet ? "19109" : "9109";

    dcrdConf = {
      "Application Options": {
        rpcuser: makeRandomString(10),
        rpcpass: makeRandomString(10),
        rpclisten: `127.0.0.1:${port}`
      }
    };
    fs.writeFileSync(dcrdCfg(getAppDataDirectory()), ini.stringify(dcrdConf));
  }
  return getAppDataDirectory();
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
