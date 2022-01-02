import PrivacyPage from "components/views/PrivacyPage";
import PrivacyTab from "components/views/PrivacyPage/PrivacyTab";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen, wait } from "@testing-library/react";

import { MIXED_ACCOUNT, CHANGE_ACCOUNT, DCR } from "constants";
import * as sel from "selectors";
import * as act from "actions/AccountMixerActions";
import * as wl from "wallet";
import * as ca from "actions/ControlActions";
import * as sa from "actions/SnackbarActions";

const selectors = sel;
const wallet = wl;
const controlActions = ca;
const accountMixerActions = act;
const snackbarActions = sa;

const mockDefaultAccount = {
  hidden: false,
  label: "default: 19 DCR",
  name: "default",
  accountName: "default",
  spendable: 1900000000,
  spendableAndUnit: "19 DCR",
  total: 1900000000,
  value: 0,
  accountNumber: 0
};
const mockEmptyUnMixedAccount = {
  hidden: false,
  label: "unmixed: 0.0000000 DCR",
  name: "unmixed",
  accountName: "unmixed",
  spendable: 0,
  spendableAndUnit: "0.00000 DCR",
  total: 0,
  value: 1,
  accountNumber: 1
};
const mockUnMixedAccount = {
  hidden: false,
  label: "unmixed: 10.0000000 DCR",
  name: "unmixed",
  accountName: "unmixed",
  spendable: 1000000000,
  spendableAndUnit: "10.00000 DCR",
  total: 0,
  value: 1,
  accountNumber: 1
};
const mockMixedAccount = {
  hidden: false,
  label: "mixed: 249.79547928 DCR",
  name: "mixed",
  accountName: "mixed",
  spendable: 24979547928,
  spendableAndUnit: "249.79547928 DCR",
  total: 24979547928,
  value: 2,
  accountNumber: 2
};
const mockSpendingAccounts = [
  mockDefaultAccount,
  mockMixedAccount,
  mockUnMixedAccount
];
const mockCsppServer = "mockCsppServer.decred.org";
const mockCsppPort = "1234";
const mockMixedAccountBranch = 0;
const mockNextAddress = "TsiTfsjizPgzBrPxovheccayb4UbLRmQAqY";
const mockLogLine = "mock-log-line";

let mockCreateNeededAccounts;
let mockRunAccountMixer;
let mockStopAccountMixer;
let mockToggleAllowSendFromUnmixed;
let mockConstructTransactionAttempt;
let mockGetPrivacyLogs;
let mockDispatchSingleMessage;

beforeEach(() => {
  selectors.currencyDisplay = jest.fn(() => DCR);
  selectors.defaultSpendingAccount = jest.fn(() => mockMixedAccount);
  selectors.getPrivacyEnabled = jest.fn(() => true);
  selectors.isWatchingOnly = jest.fn(() => false);
  selectors.getMixedAccountName = jest.fn(() => mockMixedAccount.name);
  selectors.getChangeAccountName = jest.fn(() => mockUnMixedAccount.name);
  selectors.getAccountMixerRunning = jest.fn(() => false);
  selectors.walletService = jest.fn(() => {
    return {};
  });
  selectors.nextAddressAccount = jest.fn(() => mockUnMixedAccount);
  selectors.nextAddress = jest.fn(() => mockNextAddress);
  selectors.getRunningIndicator = jest.fn(() => false);

  selectors.getMixedAccount = jest.fn(() => mockMixedAccount.value);
  selectors.getChangeAccount = jest.fn(() => mockUnMixedAccount.value);
  wallet.getBalance = jest.fn((_, acctId) =>
    mockSpendingAccounts.find((acc) => acc.value == acctId)
  );
  selectors.balances = jest.fn(() => mockSpendingAccounts);
  selectors.getMixedAccountSpendableBalance = jest.fn(
    () => mockMixedAccount?.spendable
  );
  selectors.getChangeAccountSpendableBalance = jest.fn(
    () => mockUnMixedAccount?.spendable
  );
  selectors.defaultSpendingAccountDisregardMixedAccount = jest.fn(
    () => mockDefaultAccount
  );
  mockGetPrivacyLogs = wallet.getPrivacyLogs = jest.fn(() => Promise.reject());
  mockCreateNeededAccounts = accountMixerActions.createNeededAccounts = jest.fn(
    () => () => {}
  );
  mockRunAccountMixer = accountMixerActions.runAccountMixer = jest.fn(
    () => () => Promise.resolve()
  );
  mockStopAccountMixer = accountMixerActions.stopAccountMixer = jest.fn(
    () => () => {}
  );

  selectors.getCsppServer = jest.fn(() => mockCsppServer);
  selectors.getCsppPort = jest.fn(() => mockCsppPort);
  selectors.getMixedAccountBranch = jest.fn(() => mockMixedAccountBranch);
  selectors.getAllowSendFromUnmixed = jest.fn(() => false);

  mockToggleAllowSendFromUnmixed = accountMixerActions.toggleAllowSendFromUnmixed = jest.fn(
    () => () => {}
  );
  controlActions.getNextAddressAttempt = jest.fn(() => () => {});
  mockConstructTransactionAttempt = controlActions.constructTransactionAttempt = jest.fn(
    () => () => {}
  );
  mockDispatchSingleMessage = snackbarActions.dispatchSingleMessage = jest.fn(
    () => () => {}
  );
});

