import { SendTab } from "components/views/TransactionsPage/SendTab";
import TransactionsPage from "components/views/TransactionsPage/";
import { render } from "test-utils.js";
import { screen, waitFor } from "@testing-library/react";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as ta from "actions/TransactionActions";
import * as wl from "wallet";
import { DCR } from "constants";
import { fireEvent } from "@testing-library/react";
jest.mock("electron");
export const GETNEXTADDRESS_SUCCESS = "GETNEXTADDRESS_SUCCESS";
import debouce from "lodash/debounce";
jest.mock("lodash/debounce");

const mockMixedAccountValue = 6;
const validAmount = 12;
const mockValidAddress = "mockValidAddress";
const mockOutputs = [
  { amount: 1, address: "test-address-1" },
  { amount: 2, address: "test-address-2" },
  { amount: 3, address: "test-address-3" }
];
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
const mockNextAddress = "TsiTfsjizPgzBrPxovheccayb4UbLRmQAqY";
const mockTotalSpent = 5600005850;
const mockEstimatedFee = 5850;
const mockEstimatedSize = 585;

let mockIsTestNet;
let mockIsMainNet;
let mockWalletService;
let mockConstructTransactionAttempt;
let mockValidateAddress;
let mockGetNextAddressAttempt;

const selectors = sel;
const controlActions = ca;
const transactionActions = ta;
const wallet = wl;

beforeEach(() => {
  debouce.mockImplementation((fn) => fn);
  mockIsTestNet = selectors.isTestNet = jest.fn(() => false);
  mockIsMainNet = selectors.isMainNet = jest.fn(() => false);
  mockWalletService = selectors.walletService = jest.fn(() => {
    return {};
  });

  selectors.defaultSpendingAccount = jest.fn(() => mockMixedAccount);
  selectors.visibleAccounts = jest.fn(() => mockVisibleAccounts);
  selectors.spendingAccounts = jest.fn(() => mockSpendingAccounts);
  selectors.unsignedTransaction = jest.fn(() => null);
  selectors.unsignedRawTx = jest.fn(() => null);
  selectors.estimatedFee = jest.fn(() => mockEstimatedFee);
  selectors.estimatedSignedSize = jest.fn(() => mockEstimatedSize);
  selectors.totalSpent = jest.fn(() => mockTotalSpent);
  selectors.nextAddress = jest.fn(() => mockNextAddress);
  selectors.nextAddressAccount = jest.fn(() => mockDefaultAccount);
  selectors.constructTxLowBalance = jest.fn(() => false);
  selectors.publishTxResponse = jest.fn(() => "mockpublishtxresponse");
  selectors.getNotMixedAcctIfAllowed = jest.fn(() => [0, 2]);
  selectors.isTrezor = jest.fn(() => false);
  selectors.isWatchingOnly = jest.fn(() => false);
  selectors.getRunningIndicator = jest.fn(() => false);
  selectors.currencyDisplay = jest.fn(() => DCR);
  mockConstructTransactionAttempt = controlActions.constructTransactionAttempt =
    jest.fn(() => (dispatch) => {
      dispatch({
        type: controlActions.CONSTRUCTTX_ATTEMPT,
        constructTxRequestAttempt: true
      });
      dispatch({
        type: controlActions.CONSTRUCTTX_SUCCESS
      });
    });
  mockValidateAddress = controlActions.validateAddress = jest.fn(() => () => {
    return {
      error: "ERR_INVALID_ADDR_TOOSHORT",
      isValid: false,
      getIsValid: () => false
    };
  });
  controlActions.onClearTransaction = jest.fn(() => {});
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
  transactionActions.listUnspentOutputs = jest.fn(
    () => () => Promise.resolve(mockUnspentOutputs)
  );
});

test("show error when there is no walletService", () => {
  mockWalletService = selectors.walletService = jest.fn(() => {});
  render(<SendTab />);
  expect(
    screen.getByText("Something went wrong, please go back")
  ).toBeInTheDocument();
  expect(screen.getByText(/back to home/i)).toBeInTheDocument();

  expect(mockIsTestNet).toHaveBeenCalled();
  expect(mockIsMainNet).toHaveBeenCalled();
  expect(mockWalletService).toHaveBeenCalled();
});

