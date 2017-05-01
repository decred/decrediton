import { app, BrowserWindow, Menu, shell } from 'electron';
import { getCfg, appDataDirectory, dcrdCfg, dcrwCfg, writeCfgs } from './config.js';
import path from 'path';
import os from 'os';
import parseArgs from 'minimist';

let menu;
let template;
let mainWindow = null;
let debug = false;
let dcrdPID;
let dcrwPID;

// Not going to make incorrect options fatal since running in dev mode has
// all sorts of things on the cmd line that we don't care about.  If we want
// to make this fatal, it must be for production mode only.
function unknownFn(arg) {
  console.log('%s is not a valid option!', arg);
  return;
}

// Allowed cmd line options are defined here.
var opts = {
  boolean: ['debug', 'testnet', 'mainnet'],
  string: ['extrawalletargs'],
  default: { debug: false },
  alias: { d: 'debug' },
  unknown: unknownFn
};
var argv = parseArgs(process.argv.slice(1), opts);
debug = argv.debug;
// Output for child processes.
var stdout = 'ignore';
if (debug) {
  stdout = 'pipe';
}

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support'); // eslint-disable-line
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')(); // eslint-disable-line global-require
  const path = require('path'); // eslint-disable-line
  const p = path.join(__dirname, '..', 'app', 'node_modules'); // eslint-disable-line
  require('module').globalPaths.push(p); // eslint-disable-line
}

// Always use reasonable path for save data.
app.setPath('userData', appDataDirectory());
var cfg = getCfg();

if (debug) {
  console.log('Using config/data from:', app.getPath('userData'));
}

// Check if network was set on command line (but only allow one!).
if (argv.testnet && argv.mainnet) {
  console.log('Cannot use both --testnet and --mainnet.');
  app.quit();
}

if (argv.testnet) {
  cfg.set('network', 'testnet');
  if (debug) {
    console.log('Running on testnet.');
  }
}

if (argv.mainnet) {
  cfg.set('network', 'mainnet');
  if (debug) {
    console.log('Running on mainnet.');
  }
}

function closeClis() {
    // shutdown daemon and wallet.
    // Don't try to close if not running.
  if (require('is-running')(dcrwPID)) {
    if (debug) {
      console.log('Sending SIGINT to dcrwallet at pid:', dcrwPID);
    }
    process.kill(dcrwPID, 'SIGINT');
  }
  if (require('is-running')(dcrdPID)) {
    if (debug) {
      console.log('Sending SIGINT to dcrd at pid:', dcrdPID);
    }
    process.kill(dcrdPID, 'SIGINT');
  }
}

function cleanShutdown() {
  // Attempt a clean shutdown.
  const cliShutDownPause = 2; // in seconds.
  const shutDownPause = 3; // in seconds.
  if (process.env.NODE_ENV === 'production') {
    closeClis();
    // Sent shutdown message again as we have seen it missed in the past if they
    // are still running.
    setTimeout(function(){closeClis();}, cliShutDownPause*1000);
    if (debug) {
      console.log('Closing decrediton.');
    }
    setTimeout(function(){app.quit();}, shutDownPause*1000);
  } else {
    app.quit();
  }
}

app.on('window-all-closed', () => {
  // If we could reopen after closing all windows on OSX we might want
  // to on do this only if !== 'darwin' but since we don't, better to
  // have the same behavior on all platforms.
  cleanShutdown();
});

const installExtensions = async () => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require('electron-devtools-installer'); // eslint-disable-line global-require

    const extensions = [
      'REACT_DEVELOPER_TOOLS',
      'REDUX_DEVTOOLS'
    ];
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    for (const name of extensions) { // eslint-disable-line
      try {
        await installer.default(installer[name], forceDownload);
      } catch (e) {} // eslint-disable-line
    }
  }
};

