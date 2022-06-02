import { HistoryTab } from "components/views/TransactionsPage/HistoryTab";
import TransactionsPage from "components/views/TransactionsPage/";
import { render } from "test-utils.js";
import { screen, wait } from "@testing-library/react";
import user from "@testing-library/user-event";
export const GETNEXTADDRESS_SUCCESS = "GETNEXTADDRESS_SUCCESS";
import * as sel from "selectors";
import * as ta from "actions/TransactionActions";
import { DCR, BATCH_TX_COUNT } from "constants";
import { mockNormalizedRegularTransactions } from "../../TransactionPage/mocks";
import { cloneDeep } from "fp";

let mockWalletService;
const selectors = sel;
const transactionActions = ta;

const initialState = {
  grpc: {
    transactionsFilter: {
      search: null,
      listDirection: "desc",
      types: [],
      directions: [],
      maxAmount: null,
      minAmount: null
    },
    regularTransactions: {},
    normalizedRegularTransactions: {},
    getRegularTxsAux: {
      noMoreTransactions: false
    }
  }
};

const getTestTxs = (startTs) => {
  const txList = {};
  const startDate = new Date(startTs * 1000);
  let lastTransaction;

  Object.keys(mockNormalizedRegularTransactions).forEach((txHash) => {
    lastTransaction = { ...mockNormalizedRegularTransactions[txHash] };
    startDate.setHours(startDate.getHours() - 1);
    const ts = Math.floor(startDate.getTime() / 1000);
    lastTransaction.txHash = `test-txHash-${ts}`;
    lastTransaction.timestamp = ts;
    txList[lastTransaction.txHash] = lastTransaction;
  });

  return { txList, lastTransaction };
};

let mockGetTransactions;

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
const mockNextAddress = "TsiTfsjizPgzBrPxovheccayb4UbLRmQAqY";
const mockTotalSpent = 5600005850;
const mockEstimatedFee = 5850;
const mockEstimatedSize = 585;

beforeEach(() => {
  selectors.isTestNet = jest.fn(() => false);
  selectors.isMainNet = jest.fn(() => false);
  mockWalletService = selectors.walletService = jest.fn(() => {
    return {};
  });

  selectors.defaultSpendingAccount = jest.fn(() => mockMixedAccount);
  selectors.visibleAccounts = jest.fn(() => mockVisibleAccounts);
  selectors.spendingAccounts = jest.fn(() => mockSpendingAccounts);
  selectors.unsignedTransaction = jest.fn(() => null);
  selectors.unsignedRawTx = jest.fn(() => null);
  selectors.estimatedFee = jest.fn(() => mockEstimatedFee);
  selectors.estimatedSignedSize = jest.fn(() => mockEstimatedSize);
  selectors.totalSpent = jest.fn(() => mockTotalSpent);
  selectors.nextAddress = jest.fn(() => mockNextAddress);
  selectors.nextAddressAccount = jest.fn(() => mockDefaultAccount);
  selectors.constructTxLowBalance = jest.fn(() => false);
  selectors.publishTxResponse = jest.fn(() => "mockpublishtxresponse");
  selectors.getNotMixedAcctIfAllowed = jest.fn(() => [0, 2]);
  selectors.isTrezor = jest.fn(() => false);
  selectors.isWatchingOnly = jest.fn(() => false);
  selectors.isConstructingTransaction = jest.fn(() => false);
  selectors.constructTxRequestAttempt = jest.fn(() => false);
  selectors.getRunningIndicator = jest.fn(() => false);
  selectors.currencyDisplay = jest.fn(() => DCR);
  transactionActions.listUnspentOutputs = jest.fn(() => () =>
    Promise.resolve([])
  );
  mockWalletService = selectors.walletService = jest.fn(() => {
    return {};
  });
  mockGetTransactions = transactionActions.getTransactions = jest.fn(
    () => () => {}
  );
});
afterEach(() => {
  jest.useRealTimers();
});

const getHistoryPageContent = () => screen.getByTestId("historyPageContent");
const getLoadingMoreLabel = () =>
  screen.getByText("Loading more transactions...");
const queryLoadingMoreLabel = () =>
  screen.queryByText("Loading more transactions...");

test("show error when there is no walletService", () => {
  mockWalletService = selectors.walletService = jest.fn(() => {});
  render(<HistoryTab />, {
    initialState: cloneDeep(initialState)
  });
  expect(
    screen.getByText("Something went wrong, please go back")
  ).toBeInTheDocument();
  expect(screen.getByText(/back to home/i)).toBeInTheDocument();
  expect(mockWalletService).toHaveBeenCalled();
});

