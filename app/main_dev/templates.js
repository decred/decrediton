const versionWin = null;
let grpcVersions = { requiredVersion: null, walletVersion: null };

const darwinTemplate = (mainWindow, loadCustomTranslation, locale) => [
  {
    label: locale.messages["appMenu.decrediton"],
    submenu: [
      {
        label: locale.messages["appMenu.aboutDecrediton"],
        selector: "orderFrontStandardAboutPanel:",
        click() {
          mainWindow.webContents.send("show-about-modal");
        }
      },
      {
        type: "separator"
      },
      {
        label: locale.messages["appMenu.services"],
        submenu: []
      },
      {
        type: "separator"
      },
      {
        label: locale.messages["appMenu.hideDecrediton"],
        accelerator: "Command+H",
        selector: "hide:"
      },
      {
        label: locale.messages["appMenu.hideOthers"],
        accelerator: "Command+Shift+H",
        selector: "hideOtherApplications:"
      },
      {
        label: locale.messages["appMenu.showAll"],
        selector: "unhideAllApplications:"
      },
      {
        type: "separator"
      },
      {
        label: locale.messages["appMenu.quit"],
        accelerator: "Command+Q",
        click() {
          mainWindow.webContents.send("check-can-close");
        }
      }
    ]
  },
  {
    label: locale.messages["appMenu.edit"],
    submenu: [
      {
        label: locale.messages["appMenu.undo"],
        accelerator: "Command+Z",
        selector: "undo:"
      },
      {
        label: locale.messages["appMenu.redo"],
        accelerator: "Shift+Command+Z",
        selector: "redo:"
      },
      {
        type: "separator"
      },
      {
        label: locale.messages["appMenu.cut"],
        accelerator: "Command+X",
        selector: "cut:"
      },
      {
        label: locale.messages["appMenu.copy"],
        accelerator: "Command+C",
        selector: "copy:"
      },
      {
        label: locale.messages["appMenu.paste"],
        accelerator: "Command+V",
        selector: "paste:"
      },
      {
        label: locale.messages["appMenu.selectAll"],
        accelerator: "Command+A",
        selector: "selectAll:"
      }
    ]
  },
  {
    label: locale.messages["appMenu.view"],
    submenu: [
      {
        label: "Toggle Full Screen",
        accelerator: "Ctrl+Command+F",
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      },
      {
        label: locale.messages["appMenu.loadCustomTranslation"],
        accelerator: "",
        click() {
          loadCustomTranslation();
        }
      }
    ]
  },
  {
    label: locale.messages["appMenu.window"],
    submenu: [
      {
        label: locale.messages["appMenu.minimize"],
        accelerator: "Command+M",
        selector: "performMiniaturize:"
      },
      {
        label: locale.messages["appMenu.close"],
        accelerator: "Command+W",
        selector: "performClose:"
      },
      {
        type: "separator"
      },
      {
        label: locale.messages["appMenu.bringAllFront"],
        selector: "arrangeInFront:"
      }
    ]
  }
];

const regularTemplate = (
  mainWindow,
  confirmBrowserView,
  loadCustomTranslation,
  locale
) => [
  {
    label: locale.messages["appMenu.file"],
    submenu: [
      {
        label: "&Close",
        accelerator: "Ctrl+W",
        click() {
          mainWindow.close();
        }
      }
    ]
  },
  {
    label: locale.messages["appMenu.view"],
    submenu: [
      {
        label: locale.messages["appMenu.toggleFullScreen"],
        accelerator: "F11",
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      },
      {
        label: locale.messages["appMenu.reloadUI"],
        accelerator: "F5",
        click() {
          mainWindow.webContents.send("app-reload-requested");
        }
      },
      {
        label: locale.messages["appMenu.developerTools"],
        accelerator: "Alt+Ctrl+I",
        click() {
          mainWindow.toggleDevTools();
        }
      },
      {
        label: locale.messages["appMenu.developerToolsConfWindow"],
        click() {
          confirmBrowserView.webContents.toggleDevTools();
        }
      },
      {
        label: locale.messages["appMenu.loadCustomTranslation"],
        accelerator: "",
        click() {
          loadCustomTranslation();
        }
      }
    ]
  }
];

export const initTemplate = (
  mainWindow,
  confirmBrowserView,
  loadCustomTranslation,
  locale
) => {
  let template;

  if (process.platform === "darwin") {
    template = darwinTemplate(mainWindow, loadCustomTranslation, locale);
  } else {
    template = regularTemplate(
      mainWindow,
      confirmBrowserView,
      loadCustomTranslation,
      locale
    );
  }

  return template;
};

export const getVersionWin = () => versionWin;

export const getGrpcVersions = () => grpcVersions;

export const setGrpcVersions = (versions) => (grpcVersions = versions);

const inputMenuRoles = (locale) => [
  { label: locale.messages["appMenu.cut"], role: "cut" },
  { label: locale.messages["appMenu.copy"], role: "copy" },
  { label: locale.messages["appMenu.paste"], role: "paste" },
  { type: "separator" },
  { label: locale.messages["appMenu.selectAll"], role: "selectall" }
];
const selectionMenuRoles = (locale) => [
  { label: locale.messages["appMenu.copy"], role: "copy" },
  { type: "separator" },
  { label: locale.messages["appMenu.selectAll"], role: "selectall" }
];

const inspectElement = (mainWindow, x, y) => {
  return {
    label: "Inspect element",
    click: () => mainWindow.inspectElement(x, y)
  };
};

export const inputMenu = (isDevelopment, mainWindow, x, y, locale) =>
  isDevelopment
    ? [...inputMenuRoles(locale), inspectElement(mainWindow, x, y)]
    : inputMenuRoles(locale);

export const selectionMenu = (isDevelopment, mainWindow, x, y, locale) =>
  isDevelopment
    ? [...selectionMenuRoles(locale), inspectElement(mainWindow, x, y)]
    : selectionMenuRoles(locale);