const launchDCRD = () => {
  var spawn = require('child_process').spawn;
  var args = ['--configfile='+dcrdCfg()];

  var dcrdExe = path.join(process.resourcesPath, 'bin', 'dcrd');
  if (os.platform() == 'win32') {
    dcrdExe = dcrdExe + '.exe';
  }

  if (os.platform() != 'win32') {
    // The spawn() below opens a pipe on fd 3
    args.push('--piperx=3');
  }

  if (debug) {
    console.log(`Starting dcrd with ${args}`);
  }
  var dcrd = spawn(dcrdExe, args, { detached: false, stdio: [ 'ignore', stdout, 'pipe', 'pipe' ] });

  dcrd.on('error', function (err) {
    console.log('error starting ' + dcrdExe + ': ' + path + err);
  });

  dcrd.on('close', (code) => {
    if (debug) {
      console.log(`dcrd exited with code ${code}`);
    }
  });

  if (debug) {
    dcrd.stdout.on('data', (data) => {
      process.stdout.write(`${data}`);
    });

    dcrd.stderr.on('data', (data) => {
      process.stderr.write(`${data}`);
    });
  }

  dcrdPID = dcrd.pid;
  if (debug) {
    console.log('dcrd started with pid:', dcrdPID);
  }

  dcrd.unref();
};

const launchDCRWallet = () => {
  var spawn = require('child_process').spawn;
  var args = ['--configfile='+dcrwCfg()];

  var dcrwExe = path.join(process.resourcesPath, 'bin', 'dcrwallet');
  if (os.platform() == 'win32') {
    dcrwExe = dcrwExe + '.exe';
  }

  if (os.platform() != 'win32') {
    // The spawn() below opens a pipe on fd 4
    // No luck getting this to work on win7.
    args.push('--piperx=4');
  }

  // Add any extra args if defined.
  if (argv.extrawalletargs != undefined) {
    var extraArgs = argv.extrawalletargs.split(' ');
    for (var i = 0; i < extraArgs.length; i++) {
      args.push(extraArgs[i]);
    }
  }

  if (debug) {
    console.log(`Starting dcrwallet with ${args}`);
  }
  var dcrwallet = spawn(dcrwExe, args, { detached: false, stdio: [ 'ignore', stdout, 'pipe', 'ignore', 'pipe'  ] });

  dcrwallet.on('error', function (err) {
    console.log('error starting ' + dcrwExe + ': ' + path + err);
  });

  dcrwallet.on('close', (code) => {
    if (debug) {
      console.log(`dcrwallet exited with code ${code}`);
    }
  });

  if (debug) {
    dcrwallet.stdout.on('data', (data) => {
      process.stdout.write(`${data}`);
    });

    dcrwallet.stderr.on('data', (data) => {
      process.stderr.write(`${data}`);
    });
  }

  dcrwPID = dcrwallet.pid;
  if (debug) {
    console.log('dcrwallet started with pid:', dcrwPID);
  }

  dcrwallet.unref();
};

