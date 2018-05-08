import { app, BrowserWindow, Menu, shell, dialog } from "electron";
import { initGlobalCfg, validateGlobalCfgFile, setMustOpenForm } from "./config";
import { initWalletCfg, getWalletCfg, newWalletConfigCreation, createTempDcrdConf } from "./config";
import fs from "fs-extra";
import path from "path";
import parseArgs from "minimist";
import { appLocaleFromElectronLocale, default as locales } from "./i18n/locales";
import { createLogger, lastLogLine, GetDcrdLogs, GetDcrwalletLogs } from "./main_dev/logging";
import { OPTIONS, USAGE_MESSAGE, VERSION_MESSAGE, BOTH_CONNECTION_ERR_MESSAGE } from "./main_dev/constants";
import { appDataDirectory, getDcrdPath, dcrctlCfg, dcrdCfg, getDcrwalletPath } from "./main_dev/paths";
import { getWalletPath, getExecutablePath, getWalletsDirectoryPath, getWalletsDirectoryPathNetwork } from "./main_dev/paths";
import { getGlobalCfgPath, getWalletDBPathFromWallets, getDcrdRpcCert, getDirectoryLogs, checkAndInitWalletCfg } from "./main_dev/paths";
import { installSessionHandlers, reloadAllowedExternalRequests, allowStakepoolRequests } from "./main_dev/externalRequests";
import { setupProxy } from "./main_dev/proxy";
import { cleanShutdown, launchDCRD, launchDCRWallet, GetDcrwPort, GetDcrdPID, GetDcrwPID } from "./main_dev/launch";
import { getAvailableWallets, startDaemon, createWallet, removeWallet, stopWallet, startWallet } from "./main_dev/ipc"

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
let template;
let mainWindow = null;
let versionWin = null;
let grpcVersions = { requiredVersion: null, walletVersion: null };
let previousWallet = null;
let currentBlockCount;
let primaryInstance;

const globalCfg = initGlobalCfg();
const daemonIsAdvanced = globalCfg.get("daemon_start_advanced");
const walletsDirectory = getWalletsDirectoryPath();
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
      } catch (e) { } // eslint-disable-line
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

ipcMain.on("setup-proxy", () => {
  setupProxy(logger);
});

ipcMain.on("get-available-wallets", (event, network) => {
  event.returnValue = getAvailableWallets(network);
});

ipcMain.on("start-daemon", (event, appData, testnet) => {
  event.returnValue = startDaemon(mainWindow, daemonIsAdvanced, primaryInstance, appData, testnet);
});

ipcMain.on("create-wallet", (event, walletPath, testnet) => {
  event.returnValue = createWallet(testnet, walletPath);
});

ipcMain.on("remove-wallet", (event, walletPath, testnet) => {
  event.returnValue = removeWallet(testnet, walletPath);
});

ipcMain.on("stop-wallet", (event) => {
  event.returnValue = stopWallet();
});

ipcMain.on("start-wallet", (event, walletPath, testnet) => {
  event.returnValue = startWallet(mainWindow, daemonIsAdvanced, testnet, walletPath);
});

ipcMain.on("check-daemon", (event, rpcCreds, testnet) => {
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
  const stopped = await cleanShutdown(mainWindow, app, GetDcrdPID(), GetDcrwPID());
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
  event.returnValue = GetDcrdLogs();
});

ipcMain.on("get-dcrwallet-logs", (event) => {
  event.returnValue = GetDcrwalletLogs();
});

ipcMain.on("get-decrediton-logs", (event) => {
  event.returnValue = "decrediton logs!";
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
    await setupProxy(logger);
  }
  windowOpts.title = "Decrediton - " + app.getVersion();

  mainWindow = new BrowserWindow(windowOpts);
  installSessionHandlers(logger);
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
          cleanShutdown(mainWindow, app, GetDcrdPID(), GetDcrwPID());
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
          shell.openItem(getDirectoryLogs(getDcrwalletPath()));
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
            versionWin = new BrowserWindow({ width: 575, height: 325, show: false, autoHideMenuBar: true, resizable: false });
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
  cleanShutdown(mainWindow, app, GetDcrdPID(), GetDcrwPID());
  setMustOpenForm(true);
  app.exit(0);
});
