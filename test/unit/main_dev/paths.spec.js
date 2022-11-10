import os from "os";
import path from "path";
import fs from "fs";
import * as p from "../../../app/main_dev/paths";
import * as c from "../../../app/config";
import { TESTNET, MAINNET } from "constants";

const paths = p;
const config = c;

jest.mock("fs");

const testHomeDir = "/home/testUser";
const testWalletName = "test-wallet-name";
const testConfigPath = "/test-config-path";
const testAppDataPath = "/test-appdata-path";
const testResourcePath = "/test-resource-path";
const testExecutableName = "test-executable-name";
const testLogDir = "test-log-dir";
const testPoliteiaPath = `${testHomeDir}/.config/decrediton/politeia`;
const testToken = "test-token";
const testProposalPath = `${testPoliteiaPath}/${testToken}`;
const testProposalEligibleTicketsPath = `${testProposalPath}/eligibletickets.json`;
const testEligibleTickets = { t: 1 };
const testError = "test-error";
const testVote = "test-vote";
const testCustombinpath = "test-custom-bin-path";
const testInventoryProposals = ["1", "2", "3"];
const testVoteDirPath = `${testPoliteiaPath}/4`;
const testDirProposals = ["1", "3", "4"];
const testVoteDirFilesWithOneDirectory = ["file1", "file2", "dir1"];
const testVoteDirFiles = ["file4", "file5"];

let mockMkdirSync;
let mockCopyFileSync;
let mockInitWalletCfg;
let mockNewWalletConfigCreation;
let mockWriteFile;
let mockReadFileSync;
let mockReaddirSync;
let mockLstatSync;
let mockUnlinkSync;
let mockRmdirSync;
let mockExistsSync;

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
  mockCopyFileSync = fs.copyFileSync = jest.fn(() => {});
  mockInitWalletCfg = config.initWalletCfg = jest.fn(() => {});
  mockNewWalletConfigCreation = config.newWalletConfigCreation = jest.fn(
    () => {}
  );
  mockExistsSync = fs.existsSync = jest.fn(() => {});
  mockWriteFile = fs.writeFile = jest.fn(() => {});
  mockReadFileSync = fs.readFileSync = jest.fn(() =>
    JSON.stringify(testEligibleTickets)
  );
  mockReaddirSync = fs.readdirSync = jest.fn((dir) => {
    if (dir === testVoteDirPath) {
      return testVoteDirFilesWithOneDirectory;
    } else if (dir === `${testVoteDirPath}/dir1`) {
      return testVoteDirFiles;
    } else {
      return testDirProposals;
    }
  });
  mockLstatSync = fs.lstatSync = jest.fn(() => {});
  mockUnlinkSync = fs.unlinkSync = jest.fn(() => {});
  mockRmdirSync = fs.rmdirSync = jest.fn(() => {});
});

test("test getAppDataDirectory - on windows", () => {
  jest.spyOn(os, "platform").mockImplementation(() => "win32");
  const res = paths.getAppDataDirectory();
  expect(res).toBe(`${testHomeDir}/AppData/Local/Decrediton`);
});

test("test getAppDataDirectory - on darwin", () => {
  jest.spyOn(os, "platform").mockImplementation(() => null);
  Object.defineProperty(process, "platform", {
    value: "darwin"
  });
  const res = paths.getAppDataDirectory();
  expect(res).toBe(`${testHomeDir}/Library/Application Support/decrediton`);
});

test("test getAppDataDirectory - on linux", () => {
  const res = paths.getAppDataDirectory();
  expect(res).toBe(`${testHomeDir}/.config/decrediton`);
});

test("test getGlobalCfgPath - on linux", () => {
  const res = paths.getGlobalCfgPath();
  expect(res).toBe(`${testHomeDir}/.config/decrediton/config.json`);
});

test("test getWalletsDirectoryPath - on linux", () => {
  const res = paths.getWalletsDirectoryPath();
  expect(res).toBe(`${testHomeDir}/.config/decrediton/wallets`);
});

