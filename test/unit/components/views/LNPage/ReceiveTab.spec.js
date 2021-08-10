import { ReceiveTab } from "components/views/LNPage/ReceiveTab";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen, wait } from "@testing-library/react";
import { DCR } from "constants";
import * as sel from "selectors";
import * as lna from "actions/LNActions";

const selectors = sel;
const lnActions = lna;

const mockLnChannelBalance = {
  balance: 99997360,
  pendingOpenBalance: 0,
  maxInboundAmount: 97999000,
  maxOutboundAmount: 97997360
};
const mockInvoices = [
  {
    memo: "mock-memo-1",
    rHash: "mock-rhash-1",
    value: 10000000,
    valueMAtoms: 10000000000,
    settled: false,
    creationDate: 1626706566,
    settleDate: 0,
    paymentRequest: "mock-payment-request1",
    descriptionHash: "",
    expiry: 3600,
    fallbackAddr: "",
    cltvExpiry: 80,
    routeHintsList: [],
    pb_private: false,
    addIndex: 28,
    settleIndex: 0,
    amtPaid: 0,
    amtPaidAtoms: 0,
    amtPaidMAtoms: 0,
    state: 0,
    htlcsList: [],
    ignoreMaxInboundAmt: false,
    featuresMap: [],
    isKeysend: false,
    status: "open",
    rHashHex: "mock-rhash-hex-1"
  },
  {
    memo: "mock-memo-2",
    rPreimage: "mock-rpreimage-2",
    rHash: "mock-rhash-21",
    value: 1000,
    valueMAtoms: 1000000,
    settled: true,
    creationDate: 1626706536,
    settleDate: 1626706576,
    paymentRequest: "mock-payment-request2",
    descriptionHash: "",
    expiry: 3600,
    fallbackAddr: "",
    cltvExpiry: 80,
    routeHintsList: [],
    pb_private: false,
    addIndex: 27,
    settleIndex: 1,
    amtPaid: 1000000,
    amtPaidAtoms: 1000,
    amtPaidMAtoms: 1000000,
    state: 1,
    ignoreMaxInboundAmt: false,
    isKeysend: false,
    status: "settled",
    rHashHex: "mock-rhash-hex-21"
  },
  {
    memo: "mock-memo-3",
    rPreimage: "mock-ppreimage-3",
    rHash: "mock-rhash-22",
    value: 1000,
    valueMAtoms: 1000000,
    settled: false,
    creationDate: 1626703527,
    settleDate: 0,
    paymentRequest: "mock-payment-request3",
    descriptionHash: "",
    expiry: 3600,
    fallbackAddr: "",
    cltvExpiry: 80,
    routeHintsList: [],
    pb_private: false,
    addIndex: 26,
    settleIndex: 0,
    amtPaid: 0,
    amtPaidAtoms: 0,
    amtPaidMAtoms: 0,
    state: 2,
    htlcsList: [],
    ignoreMaxInboundAmt: false,
    isKeysend: false,
    status: "canceled",
    rHashHex: "mock-rhash-hex-22"
  }
];

let mockCancelInvoice;
let mockAddInvoice;
beforeEach(() => {
  selectors.currencyDisplay = jest.fn(() => DCR);
  selectors.lnChannelBalances = jest.fn(() => mockLnChannelBalance);
  selectors.lnInvoices = jest.fn(() => mockInvoices);
  mockCancelInvoice = lnActions.cancelInvoice = jest.fn(() => () =>
    Promise.resolve()
  );
  mockAddInvoice = lnActions.addInvoice = jest.fn(() => () =>
    Promise.resolve()
  );
});

