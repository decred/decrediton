import * as cta from "actions/ControlActions";
import * as da from "actions/DaemonActions";
import * as sa from "actions/SettingsActions";
import * as wla from "actions/WalletLoaderActions";
import * as na from "actions/NotificationActions";
import * as dexa from "actions/DexActions";
import * as va from "actions/VersionActions";
import * as tra from "actions/TrezorActions";
import {
  TESTNET,
  SHOW_SPV_CHOICE,
  STANDARD_EXTERNAL_REQUESTS,
  SHOW_PRIVACY,
  LOCALE,
  SET_LANGUAGE,
  VISITED_TUTORIAL_TABS,
  SHOW_TUTORIAL,
  WALLET_CREATED_AS_NEW,
  GAP_LIMIT,
  ENABLE_DEX,
  DEX_READY,
  ALLOWED_EXTERNAL_REQUESTS,
  PROXY_TYPE,
  PROXY_LOCATION,
  EXTERNALREQUEST_POLITEIA,
  DEX_ACCOUNT,
  CONFIRM_DEX_SEED,
  DEXWALLET_RPCUSERNAME,
  DEXWALLET_RPCPASSWORD,
  DEXWALLET_HOSTPORT,
  HIDDEN_ACCOUNTS,
  CURRENCY_DISPLAY,
  DISCOVER_ACCOUNTS,
  POLITEIA_LAST_ACCESS_TIME,
  POLITEIA_LAST_ACCESS_BLOCK,
  ENABLE_PRIVACY,
  SEND_FROM_UNMIXED,
  MIXED_ACCOUNT_CFG,
  CHANGE_ACCOUNT_CFG,
  CSPP_SERVER,
  CSPP_PORT,
  MIXED_ACC_BRANCH,
  REMEMBERED_VSP_HOST,
  NEEDS_VSPD_PROCESS_TICKETS,
  SHOW_STAKING_WARNING,
  AUTOBUYER_SETTINGS,
  LAST_ACCESS,
  CSPP_URL_LEGACY,
  CSPP_URL,
  DIFF_CONNECTION_ERROR
} from "constants";
import { cloneDeep } from "fp";
import * as he from "helpers/fetch";
import { isEqual } from "lodash";
import { createStore } from "test-utils.js";
import * as wal from "wallet";
import { act } from "react-dom/test-utils";
import { advanceBy, clear } from "jest-date-mock";
import { waitFor } from "@testing-library/react";
import { preDefinedGradients } from "helpers";

const wallet = wal;
const walletLoaderActions = wla;
const daemonActions = da;
const helpers = he;
const notificationActions = na;
const controlActions = cta;
const dexActions = dexa;
const versionActions = va;
const trezorActions = tra;
const settingsActions = sa;

const testWalletName = "test-wallet-name";
const testWalletService = "test-wallet-service";
const testNewAppVersion = "release-v1.7.3";
const testOldAppVersion = "1.7.2";
const testError = "test-error";
const testReleaseFetchReponse = {
  data: [{ tag_name: testNewAppVersion }, { tag_name: testOldAppVersion }]
};
const testDaemonStartResponse = {
  rpc_user: "test-rpc-user",
  rpc_pass: "test-rpc-pass",
  rpc_cert: "/test-path/rpc.cert",
  rpc_host: "127.0.0.1",
  rpc_port: "19109",
  dcrdAppdata: "/test-path/.dcrd"
};
const testParams = "test-params";

const testCurrentSettings = {
  testSettingKey: "test-testing-key"
};
const testOnErrorReceivedError = "test-onErrorReceivedError";
const testOnErrorReceivedDaemon = "test-onErrorReceivedDaemon";

const testOnWarningReceivedDaemon = "test-onWarningReceivedDaemon";
const testOnWarningReceivedWarning = "test-onWarningReceivedWarning";

const testStartWalletResponse = { port: "test-port" };

const selectedWallet = {
  value: {
    wallet: "test-wallet",
    isWatchingOnly: "testIsWatchingOnly",
    istrezor: "testIsTrezor",
    isNew: "testIsNew"
  },
  network: TESTNET
};

const testWalletPath = "test-wallet-path";
const testGapLimit = 100;
const testDisableCoinTypeUpgrades = "testdisableCoinTypeUpgrades";
let testDateNow = 1663235900;

const testRpcCreds = "testrpcCreds";
const testDaemonRemote = "testdaemonRemote";
const testCredentials = "testCredentials";

const testDaemonWarning = "test-daemonWarning";
const testDaemonInfo = { isTestnet: true };
const testDcrdLastLogLine = "test-dcrd-last-log-line";
const testDcrdwalletLastLogLine = "testDcrdwalletLastLogLine";
const testPrivacyLogs = "testPrivacyLogs";
const testDexLogs = "testDexLogs";

const initialState = {
  grpc: { walletService: testWalletService },
  daemon: {
    walletName: testWalletName,
    appVersion: testOldAppVersion,
    currentBlockCount: null,
    timeLeftEstimate: null,
    timeStart: 0,
    blockStart: 0
  },
  settings: {
    currentSettings: testCurrentSettings,
    tempSettings: testCurrentSettings
  }
};

let mockAvailableWallets = [
  {
    wallet: "wallet1",
    displayWalletGradient: preDefinedGradients[0],
    lastAccess: 10
  },
  {
    wallet: "wallet2",
    displayWalletGradient: preDefinedGradients[1],
    lastAccess: 9
  },
  {
    wallet: "missing-gradient-wallet",
    lastAccess: 8
  },
  {
    wallet: "wallet4",
    displayWalletGradient: preDefinedGradients[3],
    lastAccess: 11
  },
  {
    wallet: "missing-gradient-wallet222222222222",
    lastAccess: 12
  },
  {
    wallet: "wallet5",
    displayWalletGradient: preDefinedGradients[5]
  },
  {
    wallet: "wallet6",
    displayWalletGradient: preDefinedGradients[6]
  },
  {
    wallet: "wallet7",
    displayWalletGradient: preDefinedGradients[7]
  },
  {
    wallet: "wallet8",
    displayWalletGradient: preDefinedGradients[8]
  },
  {
    wallet: "wallet9",
    displayWalletGradient: preDefinedGradients[9]
  },
  {
    wallet: "wallet10",
    displayWalletGradient: preDefinedGradients[10]
  },
  {
    wallet: "needto-generate-random-gradient-wallet"
  }
];

let mockGetWalletCfg;
let mockWalletCfgGet;
let mockWalletCfgSet;
let mockGlobalCfgGet;
let mockGlobalCfgSet;
let mockGetGlobalCfg;
let mockGetJSON;
let mockWalletLog;
let mockUpdateStateSettingsChanged;
let mockSaveSettings;
let mockStartDaemon;
let mockOnErrorReceived;
let mockOnWarningReceived;
let mockDeleteDaemonData;
let mockOnDaemonStopped;
let mockStopNotifcations;
let mockRescanCancel;
let mockSyncCancel;
let mockSetLastHeight;
let mockLogoutDex;
let mockCleaShutdown;
let mockRemoveWallet;
let mockGetAvailableWallets;
let mockCreateNewWallet;
let mockStartWallet;
let mockSetPreviousWallet;
let mockGetVersionServiceAttempt;
let mockOpenWalletAttempt;
let mockSetSelectedWallet;
let mockGetWalletPath;
let mockEnableTrezor;
let mockGetSelectedWallet;
let mockStopDaemon;
let mockConnectDaemon;
let mockGetDaemonInfo;
let mockDropDcrd;
let mockGetDcrdLastLogLine;
let mockGetDcrwalletLastLogLine;
let mockGetPrivacyLogs;
let mockGetDexLogs;
let mockGetBlockCount;
let mockSetHeightSynced;

