import { SendTab } from "components/views/LNPage/SendTab";
import { render } from "test-utils.js";
import { screen, waitFor } from "@testing-library/react";
import { DCR } from "constants";
import * as sel from "selectors";
import * as lna from "actions/LNActions";
import * as wl from "wallet";
import {
  mockChannels,
  mockPendingChannels,
  mockClosedChannels,
  mockLnChannelBalance,
  mockFailedPayment,
  mockPayments,
  mockOutstandingPayments
} from "./mocks";

const selectors = sel;
const lnActions = lna;
const wallet = wl;

const mockReqCode = "mock-req-code";
const now = Math.floor(Date.now() / 1000);
const mockValidDecodedPayRequest = {
  destination: "mock-destination",
  paymentHash: "mock-payment-hash",
  numAtoms: 1000000,
  timestamp: now,
  expiry: 3600,
  description: "mock-description",
  descriptionHash: "",
  fallbackAddr: "mock-fallbackAddr",
  cltvExpiry: 80,
  routeHintsList: [],
  paymentAddr: "mock-payment-address",
  paymentAddrHex: "9a8724fa96b299e9edfa16ac",
  numMAtoms: 1000000000,
  featuresMap: [
    [
      15,
      {
        name: "payment-addr",
        isRequired: false,
        isKnown: true
      }
    ],
    [
      17,
      {
        name: "multi-path-payments",
        isRequired: false,
        isKnown: true
      }
    ],
    [
      9,
      {
        name: "tlv-onion",
        isRequired: false,
        isKnown: true
      }
    ]
  ]
};

const mockExpiredDecodedPayRequest = {
  ...mockValidDecodedPayRequest,
  timestamp: now - 8000,
  fallbackAddr: ""
};

let mockDecodePayRequest;
let mockSendPayment;

beforeEach(() => {
  selectors.currencyDisplay = jest.fn(() => DCR);
  selectors.lnPendingChannels = jest.fn(() => mockPendingChannels);
  selectors.lnClosedChannels = jest.fn(() => mockClosedChannels);
  selectors.lnChannels = jest.fn(() => mockChannels);
  selectors.lnChannelBalances = jest.fn(() => mockLnChannelBalance);
  selectors.lnOutstandingPayments = jest.fn(() => mockOutstandingPayments);
  selectors.lnFailedPayments = jest.fn(() => mockFailedPayment);
  selectors.lnPayments = jest.fn(() => mockPayments);
  mockDecodePayRequest = lnActions.decodePayRequest = jest.fn(
    () => () => Promise.resolve(mockValidDecodedPayRequest)
  );
  mockSendPayment = lnActions.sendPayment = jest.fn(
    () => () => Promise.resolve()
  );
});

const getReqCodeInput = () =>
  screen.getByLabelText("Lightning Payment Request Code");
const getSendButton = () => screen.getByRole("button", { name: "Send" });
const querySendButton = () => screen.queryByRole("button", { name: "Send" });
const getPasteButton = () => screen.getByRole("button", { name: "Paste" });
const getClearButton = () =>
  screen.getByRole("button", { name: "Clear Address" });