const getCreateDefaultAccountsButton = () =>
  screen.getByRole("button", { name: "Create default Accounts" });
const getCreateNeededAccountsButton = () =>
  screen.getByRole("button", { name: "Create Needed Accounts" });
const getPrivatePassphraseInput = () =>
  screen.getByLabelText("Private Passphrase");
const getCancelButton = () => screen.getByRole("button", { name: "Cancel" });
const getContinueButton = () =>
  screen.getByRole("button", { name: "Continue" });
const getStartMixerButton = () =>
  screen.getByRole("button", { name: "Start Mixer" });
const getStopMixerButton = () =>
  screen.getByRole("button", { name: "Stop Mixer" });
const getEnableSendingFromUnmixedAccountButton = () =>
  screen.getByRole("button", { name: "Enable sending from unmixed accounts" });
const getConfirmInput = () => screen.getByTestId("confirm-input");
const getPrivacyCheckbox = () => screen.getByTestId("privacyCheckbox");
const getSendToSelfButton = () =>
  screen.getByRole("button", { name: "Send to Self" });

test("create default mixer accounts on `Privacy Configuration` view", () => {
  selectors.getMixedAccount = jest.fn(() => null);
  selectors.getChangeAccount = jest.fn(() => null);
  selectors.balances = jest.fn(() => []);
  render(<PrivacyPage />);
  user.click(screen.getByText("Privacy"));

  expect(screen.getByText("Privacy Configuration")).toBeInTheDocument();
  const testPassphrase = "test-passphrase";
  user.click(getCreateDefaultAccountsButton());
  user.type(getPrivatePassphraseInput(), testPassphrase);

  // cancel first
  user.click(getCancelButton());

  user.click(getCreateDefaultAccountsButton());
  user.type(getPrivatePassphraseInput(), testPassphrase);
  user.click(getContinueButton());

  expect(mockCreateNeededAccounts).toHaveBeenCalledWith(
    testPassphrase,
    MIXED_ACCOUNT,
    CHANGE_ACCOUNT
  );
});

test("create needed mixer accounts on `Privacy Configuration` view", () => {
  selectors.getMixedAccount = jest.fn(() => null);
  selectors.getChangeAccount = jest.fn(() => null);
  render(<PrivacyTab />);
  expect(
    screen.getByText(
      /It looks like you already have one of the default accounts/i
    ).textContent
  ).toMatchInlineSnapshot(`
    "It looks like you already have one of the default accounts: mixed and unmixed.
              You will need to create 2 new accounts for using the mixer. This action can not be undone"
  `);
  expect(screen.getByText("Privacy Configuration")).toBeInTheDocument();
  const testPassphrase = "test-passphrase";
  const testMixedAccountName = "test-mixed-account-name";
  const testUnMixedAccountName = "test-unmixed-account-name";
  user.click(getCreateNeededAccountsButton());
  user.type(getPrivatePassphraseInput(), testPassphrase);

  // cancel first
  user.click(getCancelButton());

  user.click(getCreateNeededAccountsButton());
  user.type(getPrivatePassphraseInput(), testPassphrase);
  user.type(screen.getByLabelText("Mixed Account Name"), testMixedAccountName);
  user.type(
    screen.getByLabelText("Unmixed Account Name"),
    testUnMixedAccountName
  );
  user.click(getContinueButton());

  expect(mockCreateNeededAccounts).toHaveBeenCalledWith(
    testPassphrase,
    testMixedAccountName,
    testUnMixedAccountName
  );
});

test("test insufficient unmixed account balance error message", async () => {
  selectors.balances = jest.fn(() => [
    mockDefaultAccount,
    mockMixedAccount,
    mockEmptyUnMixedAccount
  ]);
  selectors.getChangeAccountSpendableBalance = jest.fn(() => 0);
  wallet.getBalance = jest.fn((_, acctId) =>
    [mockDefaultAccount, mockMixedAccount, mockEmptyUnMixedAccount].find(
      (acc) => acc.value == acctId
    )
  );
  render(<PrivacyTab />);
  await wait(() =>
    expect(screen.getByText("Unmixed Balance").parentNode.className).toMatch(
      /balanceError/i
    )
  );
  expect(
    screen.getByText("Insufficient unmixed account balance")
  ).toBeInTheDocument();
  expect(getStartMixerButton().disabled).toBe(true);
});

