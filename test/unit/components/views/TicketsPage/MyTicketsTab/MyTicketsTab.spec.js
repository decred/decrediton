import TicketsPage from "components/views/TicketsPage/";
import { render } from "test-utils.js";
import { screen, wait } from "@testing-library/react";
import user from "@testing-library/user-event";
export const GETNEXTADDRESS_SUCCESS = "GETNEXTADDRESS_SUCCESS";
import * as sel from "selectors";
import * as ta from "actions/TransactionActions";
import { DCR } from "constants";
import { mockNormalizedStakeTransactions } from "../../TransactionPage/mocks";
import { cloneDeep } from "fp";

const selectors = sel;
const transactionActions = ta;

const initialState = {
  grpc: {
    ticketsFilter: {
      listDirection: "desc",
      status: null,
      vspFeeStatus: null
    },
    stakeTransactions: {},
    getStakeTxsAux: {
      noMoreTransactions: false
    }
  }
};

const getTestTxs = (startTs) => {
  const txList = {};
  const startDate = new Date(startTs * 1000);
  let lastTransaction;

  Object.keys(mockNormalizedStakeTransactions).forEach((txHash) => {
    lastTransaction = { ...mockNormalizedStakeTransactions[txHash] };
    startDate.setHours(startDate.getHours() - 1);
    const ts = Math.floor(startDate.getTime() / 1000);
    lastTransaction.txHash = `test-txHash-${ts}`;
    lastTransaction.timestamp = ts;
    txList[lastTransaction.txHash] = lastTransaction;
  });

  return { txList, lastTransaction };
};

let mockGetTransactions;
let mockToggleGetTransactions;

const mockMixedAccountValue = 6;
const mockDefaultAccount = {
  hidden: false,
  label: "default: 19 DCR",
  name: "default",
  spendable: 1900000000,
  spendableAndUnit: "19 DCR",
  total: 1900000000,
  value: 0
};
const mockAccount2 = {
  hidden: false,
  label: "account-2: 7.4998063 DCR",
  name: "account-2",
  spendable: 749980630,
  spendableAndUnit: "7.4998063 DCR",
  total: 749980630,
  value: 2
};
const mockEmptyAccount = {
  hidden: false,
  label: "empty: 0.0000000 DCR",
  name: "empty",
  spendable: 0,
  spendableAndUnit: "0.00000 DCR",
  total: 0,
  value: 3
};
const mockMixedAccount = {
  hidden: false,
  label: "mixed: 249.79547928 DCR",
  name: "mixed",
  spendable: 24979547928,
  spendableAndUnit: "249.79547928 DCR",
  total: 24979547928,
  value: mockMixedAccountValue
};
const mockVisibleAccounts = [
  mockDefaultAccount,
  mockAccount2,
  mockMixedAccount,
  mockEmptyAccount
];
const mockSpendingAccounts = [
  mockDefaultAccount,
  mockAccount2,
  mockMixedAccount,
  mockEmptyAccount
];

beforeEach(() => {
  selectors.defaultSpendingAccount = jest.fn(() => mockMixedAccount);
  selectors.visibleAccounts = jest.fn(() => mockVisibleAccounts);
  selectors.spendingAccounts = jest.fn(() => mockSpendingAccounts);
  selectors.isTrezor = jest.fn(() => false);
  selectors.isWatchingOnly = jest.fn(() => false);
  selectors.currencyDisplay = jest.fn(() => DCR);
  mockGetTransactions = transactionActions.getTransactions = jest.fn(
    () => () => {}
  );
  mockToggleGetTransactions = transactionActions.toggleGetTransactions = jest.fn(
    () => () => {}
  );
  selectors.startRequestHeight = jest.fn(() => 1000);
  selectors.currentBlockHeight = jest.fn(() => 10000);
});
afterEach(() => {
  jest.useRealTimers();
});

const getHistoryPageContent = () =>
  screen.getByTestId("ticketHistoryPageContent");
const getLoadingMoreLabel = () => screen.getByText("Loading more tickets...");
const getNoMoreTicketsLabel = () => screen.getByText("No More Tickets");
const queryLoadingMoreLabel = () =>
  screen.queryByText("Loading more tickets...");

const getTxTypeFilterMenuItem = (name) => {
  const nodes = screen.getAllByText(name);
  return nodes.find((node) => node.textContent === name);
};

