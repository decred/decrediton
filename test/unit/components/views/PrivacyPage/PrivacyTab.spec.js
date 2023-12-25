import PrivacyPage from "components/views/PrivacyPage";
import PrivacyTab from "components/views/PrivacyPage/PrivacyTab";
import { render } from "test-utils.js";
import { screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import { MIXED_ACCOUNT, CHANGE_ACCOUNT, DCR } from "constants";
import * as sel from "selectors";
import * as actM from "actions/AccountMixerActions";
import * as wl from "wallet";
import * as ca from "actions/ControlActions";
import * as sa from "actions/SnackbarActions";

const selectors = sel;
const wallet = wl;
const controlActions = ca;
const accountMixerActions = actM;
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

const mockVisibleAccounts = [
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
  selectors.visibleAccounts = jest.fn(() => mockVisibleAccounts);
  selectors.getPrivacyEnabled = jest.fn(() => true);
  selectors.isWatchingOnly = jest.fn(() => false);
  selectors.getMixedAccountName = jest.fn(() => mockMixedAccount.name);
  selectors.getChangeAccountName = jest.fn(() => mockUnMixedAccount.name);
  selectors.getAccountMixerRunning = jest.fn(() => false);
  selectors.walletService = jest.fn(() => {
    return {};
  });
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

  mockToggleAllowSendFromUnmixed =
    accountMixerActions.toggleAllowSendFromUnmixed = jest.fn(() => () => {});
  controlActions.getNextAddressAttempt = jest.fn(() => () => {});
  mockConstructTransactionAttempt = controlActions.constructTransactionAttempt =
    jest.fn(() => () => {});
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

test("create default mixer accounts on `Privacy Configuration` view", async () => {
  selectors.getMixedAccount = jest.fn(() => null);
  selectors.getChangeAccount = jest.fn(() => null);
  selectors.balances = jest.fn(() => []);
  const { user } = render(<PrivacyPage />);
  await user.click(screen.getByText("Privacy"));

  expect(screen.getByText("Privacy Configuration")).toBeInTheDocument();
  const testPassphrase = "test-passphrase";
  await user.click(getCreateDefaultAccountsButton());
  await user.type(getPrivatePassphraseInput(), testPassphrase);

  // cancel first
  await user.click(getCancelButton());

  await user.click(getCreateDefaultAccountsButton());
  await user.type(getPrivatePassphraseInput(), testPassphrase);
  await user.click(getContinueButton());

  expect(mockCreateNeededAccounts).toHaveBeenCalledWith(
    testPassphrase,
    MIXED_ACCOUNT,
    CHANGE_ACCOUNT
  );
});

test("create needed mixer accounts on `Privacy Configuration` view", async () => {
  selectors.getMixedAccount = jest.fn(() => null);
  selectors.getChangeAccount = jest.fn(() => null);
  const { user } = render(<PrivacyTab />);
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
  await user.click(getCreateNeededAccountsButton());
  await user.type(getPrivatePassphraseInput(), testPassphrase);

  // cancel first
  await user.click(getCancelButton());

  await user.click(getCreateNeededAccountsButton());
  await user.type(getPrivatePassphraseInput(), testPassphrase);
  await user.type(
    screen.getByLabelText("Mixed Account Name"),
    testMixedAccountName
  );
  await user.type(
    screen.getByLabelText("Unmixed Account Name"),
    testUnMixedAccountName
  );
  await user.click(getContinueButton());

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
  render(<PrivacyTab />, {
    initialState: {
      control: {
        getNextAddressResponse: {
          accountNumber: mockUnMixedAccount.value
        }
      }
    }
  });

  await waitFor(() =>
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
  const { user } = render(<PrivacyTab />, {
    initialState: {
      control: {
        getNextAddressResponse: {
          accountNumber: mockDefaultAccount.value
        }
      }
    }
  });

  await waitFor(() =>
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
  await user.click(startMixerButton);

  // cancel first
  await user.click(getCancelButton());

  await user.click(startMixerButton);

  await user.type(getPrivatePassphraseInput(), testPassphrase);
  await user.click(getContinueButton());

  expect(mockRunAccountMixer).toHaveBeenCalledWith({
    changeAccount: mockUnMixedAccount.accountNumber,
    mixedAccount: mockMixedAccount.accountNumber,
    passphrase: testPassphrase,
    csppServer: `${mockCsppServer}:${mockCsppPort}`,
    mixedAccountBranch: mockMixedAccountBranch
  });
});

test("stop coin mixer", async () => {
  selectors.getAccountMixerRunning = jest.fn(() => true);
  const { user } = render(<PrivacyTab />, {
    initialState: {
      control: {
        getNextAddressResponse: {
          accountNumber: mockDefaultAccount.value
        }
      }
    }
  });

  expect(screen.getByText("Mixer is running")).toBeInTheDocument();
  await user.click(getStopMixerButton());

  expect(mockStopAccountMixer).toHaveBeenCalled();
});

test("mixer is disabled (Autobuyer running)", () => {
  selectors.getRunningIndicator = jest.fn(() => true);
  render(<PrivacyTab />, {
    initialState: {
      control: {
        getNextAddressResponse: {
          accountNumber: mockDefaultAccount.value
        }
      }
    }
  });

  expect(getSendToSelfButton().disabled).toBe(true);
  expect(getStartMixerButton().disabled).toBe(true);
});

test("allow sending from unmixed accounts", async () => {
  const { user } = render(<PrivacyTab />, {
    initialState: {
      control: {
        getNextAddressResponse: {
          accountNumber: mockDefaultAccount.value
        }
      }
    }
  });

  const checkbox = getPrivacyCheckbox();

  expect(checkbox.checked).toBe(false);
  await user.click(checkbox);

  expect(screen.getByText("Sending from Unmixed Accounts")).toBeInTheDocument();
  expect(getEnableSendingFromUnmixedAccountButton().disabled).toBe(true);
  // cancel first
  await user.click(getCancelButton());

  await user.click(checkbox);

  // type random text, enable button should stay disabled
  await user.type(getConfirmInput(), "random text");
  expect(getEnableSendingFromUnmixedAccountButton().disabled).toBe(true);

  await user.clear(getConfirmInput());
  await user.type(getConfirmInput(), "I understand the risks");
  await user.click(getEnableSendingFromUnmixedAccountButton());

  expect(mockToggleAllowSendFromUnmixed).toHaveBeenCalledWith(true);
});

test("sending from unmixed accounts is allowed already", async () => {
  selectors.getAllowSendFromUnmixed = jest.fn(() => true);
  const { user } = render(<PrivacyTab />, {
    initialState: {
      control: {
        getNextAddressResponse: {
          accountNumber: mockDefaultAccount.value
        }
      }
    }
  });

  const checkbox = getPrivacyCheckbox();
  expect(checkbox.checked).toBe(true);

  await user.click(checkbox);
  expect(mockToggleAllowSendFromUnmixed).toHaveBeenCalledWith(false);
});

test("Send to Unmixed Account form", async () => {
  const { user } = render(<PrivacyTab />, {
    initialState: {
      control: {
        getNextAddressResponse: {
          accountNumber: mockDefaultAccount.value
        }
      }
    }
  });

  const sendToSelfBtn = getSendToSelfButton();
  const amountInput = screen.getByLabelText("Amount:");
  const testAmount = "12";
  expect(sendToSelfBtn.disabled).toBe(true);

  await user.type(amountInput, testAmount);

  await waitFor(() =>
    expect(mockConstructTransactionAttempt).toHaveBeenCalled()
  );

  await user.click(
    screen.getByText("Send all funds from selected account").nextElementSibling
  );
  expect(screen.getByText("Amount:").nextElementSibling.textContent).toBe(
    "19.00000 DCR"
  );
  await user.click(
    screen.getByText("Cancel sending all funds").nextElementSibling
  );
  expect(screen.getByLabelText("Amount:").value).toBe("");
});

test("check logs", async () => {
  jest.useFakeTimers();
  mockGetPrivacyLogs = wallet.getPrivacyLogs = jest.fn(() =>
    Promise.resolve(mockLogLine)
  );
  const { user } = render(<PrivacyTab />, {
    initialState: {
      control: {
        getNextAddressResponse: {
          accountNumber: mockDefaultAccount.value
        }
      }
    }
  });

  const logsLabel = screen.getByText("Logs");

  await user.click(logsLabel);

  act(() => {
    jest.advanceTimersByTime(2001);
  });

  await waitFor(() => expect(mockGetPrivacyLogs).toHaveBeenCalledTimes(2));
  await waitFor(() => screen.getByText(mockLogLine));

  await user.click(logsLabel);
  await waitFor(() =>
    expect(screen.queryByText(mockLogLine)).not.toBeInTheDocument()
  );
});

test("privacy configuration have to be disabled in watching only (already have mixed or unmixed account)", async () => {
  selectors.getMixedAccount = jest.fn(() => null);
  selectors.getChangeAccount = jest.fn(() => null);
  selectors.isWatchingOnly = jest.fn(() => true);
  const { user } = render(<PrivacyTab />);
  await user.click(getCreateNeededAccountsButton());
  expect(mockDispatchSingleMessage).toHaveBeenCalledTimes(1);
});

test("privacy configuration have to be disabled in watching only ", async () => {
  selectors.getMixedAccount = jest.fn(() => null);
  selectors.getChangeAccount = jest.fn(() => null);
  selectors.isWatchingOnly = jest.fn(() => true);
  selectors.balances = jest.fn(() => []);
  const { user } = render(<PrivacyTab />);
  await user.click(getCreateDefaultAccountsButton());
  expect(mockDispatchSingleMessage).toHaveBeenCalledTimes(1);
});
