import { wait } from "@testing-library/dom";
import * as ama from "actions/AccountMixerActions";
import * as cla from "actions/ClientActions";
import * as cta from "actions/ControlActions";
import {
  CHANGE_ACCOUNT_CFG,
  MAINNET,
  MIN_MIX_DENOMINATION_ATOMS,
  MIN_RELAY_FEE_ATOMS,
  MIXED_ACC_BRANCH,
  MIXED_ACCOUNT_CFG,
  SEND_FROM_UNMIXED,
  TESTNET
} from "constants";
import { cloneDeep } from "fp";
import { createStore } from "test-utils.js";
import * as wal from "wallet";
import { isEqual } from "lodash";
import {
  mockUnlockLockAndGetAccountsAttempt,
  selectedAccountNumberForTicketPurchase,
  selectedAccountForTicketPurchaseName,
  ticketBuyerAccountNumber,
  ticketBuyerAccountName,
  changeAccountNumber
} from "./accountMocks.js";

const accountMixerActions = ama;
const wallet = wal;
const controlActions = cta;
const clientActions = cla;

const testDcrwalletGrpcKeyCert = "test-dcrwallet-grpc-key-cert";
const testAccountMixerService = "test-accountmixer-service";

const testAddress = "test-address";
const testPort = "test-port";
const testWalletName = "test-wallet-name";
const testSpendableBalance =
  MIN_RELAY_FEE_ATOMS + MIN_MIX_DENOMINATION_ATOMS + 1; // sufficient balance for mixing

const testPassphrase = "test-passphrase";
const testMixedAccount = "test-mixed-account";
const testMixedAccountBranch = "test-mixed-account-branch";
const testChangeAccount = "test-change-account";

const testError = "test-error";
const testMixedAccountName = "text-mixed-account-name";
const testChangeAccountName = "text-change-account-name";
const testWalletService = "test-wallet-service";

const testGetCoinjoinOutputsByAccResponse = {
  wrappers_: [{}, [{ accountNumber: 1, coinjoinTxsSum: 12 }]]
};

const testBalances = [
  { accountNumber: 0, accountName: "default", encrypted: true },
  {
    accountNumber: selectedAccountNumberForTicketPurchase,
    accountName: selectedAccountForTicketPurchaseName,
    encrypted: true
  },
  {
    accountNumber: ticketBuyerAccountNumber,
    accountName: ticketBuyerAccountName,
    encrypted: true
  },
  {
    accountNumber: changeAccountNumber,
    accountName: testChangeAccount,
    encrypted: true
  },
  {
    accountNumber: 2147483647,
    accountName: "imported"
  }
];

const initialState = {
  grpc: {
    address: testAddress,
    port: testPort,
    walletService: testWalletService,
    balances: testBalances
  },
  daemon: { walletName: testWalletName }
};

let mockGetDcrwalletGrpcKeyCert;
let mockGetAccountMixerService;
let mockGetWalletCfg;
let mockWalletCfgGet;
let mockWalletCfgSet;
let mockGetBalance;
let mockRunAccountMixerRequest;
let mockMixerStreamer;
let mockOnEvent;
let mockCleanPrivacyLogs;
let mockMixerStreamerCancel;
let mockGetNextAccountAttempt;
let mockGetMixerAcctsSpendableBalances;
let mockGetCoinjoinOutputspByAcctReq;