afterEach(() => {
  clear();
  jest.useRealTimers();
});

beforeEach(() => {
  mockGetAvailableWallets = wallet.getAvailableWallets = jest.fn(() => ({
    availableWallets: mockAvailableWallets
  }));
  Date.now = jest.fn(() => testDateNow);
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

  mockGetJSON = helpers.getJSON = jest.fn(() =>
    Promise.resolve(testReleaseFetchReponse)
  );
  mockWalletLog = wallet.log = jest.fn(() => {});
  mockUpdateStateSettingsChanged = settingsActions.updateStateSettingsChanged =
    jest.fn(() => () => {});
  mockSaveSettings = settingsActions.saveSettings = jest.fn(() => () => {});
  mockStartDaemon = wallet.startDaemon = jest.fn(() =>
    Promise.resolve(testDaemonStartResponse)
  );

  mockOnErrorReceived = wallet.onErrorReceived = jest.fn((cb) => {
    cb("event", testOnErrorReceivedDaemon, testOnErrorReceivedError);
  });

  mockOnWarningReceived = wallet.onWarningReceived = jest.fn((cb) => {
    cb("event", testOnWarningReceivedDaemon, testOnWarningReceivedWarning);
  });

  mockDeleteDaemonData = wallet.deleteDaemonData = jest.fn(() =>
    Promise.resolve()
  );
  mockOnDaemonStopped = wallet.onDaemonStopped = jest.fn((cb) => {
    cb();
  });
  mockStopNotifcations = notificationActions.stopNotifcations = jest.fn(
    () => () => {}
  );
  mockRescanCancel = controlActions.rescanCancel = jest.fn(() => () => {});
  mockSyncCancel = walletLoaderActions.syncCancel = jest.fn(() => () => {});
  mockSetLastHeight = wallet.setLastHeight = jest.fn(() => () => {});
  mockLogoutDex = dexActions.logoutDex = jest.fn(() => () => {});
  mockCleaShutdown = wallet.cleanShutdown = jest.fn(() => () => {});
  mockRemoveWallet = wallet.removeWallet = jest.fn(() => Promise.resolve());
  mockCreateNewWallet = wallet.createNewWallet = jest.fn(() => {});
  mockStartWallet = wallet.startWallet = jest.fn(() =>
    Promise.resolve(testStartWalletResponse)
  );
  mockSetPreviousWallet = wallet.setPreviousWallet = jest.fn(() => {});
  mockGetVersionServiceAttempt = versionActions.getVersionServiceAttempt =
    jest.fn(() => () => {});
  mockOpenWalletAttempt = walletLoaderActions.openWalletAttempt = jest.fn(
    () => () => {}
  );
  mockSetSelectedWallet = walletLoaderActions.setSelectedWallet = jest.fn(
    () => () => {}
  );
  mockGetWalletPath = wallet.getWalletPath = jest.fn(() => testWalletPath);
  mockGetSelectedWallet = wallet.getSelectedWallet = jest.fn(
    () => selectedWallet
  );
  mockEnableTrezor = trezorActions.enableTrezor = jest.fn(() => () => {});
  mockStopDaemon = wallet.stopDaemon = jest.fn(() => {});
  mockConnectDaemon = wallet.connectDaemon = jest.fn(() => {});
  mockGetDaemonInfo = wallet.getDaemonInfo = jest.fn(() =>
    Promise.resolve(testDaemonInfo)
  );
  mockDropDcrd = wallet.dropDcrd = jest.fn(() => {});

  mockGetDcrdLastLogLine = wallet.getDcrdLastLogLine = jest.fn(() =>
    Promise.resolve(testDcrdLastLogLine)
  );
  mockGetDcrwalletLastLogLine = wallet.getDcrwalletLastLogLine = jest.fn(() =>
    Promise.resolve(testDcrdwalletLastLogLine)
  );
  mockGetPrivacyLogs = wallet.getPrivacyLogs = jest.fn(() =>
    Promise.resolve(testPrivacyLogs)
  );
  mockGetDexLogs = wallet.getDexLogs = jest.fn(() =>
    Promise.resolve(testDexLogs)
  );
  mockGetBlockCount = wallet.getBlockCount = jest.fn(() => {});
  mockSetHeightSynced = wallet.setHeightSynced = jest.fn(() => {});
});

test("test checkDisplayWalletGradients", () => {
  const store = createStore({
    settings: { currentSettings: { network: "testnet" } }
  });

  store.dispatch(
    daemonActions.checkDisplayWalletGradients(mockAvailableWallets)
  );

  expect(mockWalletCfgSet).toHaveBeenNthCalledWith(
    1,
    "display_wallet_gradient",
    preDefinedGradients[2]
  );
  expect(mockWalletCfgSet).toHaveBeenNthCalledWith(
    2,
    "display_wallet_gradient",
    preDefinedGradients[4]
  );
  expect(mockWalletCfgSet).toHaveBeenCalledTimes(3);

  expect(mockGetAvailableWallets).toHaveBeenCalledTimes(1);
});

test("checkDisplayWalletGradients (no missing gradient)", () => {
  mockAvailableWallets = [
    {
      wallet: "wallet1",
      displayWalletGradient: preDefinedGradients[0],
      lastAccess: 10
    },
    {
      wallet: "wallet2",
      displayWalletGradient: preDefinedGradients[1],
      lastAccess: 9
    },
    {
      wallet: "wallet4",
      displayWalletGradient: preDefinedGradients[3],
      lastAccess: 11
    }
  ];
  mockGetAvailableWallets = wallet.getAvailableWallets = jest.fn(() => ({
    availableWallets: mockAvailableWallets
  }));

  const store = createStore({
    settings: { currentSettings: { network: "testnet" } }
  });

  store.dispatch(
    daemonActions.checkDisplayWalletGradients(mockAvailableWallets)
  );

  expect(mockWalletCfgSet).not.toHaveBeenCalled();
  expect(mockGetAvailableWallets).not.toHaveBeenCalled();
});

test("test checkDecreditonVersion - update available", async () => {
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(daemonActions.checkDecreditonVersion());

  expect(mockGetJSON).toHaveBeenCalled();
  expect(store.getState().daemon.updateAvailable).toBe(testNewAppVersion);
});

test("test checkDecreditonVersion - update not available", async () => {
  const testCurrentVersion = `release-v${testOldAppVersion}`;
  mockGetJSON = helpers.getJSON = jest.fn(() =>
    Promise.resolve({ data: [{ tag_name: testCurrentVersion }] })
  );
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(daemonActions.checkDecreditonVersion());

  expect(mockWalletLog).toHaveBeenCalledWith(
    "info",
    "Decrediton version up to date."
  );
  expect(mockGetJSON).toHaveBeenCalled();
  expect(store.getState().daemon.updateAvailable).toBeUndefined();
});

test("test checkDecreditonVersion - fetching version failed", async () => {
  mockGetJSON = helpers.getJSON = jest.fn(() => Promise.reject(testError));
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(daemonActions.checkDecreditonVersion());

  expect(mockGetJSON).toHaveBeenCalled();
  expect(store.getState().daemon.updateAvailable).toBeUndefined();
});

