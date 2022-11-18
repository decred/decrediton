import * as d from "actions/DexActions";
import * as ca from "actions/ControlActions";
import * as cla from "actions/ClientActions";
import * as ta from "actions/TransactionActions";
import * as sa from "actions/SettingsActions";
import * as vspa from "actions/VSPActions";
import * as wal from "wallet";
import { cloneDeep, isEqual } from "lodash";
import { createStore } from "test-utils.js";
import {
  testBalances,
  dexAccountName,
  changeAccountNumber,
  mixedAccountNumber,
  mixedAccountName,
  mixedAccount,
  defaultAccountNumber,
  defaultAccount,
  dexAccountNumber,
  commitmentAccountNumber,
  unencryptedAccount,
  ticketBuyerAccountNumber,
  ticketBuyerAccountName
} from "./accountMocks.js";
import { wait } from "@testing-library/react";
import { advanceBy, clear } from "jest-date-mock";
import { act } from "react-dom/test-utils";

const controlActions = ca;
const wallet = wal;
const vspActions = vspa;
const settingsActions = sa;
const transactionActions = ta;
const clientActions = cla;
const dexActions = d;

const testWalletService = "test-wallet-service";
const testError = "test-error";
const testPassphrase = "test-passphrase";
const testNewPassphrase = "test-new-passphrase";
const testDEXAppPassword = "test-new-password";

const selectedAccountForTicketPurchase = 1;
const selectedAccountForTicketPurchaseName = "ticket-purchase-account-name";

const testTicketBuyerService = "test-ticket-buyer-service";
const testVSP = { host: "test-vsp-host", pubkey: "test-vsp-pubkey" };
const testMixedAccountBranch = "test-mixed-account-branch";
const testCsppServer = "test-cspp-server";
const testCsppPort = "test-cspp-port";
const expectedCsppReq = {
  mixedAccount: mixedAccountNumber,
  changeAccount: changeAccountNumber,
  csppServer: testCsppServer,
  csppPort: testCsppPort,
  mixedAcctBranch: testMixedAccountBranch
};

const testUnspentOutputs = ["unspent-output"];
const testBalanceToMaintain = 3;
const testAddress = "test-address";
const testMessage = "test-message";
const testSignature =
  "2019071291abce6c142209780554b183131b451da4b0a520d6ba931013a7bfc7c831a72350c4a0d2e45077caa0a75c4bb2f476d76d765bc96069d03b3bc87ef856";

const testAccountMixerService = "test-accountmixer-service";

const initialState = {
  grpc: {
    balances: testBalances,
    walletService: testWalletService,
    ticketBuyerService: testTicketBuyerService,
    accountMixerService: testAccountMixerService,
    getTicketPriceResponse: {
      ticketPrice: 6309912196,
      height: 1007755
    }
  },
  walletLoader: {
    dexAccount: dexAccountName,
    mixedAccount: mixedAccountNumber,
    changeAccount: changeAccountNumber,
    csppServer: testCsppServer,
    csppPort: testCsppPort,
    mixedAccountBranch: testMixedAccountBranch
  },
  vsp: {
    account: ticketBuyerAccountName,
    selectedAccountForTicketPurchase: selectedAccountForTicketPurchaseName,
    trackedTickets: {
      "https://teststakepool.decred.org": {
        host: "https://teststakepool.decred.org",
        tickets: [
          {
            commitmentAccount: commitmentAccountNumber
          }
        ]
      }
    }
  },
  control: { lockAccountError: null }
};

let mockSetAccountPassphrase;
let mockSetWalletPasswordDex;
let mockChangePassphrase;
let mockGetVSPTrackedTickets;
let mockSetNeedsVSPdProcessTickets;
let mockCallbackFunction;
let mockPurchaseTicketsV3;
let mockListUnspentOutputs;
let mockStartTicketAutoBuyerV3;
let mockValidateAddress;
let mockSignMessage;
let mockUpdateUsedVSPs;
let mockMixerStreamer;
let mockRunAccountMixerRequest;
let mockMixerStreamerCancel;

