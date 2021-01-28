import GetStartedPage from "components/views/GetStartedPage/GetStartedPage";
import { DEFAULT_LIGHT_THEME_NAME, DEFAULT_DARK_THEME_NAME } from "pi-ui";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";

import { screen, wait } from "@testing-library/react";
import * as sel from "selectors";
import * as wla from "actions/WalletLoaderActions";
import * as da from "actions/DaemonActions";
import * as conf from "config";
import * as wa from "wallet/daemon";
import { ipcRenderer } from "electron";
jest.mock("electron");

const testAppVersion = "0.test-version.0";

let mockGetDaemonSynced;
let mockIsSPV;
let mockAppVersion;
let mockGetSelectedWallet;
let mockGetAvailableWallets;
let mockIsTestNet;
let mockGetGlobalCfg;
let mockConnectDaemon;
let mockStartDaemon;
let mockSyncDaemon;
let mockCheckNetworkMatch;
let mockUpdateAvailable;
let mockDaemonWarning;

beforeEach(() => {
  mockGetDaemonSynced = sel.getDaemonSynced = jest.fn(() => true);
  mockUpdateAvailable = sel.updateAvailable = jest.fn(() => true);
  mockDaemonWarning = sel.daemonWarning = jest.fn(() => null);
  mockIsSPV = sel.isSPV = jest.fn(() => false);
  mockAppVersion = sel.appVersion = jest.fn(() => testAppVersion);
  mockGetSelectedWallet = wla.getSelectedWallet = jest.fn(() => () => null);
  mockGetAvailableWallets = da.getAvailableWallets = jest.fn(() => () =>
    Promise.resolve({ availableWallets: [], previousWallet: null })
  );
  mockIsTestNet = sel.isTestNet = jest.fn(() => false);
  sel.changePassphraseRequestAttempt = jest.fn(() => false);
  sel.settingsChanged = jest.fn(() => true);
  mockGetGlobalCfg = conf.getGlobalCfg = jest.fn(() => {
    return {
      get: () => DEFAULT_LIGHT_THEME_NAME,
      set: () => {}
    };
  });
  wa.getDcrdLogs = jest.fn(() => Promise.resolve(Buffer.from("", "utf-8")));
  wa.getDcrwalletLogs = jest.fn(() =>
    Promise.resolve(Buffer.from("", "utf-8"))
  );
  wa.getDecreditonLogs = jest.fn(() =>
    Promise.resolve(Buffer.from("", "utf-8"))
  );
  wa.getDcrlndLogs = jest.fn(() => Promise.resolve(Buffer.from("", "utf-8")));
  mockConnectDaemon = da.connectDaemon = jest.fn(() => () =>
    Promise.resolve(true)
  );
  mockStartDaemon = da.startDaemon = jest.fn(() => () => Promise.resolve(true));
  mockSyncDaemon = da.syncDaemon = jest.fn(() => () => Promise.resolve());
  mockCheckNetworkMatch = da.checkNetworkMatch = jest.fn(() => () =>
    Promise.resolve()
  );
  sel.stakeTransactions = jest.fn(() => []);
});

test("render empty wallet chooser view", async () => {
  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  expect(screen.getByText(/logs/i)).toBeInTheDocument();
  expect(screen.getByText(/settings/i)).toBeInTheDocument();
  expect(
    screen.getByText(`What's New in v${testAppVersion}`)
  ).toBeInTheDocument();
  expect(screen.getByText(/create a new wallet/i)).toBeInTheDocument();
  expect(screen.getByText(/restore existing wallet/i)).toBeInTheDocument();
  expect(screen.getByText(/about decrediton/i)).toBeInTheDocument();
  expect(screen.getByText(/choose a wallet to open/i)).toBeInTheDocument();
  expect(screen.getByText(/learn the basics/i)).toBeInTheDocument();
  expect(screen.getByText(/edit wallets/i)).toBeInTheDocument();
  expect(screen.getByTestId("getstarted-pagebody").className).not.toMatch(
    /testnetBody/
  );
  expect(screen.getByText(/update available/i)).toBeInTheDocument();
  expect(screen.getByText(/new version available/i)).toBeInTheDocument();

  expect(mockGetDaemonSynced).toHaveBeenCalled();
  expect(mockIsSPV).toHaveBeenCalled();
  expect(mockAppVersion).toHaveBeenCalled();
  expect(mockGetSelectedWallet).toHaveBeenCalled();
  expect(mockGetAvailableWallets).toHaveBeenCalled();
  expect(mockIsTestNet).toHaveBeenCalled();
  expect(mockUpdateAvailable).toHaveBeenCalled();
});

