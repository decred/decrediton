import GetStartedPage from "components/views/GetStartedPage/GetStartedPage";
import { DEFAULT_LIGHT_THEME_NAME } from "pi-ui";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import * as sel from "selectors";
import * as wla from "actions/WalletLoaderActions";
import * as da from "actions/DaemonActions";
import * as wa from "wallet/daemon";
import * as wl from "wallet";
import { ipcRenderer } from "electron";
jest.mock("electron");

const testAppVersion = "0.test-version.0";
const selectors = sel;
const wlActions = wla;
const daemonActions = da;
const wallet = wa;

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
  mockGetDaemonSynced = selectors.getDaemonSynced = jest.fn(() => true);
  mockUpdateAvailable = selectors.updateAvailable = jest.fn(() => true);
  mockDaemonWarning = selectors.daemonWarning = jest.fn(() => null);
  mockIsSPV = selectors.isSPV = jest.fn(() => false);
  mockAppVersion = selectors.appVersion = jest.fn(() => testAppVersion);
  mockGetSelectedWallet = wlActions.getSelectedWallet = jest.fn(
    () => () => null
  );
  mockGetAvailableWallets = daemonActions.getAvailableWallets = jest.fn(
    () => () => Promise.resolve({ availableWallets: [], previousWallet: null })
  );
  mockIsTestNet = selectors.isTestNet = jest.fn(() => false);
  selectors.changePassphraseRequestAttempt = jest.fn(() => false);
  selectors.settingsChanged = jest.fn(() => true);
  mockGetGlobalCfg = wl.getGlobalCfg;
  mockGetGlobalCfg.mockReturnValueOnce({
    get: () => DEFAULT_LIGHT_THEME_NAME,
    set: () => {}
  });
  wallet.getDcrdLogs = jest.fn(() => Promise.resolve(Buffer.from("", "utf-8")));
  wallet.getDcrwalletLogs = jest.fn(() =>
    Promise.resolve(Buffer.from("", "utf-8"))
  );
  wallet.getDecreditonLogs = jest.fn(() =>
    Promise.resolve(Buffer.from("", "utf-8"))
  );
  wallet.getDcrlndLogs = jest.fn(() =>
    Promise.resolve(Buffer.from("", "utf-8"))
  );
  mockConnectDaemon = daemonActions.connectDaemon = jest.fn(
    () => () => Promise.resolve(true)
  );
  mockStartDaemon = daemonActions.startDaemon = jest.fn(
    () => () => Promise.resolve(true)
  );
  mockSyncDaemon = daemonActions.syncDaemon = jest.fn(
    () => () => Promise.resolve()
  );
  mockCheckNetworkMatch = daemonActions.checkNetworkMatch = jest.fn(
    () => () => Promise.resolve()
  );
  selectors.stakeTransactions = jest.fn(() => []);
});

test("render empty wallet chooser view", async () => {
  render(<GetStartedPage />);
  await waitFor(() => screen.getByText(/welcome to decrediton/i));

  expect(screen.getByText(/logs/i)).toBeInTheDocument();
  expect(screen.getByText(/settings/i)).toBeInTheDocument();
  expect(screen.getByText("Release Info")).toBeInTheDocument();
  expect(screen.getByText(/create a new wallet/i)).toBeInTheDocument();
  expect(screen.getByText(/restore existing wallet/i)).toBeInTheDocument();
  expect(screen.getByText(/choose the wallet to access/i)).toBeInTheDocument();
  expect(screen.getByTestId("getstarted-pagebody").className).not.toMatch(
    /testnetBody/
  );

  // check tutorials
  expect(screen.getByText(/learn about decred/i)).toBeInTheDocument();
  await user.click(screen.getByText("Decred Intro"));
  await waitFor(() => screen.getByText("Back"));
  // go back
  await user.click(screen.getByText("Back").nextElementSibling);
  await waitFor(() => screen.getByText(/welcome to decrediton/i));

  // open onboard tutorial again and go back by finishing it
  await user.click(screen.getByText("Decred Intro"));
  await waitFor(() => screen.getByText("Back"));
  // step forward
  const nextButton = screen.getByRole("button", { name: "Next" });
  await user.click(nextButton);
  expect(screen.getAllByText("Governance systems").length).toBeTruthy();
  // finish
  await user.click(nextButton);
  await waitFor(() => screen.getByText(/welcome to decrediton/i));

  // check learn the basics
  await user.click(screen.getByRole("button", { name: "Learn the Basics" }));
  await waitFor(() => screen.getByText("Skip"));
  // go back
  await user.click(screen.getByText("Skip"));
  await waitFor(() => screen.getByText(/welcome to decrediton/i));

  expect(mockGetDaemonSynced).toHaveBeenCalled();
  expect(mockIsSPV).toHaveBeenCalled();
  expect(mockAppVersion).toHaveBeenCalled();
  expect(mockGetSelectedWallet).toHaveBeenCalled();
  expect(mockGetAvailableWallets).toHaveBeenCalled();
  expect(mockIsTestNet).toHaveBeenCalled();
  expect(mockUpdateAvailable).toHaveBeenCalled();
});

