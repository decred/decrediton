import GetStartedPage from "components/views/GetStartedPage/GetStartedPage";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import * as sel from "selectors";
import * as da from "actions/DaemonActions";
import * as wla from "actions/WalletLoaderActions";
import * as ca from "actions/ClientActions";
import {
  OPENWALLET_INPUT,
  OPENWALLET_SUCCESS,
  OPENWALLET_FAILED_INPUT,
  OPENWALLET_INPUTPRIVPASS,
  SYNC_FAILED
} from "actions/WalletLoaderActions";

let mockSortedAvailableWallets;
let mockRemoveWallet;
let mockStartWallet;
let mockSetSelectedWallet;
let mockOpenWalletAttempt;
let mockStartRpcRequestFunc;
let mockGetSelectedWallet;
let mockGetSelectedWalletSelector;
let mockSetAutoWalletLaunching;
let testAvailableWallets;

const selectors = sel;
const wlActions = wla;
const daemonActions = da;
const clientActions = ca;

beforeEach(() => {
  const testLastAccessNow = new Date();
  const testLastAccessOneHourAgo = new Date();
  testLastAccessOneHourAgo.setHours(testLastAccessNow.getHours() - 1);

  const testLastAccessYesterday = new Date();
  testLastAccessYesterday.setHours(testLastAccessNow.getHours() - 24);

  testAvailableWallets = [
    {
      label: "test-regular-wallet",
      value: {
        wallet: "test-regular-wallet-name"
      },
      finished: true,
      lastAccess: testLastAccessOneHourAgo
    },
    {
      label: "test-unfinished-wallet",
      value: {
        wallet: "test-unfinished-wallet-name"
      },
      finished: false,
      lastAccess: testLastAccessYesterday
    },
    {
      label: "test-trezor-wallet",
      value: {
        wallet: "test-trezor-wallet-name",
        isTrezor: true
      },
      finished: true,
      lastAccess: testLastAccessOneHourAgo
    },
    {
      label: "test-privacy-wallet",
      value: {
        wallet: "test-privacy-wallet-name",
        isPrivacy: true
      },
      finished: true,
      lastAccess: testLastAccessOneHourAgo
    },
    {
      label: "test-watch-only-wallet",
      value: {
        wallet: "test-watch-only-wallet-name"
      },
      finished: true,
      isWatchingOnly: true,
      lastAccess: testLastAccessOneHourAgo
    }
  ];

  selectors.getDaemonSynced = jest.fn(() => true);
  mockRemoveWallet = daemonActions.removeWallet = jest.fn(() => () => {});
  mockSetSelectedWallet = wlActions.setSelectedWallet = jest.fn(() => () => {});
  mockGetSelectedWallet = wlActions.getSelectedWallet = jest.fn(
    () => () => null
  );
  mockOpenWalletAttempt = wlActions.openWalletAttempt = jest.fn(
    () => () => Promise.reject(OPENWALLET_FAILED_INPUT)
  );
  wlActions.spvSyncAttempt = jest.fn(() => () => Promise.reject());
  mockStartRpcRequestFunc = wlActions.startRpcRequestFunc = jest.fn(
    () => () => Promise.reject()
  );
  mockSetAutoWalletLaunching = wlActions.setAutoWalletLaunching = jest.fn(
    () => () => {}
  );
  mockStartWallet = daemonActions.startWallet = jest.fn(
    () => () => Promise.resolve()
  );
  mockSortedAvailableWallets = selectors.sortedAvailableWallets = jest.fn(
    () => testAvailableWallets
  );
  selectors.isSPV = jest.fn(() => false);
  clientActions.goToHomePage = jest.fn(() => {});
  selectors.stakeTransactions = jest.fn(() => []);
  mockGetSelectedWalletSelector = selectors.getSelectedWallet = jest.fn(
    () => () => null
  );
  selectors.autoWalletLaunching = jest.fn(() => undefined);
});