const getTxTypeFilterMenuItem = (name) => {
  const nodes = screen.getAllByText(name);
  return nodes.find((node) => node.textContent === name);
};

const incAllTestTxs = (mockGetTransactionsResponse, ts) => {
  const { lastTransaction, txList } = getTestTxs(
    ts || mockGetTransactionsResponse.getRegularTxsAux.lastTransaction.timestamp
  );
  mockGetTransactionsResponse.normalizedRegularTransactions = txList;
  mockGetTransactionsResponse.getRegularTxsAux.lastTransaction = lastTransaction;
  return mockGetTransactionsResponse;
};

const viewAllTxs = (mockGetTransactionsResponse, chunkCount) => {
  let i = 1;
  while (queryLoadingMoreLabel()) {
    user.click(getLoadingMoreLabel());
    mockGetTransactionsResponse = incAllTestTxs(mockGetTransactionsResponse);
    if (i++ == chunkCount) {
      mockGetTransactionsResponse.getRegularTxsAux.noMoreTransactions = true;
    }
  }
  return mockGetTransactionsResponse;
};

const countTxsByType = (txs, types, isMix = false) =>
  Object.keys(txs).reduce(
    (acc, tx) =>
      types.includes(txs[tx].txDirection) && !!txs[tx].mixedTx === isMix
        ? acc + 1
        : acc,
    0
  );

