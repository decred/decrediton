import StakeInfo from "../../../../../app/components/views/TicketsPage/PurchaseTab/StakeInfo/StakeInfo";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen, wait } from "@testing-library/react";
import * as sel from "selectors";
import { DCR } from "constants";

const mockVotedTicketsCount = 3;
const mockOwnMempoolTicketsCount = 5;
const mockRevokedTicketsCount = 7;
const mockImmatureTicketsCount = 6;
const mockLiveTicketsCount = 7;
const mockUnspentTicketsCount = 2;
const mockTotalSubsidy = 4;
let mockIsSPV = true;
let mockLastVotedTicket = null;
const mockCurrencyDisplay = DCR;

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

test("test StakeInfo (SPV enabled)", () => {
  render(<StakeInfo />);
  expect(screen.getByText(/staking overview/i)).toBeInTheDocument();

  const unspentTickets = screen.getByText(/unspent tickets/i);
  expect(unspentTickets.nextElementSibling.textContent).toBe(
    `${mockUnspentTicketsCount} tickets`
  );

  expect(screen.getByText(/total voted/i).nextElementSibling.textContent).toBe(
    `${mockVotedTicketsCount} tickets`
  );
  expect(
    screen.getByText(/last ticket voted/i).nextElementSibling.textContent
  ).toBe("None");

  const totalRewardEarned = screen.getByText(/total rewards earned/i);
  expect(totalRewardEarned.nextElementSibling.textContent).toBe(
    `${mockTotalSubsidy} ${mockCurrencyDisplay}`
  );

  user.click(totalRewardEarned);

  expect(
    screen.getByText(/own mempool tickets/i).nextElementSibling.textContent
  ).toBe(`${mockOwnMempoolTicketsCount}`);
  expect(
    screen.getByText(/immature tickets/i).nextElementSibling.textContent
  ).toBe(`${mockImmatureTicketsCount}`);
  expect(screen.getByText(/live tickets/i).nextElementSibling.textContent).toBe(
    `${mockLiveTicketsCount}`
  );
  expect(
    screen.getByText(/voted tickets/i).nextElementSibling.textContent
  ).toBe(`${mockVotedTicketsCount}`);
  expect(
    screen.getByText(/revoked tickets/i).nextElementSibling.textContent
  ).toBe(`${mockRevokedTicketsCount}`);
});

test("test StakeInfo (SPV disabled)", () => {
  mockIsSPV = false;
  render(<StakeInfo />);

  const liveTickets = screen.getByText(/live/i);
  expect(liveTickets.nextElementSibling.textContent).toBe(
    `${mockLiveTicketsCount} tickets`
  );
  expect(liveTickets.nextElementSibling.nextElementSibling.textContent).toMatch(
    `Own Mempool: ${mockOwnMempoolTicketsCount}`
  );
  expect(liveTickets.nextElementSibling.nextElementSibling.textContent).toMatch(
    `Immature: ${mockImmatureTicketsCount}`
  );
});

test("test StakeInfo (SPV disabled, have last ticket voted)", () => {
  mockIsSPV = false;
  const mockTxHashPartHead = "abcdef";
  const mockTxHashPartTail = "fedcba";
  mockLastVotedTicket = {
    txHash: `${mockTxHashPartHead}${mockTxHashPartTail}`
  };
  render(<StakeInfo />);
  const lastTicketVoted = screen.getByText(/last ticket voted/i);
  expect(lastTicketVoted.nextElementSibling.textContent).toMatch("this week");
  expect(
    lastTicketVoted.nextElementSibling.nextElementSibling.textContent
  ).toMatch(`${mockTxHashPartHead}... View →`);
});
