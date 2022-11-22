import Purchase from "components/views/TicketsPage/PurchaseTab/PurchaseTab.jsx";
import TicketAutoBuyer from "components/views/TicketsPage/PurchaseTab/TicketAutoBuyer/";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { fireEvent, screen, wait } from "@testing-library/react";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as wal from "wallet";
import * as vspa from "actions/VSPActions";
import * as sa from "actions/SettingsActions";
import { DCR } from "constants";
import { en as enLocale } from "i18n/locales";
import { DEFAULT_LIGHT_THEME_NAME } from "pi-ui";
import { EXTERNALREQUEST_STAKEPOOL_LISTING } from "constants";
import * as arrs from "../../../../../../app/helpers/arrays";
import {
  mockVspInfo,
  mockAvailableVsps,
  mockMixedAccountValue,
  mockChangeAccountValue,
  mockNumTicketsToBuy,
  mockMixedAccount
} from "./mocks";

const selectors = sel;
const controlActions = ca;
const vspActions = vspa;
const settingsActions = sa;
const wallet = wal;
const arrays = arrs;

const mockPassphrase = "test-passphrase";
const locale = enLocale;
const currentSettings = {
  locale: locale.key,
  theme: DEFAULT_LIGHT_THEME_NAME,
  allowedExternalRequests: [EXTERNALREQUEST_STAKEPOOL_LISTING]
};
const initialState = {
  initialState: {
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
let mockStartTicketBuyerAttempt;
let mockGetTicketAutoBuyerRunning;
let mockTicketBuyerCancel;
let mockSetRememberedVspHost;
let mockAddAllowedExternalRequest;

beforeEach(() => {
  selectors.getAvailableVSPs = jest.fn(() => mockAvailableVsps);
  selectors.spendingAccounts = jest.fn(() => [mockMixedAccount]);
  selectors.visibleAccounts = jest.fn(() => [mockMixedAccount]);
  selectors.getMixedAccount = jest.fn(() => mockMixedAccountValue);
  selectors.getChangeAccount = jest.fn(() => mockChangeAccountValue);
  selectors.defaultSpendingAccount = jest.fn(() => mockMixedAccount);
  selectors.ticketPrice = jest.fn(() => mockTicketPrice);
  //stakeInfo
  selectors.votedTicketsCount = jest.fn(() => mockVotedTicketsCount);
  selectors.ownMempoolTicketsCount = jest.fn(() => mockOwnMempoolTicketsCount);
  selectors.revokedTicketsCount = jest.fn(() => mockRevokedTicketsCount);
  selectors.immatureTicketsCount = jest.fn(() => mockImmatureTicketsCount);
  selectors.liveTicketsCount = jest.fn(() => mockLiveTicketsCount);
  selectors.unspentTicketsCount = jest.fn(() => mockUnspentTicketsCount);
  selectors.totalSubsidy = jest.fn(() => mockTotalSubsidy);
  selectors.isSPV = jest.fn(() => false);
  selectors.lastVotedTicket = jest.fn(() => mockLastVotedTicket);
  selectors.currencyDisplay = jest.fn(() => mockCurrencyDisplay);
  selectors.blocksNumberToNextTicket = jest.fn(() => 13);
  selectors.getRememberedVspHost = jest.fn(() => null);
  mockAddAllowedExternalRequest = settingsActions.addAllowedExternalRequest =
    jest.fn(() => () => {});

  mockPurchaseTicketsAttempt = controlActions.purchaseTicketsAttempt = jest.fn(
    () => () => {}
  );
  mockStartTicketBuyerAttempt = controlActions.startTicketBuyerAttempt =
    jest.fn(() => () => {});
  mockGetTicketAutoBuyerRunning = selectors.getTicketAutoBuyerRunning = jest.fn(
    () => false
  );
  mockTicketBuyerCancel = controlActions.ticketBuyerCancel = jest.fn(
    () => () => {}
  );
  selectors.getRunningIndicator = jest.fn(() => false);
  wallet.getVSPInfo = jest.fn(() => {
    return Promise.resolve(mockVspInfo);
  });
  mockSetRememberedVspHost = vspActions.setRememberedVspHost = jest.fn(
    () => () => {}
  );
  arrays.shuffle = jest.fn((arr) => arr);
});

test("render PurchasePage", async () => {
  render(<Purchase />, initialState);

  // check PrivacyInfo
  user.click(screen.getByText("You are purchasing mixed tickets"));
  expect(
    screen.getByText(/Purchasing mixed tickets can take some time/i)
  ).toBeInTheDocument();

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
  user.type(screen.getByLabelText("Private Passphrase"), mockPassphrase);
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
});

const getSettingsButton = () =>
  screen.getByRole("button", {
    name: "Ticket Autobuyer Settings"
  });
const getSaveButton = () => screen.getByRole("button", { name: "Save" });
const getToggleSwitch = () => screen.getByTestId("switch");
const getMaxFeeInput = () => screen.getByLabelText("Maximum Fee");
const getSettingsModalTitle = () =>
  screen.getByText("Automatic ticket purchases");
const getFillAllFieldsErrorMsg = () => screen.getByText("Fill all fields.");

test("test autobuyer", async () => {
  render(<TicketAutoBuyer />, initialState);
  const settingsButton = getSettingsButton();
  const toggleSwitch = getToggleSwitch();
  user.click(toggleSwitch);
  await wait(() => getSettingsModalTitle());

  user.click(getSaveButton());
  await wait(() => screen.getByText("Fill all fields."));
  const mockBalanceToMaintain = 14;
  user.type(
    screen.getByLabelText(/Balance to Maintain/i),
    `${mockBalanceToMaintain}`
  );
  user.click(getSaveButton());
  expect(getFillAllFieldsErrorMsg()).toBeInTheDocument();

  // set account
  user.click(screen.getByText("Select account"));
  user.click(screen.getByText(mockMixedAccount.name));
  selectors.buyerAccount = jest.fn(() => mockMixedAccount);

  user.click(getSaveButton());
  expect(screen.getByText("Fill all fields.")).toBeInTheDocument();

  const validMaxFeeInput = "10";
  user.type(getMaxFeeInput(), validMaxFeeInput);
  user.click(getSaveButton());
  await wait(() =>
    expect(
      screen.queryByText("Automatic ticket purchases")
    ).not.toBeInTheDocument()
  );

  // check settings
  user.click(settingsButton);
  expect(screen.getByLabelText(/Balance to Maintain/i).value).toBe(
    `${mockBalanceToMaintain}`
  );
  expect(screen.getByText(mockMixedAccount.name)).toBeInTheDocument();
  expect(getMaxFeeInput().value).toBe(validMaxFeeInput);
  user.click(screen.getByRole("button", { name: "Cancel" }));
  await wait(() =>
    expect(
      screen.queryByText("Automatic ticket purchases")
    ).not.toBeInTheDocument()
  );

  // clicking again on switch should open the confirmation modal
  user.click(toggleSwitch);
  await wait(() => screen.getByText(/start ticket buyer confirmation/i));

  expect(screen.getByText(mockAvailableVsps[1].host)).toBeInTheDocument();
  expect(screen.getByText(`${mockBalanceToMaintain}.00`)).toBeInTheDocument(); // cancel first
  user.click(screen.getByText("Cancel"));
  // try again
  user.click(getToggleSwitch());
  await wait(() => screen.getByText(/start ticket buyer confirmation/i));
  user.type(screen.getByLabelText("Private Passphrase"), mockPassphrase);
  user.click(screen.getByText("Continue"));
  expect(mockStartTicketBuyerAttempt).toHaveBeenCalledWith(
    mockPassphrase,
    mockMixedAccount,
    mockBalanceToMaintain * 100000000,
    {
      ...mockAvailableVsps[1],
      host: mockAvailableVsps[1].host,
      pubkey: mockVspInfo.data.pubkey
    }
  );
});

test("test autobuyer (autobuyer is runnning)", () => {
  mockGetTicketAutoBuyerRunning = selectors.getTicketAutoBuyerRunning = jest.fn(
    () => true
  );
  render(<TicketAutoBuyer />, initialState);
  expect(mockGetTicketAutoBuyerRunning).toHaveBeenCalled();
  expect(screen.getByText(/turn off auto buyer/i)).toBeInTheDocument();
  user.click(getToggleSwitch());
  expect(mockTicketBuyerCancel).toHaveBeenCalled();
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
  selectors.blocksNumberToNextTicket = jest.fn(() => 2);
  selectors.isSPV = jest.fn(() => true);
  render(<Purchase />, initialState);
  expect(
    screen.getByText(
      /Purchase Tickets is not available right now, because we are at the end of a ticket interval. After one block it will be available again./i
    )
  ).toBeInTheDocument();
});

test("remembered vsp have been set", async () => {
  const testRememberedVSP = {
    host: mockAvailableVsps[1].host,
    label: mockAvailableVsps[1].label
  };
  selectors.getRememberedVspHost = jest.fn(() => testRememberedVSP);
  render(<Purchase />, initialState);

  await wait(() =>
    expect(screen.queryByText("Loading")).not.toBeInTheDocument()
  );
  expect(screen.getByText(testRememberedVSP.host)).toBeInTheDocument();

  expect(screen.getByLabelText("Always use this VSP").checked).toBeTruthy();
  expect(mockSetRememberedVspHost).not.toHaveBeenCalled();

  // uncheck Always use this VSP checkbox
  user.click(screen.getByLabelText("Always use this VSP"));
  expect(mockSetRememberedVspHost).toHaveBeenCalledWith(null);
});

test("an outdated remembered vsp has been set, should be cleared", async () => {
  const testRememberedVSP = {
    host: mockAvailableVsps[2].host,
    label: mockAvailableVsps[2].label
  };
  selectors.getRememberedVspHost = jest.fn(() => testRememberedVSP);
  render(<Purchase />, initialState);

  await wait(() =>
    expect(screen.queryByText("Loading")).not.toBeInTheDocument()
  );

  expect(screen.queryByText(testRememberedVSP.host)).not.toBeInTheDocument();
  expect(screen.getByText("Select VSP...")).toBeInTheDocument();
  expect(
    screen.queryByLabelText("Always use this VSP")
  ).not.toBeInTheDocument();
  expect(mockSetRememberedVspHost).toHaveBeenCalledWith(null);
});

test("outdated vsp could not be selected", async () => {
  render(<Purchase />, initialState);

  await wait(() =>
    expect(screen.queryByText("Loading")).not.toBeInTheDocument()
  );

  user.click(screen.getByText("Select VSP..."));
  expect(screen.getByText("Out of date")).toBeInTheDocument();
  // there is (only) one out of date tooltip
  user.click(screen.getByText(mockAvailableVsps[2].host));
  // click on outdated vsp is not allowed:
  expect(screen.getByText("Select VSP...")).toBeInTheDocument();
});