test("render empty wallet chooser view in testnet mode", async () => {
  mockIsTestNet = selectors.isTestNet = jest.fn(() => true);

  render(<GetStartedPage />);
  await waitFor(() => screen.getByText(/welcome to decrediton/i));
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
  await waitFor(() => screen.getByText(/welcome to decrediton/i));

  await user.click(screen.getByText(/Release Info/i));
  await waitFor(() => screen.getByText(/newer version/i));
  const header = screen.getByText(/Decrediton (.*) Released/i);
  expect(header).toBeInTheDocument();
  const newestVersionNumber = readRenderedVersionNumber(header.textContent);

  // click on `newer version` button in vain
  await user.click(screen.getByText(/newer version/i));
  expect(+readRenderedVersionNumber(header.textContent)).toBe(
    +newestVersionNumber
  );

  // click on `older version` button until the oldest version reached
  const olderVersionButton = screen.getByText(/older version/i);
  await user.click(olderVersionButton);
  let olderVersionNumber = readRenderedVersionNumber(header.textContent);
  expect(+olderVersionNumber).toBeLessThan(+newestVersionNumber);
  do {
    await user.click(olderVersionButton);
    olderVersionNumber = readRenderedVersionNumber(header.textContent);
    expect(+olderVersionNumber).toBeLessThan(+newestVersionNumber);
  } while (+olderVersionNumber > +oldestVersionNumber);

  // click on `older version` button in vain
  await user.click(olderVersionButton);
  expect(+readRenderedVersionNumber(header.textContent)).toBe(
    +oldestVersionNumber
  );

  // go back to the newer versions view
  await user.click(screen.getByText(/newer version/i));
  expect(+readRenderedVersionNumber(header.textContent)).toBeGreaterThan(
    +oldestVersionNumber
  );

  // go back to the wallet chooser view
  await user.click(screen.getByText(/go back/i).nextElementSibling);
  await waitFor(() => screen.getByText(/welcome to decrediton/i));
});

test("click on settings link and go back", async () => {
  render(<GetStartedPage />);
  await waitFor(() => screen.getByText(/welcome to decrediton/i));

  await user.click(screen.getByText(/settings/i));
  await waitFor(() => screen.getByText("Connectivity"));

  // go back
  await user.click(
    screen.getByRole("button", {
      name: "Go back"
    })
  );
  await waitFor(() => screen.getByText(/welcome to decrediton/i));
});

test("click on logs view", async () => {
  render(<GetStartedPage />);
  await waitFor(() => screen.getByText(/welcome to decrediton/i));

  await user.click(screen.getByText(/logs/i));
  await waitFor(() => screen.queryByText(/system logs/i));

  // go back
  await user.click(screen.getByText(/go back/i).nextElementSibling);
  await waitFor(() => screen.getByText(/welcome to decrediton/i));
});

