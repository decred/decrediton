import DexPage from "components/views/DexPage";
import { render } from "test-utils.js";
import { screen, waitFor, act } from "@testing-library/react";
import * as sel from "selectors";
import * as da from "actions/DexActions";
import * as dm from "actions/DaemonActions";
import copy from "clipboard-copy";
import { DCR } from "constants";
jest.mock("clipboard-copy");

const selectors = sel;
const dexActions = da;
const daemonActions = dm;

const testPassphrase = "test-passphrase";
const testDexPassphrase = "test-dex-passphrase";
const testSeed = "test-seed";
const testAccountName = "test-account-name";
const testLog = "test-log";
const testLog2 = "test-log2";

let mockOnEnableDex;
let mockInitDex;
let mockCopy;
let mockConfirmDexSeed;
let mockCreateDexAccount;
let mockSelectDexAccount;
let mockCreateWalletDex;
let mockLaunchDexWindow;
let mockLoginDex;
let mockGetDexLogs;

const mockMixedAccountValue = 6;

const mockDefaultAccount = {
  hidden: false,
  label: "default: 19 DCR",
  name: "default",
  spendable: 1900000000,
  spendableAndUnit: "19 DCR",
  total: 1900000000,
  value: 0
};
const mockUnmixedAccount = {
  hidden: false,
  label: "unmixed: 249.79547928 DCR",
  name: "unmixed",
  spendable: 24979547928,
  spendableAndUnit: "249.79547928 DCR",
  total: 24979547928,
  value: 1
};
const mockAccount2 = {
  hidden: false,
  label: "account-2: 7.4998063 DCR",
  name: "account-2",
  spendable: 749980630,
  spendableAndUnit: "7.4998063 DCR",
  total: 749980630,
  value: 2
};
const mockMixedAccount = {
  hidden: false,
  label: "mixed: 0 DCR",
  name: "mixed",
  spendable: 0,
  spendableAndUnit: "0 DCR",
  total: 0,
  value: mockMixedAccountValue
};
const mockSpendableAccounts = [
  mockDefaultAccount,
  mockUnmixedAccount,
  mockAccount2
];
const mockVisibleAccounts = [
  mockDefaultAccount,
  mockUnmixedAccount,
  mockAccount2,
  mockMixedAccount
];

beforeEach(() => {
  mockCopy = copy.mockImplementation(() => true);
  selectors.enableDexAttempt = jest.fn(() => false);
  selectors.dexEnabled = jest.fn(() => true);
  selectors.dexActive = jest.fn(() => true);
  selectors.confirmDexSeed = jest.fn(() => false);
  selectors.dexReady = jest.fn(() => false);
  selectors.dexInit = jest.fn(() => false);
  selectors.loggedInDex = jest.fn(() => true);
  selectors.dexSeed = jest.fn(() => testSeed);
  selectors.spendingAccounts = jest.fn(() => mockSpendableAccounts);
  selectors.visibleAccounts = jest.fn(() => mockVisibleAccounts);
  selectors.getMixedAccount = jest.fn(() => mockMixedAccountValue);
  selectors.currencyDisplay = jest.fn(() => DCR);
  selectors.createWalletDexAttempt = jest.fn(() => false);

  mockOnEnableDex = dexActions.enableDex = jest.fn(() => () => {});
  mockInitDex = dexActions.initDex = jest.fn(() => () => {});
  mockConfirmDexSeed = dexActions.confirmDexSeed = jest.fn(() => () => {});
  mockCreateDexAccount = dexActions.createDexAccount = jest.fn(() => () => {});
  mockSelectDexAccount = dexActions.selectDexAccount = jest.fn(() => () => {});
  mockCreateWalletDex = dexActions.createWalletDex = jest.fn(() => () => {});
  mockLaunchDexWindow = dexActions.launchDexWindow = jest.fn(() => () => {});
  mockLoginDex = dexActions.loginDex = jest.fn(() => () => {});
  mockGetDexLogs = daemonActions.getDexLogs = jest.fn(
    () => () => Promise.resolve(testLog)
  );
});

const getEnableBtn = () => screen.getByRole("button", { name: "Enable DEX" });
const queryEnableBtn = () =>
  screen.queryByRole("button", { name: "Enable DEX" });
const getConfirmBtn = () => screen.getByRole("button", { name: "Confirm" });
const getCancelBtn = () => screen.getByRole("button", { name: "Cancel" });
const getSetDexPasshpraseBtn = () =>
  screen.getByRole("button", { name: "Set DEX Passphrase" });
