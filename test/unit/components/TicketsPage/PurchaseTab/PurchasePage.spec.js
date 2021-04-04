import Purchase from "../../../../../app/components/views/TicketsPage/PurchaseTab/PurchaseTab.jsx";
import TicketAutoBuyer from "../../../../../app/components/views/TicketsPage/PurchaseTab/TicketAutoBuyer/";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { fireEvent, screen, wait } from "@testing-library/react";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as vsp from "../../../../../app/wallet/vsp";
import * as vspa from "actions/VSPActions";
import * as sa from "actions/SettingsActions";
import { DCR } from "constants";
import { en as enLocale } from "i18n/locales";
import { DEFAULT_LIGHT_THEME_NAME } from "pi-ui";
import { EXTERNALREQUEST_STAKEPOOL_LISTING } from "main_dev/externalRequests";

const mockVspInfo = {
  data: {
    pubkey: "test-pubkey",
    feepercentage: 2
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
const mockChangeAccountValue = 6;
const mockNumTicketsToBuy = 1;
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
const locale = enLocale;
const currentSettings = {
  locale: locale.key,
  theme: DEFAULT_LIGHT_THEME_NAME,
  allowedExternalRequests: [EXTERNALREQUEST_STAKEPOOL_LISTING]
};
const initialState = {
  initialState: {
    control: {
      numTicketsToBuy: mockNumTicketsToBuy
    },
    settings: {
      currentSettings,
      tempSettings: currentSettings
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
const mockLastVotedTicket = null;
const mockCurrencyDisplay = DCR;
const mockTicketPrice = 6816662938;

let mockPurchaseTicketsAttempt;
let mockRevokeTicketsAttempt;
let mockStartTicketBuyerV3Attempt;
let mockGetTicketAutoBuyerRunning;
let mockTicketBuyerCancel;
let mockGetRunningIndicator;
let mockToggleIsLegacy;
let mockSetRememberedVspHost;
let mockAddAllowedExternalRequest;

beforeEach(() => {
  sel.getIsLegacy = jest.fn(() => false);
  sel.stakePoolListingEnabled = jest.fn(() => true);
  sel.getAvailableVSPs = jest.fn(() => mockAvailableVsps);
  sel.spendingAccounts = jest.fn(() => [mockMixedAccount]);
  sel.visibleAccounts = jest.fn(() => [mockMixedAccount]);
  sel.getMixedAccount = jest.fn(() => mockMixedAccountValue);
  sel.getChangeAccount = jest.fn(() => mockChangeAccountValue);
  sel.defaultSpendingAccount = jest.fn(() => mockMixedAccount);
  sel.ticketPrice = jest.fn(() => mockTicketPrice);
  //stakeInfo
  sel.votedTicketsCount = jest.fn(() => mockVotedTicketsCount);
  sel.ownMempoolTicketsCount = jest.fn(() => mockOwnMempoolTicketsCount);
  sel.revokedTicketsCount = jest.fn(() => mockRevokedTicketsCount);
  sel.immatureTicketsCount = jest.fn(() => mockImmatureTicketsCount);
  sel.liveTicketsCount = jest.fn(() => mockLiveTicketsCount);
  sel.unspentTicketsCount = jest.fn(() => mockUnspentTicketsCount);
  sel.totalSubsidy = jest.fn(() => mockTotalSubsidy);
  sel.isSPV = jest.fn(() => false);
  sel.lastVotedTicket = jest.fn(() => mockLastVotedTicket);
  sel.currencyDisplay = jest.fn(() => mockCurrencyDisplay);
  sel.blocksNumberToNextTicket = jest.fn(() => 13);
  mockAddAllowedExternalRequest = sa.addAllowedExternalRequest = jest.fn(
    () => () => {}
  );

  mockPurchaseTicketsAttempt = ca.newPurchaseTicketsAttempt = jest.fn(
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
  mockToggleIsLegacy = vspa.toggleIsLegacy = jest.fn(() => () => {});
  mockSetRememberedVspHost = vspa.setRememberedVspHost = jest.fn(
    () => () => {}
  );
});

test("render PurchasePage", async () => {
  render(<Purchase />, initialState);

  // check PrivacyInfo
  user.click(screen.getByText("You are purchasing mixed tickets"));
  expect(
    screen.getByText(/Purchasing mixed tickets can take some time/i)
  ).toBeInTheDocument();

  // check Use Legacy VSP checkbox
  expect(
    screen.getByText(/use a VSP which has not updated to vspd/i)
  ).toBeInTheDocument(); //tooltip
  user.click(screen.getByLabelText("Use Legacy VSP"));
  expect(mockToggleIsLegacy).toHaveBeenCalledWith(true);

  // set stakepool
  user.click(screen.getByText("Select VSP..."));
  user.click(screen.getByText(mockAvailableVsps[1].host));
  await wait(() =>
    expect(screen.queryByText("Loading")).not.toBeInTheDocument()
  );

  // check Always use this VSP checkbox
  user.click(screen.getByLabelText("Always use this VSP"));
  expect(mockSetRememberedVspHost).toHaveBeenCalledWith({
    host: mockAvailableVsps[1].host,
    pubkey: mockVspInfo.data.pubkey
  });

  // check summary
  expect(screen.getByText("VSP Fee:").nextElementSibling.textContent).toMatch(
    `${mockVspInfo.data.feepercentage} %`
  );
  expect(screen.getByText(/Total:/).textContent).toMatch(
    `${mockTicketPrice / 100000000} ${DCR}`
  );
  expect(screen.getByText(/Remaining:/).textContent).toMatch(
    `${(mockMixedAccount.spendable - mockTicketPrice) / 100000000} ${DCR}`
  );

  const purchaseButton = screen.getByText("Purchase");
  user.click(purchaseButton);
  user.type(screen.getByLabelText("Private Passphrase:"), mockPassphrase);
  user.click(screen.getByText("Continue"));
  expect(mockPurchaseTicketsAttempt).toHaveBeenCalledWith(
    mockPassphrase,
    mockMixedAccount,
    mockNumTicketsToBuy,
    {
      host: mockAvailableVsps[1].host,
      pubkey: mockVspInfo.data.pubkey
    }
  );

  // test amount input
  const inputTag = screen.getByLabelText("Amount");

  const moreButton = screen.getByRole("button", { name: "more" });
  user.click(moreButton);
  expect(inputTag.value).toBe("2");

  const lessButton = screen.getByRole("button", { name: "less" });
  user.click(lessButton);
  expect(inputTag.value).toBe("1");
  // remain 1
  user.click(lessButton);
  expect(inputTag.value).toBe("1");

  /* test arrow key */
  fireEvent.keyDown(inputTag, { keyCode: 38 });
  expect(inputTag.value).toBe("2");
  fireEvent.keyDown(inputTag, { keyCode: 40 });
  expect(inputTag.value).toBe("1");

  user.clear(inputTag);
  expect(inputTag.value).toBe("");

  // "" => 1
  user.click(moreButton);
  expect(inputTag.value).toBe("1");

  // not enough funds
  mockPurchaseTicketsAttempt.mockReset();
  user.type(inputTag, "100000000");
  user.click(purchaseButton);
  expect(mockPurchaseTicketsAttempt).not.toHaveBeenCalled();

  // revoke
  user.click(screen.getByText("Revoke"));
  expect(screen.getByText(/revoke tickets confirmation/i)).toBeInTheDocument();
  // cancel first
  user.click(screen.getByText("Cancel"));
  // try again
  user.click(screen.getByText("Revoke"));
  user.type(screen.getByLabelText("Private Passphrase:"), mockPassphrase);
  user.click(screen.getByText("Continue"));
  expect(mockRevokeTicketsAttempt).toHaveBeenCalledWith(mockPassphrase);
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

test("test when VSP listing is not enabled ", () => {
  render(<Purchase />);
  expect(
    screen.getByText(
      /VSP listing from external API endpoint is currently disabled/i
    )
  ).toBeInTheDocument();
  user.click(screen.getByRole("button", { name: "Enable VSP Listing" }));
  expect(mockAddAllowedExternalRequest).toHaveBeenCalledWith(
    EXTERNALREQUEST_STAKEPOOL_LISTING
  );
});

test("test `end of a ticket interval` state", () => {
  sel.blocksNumberToNextTicket = jest.fn(() => 2);
  sel.isSPV = jest.fn(() => true);
  render(<Purchase />, initialState);
  expect(
    screen.getByText(
      /Purchase Tickets is not available right now, because we are at the end of a ticket interval. After one block it will be available again./i
    )
  ).toBeInTheDocument();
});
