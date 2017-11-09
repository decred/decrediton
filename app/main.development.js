import { app, BrowserWindow, Menu, shell, dialog } from "electron";
import { concat, isString } from "lodash";
import { initCfg, appDataDirectory, validateCfgFile, getCfgPath, dcrdCfg, dcrwCfg, dcrctlCfg, writeCfgs, getDcrdPath, RPCDaemonHost, RPCDaemonPort, RPCWalletPort, GRPCWalletPort, setMustOpenForm } from "./config.js";
import path from "path";
import fs from "fs";
import os from "os";
import parseArgs from "minimist";
import winston from "winston";
import stringArgv from "string-argv";
import locales from "./i18n/locales";

let menu;
let template;
let mainWindow = null;
let versionWin = null;
let grpcVersions = {requiredVersion: null, walletVersion: null};
let debug = false;
let dcrdPID;
let dcrwPID;
let currentBlockCount;

// Not going to make incorrect options fatal since running in dev mode has
// all sorts of things on the cmd line that we don't care about.  If we want
// to make this fatal, it must be for production mode only.
function unknownFn(arg) {
  console.log("%s is not a valid option!", arg);
  return;
}

function getExecutablePath(name) {
  let binPath = process.env.NODE_ENV === "development"
    ? path.join(__dirname, "..", "bin")
    : path.join(process.resourcesPath, "bin");
  let execName = os.platform() !== "win32" ? name : name + ".exe";

  return path.join(binPath, execName);
}

function showUsage() {
  console.log(`${app.getName()} version ${app.getVersion()}
Usage
  $ ${app.getName()} [--help] [--version] [--debug] [--testnet|--mainnet]
               [--extrawalletargs=...]

Options
  --help             Show help and exit
  --version          Show version and exit
  --debug  -d        Debug daemon/wallet messages
  --testnet          Connect to testnet
  --mainnet          Connect to mainnet
  --extrawalletargs  Pass extra arguments to dcrwallet
`);
}

// Allowed cmd line options are defined here.
var opts = {
  boolean: ["debug", "testnet", "mainnet", "help", "version"],
  string: ["extrawalletargs"],
  default: { debug: false },
  alias: { d: "debug" },
  unknown: unknownFn
};

var argv = parseArgs(process.argv.slice(1), opts);
debug = argv.debug || process.env.NODE_ENV === "development";
// Output for child processes.
var stdout = "ignore";
if (debug) {
  stdout = "pipe";
}
var stderr = "ignore";
if (debug) {
  stderr = "pipe";
}

if (argv.help) {
  showUsage();
  app.exit(0);
}

if (argv.version) {
  console.log(`${app.getName()} version ${app.getVersion()}`);
  app.exit(0);
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

// Always use reasonable path for save data.
app.setPath("userData", appDataDirectory());

// Verify that config.json is valid JSON before fetching it, because
// it will silently fail when fetching.
let err = validateCfgFile();
if (err !== null) {
  let errMessage = "There was an error while trying to load the config file, the format is invalid.\n\nFile: " + getCfgPath() + "\nError: " + err;
  dialog.showErrorBox("Config File Error", errMessage);
  app.quit();
}
var cfg = initCfg();

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      json: false,
      filename: path.join(app.getPath("userData"), "decrediton.log"),
      timestamp: function () {
        // Format the timestamp in local time like the dcrd and dcrwallet logs.
        let pad = (s, n) => {
          n = n || 2;
          s = Array(n).join("0") + s;
          return s.substring(s.length - n);
        };

        let date = new Date();
        let y = date.getFullYear();
        let mo = pad(date.getMonth() + 1);
        let d = pad(date.getDate());
        let h = pad(date.getHours());
        let mi = pad(date.getMinutes());
        let s = pad(date.getSeconds());
        let ms = pad(date.getMilliseconds(), 3);
        return `${y}-${mo}-${d} ${h}:${mi}:${s}.${ms}`;
      }
    })
  ]
});

if (debug) {
  logger.add(winston.transports.Console, { colorize: "all" });
}

logger.log("info", "Using config/data from:" + app.getPath("userData"));