beforeEach(() => {
  mockGetDcrwalletGrpcKeyCert = wallet.getDcrwalletGrpcKeyCert = jest.fn(
    () => testDcrwalletGrpcKeyCert
  );
  mockGetAccountMixerService = wallet.getAccountMixerService = jest.fn(() =>
    Promise.resolve(testAccountMixerService)
  );
  mockGetBalance = wallet.getBalance = jest.fn(() =>
    Promise.resolve({ spendable: testSpendableBalance })
  );
  mockCleanPrivacyLogs = wallet.cleanPrivacyLogs = jest.fn(() => {});

  mockMixerStreamerCancel = jest.fn(() => {});
  mockMixerStreamer = { cancel: mockMixerStreamerCancel };

  mockWalletCfgGet = jest.fn(() => {});
  mockWalletCfgSet = jest.fn(() => {});
  mockGetWalletCfg = wallet.getWalletCfg = jest.fn(() => ({
    get: mockWalletCfgGet,
    set: mockWalletCfgSet
  }));

  mockGetMixerAcctsSpendableBalances =
    clientActions.getMixerAcctsSpendableBalances = jest.fn(
      () => () => Promise.resolve()
    );
  mockGetNextAccountAttempt = controlActions.getNextAccountAttempt = jest.fn(
    (_, accountName) => () => {
      if (accountName === testMixedAccountName) {
        return { getNextAccountResponse: { accountNumber: testMixedAccount } };
      }
      if (accountName === testChangeAccountName) {
        return { getNextAccountResponse: { accountNumber: testChangeAccount } };
      }
    }
  );

  mockGetCoinjoinOutputspByAcctReq = wallet.getCoinjoinOutputspByAcctReq =
    jest.fn(() => Promise.resolve(testGetCoinjoinOutputsByAccResponse));
});

const testGetAccountMixerServiceAttempt = async (
  initialState,
  isTestnet,
  isGetAccountMixerServiceRejected = false
) => {
  const store = createStore(cloneDeep(initialState));

  await store.dispatch(accountMixerActions.getAccountMixerServiceAttempt());
  expect(mockGetDcrwalletGrpcKeyCert).toHaveBeenCalled();
  expect(mockGetAccountMixerService).toHaveBeenCalledWith(
    isTestnet,
    testWalletName,
    testAddress,
    testPort,
    testDcrwalletGrpcKeyCert,
    testDcrwalletGrpcKeyCert
  );
  if (isGetAccountMixerServiceRejected) {
    expect(store.getState().grpc.accountMixerService).not.toBe(
      testAccountMixerService
    );
  } else {
    expect(store.getState().grpc.accountMixerService).toBe(
      testAccountMixerService
    );
  }
};

test("test getAccountMixerServiceAttempt on mainnet", () => {
  testGetAccountMixerServiceAttempt(cloneDeep(initialState), false); // on mainnet
});

test("test getAccountMixerServiceAttempt on testnet", () => {
  testGetAccountMixerServiceAttempt(
    cloneDeep({
      ...initialState,
      settings: { currentSettings: { network: TESTNET } }
    }),
    true
  ); // on testnet
});

test("test getAccountMixerServiceAttempt failed", () => {
  mockGetAccountMixerService = wallet.getAccountMixerService = jest.fn(() =>
    Promise.reject()
  );
  testGetAccountMixerServiceAttempt(cloneDeep(initialState), false, true); // on mainnet failed
});

const testToggleAllowSendFromUnmixed = async (
  network,
  initialValue,
  expectedValue
) => {
  const store = createStore({
    ...initialState,
    settings: { currentSettings: { network: network } }
  });

  mockWalletCfgGet = jest.fn(() => initialValue);
  await store.dispatch(accountMixerActions.toggleAllowSendFromUnmixed());
  expect(mockGetWalletCfg).toHaveBeenCalledWith(
    network === TESTNET,
    testWalletName
  );
  expect(mockWalletCfgGet).toHaveBeenCalledWith(SEND_FROM_UNMIXED);
  expect(store.getState().walletLoader.allowSendFromUnmixed).toBe(
    expectedValue
  );
};

test("test toggleAllowSendFromUnmixed - switch on", () => {
  testToggleAllowSendFromUnmixed(TESTNET, false, true);
});

test("test toggleAllowSendFromUnmixed - switch off", () => {
  testToggleAllowSendFromUnmixed(MAINNET, true, false);
});