test("test toggleSpv switch on", async () => {
  const store = createStore(cloneDeep(initialState));

  await store.dispatch(daemonActions.toggleSpv(true));

  expect(mockUpdateStateSettingsChanged).toHaveBeenCalledWith(
    { spvMode: true },
    true
  );
  expect(mockSaveSettings).toHaveBeenCalledWith({
    ...initialState.settings.tempSettings
  });
  expect(store.getState().daemon.showSpvChoice).toBeFalsy();
  expect(mockGetGlobalCfg).toHaveBeenCalled();
  expect(mockGlobalCfgSet).toHaveBeenCalledWith(SHOW_SPV_CHOICE, false);
});

test("test toggleSpv switch off", async () => {
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(daemonActions.toggleSpv(false));

  expect(mockUpdateStateSettingsChanged).toHaveBeenCalledWith(
    { spvMode: false },
    true
  );
  expect(mockSaveSettings).toHaveBeenCalledWith({
    ...initialState.settings.tempSettings
  });
  expect(store.getState().daemon.showSpvChoice).toBeFalsy();
  expect(mockGlobalCfgSet).toHaveBeenCalledWith(SHOW_SPV_CHOICE, false);
});

test("test setupStandardPrivacy", async () => {
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(daemonActions.setupStandardPrivacy());

  expect(mockUpdateStateSettingsChanged).toHaveBeenCalledWith({
    allowedExternalRequests: STANDARD_EXTERNAL_REQUESTS
  });
  expect(mockSaveSettings).toHaveBeenCalledWith({
    ...initialState.settings.tempSettings
  });
  expect(store.getState().daemon.showPrivacy).toBeFalsy();
  expect(mockGlobalCfgSet).toHaveBeenCalledWith(SHOW_PRIVACY, false);
});

test("test setupDisabledPrivacy", async () => {
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(daemonActions.setupDisabledPrivacy());

  expect(mockUpdateStateSettingsChanged).toHaveBeenCalledWith({
    allowedExternalRequests: []
  });
  expect(mockSaveSettings).toHaveBeenCalledWith({
    ...initialState.settings.tempSettings
  });
  expect(store.getState().daemon.showPrivacy).toBeFalsy();
  expect(mockGlobalCfgSet).toHaveBeenCalledWith(SHOW_PRIVACY, false);
});

test("test selectLanguage", async () => {
  const testSelectedLanguage = { language: "test-selected-language" };
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(daemonActions.selectLanguage(testSelectedLanguage));

  expect(mockGlobalCfgSet).toHaveBeenCalledWith(
    LOCALE,
    testSelectedLanguage.language
  );
  expect(mockGlobalCfgSet).toHaveBeenCalledWith(SET_LANGUAGE, false);
  expect(store.getState().settings.currentSettings.locale).toBe(
    testSelectedLanguage.language
  );
  expect(store.getState().settings.tempSettings.locale).toBe(
    testSelectedLanguage.language
  );
});

test("test setVisitedTutorialTabs", async () => {
  const testVisitedTabs = "visited-tabs";
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(daemonActions.setVisitedTutorialTabs(testVisitedTabs));

  expect(mockGlobalCfgSet).toHaveBeenCalledWith(
    VISITED_TUTORIAL_TABS,
    testVisitedTabs
  );
  expect(store.getState().daemon.visitedTutorialTabs).toBe(testVisitedTabs);
});

test("test finishTutorial", async () => {
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(daemonActions.finishTutorial());

  expect(mockGlobalCfgSet).toHaveBeenCalledWith(SHOW_TUTORIAL, false);
  expect(store.getState().daemon.tutorial).toBeFalsy();
});

test("test startDaemon", async () => {
  const store = createStore(cloneDeep(initialState));
  const response = await store.dispatch(daemonActions.startDaemon(testParams));

  const expectedCredentials = {
    rpc_user: testDaemonStartResponse.rpc_user,
    rpc_pass: testDaemonStartResponse.rpc_pass,
    rpc_cert: testDaemonStartResponse.rpc_cert,
    rpc_host: testDaemonStartResponse.rpc_host,
    rpc_port: testDaemonStartResponse.rpc_port
  };
  expect(mockStartDaemon).toHaveBeenCalledWith(testParams, false /* mainnet */);

  expect(store.getState().daemon.daemonStarted).toBeTruthy();
  expect(store.getState().daemon.daemonStopped).toBeFalsy();
  expect(store.getState().daemon.daemonError).toBeNull();
  expect(
    isEqual(store.getState().daemon.credentials, expectedCredentials)
  ).toBeTruthy();
  expect(
    isEqual(
      store.getState().daemon.appdata,
      testDaemonStartResponse.dcrdAppdata
    )
  ).toBeTruthy();
  expect(
    isEqual(response, {
      appdata: testDaemonStartResponse.dcrdAppdata,
      credentials: expectedCredentials
    })
  );
  expect(store.getState().daemon.daemonRemote).toBe(undefined);
});

test("test startDaemon - staring daemon failed", async () => {
  const store = createStore(cloneDeep(initialState));
  mockStartDaemon = wallet.startDaemon = jest.fn(() =>
    Promise.reject(testError)
  );
  let catchedError;
  try {
    await store.dispatch(daemonActions.startDaemon(testParams));
  } catch (error) {
    catchedError = error;
  }
  expect(store.getState().daemon.daemonStarting).toBeTruthy();
  expect(store.getState().daemon.daemonStarted).toBeFalsy();
  expect(store.getState().daemon.daemonStopped).toBeFalsy();
  expect(store.getState().daemon.daemonError).toBe(undefined);
  expect(store.getState().daemon.credentials).toBe(undefined);
  expect(store.getState().daemon.appdata).toBe(undefined);
  expect(store.getState().daemon.daemonRemote).toBe(undefined);
  expect(catchedError).toBe(testError);
});

test("test startDaemon - daemon is already starting", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      daemon: { ...initialState.daemon, daemonStarting: true }
    })
  );
  let catchedError;
  try {
    await store.dispatch(daemonActions.startDaemon(testParams));
  } catch (error) {
    catchedError = error;
  }
  expect(store.getState().daemon.daemonStarted).toBeFalsy();
  expect(store.getState().daemon.daemonStopped).toBeFalsy();
  expect(store.getState().daemon.daemonError).toBe(undefined);
  expect(store.getState().daemon.credentials).toBe(undefined);
  expect(store.getState().daemon.appdata).toBe(undefined);
  expect(store.getState().daemon.daemonRemote).toBe(undefined);
  expect(catchedError).toBe(undefined);
});

test("test startDaemon - daemon have been already started", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      daemon: { ...initialState.daemon, daemonStarted: true }
    })
  );
  let catchedError;
  try {
    await store.dispatch(daemonActions.startDaemon(testParams));
  } catch (error) {
    catchedError = error;
  }
  expect(store.getState().daemon.daemonStarted).toBeTruthy();
  expect(store.getState().daemon.daemonStopped).toBeFalsy();
  expect(store.getState().daemon.daemonError).toBeNull();
  expect(store.getState().daemon.credentials).toBe(undefined);
  expect(store.getState().daemon.appdata).toBe(undefined);
  expect(store.getState().daemon.daemonRemote).toBe(undefined);
  expect(catchedError).toBe(undefined);
});

