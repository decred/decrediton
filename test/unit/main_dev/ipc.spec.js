import os from "os";
import fs from "fs";
import * as c from "../../../app/config";
import * as i from "../../../app/main_dev/ipc";
import * as lau from "../../../app/main_dev/launch";
import { TESTNET, MAINNET } from "constants";
import * as cfgConstants from "constants/config";
import { wait } from "@testing-library/react";
import { DEX_LOCALPAGE } from "../../../app/main_dev/externalRequests";

jest.mock("fs");

const config = c;
const ipc = i;
const launch = lau;

const testHomeDir = "/home/testUser";
const testWalletName = "test-wallet-name";
const testResourcePath = "/test-resource-path";
const testError = "test-error";
const testBasePathMainnet = `${testHomeDir}/.config/decrediton/wallets/${MAINNET}`;
const testBasePathTestnet = `${testHomeDir}/.config/decrediton/wallets/${TESTNET}`;
const testWalletDirectories = ["dir1", "dir2", "file1"];
const testWalletConfigs = {
  [testWalletDirectories[0]]: {
    [cfgConstants.LAST_ACCESS]: `test-last-access-${testWalletDirectories[0]}`,
    [cfgConstants.IS_WATCH_ONLY]: `test-is-watching-only-${testWalletDirectories[0]}`,
    [cfgConstants.TREZOR]: `test-trezor-${testWalletDirectories[0]}`,
    [cfgConstants.MIXED_ACCOUNT_CFG]: `test-mixed-account-cfg-${testWalletDirectories[0]}`
  },
  [testWalletDirectories[1]]: {
    [cfgConstants.LAST_ACCESS]: `test-last-access-${testWalletDirectories[1]}`,
    [cfgConstants.IS_WATCH_ONLY]: `test-is-watching-only-${testWalletDirectories[1]}`,
    [cfgConstants.TREZOR]: `test-trezor-${testWalletDirectories[1]}`,
    [cfgConstants.MIXED_ACCOUNT_CFG]: `test-mixed-account-cfg-${testWalletDirectories[1]}`
  }
};
const testDcrdPath = `${testHomeDir}/.dcrd`;
const testReactIPC = "test-react-IPC";
const testMainWindow = "test-mainWindow";
const testDaemonIsAdvanced = "test-daemonIsAdvanced";
const testTestnet = "test-testnet";
const testWalletPath = "test-walletPath";
const testRpcUser = "test-rpcUser";
const testRpcPass = "test-rpcPass";
const testRpcHost = "test-rpcHost";
const testRpcListen = "test-rpcListen";
const testGapLimit = "test-gapLimit";
const testDisableCoinTypeUpgrades = "test-disableCoinTypeUpgrades";

const testWalletAccount = "test-walletAccount";
const testWalletPort = "test-walletPort";
const testRpcCreds = "test-rpcCreds";
const testAutopilotEnabled = "test-autopilotEnabled";
const testDcrlndCreds = { key: "test-dcrlndCreds" };
const testLocale = "test-locale";
const testPassphrase = "test-passphrase";
const testSeed = "test-seed";

const testAssetID = "test-assetID";
const testWalletType = "test-walletType";
const testAppPassphrase = "test-appPassphrase";
const testAccount = "test-account";
const testRpcuser = "test-rpcuser";
const testRpcpass = "test-rpcpass";
const testRpclisten = "test-rpclisten";
const testRpccert = "test-rpccert";

const testDcrlndPath = `${testBasePathMainnet}/${testWalletName}/dcrlnd`;
const testMTime = "test-mtime";

let mockMkdirSync;
let mockInitWalletCfg;
let mockNewWalletConfigCreation;
let mockReaddirSync;
let mockStatSync;
let mockExistsSync;
let mockIsDirectory;
let mockGetWalletCfg;
let mockRmSync;
let mockLaunchDCRD;
let mockSetDcrdRpcCredentials;
let mockLaunchDCRWallet;
let mockGetDcrwPID;
let mockCheckNoLegacyWalletConfig;
let mockLaunchDCRLnd;
let mockGetDcrlndPID;
let mockGetDcrlndCreds;
let mockGetDexPID;
let mockLaunchDex;
let mockInitCheckDex;
let mockInitDexCall;
let mockLoginDexCall;
let mockExportSeedDexCall;
let mockLogoutDexCall;
let mockCreateWalletDexCall;
let mockSetWalletPasswordDexCall;
let mockUserDexCall;
let mockCloseDCRD;
let mockCloseDCRW;
let mockCloseDcrlnd;
let mockCloseDex;
let mockWalletCfgSet;

