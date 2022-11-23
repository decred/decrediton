import * as cla from "actions/ClientActions";
import * as sa from "actions/SettingsActions";
import * as ga from "actions/GovernanceActions";
import * as wla from "actions/WalletLoaderActions";
import * as da from "actions/DaemonActions";
import {
  TESTNET,
  EXTERNALREQUEST_NETWORK_STATUS,
  EXTERNALREQUEST_STAKEPOOL_LISTING,
  EXTERNALREQUEST_UPDATE_CHECK,
  EXTERNALREQUEST_DCRDATA,
  EXTERNALREQUEST_DEX,
  EXTERNALREQUEST_POLITEIA,
  DCR,
  ALLOWED_EXTERNAL_REQUESTS,
  PROXY_TYPE,
  PROXY_LOCATION,
  LOCALE,
  DAEMON_ADVANCED,
  TIMEZONE,
  SPV_MODE,
  SPV_CONNECT,
  NETWORK,
  THEME,
  UI_ANIMATIONS,
  CURRENCY_DISPLAY,
  NEEDS_VSPD_PROCESS_TICKETS
} from "constants";
import { cloneDeep } from "fp";
import { createStore } from "test-utils.js";
import * as wal from "wallet";
import { isEqual } from "lodash";

const wallet = wal;
const clientActions = cla;
const settingsActions = sa;
const governanceActions = ga;
const walletLoadActions = wla;
const daemonActions = da;

const testWalletName = "test-wallet-name";
const testWalletService = "test-wallet-service";
const testLocalName = "test-localname";
const testValue = "test-boolean-value";

const testSettings = {
  locale: "en",
  daemonStartAdvanced: false,
  daemonStartAdvancedFromCli: false,
  allowedExternalRequests: [
    EXTERNALREQUEST_NETWORK_STATUS,
    EXTERNALREQUEST_STAKEPOOL_LISTING,
    EXTERNALREQUEST_UPDATE_CHECK,
    EXTERNALREQUEST_DEX
  ],
  spvMode: false,
  spvModeFromCli: false,
  spvConnect: [],
  spvConnectFromCli: false,
  timezone: "local",
  currencyDisplay: DCR,
  network: TESTNET,
  networkFromCli: false,
  theme: "light",
  uiAnimations: true,
  gapLimit: 30
};

const initialState = {
  grpc: {
    walletService: testWalletService
  },
  daemon: { walletName: testWalletName },
  settings: {
    currentSettings: { locale: testLocalName, allowedExternalRequests: [] },
    tempSettings: { locale: testLocalName, allowedExternalRequests: [] },
    needNetworkReset: true
  }
};

let mockGetWalletCfg;
let mockWalletCfgGet;
let mockWalletCfgSet;
let mockGlobalCfgGet;
let mockGlobalCfgSet;
let mockGetGlobalCfg;
let mockChangeMenuLocale;
let mockGetTokenAndInitialBatch;
let mockResetInventoryAndProposals;
let mockGetTreasuryBalance;
let mockResetTreasuryBalance;
let mockSetupProxy;
let mockCloseWalletRequest;
let mockCloseDaemonRequest;
let mockBackToCredentials;
let mockReloadAllowedExternalRequests;
let mockAllowExternalRequest;

beforeEach(() => {
  mockWalletCfgGet = jest.fn(() => {});
  mockWalletCfgSet = jest.fn(() => {});
  mockGetWalletCfg = wallet.getWalletCfg = jest.fn(() => ({
    get: mockWalletCfgGet,
    set: mockWalletCfgSet
  }));

  mockGlobalCfgGet = jest.fn((key) => {
    switch (key) {
      case ALLOWED_EXTERNAL_REQUESTS:
        return [EXTERNALREQUEST_POLITEIA];
      case PROXY_TYPE:
        return "old-proxy-type";
      case PROXY_LOCATION:
        return "old-proxy-location";
    }
  });
  mockGlobalCfgSet = jest.fn(() => {});
  mockGetGlobalCfg = wallet.getGlobalCfg = jest.fn(() => ({
    get: mockGlobalCfgGet,
    set: mockGlobalCfgSet
  }));
  mockChangeMenuLocale = wallet.changeMenuLocale = jest.fn(() => {});
  mockReloadAllowedExternalRequests = wallet.reloadAllowedExternalRequests =
    jest.fn(() => {});
  mockGetTokenAndInitialBatch = governanceActions.getTokenAndInitialBatch =
    jest.fn(() => () => {});
  mockResetInventoryAndProposals =
    governanceActions.resetInventoryAndProposals = jest.fn(() => () => {});

  mockGetTreasuryBalance = clientActions.getTreasuryBalance = jest.fn(
    () => () => {}
  );
  mockResetTreasuryBalance = clientActions.resetTreasuryBalance = jest.fn(
    () => () => {}
  );

  mockSetupProxy = wallet.setupProxy = jest.fn(() => {});

  mockCloseWalletRequest = walletLoadActions.closeWalletRequest = jest.fn(
    () => () => {}
  );
  mockCloseDaemonRequest = daemonActions.closeDaemonRequest = jest.fn(
    () => () => {}
  );
  mockBackToCredentials = daemonActions.backToCredentials = jest.fn(
    () => () => {}
  );

  mockAllowExternalRequest = wallet.allowExternalRequest = jest.fn(() => {});
});