test("test registerForErrors - received daemon error and warning", async () => {
  const store = createStore(
    cloneDeep({
      initialState
    })
  );
  await store.dispatch(daemonActions.registerForErrors(testParams));
  expect(mockOnErrorReceived).toHaveBeenCalled();
  expect(mockOnWarningReceived).toHaveBeenCalled();
  expect(store.getState().daemon.daemonError).toBe(testOnErrorReceivedError);
  expect(store.getState().daemon.daemonWarning).toBe(
    testOnWarningReceivedWarning
  );
  expect(store.getState().daemon.walletWarning).toBe(undefined);
  expect(store.getState().daemon.walletError).toBe(undefined);
});

test("test registerForErrors - received wallet error and warning", async () => {
  mockOnErrorReceived = wallet.onErrorReceived = jest.fn((cb) => {
    cb("event", undefined, testOnErrorReceivedError);
  });

  mockOnWarningReceived = wallet.onWarningReceived = jest.fn((cb) => {
    cb("event", undefined, testOnWarningReceivedWarning);
  });
  const store = createStore(
    cloneDeep({
      initialState
    })
  );
  await store.dispatch(daemonActions.registerForErrors(testParams));
  expect(mockOnErrorReceived).toHaveBeenCalled();
  expect(mockOnWarningReceived).toHaveBeenCalled();
  expect(store.getState().daemon.daemonError).toBe(undefined);
  expect(store.getState().daemon.daemonWarning).toBe(undefined);
  expect(store.getState().daemon.walletWarning).toBe(
    testOnWarningReceivedWarning
  );
  expect(store.getState().daemon.walletError).toBe(testOnErrorReceivedError);
});

test("test deleteDaemonData", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      daemon: {
        ...initialState.daemon,
        appData: testDaemonStartResponse.dcrdAppdata
      }
    })
  );
  await store.dispatch(
    daemonActions.deleteDaemonData(testDaemonStartResponse.dcrdAppdata)
  );
  expect(mockDeleteDaemonData).toHaveBeenCalledWith(
    testDaemonStartResponse.dcrdAppdata,
    false /* mainnet */
  );

  // shutdown and finalShutdown have been called
  expect(mockOnDaemonStopped).toHaveBeenCalled();
  expect(store.getState().daemon.daemonStopped).toBeTruthy();
  expect(store.getState().daemon.daemonStarted).toBeFalsy();
  expect(store.getState().daemon.daemonStarting).toBeFalsy();
  expect(store.getState().daemon.shutdownRequested).toBeTruthy();

  expect(mockStopNotifcations).toHaveBeenCalled();
  expect(mockRescanCancel).toHaveBeenCalled();
  expect(mockSyncCancel).toHaveBeenCalled();
});

test("test deleteDaemonData - failed", async () => {
  mockDeleteDaemonData = wallet.deleteDaemonData = jest.fn(() =>
    Promise.reject(testError)
  );
  const store = createStore(
    cloneDeep({
      ...initialState,
      daemon: {
        ...initialState.daemon,
        appData: testDaemonStartResponse.dcrdAppdata
      }
    })
  );
  await store.dispatch(
    daemonActions.deleteDaemonData(testDaemonStartResponse.dcrdAppdata)
  );
  expect(mockDeleteDaemonData).toHaveBeenCalledWith(
    testDaemonStartResponse.dcrdAppdata,
    false /* mainnet */
  );

  // shutdown and finalShutdown have been called
  expect(mockOnDaemonStopped).not.toHaveBeenCalled();
  expect(store.getState().daemon.daemonStopped).toBeFalsy();

  expect(mockStopNotifcations).not.toHaveBeenCalled();
  expect(mockRescanCancel).not.toHaveBeenCalled();
  expect(mockSyncCancel).not.toHaveBeenCalled();
});

test("test finalShutdown", async () => {
  const testCurrentBlockHeight = "test-currentBlockHeight";
  const store = createStore(
    cloneDeep({
      ...initialState,
      grpc: {
        currentBlockHeight: testCurrentBlockHeight
      }
    })
  );
  await store.dispatch(daemonActions.finalShutdown());
  expect(mockSetLastHeight).toHaveBeenCalledWith(testCurrentBlockHeight);
  expect(mockOnDaemonStopped).toHaveBeenCalled();
  expect(store.getState().daemon.daemonStopped).toBeTruthy();
  expect(store.getState().daemon.daemonStarted).toBeFalsy();
  expect(store.getState().daemon.daemonStarting).toBeFalsy();
  expect(store.getState().daemon.shutdownRequested).toBeTruthy();

  expect(mockStopNotifcations).toHaveBeenCalled();
  expect(mockRescanCancel).toHaveBeenCalled();
  expect(mockSyncCancel).toHaveBeenCalled();
});

test("test shutdownApp", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      dex: {
        loggedIn: true
      }
    })
  );
  await store.dispatch(daemonActions.shutdownApp());
  expect(mockSetLastHeight).not.toHaveBeenCalled();
  expect(mockOnDaemonStopped).toHaveBeenCalled();

  // dex is loggged in
  expect(mockLogoutDex).toHaveBeenCalled();
  expect(store.getState().dex.loggedIn).toBeFalsy();
  expect(store.getState().dex.logoutError).toBeNull();
  expect(store.getState().dex.openOrder).toBeFalsy();

  expect(store.getState().daemon.daemonStopped).toBeTruthy();
  expect(store.getState().daemon.daemonStarted).toBeFalsy();
  expect(store.getState().daemon.daemonStarting).toBeFalsy();
  expect(store.getState().daemon.shutdownRequested).toBeTruthy();

  expect(mockStopNotifcations).toHaveBeenCalled();
  expect(mockRescanCancel).toHaveBeenCalled();
  expect(mockSyncCancel).toHaveBeenCalled();
});

test("test shutdownApp - failed", async () => {
  mockLogoutDex = dexActions.logoutDex = jest.fn(() => {
    throw testError;
  });
  const store = createStore(
    cloneDeep({
      ...initialState,
      dex: {
        loggedIn: true
      }
    })
  );
  await store.dispatch(daemonActions.shutdownApp());
  expect(mockSetLastHeight).not.toHaveBeenCalled();
  expect(mockOnDaemonStopped).not.toHaveBeenCalled();

  // dex is loggged in
  expect(mockLogoutDex).toHaveBeenCalled();
  expect(store.getState().dex.loggedIn).toBeTruthy();
  expect(store.getState().dex.logoutError).toBe(testError);
  expect(store.getState().dex.openOrder).toBeFalsy();

  expect(mockOnDaemonStopped).not.toHaveBeenCalled();
  expect(store.getState().daemon.daemonStopped).toBeFalsy();

  expect(mockStopNotifcations).not.toHaveBeenCalled();
  expect(mockRescanCancel).not.toHaveBeenCalled();
  expect(mockSyncCancel).not.toHaveBeenCalled();
});

test("test shutdownApp - failed (dex has active orders)", async () => {
  mockLogoutDex = dexActions.logoutDex = jest.fn(() => {
    throw testError + "cannot log out with active orders";
  });
  const store = createStore(
    cloneDeep({
      ...initialState,
      dex: {
        loggedIn: true
      }
    })
  );
  await store.dispatch(daemonActions.shutdownApp());
  expect(store.getState().dex.openOrder).toBeTruthy();
});

test("test cleanShutdown", async () => {
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(daemonActions.cleanShutdown());

  expect(mockCleaShutdown).toHaveBeenCalled();
});

