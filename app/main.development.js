import { app, BrowserWindow, Menu, shell, dialog } from "electron";
import { concat, isString } from "lodash";
import { initGlobalCfg, validateGlobalCfgFile, setMustOpenForm } from "./config";
import { initWalletCfg, getWalletCfg, newWalletConfigCreation, readDcrdConfig } from "./config";
import fs from "fs-extra";
import os from "os";
import path from "path";
import parseArgs from "minimist";
import stringArgv from "string-argv";
import { appLocaleFromElectronLocale, default as locales } from "./i18n/locales";
import { createLogger } from "./main_dev/logging";
import { Buffer } from "buffer";
import { OPTIONS, USAGE_MESSAGE, VERSION_MESSAGE, MAX_LOG_LENGTH, BOTH_CONNECTION_ERR_MESSAGE } from "./main_dev/constants";
import { appDataDirectory, getDcrdPath, dcrctlCfg, dcrdCfg, getDefaultWalletFilesPath } from "./main_dev/paths";
import { dcrwalletCfg, getWalletPath, getExecutablePath, getWalletsDirectoryPath, getWalletsDirectoryPathNetwork, getDefaultWalletDirectory } from "./main_dev/paths";
import { getGlobalCfgPath, getDecreditonWalletDBPath, getWalletDBPathFromWallets, getDcrdRpcCert, getDirectoryLogs } from "./main_dev/paths";

// setPath as decrediton
app.setPath("userData", appDataDirectory());

const argv = parseArgs(process.argv.slice(1), OPTIONS);
let debug = argv.debug || process.env.NODE_ENV === "development";
const logger = createLogger(debug);

// Verify that config.json is valid JSON before fetching it, because
// it will silently fail when fetching.
let err = validateGlobalCfgFile();
if (err !== null) {
  let errMessage = "There was an error while trying to load the config file, the format is invalid.\n\nFile: " + getGlobalCfgPath() + "\nError: " + err;
  dialog.showErrorBox("Config File Error", errMessage);
  app.quit();
}

let menu;
let template;
let mainWindow = null;
let versionWin = null;
let grpcVersions = { requiredVersion: null, walletVersion: null };
let dcrdPID;
let dcrwPID;
let dcrwPort;
let previousWallet = null;
let dcrdConfig = {};
let currentBlockCount;
let primaryInstance;

let dcrdLogs = Buffer.from("");
let dcrwalletLogs = Buffer.from("");

const globalCfg = initGlobalCfg();
const daemonIsAdvanced = globalCfg.get("daemon_start_advanced");
const walletsDirectory = getWalletsDirectoryPath();
const defaultTestnetWalletDirectory = getDefaultWalletDirectory(true);
const defaultMainnetWalletDirectory = getDefaultWalletDirectory(false);
const mainnetWalletsPath = getWalletsDirectoryPathNetwork(false);
const testnetWalletsPath = getWalletsDirectoryPathNetwork(true);

if (argv.help) {
  console.log(USAGE_MESSAGE);
  app.exit(0);
}

if (argv.version) {
  console.log(VERSION_MESSAGE);
  app.exit(0);
}

// Check if network was set on command line (but only allow one!).
if (argv.testnet && argv.mainnet) {
  logger.log(BOTH_CONNECTION_ERR_MESSAGE);
  app.quit();
}

if (process.env.NODE_ENV === "production") {
  const sourceMapSupport = require('source-map-support'); // eslint-disable-line
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === "development") {
  const path = require('path'); // eslint-disable-line
  const p = path.join(__dirname, '..', 'app', 'node_modules'); // eslint-disable-line
  require('module').globalPaths.push(p); // eslint-disable-line
}

// Check that wallets directory has been created, if not, make it.
fs.pathExistsSync(walletsDirectory) || fs.mkdirsSync(walletsDirectory);
fs.pathExistsSync(mainnetWalletsPath) || fs.mkdirsSync(mainnetWalletsPath);
fs.pathExistsSync(testnetWalletsPath) || fs.mkdirsSync(testnetWalletsPath);

