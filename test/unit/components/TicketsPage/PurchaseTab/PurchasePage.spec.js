import TicketAutoBuyer from "../../../../../app/components/views/TicketsPage/PurchaseTab/TicketAutoBuyer/";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen, wait } from "@testing-library/react";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as vsp from "../../../../../app/wallet/vsp";
import { DCR } from "constants";

const mockVspInfo = {
  data: {
    pubkey: "test-pubkey"
  }
};
const mockAvailableVsps = [
  {
    host: "https://test-stakepool1.eu",
    label: "https://test-stakepool1.eu",
    vspData: {
      feepercentage: 1
    }
  },
  {
    host: "https://test-stakepool2.eu",
    label: "https://test-stakepool2.eu",
    vspData: {
      feepercentage: 2
    }
  }
];
const mockMixedAccountValue = 6;
const mockMixedAccount = {
  hidden: false,
  label: "mixed: 249.79547928 DCR",
  name: "mixed",
  spendable: 24979547928,
  spendableAndUnit: "249.79547928 DCR",
  total: 24979547928,
  value: mockMixedAccountValue
};

const mockPassphrase = "test-passphrase";
const initialState = {
  initialState: {
    control: {
      numTicketsToBuy: 1
    }
  }
};

const mockVotedTicketsCount = 3;
const mockOwnMempoolTicketsCount = 5;
const mockRevokedTicketsCount = 7;
const mockImmatureTicketsCount = 6;
const mockLiveTicketsCount = 7;
const mockUnspentTicketsCount = 2;
const mockTotalSubsidy = 400000000;
const mockIsSPV = false;
const mockLastVotedTicket = null;
const mockCurrencyDisplay = DCR;

let mockPurchaseTicketsAttempt;
let mockRevokeTicketsAttempt;
let mockStartTicketBuyerV3Attempt;
let mockGetTicketAutoBuyerRunning;
let mockTicketBuyerCancel;
let mockGetRunningIndicator;

beforeEach(() => {
  sel.getIsLegacy = jest.fn(() => true);
  sel.stakePoolListingEnabled = jest.fn(() => true);
  sel.getAvailableVSPs = jest.fn(() => mockAvailableVsps);
  sel.spendingAccounts = jest.fn(() => [mockMixedAccount]);
  sel.visibleAccounts = jest.fn(() => [mockMixedAccount]);
  sel.getMixedAccount = jest.fn(() => mockMixedAccountValue);
  sel.defaultSpendingAccount = jest.fn(() => mockMixedAccount);
  //stakeInfo
  sel.votedTicketsCount = jest.fn(() => mockVotedTicketsCount);
  sel.ownMempoolTicketsCount = jest.fn(() => mockOwnMempoolTicketsCount);
  sel.revokedTicketsCount = jest.fn(() => mockRevokedTicketsCount);
  sel.immatureTicketsCount = jest.fn(() => mockImmatureTicketsCount);
  sel.liveTicketsCount = jest.fn(() => mockLiveTicketsCount);
  sel.unspentTicketsCount = jest.fn(() => mockUnspentTicketsCount);
  sel.totalSubsidy = jest.fn(() => mockTotalSubsidy);
  sel.isSPV = jest.fn(() => mockIsSPV);
  sel.lastVotedTicket = jest.fn(() => mockLastVotedTicket);
  sel.currencyDisplay = jest.fn(() => mockCurrencyDisplay);

  mockPurchaseTicketsAttempt = ca.purchaseTicketsAttempt = jest.fn(
    () => () => {}
  );
  mockRevokeTicketsAttempt = ca.revokeTicketsAttempt = jest.fn(() => () => {});
  mockStartTicketBuyerV3Attempt = ca.startTicketBuyerV3Attempt = jest.fn(
    () => () => {}
  );
  mockGetTicketAutoBuyerRunning = sel.getTicketAutoBuyerRunning = jest.fn(
    () => false
  );
  mockTicketBuyerCancel = ca.ticketBuyerCancel = jest.fn(() => () => {});
  mockGetRunningIndicator = sel.getRunningIndicator = jest.fn(() => false);
  vsp.getVSPInfo = jest.fn(() => {
    return Promise.resolve(mockVspInfo);
  });
});