test("test removeWallet", async () => {
  const selectedWallet = { value: { wallet: "test-wallet" }, network: TESTNET };
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(daemonActions.removeWallet(selectedWallet));

  expect(mockRemoveWallet).toHaveBeenCalledWith(
    selectedWallet.value.wallet,
    true
  );
  expect(mockGetAvailableWallets).toHaveBeenCalled();
});

test("test removeWallet - failed", async () => {
  mockRemoveWallet = wallet.removeWallet = jest.fn(() =>
    Promise.reject(testError)
  );
  const selectedWallet = { value: { wallet: "test-wallet" }, network: TESTNET };
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(daemonActions.removeWallet(selectedWallet));

  expect(mockRemoveWallet).toHaveBeenCalledWith(
    selectedWallet.value.wallet,
    true
  );
  expect(mockGetAvailableWallets).not.toHaveBeenCalled();
});

test("test createWallet", async () => {
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(daemonActions.createWallet(cloneDeep(selectedWallet)));

  expect(mockCreateNewWallet).toHaveBeenCalledWith(
    selectedWallet.value.wallet,
    false
  );
  expect(mockSetPreviousWallet).toHaveBeenCalledWith(selectedWallet);
  expect(mockGetVersionServiceAttempt).toHaveBeenCalled();
  expect(mockOpenWalletAttempt).toHaveBeenCalled();
  expect(mockSetSelectedWallet).toHaveBeenCalledWith(selectedWallet);

  expect(store.getState().walletLoader.isWatchingOnly).toBe(
    selectedWallet.value.isWatchingOnly
  );
  expect(store.getState().walletLoader.isTrezor).toBe(
    selectedWallet.value.isTrezor
  );

  expect(mockWalletCfgSet).toHaveBeenCalledWith(
    WALLET_CREATED_AS_NEW,
    !!selectedWallet.value.isNew
  );
  expect(mockWalletCfgSet).not.toHaveBeenCalledWith(GAP_LIMIT);
});

test("test createWallet - set gap limit", async () => {
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(
    daemonActions.createWallet(
      cloneDeep({
        ...selectedWallet,
        value: { ...selectedWallet.value, gapLimit: testGapLimit }
      })
    )
  );

  expect(mockWalletCfgSet).toHaveBeenCalledWith(GAP_LIMIT, testGapLimit);
});

test("test createWallet - start wallet fails", async () => {
  mockStartWallet = wallet.startWallet = jest.fn(() =>
    Promise.reject({ message: testError })
  );
  const store = createStore(cloneDeep(initialState));

  let receivedError;
  try {
    await store.dispatch(daemonActions.createWallet(cloneDeep(selectedWallet)));
  } catch (error) {
    receivedError = error;
  }
  expect(isEqual(receivedError, { message: testError })).toBeTruthy();
});

test("test createWallet - start wallet fails, but with 'missing database file'", async () => {
  mockStartWallet = wallet.startWallet = jest.fn(() =>
    Promise.reject({ message: testError + "missing database file" })
  );
  const store = createStore(cloneDeep(initialState));

  let receivedError;
  try {
    await store.dispatch(daemonActions.createWallet(cloneDeep(selectedWallet)));
  } catch (error) {
    receivedError = error;
  }
  expect(receivedError).toBe(undefined);
});

test("test startWallet", async () => {
  const testDexReady = "test-dex-ready";
  const testDexAccount = "test-dex-account";
  const testConfirmDexSeed = "test-confirm-dex-seed";
  const testDexWalletRPCUsername = "testDexWalletRPCUsername";
  const testDexWalletRPCPassword = "testDexWalletRPCPassword";
  const testDexWalletRPCHostPort = "testDexWalletRPCHostPort";

  const testGapLimit = "test-gapLimit";
  const testHiddenAccounts = "test-hidden_accounts";
  const testCurrencyDisplay = "test-CURRENCY_DISPLAY";
  const testDiscoverAccounts = "test-DISCOVER_ACCOUNTS";
  const testPoliteiaLastAccessTime = "test-POLITEIA_LAST_ACCESS_TIME";
  const testPoliteiaLastAccessBlock = "test-POLITEIA_LAST_ACCESS_BLOCK";
  const testEnablePrivacy = "test-ENABLE_PRIVACY";
  const testSendFromUnmixed = "test-SEND_FROM_UNMIXED";
  const testMixedAccountCfg = "test-MIXED_ACCOUNT_CFG";
  const testChangeAccountCfg = "test-CHANGE_ACCOUNT_CFG";
  const testCsppServer = "test-CSPP_SERVER";
  const testCsppPort = "test-CSPP_PORT";
  const testMixedAccBranch = "test-MIXED_ACC_BRANCH";
  const testRememberedVspHost = "test-REMEMBERED_VSP_HOST";
  const testNeedsVspdProcessTickets = "test-NEEDS_VSPD_PROCESS_TICKETS";
  const testShowStakingWarning = "test-SHOW_STAKING_WARNING";
  const testAutobuyerSettings = {
    balanceToMaintain: "test-balanceToMaintain",
    account: "test-account",
    maxFeePercentage: "maxFeePercentage"
  };

  mockWalletCfgGet = jest.fn((key) => {
    switch (key) {
      case ENABLE_DEX:
        return true;
      case DEX_READY:
        return testDexReady;
      case DEX_ACCOUNT:
        return testDexAccount;
      case CONFIRM_DEX_SEED:
        return testConfirmDexSeed;
      case DEXWALLET_RPCUSERNAME:
        return testDexWalletRPCUsername;
      case DEXWALLET_RPCPASSWORD:
        return testDexWalletRPCPassword;
      case DEXWALLET_HOSTPORT:
        return testDexWalletRPCHostPort;
      case GAP_LIMIT:
        return testGapLimit;
      case HIDDEN_ACCOUNTS:
        return testHiddenAccounts; // this key seems to not have been read nowhere
      case CURRENCY_DISPLAY:
        return testCurrencyDisplay;
      case DISCOVER_ACCOUNTS:
        return testDiscoverAccounts;
      case POLITEIA_LAST_ACCESS_TIME:
        return testPoliteiaLastAccessTime;
      case POLITEIA_LAST_ACCESS_BLOCK:
        return testPoliteiaLastAccessBlock;
      case ENABLE_PRIVACY:
        return testEnablePrivacy;
      case SEND_FROM_UNMIXED:
        return testSendFromUnmixed;
      case MIXED_ACCOUNT_CFG:
        return testMixedAccountCfg;
      case CHANGE_ACCOUNT_CFG:
        return testChangeAccountCfg;
      case CSPP_SERVER:
        return testCsppServer;
      case CSPP_PORT:
        return testCsppPort;
      case MIXED_ACC_BRANCH:
        return testMixedAccBranch;
      case REMEMBERED_VSP_HOST:
        return testRememberedVspHost;
      case NEEDS_VSPD_PROCESS_TICKETS:
        return testNeedsVspdProcessTickets;
      case SHOW_STAKING_WARNING:
        return testShowStakingWarning;
      case AUTOBUYER_SETTINGS:
        return testAutobuyerSettings;
      default:
        undefined;
    }
  });
  const store = createStore(cloneDeep(initialState));

  const selectedWalletCopy = cloneDeep({
    ...selectedWallet,
    value: {
      ...selectedWallet.value,
      gapLimit: testGapLimit,
      disableCoinTypeUpgrades: testDisableCoinTypeUpgrades
    }
  });

  const response = await store.dispatch(
    daemonActions.startWallet(selectedWalletCopy, true)
  );

  expect(mockGetSelectedWallet).not.toHaveBeenCalled();
  expect(response).toBe(testDiscoverAccounts);

  expect(mockSetPreviousWallet).toHaveBeenCalledWith(selectedWalletCopy);
  expect(mockGetVersionServiceAttempt).toHaveBeenCalled();
  expect(mockOpenWalletAttempt).toHaveBeenCalled();

  expect(store.getState().walletLoader.dexEnabled).toBeTruthy();
  expect(store.getState().walletLoader.dexReady).toBe(testDexReady);
  expect(store.getState().walletLoader.dexAccount).toBe(testDexAccount);
  expect(store.getState().walletLoader.confirmDexSeed).toBe(testConfirmDexSeed);
  expect(store.getState().walletLoader.dexRpcSettings.rpcUser).toBe(
    testDexWalletRPCUsername
  );
  expect(store.getState().walletLoader.dexRpcSettings.rpcPass).toBe(
    testDexWalletRPCPassword
  );
  expect(store.getState().walletLoader.dexRpcSettings.rpcListen).toBe(
    testDexWalletRPCHostPort
  );
  expect(store.getState().walletLoader.dexRpcSettings.rpcCert).toBe(
    `${testWalletPath}/rpc.cert`
  );

  expect(mockStartWallet).toHaveBeenCalledWith(
    selectedWallet.value.wallet,
    false,
    {
      rpcUser: testDexWalletRPCUsername,
      rpcPass: testDexWalletRPCPassword,
      rpcListen: testDexWalletRPCHostPort,
      rpcCert: `${testWalletPath}/rpc.cert`
    },
    testGapLimit,
    testDisableCoinTypeUpgrades
  );

  expect(store.getState().settings.currentSettings.currencyDisplay).toBe(
    testCurrencyDisplay
  );
  expect(store.getState().settings.tempSettings.currencyDisplay).toBe(
    testCurrencyDisplay
  );
  expect(store.getState().walletLoader.discoverAccountsComplete).toBe(
    testDiscoverAccounts
  );
  expect(store.getState().governance.lastPoliteiaAccessTime).toBe(
    testPoliteiaLastAccessTime
  );
  expect(store.getState().governance.lastPoliteiaAccessBlock).toBe(
    testPoliteiaLastAccessBlock
  );
  expect(store.getState().walletLoader.privacyEnabled).toBe(testEnablePrivacy);
  expect(store.getState().walletLoader.allowSendFromUnmixed).toBe(
    testSendFromUnmixed
  );
  expect(store.getState().walletLoader.mixedAccount).toBe(testMixedAccountCfg);
  expect(store.getState().walletLoader.changeAccount).toBe(
    testChangeAccountCfg
  );
  expect(store.getState().walletLoader.csppServer).toBe(testCsppServer);
  expect(store.getState().walletLoader.csppPort).toBe(testCsppPort);
  expect(store.getState().walletLoader.mixedAccountBranch).toBe(
    testMixedAccBranch
  );
  expect(store.getState().vsp.rememberedVspHost).toBe(testRememberedVspHost);
  expect(store.getState().vsp.needsProcessManagedTickets).toBe(
    testNeedsVspdProcessTickets
  );
  expect(store.getState().walletLoader.showStakingWarning).toBe(
    testShowStakingWarning
  );
  expect(store.getState().walletLoader.needsPassPhrase).toBeFalsy();
  expect(store.getState().vsp.balanceToMaintain).toBe(
    testAutobuyerSettings.balanceToMaintain
  );
  expect(store.getState().vsp.account).toBe(testAutobuyerSettings.account);
  expect(store.getState().vsp.maxFeePercentage).toBe(
    testAutobuyerSettings.maxFeePercentage
  );

  expect(mockWalletCfgSet).toHaveBeenCalledWith(LAST_ACCESS, testDateNow);
  expect(mockEnableTrezor).not.toHaveBeenCalled();
});

