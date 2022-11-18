import * as da from "actions/DexActions";
import * as sa from "actions/SettingsActions";
import * as wa from "actions/WalletLoaderActions";
import * as ca from "actions/ControlActions";
import {
  EXTERNALREQUEST_DEX,
  MAINNET,
  MainNetParams,
  TESTNET,
  TestNetParams
} from "constants";
import * as cfgConstants from "constants/config";
import * as de from "dex";
import { cloneDeep } from "fp";
import * as he from "helpers/strings";
import { createStore } from "test-utils.js";
import * as wal from "wallet";

const dexActions = da;
const wallet = wal;
const helpers = he;
const settingsActions = sa;
const walletLoaderActions = wa;
const dex = de;
const controlActions = ca;

let mockWalletCfgGet;
let mockWalletCfgSet;

const testWalletName = "test-wallet-name";
const testRandomString = "test-random-string";
const testError = "test-error";
const testWalletPath = "test-wallet-path";
const testLocalName = "test-localname";
const testCheckInitRes = "test-check-init-res";
const testDexAccountName = "test-dex-account-name";
const testPassphrase = "test-passphrase";
const testAppPassphrase = "test-app-passphrase";
const testSeed =
  "47cddbc8aa57af05fff0f20e60e958961764ca5a88e5a8b3562a6a234b8761248b65a805198af945fb7b5764abc00bcbc0d6def99321a92795badf34ecb02629";
const testAccounts = [
  { accountName: "default" },
  { accountName: testDexAccountName }
];
const testServerAddr = "test-server-addr";
const testUser = "test-user";
const testDexRpcSettings = {
  rpcUser: "test-rpc-user",
  rpcPass: "test-rpc-pass",
  rpcListen: "test-rpc-listen",
  rpcCert: "test-rpc-cert"
};

const initialState = {
  walletLoader: { dexAccount: testDexAccountName },
  daemon: { walletName: testWalletName },
  grpc: { getAccountsResponse: { accountsList: testAccounts } },
  settings: { currentSettings: { network: TESTNET, locale: testLocalName } }
};

let mockAddAllowedExternalRequest;
let mockCloseWalletRequest;
let mockGetWalletPath;
let mockStart;
let mockCheckInit;
let mockStop;
let mockInit;
let mockExportSeed;
let mockUser;
let mockLogin;
let mockLogout;
let mockCreateWallet;
let mockLaunchWindow;
let mockSetWalletPassword;
let mockGetNextAccountAttempt;

beforeEach(() => {
  mockWalletCfgGet = jest.fn(() => {});
  mockWalletCfgSet = jest.fn(() => {});
  wallet.getWalletCfg = () => ({
    get: mockWalletCfgGet,
    set: mockWalletCfgSet
  });
  helpers.makeRandomString = jest.fn(() => testRandomString);
  mockAddAllowedExternalRequest = settingsActions.addAllowedExternalRequest = jest.fn(
    () => () => {}
  );
  mockCloseWalletRequest = walletLoaderActions.closeWalletRequest = jest.fn(
    () => () => {}
  );
  mockGetWalletPath = wallet.getWalletPath = jest.fn(() => testWalletPath);
  mockGetWalletPath = wallet.getWalletPath = jest.fn(() => testWalletPath);
  mockStart = dex.start = jest.fn(() => testServerAddr);
  mockStop = dex.stop = jest.fn(() => {});
  mockCheckInit = dex.checkInit = jest.fn(() => testCheckInitRes);
  mockInit = dex.init = jest.fn(() => {});
  mockExportSeed = dex.exportSeed = jest.fn(() => testSeed);
  mockUser = dex.user = jest.fn(() => testUser);
  mockLogin = dex.login = jest.fn(() => {});
  mockLogout = dex.logout = jest.fn(() => {});
  mockCreateWallet = dex.createWallet = jest.fn(() => {});
  mockLaunchWindow = dex.launchWindow = jest.fn(() => {});
  mockGetNextAccountAttempt = controlActions.getNextAccountAttempt = jest.fn(
    () => () => {}
  );
  mockSetWalletPassword = dex.setWalletPassword = jest.fn(() => {});
});

