import { OverviewTab } from "components/views/LNPage/OverviewTab";
import { render } from "test-utils.js";
import { screen, waitFor } from "@testing-library/react";
import { DCR } from "constants";
import * as sel from "selectors";
import * as lna from "actions/LNActions";
import {
  mockChannels,
  mockPendingChannels,
  mockClosedChannels,
  mockLnChannelBalance,
  mockFailedPayment,
  mockPayments,
  mockOutstandingPayments,
  mockInvoices,
  mockDescribeGraph,
  mockNetworkInfo
} from "./mocks";

const selectors = sel;
const lnActions = lna;

let mockCloseChannel;
let mockCancelInvoice;
let mockGoToChannelsTab;

const mockWalletBalance = {
  totalBalance: 632619804,
  confirmedBalance: 432619804,
  unconfirmedBalance: 232619804
};
const mockTransactions = [
  // channel funding
  {
    txHash: mockChannels[0].channelPoint,
    timeStamp: 1631102063
  },
  // closed channel
  {
    txHash: mockClosedChannels[0].closingTxHash,
    timeStamp: 1631102063
  }
];

beforeEach(() => {
  selectors.currencyDisplay = jest.fn(() => DCR);
  selectors.lnPendingChannels = jest.fn(() => mockPendingChannels);
  selectors.lnClosedChannels = jest.fn(() => mockClosedChannels);
  selectors.lnChannels = jest.fn(() => mockChannels);
  mockCloseChannel = lnActions.closeChannel = jest.fn(() => () => {});
  selectors.lnChannelBalances = jest.fn(() => mockLnChannelBalance);
  selectors.lnOutstandingPayments = jest.fn(() => mockOutstandingPayments);
  selectors.lnFailedPayments = jest.fn(() => mockFailedPayment);
  selectors.lnPayments = jest.fn(() => mockPayments);
  selectors.lnInvoices = jest.fn(() => mockInvoices);
  selectors.lnWalletBalances = jest.fn(() => mockWalletBalance);
  selectors.lnNetwork = jest.fn(() => mockNetworkInfo);
  selectors.lnTransactions = jest.fn(() => mockTransactions);
  selectors.lnDescribeGraph = jest.fn(() => mockDescribeGraph);

  mockCancelInvoice = lnActions.cancelInvoice = jest.fn(
    () => () => Promise.resolve()
  );
  lnActions.getNetworkInfo = jest.fn(() => () => {});
  mockGoToChannelsTab = lnActions.goToChannelsTab = jest.fn(() => () => {});
});

test("test account overview and net stats", () => {
  render(<OverviewTab />);

  expect(screen.getByText("Confirmed Balance").nextSibling.textContent).toBe(
    "4.32DCR"
  );
  expect(screen.getByText("Unconfirmed Balance").nextSibling.textContent).toBe(
    "2.32DCR"
  );
  expect(
    screen.getByText("Total Account Balance").nextSibling.textContent
  ).toBe("6.32DCR");
  expect(screen.getByText("Open Channels").nextSibling.textContent).toBe(
    `${mockChannels.length}`
  );
  expect(screen.getByText("Capacity").nextSibling.textContent).toBe("2.00DCR");
  expect(screen.getByText("Network Stats")).toBeInTheDocument();
  expect(screen.getByText("Nodes:").nextSibling.textContent).toBe(
    `${mockNetworkInfo.numNodes}`
  );
  expect(screen.getByText("Channels:").nextSibling.textContent).toBe(
    `${mockNetworkInfo.numChannels}`
  );
  expect(screen.getByText("Capacity:").nextSibling.textContent).toBe(
    "150.84830016 DCR"
  );
});

