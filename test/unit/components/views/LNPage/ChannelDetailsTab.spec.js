import ChannelDetailsPage from "components/views/LNPage/ChannelDetailsPage";
import { render } from "test-utils.js";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import * as sel from "selectors";
import * as lna from "actions/LNActions";
import * as cli from "actions/ClientActions";
import { DCR } from "constants";
import {
  mockChannels,
  mockPendingChannels,
  mockClosedChannels,
  mockLnChannelBalance
} from "./mocks";

const selectors = sel;
const lnActions = lna;
const cliActions = cli;

let mockCloseChannel;
let mockChannelPoint;
let mockGoBackHistory;

beforeEach(() => {
  selectors.lnChannelBalances = jest.fn(() => mockLnChannelBalance);
  selectors.currencyDisplay = jest.fn(() => DCR);
  selectors.lnPendingChannels = jest.fn(() => mockPendingChannels);
  selectors.lnClosedChannels = jest.fn(() => mockClosedChannels);
  selectors.lnChannels = jest.fn(() => mockChannels);
  mockCloseChannel = lnActions.closeChannel = jest.fn(() => () => {});
  mockGoBackHistory = cliActions.goBackHistory = jest.fn(() => () => {});
});
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    channelPoint: mockChannelPoint
  })
}));

const getCancelChannelButton = () =>
  screen.getByRole("button", { name: "Close Channel" });
const queryCancelChannelButton = () =>
  screen.queryByRole("button", { name: "Close Channel" });
const getConfirmButton = () => screen.getByText("Confirm");

test("open channel details", async () => {
  mockChannelPoint = mockChannels[0].channelPoint;
  const { user } = render(<ChannelDetailsPage />);

  expect(screen.getByText("Open").previousSibling.alt).toBe("greenCheck");
  expect(
    screen.getByText("Open").parentNode.parentNode.parentNode.textContent
  ).toBe("2.00000 DCRcpa-0Open Local:0.7899636 DCR Remote:1.21000 DCRCapacity");

  expect(screen.getByText("Channel ID:").nextSibling.textContent).toBe(
    mockChannels[0].chanId
  );
  expect(screen.getByText("Channel Point:").nextSibling.textContent).toBe(
    mockChannels[0].channelPoint
  );
  expect(screen.getByText("Commit Fee:").nextSibling.textContent).toBe(
    "0.0000364 DCR"
  );
  expect(screen.getByText("CSV Delay:").nextSibling.textContent).toBe(
    `${mockChannels[0].csvDelay} Blocks`
  );
  expect(screen.getByText("Remote PubKey:").nextSibling.textContent).toBe(
    `${mockChannels[0].remotePubkey}mock-...key-0Copied`
  );
  expect(screen.getByText("Number of Updates:").nextSibling.textContent).toBe(
    `${mockChannels[0].numUpdates}`
  );
  expect(screen.getByText("Local Reserve:").nextSibling.textContent).toBe(
    "0.02000 DCR"
  );
  expect(screen.getByText("Remote Reserve:").nextSibling.textContent).toBe(
    "0.02000 DCR"
  );
  expect(screen.getByText("Unsettled Balance:").nextSibling.textContent).toBe(
    "0.00000 DCR"
  );
  expect(screen.getByText("Total Sent:").nextSibling.textContent).toBe(
    "0.21000 DCR"
  );
  expect(screen.getByText("Total Received:").nextSibling.textContent).toBe(
    "0.00000 DCR"
  );

  const cancelChannelBt = getCancelChannelButton();
  await user.click(cancelChannelBt);
  expect(
    screen.getByText(/Attempt cooperative close of channel/i)
  ).toBeInTheDocument();

  fireEvent.click(getConfirmButton());

  await waitFor(() =>
    expect(mockCloseChannel).toHaveBeenCalledWith(
      mockChannels[0].channelPoint,
      false
    )
  );

  expect(
    screen.queryByText(/Attempt cooperative close of channel/i)
  ).not.toBeInTheDocument();

  await user.click(screen.getByTestId("goBackHistory"));
  expect(mockGoBackHistory).toHaveBeenCalled();
});