if (!fs.pathExistsSync(defaultMainnetWalletDirectory)){
  fs.mkdirsSync(defaultMainnetWalletDirectory);

  // check for existing mainnet directories
  if ( fs.pathExistsSync(getDecreditonWalletDBPath(false)) ) {
    fs.copySync(getDecreditonWalletDBPath(false), path.join(getDefaultWalletDirectory(false, false),"wallet.db"));
  }

  // copy over existing config.json if it exists
  if (fs.pathExistsSync(getGlobalCfgPath())) {
    fs.copySync(getGlobalCfgPath(), getDefaultWalletFilesPath(false, "config.json"));
  }

  // create new configs for default mainnet wallet
  initWalletCfg(false, "default-wallet");
  newWalletConfigCreation(false, "default-wallet");

}

if (!fs.pathExistsSync(defaultTestnetWalletDirectory)){
  fs.mkdirsSync(defaultTestnetWalletDirectory);

  // check for existing testnet2 directories
  if (fs.pathExistsSync(getDecreditonWalletDBPath(true))) {
    fs.copySync(getDecreditonWalletDBPath(true), path.join(getDefaultWalletDirectory(true, true),"wallet.db"));
  }

  // copy over existing config.json if it exists
  if (fs.pathExistsSync(getGlobalCfgPath())) {
    fs.copySync(getGlobalCfgPath(), getDefaultWalletFilesPath(true, "config.json"));
  }

  // create new configs for default testnet wallet
  initWalletCfg(true, "default-wallet");
  newWalletConfigCreation(true, "default-wallet");

}

logger.log("info", "Using config/data from:" + app.getPath("userData"));
logger.log("info", "Versions: Decrediton: %s, Electron: %s, Chrome: %s",
  app.getVersion(), process.versions.electron, process.versions.chrome);

process.on("uncaughtException", err => {
  logger.log("error", "UNCAUGHT EXCEPTION", err);
  throw err;
});

function closeDCRW() {
  if (require("is-running")(dcrwPID) && os.platform() != "win32") {
    logger.log("info", "Sending SIGINT to dcrwallet at pid:" + dcrwPID);
    process.kill(dcrwPID, "SIGINT");
  }
}

function closeDCRD() {
  if (require("is-running")(dcrdPID) && os.platform() != "win32") {
    logger.log("info", "Sending SIGINT to dcrd at pid:" + dcrdPID);
    process.kill(dcrdPID, "SIGINT");
  }
}

function closeClis() {
  // shutdown daemon and wallet.
  // Don't try to close if not running.
  if(dcrdPID && dcrdPID !== -1)
    closeDCRD();
  if(dcrwPID && dcrwPID !== -1)
    closeDCRW();
}

async function cleanShutdown() {
  // Attempt a clean shutdown.
  return new Promise(resolve => {
    const cliShutDownPause = 2; // in seconds.
    const shutDownPause = 3; // in seconds.
    closeClis();
    // Sent shutdown message again as we have seen it missed in the past if they
    // are still running.
    setTimeout(function () { closeClis(); }, cliShutDownPause * 1000);
    logger.log("info", "Closing decrediton.");

    let shutdownTimer = setInterval(function(){
      const stillRunning = (require("is-running")(dcrdPID) && os.platform() != "win32");

      if (!stillRunning) {
        logger.log("info", "Final shutdown pause. Quitting app.");
        clearInterval(shutdownTimer);
        if (mainWindow) {
          mainWindow.webContents.send("daemon-stopped");
          setTimeout(() => {mainWindow.close(); app.quit();}, 1000);
        } else {
          app.quit();
        }
        resolve(true);
      }
      logger.log("info", "Daemon still running in final shutdown pause. Waiting.");

    }, shutDownPause*1000);
  });
}

const installExtensions = async () => {
  if (process.env.NODE_ENV === "development") {
    const installer = require("electron-devtools-installer"); // eslint-disable-line global-require

    const extensions = [
      "REACT_DEVELOPER_TOOLS",
      "REDUX_DEVTOOLS"
    ];
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    for (const name of extensions) { // eslint-disable-line
      try {
        await installer.default(installer[name], forceDownload);
      } catch (e) { } // eslint-disable-line
    }
  }
};

const { ipcMain } = require("electron");

