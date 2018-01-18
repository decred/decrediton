import fs from "fs";
import path from "path";
import os from "os";
import { stakePoolInfo } from "./middleware/stakepoolapi";
import Store from "electron-store";
import ini from "ini";

export function getCfg() {
  const config = new Store();
  return (config);
}

export function initWalletCfg(walletPath) {
  const config = new Store(getWalletCfgPath(walletPath));
  if (!config.has("network")) {
    config.set("network", "mainnet");
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
  if (!config.has("locale")) {
    config.set("locale","");
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

export function initDecreditonCfg() {
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
  return(config);
}

export function getDecreditonCfgPath() {
  return path.resolve(appDataDirectory(), "config.json");
}

export function getWalletCfgPath(wallet) {
  return path.resolve(path.join(appDataDirectory(), "wallets", wallet), "config.json");
}

export function validateCfgFile() {
  var fileContents;
  try {
    fileContents = fs.readFileSync(getDecreditonCfgPath(), "utf8");
  }
  catch(err) {
    return null;
  }

  try {
    JSON.parse(fileContents);
  }
  catch(err) {
    console.log(err);
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

export function getWalletCert(certPath) {
  var cert;
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

  var cfg = getCfg();
  if (cfg.get("daemon_cert_path") != "") {
    return(cfg.get("daemon_cert_path"));
  }
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

export function dcrdCfg() {
  var cfgLoc = appDataDirectory();
  return path.join(cfgLoc, "dcrd.conf");
}

export function dcrctlCfg() {
  var cfgLoc = appDataDirectory();
  return path.join(cfgLoc, "dcrctl.conf");
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
  const config = getCfg();
  return config.get("appdata_path");
}

export function setAppdataPath(appdataPath) {
  const config = getCfg();
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
  const config = getCfg();
  return config.get("remote_credentials");
}

export function setRemoteCredentials(key, value) {
  const config = getCfg();
  config.set("appdata_path","");
  let credentials = config.get("remote_credentials");
  credentials[key] = value;
  return config.set("remote_credentials",credentials);
}

export function getMustOpenForm() {
  const config = getCfg();
  return config.get("must_open_form");
}

export function setMustOpenForm(openForm) {
  const config = getCfg();
  return config.set("must_open_form", openForm);
}
export function initialConfigGeneration() {
  if (!fs.existsSync(dcrdCfg())) {
    var dcrdConf = {
      "Application Options":
      {
        rpcuser: "USER",
        rpcpass: "PASSWORD",
      }
    };
    logger.log("info", "The dcrd config file does not exists, creating");
    fs.writeFileSync(dcrdCfg(), ini.stringify(dcrdConf));
  }
  if (!fs.existsSync(dcrctlCfg())) {
    var dcrctlConf = {
      "Application Options":
      {
        rpcuser: "USER",
        rpcpass: "PASSWORD",
      }
    };
    logger.log("info", "The dcrctl config file does not exists, creating");
    fs.writeFileSync(dcrctlCfg(), ini.stringify(dcrctlConf));
  }
}

export function newWalletConfig(walletName) {
  var dcrwConf = {
    "Application Options":
    {
      username: "USER",
      password: "PASSWORD",
      tlscurve: "P-256",
      noinitialload: "1",
      onetimetlskey: "1",
    },
  };
  fs.writeFileSync(dcrwCfg(), ini.stringify(dcrwConf));
}
