import fs from "fs-extra";
import parseArgs from "minimist";
import { app, BrowserWindow, Menu, dialog } from "electron";
import { initGlobalCfg, validateGlobalCfgFile, setMustOpenForm } from "./config";
import { appLocaleFromElectronLocale, default as locales } from "./i18n/locales";
import { createLogger, lastLogLine, GetDcrdLogs, GetDcrwalletLogs, GetDcrlndLogs } from "./main_dev/logging";
import { getWalletsDirectoryPath, getWalletsDirectoryPathNetwork, getAppDataDirectory } from "./main_dev/paths";
import { getGlobalCfgPath, checkAndInitWalletCfg } from "./main_dev/paths";
import { installSessionHandlers, reloadAllowedExternalRequests, allowStakepoolRequests, allowExternalRequest } from "./main_dev/externalRequests";
import { setupProxy } from "./main_dev/proxy";
import { getDaemonInfo, cleanShutdown, GetDcrdPID, GetDcrwPID, getBlockChainInfo, connectRpcDaemon,
  GetDcrlndPID, GetDcrlndCreds } from "./main_dev/launch";
import { getAvailableWallets, startDaemon, createWallet, removeWallet, stopDaemon, stopWallet, startWallet,
  deleteDaemon, setWatchingOnlyWallet, getWatchingOnlyWallet, startDcrlnd, stopDcrlnd } from "./main_dev/ipc";
import { initTemplate, getVersionWin, setGrpcVersions, getGrpcVersions, inputMenu, selectionMenu } from "./main_dev/templates";
import { readFileBackward } from "./helpers/byteActions";
import electron from "electron";
import { isString } from "./fp";
import { OPTIONS, USAGE_MESSAGE, VERSION_MESSAGE, BOTH_CONNECTION_ERR_MESSAGE, MAX_LOG_LENGTH, SPV_CONNECT_WITHOUT_SPV,
  RPC_WITHOUT_ADVANCED_MODE, RPCCONNECT_INVALID_FORMAT, RPC_MISSING_OPTIONS, SPV_WITH_ADVANCED_MODE, TESTNET, MAINNET } from "constants";
import { DAEMON_ADVANCED, LOCALE } from "constants/config";

// setPath as decrediton
app.setPath("userData", getAppDataDirectory());

const argv = parseArgs(process.argv.slice(1), OPTIONS);
const debug = argv.debug || process.env.NODE_ENV === "development";
const logger = createLogger(debug);
let cliOptions = {};

// Verify that config.json is valid JSON before fetching it, because
// it will silently fail when fetching.
let err = validateGlobalCfgFile();
if (err !== null) {
  let errMessage = "There was an error while trying to load the config file, the format is invalid.\n\nFile: " + getGlobalCfgPath() + "\nError: " + err;
  dialog.showErrorBox("Config File Error", errMessage);
  app.quit();
}

let menu;
let mainWindow = null;
let previousWallet = null;
let primaryInstance;

const globalCfg = initGlobalCfg();
const daemonIsAdvanced = argv.advanced || globalCfg.get(DAEMON_ADVANCED);
const walletsDirectory = getWalletsDirectoryPath();
const mainnetWalletsPath = getWalletsDirectoryPathNetwork(false);
const testnetWalletsPath = getWalletsDirectoryPathNetwork(true);
if (globalCfg.get("disable_hardware_accel")) {
  logger.log("info", "Disabling hardware acceleration");
  app.disableHardwareAcceleration();
}

if (argv.help) {
  console.log(USAGE_MESSAGE);
  app.exit(0);
}

if (argv.version) {
  console.log(VERSION_MESSAGE);
  app.exit(0);
}

let rpcOptionsCount = 0;
rpcOptionsCount += argv.rpcuser ? 1 : 0;
rpcOptionsCount += argv.rpcpass ? 1 : 0;
rpcOptionsCount += argv.rpccert ? 1 : 0;
rpcOptionsCount += argv.rpcconnect ? 1 : 0;

// Allow at most one network to be specified
if (argv.testnet && argv.mainnet) {
  console.log(BOTH_CONNECTION_ERR_MESSAGE);
  app.quit();
} else if (!argv.spv && argv.spvconnect !== undefined) {
  console.log(SPV_CONNECT_WITHOUT_SPV);
  app.quit();
} else if (argv.spv && argv.advanced) {
  console.log(SPV_WITH_ADVANCED_MODE);
  app.quit();
} else if (!argv.advanced && (argv.rpcuser || argv.rpcpass || argv.rpccert || argv.rpcconnect)) {
  console.log(RPC_WITHOUT_ADVANCED_MODE);
  app.quit();
} else if (rpcOptionsCount > 0 && rpcOptionsCount < 4) {
  console.log(RPC_MISSING_OPTIONS);
  app.quit();
}