test("test saveSettings", async () => {
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(settingsActions.saveSettings(testSettings));

  expect(mockGetGlobalCfg).toHaveBeenCalled();
  // locale has been changed
  expect(mockChangeMenuLocale).toHaveBeenCalledWith(testSettings.locale);

  // politeia is not enabled now
  expect(mockGetTokenAndInitialBatch).not.toHaveBeenCalled();
  expect(mockResetInventoryAndProposals).toHaveBeenCalled();

  // dcrdata is not enabled now
  expect(mockGetTreasuryBalance).not.toHaveBeenCalled();
  expect(mockResetTreasuryBalance).toHaveBeenCalled();

  // proxy has been changed
  expect(mockSetupProxy).toHaveBeenCalled();

  // need network reset
  expect(mockCloseWalletRequest).toHaveBeenCalled();
  expect(mockCloseDaemonRequest).toHaveBeenCalled();
  expect(mockBackToCredentials).toHaveBeenCalled();

  // allowed external requests has been changed
  expect(mockReloadAllowedExternalRequests).toHaveBeenCalled();

  expect(mockGlobalCfgSet).toHaveBeenCalledWith(LOCALE, testSettings.locale);
  expect(mockGlobalCfgSet).toHaveBeenCalledWith(
    DAEMON_ADVANCED,
    testSettings.daemonStartAdvanced
  );
  expect(mockGlobalCfgSet).toHaveBeenCalledWith(
    PROXY_TYPE,
    testSettings.proxyType
  );
  expect(mockGlobalCfgSet).toHaveBeenCalledWith(
    ALLOWED_EXTERNAL_REQUESTS,
    testSettings.allowedExternalRequests
  );
  expect(mockGlobalCfgSet).toHaveBeenCalledWith(
    PROXY_LOCATION,
    testSettings.proxyLocation
  );
  expect(mockGlobalCfgSet).toHaveBeenCalledWith(
    TIMEZONE,
    testSettings.timezone
  );
  expect(mockGlobalCfgSet).toHaveBeenCalledWith(SPV_MODE, testSettings.spvMode);
  expect(mockGlobalCfgSet).toHaveBeenCalledWith(
    SPV_CONNECT,
    testSettings.spvConnect
  );
  expect(mockGlobalCfgSet).toHaveBeenCalledWith(NETWORK, testSettings.network);
  expect(mockGlobalCfgSet).toHaveBeenCalledWith(THEME, testSettings.theme);
  expect(mockGlobalCfgSet).toHaveBeenCalledWith(
    UI_ANIMATIONS,
    testSettings.uiAnimations
  );

  // wallet is openned
  expect(mockGetWalletCfg).toHaveBeenCalledWith(
    false /*mainnet*/,
    testWalletName
  );
  expect(mockWalletCfgSet).toHaveBeenCalledWith(
    CURRENCY_DISPLAY,
    testSettings.currencyDisplay
  );

  expect(
    isEqual(store.getState().settings.currentSettings, testSettings)
  ).toBeTruthy();
  expect(
    isEqual(store.getState().settings.tempSettings, testSettings)
  ).toBeTruthy();
  expect(store.getState().settings.settingsChanged).toBeFalsy();
});