beforeEach(() => {
  jest.spyOn(os, "homedir").mockImplementation(() => testHomeDir);
  Object.defineProperty(process, "platform", {
    value: "linux"
  });
  Object.defineProperty(process, "resourcesPath", {
    value: testResourcePath
  });
  Object.defineProperty(process, "env", {
    value: {
      NODE_ENV: "not-development"
    }
  });
  mockMkdirSync = fs.mkdirSync = jest.fn(() => {});
  mockInitWalletCfg = config.initWalletCfg = jest.fn(() => {});
  mockNewWalletConfigCreation = config.newWalletConfigCreation = jest.fn(
    () => {}
  );
  mockReaddirSync = fs.readdirSync = jest.fn((dir) => {
    if (dir === testBasePathMainnet || dir === testBasePathTestnet) {
      return testWalletDirectories;
    } else {
      console.error("unknown path: " + { dir });
    }
  });
  mockStatSync = fs.statSync = jest.fn((dir) => ({
    isDirectory: (mockIsDirectory = jest.fn(() => /dir/.test(dir))),
    mtime: testMTime
  }));
  mockWalletCfgSet = jest.fn(() => {});
  mockGetWalletCfg = config.getWalletCfg = jest.fn((_, wallet) => ({
    set: mockWalletCfgSet,
    get: jest.fn((configKey) => testWalletConfigs[wallet][configKey])
  }));
  mockExistsSync = fs.existsSync = jest.fn((path) => {
    // dir1 wallet is finished
    if (/dir1/.test(path)) {
      return true;
    } else {
      return false;
    }
  });
  mockRmSync = fs.rmSync = jest.fn(() => {});
  mockLaunchDCRD = launch.launchDCRD = jest.fn(() => Promise.resolve());
  mockSetDcrdRpcCredentials = launch.setDcrdRpcCredentials = jest.fn(() => {});
  mockLaunchDCRWallet = launch.launchDCRWallet = jest.fn(() => {});
  mockCheckNoLegacyWalletConfig = config.checkNoLegacyWalletConfig = jest.fn(
    () => {}
  );
  mockGetDcrwPID = launch.GetDcrwPID = jest.fn(() => null);
  mockLaunchDCRLnd = launch.launchDCRLnd = jest.fn(
    () =>
      new Promise((resolve) => {
        resolve(testDcrlndCreds);
      })
  );
  mockGetDcrlndPID = launch.GetDcrlndPID = jest.fn(() => {});
  mockGetDcrlndCreds = launch.GetDcrlndCreds = jest.fn(() => testDcrlndCreds);
  mockLaunchDex = launch.launchDex = jest.fn(() => DEX_LOCALPAGE);
  mockGetDexPID = launch.GetDexPID = jest.fn(() => null);
  mockInitCheckDex = launch.initCheckDex = jest.fn(() => {});
  mockLoginDexCall = launch.loginDexCall = jest.fn(() => {});
  mockExportSeedDexCall = launch.exportSeedDexCall = jest.fn(() => {});
  mockLogoutDexCall = launch.logoutDexCall = jest.fn(() => {});
  mockInitDexCall = launch.initDexCall = jest.fn(() => {});
  mockSetWalletPasswordDexCall = launch.setWalletPasswordDexCall = jest.fn(
    () => {}
  );
  mockUserDexCall = launch.userDexCall = jest.fn(() => {});
  mockCreateWalletDexCall = launch.createWalletDexCall = jest.fn(() => {});
  mockCloseDCRD = launch.closeDCRD = jest.fn(() => true);
  mockCloseDCRW = launch.closeDCRW = jest.fn(() => true);
  mockCloseDcrlnd = launch.closeDcrlnd = jest.fn(() => true);
  mockCloseDex = launch.closeDex = jest.fn(() => true);
});