test("test txList", async () => {
  jest.useFakeTimers();
  let allTestTxs = {};
  let mockGetTransactionsResponse = {
    type: transactionActions.GETTRANSACTIONS_COMPLETE,
    getRegularTxsAux: { noMoreTransactions: false },
    getStakeTxsAux: {},
    stakeTransactions: {},
    regularTransactions: {},
    normalizedRegularTransactions: {},
    startRequestHeight: 0,
    noMoreLiveTickets: true
  };
  mockGetTransactions = transactionActions.getTransactions = jest.fn(
    () => (dispatch) => {
      allTestTxs = {
        ...allTestTxs,
        ...mockGetTransactionsResponse.normalizedRegularTransactions
      };
      return dispatch(mockGetTransactionsResponse);
    }
  );

  const chunkCount = 25;

  mockGetTransactionsResponse = incAllTestTxs(
    mockGetTransactionsResponse,
    1587545280
  );

  render(<TransactionsPage />, {
    initialState: cloneDeep(initialState)
  });
  user.click(screen.getByText("History"));

  // Scroll down to the bottom.
  // The data should be fetched by getTransactions request
  expect(getHistoryPageContent().childElementCount).toBe(0);
  viewAllTxs(mockGetTransactionsResponse, chunkCount);
  expect(getHistoryPageContent().childElementCount).toBe(
    Object.keys(allTestTxs).length
  );
  expect(mockGetTransactions).toHaveBeenCalledTimes(
    Object.keys(allTestTxs).length /
      Object.keys(mockNormalizedRegularTransactions).length
  );
  expect(queryLoadingMoreLabel()).not.toBeInTheDocument();

  // go to Send and come back. no more getTransactions call should happen
  user.click(screen.getByText("Send"));
  user.click(screen.getByText("History"));

  mockGetTransactions.mockClear();
  // start with BATCH_TX_COUNT, and loads the rest gradually
  expect(getHistoryPageContent().childElementCount).toBe(BATCH_TX_COUNT);
  viewAllTxs(mockGetTransactionsResponse, chunkCount);
  expect(getHistoryPageContent().childElementCount).toBe(
    Object.keys(allTestTxs).length
  );
  expect(mockGetTransactions).toHaveBeenCalledTimes(0);
  expect(queryLoadingMoreLabel()).not.toBeInTheDocument();

  // show just sent txs
  const txTypeFilterButton = screen.getAllByRole("button", {
    name: "EyeFilterMenu"
  })[1];
  user.click(txTypeFilterButton);
  user.click(getTxTypeFilterMenuItem("Sent"));
  jest.advanceTimersByTime(101);

  await wait(() =>
    expect(getHistoryPageContent().childElementCount).not.toBe(
      Object.keys(allTestTxs).length
    )
  );

  viewAllTxs(mockGetTransactionsResponse, chunkCount);
  let expectedVisibleItems = countTxsByType(allTestTxs, ["sent"]);

  expect(screen.getAllByText("Sent").length).toBe(expectedVisibleItems);
  expect(getHistoryPageContent().childElementCount).toBe(expectedVisibleItems);
  expect(mockGetTransactions).toHaveBeenCalledTimes(0);
  expect(queryLoadingMoreLabel()).not.toBeInTheDocument();

  // show sent and received txs
  user.click(txTypeFilterButton);
  user.click(getTxTypeFilterMenuItem("Received"));
  jest.advanceTimersByTime(101);

  await wait(() =>
    expect(getHistoryPageContent().childElementCount).not.toBe(
      Object.keys(allTestTxs).length
    )
  );
  viewAllTxs(mockGetTransactionsResponse, chunkCount);
  expectedVisibleItems = countTxsByType(allTestTxs, ["sent", "received"]);

  expect(
    screen.getAllByText("Sent").length + screen.getAllByText("Received").length
  ).toBe(expectedVisibleItems);
  expect(getHistoryPageContent().childElementCount).toBe(expectedVisibleItems);
  expect(mockGetTransactions).toHaveBeenCalledTimes(0);
  expect(queryLoadingMoreLabel()).not.toBeInTheDocument();

  // show just received txs
  user.click(txTypeFilterButton);
  user.click(getTxTypeFilterMenuItem("Sent"));
  jest.advanceTimersByTime(101);

  await wait(() =>
    expect(getHistoryPageContent().childElementCount).not.toBe(
      Object.keys(allTestTxs).length
    )
  );

  viewAllTxs(mockGetTransactionsResponse, chunkCount);
  expectedVisibleItems = countTxsByType(allTestTxs, ["received"]);

  expect(screen.getAllByText("Received").length).toBe(expectedVisibleItems);
  expect(getHistoryPageContent().childElementCount).toBe(expectedVisibleItems);
  expect(mockGetTransactions).toHaveBeenCalledTimes(0);
  expect(queryLoadingMoreLabel()).not.toBeInTheDocument();

  // show just received and Ticket Fee txs
  user.click(txTypeFilterButton);
  user.click(getTxTypeFilterMenuItem("Ticket fee"));
  jest.advanceTimersByTime(101);

  await wait(() =>
    expect(getHistoryPageContent().childElementCount).not.toBe(
      Object.keys(allTestTxs).length
    )
  );
  viewAllTxs(mockGetTransactionsResponse, chunkCount);
  expectedVisibleItems = countTxsByType(allTestTxs, ["received", "ticketfee"]);

  expect(
    screen.getAllByText("Self transfer").length +
      screen.getAllByText("Received").length
  ).toBe(expectedVisibleItems);
  expect(getHistoryPageContent().childElementCount).toBe(expectedVisibleItems);
  expect(mockGetTransactions).toHaveBeenCalledTimes(0);
  expect(queryLoadingMoreLabel()).not.toBeInTheDocument();

  // show all txs again
  user.click(txTypeFilterButton);
  user.click(getTxTypeFilterMenuItem("Ticket fee"));
  user.click(txTypeFilterButton);
  user.click(getTxTypeFilterMenuItem("All"));
  jest.advanceTimersByTime(101);

  await wait(() =>
    expect(getHistoryPageContent().childElementCount).not.toBe(
      Object.keys(allTestTxs).length
    )
  );

  viewAllTxs(mockGetTransactionsResponse, chunkCount);
  expect(getHistoryPageContent().childElementCount).toBe(
    Object.keys(allTestTxs).length
  );
  expect(mockGetTransactions).toHaveBeenCalledTimes(0);
  expect(queryLoadingMoreLabel()).not.toBeInTheDocument();

  // show just mixed txs
  user.click(txTypeFilterButton);
  user.click(getTxTypeFilterMenuItem("Mixed"));
  jest.advanceTimersByTime(101);

  await wait(() =>
    expect(getHistoryPageContent().childElementCount).not.toBe(
      Object.keys(allTestTxs).length
    )
  );
  viewAllTxs(mockGetTransactionsResponse, chunkCount);
  expectedVisibleItems = countTxsByType(allTestTxs, ["sent"], true);

  expect(screen.getAllByText("Mix").length).toBe(expectedVisibleItems);
  expect(getHistoryPageContent().childElementCount).toBe(expectedVisibleItems);
  expect(mockGetTransactions).toHaveBeenCalledTimes(0);
  expect(queryLoadingMoreLabel()).not.toBeInTheDocument();

  // show all txs again by toggle Mixed option
  user.click(txTypeFilterButton);
  user.click(getTxTypeFilterMenuItem("Mixed"));
  jest.advanceTimersByTime(101);

  await wait(() =>
    expect(getHistoryPageContent().childElementCount).not.toBe(
      Object.keys(allTestTxs).length
    )
  );

  viewAllTxs(mockGetTransactionsResponse, chunkCount);
  expect(getHistoryPageContent().childElementCount).toBe(
    Object.keys(allTestTxs).length
  );
  expect(mockGetTransactions).toHaveBeenCalledTimes(0);
  expect(queryLoadingMoreLabel()).not.toBeInTheDocument();

  // filter by hash id
  user.type(
    screen.getByPlaceholderText("Filter by Address or Hash"),
    Object.keys(allTestTxs)[3]
  );
  jest.advanceTimersByTime(101);
  await wait(() => expect(getHistoryPageContent().childElementCount).toBe(1));
});