test("test getWalletsDirectoryPathNetwork - on linux, testnet", () => {
  const res = paths.getWalletsDirectoryPathNetwork(true);
  expect(res).toBe(`${testHomeDir}/.config/decrediton/wallets/testnet`);
});

test("test getWalletsDirectoryPathNetwork - on linux, mainnet", () => {
  const res = paths.getWalletsDirectoryPathNetwork();
  expect(res).toBe(`${testHomeDir}/.config/decrediton/wallets/mainnet`);
});

test("test getWalletPath - on linux, mainnet", () => {
  const res = paths.getWalletPath(false, testWalletName);
  expect(res).toBe(
    `${testHomeDir}/.config/decrediton/wallets/mainnet/${testWalletName}`
  );
});

test("test getWalletPath - on linux, mainnet without name parameter", () => {
  const res = paths.getWalletPath(false);
  expect(res).toBe(`${testHomeDir}/.config/decrediton/wallets/mainnet`);
});

test("test getWalletDb - on linux, mainnet", () => {
  const res = paths.getWalletDb(false, testWalletName);
  expect(res).toBe(
    `${testHomeDir}/.config/decrediton/wallets/mainnet/${testWalletName}/mainnet/wallet.db`
  );
});

test("test getWalletDb - on linux, testnet", () => {
  const res = paths.getWalletDb(true, testWalletName);
  expect(res).toBe(
    `${testHomeDir}/.config/decrediton/wallets/testnet/${testWalletName}/testnet3/wallet.db`
  );
});

test("test dcrdCfg", () => {
  const res = paths.dcrdCfg(testConfigPath);
  expect(res).toBe(`${testConfigPath}/dcrd.conf`);
});

test("test dcrwalletConf", () => {
  const res = paths.dcrwalletConf(testConfigPath);
  expect(res).toBe(`${testConfigPath}/dcrwallet.conf`);
});

test("test getDcrdPath - on windows", () => {
  jest.spyOn(os, "platform").mockImplementation(() => "win32");
  const res = paths.getDcrdPath();
  expect(res).toBe(`${testHomeDir}/AppData/Local/Dcrd`);
});

test("test getDcrdPath - on darwin", () => {
  jest.spyOn(os, "platform").mockImplementation(() => null);
  Object.defineProperty(process, "platform", {
    value: "darwin"
  });
  const res = paths.getDcrdPath();
  expect(res).toBe(`${testHomeDir}/Library/Application Support/dcrd`);
});

test("test getDcrdPath - on linux", () => {
  const res = paths.getDcrdPath();
  expect(res).toBe(`${testHomeDir}/.dcrd`);
});

test("test getDcrdRpcCert - on linux", () => {
  const res = paths.getDcrdRpcCert();
  expect(res).toBe(`${testHomeDir}/.dcrd/rpc.cert`);
});

test("test getDcrdRpcCert - on linux with app data path parameter", () => {
  const res = paths.getDcrdRpcCert(testAppDataPath);
  expect(res).toBe(`${testAppDataPath}/rpc.cert`);
});

test("test getCertsPath", () => {
  const res = paths.getCertsPath();
  expect(res).toBe(`${testResourcePath}/certs`);
});

test("test getCertsPath - in dev env", () => {
  Object.defineProperty(process, "env", {
    value: {
      NODE_ENV: "development"
    }
  });
  const res = paths.getCertsPath();
  expect(res).toBe(path.join(__dirname, "..", "..", "..", "app", "certs"));
});

test("test getExecutablePath", () => {
  const res = paths.getExecutablePath(testExecutableName);
  expect(res).toBe(`${testResourcePath}/bin/${testExecutableName}`);
});

test("test getExecutablePath - custom bin path", () => {
  const res = paths.getExecutablePath(testExecutableName, testCustombinpath);
  expect(res).toBe(`${testCustombinpath}/${testExecutableName}`);
});