// Signal to renderer process that CLI options should override the global config
if (argv.testnet) {
  cliOptions.network = TESTNET;
} else if (argv.mainnet) {
  cliOptions.network = MAINNET;
}
if (argv.advanced) {
  cliOptions.daemonStartAdvanced = true;
}
if (argv.spv) {
  cliOptions.spvMode = true;
}
if (isString(argv.spvconnect)) {
  cliOptions.spvConnect = argv.spvconnect.split(",");
}
if (isString(argv.rpcuser)) {
  cliOptions.rpcUser = argv.rpcuser;
}
if (isString(argv.rpcpass)) {
  cliOptions.rpcPass = argv.rpcpass;
}
if (isString(argv.rpccert)) {
  cliOptions.rpcCert = argv.rpccert;
}
if (isString(argv.rpcconnect)) {
  const parts = argv.rpcconnect.split(":");
  // Allowed formats: "127.0.0.1" or "127.0.0.1:19109"
  if (parts.length !== 1 && parts.length !== 2) {
    logger.log("error", RPCCONNECT_INVALID_FORMAT);
    app.quit();
  }
  cliOptions.rpcHost = parts[0];
  cliOptions.rpcPort = parts[1] || "9109";
}
cliOptions.rpcPresent = rpcOptionsCount == 4 ? true : false;

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

checkAndInitWalletCfg(true);
checkAndInitWalletCfg(false);

logger.log("info", "Using config/data from:" + app.getPath("userData"));
logger.log("info", "Versions: Decrediton: %s, Electron: %s, Chrome: %s",
  app.getVersion(), process.versions.electron, process.versions.chrome);

process.on("uncaughtException", err => {
  logger.log("error", "UNCAUGHT EXCEPTION", err);
  throw err;
});

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
      } catch (e) {
        console.log("Error installing extesion: " + e);
      }
    }
  }
};

const { ipcMain } = require("electron");

ipcMain.on("reload-allowed-external-request", (event) => {
  reloadAllowedExternalRequests();
  event.returnValue = true;
});

ipcMain.on("allow-stakepool-host", (event, host) => {
  allowStakepoolRequests(host);
  event.returnValue = true;
});

ipcMain.on("allow-external-request", (event, requestType) => {
  allowExternalRequest(requestType);
  event.returnValue = true;
});

ipcMain.on("setup-proxy", () => {
  setupProxy(logger);
});

ipcMain.on("get-available-wallets", (event, network) => {
  event.returnValue = getAvailableWallets(network);
});

ipcMain.on("start-daemon", async (event, params, testnet) => {
  const startedCredentials = await startDaemon(params, testnet, reactIPC);
  event.returnValue = startedCredentials;
});

ipcMain.on("connect-daemon", (event, { rpcCreds }) => {
  event.returnValue = connectRpcDaemon(mainWindow, rpcCreds);
});

ipcMain.on("delete-daemon", (event, appData, testnet) => {
  event.returnValue = deleteDaemon(appData, testnet);
});

ipcMain.on("create-wallet", (event, walletPath, testnet) => {
  event.returnValue = createWallet(testnet, walletPath);
});

ipcMain.on("remove-wallet", (event, walletPath, testnet) => {
  event.returnValue = removeWallet(testnet, walletPath);
});

ipcMain.on("stop-daemon", (event) => {
  event.returnValue = stopDaemon();
});

ipcMain.on("stop-wallet", (event) => {
  previousWallet = null;
  event.returnValue = stopWallet();
});

ipcMain.on("start-wallet", (event, walletPath, testnet) => {
  event.returnValue = startWallet(mainWindow, daemonIsAdvanced, testnet, walletPath, reactIPC);
});

ipcMain.on("start-dcrlnd", async (event, walletAccount, walletPort, rpcCreds,
  walletPath, testnet, autopilotEnabled) => {
  try {
    event.returnValue = await startDcrlnd(walletAccount, walletPort, rpcCreds,
      walletPath, testnet, autopilotEnabled);
  } catch (error) {
    if (!(error instanceof Error)) {
      event.returnValue = new Error(error);
    } else {
      event.returnValue = error;
    }
  }
});

ipcMain.on("stop-dcrlnd", async (event) => {
  event.returnValue = await stopDcrlnd();
});

ipcMain.on("dcrlnd-creds", event => {
  if (GetDcrlndPID() && GetDcrlndPID() !== -1) {
    event.returnValue = GetDcrlndCreds();
  } else {
    event.returnValue = null;
  }
});

ipcMain.on("check-daemon", () => {
  getBlockChainInfo();
});

ipcMain.on("daemon-getinfo", () => {
  getDaemonInfo();
});

ipcMain.on("clean-shutdown", async function(event){
  const stopped = await cleanShutdown(mainWindow, app, GetDcrdPID(), GetDcrwPID());
  event.sender.send("clean-shutdown-finished", stopped);
});

var reactIPC;
ipcMain.on("register-for-errors", function(event){
  reactIPC = event.sender;
  event.returnValue = true;
});

ipcMain.on("app-reload-ui", () => {
  mainWindow.reload();
});

ipcMain.on("grpc-versions-determined", (event, versions) => {
  setGrpcVersions({ ...getGrpcVersions(), ...versions });
});

ipcMain.on("main-log", (event, ...args) => {
  logger.log(...args);
});

