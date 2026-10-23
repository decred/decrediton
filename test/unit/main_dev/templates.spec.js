import * as t from "../../../app/main_dev/templates";
import * as ct from "../../../app/main_dev/customTranslation";
import { default as locales } from "../../../app/i18n/locales";
import { cloneDeep } from "lodash";
const templates = t;
const customTranslation = ct;
const enLocale = locales.find((value) => value.key === "en");
const testMainWindow = {
  setBounds: jest.fn(() => {})
};
const testConfirmBrowserView = {
  setAutoResize: () => {},
  setBounds: () => {},
  getBounds: () => {},
  setBackgroundColor: () => {},
  webContents: () => {}
};

let mockLoadCustomTranslation;

beforeEach(() => {
  Object.defineProperty(process, "platform", {
    value: "linux"
  });
  mockLoadCustomTranslation = customTranslation.loadCustomTranslation = jest.fn(
    () => {}
  );
});

const testClickOnMenu = (
  template,
  menuLabel,
  submenuLabel,
  expectedMockedFunction,
  expectedMockFunctionParameter
) => {
  expectedMockedFunction.mockClear();
  template
    .find((menu) => menu.label === menuLabel)
    .submenu.find((sm) => sm.label === submenuLabel)
    .click();
  if (expectedMockFunctionParameter) {
    expect(expectedMockedFunction).toHaveBeenCalledWith(
      expectedMockFunctionParameter
    );
  } else {
    expect(expectedMockedFunction).toHaveBeenCalledTimes(1);
  }
};

test("test initTemplate", () => {
  const mockSend = jest.fn(() => {});
  const mockClose = jest.fn(() => {});
  const mockFullScreen = jest.fn(() => {});
  const mockToggleDevToolsMainWindow = jest.fn(() => {});
  const mockToggleDevTools = jest.fn(() => {});
  const testConfirmBrowserViewCopy = {
    ...cloneDeep(testConfirmBrowserView),
    webContents: {
      send: mockSend,
      toggleDevTools: mockToggleDevTools
    }
  };

  const testMainWindowCopy = {
    ...cloneDeep(testMainWindow),
    close: mockClose,
    setFullScreen: mockFullScreen,
    isFullScreen: () => false,
    webContents: {
      send: mockSend
    },
    toggleDevTools: mockToggleDevToolsMainWindow
  };
  const res = templates.initTemplate(
    testMainWindowCopy,
    testConfirmBrowserViewCopy,
    mockLoadCustomTranslation,
    enLocale
  );
  expect(res).toStrictEqual([
    {
      label: "&File",
      submenu: [
        { accelerator: "Ctrl+W", click: expect.any(Function), label: "&Close" }
      ]
    },
    {
      label: "&View",
      submenu: [
        {
          accelerator: "F11",
          click: expect.any(Function),
          label: "Toggle &Full Screen"
        },
        { accelerator: "F5", click: expect.any(Function), label: "Reload UI" },
        {
          accelerator: "Alt+Ctrl+I",
          click: expect.any(Function),
          label: "Toggle Developer Tools"
        },
        {
          click: expect.any(Function),
          label: "Toggle Developer Tools for Confirmation Window"
        },
        {
          accelerator: "",
          click: expect.any(Function),
          label: "Load Custom Translation"
        }
      ]
    }
  ]);

  testClickOnMenu(res, "&File", "&Close", mockClose);
  testClickOnMenu(res, "&View", "Toggle &Full Screen", mockFullScreen, true);
  testClickOnMenu(res, "&View", "Reload UI", mockSend, "app-reload-requested");
  testClickOnMenu(
    res,
    "&View",
    "Toggle Developer Tools",
    mockToggleDevToolsMainWindow
  );
  testClickOnMenu(
    res,
    "&View",
    "Toggle Developer Tools for Confirmation Window",
    mockToggleDevTools
  );
  testClickOnMenu(
    res,
    "&View",
    "Load Custom Translation",
    mockLoadCustomTranslation
  );
});

