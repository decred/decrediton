import TicketsPage from "components/views/TicketsPage/";
import { render } from "test-utils.js";
import { screen, wait } from "@testing-library/react";
import user from "@testing-library/user-event";
export const GETNEXTADDRESS_SUCCESS = "GETNEXTADDRESS_SUCCESS";
import * as sel from "selectors";
import * as ta from "actions/TransactionActions";
import * as wl from "wallet";
import * as vspa from "actions/VSPActions";
import { DCR } from "constants";
import { mockNormalizedStakeTransactions } from "../../TransactionPage/mocks";
import { cloneDeep } from "fp";
import {
  VSP_FEE_PROCESS_STARTED,
  VSP_FEE_PROCESS_PAID,
  VSP_FEE_PROCESS_ERRORED,
  VSP_FEE_PROCESS_CONFIRMED,
  EXTERNALREQUEST_STAKEPOOL_LISTING,
  TICKET
} from "constants";
import { mockAvailableVsps, mockVspInfo } from "../PurchaseTab/mocks";
import { en as enLocale } from "i18n/locales";
import { DEFAULT_LIGHT_THEME_NAME } from "pi-ui";

const selectors = sel;
const transactionActions = ta;
const wallet = wl;
const vspActions = vspa;

const locale = enLocale;
const currentSettings = {
  locale: locale.key,
  theme: DEFAULT_LIGHT_THEME_NAME,
  allowedExternalRequests: [EXTERNALREQUEST_STAKEPOOL_LISTING],
  network: "testnet"
};

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
  },
  vsp: {
    vspTickets: []
  },
  settings: {
    currentSettings,
    tempSettings: currentSettings
  }
};

const mockStakeTickets = {};
Object.keys(mockNormalizedStakeTransactions).forEach((txHash) => {
  if (mockNormalizedStakeTransactions[txHash].txType === TICKET) {
    mockStakeTickets[txHash] = mockNormalizedStakeTransactions[txHash];
  }
});