test("test if app receive daemon connection data from cli", async () => {
  const rpcCreds = {
    rpcUser: "test-rpc-user",
    rpcPass: "test-rpc-pass",
    rpcCert: "test-rpc-cert",
    rpcHost: "test-rpc-host",
    rpcPort: "test-rpc-port"
  };
  wl.getCLIOptions.mockImplementation(() => {
    return {
      rpcPresent: true,
      ...rpcCreds
    };
  });
  render(<GetStartedPage />);

  await waitFor(() =>
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
  wl.getCLIOptions.mockImplementation(() => {
    return {
      rpcPresent: false
    };
  });
  const testGetAvailableWalletsErrorMsg = "get-available-wallet-error-msg";
  mockGetAvailableWallets = daemonActions.getAvailableWallets = jest.fn(
    () => () => Promise.reject(testGetAvailableWalletsErrorMsg)
  );
  mockGetDaemonSynced = selectors.getDaemonSynced = jest.fn(() => false);
  mockIsSPV = selectors.isSPV = jest.fn(() => false);

  render(<GetStartedPage />);
  await waitFor(() => screen.getByText(/welcome to decrediton/i));
  expect(mockStartDaemon).toHaveBeenCalled();
  expect(mockSyncDaemon).toHaveBeenCalled();
  expect(mockCheckNetworkMatch).toHaveBeenCalled();
  wl.getCLIOptions.mockRestore();
  expect(screen.getByText(testGetAvailableWalletsErrorMsg)).toBeInTheDocument();
});

test("start regular daemon and receive sync daemon error", async () => {
  wl.getCLIOptions.mockImplementation(() => {
    return {
      rpcPresent: false
    };
  });
  const testSyncErrorMsg = { error: "sync-error-msg" };
  mockSyncDaemon = daemonActions.syncDaemon = jest.fn(
    () => () => Promise.reject(testSyncErrorMsg)
  );
  mockGetDaemonSynced = selectors.getDaemonSynced = jest.fn(() => false);
  mockIsSPV = selectors.isSPV = jest.fn(() => false);

  render(<GetStartedPage />);
  expect(screen.getByText("Starting Daemon...")).toBeInTheDocument();
  await waitFor(() => expect(mockSyncDaemon).toHaveBeenCalled());
  expect(screen.queryByText(/Learn about decred/i)).not.toBeInTheDocument();
  expect(mockStartDaemon).toHaveBeenCalled();
  expect(mockCheckNetworkMatch).not.toHaveBeenCalled();
  wl.getCLIOptions.mockRestore();
});

test("start regular daemon and receive network match error", async () => {
  wl.getCLIOptions.mockImplementation(() => {
    return {
      rpcPresent: false
    };
  });
  const testNetworkMatchErrorMsg = "network-match-error-msg";
  mockCheckNetworkMatch = daemonActions.checkNetworkMatch = jest.fn(
    () => () => Promise.reject(testNetworkMatchErrorMsg)
  );
  mockGetDaemonSynced = selectors.getDaemonSynced = jest.fn(() => false);
  mockIsSPV = selectors.isSPV = jest.fn(() => false);

  render(<GetStartedPage />);
  await waitFor(() => expect(mockSyncDaemon).toHaveBeenCalled());
  expect(screen.queryByText(/Learn about decred/i)).not.toBeInTheDocument();
  expect(mockStartDaemon).toHaveBeenCalled();
  expect(mockCheckNetworkMatch).toHaveBeenCalled();
  wl.getCLIOptions.mockRestore();
});

test("test daemon warning", async () => {
  wl.getCLIOptions.mockImplementation(() => {
    return {
      rpcPresent: false
    };
  });
  const testDaemonWarningText = "test-daemon-warning-text";
  mockDaemonWarning = selectors.daemonWarning = jest.fn(
    () => testDaemonWarningText
  );
  render(<GetStartedPage />);
  await waitFor(() => screen.getByText(testDaemonWarningText));
  expect(mockDaemonWarning).toHaveBeenCalled();
  wl.getCLIOptions.mockRestore();
});