test("start coin mixer", async () => {
  render(<PrivacyTab />);
  await wait(() =>
    expect(
      screen.getByText("Unmixed Balance").parentNode.className
    ).not.toMatch(/balanceError/i)
  );
  expect(
    screen.queryByText("Insufficient unmixed account balance")
  ).not.toBeInTheDocument();
  const startMixerButton = getStartMixerButton();
  expect(startMixerButton.disabled).toBe(false);
  expect(screen.getByText("Mixer is not running")).toBeInTheDocument();
  expect(
    screen.getByText("Unmixed Balance").parentNode.textContent
  ).toMatchInlineSnapshot('"10.00000 DCRUnmixed Balance"');
  expect(
    screen.getByText("Mixed Balance").parentNode.textContent
  ).toMatchInlineSnapshot('"249.79547928 DCRMixed Balance"');

  const testPassphrase = "test-passphrase";
  user.click(startMixerButton);

  // cancel first
  user.click(getCancelButton());

  user.click(startMixerButton);

  user.type(getPrivatePassphraseInput(), testPassphrase);
  user.click(getContinueButton());

  expect(mockRunAccountMixer).toHaveBeenCalledWith({
    changeAccount: mockUnMixedAccount.accountNumber,
    mixedAccount: mockMixedAccount.accountNumber,
    passphrase: testPassphrase,
    csppServer: `${mockCsppServer}:${mockCsppPort}`,
    mixedAccountBranch: mockMixedAccountBranch
  });
});

test("stop coin mixer", () => {
  selectors.getAccountMixerRunning = jest.fn(() => true);
  render(<PrivacyTab />);

  expect(screen.getByText("Mixer is running")).toBeInTheDocument();
  user.click(getStopMixerButton());

  expect(mockStopAccountMixer).toHaveBeenCalled();
});

test("mixer is disabled (Autobuyer running)", () => {
  selectors.getRunningIndicator = jest.fn(() => true);
  render(<PrivacyTab />);

  expect(getSendToSelfButton().disabled).toBe(true);
  expect(getStartMixerButton().disabled).toBe(true);
});

test("allow sending from unmixed accounts", () => {
  render(<PrivacyTab />);

  const checkbox = getPrivacyCheckbox();

  expect(checkbox.checked).toBe(false);
  user.click(checkbox);

  expect(screen.getByText("Sending from Unmixed Accounts")).toBeInTheDocument();
  expect(getEnableSendingFromUnmixedAccountButton().disabled).toBe(true);
  // cancel first
  user.click(getCancelButton());

  user.click(checkbox);

  // type random text, enable button should stay disabled
  user.type(getConfirmInput(), "random text");
  expect(getEnableSendingFromUnmixedAccountButton().disabled).toBe(true);

  user.clear(getConfirmInput());
  user.type(getConfirmInput(), "I understand the risks");
  user.click(getEnableSendingFromUnmixedAccountButton());

  expect(mockToggleAllowSendFromUnmixed).toHaveBeenCalledWith(true);
});

test("sending from unmixed accounts is allowed already", () => {
  selectors.getAllowSendFromUnmixed = jest.fn(() => true);
  render(<PrivacyTab />);

  const checkbox = getPrivacyCheckbox();
  expect(checkbox.checked).toBe(true);

  user.click(checkbox);
  expect(mockToggleAllowSendFromUnmixed).toHaveBeenCalledWith(false);
});

test("Send to Unmixed Account form", async () => {
  render(<PrivacyTab />);
  const sendToSelfBtn = getSendToSelfButton();
  const amountInput = screen.getByLabelText("Amount:");
  const testAmount = "12";
  expect(sendToSelfBtn.disabled).toBe(true);

  user.type(amountInput, testAmount);

  await wait(() => expect(mockConstructTransactionAttempt).toHaveBeenCalled());

  user.click(
    screen.getByText("Send all funds from selected account").nextElementSibling
  );
  expect(screen.getByText("Amount:").nextElementSibling.textContent).toBe(
    "19.00000 DCR"
  );
  user.click(screen.getByText("Cancel sending all funds").nextElementSibling);
  expect(screen.getByLabelText("Amount:").value).toBe("");
});

test("check logs", async () => {
  mockGetPrivacyLogs = wallet.getPrivacyLogs = jest.fn(() =>
    Promise.resolve(mockLogLine)
  );
  render(<PrivacyTab />);

  const logsLabel = screen.getByText("Logs");

  user.click(logsLabel);

  await wait(() => expect(mockGetPrivacyLogs).toHaveBeenCalledTimes(2));
  await wait(() => screen.getByText(mockLogLine));

  user.click(logsLabel);
  await wait(() =>
    expect(screen.queryByText(mockLogLine)).not.toBeInTheDocument()
  );
});

test("privacy configuration have to be disabled in watching only (already have mixed or unmixed account)", () => {
  selectors.getMixedAccount = jest.fn(() => null);
  selectors.getChangeAccount = jest.fn(() => null);
  selectors.isWatchingOnly = jest.fn(() => true);
  render(<PrivacyTab />);
  user.click(getCreateNeededAccountsButton());
  expect(mockDispatchSingleMessage).toHaveBeenCalledTimes(1);
});

test("privacy configuration have to be disabled in watching only ", () => {
  selectors.getMixedAccount = jest.fn(() => null);
  selectors.getChangeAccount = jest.fn(() => null);
  selectors.isWatchingOnly = jest.fn(() => true);
  selectors.balances = jest.fn(() => []);
  render(<PrivacyTab />);
  user.click(getCreateDefaultAccountsButton());
  expect(mockDispatchSingleMessage).toHaveBeenCalledTimes(1);
});