test("test getExecutablePath - on windows in development env", () => {
  Object.defineProperty(process, "env", {
    value: {
      NODE_ENV: "development"
    }
  });
  jest.spyOn(os, "platform").mockImplementation(() => "win32");
  const res = paths.getExecutablePath(testExecutableName);
  expect(res).toBe(
    `${path.join(
      __dirname,
      "..",
      "..",
      "..",
      "app",
      "bin"
    )}/${testExecutableName}.exe`
  );
});

test("test getDirectoryLogs", () => {
  const res = paths.getDirectoryLogs(testLogDir);
  expect(res).toBe(`${testLogDir}/logs`);
});

const getTestWalletDirectory = (network) =>
  `${testHomeDir}/.config/decrediton/wallets/${network}/default-wallet`;
const getTestOldWalletDirectory = (network) =>
  `${testHomeDir}/.config/decrediton/${
    network === TESTNET ? "testnet3" : network
  }`;
const getTestGlobalConfigPath = () =>
  `${testHomeDir}/.config/decrediton/config.json`;
const getTestConfigJsonPath = (network) =>
  `${testHomeDir}/.config/decrediton/wallets/${network}/default-wallet/config.json`;

test("test checkAndInitWalletCfg - on mainnet", () => {
  jest.spyOn(os, "platform").mockImplementation(() => null);
  const testWalletDirectory = getTestWalletDirectory(MAINNET);
  const testOldWalletDirectory = getTestOldWalletDirectory(MAINNET);
  const testGlobalConfigPath = getTestGlobalConfigPath();
  const testConfigJsonPath = getTestConfigJsonPath(MAINNET);
  mockExistsSync = fs.existsSync = jest.fn((path) => {
    if (path === testWalletDirectory) {
      return false;
    } else if (path === testOldWalletDirectory) {
      return true;
    } else if (path === testGlobalConfigPath) {
      return true;
    }
  });
  paths.checkAndInitWalletCfg();

  expect(mockMkdirSync).toHaveBeenCalledWith(
    `${testWalletDirectory}/${MAINNET}`,
    {
      recursive: true
    }
  );

  expect(mockCopyFileSync).toHaveBeenNthCalledWith(
    1,
    `${testOldWalletDirectory}/wallet.db`,
    `${testWalletDirectory}/${MAINNET}/wallet.db`
  );
  expect(mockCopyFileSync).toHaveBeenNthCalledWith(
    2,
    testGlobalConfigPath,
    testConfigJsonPath
  );
  expect(mockExistsSync).toHaveBeenNthCalledWith(1, testWalletDirectory);
  expect(mockExistsSync).toHaveBeenNthCalledWith(2, testOldWalletDirectory);
  expect(mockExistsSync).toHaveBeenNthCalledWith(3, testGlobalConfigPath);

  expect(mockInitWalletCfg).toHaveBeenCalledWith(undefined, "default-wallet");

  expect(mockNewWalletConfigCreation).toHaveBeenCalledWith(
    undefined,
    "default-wallet"
  );
});

test("test checkAndInitWalletCfg - on testnet", () => {
  jest.spyOn(os, "platform").mockImplementation(() => null);
  const testWalletDirectory = getTestWalletDirectory(TESTNET);
  const testOldWalletDirectory = getTestOldWalletDirectory(TESTNET);
  const testGlobalConfigPath = getTestGlobalConfigPath(TESTNET);

  mockExistsSync = fs.existsSync = jest.fn((path) => {
    if (path === testWalletDirectory) {
      return false;
    } else if (path === testOldWalletDirectory) {
      return true;
    } else if (path === testGlobalConfigPath) {
      return true;
    }
  });
  paths.checkAndInitWalletCfg(true);

  expect(mockMkdirSync).toHaveBeenCalledWith(
    `${testWalletDirectory}/${TESTNET}3`,
    {
      recursive: true
    }
  );

  expect(mockCopyFileSync).toHaveBeenNthCalledWith(
    1,
    `${testOldWalletDirectory}/wallet.db`,
    `${testWalletDirectory}/${TESTNET}3/wallet.db`
  );
});