const getContinueBtn = () => screen.getByRole("button", { name: "Continue" });
const getDexSeedInput = () => screen.getByPlaceholderText("DEX Seed");
const queryDexSeedInput = () => screen.queryByPlaceholderText("DEX Seed");
const getRevealBtn = () => screen.getByText("Click to reveal DEX Account Seed");
const getCopyButton = () => screen.getByRole("button", { name: "Copy" });
const getConfirmSubmitButton = () =>
  screen.getByRole("button", { name: "I have copied the DEX Account Seed" });
const getCreateDexAccountButton = () =>
  screen.getByRole("button", { name: "Create DEX Account" });
const getSelectAnExistingAccountButton = () =>
  screen.getByRole("button", { name: "Select an existing account" });
const getConnectDCRWalletButton = () =>
  screen.getByRole("button", { name: "Connect DCR Wallet" });
const getLoginBtn = () => screen.queryByRole("button", { name: "Login" });

test("enable dex view", async () => {
  selectors.dexEnabled = jest.fn(() => false);
  const { user } = render(<DexPage />);
  const enableBtn = getEnableBtn();
  await user.click(enableBtn);

  expect(screen.getByText("Wallet restart required")).toBeInTheDocument();

  // cancel first
  await user.click(getCancelBtn());

  await user.click(enableBtn);
  await user.click(getConfirmBtn());

  expect(mockOnEnableDex).toHaveBeenCalled();
});

test("enabling dex is in progress", () => {
  selectors.dexEnabled = jest.fn(() => false);
  selectors.enableDexAttempt = jest.fn(() => true);
  render(<DexPage />);
  expect(queryEnableBtn()).not.toBeInTheDocument();
});

test("dex is enabled, but not running", () => {
  selectors.dexActive = jest.fn(() => false);
  render(<DexPage />);
  expect(screen.getByText("DEX Error")).toBeInTheDocument();
  expect(screen.getByText("DEX not running")).toBeInTheDocument();
  expect(screen.getByText(/Critical Error/).textContent).toMatchInlineSnapshot(
    '"Critical Error! DEX is not running.  Please restart and check logs if problem persists."'
  );
});

const testPassphraseModal = async (user) => {
  const contineBtn = getContinueBtn();
  const confirmInput = screen.getByLabelText("Confirm");
  const newPassphraseInput = screen.getByLabelText("New Passphrase");
  await user.clear(newPassphraseInput);
  await user.clear(confirmInput);
  expect(contineBtn.disabled).toBeTruthy();
  await user.type(newPassphraseInput, testPassphrase);
  expect(contineBtn.disabled).toBeTruthy();
  await user.type(confirmInput, testPassphrase + "-2");
  expect(contineBtn.disabled).toBeTruthy(); // disabled until Confirm is different
  await user.clear(confirmInput);
  await user.type(confirmInput, testPassphrase);
  expect(contineBtn.disabled).toBeFalsy();

  await user.click(contineBtn);
};

test("init dex without DEX seed", async () => {
  const { user } = render(<DexPage />);
  expect(screen.getByText("Set DEX Password")).toBeInTheDocument();
  const setDexPasshpraseBtn = getSetDexPasshpraseBtn();
  await user.click(setDexPasshpraseBtn);

  //cancel first
  await user.click(getCancelBtn());
  await user.click(setDexPasshpraseBtn);

  await testPassphraseModal(user);

  expect(mockInitDex).toHaveBeenCalledWith(testPassphrase);
});

test("init dex with DEX seed", async () => {
  const { user } = render(<DexPage />);
  expect(screen.getByText("Set DEX Password")).toBeInTheDocument();

  const hasDexSeedInput = screen.getByLabelText(
    "I already have a DEX seed to recover."
  );

  expect(queryDexSeedInput()).not.toBeInTheDocument();
  expect(hasDexSeedInput.checked).toBeFalsy();
  await user.click(hasDexSeedInput);
  expect(hasDexSeedInput.checked).toBeTruthy();
  // toggle off and back
  await user.click(hasDexSeedInput);
  await user.click(hasDexSeedInput);

  // continue without entering seed
  await user.click(getSetDexPasshpraseBtn());
  await testPassphraseModal(user);
  expect(mockInitDex).not.toHaveBeenCalled();
  expect(screen.getByText("You must enter a seed.")).toBeInTheDocument();

  // continue with entering seed
  await user.type(getDexSeedInput(), testSeed);
  await user.click(getSetDexPasshpraseBtn());
  await testPassphraseModal(user);
  expect(mockInitDex).toHaveBeenCalledWith(testPassphrase, testSeed);
});