test("test checkUnmixedAccountBalance - sufficient balance", async () => {
  const testChangeAccount = 3;
  const store = createStore(cloneDeep(initialState));

  await store.dispatch(
    accountMixerActions.checkUnmixedAccountBalance(testChangeAccount)
  );
  expect(mockGetBalance).toHaveBeenCalledWith(
    testWalletService,
    testChangeAccount,
    0
  );
  expect(store.getState().grpc.isMixerDisabled).toBeFalsy();
  expect(store.getState().grpc.mixerStreamerError).toBeNull();
});

test("test checkUnmixedAccountBalance - insufficient balance", async () => {
  mockGetBalance = wallet.getBalance = jest.fn(() =>
    Promise.resolve({
      spendable: MIN_RELAY_FEE_ATOMS + MIN_MIX_DENOMINATION_ATOMS - 1
    })
  );
  const testChangeAccount = 3;
  const store = createStore(cloneDeep(initialState));

  await store.dispatch(
    accountMixerActions.checkUnmixedAccountBalance(testChangeAccount)
  );
  expect(mockGetBalance).toHaveBeenCalledWith(
    testWalletService,
    testChangeAccount,
    0
  );
  expect(store.getState().grpc.isMixerDisabled).toBeTruthy();
  expect(store.getState().grpc.mixerStreamerError).not.toBeNull();
});

test("test runAccountMixer start and stop", async () => {
  const { mockLockAccount, mockUnlockAccount } =
    mockUnlockLockAndGetAccountsAttempt();

  const events = {};
  mockMixerStreamer = {
    cancel: mockMixerStreamerCancel,
    on: (eventName, fn) => {
      events[eventName] = fn;
    }
  };
  mockOnEvent = jest.fn((eventName, param) => events[eventName](param));
  mockRunAccountMixerRequest = wallet.runAccountMixerRequest = jest.fn(() =>
    Promise.resolve(mockMixerStreamer)
  );

  const store = createStore(
    cloneDeep({
      ...initialState,
      grpc: {
        ...initialState.grpc,
        accountMixerService: testAccountMixerService
      }
    })
  );
  store.dispatch(
    accountMixerActions.runAccountMixer({
      passphrase: testPassphrase,
      mixedAccount: testMixedAccount,
      mixedAccountBranch: testMixedAccountBranch,
      changeAccount: changeAccountNumber
    })
  );

  await wait(() =>
    expect(mockUnlockAccount).toHaveBeenCalledWith(
      testWalletService,
      testPassphrase,
      changeAccountNumber
    )
  );

  await wait(() =>
    expect(mockRunAccountMixerRequest).toHaveBeenCalledWith(
      testAccountMixerService,
      {
        mixedAccount: testMixedAccount,
        mixedAccountBranch: testMixedAccountBranch,
        changeAccount: changeAccountNumber
      }
    )
  );
  await wait(() =>
    expect(store.getState().grpc.accountMixerRunning).toBeTruthy()
  );
  mockOnEvent("data");
  expect(store.getState().grpc.mixerStreamerError).toBeNull();

  // if context was cancelled we can ignore it, as it probably means
  // mixer was stopped.
  //
  store.dispatch(accountMixerActions.stopAccountMixer(true));
  mockOnEvent("error", "Cancelled");
  expect(store.getState().grpc.mixerStreamerError).toBeNull();

  mockOnEvent("error", testError);
  mockOnEvent("end");
  expect(store.getState().grpc.mixerStreamerError).toBe(testError);

  await wait(() =>
    expect(mockLockAccount).toHaveBeenCalledWith(
      testWalletService,
      changeAccountNumber
    )
  );

  expect(mockCleanPrivacyLogs).toHaveBeenCalled();
  expect(mockMixerStreamerCancel).toHaveBeenCalled();
  await wait(() =>
    expect(store.getState().grpc.accountMixerRunning).toBeFalsy()
  );
  expect(store.getState().grpc.mixerStreamer).toBeNull();
});

