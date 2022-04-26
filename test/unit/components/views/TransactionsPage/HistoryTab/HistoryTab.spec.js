import { HistoryTab } from "components/views/TransactionsPage/HistoryTab";
import TransactionsPage from "components/views/TransactionsPage/";
import { render } from "test-utils.js";
import { screen, wait } from "@testing-library/react";
import user from "@testing-library/user-event";
export const GETNEXTADDRESS_SUCCESS = "GETNEXTADDRESS_SUCCESS";
import * as sel from "selectors";
import * as ta from "actions/TransactionActions";
import { DCR } from "constants";
import { mockRegularTransactions } from "../../TransactionPage/mocks";

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
    regularTransactions: [],
    getRegularTxsAux: {
      noMoreTransactions: false
    }
  }
};

const getTestTxs = (startTs) => {
  const txList = {};
  const startDate = new Date(startTs * 1000);
  let lastTransaction;

  Object.keys(mockRegularTransactions).forEach((txHash) => {
    lastTransaction = { ...mockRegularTransactions[txHash] };
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
  selectors.noMoreRegularTxs = jest.fn(() => false);
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
    initialState
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

test("test txList", async () => {
  jest.useFakeTimers();
  let allTestTxs = {};
  const mockGetTransactionsResponse = {
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
        ...mockGetTransactionsResponse.regularTransactions
      };
      return dispatch(mockGetTransactionsResponse);
    }
  );
  const incAllTestTxs = (ts) => {
    const { lastTransaction, txList } = getTestTxs(
      ts ||
        mockGetTransactionsResponse.getRegularTxsAux.lastTransaction.timestamp
    );
    mockGetTransactionsResponse.regularTransactions = txList;
    mockGetTransactionsResponse.getRegularTxsAux.lastTransaction = lastTransaction;
  };

  incAllTestTxs(1587545280);

  render(<TransactionsPage />, {
    initialState
  });
  user.click(screen.getByText("History"));

  expect(getHistoryPageContent().childElementCount).toBe(0);

  const chunkCount = 10;
  // loads more items chunkCount times
  for (let i = 1; i <= chunkCount; i++) {
    user.click(getLoadingMoreLabel());
    expect(mockGetTransactions).toHaveBeenCalledTimes(i);
    expect(getHistoryPageContent().childElementCount).toBe(
      Object.keys(mockRegularTransactions).length * i
    );
    expect(getLoadingMoreLabel()).toBeInTheDocument();
    incAllTestTxs();
  }

  // loads the last items, no more txs
  selectors.noMoreRegularTxs = jest.fn(() => true);
  user.click(getLoadingMoreLabel());
  expect(getHistoryPageContent().childElementCount).toBe(
    Object.keys(allTestTxs).length
  );
  expect(mockGetTransactions).toHaveBeenCalledTimes(chunkCount + 1);
  expect(queryLoadingMoreLabel()).not.toBeInTheDocument();

  // go to Send and come back. no more getTransactions call should happen
  user.click(screen.getByText("Send"));
  user.click(screen.getByText("History"));

  expect(getHistoryPageContent().childElementCount).toBe(
    Object.keys(allTestTxs).length
  );
  expect(mockGetTransactions).toHaveBeenCalledTimes(chunkCount + 1);
  expect(queryLoadingMoreLabel()).not.toBeInTheDocument();

  // show just sent txs
  const txTypeFilterButton = screen.getAllByRole("button", {
    name: "EyeFilterMenu"
  })[1];
  user.click(txTypeFilterButton);
  user.click(getTxTypeFilterMenuItem("Sent"));
  jest.advanceTimersByTime(101);

  await wait(
    () => expect(screen.getAllByText("Sent").length).toBe(chunkCount + 1) // each chunk has one element of each type
  );

  // show just sent and received txs
  user.click(txTypeFilterButton);
  user.click(getTxTypeFilterMenuItem("Received"));
  jest.advanceTimersByTime(101);

  await wait(
    () =>
      expect(getHistoryPageContent().childElementCount).toBe(
        (chunkCount + 1) * 2
      ) // each chunk has one element of each type
  );
  expect(screen.getAllByText("Sent").length).toBe(chunkCount + 1);
  expect(screen.getAllByText("Received").length).toBe(chunkCount + 1);

  // show just received txs
  user.click(txTypeFilterButton);
  user.click(getTxTypeFilterMenuItem("Sent"));
  jest.advanceTimersByTime(101);

  await wait(
    () => expect(getHistoryPageContent().childElementCount).toBe(chunkCount + 1) // each chunk has one element of each type
  );
  expect(screen.getAllByText("Received").length).toBe(chunkCount + 1);

  // show just received and Ticket Fee txs
  user.click(txTypeFilterButton);
  user.click(getTxTypeFilterMenuItem("Ticket fee"));
  jest.advanceTimersByTime(101);

  await wait(
    () =>
      expect(getHistoryPageContent().childElementCount).toBe(
        (chunkCount + 1) * 2
      ) // each chunk has one element of each type
  );
  expect(screen.getAllByText("Received").length).toBe(chunkCount + 1);
  expect(screen.getAllByText("Self transfer").length).toBe(chunkCount + 1);

  // show all txs again
  user.click(txTypeFilterButton);
  user.click(getTxTypeFilterMenuItem("Ticket fee"));
  user.click(txTypeFilterButton);
  user.click(getTxTypeFilterMenuItem("All"));
  jest.advanceTimersByTime(101);

  await wait(() =>
    expect(getHistoryPageContent().childElementCount).toBe(
      Object.keys(allTestTxs).length
    )
  );

  // show just mixed txs
  user.click(txTypeFilterButton);
  user.click(getTxTypeFilterMenuItem("Mixed"));
  jest.advanceTimersByTime(101);

  await wait(
    () => expect(getHistoryPageContent().childElementCount).toBe(chunkCount + 1) // each chunk has one element of each type
  );
  expect(screen.getAllByText("Mix").length).toBe(chunkCount + 1);

  // show all txs again by toggle Mixed option
  user.click(txTypeFilterButton);
  user.click(getTxTypeFilterMenuItem("Mixed"));
  jest.advanceTimersByTime(101);

  await wait(() =>
    expect(getHistoryPageContent().childElementCount).toBe(
      Object.keys(allTestTxs).length
    )
  );

  // filter by hash id
  user.type(
    screen.getByPlaceholderText("Filter by Address or Hash"),
    Object.keys(allTestTxs)[3]
  );
  jest.advanceTimersByTime(101);
  await wait(() => expect(getHistoryPageContent().childElementCount).toBe(1));
});

test("test tx sorting", async () => {
  jest.useFakeTimers();

  const mockchangeTransactionsFilter = (transactionActions.changeTransactionsFilter = jest.fn(
    () => () => {}
  ));

  render(<TransactionsPage />, {
    initialState
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