test("test send form with valid lightning request", async () => {
  const { user } = render(<SendTab />);

  const reqCodeInput = getReqCodeInput();
  await user.type(reqCodeInput, mockReqCode);
  expect(mockDecodePayRequest).toHaveBeenCalledWith(mockReqCode);
  await waitFor(() => screen.getByText("Valid Lightning Request"));
  expect(screen.getByText("Amount").parentNode.textContent).toMatch(
    "Amount0.01000 DCR"
  );
  expect(screen.getByText("Destination").parentNode.textContent).toMatch(
    "Destinationmock-...ation"
  );
  expect(screen.getByText("Expiration Time").parentNode.textContent).toMatch(
    "Expiration TimeExpires in 1 hour"
  );
  expect(screen.getByText("Description").parentNode.textContent).toMatch(
    `Description${mockValidDecodedPayRequest.description}`
  );
  expect(screen.getByText("Payment Hash").parentNode.textContent).toMatch(
    `Payment Hash${mockValidDecodedPayRequest.paymentHash}`
  );

  expect(screen.queryByText("CLTV Expiry:")).not.toBeInTheDocument();
  // open details
  const details = screen.getByText("Details");
  await user.click(details);

  expect(screen.getByText("CLTV Expiry:").parentNode.textContent).toMatch(
    `CLTV Expiry:${mockValidDecodedPayRequest.cltvExpiry}`
  );
  expect(screen.getByText("Fallback Address:").parentNode.textContent).toMatch(
    `Fallback Address:${mockValidDecodedPayRequest.fallbackAddr}`
  );
  expect(screen.getByText("Payment Address:").parentNode.textContent).toMatch(
    `Payment Address:${mockValidDecodedPayRequest.paymentAddrHex}`
  );

  // close details
  await user.click(details);
  expect(screen.queryByText("CLTV Expiry:")).not.toBeInTheDocument();

  await user.click(getSendButton());
  expect(mockSendPayment).toHaveBeenCalledWith(mockReqCode, 0);
});

test("test send form with expired lightning request (with empty fallbackAddr)", async () => {
  mockDecodePayRequest = lnActions.decodePayRequest = jest.fn(
    () => () => Promise.resolve(mockExpiredDecodedPayRequest)
  );
  const { user } = render(<SendTab />);

  const reqCodeInput = getReqCodeInput();
  await user.type(reqCodeInput, mockReqCode);
  expect(mockDecodePayRequest).toHaveBeenCalledWith(mockReqCode);
  await waitFor(() => screen.getByText("Invoice expired"));
  expect(screen.getByText("Expiration Time").parentNode.textContent).toMatch(
    "Expiration TimeExpired 1 hour ago"
  );

  expect(screen.queryByText("CLTV Expiry:")).not.toBeInTheDocument();
  // open details
  const details = screen.getByText("Details");
  await user.click(details);

  expect(screen.getByText("Fallback Address:").parentNode.textContent).toMatch(
    "Fallback Address:(empty fallback address)"
  );

  // close details
  await user.click(details);
  expect(screen.queryByText("CLTV Expiry:")).not.toBeInTheDocument();

  expect(querySendButton()).not.toBeInTheDocument();
});

test("test send form with invalid lightning request", async () => {
  const mockErrorResp = "mock-error-resp";
  mockDecodePayRequest = lnActions.decodePayRequest = jest.fn(
    () => () => Promise.reject(mockErrorResp)
  );
  const { user } = render(<SendTab />);

  const reqCodeInput = getReqCodeInput();
  await user.type(reqCodeInput, mockReqCode);
  expect(mockDecodePayRequest).toHaveBeenCalledWith(mockReqCode);
  await waitFor(() => screen.getByText(mockErrorResp));
});

test("test paste and clear button", async () => {
  const { user } = render(<SendTab />);

  const mockPastedPayReq = "mockPastedPayReq";
  wallet.readFromClipboard.mockImplementation(() => mockPastedPayReq);

  await user.click(getPasteButton());
  await waitFor(() => expect(getReqCodeInput().value).toBe(mockPastedPayReq));

  await user.click(getClearButton());
  await waitFor(() => expect(getReqCodeInput().value).toBe(""));
});