test("show only sent txs which are coming from wallet and not from redux", async () => {
  jest.useFakeTimers();
  let allTestTxs = {};
  let mockGetTransactionsResponse = {
    type: transactionActions.GETTRANSACTIONS_COMPLETE,
    getRegularTxsAux: { noMoreTransactions: false },
    getStakeTxsAux: {},
    stakeTransactions: [],
    regularTransactions: [],
    startRequestHeight: 0,
    noMoreLiveTickets: true
  };
  mockGetTransactions = transactionActions.getTransactions = jest.fn(
    () => (dispatch) => {
      allTestTxs = {
        ...allTestTxs,
        ...mockGetTransactionsResponse.normalizedRegularTransactions
      };
      return dispatch(mockGetTransactionsResponse);
    }
  );

  const chunkCount = 50;

  mockGetTransactionsResponse = incAllTestTxs(
    mockGetTransactionsResponse,
    1587545280
  );

  render(<TransactionsPage />, {
    initialState: cloneDeep(initialState)
  });
  user.click(screen.getByText("History"));
  user.click(getLoadingMoreLabel());

  // show just sent txs
  mockGetTransactions.mockClear();
  const txTypeFilterButton = screen.getAllByRole("button", {
    name: "EyeFilterMenu"
  })[1];
  user.click(txTypeFilterButton);
  user.click(getTxTypeFilterMenuItem("Sent"));
  jest.advanceTimersByTime(101);

  await wait(() =>
    expect(getHistoryPageContent().childElementCount).not.toBe(0)
  );

  viewAllTxs(mockGetTransactionsResponse, chunkCount);
  const expectedVisibleItems = countTxsByType(allTestTxs, ["sent"]);

  expect(screen.getAllByText("Sent").length).toBe(expectedVisibleItems);
  expect(getHistoryPageContent().childElementCount).toBe(expectedVisibleItems);
  expect(mockGetTransactions).toHaveBeenCalledTimes(
    Object.keys(allTestTxs).length /
      Object.keys(mockNormalizedRegularTransactions).length
  );
  expect(queryLoadingMoreLabel()).not.toBeInTheDocument();
});

test("test tx sorting", async () => {
  jest.useFakeTimers();

  const mockchangeTransactionsFilter = (transactionActions.changeTransactionsFilter = jest.fn(
    () => () => {}
  ));

  render(<TransactionsPage />, {
    initialState: cloneDeep(initialState)
  });
  user.click(screen.getByText("History"));

  // change sorting, show the oldest first
  const txSortButton = screen.getAllByRole("button", {
    name: "EyeFilterMenu"
  })[0];
  user.click(txSortButton);
  user.click(screen.getByText("Oldest"));
  jest.advanceTimersByTime(101);
  await wait(() =>
    expect(mockchangeTransactionsFilter).toHaveBeenCalledWith({
      ...initialState.grpc.transactionsFilter,
      listDirection: "asc"
    })
  );

  // change back sorting, show the newest first
  user.click(txSortButton);
  user.click(screen.getByText("Newest"));
  jest.advanceTimersByTime(101);
  await wait(() =>
    expect(mockchangeTransactionsFilter).toHaveBeenCalledWith({
      ...initialState.grpc.transactionsFilter,
      listDirection: "desc"
    })
  );
});

test("test no txs", () => {
  const mockGetTransactionsResponse = {
    type: transactionActions.GETTRANSACTIONS_COMPLETE,
    getRegularTxsAux: { noMoreTransactions: true },
    stakeTransactions: {},
    regularTransactions: {},
    normalizedRegularTransactions: {},
    startRequestHeight: 0,
    noMoreLiveTickets: true
  };

  mockGetTransactions = transactionActions.getTransactions = jest.fn(
    () => (dispatch) => dispatch(mockGetTransactionsResponse)
  );
  const initialStateMod = {
    ...cloneDeep(initialState)
  };
  initialStateMod.grpc.getRegularTxsAux.noMoreTransactions = true;
  render(<TransactionsPage />, {
    initialState: initialStateMod,
    currentSettings: {
      network: "testnet"
    }
  });
  user.click(screen.getByText("History"));
  user.click(getLoadingMoreLabel());
  expect(screen.getByText("No Transactions Found"));
});