test("test checkAndInitWalletCfg - on testnet, wallet directory exists", () => {
  jest.spyOn(os, "platform").mockImplementation(() => null);
  const testWalletDirectory = getTestWalletDirectory(TESTNET);

  mockExistsSync = fs.existsSync = jest.fn((path) => {
    if (path === testWalletDirectory) {
      return true;
    }
  });
  paths.checkAndInitWalletCfg(true);

  expect(mockMkdirSync).not.toHaveBeenCalled();
  expect(mockCopyFileSync).not.toHaveBeenCalled();
  expect(mockExistsSync).toHaveBeenNthCalledWith(1, testWalletDirectory);
});

test("test checkAndInitWalletCfg - on mainnet - global config doesn't exist'", () => {
  jest.spyOn(os, "platform").mockImplementation(() => null);
  const testWalletDirectory = getTestWalletDirectory(MAINNET);
  const testOldWalletDirectory = getTestOldWalletDirectory(MAINNET);
  const testGlobalConfigPath = getTestGlobalConfigPath();
  mockExistsSync = fs.existsSync = jest.fn((path) => {
    if (path === testWalletDirectory) {
      return false;
    } else if (path === testOldWalletDirectory) {
      return true;
    } else if (path === testGlobalConfigPath) {
      return false;
    }
  });
  paths.checkAndInitWalletCfg();

  expect(mockMkdirSync).toHaveBeenCalledWith(
    `${testWalletDirectory}/${MAINNET}`,
    {
      recursive: true
    }
  );

  expect(mockCopyFileSync).toHaveBeenCalledWith(
    `${testOldWalletDirectory}/wallet.db`,
    `${testWalletDirectory}/${MAINNET}/wallet.db`
  );
  expect(mockCopyFileSync).toHaveBeenCalledTimes(1);
  expect(mockExistsSync).toHaveBeenNthCalledWith(1, testWalletDirectory);
  expect(mockExistsSync).toHaveBeenNthCalledWith(2, testOldWalletDirectory);
  expect(mockExistsSync).toHaveBeenNthCalledWith(3, testGlobalConfigPath);

  expect(mockInitWalletCfg).toHaveBeenCalledWith(undefined, "default-wallet");

  expect(mockNewWalletConfigCreation).toHaveBeenCalledWith(
    undefined,
    "default-wallet"
  );
});

test("test setPoliteiaPath", () => {
  mockExistsSync = fs.existsSync = jest.fn(() => false);
  paths.setPoliteiaPath();

  expect(mockExistsSync).toHaveBeenCalledWith(testPoliteiaPath);
  expect(mockMkdirSync).toHaveBeenCalledWith(testPoliteiaPath, {
    recursive: true,
    mode: 0o700
  });
});

test("test setPoliteiaPath - already exists", () => {
  mockExistsSync = fs.existsSync = jest.fn(() => true);
  paths.setPoliteiaPath();

  expect(mockExistsSync).toHaveBeenCalledWith(testPoliteiaPath);
  expect(mockMkdirSync).not.toHaveBeenCalled();
});

test("test setPoliteiaProposalPath", () => {
  mockExistsSync = fs.existsSync = jest.fn(() => false);
  const res = paths.setPoliteiaProposalPath(testToken);

  expect(mockExistsSync).toHaveBeenNthCalledWith(1, testProposalPath);
  expect(mockExistsSync).toHaveBeenNthCalledWith(2, "");
  expect(res).toBe(testProposalPath);
  expect(mockMkdirSync).toHaveBeenCalledWith(testProposalPath, {
    recursive: true,
    mode: 0o700
  });
});

test("test setPoliteiaProposalPath - already exists", () => {
  mockExistsSync = fs.existsSync = jest.fn(() => true);
  const res = paths.setPoliteiaProposalPath(testToken);

  expect(mockExistsSync).toHaveBeenNthCalledWith(1, testProposalPath);
  expect(mockExistsSync).toHaveBeenNthCalledWith(2, testProposalPath);
  expect(res).toBe(undefined);
  expect(mockMkdirSync).not.toHaveBeenCalled();
});