const testGetAvailableWallets = (network) => {
  const res = ipc.getAvailableWallets(network);
  const testBasePath =
    network === TESTNET ? testBasePathTestnet : testBasePathMainnet;
  expect(mockReaddirSync).toHaveBeenCalledWith(testBasePath);
  expect(mockStatSync).toHaveBeenNthCalledWith(
    1,
    `${testBasePath}/${testWalletDirectories[0]}`
  );
  expect(mockStatSync).toHaveBeenNthCalledWith(
    2,
    `${testBasePath}/${testWalletDirectories[1]}`
  );
  expect(mockStatSync).toHaveBeenNthCalledWith(
    3,
    `${testBasePath}/${testWalletDirectories[2]}`
  );
  expect(mockIsDirectory).toHaveBeenCalled();

  expect(mockGetWalletCfg).toHaveBeenNthCalledWith(
    1,
    network === TESTNET,
    testWalletDirectories[0]
  );
  expect(mockGetWalletCfg).toHaveBeenNthCalledWith(
    2,
    network === TESTNET,
    testWalletDirectories[1]
  );
  // there is no third call, since 'file1' is a file

  expect(mockExistsSync).toHaveBeenNthCalledWith(
    1,
    `${testBasePath}/${testWalletDirectories[0]}/${
      network === TESTNET ? "testnet3" : network
    }/wallet.db`
  );
  expect(mockExistsSync).toHaveBeenNthCalledWith(
    2,
    `${testBasePath}/${testWalletDirectories[1]}/${
      network === TESTNET ? "testnet3" : network
    }/wallet.db`
  );

  expect(res).toStrictEqual([
    {
      displayWalletGradient: undefined,
      isLN: undefined,
      network: network,
      wallet: "dir1",
      finished: true,
      lastAccess: "test-last-access-dir1",
      isWatchingOnly: "test-is-watching-only-dir1",
      isTrezor: "test-trezor-dir1",
      isPrivacy: "test-mixed-account-cfg-dir1"
    },
    {
      displayWalletGradient: undefined,
      isLN: undefined,
      network: network,
      wallet: "dir2",
      finished: false,
      lastAccess: "test-last-access-dir2",
      isWatchingOnly: "test-is-watching-only-dir2",
      isTrezor: "test-trezor-dir2",
      isPrivacy: "test-mixed-account-cfg-dir2"
    }
  ]);
};

test("test getAvailableWallets - on mainnet", () => {
  testGetAvailableWallets(MAINNET);
});

test("test getAvailableWallets - on testnet", () => {
  testGetAvailableWallets(TESTNET);
});

const testDeleteDaemon = (isTestnet) => {
  const network = isTestnet ? `${TESTNET}3` : MAINNET;
  mockExistsSync = fs.existsSync = jest.fn(() => true);
  let res = ipc.deleteDaemon(null, isTestnet);
  expect(res).toBeTruthy();
  expect(mockExistsSync).toHaveBeenCalledWith(
    `${testDcrdPath}/data/${network}`
  );

  expect(mockRmSync).toHaveBeenCalledWith(`${testDcrdPath}/data/${network}`, {
    force: true,
    recursive: true,
    maxRetries: 30
  });

  /* call custom appdata parameter, that not exists */

  mockExistsSync.mockClear();
  mockRmSync.mockClear();
  const testAppData = "test-app-data";
  res = ipc.deleteDaemon(testAppData, isTestnet);
  expect(res).toBeTruthy();
  expect(mockExistsSync).toHaveBeenCalledWith(`${testAppData}/data/${network}`);

  expect(mockRmSync).toHaveBeenCalledWith(`${testAppData}/data/${network}`, {
    force: true,
    recursive: true,
    maxRetries: 30
  });
};

test("test deleteDaemon - on mainnet", () => {
  testDeleteDaemon();
});

test("test deleteDaemon - on testnet", () => {
  testDeleteDaemon(true);
});

test("test deleteDaemon - dir does not exists", () => {
  mockExistsSync = fs.existsSync = jest.fn(() => false);
  const res = ipc.deleteDaemon();
  expect(res).toBeTruthy();
  expect(mockExistsSync).toHaveBeenCalled();
  expect(mockRmSync).not.toHaveBeenCalled();
});

test("test deleteDaemon - failed to delete dir", () => {
  mockExistsSync = fs.existsSync = jest.fn(() => true);
  mockRmSync = fs.rmSync = jest.fn(() => {
    throw testError;
  });
  const res = ipc.deleteDaemon();
  expect(res).toBeFalsy();
  expect(mockExistsSync).toHaveBeenCalled();
  expect(mockRmSync).toHaveBeenCalled();
});