test("test startWallet - call without selectedWallet parameter, dex is not enabled", async () => {
  mockWalletCfgGet = jest.fn((key) => {
    switch (key) {
      case ENABLE_DEX:
        return false;
      default:
        undefined;
    }
  });
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(daemonActions.startWallet(undefined, true));

  expect(mockGetSelectedWallet).toHaveBeenCalled();
  expect(mockGetWalletCfg).toHaveBeenCalled();

  expect(mockSetPreviousWallet).toHaveBeenCalledWith(selectedWallet);

  expect(store.getState().walletLoader.dexEnabled).toBeFalsy();
  expect(store.getState().walletLoader.dexReady).toBe(undefined);
  expect(store.getState().walletLoader.dexAccount).toBe(undefined);
  expect(store.getState().walletLoader.confirmDexSeed).toBe(undefined);
  expect(store.getState().walletLoader.dexRpcSettings.rpcUser).toBe(undefined);
  expect(store.getState().walletLoader.dexRpcSettings.rpcPass).toBe(undefined);
  expect(store.getState().walletLoader.dexRpcSettings.rpcListen).toBe(
    undefined
  );
  expect(store.getState().walletLoader.dexRpcSettings.rpcCert).toBe(undefined);

  expect(mockStartWallet).toHaveBeenCalledWith(
    selectedWallet.value.wallet,
    false,
    {},
    undefined,
    undefined
  );
});

test("test startWallet - failed", async () => {
  mockStartWallet = wallet.startWallet = jest.fn(() =>
    Promise.reject(testError)
  );
  const store = createStore(cloneDeep(initialState));
  let catchedError;
  try {
    await store.dispatch(daemonActions.startWallet(undefined, true));
  } catch (error) {
    catchedError = error;
  }

  expect(catchedError).toBe(testError);
});

test("test startWallet - trezor is enabled", async () => {
  const store = createStore(cloneDeep(initialState));

  const selectedWalletCopy = cloneDeep({
    ...selectedWallet,
    value: {
      ...selectedWallet.value,
      isTrezor: true
    }
  });

  await store.dispatch(daemonActions.startWallet(selectedWalletCopy, true));
  expect(mockEnableTrezor).toHaveBeenCalled();
});

test("test startWallet - does need passphrase", async () => {
  mockWalletCfgGet = jest.fn((key) => {
    switch (key) {
      case DISCOVER_ACCOUNTS:
        return false;
      default:
        undefined;
    }
  });
  const store = createStore(cloneDeep(initialState));

  await store.dispatch(daemonActions.startWallet(undefined, false));
  expect(store.getState().walletLoader.needsPassPhrase).toBeTruthy();
});

test("test startWallet - legacy cspp server", async () => {
  mockWalletCfgGet = jest.fn((key) => {
    switch (key) {
      case CSPP_SERVER:
        return CSPP_URL_LEGACY;
      default:
        undefined;
    }
  });
  const store = createStore(cloneDeep(initialState));

  await store.dispatch(daemonActions.startWallet(undefined, false));
  expect(mockWalletCfgSet).toHaveBeenCalledWith(CSPP_SERVER, CSPP_URL);
});