test("test saveEligibleTickets", () => {
  mockExistsSync = fs.existsSync = jest.fn(() => false);
  paths.saveEligibleTickets(testToken, testEligibleTickets);

  expect(mockExistsSync).toHaveBeenNthCalledWith(1, testProposalPath);
  expect(mockExistsSync).toHaveBeenNthCalledWith(2, "");
  expect(mockMkdirSync).toHaveBeenCalledWith(testProposalPath, {
    recursive: true,
    mode: 0o700
  });

  expect(mockWriteFile).toHaveBeenCalledWith(
    `${testProposalPath}/eligibletickets.json`,
    JSON.stringify(testEligibleTickets),
    expect.any(Function)
  );
});

test("test saveEligibleTickets - proposalPath already exists", () => {
  mockExistsSync = fs.existsSync = jest.fn(() => true);
  paths.saveEligibleTickets(testToken, testEligibleTickets);

  expect(mockExistsSync).toHaveBeenNthCalledWith(1, testProposalPath);
  expect(mockExistsSync).toHaveBeenNthCalledWith(2, testProposalPath);

  expect(mockWriteFile).toHaveBeenCalledWith(
    `${testProposalPath}/eligibletickets.json`,
    JSON.stringify(testEligibleTickets),
    expect.any(Function)
  );
});

test("test saveEligibleTickets - failed to write file", () => {
  mockExistsSync = fs.existsSync = jest.fn(() => false);
  mockWriteFile = fs.writeFile = jest.fn(() => {
    throw testError;
  });
  let catchedError;
  try {
    paths.saveEligibleTickets(testToken, testEligibleTickets);
  } catch (error) {
    catchedError = error;
  }
  expect(catchedError).toBe(testError);

  expect(mockWriteFile).toHaveBeenCalledWith(
    testProposalEligibleTicketsPath,
    JSON.stringify(testEligibleTickets),
    expect.any(Function)
  );
});

test("test getEligibleTickets", () => {
  mockExistsSync = fs.existsSync = jest.fn(() => true);
  const res = paths.getEligibleTickets(testToken);

  expect(mockExistsSync).toHaveBeenCalledWith(testProposalEligibleTicketsPath);
  expect(mockReadFileSync).toHaveBeenCalledWith(
    testProposalEligibleTicketsPath
  );
  expect(res).toStrictEqual(testEligibleTickets);
});

test("test getEligibleTickets - proposal path does not exist", () => {
  mockExistsSync = fs.existsSync = jest.fn(() => false);
  const res = paths.getEligibleTickets(testToken);

  expect(mockExistsSync).toHaveBeenCalledTimes(1);
  expect(mockReadFileSync).not.toHaveBeenCalled();
  expect(res).toBeNull();
});

test("test getEligibleTickets - proposal eligible ticket path does not exist", () => {
  mockExistsSync = fs.existsSync = jest.fn((path) =>
    path.includes("eligibletickets") ? false : true
  );
  const res = paths.getEligibleTickets(testToken);

  expect(mockExistsSync).toHaveBeenNthCalledWith(1, testProposalPath);
  expect(mockExistsSync).toHaveBeenNthCalledWith(
    2,
    testProposalEligibleTicketsPath
  );
  expect(res).toBeNull();
});

const getWalletPiPath = (network) =>
  `${testHomeDir}/.config/decrediton/wallets/${network}/${testWalletName}/politeia`;
const getProposalPath = (network) => `${getWalletPiPath(network)}/${testToken}`;
const getVotePath = (network) => `${getProposalPath(network)}/vote.json`;

