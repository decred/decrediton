import { ConnectPage } from "components/views/LNPage/ConnectPage";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen, wait } from "@testing-library/react";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as lna from "actions/LNActions";
import { DCR } from "constants";
const GETNEXTADDRESS_SUCCESS = "GETNEXTADDRESS_SUCCESS";
import { mockChannels, mockPendingChannels, mockClosedChannels } from "./mocks";

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
const mockLnAccount = {
  hidden: false,
  label: "ln account: 0.0000000 DCR",
  name: "ln account",
  spendable: 0,
  spendableAndUnit: "0.00000 DCR",
  total: 0,
  value: 3
};
const mockMixedAccount = {
  hidden: false,
  label: "mixed: 249.79547928 DCR",
  name: "mixed",
  spendable: 24979547928,
  spendableAndUnit: "249.79547928 DCR",
  total: 24979547928,
  value: mockMixedAccountValue
};
const mockVisibleAccounts = [
  mockDefaultAccount,
  mockMixedAccount,
  mockLnAccount
];
const mockSpendingAccounts = [
  mockDefaultAccount,
  mockMixedAccount,
  mockLnAccount
];
const mockFilePath = "mock-file-path";
const mockPrivatePassphrase = "mock-private-passphrase";

const selectors = sel;
const lnActions = lna;
const controlActions = ca;

let mockStartDcrlnd;

beforeEach(() => {
  selectors.lnPendingChannels = jest.fn(() => mockPendingChannels);
  selectors.lnClosedChannels = jest.fn(() => mockClosedChannels);
  selectors.lnChannels = jest.fn(() => mockChannels);
  selectors.lnWalletExists = jest.fn(() => false);
  selectors.defaultSpendingAccount = jest.fn(() => mockDefaultAccount);
  selectors.visibleAccounts = jest.fn(() => mockVisibleAccounts);
  selectors.spendingAccounts = jest.fn(() => mockSpendingAccounts);
  selectors.getMixedAccount = jest.fn(() => mockMixedAccountValue);
  selectors.currencyDisplay = jest.fn(() => DCR);
  mockStartDcrlnd = lnActions.startDcrlnd = jest.fn(() => () => {});
  selectors.nextAddressAccount = jest.fn(() => mockDefaultAccount);
  selectors.nextAddress = jest.fn(() => "mock-next-address");
  controlActions.getNextAddressAttempt = jest.fn(() => (dispatch) => {
    const res = {
      address: "mock-next-address",
      accountNumber: mockLnAccount.value
    };
    dispatch({
      getNextAddressResponse: res,
      type: GETNEXTADDRESS_SUCCESS
    });
    Promise.resolve(res);
  });
});

const getUnderstandButton = () =>
  screen.getByRole("button", { name: "I understand and accept the risks" });
const queryUnderstandButton = () =>
  screen.queryByRole("button", { name: "I understand and accept the risks" });
const getCreateNewWalletAccountToggle = () =>
  screen.getByText("Create New Wallet account");
const getUseExistingWalletAccountToggle = () =>
  screen.getByText("Use Existing Wallet Account");
const queryCreateNewWalletAccountToggle = () =>
  screen.queryByText("Create New Wallet account");
const queryUseExistingWalletAccountToggle = () =>
  screen.queryByText("Use Existing Wallet Account");
const getSCBBackupFileInput = () => screen.getByLabelText("Restore SCB backup");
const querySCBBackupFileInput = () =>
  screen.queryByLabelText("Restore SCB backup");
const getSubmitButton = () =>
  screen.getByRole("button", { name: "Start and Unlock LN Wallet" });
const getPrivatePasshpraseInput = () =>
  screen.getByLabelText(/private passphrase/i);
const getContinueButton = () =>
  screen.getByRole("button", { name: "Continue" });
const getCanceButton = () => screen.getByRole("button", { name: "Cancel" });
const getAuotPilotToggleSwitch = () => screen.getByTestId("toggleSwitch");