const getAmountInput = () => screen.getByLabelText("Amount");
const queryAmountInput = () => screen.queryByLabelText("Amount");
const getSendToInput = () => screen.getByLabelText("Send to");
const getSendAllButton = () =>
  screen.getByText("Send all funds from selected account").nextElementSibling;
const getCancelSendAllButton = () =>
  screen.getByText("Cancel sending all funds").nextElementSibling;
const getSendSelfButton = () =>
  screen.getByText("Send funds to another account").nextElementSibling;
const getSendButton = () => screen.getByRole("button", { name: "Send" });
const getPasteButton = () => screen.getByRole("button", { name: "Paste" });
const getDetailsValueColumn = () => screen.getByTestId("detailsValueColumn");
("detailsValueColumn");
const getAddOutputButton = () =>
  screen.getByText("Add output").nextElementSibling;
const getAllDeleteOutputButton = () => screen.getAllByText("Delete output");
const queryDeleteOutputButton = () => screen.queryByText("Delete output");
const getClearAddressButton = () =>
  screen.getByRole("button", { name: "Clear Address" });
const queryClearAddressButton = () =>
  screen.queryByRole("button", { name: "Clear Address" });

const getAllAmountInput = () => screen.getAllByLabelText("Amount");
const getAllSendToInput = () => screen.getAllByLabelText("Send to");

test("render SendTab within its parent", () => {
  render(<TransactionsPage />);

  const amountInput = getAmountInput();
  const sendToInput = getSendToInput();
  const sendAllButton = getSendAllButton();
  const sendSelfButton = getSendSelfButton();
  const sendButton = getSendButton();
  const detailsValueColumn = getDetailsValueColumn();
  const pasteButton = getPasteButton();
  const addOutputButton = getAddOutputButton();
  const deleteOututButton = queryDeleteOutputButton();
  const clearAddressButton = queryClearAddressButton();

  expect(amountInput).toBeInTheDocument();
  expect(sendToInput).toBeInTheDocument();
  expect(sendSelfButton).toBeInTheDocument();
  expect(sendAllButton).toBeInTheDocument();
  expect(sendButton).toBeInTheDocument();
  expect(pasteButton).toBeInTheDocument();
  expect(addOutputButton).toBeInTheDocument();
  expect(deleteOututButton).not.toBeInTheDocument();
  expect(clearAddressButton).not.toBeInTheDocument();

  /* check default state */
  expect(screen.getByText(/0% of account balance/i)).toBeInTheDocument();
  expect(screen.getByText(mockMixedAccount.name)).toBeInTheDocument();
  expect(screen.getByText("Balance:").nextElementSibling.textContent).toMatch(
    mockMixedAccount.spendableAndUnit
  );
  expect(detailsValueColumn.textContent).toMatch(
    /0.00000 DCR0.00000 DCR0 Bytes/
  ); // Total amount spending, Estimated Fee, Estimated Size
  expect(sendSelfButton.disabled).toBe(false);
  expect(sendAllButton.disabled).toBe(false);
  expect(sendButton.disabled).toBe(true);
  expect(
    screen.queryByText(/Unsigned Raw Transaction:/)
  ).not.toBeInTheDocument();

  expect(screen.getByText(/mainnet Decred addresses/i).textContent)
    .toMatchInlineSnapshot(`
    "Mainnet Decred addresses always begin with letter D and contain 26-35 alphanumeric characters
    (e.g. DxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0X)."
  `);
});

test("render SendTab within its parent in testnet mode", () => {
  mockIsTestNet = selectors.isTestNet = jest.fn(() => true);
  render(<TransactionsPage />);

  expect(screen.getByText(/testnet Decred addresses/i).textContent)
    .toMatchInlineSnapshot(`
    "Testnet Decred addresses always begin with letter T and contain 26-35 alphanumeric characters
    (e.g. TxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0)."
  `);
});