test("test savePiVote - on mainnet, wallet pi, proposal and vote path does no exist", () => {
  const testWalletPiPath = getWalletPiPath(MAINNET);
  const testProposalPath = getProposalPath(MAINNET);
  const testVotePath = getVotePath(MAINNET);
  mockExistsSync = fs.existsSync = jest.fn(() => false);
  paths.savePiVote(testVote, testToken, false /*not testnet*/, testWalletName);
  expect(mockExistsSync).toHaveBeenNthCalledWith(1, testWalletPiPath);
  expect(mockExistsSync).toHaveBeenNthCalledWith(2, testProposalPath);
  expect(mockExistsSync).toHaveBeenNthCalledWith(3, testVotePath);
  expect(mockMkdirSync).toHaveBeenNthCalledWith(1, testWalletPiPath, {
    recursive: true,
    mode: 0o700
  });
  expect(mockMkdirSync).toHaveBeenNthCalledWith(2, testProposalPath, {
    recursive: true,
    mode: 0o700
  });
  expect(mockWriteFile).toHaveBeenCalledWith(
    testVotePath,
    JSON.stringify(testVote),
    { mode: 0o600 },
    expect.any(Function)
  );
});

test("test savePiVote - on mainnet, all path exists", () => {
  const testWalletPiPath = getWalletPiPath(MAINNET);
  const testProposalPath = getProposalPath(MAINNET);
  const testVotePath = getVotePath(MAINNET);
  mockExistsSync = fs.existsSync = jest.fn(() => true);
  paths.savePiVote(testVote, testToken, false /*not testnet*/, testWalletName);
  expect(mockExistsSync).toHaveBeenNthCalledWith(1, testWalletPiPath);
  expect(mockExistsSync).toHaveBeenNthCalledWith(2, testProposalPath);
  expect(mockExistsSync).toHaveBeenNthCalledWith(3, testVotePath);
  expect(mockMkdirSync).not.toHaveBeenCalled();
  expect(mockWriteFile).not.toHaveBeenCalled();
});

test("test getProposalWalletVote - on mainnet", () => {
  mockReadFileSync = fs.readFileSync = jest.fn(() => JSON.stringify(testVote));
  const testWalletPiPath = getWalletPiPath(MAINNET);
  const testProposalPath = getProposalPath(MAINNET);
  const testVotePath = getVotePath(MAINNET);
  mockExistsSync = fs.existsSync = jest.fn(() => true);
  const res = paths.getProposalWalletVote(
    testToken,
    false /*not testnet*/,
    testWalletName
  );
  expect(mockExistsSync).toHaveBeenNthCalledWith(1, testWalletPiPath);
  expect(mockExistsSync).toHaveBeenNthCalledWith(2, testProposalPath);
  expect(mockReadFileSync).toHaveBeenCalledWith(testVotePath);
  expect(res).toBe(testVote);
});

test("test getProposalWalletVote - on mainnet, proposal path does not exist", () => {
  mockReadFileSync = fs.readFileSync = jest.fn(() => JSON.stringify(testVote));
  const testWalletPiPath = getWalletPiPath(MAINNET);
  const testProposalPath = getProposalPath(MAINNET);
  mockExistsSync = fs.existsSync = jest.fn((path) => path !== testProposalPath);
  const res = paths.getProposalWalletVote(
    testToken,
    false /*not testnet*/,
    testWalletName
  );
  expect(mockExistsSync).toHaveBeenNthCalledWith(1, testWalletPiPath);
  expect(mockExistsSync).toHaveBeenNthCalledWith(2, testProposalPath);
  expect(mockReadFileSync).not.toHaveBeenCalled();
  expect(res).toBeNull();
});

test("test getProposalWalletVote - on mainnet, failed to read file", () => {
  mockReadFileSync = fs.readFileSync = jest.fn(() => {
    throw testError;
  });
  const testWalletPiPath = getWalletPiPath(MAINNET);
  const testProposalPath = getProposalPath(MAINNET);
  const testVotePath = getVotePath(MAINNET);
  mockExistsSync = fs.existsSync = jest.fn(() => true);

  let catchedError;
  try {
    paths.getProposalWalletVote(
      testToken,
      false /*not testnet*/,
      testWalletName
    );
  } catch (error) {
    catchedError = error;
  }
  expect(catchedError).toBe(testError);
  expect(mockExistsSync).toHaveBeenNthCalledWith(1, testWalletPiPath);
  expect(mockExistsSync).toHaveBeenNthCalledWith(2, testProposalPath);
  expect(mockReadFileSync).toHaveBeenCalledWith(testVotePath);
});

