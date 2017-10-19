import fs from "fs";
import path from "path";
import os from "os";
import { stakePoolInfo } from "./middleware/stakepoolapi";
var ini = require("ini");

export function getCfg() {
  const Store = require("electron-store");
  const config = new Store();
  return (config);
}

export function initCfg() {
  const Store = require("electron-store");
  const config = new Store();
  // If value is missing (or no config file) write the defaults.
  if (!config.has("network")) {
    config.set("network", "mainnet");
  }
  if (!config.has("wallet_port_testnet")) {
    config.set("wallet_port_testnet", "19121");
  }
  if (!config.has("wallet_port")) {
    config.set("wallet_port", "9121");
  }
  if (!config.has("cert_path")) {
    config.set("cert_path","");
  }
  if (!config.has("daemon_port")) {
    config.set("daemon_port","9119");
  }
  if (!config.has("daemon_port_testnet")) {
    config.set("daemon_port_testnet","19119");
  }
  if (!config.has("daemon_cert_path")) {
    config.set("daemon_cert_path","");
  }
  if (!config.has("daemon_rpc_host")) {
    config.set("daemon_rpc_host", "127.0.0.1");
  }
  if (!config.has("daemon_rpc_host_testnet")) {
    config.set("daemon_rpc_host_testnet", "127.0.0.1");
  }
  if (!config.has("daemon_skip_start")) {
    config.set("daemon_skip_start", false);
  }
  if (!config.has("wallet_skip_start")) {
    config.set("wallet_skip_start", false);
  }
  if (!config.has("wallet_rpc_host")) {
    config.set("wallet_rpc_host", "127.0.0.1");
  }
  if (!config.has("rpc_user")) {
    config.set("rpc_user","USER");
  }
  if (!config.has("rpc_pass")) {
    config.set("rpc_pass","PASSWORD");
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
  if (!config.has("locale")) {
    config.set("locale","en"); //TODO: find out user's default locale
  }
  if (!config.has("hiddenaccounts")) {
    var hiddenAccounts = Array();
    config.set("hiddenaccounts",hiddenAccounts);
  }
  if (!config.has("discoveraccounts")) {
    config.set("discoveraccounts",true);
  }

  stakePoolInfo(function(foundStakePoolConfigs) {
    if (foundStakePoolConfigs !== null) {
      updateStakePoolConfig(config, foundStakePoolConfigs);
    }
  });

  return(config);
}

export function getCfgPath() {
  return path.resolve(appDataDirectory(), "config.json");
}

export function validateCfgFile() {
  var fileContents;
  try {
    fileContents = fs.readFileSync(getCfgPath(), "utf8");
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

export function getCert() {
  var certPath = "";
  var cfg = getCfg();
  if (cfg.get("cert_path") != "") {
    certPath = cfg.get("cert_path");
  }
  if (os.platform() == "win32") {
    certPath = path.join(os.homedir(), "AppData", "Local", "Decrediton", "rpc.cert");
  } else if (os.platform() == "darwin") {
    certPath = path.join(os.homedir(), "Library", "Application Support",
            "decrediton", "rpc.cert");
  } else {
    certPath = path.join(os.homedir(), ".config", "decrediton", "rpc.cert");
  }

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

export function getDcrdCert() {
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

export function GRPCWalletPort() {
  var cfg = getCfg();
  if (cfg.get("network") == "mainnet") {
    return cfg.get("wallet_port");
  }
  return cfg.get("wallet_port_testnet");
}

export function RPCWalletPort() {
  var cfg = getCfg();
  if (cfg.get("network") == "mainnet") {
    return "9110";
  }
  return "19110";
}

export function RPCDaemonPort() {
  var cfg = getCfg();
  if (cfg.get("network") == "mainnet") {
    return cfg.get("daemon_port");
  }
  return cfg.get("daemon_port_testnet");
}

export function RPCDaemonHost() {
  var cfg = getCfg();
  if (cfg.get("network") == "mainnet") {
    return cfg.get("daemon_rpc_host");
  }
  return cfg.get("daemon_rpc_host_testnet");
}

export function dcrdCfg() {
  var cfgLoc = appDataDirectory();
  return path.join(cfgLoc, "dcrd.conf");
}

export function getWalletFile() {
  var cfg = getCfg();
  var network =  cfg.get("network");
  if (network === "testnet") {
    network = "testnet2";
  }
  return path.join(appDataDirectory(), network, "wallet.db");
}

export function dcrwCfg() {
  var cfgLoc = appDataDirectory();
  return path.join(cfgLoc, "dcrwallet.conf");
}

export function dcrctlCfg() {
  var cfgLoc = appDataDirectory();
  return path.join(cfgLoc, "dcrctl.conf");
}

export function writeCfgs(dcrd, dcrwallet, dcrctl) {
  var cfg = getCfg();
  if (dcrd) {
    var dcrdConf = {
      "Application Options":
      {
        rpcuser: cfg.get("rpc_user"),
        rpcpass: cfg.get("rpc_pass"),
      }
    };
    fs.writeFileSync(dcrdCfg(), ini.stringify(dcrdConf));
  }
  if (dcrwallet) {
    var dcrwConf = {
      "Application Options":
      {
        username: cfg.get("rpc_user"),
        password: cfg.get("rpc_pass"),
        appdata: appDataDirectory(),
        tlscurve: "P-256",
        noinitialload: "1",
        onetimetlskey: "1",
      },
    };
    fs.writeFileSync(dcrwCfg(), ini.stringify(dcrwConf));
  }
  if (dcrctl) {
    var dcrctlConf = {
      "Application Options":
      {
        rpcuser: cfg.get("rpc_user"),
        rpcpass: cfg.get("rpc_pass"),
      }
    };
    fs.writeFileSync(dcrctlCfg(), ini.stringify(dcrctlConf));
  }
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
      return currentConfigsByHost[s.Host]
          ? { ...currentConfigsByHost[s.Host], ...s }
          : s;
    });
    config.set("stakepools", newStakePoolConfigs);
  }
}