test("test recent activity list", async () => {
  const { user } = render(<OverviewTab />);

  // channel closed
  expect(screen.getByText("Channel Closed").parentElement.textContent).toBe(
    "Channel Closed 0.47381162 DCRcpc-0"
  );
  await user.click(screen.getByText("Channel Closed"));
  expect(screen.getByText("Channel Created")).toBeInTheDocument();
  await user.click(screen.getByTestId("lnchannel-close-button"));

  // channel funding
  expect(screen.getByText("Channel Funding").parentElement.textContent).toBe(
    "Channel Funding 0.00000 DCRcpa-0"
  );
  await user.click(screen.getByText("Channel Funding"));
  expect(screen.getByText("Channel Created")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Close Channel" }));
  await user.click(screen.getByText("Confirm"));

  await waitFor(() =>
    expect(mockCloseChannel).toHaveBeenCalledWith(
      mockChannels[0].channelPoint,
      false
    )
  );

  // sent payment
  expect(screen.getByText("Sent Payment").parentElement.textContent).toBe(
    "Sent Payment 0.20000 DCRmock-payment-hash-0"
  );
  await user.click(screen.getByText("Sent Payment"));
  expect(screen.getByText("Lightning Payment")).toBeInTheDocument();
  await user.click(screen.getByTestId("lnpayment-close-button"));

  // invoice
  expect(screen.getAllByText("Invoice for")[0].parentElement.textContent).toBe(
    "Invoice for 0.00001 DCRmock-rhash-hex-21"
  );
  await user.click(screen.getAllByText("Invoice for")[1]);
  expect(screen.getByText("Lightning Payment Request")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Cancel Invoice" }));
  expect(mockCancelInvoice).toHaveBeenCalledWith(mockInvoices[0].rHash);
  await waitFor(() =>
    expect(
      screen.queryByText("Lightning Payment Request")
    ).not.toBeInTheDocument()
  );

  // open a second invoice and close with the close button
  await user.click(screen.getAllByText("Invoice for")[0]);
  expect(screen.getByText("Lightning Payment Request")).toBeInTheDocument();
  await user.click(screen.getByTestId("lninvoice-close-button"));
  expect(
    screen.queryByText("Lightning Payment Request")
  ).not.toBeInTheDocument();
});

test("test no network yet", () => {
  selectors.lnNetwork = jest.fn(() => null);
  render(<OverviewTab />);
  expect(screen.queryByText("Network Stats")).not.toBeInTheDocument();
  expect(screen.queryByText("Nodes:")).not.toBeInTheDocument();
  expect(screen.queryByText("Channels:")).not.toBeInTheDocument();
  expect(screen.queryByText("Capacity:")).not.toBeInTheDocument();
});

test("test no activities yet", () => {
  selectors.lnPendingChannels = jest.fn(() => []);
  selectors.lnClosedChannels = jest.fn(() => []);
  selectors.lnChannels = jest.fn(() => []);
  selectors.lnOutstandingPayments = jest.fn(() => []);
  selectors.lnFailedPayments = jest.fn(() => []);
  selectors.lnPayments = jest.fn(() => []);
  selectors.lnInvoices = jest.fn(() => []);
  selectors.lnTransactions = jest.fn(() => []);
  render(<OverviewTab />);
  expect(screen.getByText("No activities yet")).toBeInTheDocument();
});

test("test search for nodes button", async () => {
  const { user } = render(<OverviewTab />);
  const searchForNodesButton = screen.getByTestId("searchForNodesButton");
  await user.click(searchForNodesButton);

  // click one of recent nodes
  expect(screen.getByText("Recent Nodes").nextSibling.textContent).toBe(
    "mock-alias-1mock...ub-0mock-alias-0mock...ey-0mock-alias-2mock...ey-0"
  );
  await user.click(screen.getByText("mock...ub-0").parentElement.nextSibling);
  expect(screen.queryByText("Search For Nodes")).not.toBeInTheDocument();

  await waitFor(() =>
    expect(mockGoToChannelsTab).toHaveBeenCalledWith(
      mockPendingChannels[0].remotePubkey
    )
  );
});
