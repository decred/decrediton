import fs from "fs-extra";
import os from "os";
import path from "path";
import parseArgs from "minimist";
import { app, BrowserWindow, Menu, dialog } from "electron";
import {
  getCurrentBitcoinConfig,
  updateDefaultBitcoinConfig,
  initGlobalCfg,
  validateGlobalCfgFile
} from "./config";
import {
  appLocaleFromElectronLocale,
  default as locales
} from "./i18n/locales";
import {
  createLogger,
  lastLogLine,
  GetDcrdLogs,
  GetDcrwalletLogs,
  GetDcrlndLogs,
  getPrivacyLogs,
  cleanPrivacyLogs
} from "./main_dev/logging";
import {
  getWalletsDirectoryPath,
  getWalletsDirectoryPathNetwork,
  getAppDataDirectory
} from "./main_dev/paths";
import { getGlobalCfgPath, checkAndInitWalletCfg } from "./main_dev/paths";
import {
  installSessionHandlers,
  reloadAllowedExternalRequests,
  LEGACY_allowStakepoolRequests,
  allowVSPRequests,
  allowExternalRequest
} from "./main_dev/externalRequests";
import { setupProxy } from "./main_dev/proxy";
import {
  getDaemonInfo,
  cleanShutdown,
  GetDcrdPID,
  GetDcrwPID,
  getBlockChainInfo,
  connectRpcDaemon,
  setHeightSynced,
  getHeightSynced,
  getDcrdRpcCredentials,
  setSelectedWallet,
  getSelectedWallet,
  GetDcrlndPID,
  GetDcrlndCreds,
  dropDCRDSocket,
  getDcrwalletGrpcKeyCert,
  __pingDex
} from "./main_dev/launch";
import {
  getAvailableWallets,
  startDaemon,
  createWallet,
  removeWallet,
  stopDaemon,
  stopWallet,
  startWallet,
  deleteDaemon,
  setWatchingOnlyWallet,
  getWatchingOnlyWallet,
  startDcrlnd,
  stopDcrlnd,
  removeDcrlnd,
  lnScbInfo,
  startDex,
  stopDex,
  checkInitDex,
  initDex,
  createWalletDex,
  userDex,
  loginDex,
  logoutDex,
  getConfigDex,
  registerDex
} from "./main_dev/ipc";
import {
  initTemplate,
  getVersionWin,
  setGrpcVersions,
  getGrpcVersions,
  inputMenu,
  selectionMenu
} from "./main_dev/templates";
import { readFileBackward } from "./helpers/files";
import electron from "electron";
import { isString } from "./fp";
import {
  OPTIONS,
  BOTH_CONNECTION_ERR_MESSAGE,
  MAX_LOG_LENGTH,
  SPV_CONNECT_WITHOUT_SPV,
  RPC_WITHOUT_ADVANCED_MODE,
  RPCCONNECT_INVALID_FORMAT,
  RPC_MISSING_OPTIONS,
  SPV_WITH_ADVANCED_MODE,
  TESTNET,
  MAINNET
} from "constants";
import { USAGE_MESSAGE, VERSION_MESSAGE } from "main_dev/constants";
import {
  DAEMON_ADVANCED,
  LOCALE,
  DISABLE_HARDWARE_ACCEL
} from "constants/config";
import {
  default as devtoolsInstaller,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} from "electron-devtools-installer";

// setPath as decrediton
app.setPath("userData", getAppDataDirectory());
app.allowRendererProcessReuse = true;

// See if we can communicate with the dexc lib.
const dexPingRes = __pingDex("__pong");
if (dexPingRes.params != "__pong") {
  console.error("Error pinging DEX lib", dexPingRes);
}

const argv = parseArgs(process.argv.slice(1), OPTIONS);
const debug = argv.debug || process.env.NODE_ENV === "development";
const logger = createLogger(debug);
const cliOptions = {};

// Verify that config.json is valid JSON before fetching it, because
// it will silently fail when fetching.
const err = validateGlobalCfgFile();
if (err !== null) {
  const errMessage =
    "There was an error while trying to load the config file, the format is invalid.\n\nFile: " +
    getGlobalCfgPath() +
    "\nError: " +
    err;
  dialog.showErrorBox("Config File Error", errMessage);
  app.quit();
}

let menu;
let mainWindow = null;
let previousWallet = null;