test("test getProposalWalletVote - on mainnet, failed to read file (ENOENT)", () => {
  const testENOENTError = {
    message: "..." + "ENOENT: no such file or directory" + "..."
  };
  mockReadFileSync = fs.readFileSync = jest.fn(() => {
    throw testENOENTError;
  });
  const testWalletPiPath = getWalletPiPath(MAINNET);
  const testProposalPath = getProposalPath(MAINNET);
  const testVotePath = getVotePath(MAINNET);
  mockExistsSync = fs.existsSync = jest.fn(() => true);

  let catchedError;
  let res;
  try {
    res = paths.getProposalWalletVote(
      testToken,
      false /*not testnet*/,
      testWalletName
    );
  } catch (error) {
    catchedError = error;
  }
  expect(catchedError).toBe(undefined);
  expect(mockExistsSync).toHaveBeenNthCalledWith(1, testWalletPiPath);
  expect(mockExistsSync).toHaveBeenNthCalledWith(2, testProposalPath);
  expect(mockReadFileSync).toHaveBeenCalledWith(testVotePath);
  expect(res).toBeNull();
});

test("test removeCachedProposals", () => {
  /*
    |- "/home/testUser/.config/decrediton/politeia/4/
      |- file1
      |- file2
      |- dir1
          |- file4
          |- file5
  */
  mockLstatSync = fs.lstatSync = jest.fn((dir) => ({
    isDirectory: () => /dir1$/.test(dir)
  }));
  mockExistsSync = fs.existsSync = jest.fn(() => true);

  paths.removeCachedProposals(testInventoryProposals);
  expect(mockReaddirSync).toHaveBeenNthCalledWith(1, testPoliteiaPath);

  expect(mockExistsSync).toHaveBeenNthCalledWith(1, testVoteDirPath);

  expect(mockLstatSync).toHaveBeenCalled();
  expect(mockUnlinkSync).toHaveBeenNthCalledWith(1, `${testVoteDirPath}/file1`);
  expect(mockUnlinkSync).toHaveBeenNthCalledWith(2, `${testVoteDirPath}/file2`);
  expect(mockUnlinkSync).toHaveBeenNthCalledWith(
    3,
    `${testVoteDirPath}/dir1/file4`
  );
  expect(mockUnlinkSync).toHaveBeenNthCalledWith(
    4,
    `${testVoteDirPath}/dir1/file5`
  );
  expect(mockRmdirSync).toHaveBeenNthCalledWith(1, `${testVoteDirPath}/dir1`);
  expect(mockRmdirSync).toHaveBeenNthCalledWith(2, `${testVoteDirPath}`);
});

test("test removeCachedProposals - vote dir does not exits ", () => {
  const testInventoryProposals = ["1", "2", "3"];
  const testVoteDirPath = `${testPoliteiaPath}/4`;
  mockExistsSync = fs.existsSync = jest.fn((path) => testVoteDirPath !== path);

  paths.removeCachedProposals(testInventoryProposals);
  expect(mockReaddirSync).toHaveBeenNthCalledWith(1, testPoliteiaPath);

  expect(mockExistsSync).toHaveBeenNthCalledWith(1, testVoteDirPath);

  expect(mockLstatSync).not.toHaveBeenCalled();
  expect(mockUnlinkSync).not.toHaveBeenCalled();
  expect(mockRmdirSync).not.toHaveBeenCalled();
});

test("test getSitePath", () => {
  const res = paths.getSitePath();
  expect(res).toBe(`${testResourcePath}/bin/site`);
});

test("test getSitePath - with custom path", () => {
  const res = paths.getSitePath(testCustombinpath);
  expect(res).toBe(`${testCustombinpath}/site`);
});

test("test getSitePath - on windows in development env", () => {
  Object.defineProperty(process, "env", {
    value: {
      NODE_ENV: "development"
    }
  });
  jest.spyOn(os, "platform").mockImplementation(() => "win32");
  const res = paths.getSitePath();
  expect(res).toBe(
    `${path.join(__dirname, "..", "..", "..", "app", "bin")}/site`
  );
});
