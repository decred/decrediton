import { ReceiveTab } from "components/views/TransactionsPage/ReceiveTab";
import TransactionsPage from "components/views/TransactionsPage/";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as wl from "wallet";
import * as ta from "actions/TransactionActions";
import { DCR } from "constants";
import { fireEvent } from "@testing-library/react";
import copy from "clipboard-copy";
jest.mock("clipboard-copy");
export const GETNEXTADDRESS_SUCCESS = "GETNEXTADDRESS_SUCCESS";

let mockCopy;
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
const mockAccount2 = {
  hidden: false,
  label: "account-2: 7.4998063 DCR",
  name: "account-2",
  spendable: 749980630,
  spendableAndUnit: "7.4998063 DCR",
  total: 749980630,
  value: 2
};
const mockEmptyAccount = {
  hidden: false,
  label: "empty: 0.0000000 DCR",
  name: "empty",
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
  mockAccount2,
  mockMixedAccount,
  mockEmptyAccount
];
const mockSpendingAccounts = [
  mockDefaultAccount,
  mockAccount2,
  mockMixedAccount,
  mockEmptyAccount
];
const mockNextAddress = "TsiTfsjizPgzBrPxovheccayb4UbLRmQAqY";

const mockUnspentOutputs = [
  {
    amount: 1073741824,
    outpointIndex: 14,
    txHash: "49233f396974f8e31eb16342c806eeae9b340843d0b169301cd5ffb0b67de73c"
  },
  {
    amount: 4294967296,
    outpointIndex: 2,
    txHash: "300cfbc8f5c4f92c64c6504a067481a5d68758ab2917d780b313551fd39c32da"
  },
  {
    amount: 4294967296,
    outpointIndex: 6,
    txHash: "300cfbc8f5c4f92c64c6504a067481a5d68758ab2917d780b313551fd39c32da"
  }
];

let mockIsTestNet;
let mockIsMainNet;
let mockWalletService;
let mockGetNextAddressAttempt;
let mockGenQRCodeSVG;

const selectors = sel;
const controlActions = ca;
const wallet = wl;
const transactionActions = ta;

beforeEach(() => {
  mockCopy = copy.mockImplementation(() => true);

  mockIsTestNet = selectors.isTestNet = jest.fn(() => false);
  mockIsMainNet = selectors.isMainNet = jest.fn(() => false);
  mockWalletService = selectors.walletService = jest.fn(() => {
    return {};
  });

  selectors.defaultSpendingAccount = jest.fn(() => mockDefaultAccount);
  selectors.visibleAccounts = jest.fn(() => mockVisibleAccounts);
  selectors.spendingAccounts = jest.fn(() => mockSpendingAccounts);
  selectors.getMixedAccount = jest.fn(() => mockMixedAccountValue);
  selectors.nextAddress = jest.fn(() => mockNextAddress);
  selectors.nextAddressAccount = jest.fn(() => mockDefaultAccount);
  selectors.currencyDisplay = jest.fn(() => DCR);

  transactionActions.listUnspentOutputs = jest.fn(
    () => () => Promise.resolve(mockUnspentOutputs)
  );
  mockGenQRCodeSVG = wallet.genQRCodeSVG = jest.fn(() => {});
  mockGetNextAddressAttempt = controlActions.getNextAddressAttempt = jest.fn(
    () => (dispatch) => {
      const res = {
        address: "mock-next-address",
        accountNumber: mockAccount2.value
      };
      dispatch({
        getNextAddressResponse: res,
        type: GETNEXTADDRESS_SUCCESS
      });
      Promise.resolve(res);
    }
  );
});

const getAmountInput = () => screen.getByLabelText("Requested Amount");
const getCopyButton = () => screen.getByText("Copy").nextElementSibling;
const getQRCodeButton = () => screen.getByText("QR code").nextElementSibling;
const getModalCloseButton = () => screen.getByText("Close");

test("render ReceiveTab within its parent", () => {
  render(<TransactionsPage />);
  user.click(screen.getByText("Receive"));

  expect(
    screen.getByText(/Each time you request a payment/i).textContent
  ).toMatchInlineSnapshot(
    '"Each time you request a payment, create a new address to protect your privacy."'
  );
});

test("change destination account", async () => {
  render(<ReceiveTab />);
  selectors.nextAddressAccount = jest.fn(() => mockAccount2);
  expect(screen.getByText(mockNextAddress)).toBeInTheDocument();

  user.click(screen.getByText(mockDefaultAccount.name));
  expect(screen.getByText(mockEmptyAccount.name)).toBeInTheDocument();
  expect(screen.getByText(mockAccount2.name)).toBeInTheDocument();
  expect(screen.getAllByText(mockDefaultAccount.name).length).toBe(2);
  user.click(screen.getByText(mockAccount2.name));
  await waitFor(() =>
    expect(screen.getAllByText(mockAccount2.name).length).toBe(1)
  );
  expect(mockGetNextAddressAttempt).toHaveBeenCalled();
});

test("generate new address", () => {
  render(<ReceiveTab />);
  user.click(screen.getByText(/generate new address/i));
  expect(mockGetNextAddressAttempt).toHaveBeenCalled();
});

test("show error when there is no walletService", () => {
  mockWalletService = selectors.walletService = jest.fn(() => {});
  render(<ReceiveTab />);
  expect(
    screen.getByText("Something went wrong, please go back")
  ).toBeInTheDocument();
  expect(screen.getByText(/back to home/i)).toBeInTheDocument();

  expect(mockIsTestNet).toHaveBeenCalled();
  expect(mockIsMainNet).toHaveBeenCalled();
  expect(mockWalletService).toHaveBeenCalled();
});

test("test copy button", () => {
  render(<ReceiveTab />);
  user.click(getCopyButton());
  expect(mockCopy).toHaveBeenCalledWith(mockNextAddress);
});

test("test QR button", () => {
  render(<ReceiveTab />);
  user.click(getQRCodeButton());
  expect(mockGenQRCodeSVG).toHaveBeenCalledWith(`decred:${mockNextAddress}`);
  expect(screen.getAllByText(mockNextAddress).length).toBe(2); // + modal
  user.click(getModalCloseButton());

  // set amount
  mockGenQRCodeSVG.mockClear();
  const amountInput = getAmountInput();
  expect(amountInput).toBeInTheDocument();
  expect(amountInput.value).toBe("");
  const mockAmountValue = "12";
  fireEvent.change(amountInput, {
    target: { value: mockAmountValue }
  });
  expect(amountInput.value).toBe(mockAmountValue);

  user.click(getQRCodeButton());
  expect(mockGenQRCodeSVG).toHaveBeenCalledWith(
    `decred:${mockNextAddress}?amount=${mockAmountValue}`
  );
  expect(screen.getAllByText(mockNextAddress).length).toBe(2); // + modal
  user.click(getModalCloseButton());
  expect(screen.getAllByText(mockNextAddress).length).toBe(1); // modal has been disappeared
});