test("test amount input", async () => {
  const { user } = render(<SendTab />);

  let amountInput = getAmountInput();
  const sendAllButton = getSendAllButton();
  const addOutputButton = getAddOutputButton();
  const sendToInput = getSendToInput();

  // Sending from unmixed accounts is disabled,
  // can't select other than mixed account.
  await user.click(screen.getByText(mockMixedAccount.name));
  expect(screen.queryByText(mockDefaultAccount.name)).not.toBeInTheDocument();
  expect(screen.queryByText(mockAccount2.name)).not.toBeInTheDocument();
  await user.click(screen.getAllByText(mockMixedAccount.name)[1]);

  // click on send all amount button
  await user.click(sendAllButton);
  expect(queryAmountInput()).not.toBeInTheDocument();
  await waitFor(() =>
    expect(screen.getByText("Amount").nextElementSibling.textContent).toBe(
      `${mockMixedAccount.spendableAndUnit}100% of Account Balance`
    )
  );
  expect(addOutputButton.disabled).toBe(true);

  // construct tx
  mockValidateAddress = controlActions.validateAddress = jest.fn(() => () => {
    return {
      isValid: true,
      getIsValid: () => true
    };
  });
  fireEvent.change(sendToInput, {
    target: { value: mockValidAddress }
  });
  await waitFor(() =>
    expect(mockConstructTransactionAttempt).toHaveBeenCalledWith(
      mockMixedAccountValue,
      0,
      [
        {
          data: {
            amount: mockMixedAccount.spendable,
            destination: mockValidAddress,
            error: {
              address: undefined,
              amount: null
            }
          },
          key: "output_0"
        }
      ],
      true
    )
  );

  // switch back to normal mode
  await user.click(getCancelSendAllButton());
  expect(amountInput.value).toBe("");
  expect(screen.getByText(/0% of account balance/i)).toBeInTheDocument();

  // type arbitrary amount and check the percent value
  amountInput = getAmountInput();
  fireEvent.change(amountInput, {
    target: { value: "12" }
  });
  await waitFor(() =>
    expect(screen.getByText(/4.80% of account balance/i)).toBeInTheDocument()
  );

  // clear amountInput, should get error msg
  fireEvent.change(amountInput, {
    target: { value: "" }
  });

  await waitFor(() =>
    expect(screen.getByText(/This field is required/i)).toBeInTheDocument()
  );

  // retype validAmount
  fireEvent.change(amountInput, {
    target: { value: `${validAmount}` }
  });
  await waitFor(() =>
    expect(
      screen.queryByText(/This field is required/i)
    ).not.toBeInTheDocument()
  );

  // type more than 100% amount
  fireEvent.change(amountInput, {
    target: { value: "234232" }
  });
  await waitFor(() =>
    expect(screen.getByText(/>100% of account balance/i)).toBeInTheDocument()
  );
});

test("test `send to` input", async () => {
  const { user } = render(<SendTab />);

  const amountInput = getAmountInput();
  const sendToInput = getSendToInput();

  await user.type(amountInput, `${validAmount}`);
  // type invalid address into send to input. Should get an error message.
  const mockAddress = "mockAddress";
  const expectedErrorMsg = "Please enter a valid address";
  fireEvent.change(sendToInput, {
    target: { value: mockAddress }
  });
  await waitFor(() => expect(sendToInput.value).toBe(mockAddress));
  expect(screen.getByText(expectedErrorMsg)).toBeInTheDocument();
  expect(mockValidateAddress).toHaveBeenCalledWith(mockAddress);

  // type a valid address
  mockValidateAddress = controlActions.validateAddress = jest.fn(() => () => {
    return {
      isValid: true,
      getIsValid: () => true
    };
  });
  fireEvent.change(sendToInput, {
    target: { value: mockValidAddress }
  });
  await waitFor(() => expect(sendToInput.value).toBe(mockValidAddress));
  expect(screen.queryByText(expectedErrorMsg)).not.toBeInTheDocument();

  await waitFor(() =>
    expect(mockConstructTransactionAttempt).toHaveBeenCalledWith(
      mockMixedAccountValue,
      0,
      [{ amount: validAmount * 100000000, destination: mockValidAddress }],
      undefined
    )
  );

  // test clear button
  await user.click(getClearAddressButton());
  await waitFor(() => expect(sendToInput.value).toBe(""));
});

test("test paste button", async () => {
  const { user } = render(<SendTab />);

  const sendToInput = getSendToInput();
  const pasteButton = getPasteButton();
  const amountInput = getAmountInput();

  await user.type(amountInput, `${validAmount}`);
  // test paste button
  const mockPastedAddress = "mockPastedAddress";
  wallet.readFromClipboard.mockImplementation(() => mockPastedAddress);

  await user.click(pasteButton);
  await waitFor(() => expect(sendToInput.value).toBe(mockPastedAddress));
});

