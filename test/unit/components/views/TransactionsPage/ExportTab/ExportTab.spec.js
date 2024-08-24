import { ExportTab } from "components/views/TransactionsPage/ExportTab";
import TransactionsPage from "components/views/TransactionsPage/";
import { render } from "test-utils.js";
import { screen } from "@testing-library/react";
import * as sta from "actions/StatisticsActions";

const statiscticsActions = sta;
const mockFilePath = "mock-file-path";

let mockExportStatToCSV;

beforeEach(() => {
  mockExportStatToCSV = statiscticsActions.exportStatToCSV = jest.fn(
    () => () => {}
  );
});

test("render ExportTab within its parent", async () => {
  const { user } = render(<TransactionsPage />);
  await user.click(screen.getByText("Export"));

  expect(
    screen.getByText(/Export different types/i).textContent
  ).toMatchInlineSnapshot(
    '"Export different types of statistics from your wallet."'
  );
});

const getExportTypeSelect = () => screen.getByText("Transactions");
const getExportDescription = () =>
  screen.getByTestId("export-description").textContent;
const getExportFields = () => screen.getByTestId("exported-fields").textContent;
const getDestinationInput = () =>
  screen.getByPlaceholderText("Choose destination...");
const getExportButton = () => screen.getByText("Export");

test("test Daily Balances type control", async () => {
  const { user } = render(<ExportTab />);
  expect(getExportDescription()).toMatchInlineSnapshot(
    '"Exports all transactions recorded in the wallet."'
  );
  expect(getExportFields()).toMatchInlineSnapshot(
    '"Time, Hash, Type, Direction, Fee, Amount, Credits, Debits."'
  );
  await user.type(getDestinationInput(), mockFilePath);
  await user.click(getExportButton());
  expect(mockExportStatToCSV).toHaveBeenCalledWith({
    calcFunction: sta.transactionStats,
    csvFilename: mockFilePath
  });
});

test("test Daily Balances type control", async () => {
  const { user } = render(<ExportTab />);
  await user.click(getExportTypeSelect());
  await user.click(screen.getByText("Daily Balances"));
  expect(getExportDescription()).toMatchInlineSnapshot(
    '"Export the different types of balances, with a daily aggregation."'
  );
  expect(getExportFields()).toMatchInlineSnapshot(
    '"Time, Spendable, Immature, Locked, ImmatureNonWallet, LockedNonWallet, Total, StakeRewards, StakeFees, TotalStake, Sent, Received, Voted, Revoked, Ticket."'
  );
  await user.type(getDestinationInput(), mockFilePath);
  await user.click(getExportButton());
  expect(mockExportStatToCSV).toHaveBeenCalledWith({
    calcFunction: sta.dailyBalancesStats,
    csvFilename: mockFilePath
  });
});

test("test Balances type control", async () => {
  const { user } = render(<ExportTab />);
  await user.click(getExportTypeSelect());
  await user.click(screen.getByText("Balances"));
  expect(getExportDescription()).toMatchInlineSnapshot(
    '"Export the different types of balances after each event that changes it."'
  );
  expect(getExportFields()).toMatchInlineSnapshot(
    '"Time, Spendable, Locked, Immature, LockedNonWallet, ImmatureNonWallet, Total, StakeRewards, StakeFees, TotalStake."'
  );
  await user.type(getDestinationInput(), mockFilePath);
  await user.click(getExportButton());
  expect(mockExportStatToCSV).toHaveBeenCalledWith({
    calcFunction: sta.balancesStats,
    csvFilename: mockFilePath
  });
});

test("test Vote time type control", async () => {
  const { user } = render(<ExportTab />);
  await user.click(getExportTypeSelect());
  await user.click(screen.getByText("Vote Time"));
  expect(getExportDescription()).toMatchInlineSnapshot(
    '"Export a time-to-vote histogram in days (how many days from ticket purchase until the ticket was selected for voting)."'
  );
  expect(getExportFields()).toMatchInlineSnapshot('"DaysToVote, Count."');
  await user.type(getDestinationInput(), mockFilePath);
  await user.click(getExportButton());
  expect(mockExportStatToCSV).toHaveBeenCalledWith({
    calcFunction: sta.voteTimeStats,
    csvFilename: mockFilePath
  });
});

test("test Tickets type control", async () => {
  const { user } = render(<ExportTab />);
  await user.click(getExportTypeSelect());
  await user.click(screen.getByText("Tickets"));
  expect(getExportDescription()).toMatchInlineSnapshot(
    '"Export ticket and vote information."'
  );
  expect(getExportFields()).toMatchInlineSnapshot(
    '"Time, SpenderTimestamp, Status, TicketHash, SpenderHash, SentAmount, ReturnedAmount."'
  );
  await user.type(getDestinationInput(), mockFilePath);
  await user.click(getExportButton());
  expect(mockExportStatToCSV).toHaveBeenCalledWith({
    calcFunction: sta.ticketStats,
    csvFilename: mockFilePath
  });
});
