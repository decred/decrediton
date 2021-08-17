import { SendTab } from "components/views/LNPage/SendTab";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen, wait } from "@testing-library/react";
import { DCR } from "constants";
import * as sel from "selectors";
import * as lna from "actions/LNActions";
import * as wl from "wallet";

const selectors = sel;
const lnActions = lna;
const wallet = wl;

const mockLnChannelBalance = {
  balance: 99997360,
  pendingOpenBalance: 0,
  maxInboundAmount: 97999000,
  maxOutboundAmount: 97997360
};

const mockOutstandingPayments = {
  "mock-outstanding-payment-hash-0": {
    decoded: {
      destination: "mock-destination-0",
      paymentHash: "mock-outstanding-payment-hash-0",
      numAtoms: 1000000,
      timestamp: 1628688648,
      expiry: 3600,
      description: "mock-outstanding-desc-0",
      descriptionHash: "",
      fallbackAddr: "",
      cltvExpiry: 80,
      routeHintsList: [],
      paymentAddr: "mock-payment-address-0",
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
    }
  }
};

const mockPayments = [
  {
    paymentHash: "mock-payment-hash-0",
    value: 20000000,
    creationDate: 1627810765,
    fee: 0,
    paymentPreimage: "mock-preimage-0",
    valueAtoms: 20000000,
    valueMAtoms: 20000000000,
    paymentRequest: "mock-payment-request-0",
    status: 2,
    feeAtoms: 0,
    feeMAtoms: 0,
    creationTimeNs: 1627810765912116500,
    htlcsList: [
      {
        status: 1,
        route: {
          totalTimeLock: 738888,
          totalFees: 0,
          totalAmt: 20000000,
          hopsList: [
            {
              chanId: "810928308391837696",
              chanCapacity: 200000000,
              amtToForward: 20000000,
              fee: 0,
              expiry: 738888,
              amtToForwardMAtoms: 20000000000,
              feeMAtoms: 0,
              pubKey: "mock-pubkey-0",
              tlvPayload: true,
              mppRecord: {
                paymentAddr: "mock-payment-address-0",
                totalAmtMAtoms: 20000000000
              },
              customRecordsMap: []
            }
          ],
          totalFeesMAtoms: 0,
          totalAmtMAtoms: 20000000000
        },
        attemptTimeNs: 1627810765956084200,
        resolveTimeNs: 1627810766343210800,
        preimage: "mock-preimage-htlc-0"
      }
    ],
    paymentIndex: 4,
    failureReason: 0
  }
];
const mockFailedPayment = [
  {
    paymentError: "mock-payment-error",
    decoded: {
      destination: "mock-destination",
      paymentHash: "mock-payment-hash",
      numAtoms: 10,
      timestamp: 1628512835,
      expiry: 3600,
      description: "mock-failed-desc",
      descriptionHash: "",
      fallbackAddr: "",
      cltvExpiry: 80,
      routeHintsList: [],
      paymentAddr: "mock-payment-address",
      numMAtoms: 10000,
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
    }
  }
];

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
  selectors.lnChannelBalances = jest.fn(() => mockLnChannelBalance);
  selectors.lnOutstandingPayments = jest.fn(() => mockOutstandingPayments);
  selectors.lnFailedPayments = jest.fn(() => mockFailedPayment);
  selectors.lnPayments = jest.fn(() => mockPayments);
  mockDecodePayRequest = lnActions.decodePayRequest = jest.fn(() => () =>
    Promise.resolve(mockValidDecodedPayRequest)
  );
  mockSendPayment = lnActions.sendPayment = jest.fn(() => () =>
    Promise.resolve()
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
  render(<SendTab />);

  const reqCodeInput = getReqCodeInput();
  user.type(reqCodeInput, mockReqCode);
  await wait(() =>
    expect(mockDecodePayRequest).toHaveBeenCalledWith(mockReqCode)
  );
  expect(screen.getByText("Valid Lightning Request")).toBeInTheDocument();
  expect(screen.getByText("Amount").parentNode.textContent).toMatch(
    "Amount0.01000 DCR"
  );
  expect(screen.getByText("Destination").parentNode.textContent).toMatch(
    "Destinationmock-...ation"
  );
  expect(screen.getByText("Expiry").parentNode.textContent).toMatch(
    "ExpiryExpires in 1 hour"
  );
  expect(screen.getByText("Description:").parentNode.textContent).toMatch(
    `Description:${mockValidDecodedPayRequest.description}`
  );
  expect(screen.getByText("Payment Hash:").parentNode.textContent).toMatch(
    `Payment Hash:${mockValidDecodedPayRequest.paymentHash}`
  );

  expect(screen.queryByText("Ctlv Expiry:")).not.toBeInTheDocument();
  // open details
  const details = screen.getByText("Details");
  user.click(details);

  expect(screen.getByText("Ctlv Expiry:").parentNode.textContent).toMatch(
    `Ctlv Expiry:${mockValidDecodedPayRequest.cltvExpiry}`
  );
  expect(screen.getByText("Fallback Address:").parentNode.textContent).toMatch(
    `Fallback Address:${mockValidDecodedPayRequest.fallbackAddr}`
  );
  expect(screen.getByText("Payment Address:").parentNode.textContent).toMatch(
    `Payment Address:${mockValidDecodedPayRequest.paymentAddr}`
  );

  // close details
  user.click(details);
  expect(screen.queryByText("Ctlv Expiry:")).not.toBeInTheDocument();

  user.click(getSendButton());
  expect(mockSendPayment).toHaveBeenCalledWith(mockReqCode, 0);
});

