import { ChannelsTab } from "components/views/LNPage/ChannelsTab";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen, wait, fireEvent } from "@testing-library/react";
import * as sel from "selectors";
import * as lna from "actions/LNActions";
import { DCR } from "constants";
import {
  mockChannels,
  mockPendingChannels,
  mockClosedChannels,
  mockDescribeGraph
} from "./mocks";

const selectors = sel;
const lnActions = lna;

let mockViewChannelDetails;
let mockOpenChannel;
let mockCloseChannel;

beforeEach(() => {
  selectors.currencyDisplay = jest.fn(() => DCR);
  selectors.lnPendingChannels = jest.fn(() => mockPendingChannels);
  selectors.lnClosedChannels = jest.fn(() => mockClosedChannels);
  selectors.lnChannels = jest.fn(() => mockChannels);
  mockViewChannelDetails = lnActions.viewChannelDetails = jest.fn(
    () => () => {}
  );
  mockOpenChannel = lnActions.openChannel = jest.fn(() => (dispatch) => {
    dispatch({
      type: lna.LNWALLET_RECENTLY_OPENEDCHANNEL,
      channelPoint: mockChannels[0].channelPoint
    });
    return Promise.resolve();
  });
  mockCloseChannel = lnActions.closeChannel = jest.fn(() => () => {});
  selectors.lnDescribeGraph = jest.fn(() => mockDescribeGraph);
});

test("test channel list", () => {
  render(<ChannelsTab />);

  // check active card
  user.click(screen.getByText(mockChannels[0].channelPoint));
  expect(mockViewChannelDetails).toHaveBeenCalledWith(
    mockChannels[0].channelPoint
  );
  expect(screen.getByText("Open").previousSibling.alt).toBe("bluePending");
  expect(
    screen.getByText("Open").parentNode.parentNode.parentNode.textContent
  ).toBe("2.00000 DCRcpa-0Open Local:0.7899636 DCR Remote:1.21000 DCRCapacity");

  // check pending card
  user.click(screen.getByText(mockPendingChannels[0].channelPoint));
  expect(mockViewChannelDetails).toHaveBeenCalledWith(
    mockPendingChannels[0].channelPoint
  );
  expect(screen.getByText("Pending").previousSibling.alt).toBe("yellowTime");
  expect(
    screen.getByText("Pending").parentNode.parentNode.parentNode.textContent
  ).toBe(
    "2.00000 DCRcpp-0Pending Local:0.9999636 DCR Remote:1.00000 DCRCapacity"
  );

  // check closed card
  user.click(screen.getByText(mockClosedChannels[0].channelPoint));
  expect(mockViewChannelDetails).toHaveBeenCalledWith(
    mockClosedChannels[0].channelPoint
  );
  expect(screen.getByText("Closed").previousSibling.alt).toBe("grayNegative");
  expect(screen.getByText("Settled").textContent).toBe("Settled0.47381162 DCR");
  expect(screen.getByText("Timelocked").textContent).toBe(
    "Timelocked0.00000 DCR"
  );
});

test("test filter control", async () => {
  render(<ChannelsTab />);

  // by default, all types are shown
  expect(screen.getByText("Open")).toBeInTheDocument();
  expect(screen.getByText("Pending")).toBeInTheDocument();
  expect(screen.getByText("Closed")).toBeInTheDocument();

  const filterMenuButton = screen.getByRole("button", {
    name: "EyeFilterMenu"
  });

  user.click(filterMenuButton);
  user.click(screen.getAllByText("Closed")[0]);

  await wait(() => expect(screen.queryByText("Open")).not.toBeInTheDocument());
  expect(screen.queryByText("Pending")).not.toBeInTheDocument();
  expect(screen.getByText("Closed")).toBeInTheDocument();

  user.click(filterMenuButton);
  user.click(screen.getAllByText("Pending")[0]);

  await wait(() =>
    expect(screen.queryByText("Closed")).not.toBeInTheDocument()
  );
  expect(screen.queryByText("Open")).not.toBeInTheDocument();
  expect(screen.getByText("Pending")).toBeInTheDocument();
});

test("test search control", async () => {
  render(<ChannelsTab />);

  // by default, all types are shown
  expect(screen.getByText("Open")).toBeInTheDocument();
  expect(screen.getByText("Pending")).toBeInTheDocument();
  expect(screen.getByText("Closed")).toBeInTheDocument();

  const searchInput = screen.getByPlaceholderText("Filter by Channel Point");
  fireEvent.change(searchInput, {
    target: { value: "not valid channel point" }
  });

  await wait(() => expect(screen.queryByText("Open")).not.toBeInTheDocument());
  expect(screen.queryByText("Pending")).not.toBeInTheDocument();
  expect(screen.queryByText("Closed")).not.toBeInTheDocument();
  expect(screen.getByText(/no channel found/i)).toBeInTheDocument();

  fireEvent.change(searchInput, {
    target: { value: "cpp" }
  });
  await wait(() => expect(screen.getByText("Pending")).toBeInTheDocument());
  fireEvent.change(searchInput, {
    target: { value: "" }
  });
  await wait(() => expect(screen.getByText("Open")).toBeInTheDocument());
  expect(screen.getByText("Pending")).toBeInTheDocument();
  expect(screen.getByText("Closed")).toBeInTheDocument();
});