const incAllTestTxs = (mockGetTransactionsResponse, ts) => {
  const { lastTransaction, txList } = getTestTxs(
    ts || mockGetTransactionsResponse.getStakeTxsAux.lastTransaction.timestamp
  );
  mockGetTransactionsResponse.stakeTransactions = txList;
  mockGetTransactionsResponse.getStakeTxsAux.lastTransaction = lastTransaction;
  return mockGetTransactionsResponse;
};

const viewAllTxs = (
  mockGetTransactionsResponse,
  chunkCount,
  blockHeightIndexes
) => {
  let i = 1;
  const step = Math.ceil(
    (blockHeightIndexes.currentBlockHeight -
      blockHeightIndexes.startRequestHeight) /
      chunkCount
  );
  while (queryLoadingMoreLabel()) {
    user.click(getLoadingMoreLabel());
    mockGetTransactionsResponse = incAllTestTxs(mockGetTransactionsResponse);
    blockHeightIndexes.currentBlockHeight =
      blockHeightIndexes.currentBlockHeight - step;
    if (i++ == chunkCount) {
      mockGetTransactionsResponse.getStakeTxsAux.noMoreTransactions = true;
    }
  }
  return mockGetTransactionsResponse;
};

const countTxsByType = (txs, types) =>
  Object.keys(txs).reduce(
    (acc, tx) => (types.includes(txs[tx].status) ? acc + 1 : acc),
    0
  );

test("test tickets list", async () => {
  jest.useFakeTimers();
  let allTestTxs = {};
  let mockGetTransactionsResponse = {
    type: transactionActions.GETTRANSACTIONS_COMPLETE,
    getStakeTxsAux: { noMoreTransactions: false },
    getRegularTxsAux: {},
    stakeTransactions: {},
    regularTransactions: {},
    startRequestHeight: 0,
    noMoreLiveTickets: true
  };
  mockGetTransactions = transactionActions.getTransactions = jest.fn(
    () => (dispatch) => {
      allTestTxs = {
        ...allTestTxs,
        ...mockGetTransactionsResponse.stakeTransactions
      };
      return dispatch(mockGetTransactionsResponse);
    }
  );

  const blockHeightIndexes = {
    currentBlockHeight: 10000,
    startRequestHeight: 1000
  };

  selectors.startRequestHeight = jest.fn(
    () => blockHeightIndexes.startRequestHeight
  );
  selectors.currentBlockHeight = jest.fn(
    () => blockHeightIndexes.currentBlockHeight
  );

  const chunkCount = 5;

  mockGetTransactionsResponse = incAllTestTxs(
    mockGetTransactionsResponse,
    1587545280
  );
  render(<TicketsPage />, {
    initialState: cloneDeep(initialState),
    currentSettings: {
      network: "testnet"
    }
  });
  user.click(screen.getByText("Ticket History"));

  user.click(screen.getByText("Cancel listing tickets").nextSibling);
  expect(mockToggleGetTransactions).toHaveBeenCalledTimes(1);

  // Scroll down to the bottom.
  // The data should be fetched by getTransactions request
  expect(getHistoryPageContent().childElementCount).toBe(0);
  viewAllTxs(mockGetTransactionsResponse, chunkCount, blockHeightIndexes);
  expect(getHistoryPageContent().childElementCount).toBe(
    Object.keys(allTestTxs).length
  );
  expect(mockGetTransactions).toHaveBeenCalledTimes(
    Object.keys(allTestTxs).length /
      Object.keys(mockNormalizedStakeTransactions).length
  );
  expect(queryLoadingMoreLabel()).not.toBeInTheDocument();
  expect(getNoMoreTicketsLabel()).toBeInTheDocument();

  mockGetTransactions.mockClear();
  // show just live tickets
  blockHeightIndexes.currentBlockHeight = 1000;
  const txTypeFilterButton = screen.getAllByRole("button", {
    name: "EyeFilterMenu"
  })[1];
  user.click(txTypeFilterButton);
  user.click(getTxTypeFilterMenuItem("live"));
  jest.advanceTimersByTime(101);

  await wait(() =>
    expect(getHistoryPageContent().childElementCount).not.toBe(
      Object.keys(allTestTxs).length
    )
  );

  viewAllTxs(mockGetTransactionsResponse, chunkCount, blockHeightIndexes);
  let expectedVisibleItems = countTxsByType(allTestTxs, ["live"]);

  expect(screen.getAllByText("Live").length).toBe(expectedVisibleItems);
  expect(getHistoryPageContent().childElementCount).toBe(expectedVisibleItems);
  expect(mockGetTransactions).toHaveBeenCalledTimes(0);
  expect(queryLoadingMoreLabel()).not.toBeInTheDocument();

  // show just unmined
  blockHeightIndexes.currentBlockHeight = 1000;
  user.click(txTypeFilterButton);
  user.click(getTxTypeFilterMenuItem("unmined"));
  jest.advanceTimersByTime(101);

  await wait(() =>
    expect(getHistoryPageContent().childElementCount).not.toBe(
      Object.keys(allTestTxs).length
    )
  );

  viewAllTxs(mockGetTransactionsResponse, chunkCount, blockHeightIndexes);
  expectedVisibleItems = countTxsByType(allTestTxs, ["unmined"]);

  expect(screen.getAllByText("Unmined").length).toBe(expectedVisibleItems);
  expect(getHistoryPageContent().childElementCount).toBe(expectedVisibleItems);
  expect(mockGetTransactions).toHaveBeenCalledTimes(0);
  expect(queryLoadingMoreLabel()).not.toBeInTheDocument();

  // show all tickets again
  blockHeightIndexes.currentBlockHeight = 1000;
  user.click(txTypeFilterButton);
  user.click(getTxTypeFilterMenuItem("All"));
  jest.advanceTimersByTime(101);

  await wait(() =>
    expect(getHistoryPageContent().childElementCount).not.toBe(
      Object.keys(allTestTxs).length
    )
  );

  viewAllTxs(mockGetTransactionsResponse, chunkCount, blockHeightIndexes);
  expect(mockGetTransactions).toHaveBeenCalledTimes(0);
  expect(getHistoryPageContent().childElementCount).toBe(
    Object.keys(allTestTxs).length
  );
  expect(queryLoadingMoreLabel()).not.toBeInTheDocument();

  // filter by hash id
  blockHeightIndexes.currentBlockHeight = 1000;
  user.type(
    screen.getByPlaceholderText("Filter by Hash"),
    Object.keys(allTestTxs)[3]
  );
  jest.advanceTimersByTime(101);
  await wait(() => expect(getHistoryPageContent().childElementCount).toBe(1));
});