beforeEach(() => {
  mockSetAccountPassphrase = wallet.setAccountPassphrase = jest.fn(() => {});
  mockChangePassphrase = wallet.changePassphrase = jest.fn(() =>
    Promise.resolve({})
  );
  mockSetWalletPasswordDex = dexActions.setWalletPasswordDex = jest.fn(
    () => () => {}
  );
  mockGetVSPTrackedTickets = vspActions.getVSPTrackedTickets = jest.fn(
    () => (dispatch) => {
      dispatch({
        trackedTickets: initialState.vsp.trackedTickets,
        type: vspActions.GETVSPTRACKEDTICKETS_SUCCESS
      });
      Promise.resolve();
    }
  );
  mockSetNeedsVSPdProcessTickets = settingsActions.setNeedsVSPdProcessTickets = jest.fn(
    () => () => {}
  );
  mockCallbackFunction = jest.fn(() => new Promise((r) => setTimeout(r, 10)));
  mockPurchaseTicketsV3 = wallet.purchaseTicketsV3 = jest.fn(() =>
    Promise.resolve({ ticketHashes: [] })
  );
  mockUpdateUsedVSPs = vspActions.updateUsedVSPs = jest.fn(() => () => {});
  mockListUnspentOutputs = transactionActions.listUnspentOutputs = jest.fn(
    () => () => Promise.resolve(testUnspentOutputs)
  );
  mockValidateAddress = wallet.validateAddress = jest.fn(() => ({
    accountNumber: defaultAccountNumber
  }));
  mockSignMessage = wallet.signMessage = jest.fn(() => ({
    signature: testSignature
  }));

  mockMixerStreamerCancel = jest.fn(() => {});
  mockMixerStreamer = { cancel: mockMixerStreamerCancel };
  mockRunAccountMixerRequest = wallet.runAccountMixerRequest = jest.fn(() =>
    Promise.resolve(mockMixerStreamer)
  );
  wallet.getAccountMixerService = jest.fn(() =>
    Promise.resolve(testAccountMixerService)
  );
});

afterEach(() => {
  clear();
  jest.useRealTimers();
});

test("test filterUnlockableAccounts - there is no running progress", () => {
  const store = createStore(cloneDeep(initialState));

  const accts = [
    0,
    selectedAccountForTicketPurchase,
    ticketBuyerAccountNumber,
    changeAccountNumber,
    mixedAccountNumber,
    dexAccountNumber,
    commitmentAccountNumber
  ];
  const filteredAccounts = controlActions.filterUnlockableAccounts(
    accts,
    store.getState
  );

  // dex account is always filtered out
  expect(filteredAccounts.includes(dexAccountNumber)).toBeFalsy();
  // commitment accounts are always filtered out
  expect(filteredAccounts.includes(commitmentAccountNumber)).toBeFalsy();
  // all other accounts remained
  expect(
    isEqual(filteredAccounts, [
      0,
      selectedAccountForTicketPurchase,
      ticketBuyerAccountNumber,
      changeAccountNumber,
      mixedAccountNumber
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
    ticketBuyerAccountNumber,
    changeAccountNumber,
    mixedAccountNumber,
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
    ticketBuyerAccountNumber,
    changeAccountNumber,
    mixedAccountNumber,
    dexAccountNumber
  ];
  const filteredAccounts = controlActions.filterUnlockableAccounts(
    accts,
    store.getState
  );

  // dex account is always filtered out
  expect(filteredAccounts.includes(dexAccountNumber)).toBeFalsy();
  // commitment accounts are always filtered out
  expect(filteredAccounts.includes(commitmentAccountNumber)).toBeFalsy();
  // all other accounts remained

  expect(filteredAccounts.includes(mixedAccountNumber)).toBeFalsy();
  expect(filteredAccounts.includes(changeAccountNumber)).toBeFalsy();
  expect(filteredAccounts.includes(ticketBuyerAccountNumber)).toBeFalsy();
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