const getNodeInput = () => screen.getByLabelText("Counterparty Node");
const getAmountToCommitInput = () => screen.getByLabelText("Amount to Commit");
const getPushAmountToCommitInput = () =>
  screen.getByLabelText("Push Amount (optional)");
const getCreateChannelButton = () =>
  screen.getByRole("button", { name: "Create Channel" });
const getCancelChannelButton = () =>
  screen.getByRole("button", { name: "Close Channel" });
const getConfirmButton = () => screen.getByText("Confirm");

test("test create form and receintly created modal", async () => {
  render(<ChannelsTab />);

  const mockNode = "mock-node";
  const mockAmount = 12;
  const createChannelBt = getCreateChannelButton();

  expect(createChannelBt.disabled).toBe(true);
  user.type(getNodeInput(), mockNode);
  expect(createChannelBt.disabled).toBe(true);
  user.type(getAmountToCommitInput(), `${mockAmount}`);
  expect(createChannelBt.disabled).toBe(false);

  user.click(createChannelBt);
  await wait(() =>
    expect(mockOpenChannel).toHaveBeenCalledWith(
      mockNode,
      mockAmount * 100000000,
      null //pushAmt is null on mainnet
    )
  );

  // inputs shoud be reseted now
  expect(getNodeInput().value).toBe("");
  expect(getAmountToCommitInput().value).toBe("");

  await wait(() => screen.getByText("Channel Created"));

  expect(
    screen.getAllByText("Open")[1].parentNode.parentNode.parentNode.textContent
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

  const cancelChannelBt = getCancelChannelButton();
  user.click(cancelChannelBt);
  expect(
    screen.getByText(/Attempt cooperative close of channel/i)
  ).toBeInTheDocument();

  fireEvent.click(getConfirmButton());

  await wait(() =>
    expect(mockCloseChannel).toHaveBeenCalledWith(
      mockChannels[0].channelPoint,
      false
    )
  );
  expect(
    screen.queryByText(/Attempt cooperative close of channel/i)
  ).not.toBeInTheDocument();

  //close recentlyOpenedChannel modal
  user.click(screen.getByTestId("lnchannel-close-button"));
  expect(screen.queryByText("Channel Created")).not.toBeInTheDocument();
});

test("test push amount in testnet mode", async () => {
  selectors.isTestNet = jest.fn(() => true);
  selectors.isMainNet = jest.fn(() => false);
  render(<ChannelsTab />);

  const mockNode = "mock-node";
  const mockAmount = 12;
  const mockPushAmount = 34;
  const createChannelBt = getCreateChannelButton();

  expect(createChannelBt.disabled).toBe(true);
  user.type(getNodeInput(), mockNode);
  expect(createChannelBt.disabled).toBe(true);
  user.type(getAmountToCommitInput(), `${mockAmount}`);
  expect(createChannelBt.disabled).toBe(false);
  user.type(getPushAmountToCommitInput(), `${mockPushAmount}`);
  expect(createChannelBt.disabled).toBe(false);

  user.click(createChannelBt);
  await wait(() =>
    expect(mockOpenChannel).toHaveBeenCalledWith(
      mockNode,
      mockAmount * 100000000,
      mockPushAmount * 100000000
    )
  );

  // inputs shoud be reseted now
  expect(getNodeInput().value).toBe("");
  expect(getAmountToCommitInput().value).toBe("");
  expect(getPushAmountToCommitInput().value).toBe("");

  await wait(() => screen.getByText("Channel Created"));
});

test("test failing channel create form", async () => {
  mockOpenChannel = lnActions.openChannel = jest.fn(() => () => {
    return Promise.reject();
  });
  render(<ChannelsTab />);

  const mockNode = "mock-node";
  const mockAmount = 12;
  const createChannelBt = getCreateChannelButton();

  expect(createChannelBt.disabled).toBe(true);
  user.type(getNodeInput(), mockNode);
  expect(createChannelBt.disabled).toBe(true);
  user.type(getAmountToCommitInput(), `${mockAmount}`);
  expect(createChannelBt.disabled).toBe(false);

  user.click(createChannelBt);
  expect(createChannelBt.disabled).toBe(true);
  expect(mockOpenChannel).toHaveBeenCalled();

  await wait(() => expect(createChannelBt.disabled).toBe(false));

  // inputs shoud NOT be reseted
  expect(getNodeInput().value).toBe(mockNode);
  expect(getAmountToCommitInput().value).toBe(`${mockAmount}`);

  expect(screen.queryByText("Channel Created")).not.toBeInTheDocument();
});