const testEnabledDex = async (initialState, expectedHostPort) => {
  const store = createStore(cloneDeep(initialState));

  await store.dispatch(dexActions.enableDex());
  expect(mockWalletCfgSet).toHaveBeenNthCalledWith(
    1,
    cfgConstants.DEXWALLET_RPCUSERNAME,
    testRandomString
  );
  expect(mockWalletCfgSet).toHaveBeenNthCalledWith(
    2,
    cfgConstants.DEXWALLET_RPCPASSWORD,
    testRandomString
  );
  expect(mockWalletCfgSet).toHaveBeenNthCalledWith(
    3,
    cfgConstants.DEXWALLET_HOSTPORT,
    expectedHostPort
  );
  expect(mockWalletCfgSet).toHaveBeenNthCalledWith(
    4,
    cfgConstants.ENABLE_DEX,
    true
  );

  expect(mockAddAllowedExternalRequest).toHaveBeenCalledWith(
    EXTERNALREQUEST_DEX
  );
  expect(mockCloseWalletRequest).toHaveBeenCalled();

  expect(store.getState().dex.enableDexAttempt).toBeFalsy();
  expect(store.getState().dex.enabledDex).toBeTruthy();
  expect(store.getState().dex.enabledError).toBeNull();
};

test("test enableDex on testnet", () => {
  testEnabledDex(initialState, TestNetParams.DefaultWalletRPCListener);
});

test("test enableDex on mainnet", () => {
  testEnabledDex(
    { ...initialState, settings: { currentSettings: { network: MAINNET } } },
    MainNetParams.DefaultWalletRPCListener
  );
});

test("enableDex fail", async () => {
  mockWalletCfgSet = jest.fn(() => {
    throw testError;
  });
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(dexActions.enableDex());
  expect(store.getState().dex.enableDexAttempt).toBeFalsy();
  expect(store.getState().dex.enabledDex).toBeFalsy();
  expect(store.getState().dex.enabledError).toBe(testError);
});

test("test start dex", async () => {
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(dexActions.startDex());

  expect(mockGetWalletPath).toHaveBeenCalled();
  expect(mockStart).toHaveBeenCalledWith(testWalletPath, true, testLocalName);
  expect(mockCheckInit).toHaveBeenCalled();
  expect(store.getState().dex.dexInit).toBe(testCheckInitRes);
  expect(store.getState().dex.dexServerAddress).toBe(testServerAddr);
  expect(store.getState().dex.active).toBe(true);
  expect(store.getState().dex.exists).toBe(true);
  expect(store.getState().dex.dexInitError).toBeNull();
  expect(store.getState().dex.client).toBeNull();
  // dexAccount stays the same, did not reset
  expect(store.getState().walletLoader.dexAccount).toBe(testDexAccountName);
});

test("test start dex - dex account not found", async () => {
  const store = createStore(
    cloneDeep({ ...initialState, walletLoader: { dexAccount: "undefined" } })
  );
  await store.dispatch(dexActions.startDex());

  expect(mockGetWalletPath).toHaveBeenCalled();
  expect(mockStart).toHaveBeenCalledWith(testWalletPath, true, testLocalName);
  expect(mockCheckInit).toHaveBeenCalled();
  expect(mockWalletCfgSet).toHaveBeenCalledWith(cfgConstants.DEX_ACCOUNT, null);
  expect(store.getState().dex.dexAccount).toBeNull();
  expect(store.getState().dex.dexInit).toBe(testCheckInitRes);
  expect(store.getState().dex.dexServerAddress).toBe(testServerAddr);
  expect(store.getState().dex.active).toBe(true);
  expect(store.getState().dex.exists).toBe(true);
  expect(store.getState().dex.dexInitError).toBeNull();
  expect(store.getState().dex.client).toBeNull();
});