test("test closeDaemonRequest", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      daemon: {
        ...initialState.daemon,
        daemonCloseError: "will-set",
        daemonCloseRequestAttempt: "will-set",
        daemonCloseResponse: "will-set",
        daemonStarted: "will-set",
        daemonStarting: "will-set",
        daemonStopped: "will-set",
        credentials: "will-set",
        appdata: "will-set",
        daemonSynced: "will-set",
        currentBlockCount: "will-set",
        timeLeftEstimate: "will-set",
        timeStart: "will-set",
        blockStart: "will-set"
      }
    })
  );
  await store.dispatch(daemonActions.closeDaemonRequest());

  expect(mockStopDaemon).toHaveBeenCalled();

  expect(store.getState().daemon.daemonCloseError).toBeNull();
  expect(store.getState().daemon.daemonCloseRequestAttempt).toBeFalsy();
  expect(store.getState().daemon.daemonCloseResponse).toBe(undefined);
  expect(store.getState().daemon.daemonStarted).toBeFalsy();
  expect(store.getState().daemon.daemonStarting).toBeFalsy();
  expect(store.getState().daemon.daemonStopped).toBeTruthy();
  expect(store.getState().daemon.credentials).toBeNull();
  expect(store.getState().daemon.appdata).toBeNull();
  expect(store.getState().daemon.daemonSynced).toBeFalsy();
  expect(store.getState().daemon.currentBlockCount).toBeNull();
  expect(store.getState().daemon.timeLeftEstimate).toBeNull();
  expect(store.getState().daemon.timeStart).toBeNull();
  expect(store.getState().daemon.blockStart).toBeNull();
});

test("test closeDaemonRequest - failed", async () => {
  mockStopDaemon = wallet.stopDaemon = jest.fn(() => {
    throw testError;
  });
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(daemonActions.closeDaemonRequest());

  expect(mockStopDaemon).toHaveBeenCalled();
  expect(store.getState().daemon.daemonCloseError).toBe(testError);
});

test("test connectDaemon", async () => {
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(
    daemonActions.connectDaemon(testRpcCreds, testDaemonRemote)
  );

  expect(mockConnectDaemon).toHaveBeenCalledWith({
    rpcCreds: testRpcCreds,
    testnet: false
  });

  expect(store.getState().daemon.daemonConnected).toBeTruthy();
  expect(store.getState().daemon.daemonError).toBeNull();
  expect(store.getState().daemon.daemonRemote).toBe(testDaemonRemote);
});

test("test connectDaemon - use credentials from store", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      daemon: {
        ...initialState.daemon,
        credentials: testCredentials
      }
    })
  );
  await store.dispatch(
    daemonActions.connectDaemon(undefined, testDaemonRemote)
  );
  expect(mockConnectDaemon).toHaveBeenCalledWith({
    rpcCreds: testCredentials,
    testnet: false
  });
});

test("test connectDaemon - failed", async () => {
  mockConnectDaemon = wallet.connectDaemon = jest.fn(() => {
    throw { error: testError };
  });
  const store = createStore(cloneDeep(initialState));
  let catchedError;
  try {
    await store.dispatch(
      daemonActions.connectDaemon(testRpcCreds, testDaemonRemote)
    );
  } catch (error) {
    catchedError = error;
  }
  expect(catchedError.error).toBe(testError);
  expect(store.getState().daemon.daemonConnected).toBeFalsy();
  expect(store.getState().daemon.daemonError).toBe(testError);
  expect(store.getState().daemon.daemonTimeout).toBe(undefined);
});

test("test connectDaemon - failed (ECONNREFUSED - should try to reconnect + received daemon warning + eventually connected)", () => {
  jest.useFakeTimers();
  let testErrorCode = "ECONNREFUSED";
  mockConnectDaemon = wallet.connectDaemon = jest.fn(() => {
    throw { error: { code: testErrorCode } };
  });
  const store = createStore(
    cloneDeep({
      ...initialState,
      daemon: {
        ...initialState.daemon,
        daemonWarning: undefined
      }
    })
  );

  store.dispatch(daemonActions.connectDaemon(testRpcCreds, testDaemonRemote));
  act(() => {
    advanceBy(2 * 1000);
    jest.advanceTimersByTime(2 * 1000);
  });

  expect(mockConnectDaemon).toHaveBeenCalledTimes(3);

  expect(store.getState().daemon.daemonConnected).toBeFalsy();
  expect(store.getState().daemon.daemonError).toBeNull();

  mockConnectDaemon.mockClear();
  testErrorCode = "";
  store.dispatch({
    type: daemonActions.DAEMON_WARNING,
    warning: testDaemonWarning
  });
  act(() => {
    advanceBy(5 * 1000);
    jest.advanceTimersByTime(5 * 1000);
  });
  expect(mockConnectDaemon).toHaveBeenCalledTimes(2);

  store.dispatch({
    type: daemonActions.CONNECTDAEMON_SUCCESS
  });
  mockConnectDaemon.mockClear();
  act(() => {
    advanceBy(5 * 1000);
    jest.advanceTimersByTime(5 * 1000);
  });
  expect(mockConnectDaemon).not.toHaveBeenCalled();
  expect(store.getState().daemon.daemonConnected).toBeTruthy();
  expect(store.getState().daemon.daemonError).toBeNull();
});

test("test connectDaemon - failed (ECONNREFUSED - should try to reconnect + received daemon warning + eventually connected)", () => {
  jest.useFakeTimers();
  let testErrorCode = "ECONNREFUSED";
  mockConnectDaemon = wallet.connectDaemon = jest.fn(() => {
    throw { error: { code: testErrorCode } };
  });
  const store = createStore(
    cloneDeep({
      ...initialState,
      daemon: {
        ...initialState.daemon,
        daemonWarning: undefined
      }
    })
  );

  store.dispatch(daemonActions.connectDaemon(testRpcCreds, testDaemonRemote));
  act(() => {
    advanceBy(2 * 1000);
    jest.advanceTimersByTime(2 * 1000);
  });

  expect(mockConnectDaemon).toHaveBeenCalledTimes(3);

  expect(store.getState().daemon.daemonConnected).toBeFalsy();
  expect(store.getState().daemon.daemonError).toBeNull();

  mockConnectDaemon.mockClear();
  testErrorCode = "";
  store.dispatch({
    type: daemonActions.DAEMON_WARNING,
    warning: testDaemonWarning
  });
  act(() => {
    advanceBy(5 * 1000);
    jest.advanceTimersByTime(5 * 1000);
  });
  expect(mockConnectDaemon).toHaveBeenCalledTimes(2);

  store.dispatch({
    type: daemonActions.CONNECTDAEMON_SUCCESS
  });
  mockConnectDaemon.mockClear();
  act(() => {
    advanceBy(5 * 1000);
    jest.advanceTimersByTime(5 * 1000);
  });
  expect(mockConnectDaemon).not.toHaveBeenCalled();
  expect(store.getState().daemon.daemonConnected).toBeTruthy();
  expect(store.getState().daemon.daemonError).toBeNull();
});

test("test checkNetworkMatch", async () => {
  const store = createStore({
    settings: { currentSettings: { network: "testnet" } }
  });
  await store.dispatch(daemonActions.checkNetworkMatch());

  expect(mockGetDaemonInfo).toHaveBeenCalled();
  expect(mockDropDcrd).not.toHaveBeenCalled();
  expect(store.getState().daemon.networkMatch).toBeTruthy();
  expect(store.getState().daemon.daemonError).toBeNull();
});

test("test checkNetworkMatch - does not match", async () => {
  const store = createStore({
    settings: { currentSettings: { network: "mainnet" } }
  });

  let catchedError;
  try {
    await store.dispatch(daemonActions.checkNetworkMatch());
  } catch (error) {
    catchedError = error;
  }

  expect(catchedError).toBe(DIFF_CONNECTION_ERROR);
  expect(mockGetDaemonInfo).toHaveBeenCalled();
  expect(mockDropDcrd).toHaveBeenCalled();
  expect(store.getState().daemon.networkMatch).toBeNull();
  expect(store.getState().daemon.daemonError).toBe(DIFF_CONNECTION_ERROR);
});

