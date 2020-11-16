import SettingsPage from "components/views/SettingsPage/SettingsPage";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";

import { screen, wait } from "@testing-library/react";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as sa from "actions/SettingsActions";
import * as wla from "actions/WalletLoaderActions";
// import * as da from "actions/DaemonActions";
import { PROXYTYPE_HTTP, PROXYTYPE_PAC } from "main_dev/proxy";
import * as conf from "config";
import {
  defaultLightTheme,
  ThemeProvider,
  defaultDarkTheme,
  DEFAULT_DARK_THEME_NAME,
  DEFAULT_LIGHT_THEME_NAME
} from "pi-ui";

// import * as wa from "wallet/daemon";

// let mockGetDaemonSynced;
// let mockMaxWalletCount;
// let mockIsSPV;
// let mockAppVersion;
// let mockGetSelectedWallet;
// let mockGetAvailableWallets;
// let mockGetGlobalCfg;
// let mockConnectDaemon;
// let mockStartDaemon;
// let mockSyncDaemon;
// let mockCheckNetworkMatch;
// let mockUpdateAvailable;
const ENABLED = "Enabled";
const DISABLED = "Disabled";

const testWalletName = "test-wallet-name";
const testDefaultNetwork = "Mainnet";
const testDefaultLocale = "en";
const testLocale = "de";
const testDefaultLocaleLabel = "English (US)";
const testLocaleLabel = "Deutsch";
const testDefaultSpvMode = DISABLED;
const testDefaultDaemonStartAdvanced = DISABLED;
const testDefaultProxyType = PROXYTYPE_HTTP;
const testDefaultProxyLocation = "test-default-proxy-location";
const testProxyLocation = "test-proxy-location";
const testDefaultSpvConnectValue = [
  "test-default-spv-connect-value-1",
  "test-default-spv-connect-value-2"
];
const testSpvConnectValue = [
  "test-spv-connect-value-1",
  "test-spv-connect-value-2"
];
const testDefaultTheme = DEFAULT_LIGHT_THEME_NAME;
const testTheme = DEFAULT_DARK_THEME_NAME;
const testDefaultThemeLabel = "Light";
const testThemeLabel = "Dark";
const testDefaultCurrencyDisplay = "DCR";
const testCurrencyDisplay = "atoms";
const testDefaultGapLimit = "20";
const testGapLimit = "30";
const testCurrentSettings = {
  locale: testDefaultLocale,
  theme: testDefaultTheme,
  allowedExternalRequests: [],
  network: testDefaultNetwork.toLowerCase(),
  needNetworkReset: false,
  spvMode: testDefaultSpvMode == ENABLED,
  daemonStartAdvanced: testDefaultDaemonStartAdvanced == ENABLED,
  proxyType: testDefaultProxyType,
  proxyLocation: testDefaultProxyLocation,
  spvConnect: testDefaultSpvConnectValue,
  currencyDisplay: testDefaultCurrencyDisplay,
  gapLimit: testDefaultGapLimit
};
const testSettings = {
  currentSettings: testCurrentSettings,
  tempSettings: testCurrentSettings,
  settingsChanged: false
};

let mockIsTestNet;
let mockIsMainNet;
let mockWalletService;
let mockTicketBuyerService;
let mockSettingsChanged;
let mockChangePassphraseRequestAttempt;
let mockNeedNetworkReset;
let mockGetWalletName;
let mockGetWalletReady;
let mockChangePassphraseAttempt;
let mockUpdateStateSettingsChanged;
let mockSaveSettings;
let mockCloseWalletRequest;
let mockAddAllowedExternalRequest;
let mockToggleTheme;
let mockGetGlobalCfg;