test("test initTemplate on darwin", () => {
  Object.defineProperty(process, "platform", {
    value: "darwin"
  });
  const mockSend = jest.fn(() => {});
  const mockClose = jest.fn(() => {});
  const mockFullScreen = jest.fn(() => {});
  const mockToggleDevTools = jest.fn(() => {});
  const testConfirmBrowserViewCopy = {
    ...cloneDeep(testConfirmBrowserView),
    webContents: {
      send: mockSend,
      toggleDevTools: mockToggleDevTools
    }
  };

  const testMainWindowCopy = {
    ...cloneDeep(testMainWindow),
    close: mockClose,
    setFullScreen: mockFullScreen,
    isFullScreen: () => false,
    webContents: {
      send: mockSend
    }
  };
  const res = templates.initTemplate(
    testMainWindowCopy,
    testConfirmBrowserViewCopy,
    mockLoadCustomTranslation,
    enLocale
  );
  expect(res).toStrictEqual([
    {
      label: "Decrediton",
      submenu: [
        {
          click: expect.any(Function),
          label: "About Decrediton",
          selector: "orderFrontStandardAboutPanel:"
        },
        { type: "separator" },
        { label: "Services", submenu: [] },
        { type: "separator" },
        {
          accelerator: "Command+H",
          label: "Hide Decrediton",
          selector: "hide:"
        },
        {
          accelerator: "Command+Shift+H",
          label: "Hide Others",
          selector: "hideOtherApplications:"
        },
        { label: "Show All", selector: "unhideAllApplications:" },
        { type: "separator" },
        { accelerator: "Command+Q", click: expect.any(Function), label: "Quit" }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { accelerator: "Command+Z", label: "Undo", selector: "undo:" },
        { accelerator: "Shift+Command+Z", label: "Redo", selector: "redo:" },
        { type: "separator" },
        { accelerator: "Command+X", label: "Cut", selector: "cut:" },
        { accelerator: "Command+C", label: "Copy", selector: "copy:" },
        { accelerator: "Command+V", label: "Paste", selector: "paste:" },
        {
          accelerator: "Command+A",
          label: "Select All",
          selector: "selectAll:"
        }
      ]
    },
    {
      label: "&View",
      submenu: [
        {
          accelerator: "Ctrl+Command+F",
          click: expect.any(Function),
          label: "Toggle Full Screen"
        }
      ]
    },
    {
      label: "Window",
      submenu: [
        {
          accelerator: "Command+M",
          label: "Minimize",
          selector: "performMiniaturize:"
        },
        {
          accelerator: "Command+W",
          label: "&Close",
          selector: "performClose:"
        },
        { type: "separator" },
        { label: "Bring All to Front", selector: "arrangeInFront:" }
      ]
    }
  ]);

  testClickOnMenu(
    res,
    "Decrediton",
    "About Decrediton",
    mockSend,
    "show-about-modal"
  );
  testClickOnMenu(res, "Decrediton", "Quit", mockSend, "check-can-close");
  testClickOnMenu(res, "&View", "Toggle Full Screen", mockFullScreen, true);
});

test("test getVersionWin", () => {
  expect(templates.getVersionWin()).toBeNull(); // ??
});

test("test getGrpcVersions", () => {
  const testGrpcVersions = "testGrpcVersions";
  expect(templates.getGrpcVersions()).toStrictEqual({
    requiredVersion: null,
    walletVersion: null
  });
  templates.setGrpcVersions(testGrpcVersions);
  expect(templates.getGrpcVersions()).toStrictEqual(testGrpcVersions);
});

test("test inputMenu", () => {
  const res = templates.inputMenu(false, testMainWindow, 3, 4, enLocale);
  expect(res).toStrictEqual([
    { label: "Cut", role: "cut" },
    { label: "Copy", role: "copy" },
    { label: "Paste", role: "paste" },
    { type: "separator" },
    { label: "Select All", role: "selectall" }
  ]);
});

test("test inputMenu - in dev mode", () => {
  const mockInspectElement = jest.fn(() => {});

  const testMainWindowCopy = {
    ...cloneDeep(testMainWindow),
    inspectElement: mockInspectElement
  };
  const res = templates.inputMenu(true, testMainWindowCopy, 3, 4, enLocale);
  expect(res).toStrictEqual([
    { label: "Cut", role: "cut" },
    { label: "Copy", role: "copy" },
    { label: "Paste", role: "paste" },
    { type: "separator" },
    { label: "Select All", role: "selectall" },
    { click: expect.any(Function), label: "Inspect element" }
  ]);
  mockInspectElement.mockClear();
  res.find((menu) => menu.label === "Inspect element").click();
  expect(mockInspectElement).toHaveBeenCalledWith(3, 4);
});

test("test selectionMenu", () => {
  const res = templates.selectionMenu(false, testMainWindow, 3, 4, enLocale);
  expect(res).toStrictEqual([
    { label: "Copy", role: "copy" },
    { type: "separator" },
    { label: "Select All", role: "selectall" }
  ]);
});

test("test selectionMenu - in dev mode", () => {
  const mockInspectElement = jest.fn(() => {});

  const testMainWindowCopy = {
    ...cloneDeep(testMainWindow),
    inspectElement: mockInspectElement
  };
  const res = templates.selectionMenu(true, testMainWindowCopy, 3, 4, enLocale);
  expect(res).toStrictEqual([
    { label: "Copy", role: "copy" },
    { type: "separator" },
    { label: "Select All", role: "selectall" },
    { click: expect.any(Function), label: "Inspect element" }
  ]);
  mockInspectElement.mockClear();
  res.find((menu) => menu.label === "Inspect element").click();
  expect(mockInspectElement).toHaveBeenCalledWith(3, 4);
});