test("test send form with expired lightning request (with empty fallbackAddr)", async () => {
  mockDecodePayRequest = lnActions.decodePayRequest = jest.fn(() => () =>
    Promise.resolve(mockExpiredDecodedPayRequest)
  );
  render(<SendTab />);

  const reqCodeInput = getReqCodeInput();
  user.type(reqCodeInput, mockReqCode);
  await wait(() =>
    expect(mockDecodePayRequest).toHaveBeenCalledWith(mockReqCode)
  );
  expect(screen.getByText("Invoice expired")).toBeInTheDocument();
  expect(screen.getByText("Expiry").parentNode.textContent).toMatch(
    "ExpiryExpired 1 hour ago"
  );

  expect(screen.queryByText("Ctlv Expiry:")).not.toBeInTheDocument();
  // open details
  const details = screen.getByText("Details");
  user.click(details);

  expect(screen.getByText("Fallback Address:").parentNode.textContent).toMatch(
    "Fallback Address:(empty fallback address)"
  );

  // close details
  user.click(details);
  expect(screen.queryByText("Ctlv Expiry:")).not.toBeInTheDocument();

  expect(querySendButton()).not.toBeInTheDocument();
});

test("test send form with invalid lightning request", async () => {
  const mockErrorResp = "mock-error-resp";
  mockDecodePayRequest = lnActions.decodePayRequest = jest.fn(() => () =>
    Promise.reject(mockErrorResp)
  );
  render(<SendTab />);

  const reqCodeInput = getReqCodeInput();
  user.type(reqCodeInput, mockReqCode);
  await wait(() =>
    expect(mockDecodePayRequest).toHaveBeenCalledWith(mockReqCode)
  );
  expect(screen.getByText(mockErrorResp)).toBeInTheDocument();
});

test("test paste and clear button", async () => {
  render(<SendTab />);

  const mockPastedPayReq = "mockPastedPayReq";
  wallet.readFromClipboard.mockImplementation(() => mockPastedPayReq);

  user.click(getPasteButton());
  await wait(() => expect(getReqCodeInput().value).toBe(mockPastedPayReq));

  user.click(getClearButton());
  await wait(() => expect(getReqCodeInput().value).toBe(""));
});

test("test payment list and modal ", async () => {
  render(<SendTab />);

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
  user.click(screen.getByText("Pending"));
  expect(screen.getAllByText("Pending").length).toBe(2);
  //modal has been closed
  user.click(screen.getByTestId("lnpayment-close-button"));
  await wait(() =>
    expect(screen.queryByText("Lightning Payment")).not.toBeInTheDocument()
  );

  // click on the second (failed) payment and check modal
  user.click(screen.getByText("Failed"));
  expect(screen.getAllByText("Failed").length).toBe(2);
  expect(
    screen.getByText(mockFailedPayment[0].decoded.paymentHash)
  ).toBeInTheDocument();
  user.click(screen.getByTestId("lnpayment-close-button"));
  expect(screen.queryByText("Lightning Payment")).not.toBeInTheDocument();

  // click on the second (confirmed) payment and check modal
  user.click(screen.getByText("Confirmed"));
  expect(screen.getAllByText("Confirmed").length).toBe(2);
  expect(screen.getByText(mockPayments[0].paymentHash)).toBeInTheDocument();
  user.click(screen.getByTestId("lnpayment-close-button"));
  expect(screen.queryByText("Lightning Payment")).not.toBeInTheDocument();
});

test("test sort control", async () => {
  render(<SendTab />);

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

  user.click(sortMenuButton);
  user.click(screen.getByText("Oldest"));

  await wait(() =>
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
  render(<SendTab />);

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
  user.type(searchInput, "payment-hash-0");

  await wait(() =>
    expect(
      screen
        .getAllByText(/Sent Payment/i)
        .map((node) => node.parentElement.textContent)
    ).toStrictEqual([
      `Sent Payment 0.01000 DCR${mockOutstandingPayments["mock-outstanding-payment-hash-0"].decoded.paymentHash}`,
      `Sent Payment 0.20000 DCR${mockPayments[0].paymentHash}`
    ])
  );

  user.type(searchInput, "mock-hash-22-12");

  await wait(() =>
    expect(screen.queryByText(/Sent Payment/i)).not.toBeInTheDocument()
  );
  expect(screen.getByText(/no payment found/i)).toBeInTheDocument();
});