beforeEach(() => {
  //   mockGetDaemonSynced = sel.getDaemonSynced = jest.fn(() => true);
  //   mockUpdateAvailable = sel.updateAvailable = jest.fn(() => true);
  //   mockMaxWalletCount = sel.maxWalletCount = jest.fn(() => 3);
  //   mockIsSPV = sel.isSPV = jest.fn(() => false);
  //   mockGetSelectedWallet = wla.getSelectedWallet = jest.fn(() => () => null);
  //   mockGetAvailableWallets = da.getAvailableWallets = jest.fn(() => () =>
  //     Promise.resolve({ availableWallets: [], previousWallet: null })
  //   );
  mockGetGlobalCfg = conf.getGlobalCfg = jest.fn(() => {
    return {
      get: () => DEFAULT_LIGHT_THEME_NAME,
      set: () => {}
    };
  });
  //   wa.getDcrdLogs = jest.fn(() => Promise.resolve(Buffer.from("", "utf-8")));
  //   wa.getDcrwalletLogs = jest.fn(() =>
  //     Promise.resolve(Buffer.from("", "utf-8"))
  //   );
  //   wa.getDecreditonLogs = jest.fn(() =>
  //     Promise.resolve(Buffer.from("", "utf-8"))
  //   );
  //   wa.getDcrlndLogs = jest.fn(() => Promise.resolve(Buffer.from("", "utf-8")));
  //   mockConnectDaemon = da.connectDaemon = jest.fn(() => () =>
  //     Promise.resolve(true)
  //   );
  //   mockStartDaemon = da.startDaemon = jest.fn(() => () => Promise.resolve(true));
  //   mockSyncDaemon = da.syncDaemon = jest.fn(() => () => Promise.resolve());
  //   mockCheckNetworkMatch = da.checkNetworkMatch = jest.fn(() => () =>
  //     Promise.resolve()
  //   );
  mockIsTestNet = sel.isTestNet = jest.fn(() => true);
  mockIsMainNet = sel.isMainNet = jest.fn(() => false);
  mockWalletService = sel.walletService = jest.fn(() => {
    return {};
  });
  mockTicketBuyerService = sel.ticketBuyerService = jest.fn(() => {
    return {};
  });
  // mockSettingsChanged = sel.settingsChanged = jest.fn(() => false);
  mockChangePassphraseRequestAttempt = sel.changePassphraseRequestAttempt = jest.fn(
    () => false
  );
  mockChangePassphraseRequestAttempt = sel.changePassphraseRequestAttempt = jest.fn(
    () => false
  );
  // mockNeedNetworkReset = sel.needNetworkReset = jest.fn(() => false);
  mockGetWalletName = sel.getWalletName = jest.fn(() => testWalletName);
  mockGetWalletReady = sel.getWalletReady = jest.fn(() => true);
  mockChangePassphraseAttempt = ca.changePassphraseAttempt = jest.fn(
    () => true
  );
  // mockUpdateStateSettingsChanged = sa.updateStateSettingsChanged = jest.fn(
  //   () => () => {}
  // );
  mockSaveSettings = sa.saveSettings = jest.fn(() => () => {});
  mockCloseWalletRequest = wla.closeWalletRequest = jest.fn(() => () => {});
  mockAddAllowedExternalRequest = sa.addAllowedExternalRequest = jest.fn(
    () => true
  );
  mockToggleTheme = sa.toggleTheme = jest.fn(() => true);
});

test("show error when there is no walletService", () => {
  mockWalletService = sel.walletService = jest.fn(() => {});
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  expect(
    screen.getByText("Something went wrong, please go back")
  ).toBeInTheDocument();
  expect(screen.getByText(/back to home/i)).toBeInTheDocument();

  expect(mockIsTestNet).toHaveBeenCalled();
  expect(mockIsMainNet).toHaveBeenCalled();
  expect(mockWalletService).toHaveBeenCalled();
  expect(mockTicketBuyerService).toHaveBeenCalled();
});

test("render SettingsPage and test close wallet button", async () => {
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });

  expect(screen.getByText("Settings")).toBeInTheDocument();
  expect(
    screen.getByText(/changing network settings requires a restart/i)
  ).toBeInTheDocument();

  testConfirmModal("Close Wallet", "Confirmation Required");
});

