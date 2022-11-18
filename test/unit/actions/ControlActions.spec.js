import * as ca from "actions/ControlActions";
import { cloneDeep, isEqual } from "lodash";
import { createStore } from "test-utils.js";

const controlActions = ca;

const selectedAccountForTicketPurchase = 1;
const selectedAccountForTicketPurchaseName = "ticket-purchase-account-name";

const ticketBuyerAccount = 2;
const ticketBuyerAccountName = "ticket-buyer-account-name";

const changeAccount = 3;
const mixedAccount = 4;
const dexAccountNumber = 5;
const dexAccountName = "dex";

const commitmentAccount = 6;

const testBalances = [
  { accountNumber: 0, accountName: "default" },
  {
    accountNumber: selectedAccountForTicketPurchase,
    accountName: selectedAccountForTicketPurchaseName
  },
  { accountNumber: ticketBuyerAccount, accountName: ticketBuyerAccountName },
  { accountNumber: changeAccount, accountName: "test-account3" },
  { accountNumber: mixedAccount, accountName: "test-account4" },
  { accountNumber: dexAccountNumber, accountName: dexAccountName },
  { accountNumber: commitmentAccount, accountName: "test-account5" }
];

const initialState = {
  grpc: { balances: testBalances },
  walletLoader: {
    dexAccount: dexAccountName,
    mixedAccount: mixedAccount,
    changeAccount: changeAccount
  },
  vsp: {
    account: ticketBuyerAccountName,
    selectedAccountForTicketPurchase: selectedAccountForTicketPurchaseName,
    trackedTickets: {
      "https://teststakepool.decred.org": {
        host: "https://teststakepool.decred.org",
        tickets: [
          {
            commitmentAccount: commitmentAccount
          }
        ]
      }
    }
  }
};

test("test filterUnlockableAccounts - there is no running progress", () => {
  const store = createStore(cloneDeep(initialState));

  const accts = [
    0,
    selectedAccountForTicketPurchase,
    ticketBuyerAccount,
    changeAccount,
    mixedAccount,
    dexAccountNumber,
    commitmentAccount
  ];
  const filteredAccounts = controlActions.filterUnlockableAccounts(
    accts,
    store.getState
  );

  // dex account is always filtered out
  expect(filteredAccounts.includes(dexAccountNumber)).toBeFalsy();
  // commitment accounts are always filtered out
  expect(filteredAccounts.includes(commitmentAccount)).toBeFalsy();
  // all other accounts remained
  expect(
    isEqual(filteredAccounts, [
      0,
      selectedAccountForTicketPurchase,
      ticketBuyerAccount,
      changeAccount,
      mixedAccount
    ])
  ).toBeTruthy();
});

test("test filterUnlockableAccounts - invalid dex account name", () => {
  const store = createStore(
    cloneDeep({ ...initialState, walletLoader: { dexAccount: "invalid" } })
  );

  const accts = [
    0,
    selectedAccountForTicketPurchase,
    ticketBuyerAccount,
    changeAccount,
    mixedAccount,
    dexAccountNumber
  ];
  const filteredAccounts = controlActions.filterUnlockableAccounts(
    accts,
    store.getState
  );

  expect(filteredAccounts.includes(dexAccountNumber)).toBeTruthy();
  expect(isEqual(filteredAccounts, accts)).toBeTruthy();
});

const testRunnning = (store) => {
  const accts = [
    0,
    selectedAccountForTicketPurchase,
    ticketBuyerAccount,
    changeAccount,
    mixedAccount,
    dexAccountNumber
  ];
  const filteredAccounts = controlActions.filterUnlockableAccounts(
    accts,
    store.getState
  );

  // dex account is always filtered out
  expect(filteredAccounts.includes(dexAccountNumber)).toBeFalsy();
  // commitment accounts are always filtered out
  expect(filteredAccounts.includes(commitmentAccount)).toBeFalsy();
  // all other accounts remained

  expect(filteredAccounts.includes(mixedAccount)).toBeFalsy();
  expect(filteredAccounts.includes(changeAccount)).toBeFalsy();
  expect(filteredAccounts.includes(ticketBuyerAccount)).toBeFalsy();
  expect(
    filteredAccounts.includes(selectedAccountForTicketPurchase)
  ).toBeFalsy();
  expect(isEqual(filteredAccounts, [0])).toBeTruthy();
};

test("test filterUnlockableAccounts - account mixer is running", () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      grpc: { ...initialState.grpc, accountMixerRunning: true }
    })
  );

  testRunnning(store);
});

test("test filterUnlockableAccounts - ticket autobuyer is running", () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      vsp: { ...initialState.vsp, ticketAutoBuyerRunning: true }
    })
  );

  testRunnning(store);
});

test("test filterUnlockableAccounts - purchase ticket is running", () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      control: { purchaseTicketsRequestAttempt: true }
    })
  );

  testRunnning(store);
});