test("test runAccountMixer - unlockAcctAndExecFn failed", async () => {
  mockUnlockLockAndGetAccountsAttempt();

  const mockUnlockAccount = (wallet.unlockAccount = jest.fn(() => {
    throw testError;
  }));

  const store = createStore(
    cloneDeep({
      ...initialState,
      grpc: {
        ...initialState.grpc,
        accountMixerService: testAccountMixerService
      }
    })
  );
  store.dispatch(
    accountMixerActions.runAccountMixer({
      passphrase: testPassphrase,
      mixedAccount: testMixedAccount,
      mixedAccountBranch: testMixedAccountBranch,
      changeAccount: changeAccountNumber
    })
  );

  await wait(() =>
    expect(mockUnlockAccount).toHaveBeenCalledWith(
      testWalletService,
      testPassphrase,
      changeAccountNumber
    )
  );

  await wait(() =>
    expect(store.getState().grpc.mixerStreamerError).toBe(testError)
  );
});

test("test stopAccountMixer - mixerStreamer is undefined, does not clean privacy logs", () => {
  const { mockLockAccount } = mockUnlockLockAndGetAccountsAttempt();

  const store = createStore(
    cloneDeep({
      ...initialState,
      grpc: { ...initialState.grpc, accountMixerRunning: true }
    })
  );
  store.dispatch(accountMixerActions.stopAccountMixer(false));

  expect(mockCleanPrivacyLogs).not.toHaveBeenCalled();
  expect(mockMixerStreamerCancel).not.toHaveBeenCalled();
  expect(mockLockAccount).not.toHaveBeenCalled();
  expect(store.getState().grpc.accountMixerRunning).toBeTruthy(); // still running (?)
  expect(store.getState().grpc.mixerStreamer).not.toBeNull();
});

test("test stopAccountMixer - cancel mixer failed", () => {
  const { mockLockAccount } = mockUnlockLockAndGetAccountsAttempt();

  mockMixerStreamerCancel = jest.fn(() => {
    throw testError;
  });
  mockMixerStreamer = { cancel: mockMixerStreamerCancel };
  const store = createStore(
    cloneDeep({
      ...initialState,
      grpc: {
        ...initialState.grpc,
        mixerStreamer: mockMixerStreamer,
        accountMixerRunning: true
      },
      walletLoader: {
        ...initialState.walletLoader,
        changeAccount: testChangeAccount
      }
    })
  );
  store.dispatch(accountMixerActions.stopAccountMixer(true));

  expect(mockCleanPrivacyLogs).toHaveBeenCalled();
  expect(mockMixerStreamerCancel).toHaveBeenCalled();
  expect(mockLockAccount).not.toHaveBeenCalled();

  expect(store.getState().grpc.accountMixerRunning).toBeTruthy();
  expect(store.getState().grpc.mixerStreamer).not.toBeNull();
});

const testCreateNeededAccounts = async (initialState) => {
  const { mockGetAccountsAttempt } = mockUnlockLockAndGetAccountsAttempt();

  const store = createStore(initialState);
  await store.dispatch(
    accountMixerActions.createNeededAccounts(
      testPassphrase,
      testMixedAccountName,
      testChangeAccountName
    )
  );
  expect(mockGetNextAccountAttempt).toHaveBeenNthCalledWith(
    1,
    testPassphrase,
    testMixedAccountName
  );
  expect(mockGetNextAccountAttempt).toHaveBeenNthCalledWith(
    2,
    testPassphrase,
    testChangeAccountName
  );

  expect(mockGetAccountsAttempt).toHaveBeenCalledWith(true);
  expect(mockGetMixerAcctsSpendableBalances).toHaveBeenCalled();

  expect(mockWalletCfgSet).toHaveBeenCalledWith(SEND_FROM_UNMIXED, false);
  expect(mockWalletCfgSet).toHaveBeenCalledWith(MIXED_ACC_BRANCH, 0);
  expect(mockWalletCfgSet).toHaveBeenCalledWith(
    MIXED_ACCOUNT_CFG,
    testMixedAccount
  );
  expect(mockWalletCfgSet).toHaveBeenCalledWith(
    CHANGE_ACCOUNT_CFG,
    testChangeAccount
  );

  expect(store.getState().walletLoader.mixedAccount).toBe(testMixedAccount);
  expect(store.getState().walletLoader.changeAccount).toBe(testChangeAccount);
  expect(store.getState().walletLoader.mixedAccountBranch).toBe(0);
};