test("test invoice list and modal ", async () => {
  render(<ReceiveTab />);

  expect(
    screen
      .getAllByText(/Invoice for/i)
      .map((node) => node.parentElement.textContent)
  ).toStrictEqual([
    `Invoice for 0.10000 DCR${mockInvoices[0].rHashHex}`,
    `Invoice for 0.00001 DCR${mockInvoices[1].rHashHex}`,
    `Invoice for 0.00001 DCR${mockInvoices[2].rHashHex}`
  ]);

  // click on the first (open) invoice and check modal
  user.click(screen.getByText("Not Paid Yet"));
  expect(screen.getAllByText("Not Paid Yet").length).toBe(2);
  expect(screen.getByText(mockInvoices[0].paymentRequest)).toBeInTheDocument();
  user.click(screen.getByRole("button", { name: "Cancel Invoice" }));
  expect(mockCancelInvoice).toHaveBeenCalledWith(mockInvoices[0].rHash);
  //modal has been closed
  await wait(() =>
    expect(
      screen.queryByText("Lightning Payment Request")
    ).not.toBeInTheDocument()
  );

  // click on the second (settled) invoice and check modal
  user.click(screen.getByText("Received"));
  expect(screen.getAllByText("Received").length).toBe(2);
  expect(screen.getByText(mockInvoices[1].paymentRequest)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Cancel Invoice" }).disabled).toBe(
    true
  );
  user.click(screen.getByTestId("lninvoice-close-button"));
  expect(
    screen.queryByText("Lightning Payment Request")
  ).not.toBeInTheDocument();

  // click on the second (canceled) invoice and check modal
  user.click(screen.getByText("Canceled"));
  expect(screen.getAllByText("Canceled").length).toBe(2);
  expect(screen.getByText(mockInvoices[2].paymentRequest)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Cancel Invoice" }).disabled).toBe(
    true
  );
  user.click(screen.getByTestId("lninvoice-close-button"));
  expect(
    screen.queryByText("Lightning Payment Request")
  ).not.toBeInTheDocument();
});

test("test add invoice form ", async () => {
  render(<ReceiveTab />);

  const mockTooLargeAmount = "10";
  const mockValidAmount = "0.0001";
  const mockDescText = "mock-desc-text";
  const amountInput = screen.getByLabelText("Requested Amount");
  const createInvoiceButton = screen.getByRole("button", {
    name: "Create Invoice"
  });
  expect(createInvoiceButton.disabled).toBe(false);
  user.type(amountInput, mockTooLargeAmount);
  expect(
    screen.getByText(/cannot request more than total receive capacity/i)
  ).toBeInTheDocument();
  user.clear(amountInput);
  user.type(amountInput, mockValidAmount);
  expect(
    screen.queryByText(/cannot request more than total receive capacity/i)
  ).not.toBeInTheDocument();
  expect(createInvoiceButton.disabled).toBe(false);

  const descInput = screen.getByLabelText("Description");
  user.type(descInput, mockDescText);
  user.click(createInvoiceButton);
  expect(mockAddInvoice).toHaveBeenCalledWith(
    mockDescText,
    mockValidAmount * 100000000
  );
  await wait(() => expect(descInput.value).toBe(""));
  expect(amountInput.value).toBe("");
});

test("0 invoice amount is allowed", async () => {
  render(<ReceiveTab />);

  const mockZeroAmount = "0.000";
  const mockDescText = "mock-desc-text";
  const amountInput = screen.getByLabelText("Requested Amount");
  const createInvoiceButton = screen.getByRole("button", {
    name: "Create Invoice"
  });
  expect(createInvoiceButton.disabled).toBe(false);

  user.type(amountInput, mockZeroAmount);
  expect(createInvoiceButton.disabled).toBe(false);

  user.clear(amountInput);
  expect(createInvoiceButton.disabled).toBe(false);

  const descInput = screen.getByLabelText("Description");
  user.type(descInput, mockDescText);
  user.click(createInvoiceButton);
  expect(mockAddInvoice).toHaveBeenCalledWith(mockDescText, 0);
  await wait(() => expect(descInput.value).toBe(""));
});

