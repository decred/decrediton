import { app, BrowserWindow, Menu, shell, dialog } from "electron";
import { getCfg, appDataDirectory, validateCfgFile, getCfgPath, dcrdCfg, dcrwCfg, writeCfgs, getDcrdPath } from "./config.js";
import path from "path";
import os from "os";
import parseArgs from "minimist";
import winston from "winston";

let menu;
let template;
let daemonWindow = null;
let mainWindow = null;
let debug = false;
let dcrdPID;
let dcrwPID;
let daemonReady = false;

// Not going to make incorrect options fatal since running in dev mode has
// all sorts of things on the cmd line that we don't care about.  If we want
// to make this fatal, it must be for production mode only.
function unknownFn(arg) {
  console.log("%s is not a valid option!", arg);
  return;
}

// Allowed cmd line options are defined here.
var opts = {
  boolean: ["debug", "testnet", "mainnet"],
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

var execPath;
if (process.env.NODE_ENV === "development") {
  execPath =  __dirname;
} else {
  execPath = process.resourcesPath;
}

if (process.env.NODE_ENV === "production") {
  const sourceMapSupport = require('source-map-support'); // eslint-disable-line
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === "development") {
  require("electron-debug")(); // eslint-disable-line global-require
  const path = require('path'); // eslint-disable-line
  const p = path.join(__dirname, '..', 'app', 'node_modules'); // eslint-disable-line
  require('module').globalPaths.push(p); // eslint-disable-line
}

// Always use reasonable path for save data.
app.setPath("userData", appDataDirectory());

// Verify that config.json is valid JSON before fetching it, because
// it will silently fail when fetching.
let err = validateCfgFile();
if(err !== null) {
  let errMessage = "There was an error while trying to load the config file, the format is invalid.\n\nFile: " + getCfgPath() + "\nError: " + err;
  dialog.showErrorBox("Config File Error", errMessage);
  app.quit();
}
var cfg = getCfg();

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      json: false,
      filename: path.join(app.getPath("userData"),"decrediton.log"),
      timestamp: function() {
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
  logger.add(winston.transports.Console, {colorize: "all"});
}

logger.log("info", "Using config/data from:" + app.getPath("userData"));

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
  closeDCRW();
  closeDCRD();
}

function cleanShutdown() {
  // Attempt a clean shutdown.
  const cliShutDownPause = 2; // in seconds.
  const shutDownPause = 3; // in seconds.
  closeClis();
  // Sent shutdown message again as we have seen it missed in the past if they
  // are still running.
  setTimeout(function(){closeClis();}, cliShutDownPause*1000);
  logger.log("info", "Closing decrediton.");
  setTimeout(function(){app.quit();}, shutDownPause*1000);
}

app.on("window-all-closed", () => {
  // If we could reopen after closing all windows on OSX we might want
  // to on do this only if !== 'darwin' but since we don't, better to
  // have the same behavior on all platforms.
  cleanShutdown();
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
      } catch (e) {} // eslint-disable-line
    }
  }
};

const {ipcMain} = require("electron");

ipcMain.on("start-daemon", (event, arg) => {
  logger.log("info", "launching dcrd at " + arg);
  try {
    launchDCRD(arg.rpcuser, arg.rpcpassword, arg.host);
  } catch (e) {
    logger.log("error", "error launching dcrd: " + e);
  }
  event.returnValue = arg;
});

ipcMain.on("check-daemon", (event, arg) => {
  var spawn = require("child_process").spawn;
  var args = ["--testnet", "getbestblock"];

  var dcrctlExe = path.join(execPath, "bin", "dcrctl");

  args.push("-u " + arg.rpcuser);
  args.push("-P " + arg.rpcpassword);

  logger.log("info", `checking if daemon is ready  with dcrctl ${args}`);

  var dcrctl = spawn(dcrctlExe, args, { detached: false, stdio: [ "ignore", stdout, stderr, "pipe" ] });

  dcrctl.stdout.on("data", (data) => {
    logger.log("info", data.toString());
    daemonReady = true;
    event.returnValue = true;
  });
  dcrctl.stderr.on("data", (data) => {
    logger.log("error", data.toString());
    event.returnValue = false;
  });
});