const globalCfg = initGlobalCfg();
const daemonIsAdvanced = argv.advanced || globalCfg.get(DAEMON_ADVANCED);
const walletsDirectory = getWalletsDirectoryPath();
const mainnetWalletsPath = getWalletsDirectoryPathNetwork(false);
const testnetWalletsPath = getWalletsDirectoryPathNetwork(true);
if (globalCfg.get(DISABLE_HARDWARE_ACCEL)) {
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
} else if (
  !argv.advanced &&
  (argv.rpcuser || argv.rpcpass || argv.rpccert || argv.rpcconnect)
) {
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
  // TODO add default port based on network.
  cliOptions.rpcPort = parts[1];
}
cliOptions.rpcPresent = rpcOptionsCount == 4 ? true : false;

if (process.env.NODE_ENV === "production") {
  const sourceMapSupport = require("source-map-support"); // eslint-disable-line
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === "development") {
  const path = require("path"); // eslint-disable-line
  const p = path.join(__dirname, "..", "app", "node_modules"); // eslint-disable-line
  require("module").globalPaths.push(p); // eslint-disable-line
}

// Check that wallets directory has been created, if not, make it.
fs.pathExistsSync(walletsDirectory) || fs.mkdirsSync(walletsDirectory);
fs.pathExistsSync(mainnetWalletsPath) || fs.mkdirsSync(mainnetWalletsPath);
fs.pathExistsSync(testnetWalletsPath) || fs.mkdirsSync(testnetWalletsPath);

checkAndInitWalletCfg(true);
checkAndInitWalletCfg(false);

logger.log("info", "Using config/data from:" + app.getPath("userData"));
logger.log(
  "info",
  "Versions: Decrediton: %s, Electron: %s, Chrome: %s",
  app.getVersion(),
  process.versions.electron,
  process.versions.chrome
);

process.on("uncaughtException", (err) => {
  logger.log("error", "UNCAUGHT EXCEPTION", err);
  throw err;
});

const installExtensions = async () => {
  if (process.env.NODE_ENV === "development") {
    const extensions = [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS];
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    for (const name of extensions) {
      try {
        await devtoolsInstaller(name, forceDownload);
      } catch (e) {
        console.log("Error installing extension: " + e);
      }
    }
  }
};

const { ipcMain } = require("electron");

// handleEvent listens on the given channel for ipcRenderer.invoke() calls and
// returns the result of the given function or an Error instance if the function
// failed.
const handleEvent = (channel, fn) => {
  ipcMain.handle(channel, async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof Error) {
        return error;
      } else {
        return new Error(err);
      }
    }
  });
};

// handle is the same as handleEvent but pops off the first arg ("event" object)
// before calling fn.
const handle = (channel, fn) =>
  handleEvent(channel, (event, ...args) => fn(...args));

ipcMain.on("reload-allowed-external-request", (event) => {
  reloadAllowedExternalRequests();
  event.returnValue = true;
});

// LEGACY ipc request - REMOVE AFTER SUPPORTING VSP's API V1/V2
ipcMain.on("allow-stakepool-host", (event, host) => {
  LEGACY_allowStakepoolRequests(host);
  event.returnValue = true;
});

ipcMain.on("allow-vsp-host", (event, host) => {
  allowVSPRequests(host);
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

handle("start-daemon", (params, testnet) =>
  startDaemon(params, testnet, mainWindow.webContents)
);

handle("connect-daemon", ({ rpcCreds }) =>
  connectRpcDaemon(mainWindow, rpcCreds)
);

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

handle("drop-dcrd", () => dropDCRDSocket());

ipcMain.on("stop-wallet", (event) => {
  previousWallet = null;
  event.returnValue = stopWallet();
});

handle("start-wallet", (walletPath, testnet, rpcCreds) => {
  const { rpcUser, rpcPass, rpcListen, rpcCert } = rpcCreds;
  return startWallet(
    mainWindow,
    daemonIsAdvanced,
    testnet,
    walletPath,
    mainWindow.webContents,
    rpcUser,
    rpcPass,
    rpcListen,
    rpcCert
  );
});

handle("start-dcrlnd", startDcrlnd);

handle("stop-dcrlnd", stopDcrlnd);

handle("check-init-dex", checkInitDex);

handle("init-dex", initDex);

handle("login-dex", loginDex);

handle("logout-dex", logoutDex);

handle("create-wallet-dex", createWalletDex);

handle("get-config-dex", getConfigDex);

handle("register-dex", registerDex);

handle("user-dex", userDex);

handle("start-dex", startDex);

handle("stop-dex", stopDex);

handle("launch-dex-window", createDexWindow);

function createDexWindow(serverAddress) {
  const child = new BrowserWindow({
    parent: mainWindow,
    show: false,
    autoHideMenuBar: true
  });
  child.loadURL("http://" + serverAddress);
  child.once("ready-to-show", () => {
    child.show();
  });
}

handle("check-btc-config", getCurrentBitcoinConfig);

handle("update-btc-config", updateDefaultBitcoinConfig);

handle("dcrlnd-creds", () => (GetDcrlndPID() !== -1 ? GetDcrlndCreds() : null));

handle("ln-scb-info", lnScbInfo);

handle("ln-remove-dir", removeDcrlnd);

handle("check-daemon", getBlockChainInfo);

handle("daemon-getinfo", getDaemonInfo);

handle("clean-shutdown", () =>
  cleanShutdown(mainWindow, app, GetDcrdPID(), GetDcrwPID())
);

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
  const logTransport = logger.transports.find((transport) => {
    return transport.filename === "decrediton.log";
  });
  const logFileName = logTransport.dirname + "/" + logTransport.filename;
  readFileBackward(logFileName, MAX_LOG_LENGTH, (err, data) => {
    if (err) {
      logger.log("error", "Error reading log: " + err);
      return (event.returnValue = null);
    }
    event.returnValue = data.toString("utf8");
  });
});

