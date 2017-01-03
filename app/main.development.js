import { app, BrowserWindow, Menu, shell } from 'electron';
import { getCfg } from './config.js';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { api_literal } from './api.contents.js';

let menu;
let template;
let mainWindow = null;

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

var cfg = getCfg();

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

function appDataDirectory() {
  const path = require('path');
  const os = require('os');

  if (process.platform === 'darwin') {
    return path.join(os.homedir(), 'Library','Application Support','decrediton');
  }

  return path.join(os.homedir(),'.decrediton');
}

function GRPCWalletPort() {
  if (cfg.network == 'mainnet') {
    return cfg.wallet_port;
  }
  return cfg.wallet_port_testnet;
}

function RPCDaemonPort() {
  if (cfg.network == 'mainnet') {
    return cfg.daemon_port;
  }
  return cfg.daemon_port_testnet;
}

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
  var args = ['--rpcuser='+cfg.rpc_user,'--rpcpass='+cfg.rpc_pass];

  var dcrdExe = path.join(process.resourcesPath, 'bin', 'dcrd')
  if (os.platform() == 'win32') {
    dcrdExe = dcrdExe + '.exe';
  }

  // The spawn() below opens a pipe on fd 3
  args.push('--piperx=3');

  if (cfg.network == 'testnet') {
    args.push('--testnet');
  }

  args.push('--rpclisten=127.0.0.1:' + RPCDaemonPort());

  console.log(`Starting dcrd with ${args}`);
  var dcrd = spawn(dcrdExe, args, { detached: true, stdio: [ 'ignore', 'pipe', 'pipe', 'pipe' ] });

  dcrd.on('error', function (err) {
    console.log('error starting ' + dcrdExe + ': ' + path);
  });

  dcrd.on('close', (code) => {
    console.log(`dcrd exited with code ${code}`);
  });

  dcrd.stdout.on('data', (data) => {
    process.stdout.write(`${data}`);
  });

  dcrd.stderr.on('data', (data) => {
    process.stderr.write(`${data}`);
  });

  dcrd.unref();
};

const launchDCRWallet = () => {
  var spawn = require('child_process').spawn;
  var args = ['--noinitialload','--tlscurve=P-256','--onetimetlskey'];

  var dcrwExe = path.join(process.resourcesPath, 'bin', 'dcrwallet')
  if (os.platform() == 'win32') {
    dcrwExe = dcrwExe + '.exe';
  }

  // RPC
  args.push('--username=USER');
  args.push('--password=PASSWORD');

  // The spawn() below opens a pipe on fd 4
  args.push('--piperx=4');

  args.push('--appdata=' + appDataDirectory());
  args.push('--experimentalrpclisten=127.0.0.1:' + GRPCWalletPort());
  if (cfg.network == 'testnet') {
    args.push('--testnet');
  }
  console.log(`Starting dcrwallet with ${args}`);
  var dcrwallet = spawn(dcrwExe, args, { detached: true, stdio: [ 'ignore', 'pipe', 'pipe', 'ignore', 'pipe'  ] });

  dcrwallet.on('error', function (err) {
    console.log('error starting ' + dcrwExe + ': ' + path);
  });

  dcrwallet.on('close', (code) => {
    console.log(`dcrwallet exited with code ${code}`);
  });

  dcrwallet.stdout.on('data', (data) => {
    process.stdout.write(`${data}`);
  });

  dcrwallet.stderr.on('data', (data) => {
    process.stderr.write(`${data}`);
  });

  dcrwallet.unref();
};

app.on('ready', async () => {
  await installExtensions();

  var apiPath = path.join(appDataDirectory(), 'api.proto');
  fs.writeFile(apiPath, api_literal, function(err) {
    if(err) {
      return console.log(err);
    }
  });

  if (process.env.NODE_ENV === 'production') {
    try {
      launchDCRD();
    } catch (e) {
      console.log('error launching dcrd: ' + e);
    }
    try {
      launchDCRWallet();
    } catch (e) {
      console.log('error launching dcrwallet: ' + e);
    }
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.webContents.on('did-finish-load', () => {
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
          app.quit();
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