test("test autobuyer", async () => {
  render(<TicketAutoBuyer />, initialState);
  const settingsButton = screen.getByRole("button", {
    name: "Ticket Autobuyer Settings"
  });
  user.click(screen.getByTestId("toggleSwitch"));
  const saveButton = screen.getByRole("button", { name: "Save" });
  user.click(saveButton);
  expect(screen.getByText("Fill all fields.")).toBeInTheDocument();
  const mockBalanceToMaintain = 14;
  user.type(
    screen.getByLabelText(/Balance to Maintain/i),
    `${mockBalanceToMaintain}`
  );

  user.click(saveButton);
  expect(screen.getByText("Fill all fields.")).toBeInTheDocument();
  // set stakepool
  user.click(screen.getByText("Select VSP..."));
  user.click(screen.getByText(mockAvailableVsps[1].host));
  await wait(() =>
    expect(screen.queryByText("Loading")).not.toBeInTheDocument()
  );
  user.click(saveButton);
  expect(screen.getByText("Fill all fields.")).toBeInTheDocument();

  // set account
  user.click(screen.getByText("Select account"));
  user.click(screen.getByText(mockMixedAccount.name));
  user.click(saveButton);

  // check settings
  user.click(settingsButton);
  expect(screen.getByLabelText(/Balance to Maintain/i).value).toBe(
    `${mockBalanceToMaintain}`
  );
  expect(screen.getByText(mockAvailableVsps[1].host)).toBeInTheDocument();
  expect(screen.getByText(mockMixedAccount.name)).toBeInTheDocument();
  user.click(screen.getByRole("button", { name: "Cancel" }));

  user.click(screen.getByTestId("toggleSwitch"));
  // clicking again on switch should open the confirmation modal
  user.click(screen.getByTestId("toggleSwitch"));
  expect(
    screen.getByText(/start ticket buyer confirmation/i)
  ).toBeInTheDocument();
  expect(screen.getByText(mockAvailableVsps[1].host)).toBeInTheDocument();
  expect(screen.getByText(`${mockBalanceToMaintain}.00`)).toBeInTheDocument();
  // cancel first
  user.click(screen.getByText("Cancel"));
  // try again
  user.click(screen.getByTestId("toggleSwitch"));
  user.type(screen.getByLabelText("Private Passphrase:"), mockPassphrase);
  user.click(screen.getByText("Continue"));
  expect(mockStartTicketBuyerV3Attempt).toHaveBeenCalledWith(
    mockPassphrase,
    mockMixedAccount,
    mockBalanceToMaintain * 100000000,
    {
      host: mockAvailableVsps[1].host,
      pubkey: mockVspInfo.data.pubkey
    }
  );
});

test("test autobuyer (autobuyer is runnning)", () => {
  mockGetTicketAutoBuyerRunning = sel.getTicketAutoBuyerRunning = jest.fn(
    () => true
  );
  render(<TicketAutoBuyer />, initialState);
  expect(mockGetTicketAutoBuyerRunning).toHaveBeenCalled();
  expect(screen.getByText(/turn off auto buyer/i)).toBeInTheDocument();
  user.click(screen.getByTestId("toggleSwitch"));
  expect(mockTicketBuyerCancel).toHaveBeenCalled();
});

test("test legacy autobuyer (a process is runnning)", () => {
  mockGetRunningIndicator = sel.getRunningIndicator = jest.fn(() => true);
  render(<TicketAutoBuyer />, initialState);
  expect(
    screen.getByText(/privacy mixer or purchase ticket attempt running/i)
  ).toBeInTheDocument();
  user.click(screen.getByTestId("toggleSwitch"));

  expect(
    screen.queryByText(/start ticket buyer confirmation/i)
  ).not.toBeInTheDocument();
  expect(mockGetRunningIndicator).toHaveBeenCalled();
});