test("pending channel details", async () => {
  mockChannelPoint = mockPendingChannels[0].channelPoint;
  const { user } = render(<ChannelDetailsPage />);

  expect(screen.getByText("Pending").previousSibling.alt).toBe("bluePending");
  expect(
    screen.getByText("Pending").parentNode.parentNode.parentNode.textContent
  ).toBe(
    "2.00000 DCRcpp-0Pending Local:0.9999636 DCR Remote:1.00000 DCRCapacity"
  );

  expect(screen.getByText("Type:").nextSibling.textContent).toBe("Open");
  expect(screen.queryByText("Channel ID:")).not.toBeInTheDocument();
  expect(screen.getByText("Channel Point:").nextSibling.textContent).toBe(
    mockPendingChannels[0].channelPoint
  );
  expect(screen.getByText("Commit Fee:").nextSibling.textContent).toBe(
    "0.0000364 DCR"
  );
  expect(screen.queryByText("CSV Delay:")).not.toBeInTheDocument();
  expect(screen.getByText("Remote PubKey:").nextSibling.textContent).toBe(
    `${mockPendingChannels[0].remotePubkey}mock-...pub-0Copied`
  );
  expect(screen.queryByText("Number of Updates:")).not.toBeInTheDocument();
  expect(screen.queryByText("Local Reserve:")).not.toBeInTheDocument();
  expect(screen.queryByText("Remote Reserve:")).not.toBeInTheDocument();
  expect(screen.queryByText("Unsettled Balance:")).not.toBeInTheDocument();
  expect(screen.queryByText("Total Sent:")).not.toBeInTheDocument();
  expect(screen.queryByText("Total Received:")).not.toBeInTheDocument();
  expect(screen.queryByText("Closing Tx:")).not.toBeInTheDocument();
  expect(screen.queryByText("Recovered Balance:")).not.toBeInTheDocument();

  // show close button for pending channels too
  const cancelChannelBt = getCancelChannelButton();
  await user.click(cancelChannelBt);
  expect(
    screen.getByText(/Attempt forced close of the channel/i)
  ).toBeInTheDocument();

  fireEvent.click(getConfirmButton());

  await waitFor(() =>
    expect(mockCloseChannel).toHaveBeenCalledWith(
      mockPendingChannels[0].channelPoint,
      true
    )
  );

  expect(
    screen.queryByText(/Attempt forced close of the channel/i)
  ).not.toBeInTheDocument();
});

test("closed channel details", () => {
  mockChannelPoint = mockClosedChannels[0].channelPoint;
  render(<ChannelDetailsPage />);

  expect(screen.getByText("Closed").previousSibling.alt).toBe("grayNegative");
  expect(screen.getByText("Settled:").parentElement.textContent).toBe(
    "Settled:0.47381162 DCR"
  );
  expect(screen.getByText("Timelocked:").parentElement.textContent).toBe(
    "Timelocked:0.00000 DCR"
  );

  expect(screen.getByText("Channel ID:").nextSibling.textContent).toBe(
    mockClosedChannels[0].chanId
  );
  expect(screen.getByText("Close Type:").nextSibling.textContent).toBe(
    "Cooperative"
  );
  expect(screen.getByText("Channel Point:").nextSibling.textContent).toBe(
    mockClosedChannels[0].channelPoint
  );
  expect(screen.queryByText("Commit Fee:")).not.toBeInTheDocument();
  expect(screen.queryByText("CSV Delay:")).not.toBeInTheDocument();
  expect(screen.getByText("Remote PubKey:").nextSibling.textContent).toBe(
    `${mockClosedChannels[0].remotePubkey}mock-...key-0Copied`
  );
  expect(screen.getByText("Closing Tx:").nextSibling.textContent).toBe(
    `${mockClosedChannels[0].closingTxHash}mock-...-hash`
  );
  expect(screen.queryByText("Number of Updates:")).not.toBeInTheDocument();
  expect(screen.queryByText("Local Reserve:")).not.toBeInTheDocument();
  expect(screen.queryByText("Remote Reserve:")).not.toBeInTheDocument();
  expect(screen.queryByText("Unsettled Balance:")).not.toBeInTheDocument();
  expect(screen.queryByText("Total Sent:")).not.toBeInTheDocument();
  expect(screen.queryByText("Total Received:")).not.toBeInTheDocument();

  expect(queryCancelChannelButton()).not.toBeInTheDocument();
});