test("test confirm seed view", async () => {
  selectors.dexInit = jest.fn(() => true);
  const { user } = render(<DexPage />);
  expect(screen.getByText("Confirm DEX Account Seed")).toBeInTheDocument();
  expect(
    screen.getByText("Please confirm your DEX account seed before proceeding.")
  ).toBeInTheDocument();
  expect(
    screen.getByText(/You should carefully write down/).textContent
  ).toMatchInlineSnapshot(
    '"You should carefully write down your application seed and save a copy. Should you lose access to this machine or the critical application files, the seed can be used to restore your DEX accounts and native wallets. DEX accounts created in prior versions are not recoverable with this seed, so be sure to export any such accounts from the DEX Settings page."'
  );

  expect(screen.queryByText(testSeed)).not.toBeInTheDocument();
  await user.click(getRevealBtn());
  expect(screen.getByText(testSeed)).toBeInTheDocument();

  await user.click(getCopyButton());
  expect(mockCopy).toHaveBeenCalledWith(testSeed);

  await user.click(getConfirmSubmitButton());
  expect(mockConfirmDexSeed).toHaveBeenCalled();
});

const testCreateDexAccountModal = async (user) => {
  const contineBtn = getContinueBtn();
  const newAccountNameInput = screen.getByLabelText("New Account Name");
  const privatePassphraseInput = screen.getByLabelText("Private Passphrase");
  await user.clear(privatePassphraseInput);
  await user.clear(newAccountNameInput);
  expect(contineBtn.disabled).toBeTruthy();
  await user.type(privatePassphraseInput, testPassphrase);
  await user.type(newAccountNameInput, testAccountName);
  await user.click(contineBtn);
};

test("test create dex account", async () => {
  selectors.dexInit = jest.fn(() => true);
  selectors.confirmDexSeed = jest.fn(() => true);
  const { user } = render(<DexPage />);
  expect(
    screen.getByText(
      "A new account is required to be created to improve security for the wallet overall."
    )
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Please create a new or select an/).textContent
  ).toMatchInlineSnapshot(
    '"Please create a new or select an existing account that will be connected to the DEX.  Transfer funds in and out of this account to deposit/withdrawal funds from what is accessible at the DEX.Create DEX AccountorSelect accountSelect an existing account"'
  );

  // create a new dex account
  const createDexAccountButton = getCreateDexAccountButton();
  await user.click(createDexAccountButton);
  //cancel first
  await user.click(getCancelBtn());

  await user.click(createDexAccountButton);
  await testCreateDexAccountModal(user);

  expect(mockCreateDexAccount).toHaveBeenCalledWith(
    testPassphrase,
    testAccountName
  );

  // select an existing account
  const selectAnExistingAccountButton = getSelectAnExistingAccountButton();
  expect(selectAnExistingAccountButton.disabled).toBeTruthy();
  await user.click(screen.getByText("Select account"));
  // mixed account in not in the list
  expect(screen.queryByText("mixed")).not.toBeInTheDocument();
  await user.click(screen.getByText(mockAccount2.name));

  await waitFor(() =>
    expect(screen.queryByText("Select account")).not.toBeInTheDocument()
  );

  expect(selectAnExistingAccountButton.disabled).toBeFalsy();
  await user.click(selectAnExistingAccountButton);
  expect(mockSelectDexAccount).toHaveBeenCalledWith(mockAccount2.name);
});

const testConnectDCRWalletModal = async (user) => {
  const contineBtn = getContinueBtn();
  const privatePassphraseInput = screen.getByLabelText("Private Passphrase");
  const dexPassphraseInput = screen.getByLabelText("DEX Passphrase");
  await user.clear(privatePassphraseInput);
  await user.clear(dexPassphraseInput);
  expect(contineBtn.disabled).toBeTruthy();
  await user.type(privatePassphraseInput, testPassphrase);
  await user.type(dexPassphraseInput, testDexPassphrase);
  await user.click(contineBtn);
};

test("test connect dex wallet view", async () => {
  selectors.dexInit = jest.fn(() => true);
  selectors.confirmDexSeed = jest.fn(() => true);
  selectors.dexAccount = jest.fn(() => mockAccount2.name);

  const { user } = render(<DexPage />);

  expect(screen.getByText("Connect DCR Wallet to DEX")).toBeInTheDocument();
  expect(
    screen.getByText("Connect your DCR wallet to the DEX.")
  ).toBeInTheDocument();

  const connectDCRWalletButton = getConnectDCRWalletButton();

  await user.click(connectDCRWalletButton);
  //cancel first
  await user.click(getCancelBtn());

  await user.click(connectDCRWalletButton);

  await testConnectDCRWalletModal(user);

  expect(mockCreateWalletDex).toHaveBeenCalledWith(
    testPassphrase,
    testDexPassphrase,
    mockAccount2.name
  );
});