test("test filter control", async () => {
  render(<ReceiveTab />);

  expect(
    screen
      .getAllByText(/Invoice for/i)
      .map((node) => node.parentElement.textContent)
  ).toStrictEqual([
    `Invoice for 0.10000 DCR${mockInvoices[0].rHashHex}`,
    `Invoice for 0.00001 DCR${mockInvoices[1].rHashHex}`,
    `Invoice for 0.00001 DCR${mockInvoices[2].rHashHex}`
  ]);

  const filterMenuButton = screen.getAllByRole("button", {
    name: "EyeFilterMenu"
  })[1];

  user.click(filterMenuButton);
  user.click(screen.getAllByText("Canceled")[0]);

  await wait(() =>
    expect(
      screen
        .getAllByText(/Invoice for/i)
        .map((node) => node.parentElement.textContent)
    ).toStrictEqual([`Invoice for 0.00001 DCR${mockInvoices[2].rHashHex}`])
  );

  user.click(filterMenuButton);
  user.click(screen.getAllByText("Expired")[0]);

  await wait(() =>
    expect(screen.queryByText(/Invoice for/i)).not.toBeInTheDocument()
  );
  expect(screen.getByText(/no invoices found/i)).toBeInTheDocument();
});

test("test sort control", async () => {
  render(<ReceiveTab />);

  expect(
    screen
      .getAllByText(/Invoice for/i)
      .map((node) => node.parentElement.textContent)
  ).toStrictEqual([
    `Invoice for 0.10000 DCR${mockInvoices[0].rHashHex}`,
    `Invoice for 0.00001 DCR${mockInvoices[1].rHashHex}`,
    `Invoice for 0.00001 DCR${mockInvoices[2].rHashHex}`
  ]);

  const sortMenuButton = screen.getAllByRole("button", {
    name: "EyeFilterMenu"
  })[0];

  user.click(sortMenuButton);
  user.click(screen.getByText("Oldest"));

  await wait(() =>
    expect(
      screen
        .getAllByText(/Invoice for/i)
        .map((node) => node.parentElement.textContent)
    ).toStrictEqual([
      `Invoice for 0.00001 DCR${mockInvoices[2].rHashHex}`,
      `Invoice for 0.00001 DCR${mockInvoices[1].rHashHex}`,
      `Invoice for 0.10000 DCR${mockInvoices[0].rHashHex}`
    ])
  );
});

test("test search control", async () => {
  render(<ReceiveTab />);

  expect(
    screen
      .getAllByText(/Invoice for/i)
      .map((node) => node.parentElement.textContent)
  ).toStrictEqual([
    `Invoice for 0.10000 DCR${mockInvoices[0].rHashHex}`,
    `Invoice for 0.00001 DCR${mockInvoices[1].rHashHex}`,
    `Invoice for 0.00001 DCR${mockInvoices[2].rHashHex}`
  ]);

  const searchInput = screen.getByPlaceholderText("Filter by Payment Hash");
  user.type(searchInput, "mock-rhash-2");

  await wait(() =>
    expect(
      screen
        .getAllByText(/Invoice for/i)
        .map((node) => node.parentElement.textContent)
    ).toStrictEqual([
      `Invoice for 0.00001 DCR${mockInvoices[1].rHashHex}`,
      `Invoice for 0.00001 DCR${mockInvoices[2].rHashHex}`
    ])
  );

  user.type(searchInput, "mock-rhash-22");

  await wait(() =>
    expect(
      screen
        .getAllByText(/Invoice for/i)
        .map((node) => node.parentElement.textContent)
    ).toStrictEqual([`Invoice for 0.00001 DCR${mockInvoices[2].rHashHex}`])
  );

  user.type(searchInput, "mock-rhash-22-12");

  await wait(() =>
    expect(screen.queryByText(/Invoice for/i)).not.toBeInTheDocument()
  );
  expect(screen.getByText(/no invoices found/i)).toBeInTheDocument();
});