ipcMain.on("get-available-wallets", (event, network) => {// Attempt to find all currently available wallet.db's in the respective network direction in each wallets data dir
  var availableWallets = [];

  if (network == "mainnet") {
    var mainnetWalletDirectories = fs.readdirSync(getWalletPath(false));
    for (var i in mainnetWalletDirectories) {
      if (fs.pathExistsSync(getWalletDBPathFromWallets(false, mainnetWalletDirectories[i].toString()))) {
        availableWallets.push({ network: "mainnet", wallet: mainnetWalletDirectories[i] });
      }
    }
  } else {
    var testnetWalletDirectories = fs.readdirSync(getWalletPath(true));
    for (var j in testnetWalletDirectories) {
      if (fs.pathExistsSync(getWalletDBPathFromWallets(true, testnetWalletDirectories[j].toString()))) {
        availableWallets.push({ network: "testnet", wallet: testnetWalletDirectories[j] });
      }
    }
  }
  event.returnValue = availableWallets;
});

ipcMain.on("start-daemon", (event, walletPath, appData, testnet) => {
  if (dcrdPID && dcrdConfig && !daemonIsAdvanced) {
    logger.log("info", "Skipping restart of daemon as it is already running");
    event.returnValue = dcrdConfig;
    return;
  }
  if(appData){
    logger.log("info", "launching dcrd with different appdata directory");
  }
  if (dcrdPID && dcrdConfig) {
    logger.log("info", "dcrd already started " + dcrdPID);
    event.returnValue = dcrdConfig;
    return;
  }
  if (!daemonIsAdvanced && !primaryInstance) {
    logger.log("info", "Running on secondary instance. Assuming dcrd is already running.");
    dcrdConfig = readDcrdConfig(getDcrdPath(), testnet);
    dcrdConfig.rpc_cert = getDcrdRpcCert();
    dcrdConfig.pid = -1;
    event.returnValue = dcrdConfig;
    return;
  }
  try {
    dcrdConfig = launchDCRD(getDcrdPath(), appData, testnet);
    dcrdPID = dcrdConfig.pid;
  } catch (e) {
    logger.log("error", "error launching dcrd: " + e);
  }
  event.returnValue = dcrdConfig;
});

ipcMain.on("create-wallet", (event, walletPath, testnet) => {
  let newWalletDirectory = getWalletPath(testnet, walletPath);
  if (!fs.pathExistsSync(newWalletDirectory)){
    fs.mkdirsSync(newWalletDirectory);

    // create new configs for new wallet
    initWalletCfg(testnet, walletPath);
    newWalletConfigCreation(testnet, walletPath);
  }
  event.returnValue = true;
});

ipcMain.on("remove-wallet", (event, walletPath, testnet) => {
  let removeWalletDirectory = getWalletPath(testnet, walletPath);
  if (fs.pathExistsSync(removeWalletDirectory)){
    fs.removeSync(removeWalletDirectory);
  }
  event.returnValue = true;
});

ipcMain.on("start-wallet", (event, walletPath, testnet) => {
  if (dcrwPID) {
    logger.log("info", "dcrwallet already started " + dcrwPID);
    mainWindow.webContents.send("dcrwallet-port", dcrwPort);
    event.returnValue = dcrwPID;
    return;
  }
  try {
    dcrwPID = launchDCRWallet(walletPath, testnet);
  } catch (e) {
    logger.log("error", "error launching dcrwallet: " + e);
  }
  event.returnValue = getWalletCfg(testnet, walletPath);
});