test("test startDaemon", async () => {
  await ipc.startDaemon(null, false, testReactIPC);
  expect(mockLaunchDCRD).toHaveBeenCalledWith(testReactIPC, false, null);

  /* call with custom appdata */
  mockLaunchDCRD.mockClear();
  let testParams = {
    appdata: "test-app-data"
  };
  await ipc.startDaemon(testParams, true, testReactIPC);
  await wait(() =>
    expect(mockLaunchDCRD).toHaveBeenCalledWith(
      testReactIPC,
      true,
      testParams.appdata
    )
  );

  /* call with custom rpcCreds */
  mockLaunchDCRD.mockClear();
  testParams = {
    rpcCreds: "test-rpcCreds"
  };
  let res = await ipc.startDaemon(testParams, false, testReactIPC);
  expect(res).toBe(testParams.rpcCreds);
  expect(mockLaunchDCRD).not.toHaveBeenCalled();
  expect(mockSetDcrdRpcCredentials).toHaveBeenCalled();

  /* call with custom rpcCreds again, skipping restart of daemon as it is connected as remote */
  mockLaunchDCRD.mockClear();
  mockSetDcrdRpcCredentials.mockClear();
  testParams = {
    rpcCreds: "test-rpcCreds"
  };
  res = await ipc.startDaemon(testParams, false, testReactIPC);
  expect(res).toBe(undefined);
  expect(mockLaunchDCRD).not.toHaveBeenCalled();
  expect(mockSetDcrdRpcCredentials).not.toHaveBeenCalled();

  /* try to stop daemon, but it fails. still skipping restarting */
  mockCloseDCRD = launch.closeDCRD = jest.fn(() => false);
  res = ipc.stopDaemon();
  expect(mockCloseDCRD).toHaveBeenCalled();
  expect(res).toBeFalsy();

  mockLaunchDCRD.mockClear();
  mockSetDcrdRpcCredentials.mockClear();
  testParams = {
    rpcCreds: "test-rpcCreds"
  };
  res = await ipc.startDaemon(testParams, false, testReactIPC);
  expect(res).toBe(undefined);
  expect(mockLaunchDCRD).not.toHaveBeenCalled();
  expect(mockSetDcrdRpcCredentials).not.toHaveBeenCalled();

  /* stop daemon */
  mockCloseDCRD = launch.closeDCRD = jest.fn(() => true);
  let catchedError;
  res = ipc.stopDaemon();
  expect(res).toBeTruthy();

  // try to start again. dcrdIsRemote should be false now.
  // launchDCRD will be rejected
  mockLaunchDCRD = launch.launchDCRD = jest.fn(
    () => new Promise((_, reject) => reject(testError))
  );
  try {
    res = await ipc.startDaemon(null, false, testReactIPC);
  } catch (error) {
    catchedError = error;
  }
  expect(mockLaunchDCRD).toHaveBeenCalledWith(testReactIPC, false, null);
  await wait(() => expect(catchedError).toBe(testError));
});

const testCreateWallet = (network) => {
  /* wallet not exists yet */
  mockExistsSync = fs.existsSync = jest.fn(() => false);
  const res = ipc.createWallet(network === TESTNET, testWalletName);
  expect(res).toBeTruthy();
  expect(mockMkdirSync).toHaveBeenCalledWith(
    `${
      network === TESTNET ? testBasePathTestnet : testBasePathMainnet
    }/${testWalletName}`,
    { recursive: true }
  );
  expect(mockInitWalletCfg).toHaveBeenCalled();
  expect(mockNewWalletConfigCreation).toHaveBeenCalled();

  /* wallet exists now */
  mockMkdirSync.mockClear();
  mockInitWalletCfg.mockClear();
  mockNewWalletConfigCreation.mockClear();
  mockExistsSync = fs.existsSync = jest.fn(() => true);
  ipc.createWallet(false, testWalletName);
  expect(res).toBeTruthy();
  expect(mockMkdirSync).not.toHaveBeenCalled();
  expect(mockInitWalletCfg).not.toHaveBeenCalled();
  expect(mockNewWalletConfigCreation).not.toHaveBeenCalled();
};

test("test createWallet - on mainnet", () => {
  testCreateWallet(MAINNET);
});

test("test createWallet - on testnet", () => {
  testCreateWallet(TESTNET);
});

test("test createWallet - failed to init wallet config", () => {
  mockInitWalletCfg = config.initWalletCfg = jest.fn(() => {
    throw testError;
  });
  mockExistsSync = fs.existsSync = jest.fn(() => false);
  const res = ipc.createWallet(false, testWalletName);
  expect(res).toBeFalsy();
  expect(mockMkdirSync).toHaveBeenCalledWith(
    `${testBasePathMainnet}/${testWalletName}`,
    { recursive: true }
  );
  expect(mockInitWalletCfg).toHaveBeenCalled();
  expect(mockNewWalletConfigCreation).not.toHaveBeenCalled();
});

