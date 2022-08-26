import DexPage from "components/views/DexPage";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen, wait } from "@testing-library/react";
import * as sel from "selectors";
import * as da from "actions/DexActions";
import copy from "clipboard-copy";
import { DCR } from "constants";
jest.mock("clipboard-copy");

const selectors = sel;
const dexActions = da;

const testPassphrase = "test-passphrase";
const testDexPassphrase = "test-dex-passphrase";
const testSeed = "test-seed";
const testAccountName = "test-account-name";

let mockOnEnableDex;
let mockInitDex;
let mockCopy;
let mockConfirmDexSeed;
let mockCreateDexAccount;
let mockSelectDexAccount;
let mockCreateWalletDex;
let mockLaunchDexWindow;
let mockLoginDex;

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

test("enable dex view", () => {
  selectors.dexEnabled = jest.fn(() => false);
  render(<DexPage />);
  const enableBtn = getEnableBtn();
  user.click(enableBtn);

  expect(screen.getByText("Wallet reset required")).toBeInTheDocument();

  // cancel first
  user.click(getCancelBtn());

  user.click(enableBtn);
  user.click(getConfirmBtn());

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
  expect(screen.getByText("Dex not running")).toBeInTheDocument();
  expect(screen.getByText(/Critical Error/).textContent).toMatchInlineSnapshot(
    '"Critical Error! DEX is not running.  Please restart and check logs if problem persists."'
  );
});

const testPassphraseModal = () => {
  const contineBtn = getContinueBtn();
  const confirmInput = screen.getByLabelText("Confirm");
  const newPassphraseInput = screen.getByLabelText("New Passphrase");
  user.clear(newPassphraseInput);
  user.clear(confirmInput);
  expect(contineBtn.disabled).toBeTruthy();
  user.type(newPassphraseInput, testPassphrase);
  expect(contineBtn.disabled).toBeTruthy();
  user.type(confirmInput, testPassphrase + "-2");
  expect(contineBtn.disabled).toBeTruthy(); // disabled until Confirm is different
  user.clear(confirmInput);
  user.type(confirmInput, testPassphrase);
  expect(contineBtn.disabled).toBeFalsy();

  user.click(contineBtn);
};

test("init dex without DEX seed", () => {
  render(<DexPage />);
  expect(screen.getByText("Set DEX Password")).toBeInTheDocument();
  const setDexPasshpraseBtn = getSetDexPasshpraseBtn();
  user.click(setDexPasshpraseBtn);

  //cancel first
  user.click(getCancelBtn());
  user.click(setDexPasshpraseBtn);

  testPassphraseModal();

  expect(mockInitDex).toHaveBeenCalledWith(testPassphrase);
});

test("init dex with DEX seed", () => {
  render(<DexPage />);
  expect(screen.getByText("Set DEX Password")).toBeInTheDocument();

  const hasDexSeedInput = screen.getByLabelText(
    "I already have a DEX seed to recover."
  );

  expect(queryDexSeedInput()).not.toBeInTheDocument();
  expect(hasDexSeedInput.checked).toBeFalsy();
  user.click(hasDexSeedInput);
  expect(hasDexSeedInput.checked).toBeTruthy();
  // toggle off and back
  user.click(hasDexSeedInput);
  user.click(hasDexSeedInput);

  // continue without entering seed
  user.click(getSetDexPasshpraseBtn());
  testPassphraseModal();
  expect(mockInitDex).not.toHaveBeenCalled();
  expect(screen.getByText("You must enter a seed.")).toBeInTheDocument();

  // continue with entering seed
  user.type(getDexSeedInput(), testSeed);
  user.click(getSetDexPasshpraseBtn());
  testPassphraseModal();
  expect(mockInitDex).toHaveBeenCalledWith(testPassphrase, testSeed);
});

test("test confirm seed view", () => {
  selectors.dexInit = jest.fn(() => true);
  render(<DexPage />);
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
  user.click(getRevealBtn());
  expect(screen.getByText(testSeed)).toBeInTheDocument();

  user.click(getCopyButton());
  expect(mockCopy).toHaveBeenCalledWith(testSeed);

  user.click(getConfirmSubmitButton());
  expect(mockConfirmDexSeed).toHaveBeenCalled();
});