var createDcrdConf, createDcrwalletConf, createDcrctlConf = false;
if (!fs.existsSync(dcrdCfg())) {
  createDcrdConf = true;
  logger.log("info", "The dcrd config file does not exists, creating");
}
if (!fs.existsSync(dcrwCfg())) {
  createDcrwalletConf = true;
  logger.log("info", "The dcrwallet config file does not exists, creating");
}
if (!fs.existsSync(dcrctlCfg())) {
  createDcrctlConf = true;
  logger.log("info", "The dcrctl config file does not exists, creating");
}

// Check if network was set on command line (but only allow one!).
if (argv.testnet && argv.mainnet) {
  logger.log("Cannot use both --testnet and --mainnet.");
  app.quit();
}

if (argv.testnet) {
  cfg.set("network", "testnet");
  logger.log("info", "Running on testnet.");
}

if (argv.mainnet) {
  cfg.set("network", "mainnet");
  logger.log("info", "Running on mainnet.");
}

var cfgLocale = cfg.get("locale", "en");
var locale = locales.find(value => value.key === cfgLocale);
if (!locale) {
  logger.log("error", `Locale ${cfgLocale} not found. Returning to default`);
  locale = locales.find(value => value.name === "en");
}

let daemonIsAdvanced = cfg.get("daemon_start_advanced");

function closeDCRW() {
  if (cfg.get("wallet_skip_start")) {
    return;
  }
  if (require("is-running")(dcrwPID) && os.platform() != "win32") {
    logger.log("info", "Sending SIGINT to dcrwallet at pid:" + dcrwPID);
    process.kill(dcrwPID, "SIGINT");
  }
}