const testRemoveWallet = (network) => {
  /* wallet exists */
  mockExistsSync = fs.existsSync = jest.fn(() => true);
  let res = ipc.removeWallet(network === TESTNET, testWalletName);
  expect(res).toBeTruthy();
  expect(mockRmSync).toHaveBeenCalledWith(
    `${
      network === TESTNET ? testBasePathTestnet : testBasePathMainnet
    }/${testWalletName}`,
    {
      force: true,
      recursive: true,
      maxRetries: 30
    }
  );

  /* wallet does not exist now */
  mockRmSync.mockClear();
  mockExistsSync = fs.existsSync = jest.fn(() => false);
  res = ipc.removeWallet(false, testWalletName);
  expect(res).toBeFalsy();
  expect(mockRmSync).not.toHaveBeenCalled();

  /* undefined wallet path */
  mockExistsSync.mockClear();
  mockRmSync.mockClear();
  ipc.removeWallet(false);
  expect(mockExistsSync).not.toHaveBeenCalled();
  expect(mockRmSync).not.toHaveBeenCalled();

  /* empty wallet path */
  mockExistsSync.mockClear();
  mockRmSync.mockClear();
  ipc.removeWallet(false, "");
  expect(mockExistsSync).not.toHaveBeenCalled();
  expect(mockRmSync).not.toHaveBeenCalled();
};

test("test removeWallet - on mainnet", () => {
  testRemoveWallet(MAINNET);
});

test("test removeWallet - on testnet", () => {
  testRemoveWallet(TESTNET);
});

test("test removeWallet - failed to delete wallet directory", () => {
  mockRmSync = fs.rmSync = jest.fn(() => {
    throw testError;
  });
  mockExistsSync = fs.existsSync = jest.fn(() => true);
  const res = ipc.removeWallet(false, testWalletName);
  expect(res).toBeFalsy();
  expect(mockRmSync).toHaveBeenCalled();
});

test("test startWallet", () => {
  ipc.startWallet(
    testMainWindow,
    testDaemonIsAdvanced,
    testTestnet,
    testWalletPath,
    testReactIPC,
    testRpcUser,
    testRpcPass,
    testRpcHost,
    testRpcListen,
    testGapLimit,
    testDisableCoinTypeUpgrades
  );

  expect(mockGetDcrwPID).toHaveBeenCalled();
  expect(mockInitWalletCfg).toHaveBeenCalledWith(testTestnet, testWalletPath);
  expect(mockCheckNoLegacyWalletConfig).toHaveBeenCalledWith(
    testTestnet,
    testWalletPath,
    testRpcUser && testRpcPass && testRpcHost && testRpcListen
  );
  expect(mockLaunchDCRWallet).toHaveBeenCalledWith(
    testMainWindow,
    testDaemonIsAdvanced,
    testWalletPath,
    testTestnet,
    testReactIPC,
    testRpcUser,
    testRpcPass,
    testRpcHost,
    testRpcListen,
    testGapLimit,
    testDisableCoinTypeUpgrades
  );
});

test("test startWallet - wallet already started", () => {
  mockGetDcrwPID = launch.GetDcrwPID = jest.fn(() => 122);
  ipc.startWallet(
    testMainWindow,
    testDaemonIsAdvanced,
    testTestnet,
    testWalletPath,
    testReactIPC,
    testRpcUser,
    testRpcPass,
    testRpcHost,
    testRpcListen,
    testGapLimit,
    testDisableCoinTypeUpgrades
  );

  expect(mockGetDcrwPID).toHaveBeenCalled();
  expect(mockInitWalletCfg).not.toHaveBeenCalled();
  expect(mockCheckNoLegacyWalletConfig).not.toHaveBeenCalled();
  expect(mockLaunchDCRWallet).not.toHaveBeenCalled();
});

test("test startWallet - failed", async () => {
  mockLaunchDCRWallet = launch.launchDCRWallet = jest.fn(() => {
    throw testError;
  });
  let catchedError;
  try {
    await ipc.startWallet(
      testMainWindow,
      testDaemonIsAdvanced,
      testTestnet,
      testWalletPath,
      testReactIPC,
      testRpcUser,
      testRpcPass,
      testRpcHost,
      testRpcListen,
      testGapLimit,
      testDisableCoinTypeUpgrades
    );
  } catch (error) {
    catchedError = error;
  }
  expect(catchedError).toBe(testError);
  expect(mockGetDcrwPID).toHaveBeenCalled();
  expect(mockInitWalletCfg).toHaveBeenCalled();
  expect(mockCheckNoLegacyWalletConfig).toHaveBeenCalled();
  expect(mockLaunchDCRWallet).toHaveBeenCalled();
});

test("test startDcrlnd", async () => {
  const res = await ipc.startDcrlnd(
    testWalletAccount,
    testWalletPort,
    testRpcCreds,
    testWalletPath,
    testTestnet,
    testAutopilotEnabled
  );

  expect(mockGetDcrlndPID).toHaveBeenCalled();
  expect(mockGetDcrlndCreds).not.toHaveBeenCalled();
  expect(mockLaunchDCRLnd).toHaveBeenCalledWith(
    testWalletAccount,
    testWalletPort,
    testRpcCreds,
    testWalletPath,
    testTestnet,
    testAutopilotEnabled
  );
  expect(res).toBe(testDcrlndCreds);
});