test("test ticket sorting", async () => {
  jest.useFakeTimers();

  const mockChangeTransactionsFilter = (transactionActions.changeTicketsFilter = jest.fn(
    () => () => {}
  ));

  render(<TicketsPage />, {
    initialState: cloneDeep(initialState),
    currentSettings: {
      network: "testnet"
    }
  });
  user.click(screen.getByText("Ticket History"));

  // change sorting, show the oldest first
  const txSortButton = screen.getAllByRole("button", {
    name: "EyeFilterMenu"
  })[0];
  user.click(txSortButton);
  user.click(screen.getByText("Oldest"));
  jest.advanceTimersByTime(101);
  await wait(() =>
    expect(mockChangeTransactionsFilter).toHaveBeenCalledWith({
      ...initialState.grpc.ticketsFilter,
      listDirection: "asc"
    })
  );

  // change back sorting, show the newest first
  user.click(txSortButton);
  user.click(screen.getByText("Newest"));
  jest.advanceTimersByTime(101);
  await wait(() =>
    expect(mockChangeTransactionsFilter).toHaveBeenCalledWith({
      ...initialState.grpc.ticketsFilter,
      listDirection: "desc"
    })
  );
});

test("test no tickets", () => {
  const mockGetTransactionsResponse = {
    type: transactionActions.GETTRANSACTIONS_COMPLETE,
    getStakeTxsAux: { noMoreTransactions: true },
    getRegularTxsAux: {},
    stakeTransactions: {},
    regularTransactions: {},
    startRequestHeight: 0,
    noMoreLiveTickets: true
  };
  mockGetTransactions = transactionActions.getTransactions = jest.fn(
    () => (dispatch) => dispatch(mockGetTransactionsResponse)
  );
  const initialStateMod = {
    ...cloneDeep(initialState)
  };
  initialStateMod.grpc.getStakeTxsAux.noMoreTransactions = true;
  render(<TicketsPage />, {
    initialState: initialStateMod,
    currentSettings: {
      network: "testnet"
    }
  });
  user.click(screen.getByText("Ticket History"));
  user.click(getLoadingMoreLabel());
  expect(screen.getByText("No Tickets Found"));
});