const testCreateDexAccountModal = () => {
  const contineBtn = getContinueBtn();
  const newAccountNameInput = screen.getByLabelText("New Account Name");
  const privatePassphraseInput = screen.getByLabelText("Private Passphrase");
  user.clear(privatePassphraseInput);
  user.clear(newAccountNameInput);
  expect(contineBtn.disabled).toBeTruthy();
  user.type(privatePassphraseInput, testPassphrase);
  user.type(newAccountNameInput, testAccountName);
  user.click(contineBtn);
};

test("test create dex account", async () => {
  selectors.dexInit = jest.fn(() => true);
  selectors.confirmDexSeed = jest.fn(() => true);
  render(<DexPage />);
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
  user.click(createDexAccountButton);
  //cancel first
  user.click(getCancelBtn());

  user.click(createDexAccountButton);
  testCreateDexAccountModal();

  expect(mockCreateDexAccount).toHaveBeenCalledWith(
    testPassphrase,
    testAccountName
  );

  // select an existing account
  const selectAnExistingAccountButton = getSelectAnExistingAccountButton();
  expect(selectAnExistingAccountButton.disabled).toBeTruthy();
  user.click(screen.getByText("Select account"));
  // mixed account in not in the list
  expect(screen.queryByText("mixed")).not.toBeInTheDocument();
  user.click(screen.getByText(mockAccount2.name));

  await wait(() =>
    expect(screen.queryByText("Select account")).not.toBeInTheDocument()
  );

  expect(selectAnExistingAccountButton.disabled).toBeFalsy();
  user.click(selectAnExistingAccountButton);
  expect(mockSelectDexAccount).toHaveBeenCalledWith(mockAccount2.name);
});

const testConnectDCRWalletModal = () => {
  const contineBtn = getContinueBtn();
  const privatePassphraseInput = screen.getByLabelText("Private Passphrase");
  const dexPassphraseInput = screen.getByLabelText("DEX Passphrase");
  user.clear(privatePassphraseInput);
  user.clear(dexPassphraseInput);
  expect(contineBtn.disabled).toBeTruthy();
  user.type(privatePassphraseInput, testPassphrase);
  user.type(dexPassphraseInput, testDexPassphrase);
  user.click(contineBtn);
};

test("test connect dex wallet view", () => {
  selectors.dexInit = jest.fn(() => true);
  selectors.confirmDexSeed = jest.fn(() => true);
  selectors.dexAccount = jest.fn(() => mockAccount2.name);

  render(<DexPage />);

  expect(screen.getByText("Connect DCR Wallet to Dex")).toBeInTheDocument();
  expect(
    screen.getByText("Connect your DCR wallet to the DEX.")
  ).toBeInTheDocument();

  const connectDCRWalletButton = getConnectDCRWalletButton();

  user.click(connectDCRWalletButton);
  //cancel first
  user.click(getCancelBtn());

  user.click(connectDCRWalletButton);

  testConnectDCRWalletModal();

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

test("test launch DEX view", () => {
  selectors.dexInit = jest.fn(() => true);
  selectors.confirmDexSeed = jest.fn(() => true);
  selectors.dexAccount = jest.fn(() => mockAccount2.name);
  selectors.dexDCRWalletRunning = jest.fn(() => true);

  render(<DexPage />);

  user.click(screen.getByRole("button", { name: "Launch DEX Window" }));

  expect(mockLaunchDexWindow).toHaveBeenCalled();
});

test("test login view", () => {
  selectors.dexInit = jest.fn(() => true);
  selectors.confirmDexSeed = jest.fn(() => true);
  selectors.dexAccount = jest.fn(() => mockAccount2.name);
  selectors.dexDCRWalletRunning = jest.fn(() => true);
  selectors.loggedInDex = jest.fn(() => false);

  render(<DexPage />);

  expect(screen.getByText("DEX Login")).toBeInTheDocument();
  expect(
    screen.getByText("Login and connect wallet to Dex")
  ).toBeInTheDocument();

  const loginButton = getLoginBtn();

  user.click(loginButton);
  //cancel first
  user.click(getCancelBtn());

  user.click(loginButton);

  const contineBtn = getContinueBtn();
  const dexPassphraseInput = screen.getByLabelText("DEX Passphrase");
  expect(contineBtn.disabled).toBeTruthy();
  user.type(dexPassphraseInput, testDexPassphrase);
  user.click(contineBtn);

  expect(mockLoginDex).toHaveBeenCalledWith(testDexPassphrase);
});