test("test startDcrlnd - dcrlnd already started", async () => {
  mockGetDcrlndPID = launch.GetDcrlndPID = jest.fn(() => 1);
  const res = await ipc.startDcrlnd(
    testWalletAccount,
    testWalletPort,
    testRpcCreds,
    testWalletPath,
    testTestnet,
    testAutopilotEnabled
  );

  expect(mockGetDcrlndPID).toHaveBeenCalled();
  expect(mockGetDcrlndCreds).toHaveBeenCalled();
  expect(mockLaunchDCRLnd).not.toHaveBeenCalledWith(
    testWalletAccount,
    testWalletPort,
    testRpcCreds,
    testWalletPath,
    testTestnet,
    testAutopilotEnabled
  );
  expect(res).toStrictEqual({ ...testDcrlndCreds, wasRunning: true });
});

test("test startWallet - failed", async () => {
  mockLaunchDCRLnd = launch.launchDCRLnd = jest.fn(
    () =>
      new Promise((_, reject) => {
        reject(testError);
      })
  );
  const res = await ipc.startDcrlnd(
    testWalletAccount,
    testWalletPort,
    testRpcCreds,
    testWalletPath,
    testTestnet,
    testAutopilotEnabled
  );
  expect(res).toBe(testError);
  expect(mockGetDcrlndPID).toHaveBeenCalled();
  expect(mockGetDcrlndCreds).not.toHaveBeenCalled();
  expect(mockLaunchDCRLnd).toHaveBeenCalled();
});

test("test startDex", () => {
  const res = ipc.startDex(testWalletPath, testTestnet, testLocale);

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockLaunchDex).toHaveBeenCalledWith(
    testWalletPath,
    testTestnet,
    testLocale
  );
  expect(res).toBe(DEX_LOCALPAGE);
});

test("test startDex - dex already started", () => {
  mockGetDexPID = launch.GetDexPID = jest.fn(() => 234);
  const res = ipc.startDex(testWalletPath, testTestnet, testLocale);

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockLaunchDex).not.toHaveBeenCalled();
  expect(res).toBe(DEX_LOCALPAGE);
});

test("test startDex - failed", () => {
  mockLaunchDex = launch.launchDex = jest.fn(() => {
    throw testError;
  });

  const res = ipc.startDex(testWalletPath, testTestnet, testLocale);

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockLaunchDex).toHaveBeenCalled();
  expect(res).toBe(testError);
});

test("test checkInitDex", async () => {
  mockGetDexPID = launch.GetDexPID = jest.fn(() => 234);
  await ipc.checkInitDex();

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockInitCheckDex).toHaveBeenCalled();
});

test("test checkInitDex - dex already started", async () => {
  mockGetDexPID = launch.GetDexPID = jest.fn(() => null);
  await ipc.checkInitDex();

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockInitCheckDex).not.toHaveBeenCalled();
});

test("test checkInitDex - failed", async () => {
  mockGetDexPID = launch.GetDexPID = jest.fn(() => 234);
  mockInitCheckDex = launch.initCheckDex = jest.fn(() => {
    throw testError;
  });

  const res = await ipc.checkInitDex();

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockInitCheckDex).toHaveBeenCalled();
  expect(res).toBe(testError);
});

test("test initDex", async () => {
  mockGetDexPID = launch.GetDexPID = jest.fn(() => 234);
  await ipc.initDex(testPassphrase, testSeed);

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockInitDexCall).toHaveBeenCalledWith(testPassphrase, testSeed);
});

test("test initDex - dex already started", async () => {
  mockGetDexPID = launch.GetDexPID = jest.fn(() => null);
  await ipc.initDex(testPassphrase, testSeed);

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockInitDexCall).not.toHaveBeenCalled();
});

test("test initDex - failed", async () => {
  mockGetDexPID = launch.GetDexPID = jest.fn(() => 234);
  mockInitDexCall = launch.initDexCall = jest.fn(() => {
    throw testError;
  });

  const res = await ipc.initDex(testPassphrase, testSeed);

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockInitDexCall).toHaveBeenCalled();
  expect(res).toBe(testError);
});

test("test loginDex", async () => {
  mockGetDexPID = launch.GetDexPID = jest.fn(() => 234);
  await ipc.loginDex(testPassphrase);

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockLoginDexCall).toHaveBeenCalledWith(testPassphrase);
});