const getOptionByNameAndType = (name, type) => {
  const regex = new RegExp(type, "g");
  const options = screen
    .getAllByRole("option", { name: name })
    .filter((option) => option.className.match(regex));
  return options[0];
};

const testConfirmModal = (submitButtonText, confirmHeaderText) => {
  // submit and cancel
  user.click(screen.getByText(submitButtonText));
  expect(screen.getByText(confirmHeaderText)).toBeInTheDocument();
  user.click(screen.getByText("Cancel"));
  expect(screen.queryByText(confirmHeaderText)).not.toBeInTheDocument();
  // submit and confirm
  user.click(screen.getByText(submitButtonText));
  expect(screen.getByText(confirmHeaderText)).toBeInTheDocument();
  user.click(screen.getByText("Confirm"));
};

const testCheckBoxInput = (
  labelName,
  oldValue,
  option,
  expectedChange,
  needsConfirm
) => {
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  expect(screen.getByText("Save").className).toMatch("disabled");
  const inputControl = screen.getByLabelText(labelName);
  const inputValueSpan = getOptionByNameAndType(oldValue, "value");
  expect(inputValueSpan.textContent).toMatch(oldValue);
  user.click(inputControl.parentNode);
  user.click(getOptionByNameAndType(option, "option"));

  expect(screen.getByText("Save").className).not.toMatch("disabled");

  if (needsConfirm) {
    testConfirmModal("Save", "Reset required");
  } else {
    user.click(screen.getByText("Save"));
  }

  expect(mockSaveSettings).toHaveBeenCalledWith({
    ...testCurrentSettings,
    ...expectedChange
  });
  expect(mockGetGlobalCfg).toHaveBeenCalled();
};

test.each([
  ["Network", testDefaultNetwork, "Testnet", { network: "testnet" }, true],
  ["SPV", testDefaultSpvMode, ENABLED, { spvMode: true }, true],
  [
    "Adv. Daemon Startup",
    testDefaultDaemonStartAdvanced,
    ENABLED,
    { daemonStartAdvanced: true },
    true
  ],
  ["Proxy Type", "HTTP", "PAC", { proxyType: PROXYTYPE_PAC }, false],
  [
    "Locale",
    testDefaultLocaleLabel,
    testLocaleLabel,
    { locale: testLocale },
    false
  ],
  [
    "Displayed Units",
    testDefaultCurrencyDisplay,
    testCurrencyDisplay,
    { currencyDisplay: testCurrencyDisplay },
    false
  ],
  [
    "Tonality",
    testDefaultThemeLabel,
    testThemeLabel,
    { theme: testTheme },
    false
  ]
])(`change '%s' ComboBox from '%s' to '%s' expeced %s`, testCheckBoxInput);

const testTextFieldInput = (
  labelName,
  oldValue,
  newValue,
  expectedChange,
  needsConfirm
) => {
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  expect(screen.getByText("Save").className).toMatch("disabled");

  const inputControl = screen.getByLabelText(labelName);
  expect(inputControl.value).toMatch(oldValue);
  user.clear(inputControl);
  user.type(inputControl, newValue);

  expect(screen.getByText("Save").className).not.toMatch("disabled");
  if (needsConfirm) {
    testConfirmModal("Save", "Reset required");
  } else {
    user.click(screen.getByText("Save"));
  }
  expect(mockSaveSettings).toHaveBeenCalledWith({
    ...testCurrentSettings,
    ...expectedChange
  });
};

test.each([
  [
    "SPV Connect",
    testDefaultSpvConnectValue.join(","),
    testSpvConnectValue.join(","),
    { spvConnect: testSpvConnectValue },
    false
  ],
  [
    "Proxy Location",
    testDefaultProxyLocation,
    testProxyLocation,
    { proxyLocation: testProxyLocation },
    false
  ],
  [
    "Gap Limit",
    testDefaultGapLimit,
    testGapLimit,
    { gapLimit: testGapLimit },
    false
  ]
])(`change '%s' TextInput from '%s' to '%s' expeced %s`, testTextFieldInput);