ipcMain.on("get-last-log-line-dcrd", (event) => {
  event.returnValue = lastLogLine(GetDcrdLogs());
});

ipcMain.on("clean-privacy-logs", (event) => {
  event.returnValue = cleanPrivacyLogs();
});

ipcMain.on("get-last-log-line-dcrwallet", (event) => {
  event.returnValue = lastLogLine(GetDcrwalletLogs());
});

ipcMain.on("get-privacy-logs", (event) => {
  event.returnValue = getPrivacyLogs();
});

ipcMain.on("get-dex-logs", (event, walletPath) => {
  try {
    const dexcRoot = path.join(walletPath, "dexc");
    const logPath = path.join(dexcRoot, "logs");
    const logFilename = path.join(logPath, "dexc.log");
    readFileBackward(logFilename, MAX_LOG_LENGTH, (err, data) => {
      if (err) {
        logger.log("error", "Error reading log: " + err);
        return (event.returnValue = null);
      }
      event.returnValue = data.toString("utf8");
    });
  } catch (error) {
    event.returnValue = error;
  }
});

ipcMain.on("get-previous-wallet", (event) => {
  event.returnValue = previousWallet;
});

ipcMain.on("get-height-synced", (event) => {
  event.returnValue = getHeightSynced();
});

ipcMain.on("set-height-synced", (event, isHeightSynced) => {
  event.returnValue = setHeightSynced(isHeightSynced);
});

ipcMain.on("get-selected-wallet", (event) => {
  event.returnValue = getSelectedWallet();
});

ipcMain.on("set-selected-wallet", (event, wallet) => {
  setSelectedWallet(wallet);
  event.returnValue = true;
});

ipcMain.on("get-dcrd-rpc-credentials", (event) => {
  event.returnValue = getDcrdRpcCredentials();
});

