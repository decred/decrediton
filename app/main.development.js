import fs from "fs-extra";
import parseArgs from "minimist";
import { app, BrowserWindow, Menu, dialog } from "electron";
import { initGlobalCfg, validateGlobalCfgFile, setMustOpenForm } from "./config";
import { appLocaleFromElectronLocale, default as locales } from "./i18n/locales";
import { createLogger, lastLogLine, GetDcrdLogs, GetDcrwalletLogs } from "./main_dev/logging";
import { OPTIONS, USAGE_MESSAGE, VERSION_MESSAGE, BOTH_CONNECTION_ERR_MESSAGE, MAX_LOG_LENGTH } from "./main_dev/constants";
import { getWalletsDirectoryPath, getWalletsDirectoryPathNetwork, appDataDirectory } from "./main_dev/paths";
import { getGlobalCfgPath, checkAndInitWalletCfg } from "./main_dev/paths";
import { installSessionHandlers, reloadAllowedExternalRequests, allowStakepoolRequests, allowExternalRequest } from "./main_dev/externalRequests";
import { setupProxy } from "./main_dev/proxy";
import { cleanShutdown, GetDcrdPID, GetDcrwPID } from "./main_dev/launch";
import { getAvailableWallets, startDaemon, createWallet, removeWallet, stopDaemon, stopWallet, startWallet, checkDaemon, deleteDaemon, setWatchingOnlyWallet, getWatchingOnlyWallet, getDaemonInfo } from "./main_dev/ipc";
import { initTemplate, getVersionWin, setGrpcVersions, getGrpcVersions, inputMenu, selectionMenu } from "./main_dev/templates";
import { readFileBackward } from "./helpers/byteActions";

// setPath as decrediton
app.setPath("userData", appDataDirectory());

const argv = parseArgs(process.argv.slice(1), OPTIONS);
const debug = argv.debug || process.env.NODE_ENV === "development";
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
let mainWindow = null;
let previousWallet = null;
let primaryInstance;

const globalCfg = initGlobalCfg();
const daemonIsAdvanced = globalCfg.get("daemon_start_advanced");
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

ipcMain.on("start-daemon", (event, appData, testnet) => {
  event.returnValue = startDaemon(mainWindow, daemonIsAdvanced, primaryInstance, appData, testnet, reactIPC);
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

ipcMain.on("check-daemon", (event, rpcCreds, testnet) => {
  checkDaemon(mainWindow, rpcCreds, testnet);
});

ipcMain.on("get-info", (event, rpcCreds) => {
  getDaemonInfo(mainWindow, rpcCreds, false);
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

primaryInstance = app.requestSingleInstanceLock();
const stopSecondInstance = !primaryInstance && !daemonIsAdvanced;
if (stopSecondInstance) {
  logger.log("error", "Preventing second instance from running.");
}

app.on("ready", async () => {
  // when installing (on first run) locale will be empty. Determine the user's
  // OS locale and set that as decrediton's locale.
  const cfgLocale = globalCfg.get("locale", "");
  let locale = locales.find(value => value.key === cfgLocale);
  if (!locale) {
    const newCfgLocale = appLocaleFromElectronLocale(app.getLocale());
    logger.log("error", `Locale ${cfgLocale} not found. Switching to locale ${newCfgLocale}.`);
    globalCfg.set("locale", newCfgLocale);
    locale = locales.find(value => value.key === newCfgLocale);
  }

  let windowOpts = {
    show: false,
    minWidth: 350,
    width: 1178,
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