test("test start dex - dex startup failed", async () => {
  mockWalletCfgSet = jest.fn(() => {
    throw testError;
  });
  const store = createStore(
    cloneDeep({ ...initialState, walletLoader: { dexAccount: "undefined" } })
  );
  await store.dispatch(dexActions.startDex());

  expect(mockGetWalletPath).toHaveBeenCalled();
  expect(mockStart).toHaveBeenCalledWith(testWalletPath, true, testLocalName);
  expect(mockCheckInit).toHaveBeenCalled();
  expect(mockWalletCfgSet).toHaveBeenCalledWith(cfgConstants.DEX_ACCOUNT, null);
  expect(store.getState().dex.dexAccount).toBe(null);
  expect(store.getState().dex.dexInit).toBe(testCheckInitRes);
  expect(store.getState().dex.dexServerAddress).toBe(testServerAddr);
  expect(store.getState().dex.active).toBe(true);
  expect(store.getState().dex.exists).toBe(true);
  expect(store.getState().dex.dexInitError).toBeNull();
  expect(store.getState().dex.client).toBeNull();
});

test("test start dex - check init failed", async () => {
  mockCheckInit = dex.checkInit = jest.fn(() => {
    throw testError;
  });
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(dexActions.startDex());

  expect(mockGetWalletPath).toHaveBeenCalled();
  expect(mockStart).toHaveBeenCalledWith(testWalletPath, true, testLocalName);
  expect(mockCheckInit).toHaveBeenCalled();
  expect(mockWalletCfgSet).not.toHaveBeenCalled();
  expect(store.getState().dex.dexAccount).toBe(undefined);
  expect(store.getState().dex.dexInit).toBeFalsy();
  expect(store.getState().dex.dexServerAddress).toBe(testServerAddr);
  expect(store.getState().dex.active).toBe(true);
  expect(store.getState().dex.exists).toBe(true);
  expect(store.getState().dex.dexInitError).toBe(testError);
  expect(store.getState().dex.client).toBeNull();
});

test("test stop dex", async () => {
  const store = createStore(
    cloneDeep({ ...initialState, dex: { active: true } })
  );
  await store.dispatch(dexActions.stopDex());

  expect(mockStop).toHaveBeenCalled();
});

test("test stop dex - dex not have started", async () => {
  const store = createStore(
    cloneDeep({ ...initialState, dex: { active: false } })
  );
  await store.dispatch(dexActions.stopDex());

  expect(mockStop).not.toHaveBeenCalled();
});

test("test init dex", async () => {
  const store = createStore(
    cloneDeep({ ...initialState, dex: { active: true } })
  );
  await store.dispatch(dexActions.initDex(testPassphrase, testSeed));

  expect(mockInit).toHaveBeenCalledWith(testPassphrase, testSeed);
  expect(store.getState().dex.dexInit).toBeTruthy();
  expect(store.getState().dex.loggedIn).toBeTruthy();
  expect(mockExportSeed).toHaveBeenCalledWith(testPassphrase);
  expect(store.getState().dex.dexSeed).toBe(
    "e3b71d75b73c69ae7b69fd397df7f47f6d1eeb47bde7cf7ad7beb871ae5af3c7b96bc6f7e7ad9ae9adb7e1bf3beb5db8f1beb96bcd39d7df1a7fde397dbedbe7beb869b734d1b71b73477a75e7fdf77db56bddbbf796da75fdf879c6f4dbadbd"
  );
  expect(store.getState().dex.exportSeedError).toBeNull();

  expect(mockUser).toHaveBeenCalled();
  expect(store.getState().dex.user).toBe(testUser);
  expect(store.getState().dex.userError).toBeNull();
});

test("test init dex - dex is not active", async () => {
  const store = createStore(
    cloneDeep({ ...initialState, dex: { active: false } })
  );
  await store.dispatch(dexActions.initDex(testPassphrase, testSeed));

  expect(mockInit).not.toHaveBeenCalled();
  expect(mockExportSeed).not.toHaveBeenCalled();
  expect(mockUser).not.toHaveBeenCalled();
  expect(store.getState().dex.active).toBeFalsy();
  expect(store.getState().dex.initError).toBe("Dex isn't active");
});