test("ln wallet exists", () => {
  selectors.lnWalletExists = jest.fn(() => true);
  render(<ConnectPage />);
  expect(queryUnderstandButton()).not.toBeInTheDocument();
  expect(queryCreateNewWalletAccountToggle()).not.toBeInTheDocument();
  expect(queryUseExistingWalletAccountToggle()).not.toBeInTheDocument();
  expect(querySCBBackupFileInput()).not.toBeInTheDocument();

  user.click(getSubmitButton());
  user.type(getPrivatePasshpraseInput(), mockPrivatePassphrase);
  user.click(getContinueButton());
  expect(mockStartDcrlnd).toHaveBeenCalledWith(
    mockPrivatePassphrase,
    false /*autopilot not enabled*/,
    null /*no account has been selected*/,
    "" /*no scb file path has been selected*/
  );
});

test("test create new new account", () => {
  render(<ConnectPage />);
  user.click(getUnderstandButton());

  expect(screen.getByText("Lightning Transactions")).toBeInTheDocument();
  expect(
    screen.getByText("Start, unlock and connect to the dcrlnd wallet.")
  ).toBeInTheDocument();

  user.type(getSCBBackupFileInput(), mockFilePath);

  user.click(getSubmitButton());
  expect(screen.getByText("Unlock LN Wallet")).toBeInTheDocument();

  //click on cancel first
  user.click(getCanceButton());
  expect(screen.queryByText("Unlock LN Wallet")).not.toBeInTheDocument();

  user.click(getSubmitButton());
  user.type(getPrivatePasshpraseInput(), mockPrivatePassphrase);
  user.click(getContinueButton());
  expect(mockStartDcrlnd).toHaveBeenCalledWith(
    mockPrivatePassphrase,
    false /*autopilot not enabled*/,
    "**create ln account**",
    mockFilePath
  );
});

test("test text toggles", async () => {
  render(<ConnectPage />);
  user.click(getUnderstandButton());

  expect(screen.queryByText(/attention:/i)).not.toBeInTheDocument();
  user.click(getUseExistingWalletAccountToggle());
  await wait(() => screen.getByText(/attention:/i));

  // go back
  user.click(getCreateNewWalletAccountToggle());
  await wait(() =>
    expect(screen.queryByText(/attention:/i)).not.toBeInTheDocument()
  );
});

test("test automatic channel creation", () => {
  render(<ConnectPage />);
  user.click(getUnderstandButton());

  user.click(getAuotPilotToggleSwitch());
  user.click(getSubmitButton());
  user.type(getPrivatePasshpraseInput(), mockPrivatePassphrase);
  user.click(getContinueButton());
  expect(mockStartDcrlnd).toHaveBeenCalledWith(
    mockPrivatePassphrase,
    true /*autopilot enabled*/,
    "**create ln account**",
    "" /*file path*/
  );
});

test("test use existing account", async () => {
  render(<ConnectPage />);
  user.click(getUnderstandButton());

  expect(screen.queryByText(/attention:/i)).not.toBeInTheDocument();
  user.click(getUseExistingWalletAccountToggle());
  await wait(() => screen.getByText(/attention:/i));

  user.click(screen.getByText(mockDefaultAccount.name));
  user.click(screen.getByText(mockLnAccount.name));

  user.click(getSubmitButton());
  user.type(getPrivatePasshpraseInput(), mockPrivatePassphrase);
  user.click(getContinueButton());
  expect(mockStartDcrlnd).toHaveBeenCalledWith(
    mockPrivatePassphrase,
    false /*autopilot not enabled*/,
    mockLnAccount.value,
    "" /*file path*/
  );
});

test("test disabled submit button", () => {
  selectors.getRunningIndicator = jest.fn(() => true);
  render(<ConnectPage />);
  user.click(getUnderstandButton());

  expect(getSubmitButton().disabled).toBe(true);
  expect(
    screen.getByText(
      /Privacy Mixer, Autobuyer or Purchase Ticket Attempt running, please shut them off before unlock LN Wallet./i
    )
  ).toBeInTheDocument();

  user.click(getSubmitButton());
  expect(mockStartDcrlnd).not.toHaveBeenCalled();
});
