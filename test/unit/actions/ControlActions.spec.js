import * as d from "actions/DexActions";
import * as ca from "actions/ControlActions";
import * as wal from "wallet";
import { cloneDeep, isEqual } from "lodash";
import { createStore } from "test-utils.js";
import { testBalances, dexAccountName } from "./accountMocks.js";

const controlActions = ca;
const wallet = wal;
const dexActions = d;

const testWalletService = "test-wallet-service";
const testError = "test-error";
const testPassphrase = "test-passphrase";
const testNewPassphrase = "test-new-passphrase";
const testDEXAppPassword = "test-new-password";

const selectedAccountForTicketPurchase = 1;
const selectedAccountForTicketPurchaseName = "ticket-purchase-account-name";

const ticketBuyerAccount = 2;
const ticketBuyerAccountName = "ticket-buyer-account-name";

const changeAccount = 3;
const mixedAccount = 4;
const dexAccountNumber = 5;
const commitmentAccount = 6;

const initialState = {
  grpc: {
    balances: testBalances,
    walletService: testWalletService
  },
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

let mockSetAccountPassphrase;
let mockSetWalletPasswordDex;
let mockChangePassphrase;

beforeEach(() => {
  mockSetAccountPassphrase = wallet.setAccountPassphrase = jest.fn(() => {});
  mockChangePassphrase = wallet.changePassphrase = jest.fn(() =>
    Promise.resolve({})
  );
  mockSetWalletPasswordDex = dexActions.setWalletPasswordDex = jest.fn(
    () => () => {}
  );
});

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

test("test changePassphraseAttempt", async () => {
  const testPriv = true;
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(
    controlActions.changePassphraseAttempt(
      testPassphrase,
      testNewPassphrase,
      testPriv
    )
  );

  expect(mockChangePassphrase).toHaveBeenCalledWith(
    testWalletService,
    testPassphrase,
    testNewPassphrase,
    testPriv
  );

  testBalances.forEach(({ accountNumber, accountName }, index) => {
    if (accountName !== "imported") {
      expect(mockSetAccountPassphrase).toHaveBeenNthCalledWith(
        index + 1,
        testWalletService,
        accountNumber,
        testPassphrase,
        testNewPassphrase,
        null
      );
    }
  });

  expect(mockSetWalletPasswordDex).not.toHaveBeenCalled();
  expect(store.getState().control.changePassphraseError).toBeNull();
  expect(store.getState().control.changePassphraseRequestAttempt).toBeFalsy();
  expect(store.getState().control.changePassphraseResponse).toStrictEqual({});
  expect(store.getState().control.changePassphraseSuccess).toBe(
    "Your private passphrase was successfully updated."
  );
});

test("test changePassphraseAttempt - failed", async () => {
  mockChangePassphrase = wallet.changePassphrase = jest.fn(() =>
    Promise.reject(testError)
  );
  const testPriv = true;
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(
    controlActions.changePassphraseAttempt(
      testPassphrase,
      testNewPassphrase,
      testPriv
    )
  );

  expect(mockChangePassphrase).toHaveBeenCalledWith(
    testWalletService,
    testPassphrase,
    testNewPassphrase,
    testPriv
  );

  expect(mockSetAccountPassphrase).not.toHaveBeenCalled();
  expect(mockSetWalletPasswordDex).not.toHaveBeenCalled();

  expect(store.getState().control.changePassphraseError).toBe(testError);
  expect(store.getState().control.changePassphraseRequestAttempt).toBeFalsy();
  expect(store.getState().control.changePassphraseResponse).toBe(undefined);
  expect(store.getState().control.changePassphraseSuccess).toBe(undefined);
});

test("test changePassphraseAttempt - dex is active", async () => {
  const testPriv = true;
  const store = createStore(
    cloneDeep({
      ...initialState,
      dex: { ...initialState.dex, active: true }
    })
  );
  await store.dispatch(
    controlActions.changePassphraseAttempt(
      testPassphrase,
      testNewPassphrase,
      testPriv,
      testDEXAppPassword
    )
  );

  expect(mockChangePassphrase).toHaveBeenCalledWith(
    testWalletService,
    testPassphrase,
    testNewPassphrase,
    testPriv
  );

  testBalances.forEach(({ accountNumber, accountName }, index) => {
    if (accountName !== "imported") {
      expect(mockSetAccountPassphrase).toHaveBeenNthCalledWith(
        index + 1,
        testWalletService,
        accountNumber,
        testPassphrase,
        testNewPassphrase,
        null
      );
    }
  });
  expect(mockSetWalletPasswordDex).toHaveBeenCalledWith(
    testNewPassphrase,
    testDEXAppPassword
  );

  expect(store.getState().control.changePassphraseError).toBeNull();
  expect(store.getState().control.changePassphraseRequestAttempt).toBeFalsy();
  expect(store.getState().control.changePassphraseResponse).toStrictEqual({});
  expect(store.getState().control.changePassphraseSuccess).toBe(
    "Your private passphrase was successfully updated."
  );
});
