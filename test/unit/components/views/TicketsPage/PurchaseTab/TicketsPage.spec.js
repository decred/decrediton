import TicketsPage from "components/views/TicketsPage/TicketsPage";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen, wait } from "@testing-library/react";
import * as sel from "selectors";
import { wallet } from "wallet-preload-shim";
import { DCR } from "constants";
import * as cfgConstants from "constants/config";
import {
  mockAvailableVsps,
  mockMixedAccountValue,
  mockChangeAccountValue,
  mockMixedAccount
} from "./mocks";

const mockVotedTicketsCount = 3;
const mockOwnMempoolTicketsCount = 5;
const mockRevokedTicketsCount = 7;
const mockImmatureTicketsCount = 6;
const mockLiveTicketsCount = 7;
const mockUnspentTicketsCount = 2;
const mockTotalSubsidy = 400000000;
const mockLastVotedTicket = null;
const mockCurrencyDisplay = DCR;
const mockTicketPrice = 10399550534;

const selectors = sel;
let mockWalletCfgGet;
let mockWalletCfgSet;

beforeEach(() => {
  selectors.getAvailableVSPs = jest.fn(() => mockAvailableVsps);
  selectors.spendingAccounts = jest.fn(() => [mockMixedAccount]);
  selectors.visibleAccounts = jest.fn(() => [mockMixedAccount]);
  selectors.getMixedAccount = jest.fn(() => mockMixedAccountValue);
  selectors.getChangeAccount = jest.fn(() => mockChangeAccountValue);
  selectors.defaultSpendingAccount = jest.fn(() => mockMixedAccount);
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

  selectors.ticketPrice = jest.fn(() => mockTicketPrice);
  selectors.currencyDisplay = jest.fn(() => DCR);
  mockWalletCfgGet = jest.fn(() => {});
  mockWalletCfgSet = jest.fn(() => {});
  wallet.getWalletCfg = () => ({
    get: mockWalletCfgGet,
    set: mockWalletCfgSet
  });
});

const initialState = {
  initialState: {
    walletLoader: {
      showStakingWarning: true
    }
  }
};

const getUnderstandButton = () =>
  screen.getByRole("button", { name: "I understand and accept the risks" });

const tabShouldBeInactive = (tab) =>
  expect(tab.firstElementChild.firstElementChild.className).not.toMatch(
    "active"
  );
const tabShouldBeUnchecked = (tab) =>
  expect(tab.firstElementChild.firstElementChild.className).not.toMatch(
    "visited"
  );
const tabShouldBeActive = (tab) =>
  expect(tab.firstElementChild.firstElementChild.className).toMatch("active");
const tabShouldBeChecked = (tab) =>
  expect(tab.firstElementChild.firstElementChild.className).toMatch("visited");