test("test user dex - dex is not active", async () => {
  const store = createStore(
    cloneDeep({ ...initialState, dex: { active: false } })
  );
  await store.dispatch(dexActions.userDex());

  expect(store.getState().dex.user).toBeNull();
  expect(store.getState().dex.userError).toBe("Dex isn't active");
});

test("test export seed - dex is not active", async () => {
  const store = createStore(
    cloneDeep({ ...initialState, dex: { active: false } })
  );
  await store.dispatch(dexActions.exportSeedDex(testPassphrase));

  expect(store.getState().dex.dexSeed).toBeNull();
  expect(store.getState().dex.exportSeedError).toBe("Dex isn't active");
});

test("test init dex - no need to export seed", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      dex: { active: true },
      walletLoader: { confirmDexSeed: "confirmDexSeed" }
    })
  );
  await store.dispatch(dexActions.initDex(testPassphrase, testSeed));

  expect(mockInit).toHaveBeenCalledWith(testPassphrase, testSeed);
  expect(store.getState().dex.dexInit).toBeTruthy();
  expect(store.getState().dex.loggedIn).toBeTruthy();
  expect(mockExportSeed).not.toHaveBeenCalled();
  expect(store.getState().dex.dexSeed).toBe(undefined);
  expect(store.getState().dex.exportSeedError).toBe(undefined);

  expect(mockUser).toHaveBeenCalled();
  expect(store.getState().dex.user).toBe(testUser);
  expect(store.getState().dex.userError).toBeNull();
});

test("test login dex", async () => {
  const store = createStore(
    cloneDeep({ ...initialState, dex: { active: true } })
  );
  await store.dispatch(dexActions.loginDex(testPassphrase));

  expect(mockLogin).toHaveBeenCalledWith(testPassphrase);
  expect(store.getState().dex.dexInit).toBe(undefined);
  expect(store.getState().dex.loggedIn).toBeTruthy();
  expect(mockExportSeed).toHaveBeenCalledWith(testPassphrase);
  expect(store.getState().dex.dexSeed).toBe(
    "e3b71d75b73c69ae7b69fd397df7f47f6d1eeb47bde7cf7ad7beb871ae5af3c7b96bc6f7e7ad9ae9adb7e1bf3beb5db8f1beb96bcd39d7df1a7fde397dbedbe7beb869b734d1b71b73477a75e7fdf77db56bddbbf796da75fdf879c6f4dbadbd"
  );
  expect(store.getState().dex.exportSeedError).toBeNull();

  expect(mockUser).toHaveBeenCalled();
  expect(store.getState().dex.user).toBe(testUser);
  expect(store.getState().dex.userError).toBeNull();
});

test("test init dex - dex is not active", async () => {
  const store = createStore(
    cloneDeep({ ...initialState, dex: { active: false } })
  );
  await store.dispatch(dexActions.loginDex(testPassphrase));

  expect(mockLogin).not.toHaveBeenCalled();
  expect(mockExportSeed).not.toHaveBeenCalled();
  expect(mockUser).not.toHaveBeenCalled();
  expect(store.getState().dex.active).toBeFalsy();
  expect(store.getState().dex.initError).toBe(undefined);
  expect(store.getState().dex.loginError).toBe("Dex isn't active");
});

test("test init dex - no need to export seed", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      dex: { active: true },
      walletLoader: { confirmDexSeed: "confirmDexSeed" }
    })
  );
  await store.dispatch(dexActions.loginDex(testPassphrase));

  expect(mockLogin).toHaveBeenCalledWith(testPassphrase);
  expect(store.getState().dex.dexInit).toBe(undefined);
  expect(store.getState().dex.loggedIn).toBeTruthy();
  expect(mockExportSeed).not.toHaveBeenCalled();
  expect(store.getState().dex.dexSeed).toBe(undefined);
  expect(store.getState().dex.exportSeedError).toBe(undefined);

  expect(mockUser).toHaveBeenCalled();
  expect(store.getState().dex.user).toBe(testUser);
  expect(store.getState().dex.userError).toBeNull();
});

test("test logout dex", () => {
  dexActions.logoutDex();
  expect(mockLogout).toHaveBeenCalled();
});