const launchDCRD = (rpcuser, rpcpassword) => {
  var spawn = require("child_process").spawn;
  var args = ["--configfile="+dcrdCfg()];

  var dcrdExe = path.join(execPath, "bin", "dcrd");

  if (os.platform() == "win32") {
    try {
      const util = require("util");
      const win32ipc = require("./node_modules/win32ipc/build/Release/win32ipc");
      var pipe = win32ipc.createPipe("out");
      args.push(util.format("--piperx=%d", pipe.readEnd));
      dcrdExe = dcrdExe + ".exe";
    } catch(e) {
      logger.log("error", "can't find proper module to launch dcrd: " + e);
    }
  }

  args.push("-u " + rpcuser);
  args.push("-P " + rpcpassword);

  logger.log("info", `Starting dcrd with ${args}`);

  var dcrd = spawn(dcrdExe, args, {
    detached: os.platform() == "win32",
    stdio: [ "ignore", stdout, stderr ]
  });

  dcrd.on("error", function (err) {
    logger.log("error", "error starting " + dcrdExe + ": " + path + err);
  });

  dcrd.on("close", (code) => {
    logger.log("info", `dcrd exited with code ${code}`);
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
};

const launchDCRWallet = () => {
  var spawn = require("child_process").spawn;
  var args = ["--configfile="+dcrwCfg()];

  var dcrwExe = path.join(execPath, "bin", "dcrwallet");
  if (os.platform() == "win32") {
    try {
      const util = require("util");
      const win32ipc = require("./node_modules/win32ipc/build/Release/win32ipc");
      var pipe = win32ipc.createPipe("out");
      args.push(util.format("--piperx=%d", pipe.readEnd));
      dcrwExe = dcrwExe + ".exe";
    } catch (e) {
      logger.log("error", "can't find proper module to launch dcrwallet: " + e);
    }
  }

  // Add any extra args if defined.
  if (argv.extrawalletargs != undefined) {
    var extraArgs = argv.extrawalletargs.split(" ");
    for (var i = 0; i < extraArgs.length; i++) {
      args.push(extraArgs[i]);
    }
  }

  logger.log("info", `Starting dcrwallet with ${args}`);

  var dcrwallet = spawn(dcrwExe, args, {
    detached: os.platform() == "win32",
    stdio: [ "ignore", stdout, stderr, "ignore" ]
  });

  dcrwallet.on("error", function (err) {
    logger.log("error", "error starting " + dcrwExe + ": " + path + err);
  });

  dcrwallet.on("close", (code) => {
    logger.log("info", `dcrwallet exited with code ${code}`);
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
};

app.on("ready", async () => {
  await installExtensions();
  // Write application config files.
  await writeCfgs();

  daemonWindow = new BrowserWindow({
    autoHideMenuBar: true,
    show: false,
    width: 400,
    height: 400,
  });

  await loadDaemonWindow();
});

const loadDaemonWindow = async () => {

  daemonWindow.loadURL(`file://${__dirname}/loader.html`);

  daemonWindow.once("ready-to-show", () => {
    daemonWindow.show();
    daemonWindow.focus();
  });

  daemonWindow.on("closed", () => {
    daemonWindow = null;
    if (daemonReady) {
      logger.log("info", "daemon rpc ready, opening wallet");
      loadMainWindow();
    } else {
      logger.log("info", "daemon not ready, shutting down");
    }
  });

  if (process.env.NODE_ENV === "development") {
    daemonWindow.openDevTools();
    daemonWindow.webContents.on("context-menu", (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([{
        label: "Inspect element",
        click() {
          daemonWindow.inspectElement(x, y);
        }
      }]).popup(daemonWindow);
    });
  }
};

const loadMainWindow = async () => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1178,
    height: 790,
  });
  try {
    await launchDCRWallet();
  } catch (e) {
    logger.log("error", "error launching dcrwallet: " + e);
  }

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.webContents.on("did-finish-load", () => {
    // Check if daemon and wallet started up and error if not.
    if (!require("is-running")(dcrwPID)) {
      logger.log("error", "Error running dcrwallet.  Check logs and restart!");
      mainWindow.webContents.executeJavaScript("alert(\"Error running dcrwallet.  Check logs and restart!\");");
      mainWindow.webContents.executeJavaScript("window.close();");
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

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

  if (process.platform === "darwin") {
    template = [{
      label: "Decrediton",
      submenu: [{
        label: "About Decrediton",
        selector: "orderFrontStandardAboutPanel:"
      }, {
        type: "separator"
      }, {
        label: "Services",
        submenu: []
      }, {
        type: "separator"
      }, {
        label: "Hide Decrediton",
        accelerator: "Command+H",
        selector: "hide:"
      }, {
        label: "Hide Others",
        accelerator: "Command+Shift+H",
        selector: "hideOtherApplications:"
      }, {
        label: "Show All",
        selector: "unhideAllApplications:"
      }, {
        type: "separator"
      }, {
        label: "Quit",
        accelerator: "Command+Q",
        click() {
          cleanShutdown();
        }
      }]
    }, {
      label: "Edit",
      submenu: [{
        label: "Undo",
        accelerator: "Command+Z",
        selector: "undo:"
      }, {
        label: "Redo",
        accelerator: "Shift+Command+Z",
        selector: "redo:"
      }, {
        type: "separator"
      }, {
        label: "Cut",
        accelerator: "Command+X",
        selector: "cut:"
      }, {
        label: "Copy",
        accelerator: "Command+C",
        selector: "copy:"
      }, {
        label: "Paste",
        accelerator: "Command+V",
        selector: "paste:"
      }, {
        label: "Select All",
        accelerator: "Command+A",
        selector: "selectAll:"
      }]
    }, {
      label: "View",
      submenu: [{
        label: "Toggle Full Screen",
        accelerator: "Ctrl+Command+F",
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }]
    }, {
      label: "Window",
      submenu: [{
        label: "Minimize",
        accelerator: "Command+M",
        selector: "performMiniaturize:"
      }, {
        label: "Close",
        accelerator: "Command+W",
        selector: "performClose:"
      }, {
        type: "separator"
      }, {
        label: "Bring All to Front",
        selector: "arrangeInFront:"
      }]
    }];
  } else {
    template = [{
      label: "&File",
      submenu: [{
        label: "&Close",
        accelerator: "Ctrl+W",
        click() {
          mainWindow.close();
        }
      }]
    }, {
      label: "&View",
      submenu: [{
        label: "Toggle &Full Screen",
        accelerator: "F11",
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }]
    }];
  }
  template.push(
    {
      label: "Advanced",
      submenu: [{
        label: "Toggle Developer Tools",
        accelerator: "Alt+Ctrl+I",
        click() {
          mainWindow.toggleDevTools();
        }
      }, {
        label: "Show Wallet Log Files",
        click() {
          shell.openItem(path.join(appDataDirectory(), "logs"));
        }
      }, {
        label: "Show Daemon Log Files",
        click() {
          shell.openItem(path.join(getDcrdPath(), "logs"));
        }
      }]
    }, {
      label: "Help",
      submenu: [{
        label: "Learn More",
        click() {
          shell.openExternal("https://decred.org");
        }
      }, {
        label: "Documentation",
        click() {
          shell.openExternal("https://github.com/decred/decrediton");
        }
      }, {
        label: "Community Discussions",
        click() {
          shell.openExternal("https://forum.decred.org");
        }
      }, {
        label: "Search Issues",
        click() {
          shell.openExternal("https://github.com/decred/decrediton/issues");
        }
      }]
    });
  menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};