test("test paste button (paste address with trailing and leading spaces)", async () => {
  const { user } = render(<SendTab />);

  const sendToInput = getSendToInput();
  const pasteButton = getPasteButton();
  const amountInput = getAmountInput();

  await user.type(amountInput, `${validAmount}`);
  // test paste button
  const mockPastedAddress = "mockPastedAddress";

  wallet.readFromClipboard.mockImplementation(
    () => `          ${mockPastedAddress}              `
  );

  await user.click(pasteButton);
  await waitFor(() => expect(sendToInput.value).toBe(mockPastedAddress));
});

test("type address with trailing and leading spaces", async () => {
  render(<SendTab />);

  const sendToInput = getSendToInput();
  const amountInput = getAmountInput();

  fireEvent.change(amountInput, {
    target: { value: `${validAmount}` }
  });
  // test paste button
  const mockPastedAddress = "mockPastedAddress";

  // type address with trailing and leading spaces
  fireEvent.change(sendToInput, {
    target: { value: `   ${mockPastedAddress}     ` }
  });
  await waitFor(() => expect(sendToInput.value).toBe(mockPastedAddress));
});

test("construct a valid transaction", async () => {
  const { user } = render(<SendTab />);

  selectors.unsignedTransaction = jest.fn(() => 1);
  mockValidateAddress = controlActions.validateAddress = jest.fn(() => () => {
    return {
      isValid: true,
      getIsValid: () => true
    };
  });

  await fillOutputForm(user, 0);

  expect(getDetailsValueColumn().textContent).toMatch(
    /56.0000585 DCR0.0000585 DCR585 Bytes/
  );

  const sendButton = getSendButton();
  expect(sendButton.disabled).toBe(false);
  await user.click(sendButton);
  // modal has been shown
  expect(screen.getByText(/Private Passphrase/i)).toBeInTheDocument();
  // close modal
  await user.click(screen.getByText("Cancel"));
  expect(screen.queryByText(/Private Passphrase/i)).not.toBeInTheDocument();
});

test("test insufficient funds", () => {
  selectors.constructTxLowBalance = jest.fn(() => true);
  render(<SendTab />);
  expect(getSendButton().disabled).toBe(true);
  expect(screen.getByText(/insufficient funds/i)).toBeInTheDocument();
});

test("`Sending from unmixed account` is allowed", async () => {
  selectors.getNotMixedAcctIfAllowed = jest.fn(() => []);
  const { user } = render(<SendTab />);

  await user.click(screen.getByText(mockMixedAccount.name));
  expect(screen.getByText(mockDefaultAccount.name)).toBeInTheDocument();
  expect(screen.getByText(mockAccount2.name)).toBeInTheDocument();
  expect(screen.getAllByText(mockMixedAccount.name).length).toBe(2);
  fireEvent.click(screen.getByText(mockEmptyAccount.name));
  expect(screen.queryByText(mockMixedAccount.name)).not.toBeInTheDocument();

  // valid amount but the source account is empty
  const amountInput = getAmountInput();
  fireEvent.change(amountInput, {
    target: { value: `${validAmount}` }
  });
  await waitFor(() => expect(amountInput.value).toBe(`${validAmount}`));

  // changing account while sending all mode is on
  // should change the amount accordingly click on send all amount button
  await user.click(getSendAllButton());
  await waitFor(() =>
    expect(screen.getByText("Amount").nextElementSibling.textContent).toBe(
      `${mockEmptyAccount.spendableAndUnit}100% of Account Balance`
    )
  );
  await user.click(screen.getByText(mockEmptyAccount.name));
  await user.click(screen.getByText(mockAccount2.name));
  await waitFor(() =>
    expect(screen.getByText("Amount").nextElementSibling.textContent).toBe(
      `${mockAccount2.spendableAndUnit}100% of Account Balance`
    )
  );
});

