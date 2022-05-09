import StakeInfo from "components/views/TicketsPage/PurchaseTab/StakeInfo/StakeInfo";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import * as sel from "selectors";
import { DCR, UNIT_DIVISOR } from "constants";

const mockVotedTicketsCount = 3;
const mockOwnMempoolTicketsCount = 5;
const mockRevokedTicketsCount = 7;
const mockImmatureTicketsCount = 6;
const mockLiveTicketsCount = 7;
const mockUnspentTicketsCount = 2;
const mockTotalSubsidy = 400000000;
const mockCurrencyDisplay = DCR;
const selectors = sel;

let mockIsSPV = true;
let mockLastVotedTicket = null;

selectors.votedTicketsCount = jest.fn(() => mockVotedTicketsCount);
selectors.ownMempoolTicketsCount = jest.fn(() => mockOwnMempoolTicketsCount);
selectors.revokedTicketsCount = jest.fn(() => mockRevokedTicketsCount);
selectors.immatureTicketsCount = jest.fn(() => mockImmatureTicketsCount);
selectors.liveTicketsCount = jest.fn(() => mockLiveTicketsCount);
selectors.unspentTicketsCount = jest.fn(() => mockUnspentTicketsCount);
selectors.totalSubsidy = jest.fn(() => mockTotalSubsidy);
selectors.isSPV = jest.fn(() => mockIsSPV);
selectors.lastVotedTicket = jest.fn(() => mockLastVotedTicket);
selectors.currencyDisplay = jest.fn(() => mockCurrencyDisplay);

test("test StakeInfo (SPV enabled)", () => {
  render(<StakeInfo />);
  expect(screen.getByText(/staking overview/i)).toBeInTheDocument();

  const unspentTickets = screen.getByText(/unspent tickets/i);
  expect(unspentTickets.nextElementSibling.textContent).toBe(
    `${mockUnspentTicketsCount}`
  );

  expect(screen.getByText(/total voted/i).nextElementSibling.textContent).toBe(
    `${mockVotedTicketsCount}`
  );
  expect(
    screen.getByText(/last ticket voted/i).nextElementSibling.textContent
  ).toBe("None");

  const totalRewardEarned = screen.getByText(/total rewards earned/i);
  expect(totalRewardEarned.nextElementSibling.textContent).toBe(
    `${(mockTotalSubsidy / UNIT_DIVISOR).toFixed(2)} ${mockCurrencyDisplay}`
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
    `${mockLiveTicketsCount}`
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