const getTestTxs = (startTs) => {
  const txList = {};
  const startDate = new Date(startTs * 1000);
  let lastTransaction;

  Object.keys(mockStakeTickets).forEach((txHash) => {
    lastTransaction = { ...mockStakeTickets[txHash] };
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
const testPassphrase = "test-passphrase";

let mockSyncVSPTicketsRequest;

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
  selectors.getAvailableVSPs = jest.fn(() => mockAvailableVsps);
  transactionActions.toggleGetTransactions = jest.fn(() => () => {});
  selectors.startRequestHeight = jest.fn(() => 1000);
  selectors.currentBlockHeight = jest.fn(() => 10000);

  wallet.getVSPTicketsByFeeStatus = jest.fn(() =>
    Promise.resolve({
      ticketHashes: []
    })
  );
  wallet.getVSPInfo = jest.fn(() => {
    return Promise.resolve(mockVspInfo);
  });
  mockSyncVSPTicketsRequest = vspActions.syncVSPTicketsRequest = jest.fn(
    () => () => {}
  );
});
afterEach(() => {
  jest.useRealTimers();
});

const getHistoryPageContent = () =>
  screen.getByTestId("VSPTicketHistoryPageContent");
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

const viewAllTxs = (mockGetTransactionsResponse, chunkCount) => {
  let i = 1;
  while (queryLoadingMoreLabel()) {
    user.click(getLoadingMoreLabel());
    mockGetTransactionsResponse = incAllTestTxs(mockGetTransactionsResponse);
    if (i++ == chunkCount) {
      mockGetTransactionsResponse.noMoreLiveTickets = true;
    }
  }
  return mockGetTransactionsResponse;
};

test("test vsp ticket status list", async () => {
  jest.useFakeTimers();
  let allTestTxs = {};
  let mockGetTransactionsResponse = {
    type: transactionActions.GETTRANSACTIONS_COMPLETE,
    getStakeTxsAux: { noMoreTransactions: false },
    getRegularTxsAux: {},
    stakeTransactions: {},
    regularTransactions: {},
    startRequestHeight: 0,
    noMoreLiveTickets: false
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

  wallet.getVSPTicketsByFeeStatus = jest.fn((_, feeStatus) => {
    let ticketHashes = [];
    // started
    if (feeStatus == VSP_FEE_PROCESS_STARTED) {
      ticketHashes = [
        "test-txHash-1587523680", // live
        "test-txHash-1587527280", // immature
        "test-txHash-1587530880", // unmined
        "test-txHash-1587365280" // missed, expected to be not shown
      ];
    }
    // paid
    if (feeStatus == VSP_FEE_PROCESS_PAID) {
      ticketHashes = [
        "test-txHash-1587480480", // live
        "test-txHash-1587484080", // immature
        "test-txHash-1587509280", // unmined
        "test-txHash-1587361680" // revoked, expected to be not shown
      ];
    }
    // errored
    if (feeStatus == VSP_FEE_PROCESS_ERRORED) {
      ticketHashes = [
        "test-txHash-1587458880", // live
        "test-txHash-1587462480", // immature
        "test-txHash-1587466080" // unmined
      ];
    }
    // confirmed
    if (feeStatus == VSP_FEE_PROCESS_CONFIRMED) {
      ticketHashes = [
        "test-txHash-1587437280", // live
        "test-txHash-1587440880", // immature
        "test-txHash-1587444480", // unmined
        "test-txHash-1587134880", // live
        "test-txHash-1587394080",
        "test-txHash-1587372480",
        "test-txHash-1587350880",
        "test-txHash-1587307680",
        "test-txHash-1587311280",
        "test-txHash-1587318480"
      ];
    }
    return Promise.resolve({
      ticketHashes: ticketHashes
    });
  });

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

  const chunkCount = 10;

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
  user.click(screen.getByText("Ticket Status"));

  // Scroll down to the bottom.
  // The data should be fetched by getTransactions request
  expect(getHistoryPageContent().childElementCount).toBe(0);
  viewAllTxs(mockGetTransactionsResponse, chunkCount);

  await wait(() => expect(getHistoryPageContent().childElementCount).toBe(17));
  expect(mockGetTransactions).toHaveBeenCalledTimes(
    Object.keys(allTestTxs).length / Object.keys(mockStakeTickets).length
  );
  expect(queryLoadingMoreLabel()).not.toBeInTheDocument();
  expect(getNoMoreTicketsLabel()).toBeInTheDocument();

  // show just unpaid fee tickets
  mockGetTransactions.mockClear();
  const txTypeFilterButton = screen.getByRole("button", {
    name: "EyeFilterMenu"
  });
  user.click(txTypeFilterButton);
  user.click(getTxTypeFilterMenuItem("Unpaid Fee"));
  jest.advanceTimersByTime(101);

  await wait(() => expect(getHistoryPageContent().childElementCount).toBe(3));

  expect(screen.getAllByText("Processing").length).toBe(3);
  expect(mockGetTransactions).toHaveBeenCalledTimes(0);
  expect(getNoMoreTicketsLabel()).toBeInTheDocument();

  // show just paid fee ticket
  mockGetTransactions.mockClear();
  user.click(txTypeFilterButton);
  user.click(getTxTypeFilterMenuItem("Paid Fee"));
  jest.advanceTimersByTime(101);

  await wait(() => expect(getHistoryPageContent().childElementCount).toBe(3));

  expect(screen.getAllByText("Paid").length).toBe(3);
  expect(mockGetTransactions).toHaveBeenCalledTimes(0);
  expect(getNoMoreTicketsLabel()).toBeInTheDocument();

  // show just paid fee ticket
  mockGetTransactions.mockClear();
  user.click(txTypeFilterButton);
  user.click(getTxTypeFilterMenuItem("Fee Error"));
  jest.advanceTimersByTime(101);

  await wait(() => expect(getHistoryPageContent().childElementCount).toBe(3));

  expect(screen.getAllByText("Error").length).toBe(3);
  expect(mockGetTransactions).toHaveBeenCalledTimes(0);
  expect(getNoMoreTicketsLabel()).toBeInTheDocument();

  // show just confirmed fee ticket
  mockGetTransactions.mockClear();
  user.click(txTypeFilterButton);
  user.click(getTxTypeFilterMenuItem("Confirmed Fee"));
  jest.advanceTimersByTime(101);

  await wait(() =>
    expect(getHistoryPageContent().childElementCount).not.toBe(3)
  );

  expect(screen.getAllByText("Confirmed").length).toBe(8);
  expect(mockGetTransactions).toHaveBeenCalledTimes(0);
  expect(getNoMoreTicketsLabel()).toBeInTheDocument();

  // sync Failed VSP Tickets
  const syncFaildVSPTicketsButton = screen.getByRole("button", {
    name: "Sync Failed VSP Tickets"
  });
  user.click(syncFaildVSPTicketsButton);

  // cancel first
  user.click(screen.getByRole("button", { name: "Cancel" }));

  // continue now
  user.click(syncFaildVSPTicketsButton);
  expect(screen.getByText("Confirmation Required")).toBeInTheDocument();
  user.type(screen.getByLabelText("Private Passphrase"), testPassphrase);
  user.click(screen.getByText("Select VSP..."));
  user.click(screen.getByText(mockAvailableVsps[1].host));
  await wait(() =>
    expect(screen.queryByText("Loading")).not.toBeInTheDocument()
  );

  user.click(screen.getByRole("button", { name: "Continue" }));
  expect(mockSyncVSPTicketsRequest).toHaveBeenCalledWith({
    account: mockMixedAccountValue,
    passphrase: testPassphrase,
    vspHost: mockAvailableVsps[1].host,
    vspPubkey: mockVspInfo.data.pubkey
  });
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
  user.click(screen.getByText("Ticket Status"));
  expect(screen.getByText("No Tickets Found"));
});