test("test checkNetworkMatch - failed", async () => {
  mockGetDaemonInfo = wallet.getDaemonInfo = jest.fn(() =>
    Promise.reject(testError)
  );
  const store = createStore(cloneDeep(initialState));

  let catchedError;
  try {
    await store.dispatch(daemonActions.checkNetworkMatch());
  } catch (error) {
    catchedError = error;
  }

  expect(catchedError).toBe(testError);
  expect(mockGetDaemonInfo).toHaveBeenCalled();
  expect(mockDropDcrd).not.toHaveBeenCalled();
  expect(store.getState().daemon.networkMatch).toBeNull();
  expect(store.getState().daemon.daemonError).toBe(testError);
});

test("test decreditonInit", async () => {
  const store = createStore(initialState);
  await store.dispatch(daemonActions.decreditonInit());
  expect(mockOnErrorReceived).toHaveBeenCalled();
  expect(mockOnWarningReceived).toHaveBeenCalled();

  expect(mockGetJSON).toHaveBeenCalled();
});

test("test getDcrdLastLineLogs", async () => {
  const store = createStore(initialState);
  const logs = await store.dispatch(daemonActions.getDcrdLastLineLogs());
  expect(mockGetDcrdLastLogLine).toHaveBeenCalled();
  expect(logs).toBe(testDcrdLastLogLine);
});

test("test getDcrdLastLineLogs - failed", async () => {
  mockGetDcrdLastLogLine = wallet.getDcrdLastLogLine = jest.fn(() =>
    Promise.reject(testError)
  );
  const store = createStore(initialState);
  let catchedError;
  let logs;
  try {
    logs = await store.dispatch(daemonActions.getDcrdLastLineLogs());
  } catch (error) {
    catchedError = error;
  }
  expect(mockGetDcrdLastLogLine).toHaveBeenCalled();
  expect(logs).toBe(undefined);
  expect(catchedError).toBe(testError);
});

test("test getDcrwalletLogs", async () => {
  const store = createStore(initialState);
  const logs = await store.dispatch(daemonActions.getDcrwalletLogs());
  expect(mockGetDcrwalletLastLogLine).toHaveBeenCalled();
  expect(logs).toBe(testDcrdwalletLastLogLine);
});

test("test getDcrwalletLogs - failed", async () => {
  mockGetDcrwalletLastLogLine = wallet.getDcrwalletLastLogLine = jest.fn(() =>
    Promise.reject(testError)
  );
  const store = createStore(initialState);
  let catchedError;
  let logs;
  try {
    logs = await store.dispatch(daemonActions.getDcrwalletLogs());
  } catch (error) {
    catchedError = error;
  }
  expect(mockGetDcrwalletLastLogLine).toHaveBeenCalled();
  expect(logs).toBe(undefined);
  expect(catchedError).toBe(testError);
});

test("test getPrivacyLogs", async () => {
  const store = createStore(initialState);
  const logs = await store.dispatch(daemonActions.getPrivacyLogs());
  expect(mockGetPrivacyLogs).toHaveBeenCalled();
  expect(logs).toBe(testPrivacyLogs);
});

test("test getPrivacyLogs - failed", async () => {
  mockGetPrivacyLogs = wallet.getPrivacyLogs = jest.fn(() =>
    Promise.reject(testError)
  );
  const store = createStore(initialState);
  let catchedError;
  let logs;
  try {
    logs = await store.dispatch(daemonActions.getPrivacyLogs());
  } catch (error) {
    catchedError = error;
  }
  expect(mockGetPrivacyLogs).toHaveBeenCalled();
  expect(logs).toBe(undefined);
  expect(catchedError).toBe(testError);
});

test("test getDexLogs", async () => {
  const store = createStore(initialState);
  const logs = await store.dispatch(daemonActions.getDexLogs());
  expect(mockGetDexLogs).toHaveBeenCalledWith(testWalletPath);
  expect(mockGetWalletPath).toHaveBeenCalled();
  expect(logs).toBe(testDexLogs);
});

test("test getDexLogs - failed", async () => {
  mockGetDexLogs = wallet.getDexLogs = jest.fn(() => Promise.reject(testError));
  const store = createStore(initialState);
  let catchedError;
  let logs;
  try {
    logs = await store.dispatch(daemonActions.getDexLogs());
  } catch (error) {
    catchedError = error;
  }
  expect(mockGetDexLogs).toHaveBeenCalled();
  expect(logs).toBe(undefined);
  expect(catchedError).toBe(testError);
});

test("test syncDaemon", async () => {
  jest.useFakeTimers();
  Date.now = jest.fn(() => testDateNow);
  const blockStart = 2;
  const testBlockChainInfo = {
    blockCount: blockStart,
    syncHeight: 10
  };
  mockGetBlockCount = wallet.getBlockCount = jest.fn(() =>
    Promise.resolve(testBlockChainInfo)
  );
  const store = createStore(initialState);
  store.dispatch(daemonActions.syncDaemon());
  expect(mockGetBlockCount).toHaveBeenCalled();

  // syncing has been started
  act(() => {
    advanceBy(1000);
    jest.advanceTimersByTime(1000);
  });
  await waitFor(() => expect(mockGetBlockCount).toHaveBeenCalled());
  expect(store.getState().daemon.daemonSynced).toBeFalsy();
  expect(store.getState().daemon.currentBlockCount).toBe(
    testBlockChainInfo.blockCount
  );
  expect(store.getState().daemon.blockStart).toBe(blockStart);
  expect(store.getState().daemon.timeStart).toBe(testDateNow);
  expect(store.getState().daemon.neededBlocks).toBe(
    testBlockChainInfo.syncHeight
  );
  expect(store.getState().daemon.timeLeftEstimate).toBeNull();

  // syncing is in progress
  testBlockChainInfo.blockCount += 1;
  act(() => {
    advanceBy(1000);
    jest.advanceTimersByTime(1000);
  });
  testDateNow += 1000;
  await waitFor(() => expect(mockGetBlockCount).toHaveBeenCalled());
  expect(store.getState().daemon.currentBlockCount).toBe(
    testBlockChainInfo.blockCount
  );
  expect(store.getState().daemon.timeLeftEstimate).toBe(7);

  // syncing is ready
  testBlockChainInfo.blockCount = testBlockChainInfo.syncHeight;
  act(() => {
    advanceBy(2000);
    jest.advanceTimersByTime(2000);
  });
  testDateNow += 2000;

  await waitFor(() => expect(mockSetHeightSynced).toHaveBeenCalled());

  expect(store.getState().daemon.daemonSynced).toBeTruthy();
});

test("test syncDaemon - failed", async () => {
  mockGetBlockCount = wallet.getBlockCount = jest.fn(() =>
    Promise.reject(testError)
  );
  const store = createStore(initialState);

  let catchedError;
  try {
    await store.dispatch(daemonActions.syncDaemon());
  } catch (error) {
    catchedError = error;
  }

  expect(catchedError).toBe(testError);
  expect(mockGetBlockCount).toHaveBeenCalled();
});

test("test syncDaemon - daemon has already synced", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      daemon: {
        ...initialState.daemon,
        daemonSynced: true
      }
    })
  );

  await store.dispatch(daemonActions.syncDaemon());
  expect(mockGetBlockCount).not.toHaveBeenCalled();
});