function closeDCRD() {
  if (cfg.get("daemon_skip_start")) {
    return;
  }
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

function cleanShutdown() {
  // Attempt a clean shutdown.
  const cliShutDownPause = 2; // in seconds.
  const shutDownPause = 3; // in seconds.
  closeClis();
  // Sent shutdown message again as we have seen it missed in the past if they
  // are still running.
  setTimeout(function () { closeClis(); }, cliShutDownPause * 1000);
  logger.log("info", "Closing decrediton.");

  let shutdownTimer = setInterval(function(){
    const stillRunning = (require("is-running")(dcrdPID) && os.platform() != "win32");

    if (cfg.get("daemon_skip_start") || !stillRunning) {
      logger.log("info", "Final shutdown pause. Quitting app.");
      clearInterval(shutdownTimer);
      if (mainWindow) {
        mainWindow.webContents.send("daemon-stopped");
        setTimeout(() => {mainWindow.close(); app.quit();}, 1000);
      } else {
        app.quit();
      }
      return;
    }
    logger.log("info", "Daemon still running in final shutdown pause. Waiting.");

  }, shutDownPause*1000);
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

ipcMain.on("start-daemon", (event, appData) => {
  if (dcrdPID && !daemonIsAdvanced) {
    logger.log("info", "Skipping restart of daemon as it is already running");
    event.returnValue = dcrdPID;
    return;
  }
  if(appData){
    logger.log("info", "launching dcrd with different appdata directory");
  }
  if (dcrdPID) {
    logger.log("info", "dcrd already started " + dcrdPID);
    event.returnValue = dcrdPID;
    return;
  }
  try {
    dcrdPID = launchDCRD(appData);
  } catch (e) {
    logger.log("error", "error launching dcrd: " + e);
  }
  event.returnValue = dcrdPID;
});

ipcMain.on("start-wallet", (event) => {
  if (cfg.get("wallet_skip_start")) {
    logger.log("info", "skipping start of dcrwallet as requested on config");
    dcrwPID = -1;
    event.returnValue = dcrwPID;
    return;
  }
  if (dcrwPID) {
    logger.log("info", "dcrwallet already started " + dcrwPID);
    event.returnValue = dcrwPID;
    return;
  }
  try {
    dcrwPID = launchDCRWallet();
  } catch (e) {
    logger.log("error", "error launching dcrwallet: " + e);
  }
  event.returnValue = dcrwPID;
});

ipcMain.on("check-daemon", (event, rpcCreds, appData) => {
  let args = ["getblockcount"];
  let host, port;
  if (!rpcCreds && !appData){
    host = RPCDaemonHost();
    port = RPCDaemonPort();
    args.push(`--configfile=${dcrctlCfg()}`);
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
  } else if (appData) {
    const rpccert = `${appData}/rpc.cert`;
    args.push(`--rpccert=${rpccert}`);
    args.push(`--configfile=${dcrctlCfg()}`);
    host = RPCDaemonHost();
    port = RPCDaemonPort();
  }

  var spawn = require("child_process").spawn;

  if (cfg.get("network") === "testnet") {
    args.push("--testnet");
  }
  args.push("--rpcserver=" + host + ":" + port);
  args.push("--walletrpcserver=" + cfg.get("wallet_rpc_host") + ":" + RPCWalletPort());

  var dcrctlExe = getExecutablePath("dcrctl");
  if (!fs.existsSync(dcrctlExe)) {
    logger.log("error", "The dcrctl file does not exists");
  }

  logger.log("info", `checking if daemon is ready  with dcrctl ${args}`);

  var dcrctl = spawn(dcrctlExe, args, { detached: false, stdio: ["ignore", "pipe", "pipe", "pipe"] });

  dcrctl.stdout.on("data", (data) => {
    currentBlockCount = data.toString();
    logger.log("info", data.toString());
    event.returnValue = currentBlockCount;
  });
  dcrctl.stderr.on("data", (data) => {
    logger.log("error", data.toString());
    event.returnValue = 0;
  });
});

ipcMain.on("clean-shutdown", () => {
  cleanShutdown();
});

ipcMain.on("app-reload-ui", () => {
  mainWindow.reload();
});

ipcMain.on("grpc-versions-determined", (event, versions) => {
  grpcVersions = { ...grpcVersions, ...versions };
});

const launchDCRD = (appdata) => {
  var spawn = require("child_process").spawn;
  let args = [];
  if(appdata){
    args = [`--appdata=${appdata}`,`--configfile=${dcrdCfg()}`];
  } else {
    args = [`--configfile=${dcrdCfg()}`];
  }

  if (cfg.get("network") === "testnet") {
    args.push("--testnet");
  }

  args.push("--rpclisten=" + RPCDaemonHost() + ":" + RPCDaemonPort());

  var dcrdExe = getExecutablePath("dcrd");
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

  logger.log("info", `Starting dcrd with ${args}`);

  var dcrd = spawn(dcrdExe, args, {
    detached: os.platform() == "win32",
    stdio: ["ignore", stdout, stderr]
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

  if (debug) {
    dcrd.stdout.on("data", (data) => {
      process.stdout.write(`${data}`);
    });

    dcrd.stderr.on("data", (data) => {
      process.stderr.write(`${data}`);
    });
  }

  dcrdPID = dcrd.pid;
  logger.log("info", "dcrd started with pid:" + dcrdPID);

  dcrd.unref();
  return dcrdPID;
};

const launchDCRWallet = () => {
  var spawn = require("child_process").spawn;
  var args = ["--configfile=" + dcrwCfg()];

  if (cfg.get("network") === "testnet") {
    args.push("--testnet");
  }
  if (cfg.get("enableticketbuyer") === "1") {
    args.push("--enableticketbuyer");
  }
  args.push("--rpcconnect=" + RPCDaemonHost() + ":" + RPCDaemonPort());
  args.push("--rpclisten=" + cfg.get("wallet_rpc_host") + ":" + RPCWalletPort());
  args.push("--grpclisten=" + cfg.get("wallet_rpc_host") + ":" + GRPCWalletPort());

  args.push("--ticketbuyer.balancetomaintainabsolute=" + cfg.get("balancetomaintain"));
  args.push("--ticketbuyer.maxfee=" + cfg.get("maxfee"));
  args.push("--ticketbuyer.maxpricerelative=" + cfg.get("maxpricerelative"));
  args.push("--ticketbuyer.maxpriceabsolute=" + cfg.get("maxpriceabsolute"));
  args.push("--ticketbuyer.maxperblock=" + cfg.get("maxperblock"));

  var dcrwExe = getExecutablePath("dcrwallet");
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
  }

  // Add any extra args if defined.
  if (argv.extrawalletargs !== undefined && isString(argv.extrawalletargs)) {
    args = concat(args, stringArgv(argv.extrawalletargs));
  }

  logger.log("info", `Starting dcrwallet with ${args}`);

  var dcrwallet = spawn(dcrwExe, args, {
    detached: os.platform() == "win32",
    stdio: ["ignore", stdout, stderr, "ignore"]
  });

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

  if (debug) {
    dcrwallet.stdout.on("data", (data) => {
      process.stdout.write(`${data}`);
    });

    dcrwallet.stderr.on("data", (data) => {
      process.stderr.write(`${data}`);
    });
  }

  dcrwPID = dcrwallet.pid;
  logger.log("info", "dcrwallet started with pid:" + dcrwPID);

  dcrwallet.unref();
  return dcrwPID;
};

const readExesVersion = () => {
  let spawn = require("child_process").spawnSync;
  let args = ["--version"];
  let exes = ["dcrd", "dcrwallet", "dcrctl"];
  let versions = {
    grpc: grpcVersions,
    decrediton: app.getVersion()
  };

  for (let exe of exes) {
    let exePath = getExecutablePath("dcrd");
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

let primaryInstance = !app.makeSingleInstance(function () {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

if (!primaryInstance) {
  logger.log("error", "Another instance of decrediton is already running");
}

app.on("ready", async () => {

  let windowOpts = {show: false, width: 1178, height: 790, page: "app.html"};
  if (!primaryInstance) {
    windowOpts = {show: true, width: 575, height: 275, autoHideMenuBar: true,
      resizable: false, page: "staticPages/secondInstance.html"};
  } else {
    await installExtensions();
    // Write application config files.
    await writeCfgs(createDcrdConf, createDcrwalletConf, createDcrctlConf);
  }

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
    if (!primaryInstance) {
      app.quit();
      setTimeout(() => { app.quit(); }, 2000);
    }
  });

  if (!primaryInstance) {
    logger.log("error", "stopping ready");
    return;
  }

  if (process.env.NODE_ENV === "development") {
    mainWindow.openDevTools();
    mainWindow.webContents.on("context-menu", (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([{
        label: "Inspect element",
        click() {
          mainWindow.inspectElement(x, y);
        }
      }]).popup(mainWindow);
    });
  }

  if (!primaryInstance) return;

  if (process.platform === "darwin") {
    template = [{
      label: locale.messages["appMenu.decrediton"],
      submenu: [{
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
      }]
    }, {
      label: locale.messages["appMenu.edit"],
      submenu: [{
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
      }]
    }, {
      label: locale.messages["appMenu.view"],
      submenu: [{
        label: "Toggle Full Screen",
        accelerator: "Ctrl+Command+F",
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }]
    }, {
      label: locale.messages["appMenu.window"],
      submenu: [{
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
      }]
    }];
  } else {
    template = [{
      label: locale.messages["appMenu.file"],
      submenu: [{
        label: "&Close",
        accelerator: "Ctrl+W",
        click() {
          mainWindow.close();
        }
      }]
    }, {
      label: locale.messages["appMenu.view"],
      submenu: [{
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
      }]
    }];
  }
  template.push(
    {
      label: locale.messages["appMenu.advanced"],
      submenu: [{
        label: locale.messages["appMenu.developerTools"],
        accelerator: "Alt+Ctrl+I",
        click() {
          mainWindow.toggleDevTools();
        }
      }, {
        label: locale.messages["appMenu.showWalletLog"],
        click() {
          shell.openItem(path.join(appDataDirectory(), "logs"));
        }
      }, {
        label: locale.messages["appMenu.showDaemonLog"],
        click() {
          shell.openItem(path.join(getDcrdPath(), "logs"));
        }
      }]
    }, {
      label: locale.messages["appMenu.help"],
      submenu: [{
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
      }]
    });
  menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

app.on("before-quit", (event) => {
  logger.log("info","Caught before-quit. Set decredition as was closed");
  event.preventDefault();
  setMustOpenForm(true);
  app.exit(0);
});