test("test createNeededAccounts on testnet", () => {
  testCreateNeededAccounts(
    cloneDeep({
      ...initialState,
      settings: { currentSettings: { network: TESTNET } }
    })
  );
});

test("test createNeededAccounts - failed", async () => {
  const { mockGetAccountsAttempt } = mockUnlockLockAndGetAccountsAttempt();

  mockGetNextAccountAttempt = controlActions.getNextAccountAttempt = jest.fn(
    () => () => Promise.reject(testError)
  );
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(
    accountMixerActions.createNeededAccounts(
      testPassphrase,
      testMixedAccountName,
      testChangeAccountName
    )
  );
  expect(mockGetNextAccountAttempt).toHaveBeenNthCalledWith(
    1,
    testPassphrase,
    testMixedAccountName
  );

  expect(mockGetAccountsAttempt).not.toHaveBeenCalled();
  expect(mockGetMixerAcctsSpendableBalances).not.toHaveBeenCalled();

  expect(mockWalletCfgSet).not.toHaveBeenCalled();

  expect(store.getState().walletLoader.mixedAccount).toBe(undefined);
  expect(store.getState().walletLoader.changeAccount).toBe(undefined);
  expect(store.getState().walletLoader.mixedAccountBranch).toBe(undefined);
});

test("test getCoinjoinOutputspByAcct", async () => {
  const store = createStore(cloneDeep(initialState));
  const result = await store.dispatch(
    accountMixerActions.getCoinjoinOutputspByAcct()
  );
  expect(mockGetCoinjoinOutputspByAcctReq).toHaveBeenCalledWith(
    testWalletService
  );
  expect(
    isEqual(result, [
      { acctIdx: 0, coinjoinSum: 0 },
      { acctIdx: 1, coinjoinSum: 12 },
      { acctIdx: 2, coinjoinSum: 0 },
      { acctIdx: 3, coinjoinSum: 0 }
    ])
  ).toBeTruthy();
});

test("test getCoinjoinOutputspByAcct - rejected", async () => {
  mockGetCoinjoinOutputspByAcctReq = wallet.getCoinjoinOutputspByAcctReq =
    jest.fn(() => Promise.reject(testError));
  const store = createStore(cloneDeep(initialState));
  let receivedError;
  try {
    await store.dispatch(accountMixerActions.getCoinjoinOutputspByAcct());
  } catch (error) {
    receivedError = error;
  }
  expect(mockGetCoinjoinOutputspByAcctReq).toHaveBeenCalledWith(
    testWalletService
  );
  expect(receivedError).toBe(testError);
});

test("test getCoinjoinOutputspByAcct - not valid response from wallet", async () => {
  mockGetCoinjoinOutputspByAcctReq = wallet.getCoinjoinOutputspByAcctReq =
    jest.fn(() => Promise.resolve({ wrappers_: null }));
  const store = createStore(cloneDeep(initialState));
  const result = await store.dispatch(
    accountMixerActions.getCoinjoinOutputspByAcct()
  );
  expect(mockGetCoinjoinOutputspByAcctReq).toHaveBeenCalledWith(
    testWalletService
  );
  expect(result).toBe(undefined);
});