test("render empty wallet chooser view in SPV mode", async () => {
  mockIsSPV = sel.isSPV = jest.fn(() => true);

  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  expect(
    screen.getByText(/choose a wallet to open in spv mode/i)
  ).toBeInTheDocument();
});

test("render empty wallet chooser view in testnet mode", async () => {
  mockIsTestNet = sel.isTestNet = jest.fn(() => true);

  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));
  expect(screen.getByTestId("getstarted-pagebody").className).toMatch(
    /testnetBody/
  );
  expect(mockIsTestNet).toHaveBeenCalled();
});

test("render empty wallet chooser view and click-on&test release notes", async () => {
  const readRenderedVersionNumber = (headerText) => {
    return /Decrediton v(.*) Released/i.exec(headerText)[1].replace(/\D/g, "");
  };

  const oldestVersionNumber = 130;
  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  user.click(screen.getByText(/what's new in/i));
  await wait(() => screen.getByText(/newer version/i));
  const header = screen.getByText(/Decrediton (.*) Released/i);
  expect(header).toBeInTheDocument();
  const newestVersionNumber = readRenderedVersionNumber(header.textContent);

  // click on `newer version` button in vain
  user.click(screen.getByText(/newer version/i));
  expect(+readRenderedVersionNumber(header.textContent)).toBe(
    +newestVersionNumber
  );

  // click on `older version` button until the oldest version reached
  const olderVersionButton = screen.getByText(/older version/i);
  user.click(olderVersionButton);
  let olderVersionNumber = readRenderedVersionNumber(header.textContent);
  expect(+olderVersionNumber).toBeLessThan(+newestVersionNumber);
  do {
    user.click(olderVersionButton);
    olderVersionNumber = readRenderedVersionNumber(header.textContent);
    expect(+olderVersionNumber).toBeLessThan(+newestVersionNumber);
  } while (+olderVersionNumber > +oldestVersionNumber);

  // click on `older version` button in vain
  user.click(olderVersionButton);
  expect(+readRenderedVersionNumber(header.textContent)).toBe(
    +oldestVersionNumber
  );

  // go back to the newer versions view
  user.click(screen.getByText(/newer version/i));
  expect(+readRenderedVersionNumber(header.textContent)).toBeGreaterThan(
    +oldestVersionNumber
  );

  // go back to the wallet chooser view
  user.click(screen.getByText(/go back/i).previousSibling);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));
});

test("click on settings link", async () => {
  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  user.click(screen.getByText(/settings/i));
  await wait(() => screen.getByText(/connectivity/i));

  user.click(screen.getByText(/save/i));
  expect(mockGetGlobalCfg).toHaveBeenCalled();

  // go back
  user.click(screen.getByText(/go back/i).previousSibling);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));
});

test("click on settings link and change theme", async () => {
  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  user.click(screen.getByText(/settings/i));
  await wait(() => screen.getByText(/connectivity/i));

  mockGetGlobalCfg = conf.getGlobalCfg = jest.fn(() => {
    return {
      get: () => DEFAULT_DARK_THEME_NAME,
      set: () => {}
    };
  });
  user.click(screen.getByText(/save/i));
  expect(mockGetGlobalCfg).toHaveBeenCalled();
});

test("click on logs view", async () => {
  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  user.click(screen.getByText(/logs/i));
  await wait(() => screen.queryByText(/system logs/i));

  // go back
  user.click(screen.getByText(/go back/i).previousSibling);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));
});

