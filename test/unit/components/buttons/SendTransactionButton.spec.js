import { SendTransactionButton } from "buttons";
import { render, wait } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import * as tza from "actions/TrezorActions";
import * as ca from "actions/ControlActions";
import * as sel from "selectors";

const testUnsignedTransaction = [0, 1, 2];
const testConstructTxResponse = { totalAmount: 12 };
const testButtonLabel = "test-button-label";
const trezorActions = tza;
const selectors = sel;
const controlActions = ca;
const testAccount = 0;

let mockOnSubmit;
let mockSignTransactionAttemptTrezor;
let mockSignTransactionAttempt;
let mockUnsignedTransaction;
let mockConstructTxResponse;
let mockIsSendingTransaction;

beforeEach(() => {
  mockOnSubmit = jest.fn(() => {});
  mockSignTransactionAttemptTrezor = trezorActions.signTransactionAttemptTrezor = jest.fn(
    () => () => Promise.resolve()
  );
  mockSignTransactionAttempt = controlActions.signTransactionAttempt = jest.fn(
    () => () => Promise.resolve()
  );
  mockUnsignedTransaction = selectors.unsignedTransaction = jest.fn(
    () => testUnsignedTransaction
  );
  mockConstructTxResponse = selectors.constructTxResponse = jest.fn(
    () => testConstructTxResponse
  );
  mockIsSendingTransaction = selectors.isSendingTransaction = jest.fn(
    () => false
  );
  selectors.isTrezor = jest.fn(() => false);
});

test("render default SendTransactionButton ", () => {
  render(<SendTransactionButton isTrezor={false} account={{ value: 0 }} />);
  expect(screen.getByText(/send/i)).toBeInTheDocument();
  const button = screen.getByRole("button");
  user.click(button);
  expect(screen.getByText(/transaction confirmation/i)).toBeInTheDocument();
  // cancel modal first
  user.click(screen.getByText(/cancel/i));
  expect(
    screen.queryByText(/transaction confirmation/i)
  ).not.toBeInTheDocument();

  // try again
  user.click(button);
  const testPassPhrase = "test-pf";
  user.type(screen.getByLabelText(/private passphrase/i), testPassPhrase);
  user.click(screen.getByText(/continue/i));
  expect(mockSignTransactionAttempt).toHaveBeenCalledWith(
    testPassPhrase,
    testUnsignedTransaction,
    testAccount
  );
  expect(mockSignTransactionAttemptTrezor).not.toHaveBeenCalled();
  // modal has been closed
  expect(
    screen.queryByText(/transaction confirmation/i)
  ).not.toBeInTheDocument();
  expect(mockConstructTxResponse).toHaveBeenCalled();
  expect(mockUnsignedTransaction).toHaveBeenCalled();
});

test("render SendTransactionButton when trezor is enabled", async () => {
  selectors.isTrezor = jest.fn(() => true);
  render(<SendTransactionButton onSubmit={mockOnSubmit} />);
  expect(screen.getByText(/send/i)).toBeInTheDocument();
  const button = screen.getByRole("button");
  user.click(button);
  expect(mockSignTransactionAttempt).not.toHaveBeenCalled();
  expect(
    mockSignTransactionAttemptTrezor
  ).toHaveBeenCalledWith(testUnsignedTransaction, [
    testConstructTxResponse.changeIndex
  ]);
  await wait(() => expect(mockOnSubmit).toHaveBeenCalled());
});

test("render loading default SendTransactionButton ", () => {
  mockIsSendingTransaction = selectors.isSendingTransaction = jest.fn(
    () => true
  );
  render(<SendTransactionButton />);
  expect(screen.queryByText(/send/i)).not.toBeInTheDocument();
  const button = screen.getByRole("button");
  user.click(button);
  expect(button.disabled).toBe(true);
  expect(mockIsSendingTransaction).toHaveBeenCalled();
  expect(mockSignTransactionAttempt).not.toHaveBeenCalled();
  expect(mockSignTransactionAttemptTrezor).not.toHaveBeenCalled();
});

test("render loading SendTransactionButton when trezor is enabled", () => {
  mockIsSendingTransaction = selectors.isSendingTransaction = jest.fn(
    () => true
  );
  render(<SendTransactionButton />);
  expect(screen.queryByText(/send/i)).not.toBeInTheDocument();
  const button = screen.getByRole("button");
  user.click(button);
  expect(button.disabled).toBe(true);
  expect(mockIsSendingTransaction).toHaveBeenCalled();
  expect(mockSignTransactionAttempt).not.toHaveBeenCalled();
  expect(mockSignTransactionAttemptTrezor).not.toHaveBeenCalled();
});

test("render default SendTransactionButton with custom button label", () => {
  render(<SendTransactionButton buttonLabel={testButtonLabel} />);
  expect(screen.queryByText(/send/i)).not.toBeInTheDocument();
  expect(screen.queryByText(testButtonLabel)).toBeInTheDocument();
});