test("render TicketsPage - show staking warning", async () => {
  render(<TicketsPage />, initialState);
  expect(screen.getByText(/Current Price:/i).textContent).toMatchInlineSnapshot(
    '"Current Price: 103.99550534 DCR"'
  );

  const understandButton = getUnderstandButton();
  const nextButton = screen.getByRole("button", { name: "Next" });
  const previousButton = screen.getByRole("button", { name: "Previous" });
  const previousArrowButton = screen.getByRole("button", {
    name: "Previous arrow"
  });
  const nextArrowButton = screen.getByRole("button", { name: "Next arrow" });

  const tab1 = screen.getByTestId("tab-0");
  const tab2 = screen.getByTestId("tab-1");
  const tab3 = screen.getByTestId("tab-2");

  // initial state
  expect(understandButton.disabled).toBe(true);
  expect(tab1.textContent).toBe("1/3Buying tickets");
  expect(tab2.textContent).toBe("2/3Tickets have multiple functions");
  expect(tab3.textContent).toBe("3/3Rewards");
  expect(previousButton.className).toMatch("disabled");
  expect(previousArrowButton.className).toMatch("disabled");

  tabShouldBeActive(tab1);
  tabShouldBeUnchecked(tab1);
  tabShouldBeInactive(tab2);
  tabShouldBeUnchecked(tab2);
  tabShouldBeInactive(tab3);
  tabShouldBeUnchecked(tab3);

  // clicking on previousButton in vain
  user.click(previousButton);
  tabShouldBeActive(tab1);
  tabShouldBeUnchecked(tab1);
  tabShouldBeInactive(tab2);
  tabShouldBeUnchecked(tab2);
  tabShouldBeInactive(tab3);
  tabShouldBeUnchecked(tab3);

  // clicking on previousArrowButton in vain
  user.click(previousArrowButton);
  tabShouldBeActive(tab1);
  tabShouldBeUnchecked(tab1);
  tabShouldBeInactive(tab2);
  tabShouldBeUnchecked(tab2);
  tabShouldBeInactive(tab3);
  tabShouldBeUnchecked(tab3);

  // move on to the second tab
  user.click(nextButton);
  tabShouldBeInactive(tab1);
  tabShouldBeChecked(tab1);
  tabShouldBeActive(tab2);
  tabShouldBeUnchecked(tab2);
  tabShouldBeInactive(tab3);
  tabShouldBeUnchecked(tab3);
  expect(previousButton.className).not.toMatch("disabled");
  expect(previousArrowButton.className).not.toMatch("disabled");
  expect(understandButton.disabled).toBe(true);

  // move on to the third tab click on the next arrow
  user.click(nextArrowButton);
  tabShouldBeInactive(tab1);
  tabShouldBeChecked(tab1);
  tabShouldBeInactive(tab2);
  tabShouldBeChecked(tab2);
  tabShouldBeActive(tab3);
  tabShouldBeChecked(tab3);

  expect(previousButton.className).not.toMatch("disabled");
  expect(previousArrowButton.className).not.toMatch("disabled");
  expect(understandButton.disabled).toBe(false);
  expect(nextButton.className).toMatch("disabled");
  expect(nextArrowButton.className).toMatch("disabled");
  // clicking on nextButton in vain
  user.click(nextButton);
  tabShouldBeInactive(tab1);
  tabShouldBeChecked(tab1);
  tabShouldBeInactive(tab2);
  tabShouldBeChecked(tab2);
  tabShouldBeActive(tab3);
  tabShouldBeChecked(tab3);
  expect(previousButton.className).not.toMatch("disabled");
  expect(previousArrowButton.className).not.toMatch("disabled");
  expect(understandButton.disabled).toBe(false);
  expect(nextButton.className).toMatch("disabled");
  expect(nextArrowButton.className).toMatch("disabled");

  // clicking on nextArrowButton in vain
  user.click(nextButton);
  tabShouldBeInactive(tab1);
  tabShouldBeChecked(tab1);
  tabShouldBeInactive(tab2);
  tabShouldBeChecked(tab2);
  tabShouldBeActive(tab3);
  tabShouldBeChecked(tab3);
  expect(previousButton.className).not.toMatch("disabled");
  expect(previousArrowButton.className).not.toMatch("disabled");
  expect(understandButton.disabled).toBe(false);
  expect(nextButton.className).toMatch("disabled");
  expect(nextArrowButton.className).toMatch("disabled");

  expect(screen.getByText(/before you continue/i)).toBeInTheDocument();
  user.click(understandButton);

  expect(mockWalletCfgSet).toHaveBeenCalledWith(
    cfgConstants.SHOW_STAKING_WARNING,
    false
  );
  await wait(() =>
    expect(screen.queryByText(/before you continue/i)).not.toBeInTheDocument()
  );
  expect(screen.getByText(/Staking Overview/i)).toBeInTheDocument();
});

test("render TicketsPage - hidden staking warning", () => {
  render(<TicketsPage />);
  expect(screen.getByText(/Staking Overview/i)).toBeInTheDocument();
});