test("test loginDex - dex already started", async () => {
  mockGetDexPID = launch.GetDexPID = jest.fn(() => null);
  await ipc.loginDex(testPassphrase);

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockLoginDexCall).not.toHaveBeenCalled();
});

test("test loginDex - failed", async () => {
  mockGetDexPID = launch.GetDexPID = jest.fn(() => 234);
  mockLoginDexCall = launch.loginDexCall = jest.fn(() => {
    throw testError;
  });

  const res = await ipc.loginDex(testPassphrase);

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockLoginDexCall).toHaveBeenCalled();
  expect(res).toBe(testError);
});

test("test exportSeed", async () => {
  mockGetDexPID = launch.GetDexPID = jest.fn(() => 234);
  await ipc.exportSeed(testPassphrase);

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockExportSeedDexCall).toHaveBeenCalledWith(testPassphrase);
});

test("test exportSeed - dex already started", async () => {
  mockGetDexPID = launch.GetDexPID = jest.fn(() => null);
  await ipc.exportSeed(testPassphrase);

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockExportSeedDexCall).not.toHaveBeenCalled();
});

test("test exportSeed - failed", async () => {
  mockGetDexPID = launch.GetDexPID = jest.fn(() => 234);
  mockExportSeedDexCall = launch.exportSeedDexCall = jest.fn(() => {
    throw testError;
  });

  const res = await ipc.exportSeed(testPassphrase);

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockExportSeedDexCall).toHaveBeenCalled();
  expect(res).toBe(testError);
});

test("test logoutDex", async () => {
  mockGetDexPID = launch.GetDexPID = jest.fn(() => 234);
  await ipc.logoutDex();

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockLogoutDexCall).toHaveBeenCalled();
});

test("test logoutDex - dex already started", async () => {
  mockGetDexPID = launch.GetDexPID = jest.fn(() => null);
  await ipc.logoutDex();

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockLogoutDexCall).not.toHaveBeenCalled();
});

test("test logoutDex - failed", async () => {
  mockGetDexPID = launch.GetDexPID = jest.fn(() => 234);
  mockLogoutDexCall = launch.logoutDexCall = jest.fn(() => {
    throw testError;
  });

  const res = await ipc.logoutDex();

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockLogoutDexCall).toHaveBeenCalled();
  expect(res).toBe(testError);
});

test("test createWalletDex", async () => {
  mockGetDexPID = launch.GetDexPID = jest.fn(() => 234);
  await ipc.createWalletDex(
    testAssetID,
    testWalletType,
    testPassphrase,
    testAppPassphrase,
    testAccount,
    testRpcuser,
    testRpcpass,
    testRpclisten,
    testRpccert
  );

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockCreateWalletDexCall).toHaveBeenCalledWith(
    testAssetID,
    testWalletType,
    testPassphrase,
    testAppPassphrase,
    testAccount,
    testRpcuser,
    testRpcpass,
    testRpclisten,
    testRpccert
  );
});

test("test createWalletDex - dex already started", async () => {
  mockGetDexPID = launch.GetDexPID = jest.fn(() => null);
  await ipc.createWalletDex(
    testAssetID,
    testWalletType,
    testPassphrase,
    testAppPassphrase,
    testAccount,
    testRpcuser,
    testRpcpass,
    testRpclisten,
    testRpccert
  );

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockCreateWalletDexCall).not.toHaveBeenCalled();
});

test("test createWalletDex - failed", async () => {
  mockGetDexPID = launch.GetDexPID = jest.fn(() => 234);
  mockCreateWalletDexCall = launch.createWalletDexCall = jest.fn(() => {
    throw testError;
  });

  const res = await ipc.createWalletDex(
    testAssetID,
    testWalletType,
    testPassphrase,
    testAppPassphrase,
    testAccount,
    testRpcuser,
    testRpcpass,
    testRpclisten,
    testRpccert
  );

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockCreateWalletDexCall).toHaveBeenCalled();
  expect(res).toBe(testError);
});

test("test setWalletPasswordDex", async () => {
  mockGetDexPID = launch.GetDexPID = jest.fn(() => 234);
  await ipc.setWalletPasswordDex(
    testAssetID,
    testPassphrase,
    testAppPassphrase
  );

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockSetWalletPasswordDexCall).toHaveBeenCalledWith(
    testAssetID,
    testPassphrase,
    testAppPassphrase
  );
});

