import { ReceiveTab } from "components/views/LNPage/ReceiveTab";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import { DCR } from "constants";
import * as sel from "selectors";
import * as lna from "actions/LNActions";
import {
  mockLnChannelBalance,
  mockInvoices,
  mockChannels,
  mockPendingChannels,
  mockClosedChannels
} from "./mocks";

const selectors = sel;
const lnActions = lna;

let mockCancelInvoice;
let mockAddInvoice;
beforeEach(() => {
  selectors.currencyDisplay = jest.fn(() => DCR);
  selectors.lnPendingChannels = jest.fn(() => mockPendingChannels);
  selectors.lnClosedChannels = jest.fn(() => mockClosedChannels);
  selectors.lnChannels = jest.fn(() => mockChannels);
  selectors.lnChannelBalances = jest.fn(() => mockLnChannelBalance);
  selectors.lnInvoices = jest.fn(() => mockInvoices);
  mockCancelInvoice = lnActions.cancelInvoice = jest.fn(
    () => () => Promise.resolve()
  );
  mockAddInvoice = lnActions.addInvoice = jest.fn(
    () => () => Promise.resolve()
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
  await waitFor(() =>
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
  await waitFor(() => {
    expect(descInput.value).toBe("");
    expect(amountInput.value).toBe("");
  });
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
  await waitFor(() => expect(descInput.value).toBe(""));
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

  await waitFor(() =>
    expect(
      screen
        .getAllByText(/Invoice for/i)
        .map((node) => node.parentElement.textContent)
    ).toStrictEqual([`Invoice for 0.00001 DCR${mockInvoices[2].rHashHex}`])
  );

  user.click(filterMenuButton);
  user.click(screen.getAllByText("Expired")[0]);

  await waitFor(() =>
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

  await waitFor(() =>
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

  await waitFor(() =>
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

  await waitFor(() =>
    expect(
      screen
        .getAllByText(/Invoice for/i)
        .map((node) => node.parentElement.textContent)
    ).toStrictEqual([`Invoice for 0.00001 DCR${mockInvoices[2].rHashHex}`])
  );

  user.type(searchInput, "mock-rhash-22-12");

  await waitFor(() =>
    expect(screen.queryByText(/Invoice for/i)).not.toBeInTheDocument()
  );
  expect(screen.getByText(/no invoices found/i)).toBeInTheDocument();
});