// proxy location changed but proxy type doesn't
// allowed external requests are not changed
// don't a need network reset
// wallet is not opened
// politeia has not been updated
// don't need network reset
// locale has not been changed
// dcrdata is enabled now
test("test saveSettings - save alternative data", async () => {
  const testSettingsCopy = {
    ...testSettings,
    allowedExternalRequests: [
      ...testSettings.allowedExternalRequests,
      EXTERNALREQUEST_POLITEIA,
      EXTERNALREQUEST_DCRDATA
    ]
  };
  mockGlobalCfgGet = jest.fn((key) => {
    switch (key) {
      case ALLOWED_EXTERNAL_REQUESTS:
        return testSettingsCopy.allowedExternalRequests;
    }
  });
  const store = createStore(
    cloneDeep({
      ...initialState,
      daemon: {},
      settings: {
        ...initialState.settings,
        needNetworkReset: false,
        currentSettings: {
          ...initialState.settings.currentSettings,
          network: TESTNET,
          locale: testSettingsCopy.locale
        }
      }
    })
  );
  await store.dispatch(settingsActions.saveSettings(testSettingsCopy));

  expect(mockGetGlobalCfg).toHaveBeenCalled();
  // locale has not been changed
  expect(mockChangeMenuLocale).not.toHaveBeenCalled();

  // politeia is enabled now
  expect(mockGetTokenAndInitialBatch).toHaveBeenCalled();
  expect(mockResetInventoryAndProposals).not.toHaveBeenCalled();

  // dcrdata is enabled now
  expect(mockGetTreasuryBalance).toHaveBeenCalled();
  expect(mockResetTreasuryBalance).not.toHaveBeenCalled();

  // proxy has been changed, even though just the proxy location has been changed
  expect(mockSetupProxy).not.toHaveBeenCalled();

  // don't a need network reset
  expect(mockCloseWalletRequest).not.toHaveBeenCalled();
  expect(mockCloseDaemonRequest).not.toHaveBeenCalled();
  expect(mockBackToCredentials).not.toHaveBeenCalled();

  // allowed external requests has not been changed
  expect(mockReloadAllowedExternalRequests).not.toHaveBeenCalled();

  // wallet is not openned
  expect(mockGetWalletCfg).not.toHaveBeenCalled();
  expect(mockWalletCfgSet).not.toHaveBeenCalled();

  expect(
    isEqual(store.getState().settings.currentSettings, testSettingsCopy)
  ).toBeTruthy();
  expect(
    isEqual(store.getState().settings.tempSettings, testSettingsCopy)
  ).toBeTruthy();
  expect(store.getState().settings.settingsChanged).toBeFalsy();
});

test("test saveSettings - proxy change needs wallet restart", async () => {
  const testSettingsCopy = {
    ...testSettings,
    allowedExternalRequests: [
      ...testSettings.allowedExternalRequests,
      EXTERNALREQUEST_POLITEIA,
      EXTERNALREQUEST_DCRDATA
    ]
  };
  mockGlobalCfgGet = jest.fn((key) => {
    switch (key) {
      case ALLOWED_EXTERNAL_REQUESTS:
        return testSettingsCopy.allowedExternalRequests;
      case PROXY_TYPE:
        return testSettingsCopy.proxyType;
      case PROXY_LOCATION:
        return "old-proxy-location";
    }
  });
  const store = createStore(
    cloneDeep({
      ...initialState,
      daemon: {},
      settings: {
        ...initialState.settings,
        needNetworkReset: false,
        currentSettings: {
          ...initialState.settings.currentSettings,
          network: TESTNET,
          locale: testSettingsCopy.locale,
          proxyType: "new-proxy-type",
          proxyLocation: "new-proxy-location"
        }
      }
    })
  );
  await store.dispatch(settingsActions.saveSettings(testSettingsCopy));

  expect(mockGetGlobalCfg).toHaveBeenCalled();
  // locale has not been changed
  expect(mockChangeMenuLocale).not.toHaveBeenCalled();

  // politeia is enabled now
  expect(mockGetTokenAndInitialBatch).toHaveBeenCalled();
  expect(mockResetInventoryAndProposals).not.toHaveBeenCalled();

  // dcrdata is enabled now
  expect(mockGetTreasuryBalance).toHaveBeenCalled();
  expect(mockResetTreasuryBalance).not.toHaveBeenCalled();

  // proxy has been changed, even though just the proxy location has been changed
  expect(mockSetupProxy).toHaveBeenCalled();

  // don't a need network reset
  expect(mockCloseWalletRequest).toHaveBeenCalled();
  expect(mockCloseDaemonRequest).toHaveBeenCalled();
  expect(mockBackToCredentials).toHaveBeenCalled();

  // allowed external requests has not been changed
  expect(mockReloadAllowedExternalRequests).not.toHaveBeenCalled();

  // wallet is not openned
  expect(mockGetWalletCfg).not.toHaveBeenCalled();
  expect(mockWalletCfgSet).not.toHaveBeenCalled();

  expect(
    isEqual(store.getState().settings.currentSettings, testSettingsCopy)
  ).toBeTruthy();
  expect(
    isEqual(store.getState().settings.tempSettings, testSettingsCopy)
  ).toBeTruthy();
  expect(store.getState().settings.settingsChanged).toBeFalsy();
});