test("connecting DCR wallet is in progress", () => {
  selectors.dexInit = jest.fn(() => true);
  selectors.confirmDexSeed = jest.fn(() => true);
  selectors.dexAccount = jest.fn(() => mockAccount2.name);
  selectors.createWalletDexAttempt = jest.fn(() => true);
  render(<DexPage />);
  expect(queryEnableBtn()).not.toBeInTheDocument();
});

test("test launch DEX view", async () => {
  selectors.dexInit = jest.fn(() => true);
  selectors.confirmDexSeed = jest.fn(() => true);
  selectors.dexAccount = jest.fn(() => mockAccount2.name);
  selectors.dexDCRWalletRunning = jest.fn(() => true);

  const { user } = render(<DexPage />);

  await user.click(screen.getByRole("button", { name: "Launch DEX Window" }));

  expect(mockLaunchDexWindow).toHaveBeenCalled();
});

test("test login view", async () => {
  selectors.dexInit = jest.fn(() => true);
  selectors.confirmDexSeed = jest.fn(() => true);
  selectors.dexAccount = jest.fn(() => mockAccount2.name);
  selectors.dexDCRWalletRunning = jest.fn(() => true);
  selectors.loggedInDex = jest.fn(() => false);

  const { user } = render(<DexPage />);

  expect(screen.getByText("DEX Login")).toBeInTheDocument();
  expect(
    screen.getByText("Login and connect wallet to DEX")
  ).toBeInTheDocument();

  const loginButton = getLoginBtn();

  await user.click(loginButton);
  //cancel first
  await user.click(getCancelBtn());

  await user.click(loginButton);

  const contineBtn = getContinueBtn();
  const dexPassphraseInput = screen.getByLabelText("DEX Passphrase");
  expect(contineBtn.disabled).toBeTruthy();
  await user.type(dexPassphraseInput, testDexPassphrase);
  await user.click(contineBtn);

  expect(mockLoginDex).toHaveBeenCalledWith(testDexPassphrase);
});

test("test when dex is ready", async () => {
  selectors.dexInit = jest.fn(() => true);
  selectors.dexReady = jest.fn(() => true);
  jest.useFakeTimers();

  const { user } = render(<DexPage />);
  await user.click(screen.getByRole("button", { name: "Launch DEX Window" }));

  await waitFor(() => expect(mockGetDexLogs).toHaveBeenCalled());
  expect(screen.queryByText(testLog)).not.toBeInTheDocument();
  await user.click(screen.getByText("Logs"));
  await waitFor(() => expect(screen.getByText(testLog)).toBeInTheDocument());
  // hide log
  await user.click(screen.getByText("Logs"));
  expect(screen.queryByText(testLog)).not.toBeInTheDocument();

  // show again
  await user.click(screen.getByText("Logs"));

  mockGetDexLogs.mockClear();
  mockGetDexLogs = daemonActions.getDexLogs = jest.fn(
    () => () => Promise.resolve(testLog2)
  );
  act(() => {
    jest.advanceTimersByTime(2001);
  });

  await waitFor(() => {
    expect(mockGetDexLogs).toHaveBeenCalled();
    expect(screen.getByText(testLog2)).toBeInTheDocument();
    expect(screen.queryByText(testLog)).not.toBeInTheDocument();
    expect(mockLaunchDexWindow).toHaveBeenCalled();
  });
});

test("receive error while getting error", async () => {
  selectors.dexInit = jest.fn(() => true);
  selectors.dexReady = jest.fn(() => true);
  jest.useFakeTimers();

  mockGetDexLogs = daemonActions.getDexLogs = jest.fn(
    () => () => Promise.reject("error")
  );
  const { user } = render(<DexPage />);

  await waitFor(() => expect(mockGetDexLogs).toHaveBeenCalled());
  expect(screen.queryByText(testLog)).not.toBeInTheDocument();
  await user.click(screen.getByText("Logs"));
  expect(screen.queryByText(testLog)).not.toBeInTheDocument();

  mockGetDexLogs.mockClear();
  act(() => {
    jest.advanceTimersByTime(2001);
  });

  await waitFor(() => expect(mockGetDexLogs).toHaveBeenCalled());
  expect(screen.queryByText(testLog)).not.toBeInTheDocument();
});