test("test if app receive daemon connection data from cli", async () => {
  const rpcCreds = {
    rpcUser: "test-rpc-user",
    rpcPass: "test-rpc-pass",
    rpcCert: "test-rpc-cert",
    rpcHost: "test-rpc-host",
    rpcPort: "test-rpc-port"
  };
  ipcRenderer.sendSync.mockImplementation(() => {
    return {
      rpcPresent: true,
      ...rpcCreds
    };
  });
  render(<GetStartedPage />);

  await wait(() =>
    expect(mockConnectDaemon).toHaveBeenCalledWith(
      {
        rpc_user: rpcCreds.rpcUser,
        rpc_pass: rpcCreds.rpcPass,
        rpc_cert: rpcCreds.rpcCert,
        rpc_host: rpcCreds.rpcHost,
        rpc_port: rpcCreds.rpcPort
      },
      true
    )
  );
  ipcRenderer.sendSync.mockRestore();
});

test("start regular daemon and not receive available wallet", async () => {
  ipcRenderer.sendSync.mockImplementation(() => {
    return {
      rpcPresent: false
    };
  });
  const testGetAvailableWalletsErrorMsg = "get-available-wallet-error-msg";
  mockGetAvailableWallets = da.getAvailableWallets = jest.fn(() => () =>
    Promise.reject(testGetAvailableWalletsErrorMsg)
  );
  mockGetDaemonSynced = sel.getDaemonSynced = jest.fn(() => false);
  mockIsSPV = sel.isSPV = jest.fn(() => false);

  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));
  expect(mockStartDaemon).toHaveBeenCalled();
  expect(mockSyncDaemon).toHaveBeenCalled();
  expect(mockCheckNetworkMatch).toHaveBeenCalled();
  ipcRenderer.sendSync.mockRestore();
  expect(screen.getByText(testGetAvailableWalletsErrorMsg)).toBeInTheDocument();
});

test("start regular daemon and receive sync daemon error", async () => {
  ipcRenderer.sendSync.mockImplementation(() => {
    return {
      rpcPresent: false
    };
  });
  const testSyncErrorMsg = "sync-error-msg";
  mockSyncDaemon = da.syncDaemon = jest.fn(() => () =>
    Promise.reject(testSyncErrorMsg)
  );
  mockGetDaemonSynced = sel.getDaemonSynced = jest.fn(() => false);
  mockIsSPV = sel.isSPV = jest.fn(() => false);

  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));
  expect(mockStartDaemon).toHaveBeenCalled();
  expect(mockSyncDaemon).toHaveBeenCalled();
  expect(mockCheckNetworkMatch).not.toHaveBeenCalled();
  ipcRenderer.sendSync.mockRestore();
});

test("start regular daemon and receive network match error", async () => {
  ipcRenderer.sendSync.mockImplementation(() => {
    return {
      rpcPresent: false
    };
  });
  const testNetworkMatchErrorMsg = "network-match-error-msg";
  mockCheckNetworkMatch = da.checkNetworkMatch = jest.fn(() => () =>
    Promise.reject(testNetworkMatchErrorMsg)
  );
  mockGetDaemonSynced = sel.getDaemonSynced = jest.fn(() => false);
  mockIsSPV = sel.isSPV = jest.fn(() => false);

  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));
  expect(mockStartDaemon).toHaveBeenCalled();
  expect(mockSyncDaemon).toHaveBeenCalled();
  expect(mockCheckNetworkMatch).toHaveBeenCalled();
  ipcRenderer.sendSync.mockRestore();
});

test("test daemon warning", async () => {
  ipcRenderer.sendSync.mockImplementation(() => {
    return {
      rpcPresent: false
    };
  });
  const testDaemonWarningText = "test-daemon-warning-text";
  mockDaemonWarning = sel.daemonWarning = jest.fn(() => testDaemonWarningText);
  render(<GetStartedPage />);
  await wait(() => screen.getByText(testDaemonWarningText));
  expect(mockDaemonWarning).toHaveBeenCalled();
  ipcRenderer.sendSync.mockRestore();
});
