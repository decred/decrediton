import { app, BrowserWindow, Menu, shell } from 'electron';

let menu;
let template;
let mainWindow = null;
var mainNet = true;

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

process.argv.some(function(element) {
  if (element === '--testnet') {
    mainNet = false;
    return true;
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

function appDataDirectory() {
  const path = require('path');
  const os = require('os');

  if (process.platform === 'darwin') {
    return path.join(os.homedir(), 'Library','Application Data','Decrediton');
  }

  return path.join(os.homedir(),'.decrediton');
}

function RPCWalletPort() {
  if (mainNet == true) {
    return "9112"
  }
  return "19112"
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
  var args = ['--rpcuser=USER','--rpcpass=PASSWORD'];

  // The spawn() below opens a pipe on fd 3
  args.push('--piperx=3');

  if (mainNet == false) {
     args.push('--testnet');
  }

  console.log(`Starting dcrd with ${args}`);
  var dcrd = spawn('dcrd', args, { detached: true, stdio: [ 'ignore', 'pipe', 'pipe', 'pipe' ] });

  dcrd.on('error', function (err) {
    console.log('error starting dcrd: ' + err);
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
}

const launchDCRWallet = () => {
  var spawn = require('child_process').spawn;
  var args = ['--noinitialload','--tlscurve=P-256','--onetimetlskey'];

  // RPC
  args.push('--username=USER');
  args.push('--password=PASSWORD');

  // The spawn() below opens a pipe on fd 4
  args.push('--piperx=4');

  args.push('--appdata=' + appDataDirectory());
  args.push('--experimentalrpclisten=127.0.0.1:' + RPCWalletPort());
  if (mainNet == false) {
     args.push('--testnet');
  }
  console.log(`Starting dcrwallet with ${args}`);
  var dcrwallet = spawn('dcrwallet', args, { detached: true, stdio: [ 'ignore', 'pipe', 'pipe', 'ignore', 'pipe'  ] });

  dcrwallet.on('error', function (err) {
    console.log('error starting dcrwallet: ' + err);
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