app.on('ready', async () => {
  await installExtensions();
  // Write application config files.
  await writeCfgs();

  if (process.env.NODE_ENV === 'production') {
    try {
      await launchDCRD();
    } catch (e) {
      console.log('error launching dcrd: ' + e);
    }
    try {
      await launchDCRWallet();
    } catch (e) {
      console.log('error launching dcrwallet: ' + e);
    }
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1178,
    height: 770,
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    if (process.env.NODE_ENV === 'production') {
      // Check if daemon and wallet started up and error if not.
      if (!require('is-running')(dcrwPID)) {
        if (debug) {
          console.log('Error running dcrwallet.  Check logs and restart!');
        }
        mainWindow.webContents.executeJavaScript('alert("Error running dcrwallet.  Check logs and restart!");');
        mainWindow.webContents.executeJavaScript('window.close();');
      }
      if (!require('is-running')(dcrdPID)) {
        if (debug) {
          console.log('Error running dcrd.  Check logs and restart!');
        }
        mainWindow.webContents.executeJavaScript('alert("Error running dcrd.  Check logs and restart!");');
        mainWindow.webContents.executeJavaScript('window.close();');
      }
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools();
    mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([{
        label: 'Inspect element',
        click() {
          mainWindow.inspectElement(x, y);
        }
      }]).popup(mainWindow);
    });
  }

  if (process.platform === 'darwin') {
    template = [{
      label: 'Decrediton',
      submenu: [{
        label: 'About Decrediton',
        selector: 'orderFrontStandardAboutPanel:'
      }, {
        type: 'separator'
      }, {
        label: 'Services',
        submenu: []
      }, {
        type: 'separator'
      }, {
        label: 'Hide Decrediton',
        accelerator: 'Command+H',
        selector: 'hide:'
      }, {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        selector: 'hideOtherApplications:'
      }, {
        label: 'Show All',
        selector: 'unhideAllApplications:'
      }, {
        type: 'separator'
      }, {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() {
          cleanShutdown();
        }
      }]
    }, {
      label: 'Edit',
      submenu: [{
        label: 'Undo',
        accelerator: 'Command+Z',
        selector: 'undo:'
      }, {
        label: 'Redo',
        accelerator: 'Shift+Command+Z',
        selector: 'redo:'
      }, {
        type: 'separator'
      }, {
        label: 'Cut',
        accelerator: 'Command+X',
        selector: 'cut:'
      }, {
        label: 'Copy',
        accelerator: 'Command+C',
        selector: 'copy:'
      }, {
        label: 'Paste',
        accelerator: 'Command+V',
        selector: 'paste:'
      }, {
        label: 'Select All',
        accelerator: 'Command+A',
        selector: 'selectAll:'
      }]
    }, {
      label: 'View',
      submenu: (process.env.NODE_ENV === 'development') ? [{
        label: 'Reload',
        accelerator: 'Command+R',
        click() {
          mainWindow.webContents.reload();
        }
      }, {
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }, {
        label: 'Toggle Developer Tools',
        accelerator: 'Alt+Command+I',
        click() {
          mainWindow.toggleDevTools();
        }
      }] : [{
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }]
    }, {
      label: 'Window',
      submenu: [{
        label: 'Minimize',
        accelerator: 'Command+M',
        selector: 'performMiniaturize:'
      }, {
        label: 'Close',
        accelerator: 'Command+W',
        selector: 'performClose:'
      }, {
        type: 'separator'
      }, {
        label: 'Bring All to Front',
        selector: 'arrangeInFront:'
      }]
    }, {
      label: 'Help',
      submenu: [{
        label: 'Learn More',
        click() {
          shell.openExternal('https://decred.org');
        }
      }, {
        label: 'Documentation',
        click() {
          shell.openExternal('https://github.com/decred/decrediton');
        }
      }, {
        label: 'Community Discussions',
        click() {
          shell.openExternal('https://forum.decred.org');
        }
      }, {
        label: 'Search Issues',
        click() {
          shell.openExternal('https://github.com/decred/decrediton/issues');
        }
      }]
    }];

    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  } else {
    template = [{
      label: '&File',
      submenu: [{
        label: '&Open',
        accelerator: 'Ctrl+O'
      }, {
        label: '&Close',
        accelerator: 'Ctrl+W',
        click() {
          mainWindow.close();
        }
      }]
    }, {
      label: '&View',
      submenu: (process.env.NODE_ENV === 'development') ? [{
        label: '&Reload',
        accelerator: 'Ctrl+R',
        click() {
          mainWindow.webContents.reload();
        }
      }, {
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }, {
        label: 'Toggle &Developer Tools',
        accelerator: 'Alt+Ctrl+I',
        click() {
          mainWindow.toggleDevTools();
        }
      }] : [{
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }]
    }, {
      label: 'Help',
      submenu: [{
        label: 'Learn More',
        click() {
          shell.openExternal('https://decred.org');
        }
      }, {
        label: 'Documentation',
        click() {
          shell.openExternal('https://github.com/decred/decrediton');
        }
      }, {
        label: 'Community Discussions',
        click() {
          shell.openExternal('https://forum.decred.org');
        }
      }, {
        label: 'Search Issues',
        click() {
          shell.openExternal('https://github.com/decred/decrediton/issues');
        }
      }]
    }];
    menu = Menu.buildFromTemplate(template);
    mainWindow.setMenu(menu);
  }
});