test("test setWalletPasswordDex - dex already started", async () => {
  mockGetDexPID = launch.GetDexPID = jest.fn(() => null);
  await ipc.setWalletPasswordDex(
    testAssetID,
    testPassphrase,
    testAppPassphrase
  );

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockSetWalletPasswordDexCall).not.toHaveBeenCalled();
});

test("test setWalletPasswordDex - failed", async () => {
  mockGetDexPID = launch.GetDexPID = jest.fn(() => 234);
  mockSetWalletPasswordDexCall = launch.setWalletPasswordDexCall = jest.fn(
    () => {
      throw testError;
    }
  );

  const res = await ipc.setWalletPasswordDex(
    testAssetID,
    testPassphrase,
    testAppPassphrase
  );

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockSetWalletPasswordDexCall).toHaveBeenCalled();
  expect(res).toBe(testError);
});

test("test userDex", async () => {
  mockGetDexPID = launch.GetDexPID = jest.fn(() => 234);
  await ipc.userDex();

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockUserDexCall).toHaveBeenCalled();
});

test("test userDex - dex already started", async () => {
  mockGetDexPID = launch.GetDexPID = jest.fn(() => null);
  await ipc.userDex();

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockUserDexCall).not.toHaveBeenCalled();
});

test("test userDex - failed", async () => {
  mockGetDexPID = launch.GetDexPID = jest.fn(() => 234);
  mockUserDexCall = launch.userDexCall = jest.fn(() => {
    throw testError;
  });

  const res = await ipc.userDex();

  expect(mockGetDexPID).toHaveBeenCalled();
  expect(mockUserDexCall).toHaveBeenCalled();
  expect(res).toBe(testError);
});

test("test stopWallet", () => {
  const res = ipc.stopWallet();
  expect(mockCloseDCRW).toHaveBeenCalled();
  expect(res).toBeTruthy();
});

test("test stopDcrlnd", () => {
  const res = ipc.stopDcrlnd();
  expect(mockCloseDcrlnd).toHaveBeenCalled();
  expect(res).toBeTruthy();
});

test("test stopDex", () => {
  const res = ipc.stopDex();
  expect(mockCloseDex).toHaveBeenCalled();
  expect(res).toBeTruthy();
});

test("test get/setWatchingOnlyWallet", () => {
  const testIsWatchingOnly = "testIsWatchingOnly";

  let isWatchingOnly = ipc.getWatchingOnlyWallet();
  expect(isWatchingOnly).toBe(undefined);

  ipc.setWatchingOnlyWallet(testIsWatchingOnly);

  isWatchingOnly = ipc.getWatchingOnlyWallet();
  expect(isWatchingOnly).toBe(testIsWatchingOnly);
});

test("test removeDcrlnd", () => {
  mockExistsSync = fs.existsSync = jest.fn(() => true);
  const res = ipc.removeDcrlnd(testWalletName);
  expect(res).toBeTruthy();
  expect(mockExistsSync).toHaveBeenCalledWith(testDcrlndPath);
  expect(mockRmSync).toHaveBeenCalledWith(testDcrlndPath, {
    recursive: true,
    force: true,
    maxRetries: 30
  });
});

test("test removeDcrlnd - dcrlnd path does not exists", () => {
  mockExistsSync = fs.existsSync = jest.fn(() => false);
  const res = ipc.removeDcrlnd(testWalletName);
  expect(res).toBeFalsy();
  expect(mockExistsSync).toHaveBeenCalledWith(testDcrlndPath);
  expect(mockRmSync).not.toHaveBeenCalled();
});

test("test removeDcrlnd - failed ", () => {
  mockExistsSync = fs.existsSync = jest.fn(() => true);
  mockRmSync = fs.rmSync = jest.fn(() => {
    throw testError;
  });
  const res = ipc.removeDcrlnd(testWalletName);
  expect(res).toBeFalsy();
  expect(mockExistsSync).toHaveBeenCalledWith(testDcrlndPath);
  expect(mockRmSync).toHaveBeenCalledWith(testDcrlndPath, {
    recursive: true,
    force: true,
    maxRetries: 30
  });
});

test("test lnScbInfo", () => {
  const res = ipc.lnScbInfo(testWalletPath);
  expect(res).toStrictEqual({
    channelBackupMTime: testMTime,
    channelBackupPath: `${testWalletPath}/dcrlnd/data/chain/decred/${MAINNET}/channel.backup`
  });
});

test("test lnScbInfo - on testnet", () => {
  const res = ipc.lnScbInfo(testWalletPath, true);
  expect(res).toStrictEqual({
    channelBackupMTime: testMTime,
    channelBackupPath: `${testWalletPath}/dcrlnd/data/chain/decred/${TESTNET}/channel.backup`
  });
});
