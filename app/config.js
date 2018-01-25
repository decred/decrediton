import fs from "fs";
import path from "path";
import os from "os";
import { stakePoolInfo } from "./middleware/stakepoolapi";
import Store from "electron-store";
import ini from "ini";

export function getGlobalCfg() {
  const config = new Store();
  return (config);
}

export function getWalletCfg(walletPath){
  const config = new Store({cwd: getWalletCfgPath(walletPath)});
  return (config);
}

export function initWalletCfg(walletPath) {
  const config = new Store({cwd: getWalletCfgPath(walletPath)});
  if (!config.has("rpc_user")) {
    config.set("USER", false);
  }
  if (!config.has("rpc_pass")) {
    config.set("PASSWORD", false);
  }
  if (!config.has("wallet_start_advanced")) {
    config.set("wallet_start_advanced", false);
  }
  if (!config.has("enableticketbuyer")) {
    config.set("enableticketbuyer","0");
  }
  if (!config.has("balancetomaintain")) {
    config.set("balancetomaintain","0");
  }
  if (!config.has("maxfee")) {
    config.set("maxfee","0.1");
  }
  if (!config.has("maxpricerelative")) {
    config.set("maxpricerelative","1.25");
  }
  if (!config.has("maxpriceabsolute")) {
    config.set("maxpriceabsolute","0");
  }
  if (!config.has("maxperblock")) {
    config.set("maxperblock","5");
  }
  if (!config.has("currency_display")) {
    config.set("currency_display","DCR");
  }
  if (!config.has("hiddenaccounts")) {
    var hiddenAccounts = Array();
    config.set("hiddenaccounts",hiddenAccounts);
  }
  if (!config.has("discoveraccounts")) {
    config.set("discoveraccounts",true);
  }
  if (!config.has("remote_credentials")) {
    const credentialKeys = {
      rpc_user : "",
      rpc_password : "",
      rpc_cert : "",
      rpc_host : "",
      rpc_port : "",
    };
    config.set("remote_credentials",credentialKeys);
  }
  stakePoolInfo(function(foundStakePoolConfigs) {
    if (foundStakePoolConfigs !== null) {
      updateStakePoolConfig(config, foundStakePoolConfigs);
    }
  });
  return (config);
}

export function initGlobalCfg() {
  const config = new Store();
  // If value is missing (or no config file) write the defaults.
  if (!config.has("network")) {
    config.set("network", "mainnet");
  }
  if (!config.has("daemon_start_advanced")) {
    config.set("daemon_start_advanced", false);
  }
  if (!config.has("must_open_form")) {
    config.set("must_open_form",true);
  }
  if (!config.has("locale")) {
    config.set("locale","");
  }
  return(config);
}

export function getGlobalCfgPath() {
  return path.resolve(appDataDirectory(), "config.json");
}

export function getWalletCfgPath(wallet) {
  return path.resolve(path.join(appDataDirectory(), "wallets", wallet));
}

export function validateGlobalCfgFile() {
  var fileContents;
  try {
    fileContents = fs.readFileSync(getGlobalCfgPath(), "utf8");
  }
  catch(err) {
    return null;
  }

  try {
    JSON.parse(fileContents);
  }
  catch(err) {
    console.error(err);
    return err;
  }

  return null;
}

// In all the functions below the Windows path is constructed based on
// os.homedir() rather than using process.env.LOCALAPPDATA because in my tests
// that was available when using the standalone node but not there when using
// electron in production mode.
export function appDataDirectory() {
  if (os.platform() == "win32") {
    return path.join(os.homedir(), "AppData", "Local", "Decrediton");
  } else if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library","Application Support","decrediton");
  } else {
    return path.join(os.homedir(),".config","decrediton");
  }
}

export function getDcrdPath() {
  if (os.platform() == "win32") {
    return path.join(os.homedir(), "AppData", "Local", "Dcrd");
  } else if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library","Application Support","dcrd");
  } else {
    return path.join(os.homedir(),".dcrd");
  }
}

export function getWalletPath(walletPath) {
  return path.join(appDataDirectory(), "wallets", walletPath);
}

export function getWalletCert(certPath) {
  var cert;
  certPath = path.resolve(certPath, "rpc.cert");
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
  }

  return(cert);
}