ipcMain.on("check-daemon", (event, walletPath, rpcCreds, testnet) => {
  let args = [ "getblockcount" ];
  let host, port;
  if (!rpcCreds){
    args.push(`--configfile=${dcrctlCfg(appDataDirectory())}`);
  } else if (rpcCreds) {
    if (rpcCreds.rpc_user) {
      args.push(`--rpcuser=${rpcCreds.rpc_user}`);
    }
    if (rpcCreds.rpc_password) {
      args.push(`--rpcpass=${rpcCreds.rpc_password}`);
    }
    if (rpcCreds.rpc_cert) {
      args.push(`--rpccert=${rpcCreds.rpc_cert}`);
    }
    if (rpcCreds.rpc_host) {
      host = rpcCreds.rpc_host;
    }
    if (rpcCreds.rpc_port) {
      port = rpcCreds.rpc_port;
    }
    args.push("--rpcserver=" + host + ":" + port);
  }

  if (testnet) {
    args.push("--testnet");
  }

  var dcrctlExe = getExecutablePath("dcrctl", argv.customBinPath);
  if (!fs.existsSync(dcrctlExe)) {
    logger.log("error", "The dcrctl file does not exists");
  }

  logger.log("info", `checking if daemon is ready  with dcrctl ${args}`);

  var spawn = require("child_process").spawn;
  var dcrctl = spawn(dcrctlExe, args, { detached: false, stdio: [ "ignore", "pipe", "pipe", "pipe" ] });

  dcrctl.stdout.on("data", (data) => {
    currentBlockCount = data.toString();
    logger.log("info", data.toString());
    mainWindow.webContents.send("check-daemon-response", currentBlockCount);
  });
  dcrctl.stderr.on("data", (data) => {
    logger.log("error", data.toString());
    mainWindow.webContents.send("check-daemon-response", 0);
  });
});

ipcMain.on("clean-shutdown", async function(event){
  const stopped = await cleanShutdown();
  event.sender.send("clean-shutdown-finished", stopped);
});

ipcMain.on("app-reload-ui", () => {
  mainWindow.reload();
});

ipcMain.on("grpc-versions-determined", (event, versions) => {
  grpcVersions = { ...grpcVersions, ...versions };
});

ipcMain.on("main-log", (event, ...args) => {
  logger.log(...args);
});

ipcMain.on("get-dcrd-logs", (event) => {
  event.returnValue = dcrdLogs;
});

ipcMain.on("get-dcrwallet-logs", (event) => {
  event.returnValue = dcrwalletLogs;
});

ipcMain.on("get-decrediton-logs", (event) => {
  event.returnValue = "decrediton logs!";
});

ipcMain.on("get-previous-wallet", (event) => {
  event.returnValue = previousWallet;
});

ipcMain.on("set-previous-wallet", (event, cfg) => {
  previousWallet = cfg;
  event.returnValue = true;
});

const AddToLog = (destIO, destLogBuffer, data) => {
  var dataBuffer = Buffer.from(data);
  if (destLogBuffer.length + dataBuffer.length > MAX_LOG_LENGTH) {
    destLogBuffer = destLogBuffer.slice(destLogBuffer.indexOf(os.EOL,dataBuffer.length)+1);
  }
  debug && destIO.write(data);
  return Buffer.concat([ destLogBuffer, dataBuffer ]);
};

// DecodeDaemonIPCData decodes messages from an IPC message received from dcrd/
// dcrwallet using their internal IPC protocol.
// NOTE: very simple impl for the moment, will break if messages get split
// between data calls.
const DecodeDaemonIPCData = (data, cb) => {
  let i = 0;
  while (i < data.length) {
    if (data[i++] !== 0x01) throw "Wrong protocol version when decoding IPC data";
    const mtypelen = data[i++];
    const mtype = data.slice(i, i+mtypelen).toString("utf-8");
    i += mtypelen;
    const psize = data.readUInt32LE(i);
    i += 4;
    const payload = data.slice(i, i+psize);
    i += psize;
    cb(mtype, payload);
  }
};