test("test saveSettings on testnet, ", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      settings: {
        ...initialState.settings,
        currentSettings: {
          ...initialState.settings.currentSettings,
          network: TESTNET
        }
      }
    })
  );
  await store.dispatch(settingsActions.saveSettings(testSettings));

  // wallet is openned
  expect(mockGetWalletCfg).toHaveBeenCalledWith(
    true /*testnet*/,
    testWalletName
  );
});

test("test saveSettings - proxy doesn't change'", async () => {
  mockGlobalCfgGet = jest.fn((key) => {
    switch (key) {
      case ALLOWED_EXTERNAL_REQUESTS:
        return testSettings.allowedExternalRequests;
      case PROXY_TYPE:
        return testSettings.proxyType;
      case PROXY_LOCATION:
        return testSettings.proxyLocation;
    }
  });
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(settingsActions.saveSettings(testSettings));

  // proxy has not been changed
  expect(mockSetupProxy).not.toHaveBeenCalled();
});

test("test addAllowedExternalRequest", async () => {
  const testRequestType = EXTERNALREQUEST_DEX;
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(
    settingsActions.addAllowedExternalRequest(testRequestType)
  );

  expect(mockGetGlobalCfg).toHaveBeenCalled();
  const expectedNewAllowedExternalRequest = [
    EXTERNALREQUEST_POLITEIA,
    testRequestType
  ];
  expect(mockGlobalCfgSet).toHaveBeenCalledWith(
    ALLOWED_EXTERNAL_REQUESTS,
    expectedNewAllowedExternalRequest
  );
  expect(mockAllowExternalRequest).toHaveBeenCalledWith(testRequestType);

  expect(
    isEqual(store.getState().settings.currentSettings, {
      ...initialState.settings.currentSettings,
      allowedExternalRequests: expectedNewAllowedExternalRequest
    })
  ).toBeTruthy();
  expect(
    isEqual(store.getState().settings.tempSettings, {
      ...initialState.settings.tempSettings,
      allowedExternalRequests: [testRequestType]
    })
  ).toBeTruthy();
});

test("test addAllowedExternalRequest - try to add an already allowed external request", async () => {
  const testRequestType = EXTERNALREQUEST_POLITEIA;
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(
    settingsActions.addAllowedExternalRequest(testRequestType)
  );

  expect(mockGetGlobalCfg).toHaveBeenCalled();
  expect(mockGlobalCfgSet).not.toHaveBeenCalled();
  expect(mockAllowExternalRequest).not.toHaveBeenCalled();

  // state has not been changed
  expect(
    isEqual(
      store.getState().settings.currentSettings,
      initialState.settings.currentSettings
    )
  ).toBeTruthy();
  expect(
    isEqual(
      store.getState().settings.tempSettings,
      initialState.settings.tempSettings
    )
  ).toBeTruthy();
});

test("test setNeedsVSPdProcessTickets", async () => {
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(settingsActions.setNeedsVSPdProcessTickets(testValue));

  expect(mockGetWalletCfg).toHaveBeenCalledWith(
    false /*mainnet*/,
    testWalletName
  );
  expect(mockWalletCfgSet).toHaveBeenCalledWith(
    NEEDS_VSPD_PROCESS_TICKETS,
    testValue
  );
});

test("test setNeedsVSPdProcessTickets - on testnet", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      settings: {
        ...initialState.settings,
        currentSettings: {
          ...initialState.settings.currentSettings,
          network: TESTNET
        }
      }
    })
  );
  await store.dispatch(settingsActions.setNeedsVSPdProcessTickets(testValue));

  expect(mockGetWalletCfg).toHaveBeenCalledWith(
    true /*testnet*/,
    testWalletName
  );
  expect(mockWalletCfgSet).toHaveBeenCalledWith(
    NEEDS_VSPD_PROCESS_TICKETS,
    testValue
  );
});