export function getDcrdCert(dcrdCertPath) {
  if(dcrdCertPath)
    if(fs.existsSync(dcrdCertPath))
      return fs.readFileSync(dcrdCertPath);

  var certPath = "";
  if (os.platform() == "win32") {
    certPath = path.join(os.homedir(), "AppData", "Local", "Dcrd", "rpc.cert");
  } else if (os.platform() == "darwin") {
    certPath = path.join(os.homedir(), "Library", "Application Support",
            "Dcrd", "rpc.cert");
  } else {
    certPath = path.join(os.homedir(), ".dcrd", "rpc.cert");
  }

  var cert = fs.readFileSync(certPath);
  return(cert);
}

export function updateStakePoolConfig(config, foundStakePoolConfigs) {
  var currentStakePoolConfigs = config.has("stakepools") && Array.isArray(config.get("stakepools"))
    ? config.get("stakepools")
    : [];

  var currentConfigsByHost = currentStakePoolConfigs.reduce((l, s) => {
    l[s.Host] = s;
    return l;
  }, {});

  if (foundStakePoolConfigs !== null) {
    let newStakePoolConfigs = foundStakePoolConfigs.map(s => {
      const current = currentConfigsByHost[s.Host];
      delete currentConfigsByHost[s.Host];
      return current ? { ...current, ...s } : s;
    });
    Object.keys(currentConfigsByHost)
      .forEach(v => newStakePoolConfigs.push(currentConfigsByHost[v]));
    config.set("stakepools", newStakePoolConfigs);
  }
}

export function getAppdataPath() {
  const config = getWalletCfg("default-wallet");
  return config.get("appdata_path");
}

export function setAppdataPath(appdataPath) {
  const config = getWalletCfg("default-wallet");
  const credentialKeys = {
    rpc_user : "",
    rpc_password : "",
    rpc_cert : "",
    rpc_host : "",
    rpc_port : "",
  };
  config.set("remote_credentials",credentialKeys);
  return config.set("appdata_path",appdataPath);
}

export function getRemoteCredentials() {
  const config = getWalletCfg("default-wallet");
  return config.get("remote_credentials");
}

export function setRemoteCredentials(key, value) {
  const config = getWalletCfg("default-wallet");
  config.set("appdata_path","");
  let credentials = config.get("remote_credentials");
  credentials[key] = value;
  return config.set("remote_credentials",credentials);
}

export function getMustOpenForm() {
  const config = getWalletCfg("default-wallet");
  return config.get("must_open_form");
}

export function setMustOpenForm(openForm) {
  const config = getWalletCfg("default-wallet");
  return config.set("must_open_form", openForm);
}

export function newWalletConfigCreation(walletPath) {
  // TODO: set random user/password
  var dcrdConf = {
    "Application Options":
    {
      rpcuser: "USER",
      rpcpass: "PASSWORD",
      rpclisten: "127.0.0.1:9109"
    }
  };
  fs.writeFileSync(dcrdCfg(walletPath), ini.stringify(dcrdConf));
  var dcrctlConf = {
    "Application Options":
    {
      rpcuser: "USER",
      rpcpass: "PASSWORD",
      rpcserver: "127.0.0.1:9109"
    }
  };
  fs.writeFileSync(dcrctlCfg(walletPath), ini.stringify(dcrctlConf));
  var dcrwConf = {
    "Application Options":
    {
      username: "USER",
      password: "PASSWORD",
      tlscurve: "P-256",
      noinitialload: "1",
      onetimetlskey: "1",
      rpcconnect: "127.0.0.1:9109",
      grpclisten: "127.0.0.1:9121",
      appdata: getWalletPath(walletPath),
    },
  };
  fs.writeFileSync(dcrwalletCfg(walletPath), ini.stringify(dcrwConf));
}
export function dcrctlCfg(walletPath) {
  return path.resolve(getWalletPath(walletPath), "dcrctl.conf");
}

export function dcrdCfg(walletPath) {
  return path.resolve(getWalletPath(walletPath), "dcrd.conf");
}

export function dcrwalletCfg(walletPath) {
  return path.resolve(getWalletPath(walletPath), "dcrwallet.conf");
}