const launchDCRD = (daemonPath, appdata, testnet) => {
  var spawn = require("child_process").spawn;
  let args = [];
  let newConfig = {};
  if(appdata){
    args = [ `--appdata=${appdata}` ];
    newConfig = readDcrdConfig(appdata, testnet);
    newConfig.rpc_cert = getDcrdRpcCert(appdata);
  } else {
    args = [ `--configfile=${dcrdCfg(daemonPath)}` ];
    newConfig = readDcrdConfig(daemonPath, testnet);
    newConfig.rpc_cert = getDcrdRpcCert();
  }
  if (testnet) {
    args.push("--testnet");
  }
  // Check to make sure that the rpcuser and rpcpass were set in the config
  if (!newConfig.rpc_user || !newConfig.rpc_password) {
    const errorMessage =  "No " + `${!newConfig.rpc_user ? "rpcuser " : "" }` + `${!newConfig.rpc_user && !newConfig.rpc_password ? "and " : "" }` + `${!newConfig.rpc_password ? "rpcpass " : "" }` + "set in " + `${appdata ? appdata : getDcrdPath()}` + "/dcrd.conf.  Please set them and restart.";
    logger.log("error", errorMessage);
    mainWindow.webContents.executeJavaScript("alert(\"" + `${errorMessage}` + "\");");
    mainWindow.webContents.executeJavaScript("window.close();");
  }

  var dcrdExe = getExecutablePath("dcrd", argv.customBinPath);
  if (!fs.existsSync(dcrdExe)) {
    logger.log("error", "The dcrd file does not exists");
    return;
  }

  if (os.platform() == "win32") {
    try {
      const util = require("util");
      const win32ipc = require("./node_modules/win32ipc/build/Release/win32ipc.node");
      var pipe = win32ipc.createPipe("out");
      args.push(util.format("--piperx=%d", pipe.readEnd));
    } catch (e) {
      logger.log("error", "can't find proper module to launch dcrd: " + e);
    }
  }

  logger.log("info", `Starting ${dcrdExe} with ${args}`);

  var dcrd = spawn(dcrdExe, args, {
    detached: os.platform() == "win32",
    stdio: [ "ignore", "pipe", "pipe" ]
  });

  dcrd.on("error", function (err) {
    logger.log("error", "Error running dcrd.  Check logs and restart! " + err);
    mainWindow.webContents.executeJavaScript("alert(\"Error running dcrd.  Check logs and restart! " + err + "\");");
    mainWindow.webContents.executeJavaScript("window.close();");
  });

  dcrd.on("close", (code) => {
    if (daemonIsAdvanced)
      return;
    if (code !== 0) {
      logger.log("error", "dcrd closed due to an error.  Check dcrd logs and contact support if the issue persists.");
      mainWindow.webContents.executeJavaScript("alert(\"dcrd closed due to an error.  Check dcrd logs and contact support if the issue persists.\");");
      mainWindow.webContents.executeJavaScript("window.close();");
    } else {
      logger.log("info", `dcrd exited with code ${code}`);
    }
  });

  dcrd.stdout.on("data", (data) => dcrdLogs = AddToLog(process.stdout, dcrdLogs, data));
  dcrd.stderr.on("data", (data) => dcrdLogs = AddToLog(process.stderr, dcrdLogs, data));

  newConfig.pid = dcrd.pid;
  logger.log("info", "dcrd started with pid:" + newConfig.pid);

  dcrd.unref();
  return newConfig;
};

