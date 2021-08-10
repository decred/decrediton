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

const mockOutstandingPayments = {};
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
const mockReqCode = "mock-req-code";
const mockValidDecodedPayRequest = {
  destination: "mock-destination",
  paymentHash: "mock-payment-hash",
  numAtoms: 1000000,
  timestamp: 1626958864,
  expiry: 3600,
  description: "mock-description",
  descriptionHash: "",
  fallbackAddr: "",
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

let mockDecodePayRequest;
let mockSendPayment;

beforeEach(() => {
  selectors.currencyDisplay = jest.fn(() => DCR);
  selectors.lnChannelBalances = jest.fn(() => mockLnChannelBalance);
  selectors.lnOutstandingPayments = jest.fn(() => mockOutstandingPayments);
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
    `Destination${mockValidDecodedPayRequest.destination}`
  );

  user.click(getSendButton());
  expect(mockSendPayment).toHaveBeenCalledWith(mockReqCode, 0);
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

test("test payments list", () => {
  render(<SendTab />);

  screen.debug();
});
