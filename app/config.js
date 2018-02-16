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

export function getWalletCfg(testnet, walletPath){
  const config = new Store({cwd: getWalletCfgPath(testnet, walletPath)});
  return (config);
}

export function initWalletCfg(testnet, walletPath) {
  const config = new Store({cwd: getWalletCfgPath(testnet, walletPath)});
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
  if (!config.has("appdata_path")) {
    config.set("appdata_path","");
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

export function getWalletCfgPath(testnet, wallet) {
  return path.resolve(path.join(appDataDirectory(), "wallets", testnet ? "testnet" : "mainnet", wallet));
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
    return path.join(os.homedir(), "AppData", "Local", "hxify");
  } else if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library","Application Support","hxify");
  } else {
    return path.join(os.homedir(),".config","hxify");
  }
}

export function getDcrdPath() {
  if (os.platform() == "win32") {
    return path.join(os.homedir(), "AppData", "Local", "Hxd");
  } else if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library","Application Support","Hxd");
  } else {
    return path.join(os.homedir(),".dcrd");
  }
}

export function getWalletPath(testnet, walletPath) {
  return path.join(appDataDirectory(), "wallets", testnet ? "testnet" : "mainnet", walletPath);
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

export function readDcrdConfig(configPath, testnet) {
  try {
    if (!fs.existsSync(dcrdCfg(configPath))) return;
    const readCfg = ini.parse(Buffer.from(fs.readFileSync(dcrdCfg(configPath))).toString());
    let newCfg = {};
    newCfg.rpc_host = "127.0.0.1";
    if (testnet) {
      newCfg.rpc_port = "12008";
    } else {
      newCfg.rpc_port = "9109";
    }
    let userFound, passFound = false;
    // Look through all top level config entries
    for (let [key, value] of Object.entries(readCfg)) {
      if (key == "rpcuser") {
        newCfg.rpc_user = value;
        userFound = true;
      }
      if (key == "rpcpass") {
        newCfg.rpc_password = value;
        passFound = true;
      }
      if (key == "rpclisten") {
        const splitListen = value.split(":");
        if (splitListen.length >= 2) {
          newCfg.rpc_host = splitListen[0];
          newCfg.rpc_port = splitListen[1];
        }
      }
      if (!userFound && !passFound) {
        // If user and pass aren't found on the top level, look through all
        // next level config entries
        for (let [key2, value2] of Object.entries(value)) {
          if (key2 == "rpcuser") {
            newCfg.rpc_user = value2;
            userFound = true;
          }
          if (key2 == "rpcpass") {
            newCfg.rpc_password = value2;
            passFound = true;
          }
          if (key2 == "rpclisten") {
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

export function getAppdataPath(testnet, walletPath) {
  const config = getWalletCfg(testnet, walletPath);
  return config.get("appdata_path");
}

export function setAppdataPath(testnet, appdataPath, walletPath) {
  const config = getWalletCfg(testnet, walletPath);
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

export function getRemoteCredentials(testnet, walletPath) {
  const config = getWalletCfg(testnet, walletPath);
  return config.get("remote_credentials");
}

export function setRemoteCredentials(testnet, walletPath, key, value) {
  const config = getWalletCfg(testnet, walletPath);
  config.set("appdata_path","");
  let credentials = config.get("remote_credentials");
  credentials[key] = value;
  return config.set("remote_credentials",credentials);
}

export function setMustOpenForm(openForm) {
  const config = getGlobalCfg();
  return config.set("must_open_form", openForm);
}

export function clearPreviousWallet() {
  const config = getGlobalCfg();
  return config.set("previouswallet", null);
}

export function newWalletConfigCreation(testnet, walletPath) {
  // TODO: set random user/password
  var dcrdConf = {
    "Application Options":
    {
      rpcuser: "USER",
      rpcpass: "PASSWORD",
      rpclisten: "127.0.0.1:9678",
      testnet: testnet ? "1" : "0"
    }
  };
  fs.writeFileSync(dcrdCfg(getWalletPath(testnet, walletPath)), ini.stringify(dcrdConf));
  var dcrctlConf = {
    "Application Options":
    {
      rpcuser: "USER",
      rpcpass: "PASSWORD",
      rpcserver: "127.0.0.1:9678",
      testnet: testnet ? "1" : "0"
    }
  };
  fs.writeFileSync(dcrctlCfg(getWalletPath(testnet, walletPath)), ini.stringify(dcrctlConf));
  var dcrwConf = {
    "Application Options":
    {
      tlscurve: "P-256",
      noinitialload: "1",
      onetimetlskey: "1",
      grpclisten: "127.0.0.1:0",
      appdata: getWalletPath(testnet, walletPath),
      testnet: testnet ? "1" : "0",
      nolegacyrpc: "1",
    },
  };
  fs.writeFileSync(dcrwalletCfg(getWalletPath(testnet, walletPath)), ini.stringify(dcrwConf));
}
export function dcrctlCfg(configPath) {
  return path.resolve(configPath, "dcrctl.conf");
}

export function dcrdCfg(configPath) {
  return path.resolve(configPath, "dcrd.conf");
}

export function dcrwalletCfg(configPath) {
  return path.resolve(configPath, "dcrwallet.conf");
}