const launchDCRWallet = (walletPath, testnet) => {
  var spawn = require("child_process").spawn;
  var args = [ "--configfile=" + dcrwalletCfg(getWalletPath(testnet, walletPath)) ];

  const cfg = getWalletCfg(testnet, walletPath);

  args.push("--ticketbuyer.balancetomaintainabsolute=" + cfg.get("balancetomaintain"));
  args.push("--ticketbuyer.maxfee=" + cfg.get("maxfee"));
  args.push("--ticketbuyer.maxpricerelative=" + cfg.get("maxpricerelative"));
  args.push("--ticketbuyer.maxpriceabsolute=" + cfg.get("maxpriceabsolute"));
  args.push("--ticketbuyer.maxperblock=" + cfg.get("maxperblock"));

  var dcrwExe = getExecutablePath("dcrwallet", argv.customBinPath);
  if (!fs.existsSync(dcrwExe)) {
    logger.log("error", "The dcrwallet file does not exists");
    return;
  }

  if (os.platform() == "win32") {
    try {
      const util = require("util");
      const win32ipc = require("./node_modules/win32ipc/build/Release/win32ipc.node");
      var pipe = win32ipc.createPipe("out");
      args.push(util.format("--piperx=%d", pipe.readEnd));
    } catch (e) {
      logger.log("error", "can't find proper module to launch dcrwallet: " + e);
    }
  } else {
    args.push("--rpclistenerevents");
    args.push("--pipetx=4");
  }

  // Add any extra args if defined.
  if (argv.extrawalletargs !== undefined && isString(argv.extrawalletargs)) {
    args = concat(args, stringArgv(argv.extrawalletargs));
  }

  logger.log("info", `Starting ${dcrwExe} with ${args}`);

  var dcrwallet = spawn(dcrwExe, args, {
    detached: os.platform() == "win32",
    stdio: [ "ignore", "pipe", "pipe", "ignore", "pipe" ]
  });

  const notifyGrpcPort = (port) => {
    dcrwPort = port;
    logger.log("info", "wallet grpc running on port", port);
    mainWindow.webContents.send("dcrwallet-port", port);
  };

  dcrwallet.stdio[4].on("data", (data) => DecodeDaemonIPCData(data, (mtype, payload) => {
    if (mtype === "grpclistener") {
      const intf = payload.toString("utf-8");
      const matches = intf.match(/^.+:(\d+)$/);
      if (matches) {
        notifyGrpcPort(matches[1]);
      } else {
        logger.log("error", "GRPC port not found on IPC channel to dcrwallet: " + intf);
      }
    }
  }));

  dcrwallet.on("error", function (err) {
    logger.log("error", "Error running dcrwallet.  Check logs and restart! " + err);
    mainWindow.webContents.executeJavaScript("alert(\"Error running dcrwallet.  Check logs and restart! " + err + "\");");
    mainWindow.webContents.executeJavaScript("window.close();");
  });

  dcrwallet.on("close", (code) => {
    if(daemonIsAdvanced)
      return;
    if (code !== 0) {
      logger.log("error", "dcrwallet closed due to an error.  Check dcrwallet logs and contact support if the issue persists.");
      mainWindow.webContents.executeJavaScript("alert(\"dcrwallet closed due to an error.  Check dcrwallet logs and contact support if the issue persists.\");");
      mainWindow.webContents.executeJavaScript("window.close();");
    } else {
      logger.log("info", `dcrwallet exited with code ${code}`);
    }
  });

  const addStdoutToLogListener = (data) => dcrwalletLogs = AddToLog(process.stdout, dcrwalletLogs, data);

  // waitForGrpcPortListener is added as a stdout on("data") listener only on
  // win32 because so far that's the only way we found to get back the grpc port
  // on that platform. For linux/macOS users, the --pipetx argument is used to
  // provide a pipe back to decrediton, which reads the grpc port in a secure and
  // reliable way.
  const waitForGrpcPortListener = (data) => {
    const matches = /DCRW: gRPC server listening on [^ ]+:(\d+)/.exec(data);
    if (matches) {
      notifyGrpcPort(matches[1]);
      // swap the listener since we don't need to keep looking for the port
      dcrwallet.stdout.removeListener("data", waitForGrpcPortListener);
      dcrwallet.stdout.on("data", addStdoutToLogListener);
    }
    dcrwalletLogs = AddToLog(process.stdout, dcrwalletLogs, data);
  };

  dcrwallet.stdout.on("data", os.platform() == "win32" ? waitForGrpcPortListener : addStdoutToLogListener);
  dcrwallet.stderr.on("data", (data) => dcrwalletLogs = AddToLog(process.stderr, dcrwalletLogs, data));

  dcrwPID = dcrwallet.pid;
  logger.log("info", "dcrwallet started with pid:" + dcrwPID);

  dcrwallet.unref();
  return dcrwPID;
};

const readExesVersion = () => {
  let spawn = require("child_process").spawnSync;
  let args = [ "--version" ];
  let exes = [ "dcrd", "dcrwallet", "dcrctl" ];
  let versions = {
    grpc: grpcVersions,
    decrediton: app.getVersion()
  };

  for (let exe of exes) {
    let exePath = getExecutablePath("dcrd", argv.customBinPath);
    if (!fs.existsSync(exePath)) {
      logger.log("error", "The dcrd file does not exists");
    }

    let proc = spawn(exePath, args, { encoding: "utf8" });
    if (proc.error) {
      logger.log("error", `Error trying to read version of ${exe}: ${proc.error}`);
      continue;
    }

    let versionLine = proc.stdout.toString();
    if (!versionLine) {
      logger.log("error", `Empty version line when reading version of ${exe}`);
      continue;
    }

    let decodedLine = versionLine.match(/\w+ version ([^\s]+)/);
    if (decodedLine !== null) {
      versions[exe] = decodedLine[1];
    } else {
      logger.log("error", `Unable to decode version line ${versionLine}`);
    }
  }

  return versions;
};