const fillOutputForm = async (user, index) => {
  const amountInput = getAllAmountInput()[index];
  const sendToInput = getAllSendToInput()[index];
  fireEvent.change(amountInput, {
    target: { value: `${mockOutputs[index].amount}` }
  });
  await waitFor(() =>
    expect(amountInput.value).toBe(`${mockOutputs[index].amount}`)
  );
  fireEvent.change(sendToInput, {
    target: { value: mockOutputs[index].address }
  });
  await waitFor(() =>
    expect(sendToInput.value).toBe(mockOutputs[index].address)
  );
  const expectedOutputs = [];

  for (let i = 0; i <= index; i++) {
    expectedOutputs.push({
      amount: mockOutputs[i].amount * 100000000,
      destination: mockOutputs[i].address
    });
  }

  await waitFor(() =>
    expect(mockConstructTransactionAttempt).toHaveBeenCalledWith(
      mockMixedAccountValue,
      0,
      expectedOutputs,
      undefined
    )
  );
};

test("test sending to multiple addresses", async () => {
  const { user } = render(<SendTab />);

  mockValidateAddress = controlActions.validateAddress = jest.fn(() => () => {
    return {
      isValid: true,
      getIsValid: () => true
    };
  });
  const sendAllButton = getSendAllButton();
  expect(sendAllButton.disabled).toBe(false);

  // fill the first form
  await fillOutputForm(user, 0);
  await user.click(getAddOutputButton());
  expect(sendAllButton.disabled).toBe(true);

  // fill the second form
  await fillOutputForm(user, 1);
  await user.click(getAddOutputButton());

  // fill the third form
  await fillOutputForm(user, 2);

  // delete the last form
  const deletedOutputButtons = getAllDeleteOutputButton();
  await user.click(
    deletedOutputButtons[deletedOutputButtons.length - 1].nextElementSibling
  );
  expect(getAllAmountInput().length).toBe(2);

  // clicking on send self button should delete all forms but the first
  await user.click(getSendSelfButton());
  expect(getAllAmountInput().length).toBe(1);
});

test("send funds to another account", async () => {
  const { user } = render(<SendTab />);

  const sendSelfButton = getSendSelfButton();

  fireEvent.change(getAmountInput(), {
    target: { value: `${validAmount}` }
  });
  await user.click(sendSelfButton);
  await user.click(screen.getAllByRole("combobox")[1]);
  selectors.nextAddressAccount = jest.fn(() => mockAccount2);
  await user.click(screen.getByText(mockAccount2.name));
  await waitFor(
    () => expect(mockGetNextAddressAttempt).toHaveBeenCalled(),
    5000
  );
  await waitFor(() =>
    expect(screen.queryByText(mockDefaultAccount.name)).not.toBeInTheDocument()
  );
  selectors.publishTxResponse = jest.fn(() => "mocknewpublishtxresponse");
  await waitFor(() =>
    expect(mockConstructTransactionAttempt).toHaveBeenCalledWith(
      mockMixedAccountValue,
      0,
      [{ amount: validAmount * 100000000, destination: mockNextAddress }],
      undefined
    )
  );
  await waitFor(() =>
    expect(screen.queryByText(mockDefaultAccount.name)).not.toBeInTheDocument()
  );
  expect(mockGetNextAddressAttempt).toHaveBeenCalled();

  // switch back from send to self mode
  await user.click(sendSelfButton);
  expect(screen.queryByText(mockAccount2.name)).not.toBeInTheDocument();
}, 10000);

test("Privacy Mixer, Autobuyer or Purchase Ticket Attempt running", () => {
  selectors.getRunningIndicator = jest.fn(() => true);
  render(<SendTab />);
  expect(getSendButton().disabled).toBe(true);
  expect(
    screen.getByText(
      /Privacy Mixer, Autobuyer or Purchase Ticket Attempt running, please shut them off before sending a transaction./i
    )
  ).toBeInTheDocument();
});

test("show unsigned raw transaction", () => {
  const mockUnsignedRawTx = "mockunsignedrawtx";
  selectors.isWatchingOnly = jest.fn(() => true);
  selectors.isTrezor = jest.fn(() => false);
  selectors.unsignedRawTx = jest.fn(() => mockUnsignedRawTx);
  render(<SendTab />);
  expect(screen.getByText(/Unsigned Raw Transaction:/)).toBeInTheDocument();
  expect(screen.getByText(mockUnsignedRawTx)).toBeInTheDocument();
});

test("watching only trezor should show send button", () => {
  selectors.isWatchingOnly = jest.fn(() => true);
  selectors.isTrezor = jest.fn(() => true);
  render(<SendTab />);
  expect(getSendButton()).toBeInTheDocument();
});