test("render wallet chooser view", async () => {
  render(<GetStartedPage />);
  await waitFor(() => screen.getByText(/welcome to decrediton/i));

  expect(mockSortedAvailableWallets).toHaveBeenCalled();
  expect(mockGetSelectedWallet).toHaveBeenCalled();

  // check regular wallet
  const regularWallet = screen.getByText(testAvailableWallets[0].value.wallet);
  expect(regularWallet).toBeInTheDocument();
  expect(regularWallet.nextSibling.nextSibling.textContent).toMatch(
    /last accessed: 1 hour ago/i
  );

  // check unfinished wallet
  const unfinishedWallet = screen.getByText(
    testAvailableWallets[1].value.wallet
  );
  expect(unfinishedWallet).toBeInTheDocument();
  expect(unfinishedWallet.nextSibling.nextSibling.textContent).toMatch(
    /setup incomplete/i
  );

  // check trezor wallet
  const trezorWallet = screen.getByText(testAvailableWallets[2].value.wallet);
  expect(trezorWallet).toBeInTheDocument();
  expect(trezorWallet.nextSibling.textContent).toMatch(/trezor/i);

  // check privacy wallet
  const privacyWallet = screen.getByText(testAvailableWallets[3].value.wallet);
  expect(privacyWallet).toBeInTheDocument();
  expect(privacyWallet.nextSibling.textContent).toMatch(/privacy/i);

  // check watching only wallet
  const watchOnlyWallet = screen.getByText(
    testAvailableWallets[4].value.wallet
  );
  expect(watchOnlyWallet).toBeInTheDocument();
  expect(watchOnlyWallet.nextSibling.textContent).toMatch(/watch only/i);

  expect(screen.getByText("Create a New Wallet")).toBeInTheDocument();
  expect(screen.getByText("Restore Existing Wallet")).toBeInTheDocument();
});

test("test editing wallets", async () => {
  render(<GetStartedPage />);
  await waitFor(() => screen.getByText(/welcome to decrediton/i));

  user.click(screen.getByText(/edit wallets/i));
  expect(screen.getByText("Close")).toBeInTheDocument();
  expect(screen.getAllByText(/remove wallet/i).length).toBe(
    testAvailableWallets.length
  );

  // test the cancel flow
  user.click(screen.getAllByText(/remove wallet/i)[0].nextElementSibling);
  expect(
    screen.getByText(/warning this action/i).textContent
  ).toMatchInlineSnapshot(
    '"Warning this action is permanent! Please make sure you have backed up your wallet\'s seed before proceeding."'
  );
  user.click(screen.getByText(/cancel/i));
  expect(screen.queryByText(/warning this action/i)).not.toBeInTheDocument();

  // test the confirm flow
  user.click(screen.getAllByText(/remove wallet/i)[0].nextElementSibling);
  user.click(screen.getByText(/confirm/i));
  expect(mockRemoveWallet).toHaveBeenCalledWith(testAvailableWallets[0]);

  expect(screen.queryByText(/warning this action/i)).not.toBeInTheDocument();
  user.click(screen.getByText("Close"));
  expect(screen.queryByText("Close")).not.toBeInTheDocument();
  expect(screen.getByText(/edit wallets/i)).toBeInTheDocument();
});

const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));
const launchWallet = async (ms) => {
  mockStartWallet = daemonActions.startWallet = jest.fn(
    () => () => Promise.resolve(true)
  );
  mockStartRpcRequestFunc = wlActions.startRpcRequestFunc = jest.fn(
    () => async (dispatch) => {
      if (ms) {
        await sleep(ms);
      }
      dispatch({ type: wlActions.SYNC_SYNCED });
      Promise.resolve();
    }
  );
  mockGetSelectedWalletSelector = selectors.getSelectedWallet = jest.fn(
    () => () => ({
      value: "mock-wallet"
    })
  );
  render(<GetStartedPage />);
  await waitFor(() => screen.getByText(/welcome to decrediton/i));

  const wallet = screen.getByText(testAvailableWallets[1].value.wallet);
  user.click(wallet);
  await waitFor(() =>
    expect(mockStartWallet).toHaveBeenCalledWith(testAvailableWallets[1])
  );
};

test("launch a wallet and click on Save button on Auto Wallet launching modal", async () => {
  await launchWallet();
  await waitFor(() => screen.getByText("Finishing to load wallet"));

  user.click(screen.getByRole("button", { name: "Open Wallet" }));
  user.click(screen.getByRole("button", { name: "Save" }));
  await waitFor(() => screen.queryByText("Automatic Wallet Launching"));

  expect(screen.getByText("Setup Wallet")).toBeInTheDocument();

  expect(mockSetSelectedWallet).toHaveBeenCalled();
  expect(mockStartWallet).toHaveBeenCalled();
  expect(mockStartRpcRequestFunc).toHaveBeenCalled();
  expect(mockGetSelectedWalletSelector).toHaveBeenCalled();
  expect(mockSetAutoWalletLaunching).toHaveBeenCalledWith(true);
});