test("test confirming seed", async () => {
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(dexActions.confirmDexSeed());

  expect(mockWalletCfgSet).toHaveBeenCalledWith(
    cfgConstants.CONFIRM_DEX_SEED,
    true
  );

  expect(store.getState().dex.confirmSeedError).toBeNull();
  expect(store.getState().dex.dexSeed).toBeNull();
});

test("test confirming seed failed", async () => {
  mockWalletCfgSet = jest.fn(() => {
    throw testError;
  });
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(dexActions.confirmDexSeed());

  expect(mockWalletCfgSet).toHaveBeenCalledWith(
    cfgConstants.CONFIRM_DEX_SEED,
    true
  );

  expect(store.getState().dex.confirmSeedError).toBe(testError);
  expect(store.getState().dex.dexSeed).toBeNull();
});

test("test creating dex wallet", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      dex: { active: true },
      walletLoader: { dexRpcSettings: testDexRpcSettings }
    })
  );
  await store.dispatch(
    dexActions.createWalletDex(
      testPassphrase,
      testAppPassphrase,
      testDexAccountName
    )
  );

  expect(mockCreateWallet).toHaveBeenCalledWith(
    42 /*DCR asset id*/,
    "dcrwalletRPC" /* walletType */,
    testPassphrase,
    testAppPassphrase,
    testDexAccountName,
    testDexRpcSettings.rpcUser,
    testDexRpcSettings.rpcPass,
    testDexRpcSettings.rpcListen,
    testDexRpcSettings.rpcCert
  );

  expect(store.getState().dex.createWalletError).toBeNull();

  expect(mockUser).toHaveBeenCalled();
  expect(store.getState().dex.user).toBe(testUser);
  expect(store.getState().dex.userError).toBeNull();
});

test("test creating dex wallet - dex is not active", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      dex: { active: false },
      walletLoader: { dexRpcSettings: testDexRpcSettings }
    })
  );
  await store.dispatch(
    dexActions.createWalletDex(
      testPassphrase,
      testAppPassphrase,
      testDexAccountName
    )
  );

  expect(mockUser).not.toHaveBeenCalled();
  expect(store.getState().dex.active).toBeFalsy();
  expect(store.getState().dex.createWalletError).toBe("Dex isn't active");
});

test("test launching dex window", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      dex: { active: true },
      walletLoader: { dexReady: false }
    })
  );
  await store.dispatch(dexActions.launchDexWindow());

  expect(mockLaunchWindow).toHaveBeenCalled();
  expect(store.getState().walletLoader.dexReady).toBeTruthy();
  expect(store.getState().dex.launchWindow).toBeTruthy();
  expect(store.getState().dex.launchWindowError).toBeNull();
  expect(mockWalletCfgSet).toHaveBeenCalledWith(cfgConstants.DEX_READY, true);
});

test("test launching dex window - dex is not active", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      dex: { active: false }
    })
  );
  await store.dispatch(dexActions.launchDexWindow());

  expect(mockLaunchWindow).not.toHaveBeenCalled();
  expect(store.getState().dex.launchWindow).toBeFalsy();
  expect(store.getState().dex.launchWindowError).toBe("Dex isn't active");
  expect(mockWalletCfgSet).not.toHaveBeenCalled();
});

test("test launching dex window - save to config failed", async () => {
  mockWalletCfgSet = jest.fn(() => {
    throw testError;
  });
  const store = createStore(
    cloneDeep({
      ...initialState,
      dex: { active: true }
    })
  );
  await store.dispatch(dexActions.launchDexWindow());

  expect(mockLaunchWindow).toHaveBeenCalled();
  expect(store.getState().dex.launchWindow).toBeFalsy();
  expect(store.getState().dex.launchWindowError).toBe(testError);
});

test("test launching dex window - dex is already ready", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      dex: { active: true },
      walletLoader: { dexReady: true }
    })
  );
  await store.dispatch(dexActions.launchDexWindow());

  expect(mockLaunchWindow).toHaveBeenCalled();
  expect(store.getState().walletLoader.dexReady).toBeTruthy();
  expect(store.getState().dex.launchWindow).toBeTruthy();
  expect(store.getState().dex.launchWindowError).toBeNull();
  expect(mockWalletCfgSet).not.toHaveBeenCalled();
});