ipcMain.on("get-dcrd-logs", (event) => {
  event.returnValue = GetDcrdLogs();
});

ipcMain.on("get-dcrwallet-logs", (event) => {
  event.returnValue = GetDcrwalletLogs();
});

ipcMain.on("get-dcrlnd-logs", (event) => {
  event.returnValue = GetDcrlndLogs();
});

ipcMain.on("get-decrediton-logs", (event) => {
  const logFileName = logger.transports.file.dirname + "/" +logger.transports.file.filename;
  readFileBackward(logFileName, MAX_LOG_LENGTH, (err, data) => {
    if (err) {
      logger.log("error", "Error reading log: "+ err );
      return event.returnValue = null;
    }
    event.returnValue = data.toString("utf8");
  });
});

ipcMain.on("get-last-log-line-dcrd", event => {
  event.returnValue = lastLogLine(GetDcrdLogs());
});

ipcMain.on("get-last-log-line-dcrwallet", event => {
  event.returnValue = lastLogLine(GetDcrwalletLogs());
});

ipcMain.on("get-previous-wallet", (event) => {
  event.returnValue = previousWallet;
});

ipcMain.on("set-previous-wallet", (event, cfg) => {
  previousWallet = cfg;
  event.returnValue = true;
});

ipcMain.on("set-is-watching-only", (event, isWatchingOnly) => {
  setWatchingOnlyWallet(isWatchingOnly);
  event.returnValue = true;
});

ipcMain.on("get-is-watching-only", (event) => {
  event.returnValue = getWatchingOnlyWallet();
});

ipcMain.on("get-cli-options", (event) => {
  event.returnValue = cliOptions;
});

primaryInstance = app.requestSingleInstanceLock();
const stopSecondInstance = !primaryInstance && !daemonIsAdvanced;
if (stopSecondInstance) {
  logger.log("error", "Preventing second instance from running.");
}

app.on("ready", async () => {
  electron.powerMonitor.on("shutdown", (e) => {
    console.log("Received system shutdown request, checking if auto buyer is running");
    mainWindow.webContents.send("check-auto-buyer-running");
    e.preventDefault();
  });

  // when installing (on first run) locale will be empty. Determine the user's
  // OS locale and set that as decrediton's locale.
  const cfgLocale = globalCfg.get(LOCALE, "");
  let locale = locales.find(value => value.key === cfgLocale);
  if (!locale) {
    const newCfgLocale = appLocaleFromElectronLocale(app.getLocale());
    logger.log("error", `Locale ${cfgLocale} not found. Switching to locale ${newCfgLocale}.`);
    globalCfg.set(LOCALE, newCfgLocale);
    locale = locales.find(value => value.key === newCfgLocale);
  }

  let windowOpts = {
    show: false,
    minWidth: 350,
    width: 1192,
    minHeight: 299,
    height: 790,
    page: "app.html"
  };
  if (stopSecondInstance) {
    windowOpts = {
      show: true,
      minWidth: 350,
      width: 575,
      minHeight: 299,
      height: 275,
      autoHideMenuBar: true,
      resizable: false,
      page: "staticPages/secondInstance.html"
    };
  } else {
    await installExtensions();
    await setupProxy(logger);
  }
  windowOpts.title = "Decrediton - " + app.getVersion();

  mainWindow = new BrowserWindow(windowOpts);
  installSessionHandlers(logger);
  if (debug) mainWindow.openDevTools();
  mainWindow.loadURL(`file://${__dirname}/${windowOpts.page}`);

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on("close", (e) => {
    mainWindow.webContents.send("check-auto-buyer-running");
    e.preventDefault();
    if (stopSecondInstance) {
      app.quit();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
    if (getVersionWin() !== null) {
      getVersionWin().close();
    }
    if (stopSecondInstance) {
      app.quit();
      setTimeout(() => { app.quit(); }, 2000);
    }
  });

  if (stopSecondInstance) return;

  mainWindow.webContents.on("context-menu", (e, props) => {
    const { selectionText, isEditable, x, y } = props;
    const inptMenu = inputMenu(process.env.NODE_ENV === "development", mainWindow, x, y);
    const slctionMenu = selectionMenu(process.env.NODE_ENV === "development", mainWindow, x, y);

    if (isEditable) {
      Menu.buildFromTemplate(inptMenu).popup(mainWindow);
    } else if (selectionText && selectionText.trim() !== "") {
      Menu.buildFromTemplate(slctionMenu).popup(mainWindow);
    } else if (process.env.NODE_ENV === "development") {
      Menu.buildFromTemplate([ {
        label: "Inspect element",
        click: () => mainWindow.inspectElement(x, y)
      } ]).popup(mainWindow);
    }
  });

  const template = initTemplate(mainWindow, locale);

  menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

app.on("before-quit", (event) => {
  logger.log("info","Caught before-quit. Set decredition as was closed");
  event.preventDefault();
  cleanShutdown(mainWindow, app, GetDcrdPID(), GetDcrwPID());
  setMustOpenForm(true);
  app.exit(0);
});