test("launch a wallet and click on checkbox, then the Save button on Auto Wallet launching modal", async () => {
  await launchWallet();
  await waitFor(() => screen.getByText("Finishing to load wallet"));

  user.click(screen.getByRole("button", { name: "Open Wallet" }));
  user.click(screen.getByRole("checkbox"));
  user.click(screen.getByRole("button", { name: "Save" }));
  await waitFor(() => screen.queryByText("Automatic Wallet Launching"));

  expect(screen.getByText("Setup Wallet")).toBeInTheDocument();
  expect(mockSetAutoWalletLaunching).toHaveBeenCalledWith(false);
});

test("launch a wallet and click on Ask me later button on Auto Wallet launching modal", async () => {
  await launchWallet();
  await waitFor(() => screen.getByText("Finishing to load wallet"));

  user.click(screen.getByRole("button", { name: "Open Wallet" }));
  user.click(screen.getByRole("button", { name: "Ask me later" }));
  await waitFor(() => screen.queryByText("Automatic Wallet Launching"));

  expect(screen.getByText("Setup Wallet")).toBeInTheDocument();
  expect(mockSetAutoWalletLaunching).not.toHaveBeenCalled();
});

test("launch a wallet and close Auto Wallet launching modal", async () => {
  await launchWallet();
  await waitFor(() => screen.getByText("Finishing to load wallet"));

  user.click(screen.getByRole("button", { name: "Open Wallet" }));
  user.click(screen.getByRole("button", { name: "Close" }));
  await waitFor(() => screen.queryByText("Automatic Wallet Launching"));

  expect(screen.getByText("Setup Wallet")).toBeInTheDocument();
  expect(mockSetAutoWalletLaunching).not.toHaveBeenCalled();
});

test("launch a wallet and open wallet automatically ", async () => {
  selectors.autoWalletLaunching = jest.fn(() => true);
  await launchWallet();

  await waitFor(() => screen.getByText("Setup Wallet"));
  expect(mockSetAutoWalletLaunching).not.toHaveBeenCalled();
});

test("launch a wallet and cancel loading", async () => {
  await launchWallet(1000);
  await waitFor(() => screen.getByText("Cancel Loading"));
  user.click(screen.getByText("Cancel Loading"));
  await waitFor(() => screen.getByText(/welcome to decrediton/i));
  expect(mockSetAutoWalletLaunching).not.toHaveBeenCalled();
});

test("launch an encrypted wallet", async () => {
  render(<GetStartedPage />);
  await waitFor(() => screen.getByText(/welcome to decrediton/i));

  mockStartWallet = daemonActions.startWallet = jest.fn(
    () => () => Promise.reject(OPENWALLET_INPUT)
  );
  user.click(screen.getByText(testAvailableWallets[0].value.wallet));
  expect(mockStartWallet).toHaveBeenCalled();
  await waitFor(() => screen.getByText(/insert your pubkey/i));
  expect(screen.getByText(/decrypt wallet/i)).toBeInTheDocument();
  expect(
    screen.getByText(/this wallet is encrypted/i).textContent
  ).toMatchInlineSnapshot(
    '"This wallet is encrypted, please enter the public passphrase to decrypt it."'
  );
  const publicPassphraseInput =
    screen.getByPlaceholderText(/public passphrase/i);
  const testInvalidPassphrase = "invalid-passphrase";
  const testValidPassphrase = "valid-passphrase";
  const openWalletButton = screen.getByText("Open Wallet");

  // invalid passphrase
  user.type(publicPassphraseInput, testInvalidPassphrase);
  user.click(openWalletButton);
  expect(mockOpenWalletAttempt).toHaveBeenCalledWith(
    testInvalidPassphrase,
    true
  );
  await waitFor(() =>
    expect(
      screen.getByText(/wrong public passphrase/i).textContent
    ).toMatchInlineSnapshot('"Wrong public passphrase inserted."')
  );

  // invalid passphrase & unknown error
  const UNKNOWN_ERROR = "UNKNOWN_ERROR";
  mockOpenWalletAttempt = wlActions.openWalletAttempt = jest.fn(
    () => () => Promise.reject(UNKNOWN_ERROR)
  );
  user.type(publicPassphraseInput, testInvalidPassphrase);
  user.click(openWalletButton);
  expect(mockOpenWalletAttempt).toHaveBeenCalledWith(
    testInvalidPassphrase,
    true
  );
  await waitFor(() => screen.getByText(UNKNOWN_ERROR));

  // submit empty input by pressing enter
  user.clear(publicPassphraseInput);
  user.type(publicPassphraseInput, "{enter}");
  mockOpenWalletAttempt.mockClear();
  expect(mockOpenWalletAttempt).not.toHaveBeenCalled();

  // valid passphrase + submit the form by press enter
  mockOpenWalletAttempt = wlActions.openWalletAttempt = jest.fn(
    () => () => Promise.resolve(OPENWALLET_SUCCESS)
  );
  user.type(publicPassphraseInput, testValidPassphrase + "{enter}");
  await waitFor(() =>
    expect(mockOpenWalletAttempt).toHaveBeenCalledWith(
      testValidPassphrase,
      true
    )
  );
});

