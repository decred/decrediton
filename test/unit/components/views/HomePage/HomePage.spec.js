import HomePage from "components/views/HomePage";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import { DCR } from "constants";
import * as sel from "selectors";
import * as cla from "actions/ClientActions";

import {
  mockAccounts,
  mockSpendableAndLockedBalance,
  mockTicketDataChart,
  mockSentAndReceivedTransactions,
  mockHomeHistoryTransactions,
  mockHomeHistoryTickets
} from "./mocks";

const selectors = sel;
const clientActions = cla;

const mockSpendableTotalBalance = 7233046999;
const mockTotalBalance = 13295846896;

const mockLockedTotalBalance = 6062799897;
const mockUnconfirmedTotalBalance = 200000000;
const mockLockedByTicketsTotalBalance = 6062799897;
const mockImmatureRewardTotalBalance = 300000000;
const mockImmatureStakeGenerationTotalBalance = 400000000;

const mockTotalValueOfLiveTickets = 6062799897;
const mockEarnedStakingReward = 26327053;
const mockActiveTicketsCount = 1;
const mockVotedTicketsCount = 6;

const mockBalanceSent = -200174490;
const mockBalanceReceived = 300000000;

let mockGoToMyTickets;
let mockGoToTransactionHistory;

beforeEach(() => {
  selectors.walletService = jest.fn(() => {
    return {};
  });
  selectors.getAccountsResponse = jest.fn(() => {
    return {
      accountsList: mockAccounts
    };
  });
  selectors.spendableTotalBalance = jest.fn(() => mockSpendableTotalBalance);
  selectors.totalBalance = jest.fn(() => mockTotalBalance);
  selectors.isTestNet = jest.fn(() => true);
  selectors.currencyDisplay = jest.fn(() => DCR);

  selectors.lockedTotalBalance = jest.fn(() => mockLockedTotalBalance);
  selectors.unconfirmedTotalBalance = jest.fn(
    () => mockUnconfirmedTotalBalance
  );
  selectors.spendableAndLockedBalance = jest.fn(
    () => mockSpendableAndLockedBalance
  );
  selectors.lockedByTicketsTotalBalance = jest.fn(
    () => mockLockedByTicketsTotalBalance
  );
  selectors.immatureRewardTotalBalance = jest.fn(
    () => mockImmatureRewardTotalBalance
  );
  selectors.immatureStakeGenerationTotalBalance = jest.fn(
    () => mockImmatureStakeGenerationTotalBalance
  );

  selectors.totalValueOfLiveTickets = jest.fn(
    () => mockTotalValueOfLiveTickets
  );
  selectors.totalSubsidy = jest.fn(() => mockEarnedStakingReward);
  selectors.activeTicketsCount = jest.fn(() => mockActiveTicketsCount);
  selectors.votedTicketsCount = jest.fn(() => mockVotedTicketsCount);
  selectors.ticketDataChart = jest.fn(() => mockTicketDataChart);

  selectors.balanceSent = jest.fn(() => mockBalanceSent);
  selectors.balanceReceived = jest.fn(() => mockBalanceReceived);
  selectors.sentAndReceivedTransactions = jest.fn(
    () => mockSentAndReceivedTransactions
  );

  selectors.homeHistoryTransactions = jest.fn(
    () => mockHomeHistoryTransactions
  );
  selectors.homeHistoryTickets = jest.fn(() => mockHomeHistoryTickets);
  mockGoToMyTickets = clientActions.goToMyTickets = jest.fn(() => () => {});
  mockGoToTransactionHistory = clientActions.goToTransactionHistory = jest.fn(
    () => () => {}
  );
  selectors.getTransactionsRequestAttempt = jest.fn(() => false);
});

test("walletService is undefined", () => {
  selectors.walletService = jest.fn(() => {
    return null;
  });
  render(<HomePage />);
  expect(
    screen.getByText("Something went wrong, please go back")
  ).toBeInTheDocument();
});