const testCloseType = (closeType, expectedCloseType) => {
  selectors.lnClosedChannels = jest.fn(() => [
    {
      ...mockClosedChannels[0],
      closeType: closeType
    }
  ]);
  mockChannelPoint = mockClosedChannels[0].channelPoint;
  render(<ChannelDetailsPage />);

  expect(screen.getByText("Close Type:").nextSibling.textContent).toBe(
    expectedCloseType
  );
};

test.each([
  [lna.CLOSETYPE_LOCAL_FORCE_CLOSE, "Local Force-close"],
  [lna.CLOSETYPE_REMOTE_FORCE_CLOSE, "Remote Force-close"],
  [lna.CLOSETYPE_BREACH_CLOSE, "Breach Force-close"],
  [lna.CLOSETYPE_FUNDING_CANCELED, "Funding Canceled"],
  [lna.CLOSETYPE_ABANDONED, "Abandoned"]
])("close type id '%s' display '%s'", testCloseType);

test("test close pending status", () => {
  selectors.lnPendingChannels = jest.fn(() => [
    {
      ...mockPendingChannels[0],
      pendingStatus: "close"
    }
  ]);
  mockChannelPoint = mockPendingChannels[0].channelPoint;
  render(<ChannelDetailsPage />);

  expect(screen.getByText("Type:").nextSibling.textContent).toBe("Close");
  expect(screen.queryByText("Commit Fee:")).not.toBeInTheDocument();
  expect(screen.queryByText("Closing Tx:")).not.toBeInTheDocument();
  expect(screen.queryByText("Recovered Balance:")).not.toBeInTheDocument();
});

test("test force close pending status", () => {
  const mockClosingTxid = "mockClosingTxid";
  const mockClosingTxidURL = "closingTxidURL";
  const mockLimboBalance = 2000000;
  const mockRecoveredBalance = 1000000;
  selectors.lnPendingChannels = jest.fn(() => [
    {
      ...mockPendingChannels[0],
      pendingStatus: "forceclose",
      closingTxid: mockClosingTxid,
      closingTxidURL: mockClosingTxidURL,
      limboBalance: mockLimboBalance,
      recoveredBalance: mockRecoveredBalance
    }
  ]);
  mockChannelPoint = mockPendingChannels[0].channelPoint;
  render(<ChannelDetailsPage />);

  expect(screen.getByText("Type:").nextSibling.textContent).toBe("Force Close");
  expect(screen.queryByText("Commit Fee:")).not.toBeInTheDocument();
  expect(screen.getByText("Closing Tx:").nextSibling.textContent).toBe(
    `${mockClosingTxid}mockC...gTxid`
  );
  expect(screen.getByText("Limbo Balance:").nextSibling.textContent).toBe(
    "0.02000 DCR"
  );
  expect(screen.getByText("Recovered Balance:").nextSibling.textContent).toBe(
    "0.01000 DCR"
  );
});

test("test waitFor close pending status", () => {
  const mockLimboBalance = 2000000;
  selectors.lnPendingChannels = jest.fn(() => [
    {
      ...mockPendingChannels[0],
      pendingStatus: "waitclose",
      limboBalance: mockLimboBalance
    }
  ]);
  mockChannelPoint = mockPendingChannels[0].channelPoint;
  render(<ChannelDetailsPage />);

  expect(screen.getByText("Type:").nextSibling.textContent).toBe(
    "Waiting Close"
  );
  expect(screen.queryByText("Commit Fee:")).not.toBeInTheDocument();
  expect(screen.getByText("Limbo Balance:").nextSibling.textContent).toBe(
    "0.02000 DCR"
  );
  expect(screen.queryByText("Closing Tx:")).not.toBeInTheDocument();
  expect(screen.queryByText("Recovered Balance:")).not.toBeInTheDocument();
});