test("ask for passphrase if account discovery is needed", async () => {
  render(<GetStartedPage />);
  await waitFor(() => screen.getByText(/welcome to decrediton/i));

  mockStartWallet = daemonActions.startWallet = jest.fn(
    () => () => Promise.reject(OPENWALLET_INPUTPRIVPASS)
  );
  mockStartRpcRequestFunc = wlActions.startRpcRequestFunc = jest.fn(
    () => (dispatch) => {
      dispatch({ error: "status", type: SYNC_FAILED });
      return Promise.reject(OPENWALLET_INPUTPRIVPASS);
    }
  );
  user.click(screen.getByText(testAvailableWallets[0].value.wallet));
  await waitFor(() => expect(mockStartWallet).toHaveBeenCalled());
  await waitFor(() => screen.getByPlaceholderText(/private passphrase/i));
  let privatePassphraseInput =
    screen.getByPlaceholderText(/private passphrase/i);
  const testInvalidPassphrase = "invalid-passphrase";
  const testValidPassphrase = "valid-passphrase";
  let continueButton = screen.getByText("Continue");

  expect(
    screen.getByText(/type passphrase to discover accounts/i)
  ).toBeInTheDocument();
  expect(
    screen.getByText(/the accounts for this wallet/i).textContent
  ).toMatchInlineSnapshot(
    "\"The accounts for this wallet haven't been discovered yet. Please enter the wallet's private passphrase to perform account discovery.\""
  );

  // type invalid private key
  user.type(privatePassphraseInput, testInvalidPassphrase);
  user.click(continueButton);
  expect(mockStartRpcRequestFunc).toHaveBeenCalledWith(
    testInvalidPassphrase,
    undefined
  );

  await waitFor(() => screen.getByPlaceholderText(/private passphrase/i));
  privatePassphraseInput = screen.getByPlaceholderText(/private passphrase/i);
  continueButton = screen.getByText("Continue");
  // submit empty input by pressing enter
  user.clear(privatePassphraseInput);
  user.type(privatePassphraseInput, "{enter}");
  mockStartRpcRequestFunc.mockClear();
  expect(mockStartRpcRequestFunc).not.toHaveBeenCalled();

  // valid passphrase + submit the form by press enter
  mockStartRpcRequestFunc = wlActions.startRpcRequestFunc = jest.fn(
    () => () => Promise.resolve()
  );
  user.type(privatePassphraseInput, testValidPassphrase + "{enter}");
  await waitFor(() =>
    expect(mockStartRpcRequestFunc).toHaveBeenCalledWith(
      testValidPassphrase,
      undefined
    )
  );
});

test("launch an encrypted wallet and ask private passphrase too if account discovery is needed", async () => {
  render(<GetStartedPage />);
  await waitFor(() => screen.getByText(/welcome to decrediton/i));

  mockStartWallet = daemonActions.startWallet = jest.fn(
    () => () => Promise.reject(OPENWALLET_INPUT)
  );
  mockOpenWalletAttempt = wlActions.openWalletAttempt = jest.fn(
    () => () => Promise.reject(OPENWALLET_INPUTPRIVPASS)
  );

  user.click(screen.getByText(testAvailableWallets[0].value.wallet));
  expect(mockStartWallet).toHaveBeenCalled();
  await waitFor(() => screen.getByPlaceholderText(/public passphrase/i));

  const publicPassphraseInput =
    screen.getByPlaceholderText(/public passphrase/i);
  const testValidPassphrase = "valid-passphrase";

  user.type(publicPassphraseInput, testValidPassphrase + "{enter}");
  expect(mockOpenWalletAttempt).toHaveBeenCalledWith(testValidPassphrase, true);

  await waitFor(() =>
    expect(screen.getByText(/type passphrase to discover accounts/i))
  );
});

test("test isSyncingRPC in SPV mode and receive error from SPV sync", async () => {
  selectors.isSPV = jest.fn(() => true);
  wlActions.spvSyncAttempt = jest.fn(() => () => Promise.reject());
  render(<GetStartedPage />);
  await waitFor(() => screen.getByText(/welcome to decrediton/i));
});