primaryInstance = !app.makeSingleInstance(() => true);
const stopSecondInstance = !primaryInstance && !daemonIsAdvanced;
if (stopSecondInstance) {
  logger.log("error", "Preventing second instance from running.");
}

app.on("ready", async () => {

  // when installing (on first run) locale will be empty. Determine the user's
  // OS locale and set that as decrediton's locale.
  let cfgLocale = globalCfg.get("locale", "");
  let locale = locales.find(value => value.key === cfgLocale);
  if (!locale) {
    let newCfgLocale = appLocaleFromElectronLocale(app.getLocale());
    logger.log("error", `Locale ${cfgLocale} not found. Switching to locale ${newCfgLocale}.`);
    globalCfg.set("locale", newCfgLocale);
    locale = locales.find(value => value.key === newCfgLocale);
  }

  let windowOpts = { show: false, width: 1178, height: 790, page: "app.html" };
  if (stopSecondInstance) {
    windowOpts = { show: true, width: 575, height: 275, autoHideMenuBar: true,
      resizable: false, page: "staticPages/secondInstance.html" };
  } else {
    await installExtensions();
  }
  windowOpts.title = "Decrediton - " + app.getVersion();

  mainWindow = new BrowserWindow(windowOpts);
  mainWindow.loadURL(`file://${__dirname}/${windowOpts.page}`);

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.show();
    mainWindow.focus();
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
    if (versionWin !== null) {
      versionWin.close();
    }
    if (stopSecondInstance) {
      app.quit();
      setTimeout(() => { app.quit(); }, 2000);
    }
  });

  if (process.env.NODE_ENV === "development") mainWindow.openDevTools();
  if (stopSecondInstance) return;

  mainWindow.webContents.on("context-menu", (e, props) => {
    const { selectionText, isEditable, x, y } = props;
    let inputMenu = [
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { type: "separator" },
      { role: "selectall" }
    ];
    let selectionMenu = [
      { role: "copy" },
      { type: "separator" },
      { role: "selectall" }
    ];
    if (process.env.NODE_ENV === "development") {
      let inspectElement = {
        label: "Inspect element",
        click: () => mainWindow.inspectElement(x, y)
      };
      inputMenu.push(inspectElement);
      selectionMenu.push(inspectElement);
    }
    if (isEditable) {
      Menu.buildFromTemplate(inputMenu).popup(mainWindow);
    } else if (selectionText && selectionText.trim() !== "") {
      Menu.buildFromTemplate(selectionMenu).popup(mainWindow);
    } else if (process.env.NODE_ENV === "development") {
      Menu.buildFromTemplate([ {
        label: "Inspect element",
        click: () => mainWindow.inspectElement(x, y)
      } ]).popup(mainWindow);
    }
  });

  if (process.platform === "darwin") {
    template = [ {
      label: locale.messages["appMenu.decrediton"],
      submenu: [ {
        label: locale.messages["appMenu.aboutDecrediton"],
        selector: "orderFrontStandardAboutPanel:"
      }, {
        type: "separator"
      }, {
        label: locale.messages["appMenu.services"],
        submenu: []
      }, {
        type: "separator"
      }, {
        label: locale.messages["appMenu.hideDecrediton"],
        accelerator: "Command+H",
        selector: "hide:"
      }, {
        label: locale.messages["appMenu.hideOthers"],
        accelerator: "Command+Shift+H",
        selector: "hideOtherApplications:"
      }, {
        label: locale.messages["appMenu.showAll"],
        selector: "unhideAllApplications:"
      }, {
        type: "separator"
      }, {
        label: locale.messages["appMenu.quit"],
        accelerator: "Command+Q",
        click() {
          cleanShutdown();
        }
      } ]
    }, {
      label: locale.messages["appMenu.edit"],
      submenu: [ {
        label: locale.messages["appMenu.undo"],
        accelerator: "Command+Z",
        selector: "undo:"
      }, {
        label: locale.messages["appMenu.redo"],
        accelerator: "Shift+Command+Z",
        selector: "redo:"
      }, {
        type: "separator"
      }, {
        label: locale.messages["appMenu.cut"],
        accelerator: "Command+X",
        selector: "cut:"
      }, {
        label: locale.messages["appMenu.copy"],
        accelerator: "Command+C",
        selector: "copy:"
      }, {
        label: locale.messages["appMenu.paste"],
        accelerator: "Command+V",
        selector: "paste:"
      }, {
        label: locale.messages["appMenu.selectAll"],
        accelerator: "Command+A",
        selector: "selectAll:"
      } ]
    }, {
      label: locale.messages["appMenu.view"],
      submenu: [ {
        label: "Toggle Full Screen",
        accelerator: "Ctrl+Command+F",
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      } ]
    }, {
      label: locale.messages["appMenu.window"],
      submenu: [ {
        label: locale.messages["appMenu.minimize"],
        accelerator: "Command+M",
        selector: "performMiniaturize:"
      }, {
        label: locale.messages["appMenu.close"],
        accelerator: "Command+W",
        selector: "performClose:"
      }, {
        type: "separator"
      }, {
        label: locale.messages["appMenu.bringAllFront"],
        selector: "arrangeInFront:"
      } ]
    } ];
  } else {
    template = [ {
      label: locale.messages["appMenu.file"],
      submenu: [ {
        label: "&Close",
        accelerator: "Ctrl+W",
        click() {
          mainWindow.close();
        }
      } ]
    }, {
      label: locale.messages["appMenu.view"],
      submenu: [ {
        label: locale.messages["appMenu.toggleFullScreen"],
        accelerator: "F11",
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        },
      }, {
        label: locale.messages["appMenu.reloadUI"],
        accelerator: "F5",
        click() {
          mainWindow.webContents.send("app-reload-requested", mainWindow);
        },
      } ]
    } ];
  }
  template.push(
    {
      label: locale.messages["appMenu.advanced"],
      submenu: [ {
        label: locale.messages["appMenu.developerTools"],
        accelerator: "Alt+Ctrl+I",
        click() {
          mainWindow.toggleDevTools();
        }
      }, {
        label: locale.messages["appMenu.showWalletLog"],
        click() {
          shell.openItem(getDirectoryLogs(appDataDirectory()));
        }
      }, {
        label: locale.messages["appMenu.showDaemonLog"],
        click() {
          shell.openItem(getDirectoryLogs(getDcrdPath()));
        }
      } ]
    }, {
      label: locale.messages["appMenu.help"],
      submenu: [ {
        label: locale.messages["appMenu.learnMore"],
        click() {
          shell.openExternal("https://decred.org");
        }
      }, {
        label: locale.messages["appMenu.documentation"],
        click() {
          shell.openExternal("https://github.com/decred/decrediton");
        }
      }, {
        label: locale.messages["appMenu.communityDiscussions"],
        click() {
          shell.openExternal("https://forum.decred.org");
        }
      }, {
        label: locale.messages["appMenu.searchIssues"],
        click() {
          shell.openExternal("https://github.com/decred/decrediton/issues");
        }
      }, {
        label: locale.messages["appMenu.about"],
        click() {
          if (!versionWin) {
            versionWin = new BrowserWindow({ width: 575, height: 275, show: false, autoHideMenuBar: true, resizable: false });
            versionWin.on("closed", () => {
              versionWin = null;
            });

            // Load a remote URL
            versionWin.loadURL(`file://${__dirname}/staticPages/version.html`);

            versionWin.once("ready-to-show", () => {
              versionWin.webContents.send("exes-versions", readExesVersion());
              versionWin.show();
            });
          }
        }
      } ]
    });
  menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

app.on("before-quit", (event) => {
  logger.log("info","Caught before-quit. Set decredition as was closed");
  event.preventDefault();
  cleanShutdown();
  setMustOpenForm(true);
  app.exit(0);
});