test("test HomePage with an immature ticket", async () => {
  render(<HomePage />);

  expect(
    screen.getByText("Current Total Balance").parentNode.textContent
  ).toMatchInlineSnapshot('"132.95846896 DCRCurrent Total Balance"');
  expect(
    screen.getByText("Locked").parentNode.textContent
  ).toMatchInlineSnapshot('"60.62799897 DCRLocked"');
  expect(
    screen.getByText(/Immature Rewards/i).parentNode.textContent
  ).toMatchInlineSnapshot(
    '"Immature Rewards:3.00000 DCRLocked by tickets:60.62799897 DCRImmature Staking Rewards:4.00000 DCRUnconfirmed:2.00000 DCR"'
  );

  // go to Tickets tab
  user.click(screen.getByText("Tickets"));
  await waitFor(() => screen.getByText(/voted ticket/i));
  expect(
    screen.getByText(/active and locked ticket/i).parentNode.textContent
  ).toMatchInlineSnapshot(
    '"1 active and locked ticketWith a total value of 60.62799897 DCR"'
  );
  expect(
    screen.getByText(/voted tickets/i).parentNode.textContent
  ).toMatchInlineSnapshot(
    '"6 voted ticketsEarned 0.26327053 DCR in staking rewards"'
  );

  // go to Transactions tab
  user.click(screen.getByText("Transactions"));
  await waitFor(() => screen.getByText(/sent/i));
  expect(
    screen.getAllByText(/received/i)[0].parentNode.textContent
  ).toMatchInlineSnapshot('"3.00000 DCRReceived"');
  expect(
    screen.getByText(/sent/i).parentNode.textContent
  ).toMatchInlineSnapshot('"-2.0017449 DCRSent"');

  // check transactions
  expect(
    screen.getByText(/recent transactions/i).parentNode.textContent
  ).toMatchInlineSnapshot(
    '"Recent TransactionsSee all →Received3.00000 DCRto unmixedNov 17, 2021, 13:51Mix-2.00000 DCRFrom mixedto mockO...put21Nov 17, 2021, 13:51"'
  );

  // check tickets
  expect(
    screen.getByText(/staking activity/i).parentNode.textContent
  ).toMatchInlineSnapshot(
    '"Staking ActivitySee all →Ticket, LiveNov 17, 2021, 13:35Ticket Price: 60.62796917 DCR60.62796917 DCRFee StatusPaidTicket, VoteNov 3, 2021, 08:46Ticket Price: 69.25100364 DCR69.25100364 DCRTicket Reward: 0.03062042 DCR0.03DCRTicket Days To Vote: 22 daysmixed"'
  );

  // see all transactions
  const seeAllLinks = screen.getAllByText(/See all/i);
  user.click(seeAllLinks[0]);
  expect(mockGoToTransactionHistory).toHaveBeenCalledTimes(1);
  user.click(seeAllLinks[1]);
  expect(mockGoToMyTickets).toHaveBeenCalledTimes(1);
});

test("test HomePage with empty transaction and staking activity", () => {
  selectors.homeHistoryTransactions = jest.fn(() => []);
  selectors.homeHistoryTickets = jest.fn(() => []);
  render(<HomePage />);

  // check transactions
  expect(
    screen.getByText(/no transactions yet/i).parentNode.textContent
  ).toMatchInlineSnapshot(
    '"No transactions yetGenerate a DCR Address for receiving funds →Buy Decred from Exchanges →"'
  );

  // check tickets
  expect(
    screen.getByText(/no tickets yet/i).parentNode.textContent
  ).toMatchInlineSnapshot(
    '"No tickets yetWhat is Staking (Proof-of-Stake)? →Learn About the Ticket Lifecycle →"'
  );
});

test("should show loadigs until the transactions are not loaded", () => {
  selectors.getTransactionsRequestAttempt = jest.fn(() => true);
  render(<HomePage />);
  expect(screen.getAllByTestId("decred-loading").length).toBe(2);
});