test("test payment list and modal ", async () => {
  const { user } = render(<SendTab />);

  expect(
    screen
      .getAllByText(/Sent payment/i)
      .map((node) => node.parentElement.textContent)
  ).toStrictEqual([
    `Sent Payment 0.01000 DCR${mockOutstandingPayments["mock-outstanding-payment-hash-0"].decoded.paymentHash}`,
    `Sent Payment 0.0000001 DCR${mockFailedPayment[0].decoded.paymentHash}`,
    `Sent Payment 0.20000 DCR${mockPayments[0].paymentHash}`
  ]);

  // click on the first (outstanding) payment and check modal
  await user.click(screen.getByText("Pending"));
  expect(screen.getAllByText("Pending").length).toBe(2);
  //modal has been closed
  await user.click(screen.getByTestId("lnpayment-close-button"));
  await waitFor(() =>
    expect(screen.queryByText("Lightning Payment")).not.toBeInTheDocument()
  );

  // click on the second (failed) payment and check modal
  await user.click(screen.getByText("Failed"));
  expect(screen.getAllByText("Failed").length).toBe(2);
  expect(
    screen.getByText(mockFailedPayment[0].decoded.paymentHash)
  ).toBeInTheDocument();
  await user.click(screen.getByTestId("lnpayment-close-button"));
  expect(screen.queryByText("Lightning Payment")).not.toBeInTheDocument();

  // click on the second (confirmed) payment and check modal
  await user.click(screen.getByText("Confirmed"));
  expect(screen.getAllByText("Confirmed").length).toBe(2);
  expect(screen.getByText(mockPayments[0].paymentHash)).toBeInTheDocument();
  await user.click(screen.getByTestId("lnpayment-close-button"));
  expect(screen.queryByText("Lightning Payment")).not.toBeInTheDocument();
});

test("test sort control", async () => {
  const { user } = render(<SendTab />);

  expect(
    screen
      .getAllByText(/Sent Payment/i)
      .map((node) => node.parentElement.textContent)
  ).toStrictEqual([
    `Sent Payment 0.01000 DCR${mockOutstandingPayments["mock-outstanding-payment-hash-0"].decoded.paymentHash}`,
    `Sent Payment 0.0000001 DCR${mockFailedPayment[0].decoded.paymentHash}`,
    `Sent Payment 0.20000 DCR${mockPayments[0].paymentHash}`
  ]);

  const sortMenuButton = screen.getAllByRole("button", {
    name: "EyeFilterMenu"
  })[0];

  await user.click(sortMenuButton);
  await user.click(screen.getByText("Oldest"));

  await waitFor(() =>
    expect(
      screen
        .getAllByText(/Sent Payment/i)
        .map((node) => node.parentElement.textContent)
    ).toStrictEqual([
      `Sent Payment 0.20000 DCR${mockPayments[0].paymentHash}`,
      `Sent Payment 0.0000001 DCR${mockFailedPayment[0].decoded.paymentHash}`,
      `Sent Payment 0.01000 DCR${mockOutstandingPayments["mock-outstanding-payment-hash-0"].decoded.paymentHash}`
    ])
  );
});

test("test search control", async () => {
  const { user } = render(<SendTab />);

  expect(
    screen
      .getAllByText(/Sent Payment/i)
      .map((node) => node.parentElement.textContent)
  ).toStrictEqual([
    `Sent Payment 0.01000 DCR${mockOutstandingPayments["mock-outstanding-payment-hash-0"].decoded.paymentHash}`,
    `Sent Payment 0.0000001 DCR${mockFailedPayment[0].decoded.paymentHash}`,
    `Sent Payment 0.20000 DCR${mockPayments[0].paymentHash}`
  ]);

  const searchInput = screen.getByPlaceholderText("Filter by Payment Hash");
  await user.type(searchInput, "payment-hash-0");

  await waitFor(() =>
    expect(
      screen
        .getAllByText(/Sent Payment/i)
        .map((node) => node.parentElement.textContent)
    ).toStrictEqual([
      `Sent Payment 0.01000 DCR${mockOutstandingPayments["mock-outstanding-payment-hash-0"].decoded.paymentHash}`,
      `Sent Payment 0.20000 DCR${mockPayments[0].paymentHash}`
    ])
  );

  await user.type(searchInput, "mock-hash-22-12");

  await waitFor(() =>
    expect(screen.queryByText(/Sent Payment/i)).not.toBeInTheDocument()
  );
  expect(screen.getByText(/no payment found/i)).toBeInTheDocument();
});