test("test creating dex account", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      dex: { active: false }
    })
  );
  await store.dispatch(
    dexActions.createDexAccount(testPassphrase, testDexAccountName)
  );

  expect(mockGetNextAccountAttempt).toHaveBeenCalledWith(
    testPassphrase,
    testDexAccountName
  );
  expect(mockWalletCfgSet).toHaveBeenCalledWith(
    cfgConstants.DEX_ACCOUNT,
    testDexAccountName
  );
  expect(store.getState().dex.dexAccount).toBe(testDexAccountName);
  expect(store.getState().dex.dexAccountError).toBeNull();
});

test("test creating dex account failed", async () => {
  mockGetNextAccountAttempt = controlActions.getNextAccountAttempt = jest.fn(
    () => () => Promise.reject(testError)
  );
  const store = createStore(
    cloneDeep({
      ...initialState,
      dex: { active: false }
    })
  );
  await store.dispatch(
    dexActions.createDexAccount(testPassphrase, testDexAccountName)
  );

  expect(mockWalletCfgSet).not.toHaveBeenCalled();
  expect(store.getState().dex.dexAccount).toBeNull();
  expect(store.getState().dex.dexAccountError).toBe(testError);
});

test("test selecting dex account", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      dex: { active: true }
    })
  );
  await store.dispatch(dexActions.selectDexAccount(testDexAccountName));

  expect(mockWalletCfgSet).toHaveBeenCalledWith(
    cfgConstants.DEX_ACCOUNT,
    testDexAccountName
  );
  expect(store.getState().dex.dexAccount).toBe(testDexAccountName);
  expect(store.getState().dex.dexSelectAccountError).toBeNull();
});

test("test selecting dex account - failed", async () => {
  mockWalletCfgSet = jest.fn(() => {
    throw testError;
  });
  const store = createStore(
    cloneDeep({
      ...initialState,
      dex: { active: true }
    })
  );
  await store.dispatch(dexActions.selectDexAccount(testDexAccountName));

  expect(mockWalletCfgSet).toHaveBeenCalledWith(
    cfgConstants.DEX_ACCOUNT,
    testDexAccountName
  );
  expect(store.getState().dex.dexAccount).toBe(testDexAccountName);
  expect(store.getState().dex.dexSelectAccountError).toBe(testError);
});

test("test setWalletPasswordDex", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      dex: { active: true }
    })
  );
  await store.dispatch(
    dexActions.setWalletPasswordDex(testPassphrase, testAppPassphrase)
  );

  expect(mockSetWalletPassword).toHaveBeenCalledWith(
    42, // assetID DCR
    testPassphrase,
    testAppPassphrase
  );

  expect(store.getState().dex.setWalletPasswordAttempt).toBeFalsy();
  expect(store.getState().dex.setWalletPasswordError).toBeNull();
});

test("test setWalletPasswordDex - failed", async () => {
  mockSetWalletPassword = dex.setWalletPassword = jest.fn(() => {
    throw testError;
  });
  const store = createStore(
    cloneDeep({
      ...initialState,
      dex: { active: true }
    })
  );
  await store.dispatch(
    dexActions.setWalletPasswordDex(testPassphrase, testAppPassphrase)
  );

  expect(mockSetWalletPassword).toHaveBeenCalledWith(
    42, // assetID DCR
    testPassphrase,
    testAppPassphrase
  );

  expect(store.getState().dex.setWalletPasswordAttempt).toBeFalsy();
  expect(store.getState().dex.setWalletPasswordError).toBe(testError);
});

test("test setWalletPasswordDex - dex is not active", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      dex: { active: false }
    })
  );
  await store.dispatch(
    dexActions.setWalletPasswordDex(testPassphrase, testAppPassphrase)
  );

  expect(mockSetWalletPassword).not.toHaveBeenCalled();

  expect(store.getState().dex.setWalletPasswordAttempt).toBeFalsy();
  expect(store.getState().dex.setWalletPasswordError).toBe("Dex isn't active");
});