ipcMain.on("get-dcrwallet-grpc-cert-key", (event) => {
  event.returnValue = getDcrwalletGrpcKeyCert();
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

ipcMain.handle("show-save-dialog", async () => {
  return await dialog.showSaveDialog();
});

ipcMain.handle("show-open-dialog", async (event, opts) => {
  const allowedOpts = {
    properties: opts ? opts.properties : undefined,
    filters: opts ? opts.filters : undefined
  };
  return await dialog.showOpenDialog(allowedOpts);
});

ipcMain.on("confirm-file-overwrite", (event, filename) => {
  const cfgLocale = globalCfg.get(LOCALE);
  const locale = locales.find((value) => value.key === cfgLocale);
  const msgTemplate = locale.messages["dialogs.confirmFileOverwrite"];
  const msg = msgTemplate.replace("{filename}", filename);
  const yesBtn = locale.messages["dialogs.yesButton"];
  const cancelBtn = locale.messages["dialogs.cancelButton"];
  const buttons = [cancelBtn, yesBtn];

  const opts = {
    message: msg,
    type: "question",
    buttons: buttons,
    defaultId: buttons.indexOf(cancelBtn),
    cancelId: buttons.indexOf(cancelBtn)
  };
  const res = dialog.showMessageBoxSync(mainWindow, opts);
  event.returnValue = res === buttons.indexOf(yesBtn);
});

function setMenuLocale(locale) {
  //Removes previous listeners of "context-menu" event.
  mainWindow.webContents._events["context-menu"] = [];

  mainWindow.webContents.on("context-menu", (e, props) => {
    const { selectionText, isEditable, x, y } = props;
    const inptMenu = inputMenu(
      process.env.NODE_ENV === "development",
      mainWindow,
      x,
      y,
      locale
    );
    const slctionMenu = selectionMenu(
      process.env.NODE_ENV === "development",
      mainWindow,
      x,
      y,
      locale
    );

    if (isEditable) {
      Menu.buildFromTemplate(inptMenu).popup(mainWindow);
    } else if (selectionText && selectionText.trim() !== "") {
      Menu.buildFromTemplate(slctionMenu).popup(mainWindow);
    } else if (process.env.NODE_ENV === "development") {
      Menu.buildFromTemplate([
        {
          label: "Inspect element",
          click: () => mainWindow.inspectElement(x, y)
        }
      ]).popup(mainWindow);
    }
  });

  const template = initTemplate(mainWindow, locale);

  menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

ipcMain.on("change-menu-locale", (event, newLocaleKey) => {
  const locale = locales.find((value) => value.key === newLocaleKey);
  setMenuLocale(locale);
  event.returnValue = true;
});

const primaryInstance = app.requestSingleInstanceLock();
const stopSecondInstance = !primaryInstance && !daemonIsAdvanced;
if (stopSecondInstance) {
  logger.log("error", "Preventing second instance from running.");
}

app.on("ready", async () => {
  electron.powerMonitor.on("shutdown", (e) => {
    console.log(
      "Received system shutdown request, checking if auto buyer is running"
    );
    mainWindow.webContents.send("check-can-close");
    e.preventDefault();
  });

  // when installing (on first run) locale will be empty. Determine the user's
  // OS locale and set that as decrediton's locale.
  const cfgLocale = globalCfg.get(LOCALE, "");
  let locale = locales.find((value) => value.key === cfgLocale);
  if (!locale) {
    const newCfgLocale = appLocaleFromElectronLocale(app.getLocale());
    logger.log(
      "error",
      `Locale ${cfgLocale} not found. Switching to locale ${newCfgLocale}.`
    );
    globalCfg.set(LOCALE, newCfgLocale);
    locale = locales.find((value) => value.key === newCfgLocale);
  }

  let url = `file://${__dirname}/dist/app.html`;
  const path = require("path"); // eslint-disable-line
  const preloadPath = path.resolve(__dirname, "dist", "wallet-preload.js");
  if (process.env.NODE_ENV === "development") {
    // Load from the webpack dev server with hot module replacement.
    const port = process.env.PORT || 3000;
    url = `http://localhost:${port}/dist/app.html`;
  }

  // enable remote module on windows, as decrediton will crash, otherwise, but
  // avoid it on other systems, as electron is moving away from it.
  const enableRemoteModule = os.platform() == "win32" ? true : false;

  let windowOpts = {
    show: false,
    minWidth: 350,
    width: 1192,
    minHeight: 299,
    height: 790,
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
      contextIsolation: false,
      webSecurity: false,
      enableRemoteModule,
      preload: preloadPath
    },
    icon: __dirname + "/icon.png"
  };
  if (stopSecondInstance) {
    windowOpts = {
      show: true,
      minWidth: 350,
      width: 575,
      minHeight: 299,
      height: 275,
      autoHideMenuBar: true,
      resizable: false
    };
    url = `file://${__dirname}/staticPages/secondInstance.html`;
  } else {
    await installExtensions();
    await setupProxy(logger);
  }
  windowOpts.title = "Decrediton - " + app.getVersion();

  mainWindow = new BrowserWindow(windowOpts);
  installSessionHandlers(logger);
  mainWindow.loadURL(url);

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.show();
    if (debug) mainWindow.webContents.openDevTools();
    mainWindow.focus();
  });

  mainWindow.on("close", (e) => {
    mainWindow.webContents.send("check-can-close");
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
      setTimeout(() => {
        app.quit();
      }, 2000);
    }
  });

  if (stopSecondInstance) return;

  setMenuLocale(locale);
});

app.on("before-quit", (event) => {
  logger.log("info", "Caught before-quit. Set decrediton as was closed");
  event.preventDefault();
  cleanShutdown(mainWindow, app, GetDcrdPID(), GetDcrwPID());
  app.exit(0);
});
