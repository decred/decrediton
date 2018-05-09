import { app, shell, BrowserWindow } from "electron";
import { appLocaleFromElectronLocale, default as locales } from "../i18n/locales";
import { initGlobalCfg } from "../config";
import { createLogger } from "./logging";
import { cleanShutdown, GetDcrdPID, GetDcrwPID, readExesVersion } from "./launch";
import { getDirectoryLogs, getDcrwalletPath, getDcrdPath } from "./paths";

let versionWin = null;
let grpcVersions = { requiredVersion: null, walletVersion: null };

const logger = createLogger();

const globalCfg = initGlobalCfg();

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

const darwinTemplate = (mainWindow) => [
  {
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
  }
];

const regularTemplate = (mainWindow) => [ {
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

const defaultTemplate = (mainWindow) => [ {
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
        versionWin.loadURL(`file://${__dirname}/../staticPages/version.html`);

        versionWin.once("ready-to-show", () => {
          versionWin.webContents.send("exes-versions", readExesVersion(app, grpcVersions));
          versionWin.show();
        });
      }
    }
  } ]
} ];

export const initTemplate = (mainWindow) => {
  let template;

  if (process.platform === "darwin") {
    template = darwinTemplate(mainWindow);
  } else {
    template = regularTemplate(mainWindow);
  }
  template.push(...defaultTemplate(mainWindow));

  return template;
};

export const getVersionWin = () => versionWin;

export const getGrpcVersions = () => grpcVersions;

export const setGrpcVersions = (versions) => grpcVersions = versions;

const inputMenuRoles = [
  { role: "cut" },
  { role: "copy" },
  { role: "paste" },
  { type: "separator" },
  { role: "selectall" }
];
const selectionMenuRoles = [
  { role: "copy" },
  { type: "separator" },
  { role: "selectall" }
];

const inspectElement = (mainWindow, x,y) => {
  return {
    label: "Inspect element",
    click: () => mainWindow.inspectElement(x, y)
  };
};

export const inputMenu = (isDevelopment, mainWindow, x, y) => isDevelopment ?
  [ ...inputMenuRoles, inspectElement(mainWindow, x, y) ] : inputMenuRoles;

export const selectionMenu = (isDevelopment, mainWindow, x, y) => isDevelopment ?
  [ ...selectionMenuRoles, inspectElement(mainWindow, x, y) ] : selectionMenuRoles;
