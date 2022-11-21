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
let mockPurchaseTickets;
let mockListUnspentOutputs;
let mockStartTicketAutoBuyer;
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
  mockPurchaseTickets = wallet.purchaseTicketsV3 = jest.fn(() =>
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

export const mockUnlockLockAndGetAccountsAttempt = () => {
  let unlockedAccounts = [];
  const addUnlockedAccount = (accountNumber) =>
    unlockedAccounts.push(accountNumber);
  const mockLockAccount = (wallet.lockAccount = jest.fn((_, accountNumber) => {
    if (!unlockedAccounts.includes(accountNumber)) {
      console.error(`${accountNumber} is not unlocked`);
    } else {
      unlockedAccounts = unlockedAccounts.filter((an) => an != accountNumber);
    }
  }));
  const mockUnlockAccount = (wallet.unlockAccount = jest.fn(
    (_, passphrase, accountNumber) => {
      if (unlockedAccounts.includes(accountNumber)) {
        console.error(`${accountNumber} is already unlocked (${passphrase})`);
      } else {
        unlockedAccounts.push(accountNumber);
      }
    }
  ));
  const mockGetAccountsAttempt = (clientActions.getAccountsAttempt = jest.fn(
    () => async (dispatch) => {
      const updatedBalances = testBalances.map((b) =>
        unlockedAccounts.includes(b.accountNumber)
          ? { ...b, unlocked: true }
          : b
      );
      await dispatch({
        balances: updatedBalances,
        type: cla.GETBALANCE_SUCCESS
      });
    }
  ));

  return {
    addUnlockedAccount,
    mockLockAccount,
    mockUnlockAccount,
    mockGetAccountsAttempt
  };
};

test("test lockAccount", async () => {
  const { mockLockAccount } = mockUnlockLockAndGetAccountsAttempt();
  const store = createStore(cloneDeep({ ...initialState }));

  await store.dispatch(controlActions.lockAccount(changeAccountNumber));
  expect(mockLockAccount).toHaveBeenCalledWith(
    testWalletService,
    changeAccountNumber
  );

  mockLockAccount.mockClear();

  let catchedError;
  try {
    await store.dispatch(controlActions.lockAccount("unknown-account-number"));
  } catch (error) {
    catchedError = error;
  }
  expect(catchedError).toBe("Account not found");
  expect(mockLockAccount).not.toHaveBeenCalled();

  mockLockAccount.mockClear();
  try {
    await store.dispatch(controlActions.lockAccount(unencryptedAccount));
  } catch (error) {
    catchedError = error;
  }
  expect(catchedError).toBe("Account not encrypted");
  expect(mockLockAccount).not.toHaveBeenCalled();
});

test("test lockAccount - account mixer is running", async () => {
  const { mockLockAccount } = mockUnlockLockAndGetAccountsAttempt();
  const store = createStore(
    cloneDeep({
      ...initialState,
      grpc: { ...initialState.grpc, accountMixerRunning: true }
    })
  );

  await store.dispatch(controlActions.lockAccount(changeAccountNumber));
  expect(mockLockAccount).not.toHaveBeenCalled();
});

test("test checkAllAccountsEncrypted", async () => {
  let store = createStore(cloneDeep({ ...initialState }));

  let res = await store.dispatch(controlActions.checkAllAccountsEncrypted());
  expect(res).toBeFalsy();

  store = createStore(
    cloneDeep({
      ...initialState,
      grpc: { balances: testBalances.filter((b) => b.encrypted) }
    })
  );

  res = await store.dispatch(controlActions.checkAllAccountsEncrypted());
  expect(res).toBeTruthy();
});

test("test monitorLockableAccounts", async () => {
  const {
    addUnlockedAccount,
    mockLockAccount
  } = mockUnlockLockAndGetAccountsAttempt();

  jest.useFakeTimers();
  const store = createStore(cloneDeep({ ...initialState }));

  await store.dispatch(controlActions.monitorLockableAccounts());
  expect(store.getState().control.monitorLockableAccountsTimer).not.toBeNull();

  act(() => {
    advanceBy(31 * 1000);
    jest.advanceTimersByTime(31 * 1000);
  });

  expect(mockGetVSPTrackedTickets).toHaveBeenCalled();
  expect(mockSetNeedsVSPdProcessTickets).not.toHaveBeenCalled();
  expect(mockLockAccount).not.toHaveBeenCalled();
  expect(store.getState().control.lockAccountError).toBeNull();

  // there would be a lockable account (6-commitment account),
  // though there's a function running that depends on unlocked accounts.
  mockGetVSPTrackedTickets = vspActions.getVSPTrackedTickets = jest.fn(
    () => (dispatch) => {
      dispatch({
        trackedTickets: null,
        type: vspActions.GETVSPTRACKEDTICKETS_SUCCESS
      });
      Promise.resolve();
    }
  );

  await store.dispatch({ type: controlActions.UNLOCKANDEXECFN_ATTEMPT });

  mockGetVSPTrackedTickets.mockClear();
  mockLockAccount.mockClear();
  mockSetNeedsVSPdProcessTickets.mockClear();
  act(() => {
    advanceBy(31 * 1000);
    jest.advanceTimersByTime(31 * 1000);
  });
  expect(mockGetVSPTrackedTickets).not.toHaveBeenCalled();
  expect(mockSetNeedsVSPdProcessTickets).not.toHaveBeenCalled();
  expect(mockLockAccount).not.toHaveBeenCalled();
  expect(store.getState().control.lockAccountError).toBeNull();

  // end of the function
  await store.dispatch({ type: controlActions.UNLOCKANDEXECFN_SUCCESS });
  mockGetVSPTrackedTickets.mockClear();
  mockLockAccount.mockClear();
  mockSetNeedsVSPdProcessTickets.mockClear();
  act(() => {
    advanceBy(31 * 1000);
    jest.advanceTimersByTime(31 * 1000);
  });
  expect(mockGetVSPTrackedTickets).toHaveBeenCalled();
  expect(mockSetNeedsVSPdProcessTickets).not.toHaveBeenCalled();
  addUnlockedAccount(commitmentAccountNumber); // mock that commitmentAccountNumber has been unlocked
  await wait(() =>
    expect(mockLockAccount).toHaveBeenCalledWith(
      testWalletService,
      commitmentAccountNumber
    )
  );
  expect(store.getState().control.lockAccountError).toBeNull();

  // no account needs relock
  store.dispatch({
    type: vspActions.SET_CANDISABLEPROCESSMANAGED,
    value: true
  });
  mockGetVSPTrackedTickets.mockClear();
  mockLockAccount.mockClear();
  mockSetNeedsVSPdProcessTickets.mockClear();
  act(() => {
    advanceBy(31 * 1000);
    jest.advanceTimersByTime(31 * 1000);
  });
  await wait(() => expect(mockSetNeedsVSPdProcessTickets).toHaveBeenCalled());
  expect(mockGetVSPTrackedTickets).toHaveBeenCalled();
  expect(mockLockAccount).not.toHaveBeenCalled();
  expect(store.getState().control.lockAccountError).toBeNull();

  // stop monitoring Lockable Accounts
  await store.dispatch(controlActions.stopMonitorLockableAccounts());
  expect(store.getState().control.monitorLockableAccountsTimer).toBeNull();
  mockGetVSPTrackedTickets.mockClear();
  mockLockAccount.mockClear();
  mockSetNeedsVSPdProcessTickets.mockClear();
  act(() => {
    advanceBy(131 * 1000);
    jest.advanceTimersByTime(131 * 1000);
  });
  expect(mockGetVSPTrackedTickets).not.toHaveBeenCalled();
  expect(mockSetNeedsVSPdProcessTickets).not.toHaveBeenCalled();
  expect(mockLockAccount).not.toHaveBeenCalled();
});

test("test monitorLockableAccounts - lockAccount failed", async () => {
  const { addUnlockedAccount } = mockUnlockLockAndGetAccountsAttempt();

  const mockLockAccount = (wallet.lockAccount = jest.fn(() => {
    throw testError;
  }));
  mockGetVSPTrackedTickets = vspActions.getVSPTrackedTickets = jest.fn(
    () => (dispatch) => {
      dispatch({
        trackedTickets: null,
        type: vspActions.GETVSPTRACKEDTICKETS_SUCCESS
      });
      Promise.resolve();
    }
  );
  jest.useFakeTimers();
  const store = createStore(cloneDeep({ ...initialState }));

  await store.dispatch(controlActions.monitorLockableAccounts());

  act(() => {
    advanceBy(31 * 1000);
    jest.advanceTimersByTime(31 * 1000);
  });

  addUnlockedAccount(commitmentAccountNumber); // mock that commitmentAccountNumber has been unlocked

  await wait(() =>
    expect(mockLockAccount).toHaveBeenCalledWith(
      testWalletService,
      commitmentAccountNumber
    )
  );
  expect(store.getState().control.lockAccountError).toBe(testError);
});

test("test unlockAcctAndExecFn", async () => {
  const {
    mockLockAccount,
    mockUnlockAccount
  } = mockUnlockLockAndGetAccountsAttempt();

  const store = createStore(cloneDeep({ ...initialState }));
  store.dispatch(
    controlActions.unlockAcctAndExecFn(
      testPassphrase,
      [changeAccountNumber],
      mockCallbackFunction,
      true /* leave unlocked */
    )
  );
  expect(store.getState().control.unlockAndExecFnRunning).toBeTruthy();
  expect(mockUnlockAccount).toHaveBeenCalledWith(
    testWalletService,
    testPassphrase,
    changeAccountNumber
  );
  await wait(() =>
    expect(store.getState().control.unlockAndExecFnRunning).toBeFalsy()
  );
  expect(mockCallbackFunction).toHaveBeenCalledTimes(1);
  expect(mockUnlockAccount).toHaveBeenCalledTimes(1);
  expect(mockLockAccount).not.toHaveBeenCalled(); /* leaved unlocked */
});

test("test unlockAcctAndExecFn - unknown account", async () => {
  const {
    mockLockAccount,
    mockUnlockAccount
  } = mockUnlockLockAndGetAccountsAttempt();

  const store = createStore(cloneDeep({ ...initialState }));

  let catchedError;
  try {
    await store.dispatch(
      controlActions.unlockAcctAndExecFn(
        testPassphrase,
        ["unknown-account-number", changeAccountNumber],
        mockCallbackFunction,
        true /* leave unlocked */
      )
    );
  } catch (error) {
    catchedError = error;
  }

  expect(catchedError).toBe("Account not found");
  expect(store.getState().control.unlockAndExecFnRunning).toBeFalsy();
  expect(mockUnlockAccount).toHaveBeenNthCalledWith(
    1,
    testWalletService,
    testPassphrase,
    changeAccountNumber
  );
  expect(mockCallbackFunction).not.toHaveBeenCalled();
  // need to relock change account
  expect(mockLockAccount).toHaveBeenCalledWith(
    testWalletService,
    changeAccountNumber
  );
});

test("test unlockAcctAndExecFn - unencrypted account", async () => {
  const {
    mockLockAccount,
    mockUnlockAccount
  } = mockUnlockLockAndGetAccountsAttempt();

  const store = createStore(cloneDeep({ ...initialState }));

  let catchedError;
  try {
    await store.dispatch(
      controlActions.unlockAcctAndExecFn(
        testPassphrase,
        [unencryptedAccount, changeAccountNumber],
        mockCallbackFunction,
        true /* leave unlocked */
      )
    );
  } catch (error) {
    catchedError = error;
  }

  expect(catchedError).toBe("Account not encrypted");
  expect(store.getState().control.unlockAndExecFnRunning).toBeFalsy();
  expect(mockUnlockAccount).toHaveBeenCalledWith(
    testWalletService,
    testPassphrase,
    changeAccountNumber
  );
  expect(mockCallbackFunction).not.toHaveBeenCalled();
  // need to relock change account
  expect(mockLockAccount).toHaveBeenCalledWith(
    testWalletService,
    changeAccountNumber
  );
});

test("test unlockAcctAndExecFn - callback function failed, lock after, multi accounts", async () => {
  const {
    mockLockAccount,
    mockUnlockAccount,
    mockGetAccountsAttempt
  } = mockUnlockLockAndGetAccountsAttempt();

  mockCallbackFunction = jest.fn(
    () => new Promise((_, reject) => setTimeout(reject(testError), 10))
  );
  const store = createStore(cloneDeep({ ...initialState }));
  let catchedError;
  try {
    await store.dispatch(
      controlActions.unlockAcctAndExecFn(
        testPassphrase,
        [changeAccountNumber, mixedAccountNumber],
        mockCallbackFunction,
        false /* lock after */
      )
    );
  } catch (error) {
    catchedError = error;
  }

  expect(mockUnlockAccount).toHaveBeenNthCalledWith(
    1,
    testWalletService,
    testPassphrase,
    changeAccountNumber
  );
  expect(mockUnlockAccount).toHaveBeenNthCalledWith(
    2,
    testWalletService,
    testPassphrase,
    mixedAccountNumber
  );
  expect(mockCallbackFunction).toHaveBeenCalledTimes(1);

  expect(mockGetAccountsAttempt).toHaveBeenCalledWith(true);
  expect(mockLockAccount).toHaveBeenNthCalledWith(
    1,
    testWalletService,
    changeAccountNumber
  );
  expect(mockLockAccount).toHaveBeenNthCalledWith(
    2,
    testWalletService,
    mixedAccountNumber
  );
  await wait(() =>
    expect(store.getState().control.unlockAndExecFnRunning).toBeFalsy()
  );

  expect(catchedError).toBe(testError);
});

test("test unlockAcctAndExecFn - callback function failed, leave unlock", async () => {
  const {
    mockLockAccount,
    mockUnlockAccount
  } = mockUnlockLockAndGetAccountsAttempt();

  mockCallbackFunction = jest.fn(
    () => new Promise((_, reject) => setTimeout(reject(testError), 10))
  );
  const store = createStore(cloneDeep({ ...initialState }));
  let catchedError;
  try {
    await store.dispatch(
      controlActions.unlockAcctAndExecFn(
        testPassphrase,
        [changeAccountNumber],
        mockCallbackFunction,
        true /* leave unloced */
      )
    );
  } catch (error) {
    catchedError = error;
  }

  expect(mockUnlockAccount).toHaveBeenNthCalledWith(
    1,
    testWalletService,
    testPassphrase,
    changeAccountNumber
  );
  expect(mockCallbackFunction).toHaveBeenCalledTimes(1);
  expect(mockLockAccount).not.toHaveBeenCalled();
  expect(store.getState().control.unlockAndExecFnRunning).toBeFalsy();

  expect(catchedError).toBe(testError);
});

test("test unlockAcctAndExecFn - unlock and relock failed", async () => {
  const unlockedAccounts = [];
  const mockUnlockAccount = (wallet.unlockAccount = jest.fn(
    (_, passphrase, accountNumber) => {
      if (accountNumber === defaultAccountNumber) {
        throw testError;
      }
      if (unlockedAccounts.includes(accountNumber)) {
        console.error(`${accountNumber} is already unlocked (${passphrase})`);
      } else {
        unlockedAccounts.push(accountNumber);
      }
    }
  ));
  clientActions.getAccountsAttempt = jest.fn(() => async (dispatch) => {
    const updatedBalances = testBalances.map((b) =>
      unlockedAccounts.includes(b.accountNumber) ? { ...b, unlocked: true } : b
    );
    await dispatch({
      balances: updatedBalances,
      type: cla.GETBALANCE_SUCCESS
    });
  });
  const mockLockAccount = (wallet.lockAccount = jest.fn(() => {
    throw testError;
  }));
  const store = createStore(cloneDeep({ ...initialState }));
  let catchedError;
  try {
    await store.dispatch(
      controlActions.unlockAcctAndExecFn(
        testPassphrase,
        [changeAccountNumber, defaultAccountNumber],
        mockCallbackFunction,
        false
      )
    );
  } catch (error) {
    catchedError = error;
  }

  expect(mockUnlockAccount).toHaveBeenNthCalledWith(
    1,
    testWalletService,
    testPassphrase,
    changeAccountNumber
  );
  expect(mockUnlockAccount).toHaveBeenNthCalledWith(
    2,
    testWalletService,
    testPassphrase,
    defaultAccountNumber
  );
  expect(mockCallbackFunction).not.toHaveBeenCalled();
  expect(mockLockAccount).toHaveBeenCalledWith(
    testWalletService,
    changeAccountNumber
  );
  expect(store.getState().control.unlockAndExecFnRunning).toBeFalsy();
  expect(store.getState().control.lockAccountError).toBe(testError);

  expect(catchedError).toBe(testError);
});

test("test unlockAcctAndExecFn - unlock failed", async () => {
  const { mockLockAccount } = mockUnlockLockAndGetAccountsAttempt();
  const mockUnlockAccount = (wallet.unlockAccount = jest.fn(() => {
    throw testError + "unlock";
  }));
  const store = createStore(cloneDeep({ ...initialState }));
  let catchedError;
  try {
    await store.dispatch(
      controlActions.unlockAcctAndExecFn(
        testPassphrase,
        [changeAccountNumber],
        mockCallbackFunction,
        false
      )
    );
  } catch (error) {
    catchedError = error;
  }

  expect(mockUnlockAccount).toHaveBeenNthCalledWith(
    1,
    testWalletService,
    testPassphrase,
    changeAccountNumber
  );
  expect(mockCallbackFunction).not.toHaveBeenCalled();
  expect(store.getState().control.unlockAndExecFnRunning).toBeFalsy();
  expect(mockLockAccount).not.toHaveBeenCalled();

  expect(catchedError).toBe(testError + "unlock");
});

test("test unlockAcctAndExecFn - does not unlock change account if account mixer is running", async () => {
  const {
    mockLockAccount,
    mockUnlockAccount
  } = mockUnlockLockAndGetAccountsAttempt();

  const store = createStore(
    cloneDeep({
      ...initialState,
      grpc: { ...initialState.grpc, accountMixerRunning: true }
    })
  );
  store.dispatch(
    controlActions.unlockAcctAndExecFn(
      testPassphrase,
      [changeAccountNumber],
      mockCallbackFunction,
      false
    )
  );
  expect(store.getState().control.unlockAndExecFnRunning).toBeTruthy();
  expect(mockUnlockAccount).toHaveBeenCalledWith(
    testWalletService,
    testPassphrase,
    changeAccountNumber
  );
  await wait(() =>
    expect(store.getState().control.unlockAndExecFnRunning).toBeFalsy()
  );
  expect(mockCallbackFunction).toHaveBeenCalledTimes(1);
  expect(mockUnlockAccount).toHaveBeenCalledTimes(1);
  expect(mockLockAccount).not.toHaveBeenCalled();
});

test("test unlockAcctAndExecFn - relock failed - get accounts failed", async () => {
  const { mockUnlockAccount } = mockUnlockLockAndGetAccountsAttempt();
  clientActions.getAccountsAttempt = jest.fn(() => () => {
    throw testError;
  });
  const mockLockAccount = (wallet.lockAccount = jest.fn(() => {
    throw testError;
  }));
  const store = createStore(cloneDeep({ ...initialState }));
  let catchedError;
  try {
    await store.dispatch(
      controlActions.unlockAcctAndExecFn(
        testPassphrase,
        [changeAccountNumber],
        mockCallbackFunction,
        false
      )
    );
  } catch (error) {
    catchedError = error;
  }

  expect(mockUnlockAccount).toHaveBeenNthCalledWith(
    1,
    testWalletService,
    testPassphrase,
    changeAccountNumber
  );
  expect(mockCallbackFunction).toHaveBeenCalledTimes(1);
  expect(mockLockAccount).toHaveBeenCalledWith(
    testWalletService,
    changeAccountNumber
  );
  expect(store.getState().control.unlockAndExecFnRunning).toBeFalsy();
  expect(store.getState().control.lockAccountError).toBe(testError);

  expect(catchedError).toBe(testError);
});

test("test purchase tickets - in a private wallet, mixer is not running", async () => {
  const {
    mockLockAccount,
    mockUnlockAccount
  } = mockUnlockLockAndGetAccountsAttempt();

  const store = createStore(
    cloneDeep({
      ...initialState,
      vsp: { ...initialState.vsp, trackedTickets: [] }
    })
  );
  const testNumTickets = 1;
  await store.dispatch(
    controlActions.purchaseTicketsAttempt(
      testPassphrase,
      mixedAccount,
      testNumTickets,
      testVSP
    )
  );

  expect(mockUnlockAccount).toHaveBeenNthCalledWith(
    1,
    testWalletService,
    testPassphrase,
    mixedAccountNumber
  );
  expect(mockUnlockAccount).toHaveBeenNthCalledWith(
    2,
    testWalletService,
    testPassphrase,
    defaultAccountNumber
  );

  expect(mockPurchaseTickets).toHaveBeenCalledWith(
    testWalletService,
    mixedAccount,
    testNumTickets,
    true,
    testVSP,
    expectedCsppReq
  );
  expect(mockUpdateUsedVSPs).toHaveBeenCalledWith(testVSP);
  expect(mockGetVSPTrackedTickets).toHaveBeenCalled();

  expect(mockLockAccount).toHaveBeenNthCalledWith(
    1,
    testWalletService,
    defaultAccountNumber
  );
  await wait(() =>
    expect(mockLockAccount).toHaveBeenNthCalledWith(
      2,
      testWalletService,
      mixedAccountNumber
    )
  );

  // purchased less then expected
  expect(store.getState().snackbar.messages[0].values.numTickets).toBe(0);
  expect(store.getState().snackbar.messages[0].values.numAttempted).toBe(
    testNumTickets
  );
  expect(store.getState().control.purchaseTicketsError).toBeNull();
});

test("test purchase tickets - failed to unlock account", async () => {
  const {
    mockLockAccount,
    addUnlockedAccount
  } = mockUnlockLockAndGetAccountsAttempt();
  addUnlockedAccount(changeAccountNumber);

  const events = {};
  mockMixerStreamer = {
    cancel: mockMixerStreamerCancel,
    on: (eventName, fn) => {
      events[eventName] = fn;
    }
  };
  const mockUnlockAccount = (wallet.unlockAccount = jest.fn(() => {
    throw testError + " invalid passphrase";
  }));
  const store = createStore(
    cloneDeep({
      ...initialState,
      vsp: { ...initialState.vsp, trackedTickets: [] },
      grpc: {
        ...initialState.grpc,
        accountMixerRunning: true,
        mixerStreamer: mockMixerStreamer
      }
    })
  );

  const testNumTickets = 1;
  await store.dispatch(
    controlActions.purchaseTicketsAttempt(
      testPassphrase,
      mixedAccount,
      testNumTickets,
      testVSP
    )
  );

  await wait(() =>
    expect(mockLockAccount).toHaveBeenNthCalledWith(
      1,
      testWalletService,
      changeAccountNumber
    )
  );

  expect(mockUnlockAccount).toHaveBeenNthCalledWith(
    1,
    testWalletService,
    testPassphrase,
    mixedAccountNumber
  );
  expect(mockUnlockAccount).toHaveBeenNthCalledWith(
    2,
    testWalletService,
    testPassphrase,
    defaultAccountNumber
  );

  expect(mockPurchaseTickets).not.toHaveBeenCalled();
  expect(mockUpdateUsedVSPs).not.toHaveBeenCalled();
  expect(mockGetVSPTrackedTickets).not.toHaveBeenCalled();

  // can't restart mixer, if invalid passphrase has been given
  expect(mockRunAccountMixerRequest).not.toHaveBeenCalled();
});

test("test purchase tickets - in a private wallet, mixer is running", async () => {
  const {
    addUnlockedAccount,
    mockLockAccount,
    mockUnlockAccount
  } = mockUnlockLockAndGetAccountsAttempt();
  addUnlockedAccount(changeAccountNumber);

  const events = {};
  mockMixerStreamer = {
    cancel: mockMixerStreamerCancel,
    on: (eventName, fn) => {
      events[eventName] = fn;
    }
  };
  const store = createStore(
    cloneDeep({
      ...initialState,
      vsp: { ...initialState.vsp, trackedTickets: [] },
      grpc: {
        ...initialState.grpc,
        accountMixerRunning: true,
        mixerStreamer: mockMixerStreamer
      }
    })
  );
  const testNumTickets = 1;
  await store.dispatch(
    controlActions.purchaseTicketsAttempt(
      testPassphrase,
      mixedAccount,
      testNumTickets,
      testVSP
    )
  );

  // mixer has been stoped
  expect(mockMixerStreamerCancel).toHaveBeenCalled();
  await wait(() =>
    expect(mockLockAccount).toHaveBeenNthCalledWith(
      1,
      testWalletService,
      changeAccountNumber
    )
  );

  expect(mockUnlockAccount).toHaveBeenNthCalledWith(
    1,
    testWalletService,
    testPassphrase,
    mixedAccountNumber
  );
  expect(mockUnlockAccount).toHaveBeenNthCalledWith(
    2,
    testWalletService,
    testPassphrase,
    defaultAccountNumber
  );

  expect(mockPurchaseTickets).toHaveBeenCalledWith(
    testWalletService,
    mixedAccount,
    testNumTickets,
    true,
    testVSP,
    expectedCsppReq
  );
  expect(mockUpdateUsedVSPs).toHaveBeenCalledWith(testVSP);
  expect(mockGetVSPTrackedTickets).toHaveBeenCalled();

  await wait(() =>
    expect(mockLockAccount).toHaveBeenNthCalledWith(
      2,
      testWalletService,
      defaultAccountNumber
    )
  );
  await wait(() =>
    expect(mockLockAccount).toHaveBeenNthCalledWith(
      3,
      testWalletService,
      mixedAccountNumber
    )
  );

  // purchased less then expected
  expect(store.getState().snackbar.messages[0].values.numTickets).toBe(0);
  expect(store.getState().snackbar.messages[0].values.numAttempted).toBe(
    testNumTickets
  );
  expect(store.getState().control.purchaseTicketsError).toBeNull();

  // mixer has been restarted
  expect(mockRunAccountMixerRequest).toHaveBeenCalledWith(
    testAccountMixerService,
    {
      mixedAccount: mixedAccountNumber,
      mixedAccountBranch: testMixedAccountBranch,
      changeAccount: changeAccountNumber,
      csppServer: `${testCsppServer}:${testCsppPort}`
    }
  );
  expect(mockUnlockAccount).toHaveBeenCalledWith(
    testWalletService,
    testPassphrase,
    changeAccountNumber
  );
  await wait(() =>
    expect(store.getState().grpc.accountMixerRunning).toBeTruthy()
  );
});

test("test purchase tickets - in a non private wallet", async () => {
  const {
    mockLockAccount,
    mockUnlockAccount
  } = mockUnlockLockAndGetAccountsAttempt();

  const store = createStore(
    cloneDeep({
      ...initialState,
      vsp: { ...initialState.vsp, trackedTickets: [] }
    })
  );
  const testNumTickets = 1;
  await store.dispatch(
    controlActions.purchaseTicketsAttempt(
      testPassphrase,
      defaultAccount,
      testNumTickets,
      testVSP
    )
  );

  expect(mockUnlockAccount).toHaveBeenCalledWith(
    testWalletService,
    testPassphrase,
    defaultAccountNumber
  );

  await wait(() =>
    expect(mockLockAccount).toHaveBeenCalledWith(
      testWalletService,
      defaultAccountNumber
    )
  );

  expect(mockPurchaseTickets).toHaveBeenCalledWith(
    testWalletService,
    defaultAccount,
    testNumTickets,
    true,
    testVSP,
    expectedCsppReq
  );
});

test("test purchase tickets - in a watching wallet", async () => {
  const {
    mockLockAccount,
    mockUnlockAccount
  } = mockUnlockLockAndGetAccountsAttempt();

  const store = createStore(
    cloneDeep({
      ...initialState,
      vsp: { ...initialState.vsp, trackedTickets: [] },
      walletLoader: { ...initialState.walletLoader, isWatchingOnly: true }
    })
  );
  const testNumTickets = 2;
  await store.dispatch(
    controlActions.purchaseTicketsAttempt(
      testPassphrase,
      mixedAccount,
      testNumTickets,
      testVSP
    )
  );

  expect(mockPurchaseTickets).toHaveBeenCalledWith(
    testWalletService,
    mixedAccount,
    testNumTickets,
    false, // !!!
    testVSP,
    expectedCsppReq
  );
  expect(mockUpdateUsedVSPs).not.toHaveBeenCalled();
  expect(mockGetVSPTrackedTickets).toHaveBeenCalled();

  expect(mockUnlockAccount).toHaveBeenNthCalledWith(
    1,
    testWalletService,
    testPassphrase,
    mixedAccountNumber
  );
  expect(mockUnlockAccount).toHaveBeenNthCalledWith(
    2,
    testWalletService,
    testPassphrase,
    defaultAccountNumber
  );

  // Since we are currently using the default account for the ticket's
  // voting address we also need to unlock that account so communication
  // with the VSP may occur.
  await wait(() =>
    expect(mockLockAccount).toHaveBeenNthCalledWith(
      1,
      testWalletService,
      defaultAccountNumber
    )
  );
  expect(mockLockAccount).toHaveBeenNthCalledWith(
    2,
    testWalletService,
    mixedAccountNumber
  );
});

test("test purchase tickets - bought expected number of tickets", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      vsp: { ...initialState.vsp, trackedTickets: [] }
    })
  );
  const testNumTickets = 2;
  const testTicketHashes = ["text-ticket-hash1", "test-ticket-hash2"];
  mockPurchaseTickets = wallet.purchaseTicketsV3 = jest.fn(() =>
    Promise.resolve({ ticketHashes: testTicketHashes })
  );
  await store.dispatch(
    controlActions.purchaseTicketsAttempt(
      testPassphrase,
      mixedAccount,
      testNumTickets,
      testVSP
    )
  );
  expect(mockPurchaseTickets).toHaveBeenCalledWith(
    testWalletService,
    mixedAccount,
    testNumTickets,
    true,
    testVSP,
    expectedCsppReq
  );
  expect(mockUpdateUsedVSPs).toHaveBeenCalledWith(testVSP);
  expect(mockGetVSPTrackedTickets).toHaveBeenCalled();

  // purchased less then expected
  expect(store.getState().snackbar.messages[0].values.numTickets).toBe(2);
  expect(store.getState().snackbar.messages[0].values.numAttempted).toBe(
    undefined
  );
  expect(store.getState().control.purchaseTicketsError).toBeNull();
});

test("test purchase tickets - failed ", async () => {
  const {
    addUnlockedAccount,
    mockLockAccount,
    mockUnlockAccount
  } = mockUnlockLockAndGetAccountsAttempt();
  addUnlockedAccount(changeAccountNumber);

  const events = {};
  mockMixerStreamer = {
    cancel: mockMixerStreamerCancel,
    on: (eventName, fn) => {
      events[eventName] = fn;
    }
  };

  const store = createStore(
    cloneDeep({
      ...initialState,
      vsp: { ...initialState.vsp, trackedTickets: [] },
      grpc: {
        ...initialState.grpc,
        accountMixerRunning: true,
        mixerStreamer: mockMixerStreamer
      }
    })
  );
  const testNumTickets = 1;
  mockPurchaseTickets = wallet.purchaseTicketsV3 = jest.fn(() =>
    Promise.reject(testError)
  );
  await store.dispatch(
    controlActions.purchaseTicketsAttempt(
      testPassphrase,
      mixedAccount,
      testNumTickets,
      testVSP
    )
  );

  // mixer has been stoped
  expect(mockMixerStreamerCancel).toHaveBeenCalled();
  await wait(() =>
    expect(mockLockAccount).toHaveBeenNthCalledWith(
      1,
      testWalletService,
      changeAccountNumber
    )
  );

  expect(mockPurchaseTickets).toHaveBeenCalledWith(
    testWalletService,
    mixedAccount,
    testNumTickets,
    true,
    testVSP,
    expectedCsppReq
  );
  expect(mockUpdateUsedVSPs).not.toHaveBeenCalled();
  expect(mockGetVSPTrackedTickets).not.toHaveBeenCalled();

  expect(store.getState().control.purchaseTicketsError).toBe(testError);

  // mixer has been restarted
  expect(mockRunAccountMixerRequest).toHaveBeenCalledWith(
    testAccountMixerService,
    {
      mixedAccount: mixedAccountNumber,
      mixedAccountBranch: testMixedAccountBranch,
      changeAccount: changeAccountNumber,
      csppServer: `${testCsppServer}:${testCsppPort}`
    }
  );
  expect(mockUnlockAccount).toHaveBeenCalledWith(
    testWalletService,
    testPassphrase,
    changeAccountNumber
  );
  await wait(() =>
    expect(store.getState().grpc.accountMixerRunning).toBeTruthy()
  );
});

test("test purchase tickets - failed with insufficient balance", async () => {
  const {
    addUnlockedAccount,
    mockLockAccount,
    mockUnlockAccount
  } = mockUnlockLockAndGetAccountsAttempt();
  addUnlockedAccount(changeAccountNumber);

  const events = {};
  mockMixerStreamer = {
    cancel: mockMixerStreamerCancel,
    on: (eventName, fn) => {
      events[eventName] = fn;
    }
  };

  const store = createStore(
    cloneDeep({
      ...initialState,
      vsp: { ...initialState.vsp, trackedTickets: [] },
      grpc: {
        ...initialState.grpc,
        accountMixerRunning: true,
        mixerStreamer: mockMixerStreamer
      }
    })
  );
  const testNumTickets = 1;
  mockPurchaseTickets = wallet.purchaseTicketsV3 = jest.fn(() =>
    Promise.reject(testError + "insufficient balance")
  );
  await store.dispatch(
    controlActions.purchaseTicketsAttempt(
      testPassphrase,
      { ...mixedAccount, spendable: 16309912196 },
      testNumTickets,
      testVSP
    )
  );

  // mixer has been stoped
  expect(mockMixerStreamerCancel).toHaveBeenCalled();
  await wait(() =>
    expect(mockLockAccount).toHaveBeenNthCalledWith(
      1,
      testWalletService,
      changeAccountNumber
    )
  );

  expect(mockPurchaseTickets).toHaveBeenCalledWith(
    testWalletService,
    { ...mixedAccount, spendable: 16309912196 },
    testNumTickets,
    true,
    testVSP,
    expectedCsppReq
  );

  expect(mockListUnspentOutputs).toHaveBeenCalledWith(mixedAccountNumber);
  expect(store.getState().control.purchaseTicketsError).toMatch(
    /Not enough utxo./
  );

  expect(mockUnlockAccount).toHaveBeenNthCalledWith(
    1,
    testWalletService,
    testPassphrase,
    mixedAccountNumber
  );
  expect(mockUnlockAccount).toHaveBeenNthCalledWith(
    2,
    testWalletService,
    testPassphrase,
    defaultAccountNumber
  );

  // Since we are currently using the default account for the ticket's
  // voting address we also need to unlock that account so communication
  // with the VSP may occur.
  await wait(() =>
    expect(mockLockAccount).toHaveBeenNthCalledWith(
      2,
      testWalletService,
      defaultAccountNumber
    )
  );
  expect(mockLockAccount).toHaveBeenNthCalledWith(
    3,
    testWalletService,
    mixedAccountNumber
  );

  // mixer has been restarted
  expect(mockRunAccountMixerRequest).toHaveBeenCalledWith(
    testAccountMixerService,
    {
      mixedAccount: mixedAccountNumber,
      mixedAccountBranch: testMixedAccountBranch,
      changeAccount: changeAccountNumber,
      csppServer: `${testCsppServer}:${testCsppPort}`
    }
  );
  expect(mockUnlockAccount).toHaveBeenCalledWith(
    testWalletService,
    testPassphrase,
    changeAccountNumber
  );
  await wait(() =>
    expect(store.getState().grpc.accountMixerRunning).toBeTruthy()
  );
});

test("test start and stop ticket autobuyer start", async () => {
  const { mockLockAccount } = mockUnlockLockAndGetAccountsAttempt();

  const cbs = {};
  const mockTicketBuyerCancel = jest.fn(() => {});
  const ticketBuyer = {
    on: (event, cb) => {
      cbs[event] = cb;
    },
    cancel: mockTicketBuyerCancel
  };
  mockStartTicketAutoBuyer = wallet.startTicketAutoBuyer = jest.fn(() =>
    Promise.resolve(ticketBuyer)
  );
  const store = createStore(cloneDeep({ ...initialState }));
  store.dispatch(
    controlActions.startTicketBuyerAttempt(
      testPassphrase,
      mixedAccount,
      testBalanceToMaintain,
      testVSP
    )
  );
  await wait(() => expect(mockUpdateUsedVSPs).toHaveBeenCalledWith(testVSP));
  expect(mockStartTicketAutoBuyer).toHaveBeenCalledWith(
    testTicketBuyerService,
    {
      mixedAccount: mixedAccountNumber,
      mixedAcctBranch: testMixedAccountBranch,
      changeAccount: changeAccountNumber,
      csppServer: testCsppServer,
      csppPort: testCsppPort,
      balanceToMaintain: testBalanceToMaintain,
      accountNum: mixedAccountNumber,
      pubkey: testVSP.pubkey,
      host: testVSP.host
    }
  );
  cbs.data("test-data");
  expect(mockSetNeedsVSPdProcessTickets).toHaveBeenCalledWith(true);
  expect(store.getState().vsp.ticketBuyerCall).toBe(ticketBuyer);
  expect(store.getState().vsp.vsp).toBe(testVSP);
  expect(store.getState().vsp.balanceToMaintain).toBe(testBalanceToMaintain);
  expect(store.getState().vsp.account).toBe(mixedAccountName);
  expect(store.getState().vsp.ticketAutoBuyerRunning).toBeTruthy();

  store.dispatch(controlActions.ticketBuyerCancel());
  cbs.error("Cancelled");
  cbs.end();
  await wait(() =>
    expect(store.getState().vsp.ticketAutoBuyerRunning).toBeFalsy()
  );

  await wait(() =>
    expect(mockLockAccount).toHaveBeenNthCalledWith(
      1,
      testWalletService,
      changeAccountNumber
    )
  );
  expect(mockLockAccount).toHaveBeenNthCalledWith(
    2,
    testWalletService,
    mixedAccountNumber
  );
});

test("test start ticket autobuyer - failed", async () => {
  const { mockLockAccount } = mockUnlockLockAndGetAccountsAttempt();

  mockStartTicketAutoBuyer = wallet.startTicketAutoBuyer = jest.fn(() =>
    Promise.reject(testError)
  );
  const store = createStore(cloneDeep({ ...initialState }));
  store.dispatch(
    controlActions.startTicketBuyerAttempt(
      testPassphrase,
      mixedAccount,
      testBalanceToMaintain,
      testVSP
    )
  );
  expect(mockUpdateUsedVSPs).not.toHaveBeenCalled();
  expect(mockSetNeedsVSPdProcessTickets).not.toHaveBeenCalled();

  await wait(() =>
    expect(store.getState().vsp.ticketAutoBuyerRunning).toBeFalsy()
  );

  await wait(() =>
    expect(mockLockAccount).toHaveBeenNthCalledWith(
      1,
      testWalletService,
      changeAccountNumber
    )
  );
  expect(mockLockAccount).toHaveBeenNthCalledWith(
    2,
    testWalletService,
    mixedAccountNumber
  );
});

test("test start ticket autobuyer in a non-private wallet - receive unknown error", async () => {
  const { mockLockAccount } = mockUnlockLockAndGetAccountsAttempt();

  const cbs = {};
  const mockTicketBuyerCancel = jest.fn(() => {});
  const ticketBuyer = {
    on: (event, cb) => {
      cbs[event] = cb;
    },
    cancel: mockTicketBuyerCancel
  };
  mockStartTicketAutoBuyer = wallet.startTicketAutoBuyer = jest.fn(() =>
    Promise.resolve(ticketBuyer)
  );

  const store = createStore(
    cloneDeep({
      ...initialState,
      walletLoader: {
        ...initialState.walletLoader,
        mixedAccount: null,
        changeAccount: null,
        csppServer: null,
        csppPort: null,
        mixedAccountBranch: null
      }
    })
  );

  store.dispatch(
    controlActions.startTicketBuyerAttempt(
      testPassphrase,
      defaultAccount,
      testBalanceToMaintain,
      testVSP
    )
  );

  await wait(() =>
    expect(mockStartTicketAutoBuyer).toHaveBeenCalledWith(
      testTicketBuyerService,
      {
        mixedAccount: null,
        mixedAcctBranch: null,
        changeAccount: null,
        csppServer: null,
        csppPort: null,
        balanceToMaintain: testBalanceToMaintain,
        accountNum: defaultAccountNumber,
        pubkey: testVSP.pubkey,
        host: testVSP.host
      }
    )
  );
  expect(mockUpdateUsedVSPs).toHaveBeenCalledWith(testVSP);

  store.dispatch(controlActions.ticketBuyerCancel());
  cbs.error(testError);
  await wait(() =>
    expect(store.getState().vsp.ticketAutoBuyerRunning).toBeFalsy()
  );

  await wait(() =>
    expect(mockLockAccount).toHaveBeenCalledWith(
      testWalletService,
      defaultAccountNumber
    )
  );
});

test("test signMessageAttempt", async () => {
  const {
    mockLockAccount,
    mockUnlockAccount
  } = mockUnlockLockAndGetAccountsAttempt();

  const store = createStore(cloneDeep(initialState));
  await store.dispatch(
    controlActions.signMessageAttempt(testAddress, testMessage, testPassphrase)
  );

  expect(mockValidateAddress).toHaveBeenCalledWith(
    testWalletService,
    testAddress
  );

  expect(mockSignMessage).toHaveBeenCalledWith(
    testWalletService,
    testAddress,
    testMessage
  );

  expect(mockUnlockAccount).toHaveBeenCalledWith(
    testWalletService,
    testPassphrase,
    defaultAccountNumber
  );

  expect(store.getState().grpc.getSignMessageSignature).toBe(
    "IBkHEpGrzmwUIgl4BVSxgxMbRR2ksKUg1rqTEBOnv8fIMacjUMSg0uRQd8qgp1xLsvR21212W8lgadA7O8h++FY="
  );
  expect(store.getState().grpc.getSignMessageError).toBeNull();
  await wait(() =>
    expect(mockLockAccount).toHaveBeenCalledWith(
      testWalletService,
      defaultAccountNumber
    )
  );
});

test("test signMessageAttempt - validateAddress failed", async () => {
  mockValidateAddress = wallet.validateAddress = jest.fn(() => {
    throw testError;
  });
  const {
    mockLockAccount,
    mockUnlockAccount
  } = mockUnlockLockAndGetAccountsAttempt();

  const store = createStore(cloneDeep(initialState));
  await store.dispatch(
    controlActions.signMessageAttempt(testAddress, testMessage, testPassphrase)
  );

  expect(mockValidateAddress).toHaveBeenCalledWith(
    testWalletService,
    testAddress
  );

  expect(mockSignMessage).not.toHaveBeenCalled();

  expect(mockUnlockAccount).not.toHaveBeenCalled();

  expect(store.getState().grpc.getSignMessageSignature).toBeNull();
  expect(store.getState().grpc.getSignMessageError).toBe(testError);

  expect(mockLockAccount).not.toHaveBeenCalled();
});

test("test signMessageAttempt - signMessage failed", async () => {
  const {
    mockLockAccount,
    mockUnlockAccount
  } = mockUnlockLockAndGetAccountsAttempt();

  mockSignMessage = wallet.signMessage = jest.fn(() => {
    throw testError;
  });
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(
    controlActions.signMessageAttempt(testAddress, testMessage, testPassphrase)
  );

  expect(mockValidateAddress).toHaveBeenCalledWith(
    testWalletService,
    testAddress
  );

  expect(mockSignMessage).toHaveBeenCalledWith(
    testWalletService,
    testAddress,
    testMessage
  );

  expect(mockUnlockAccount).toHaveBeenCalledWith(
    testWalletService,
    testPassphrase,
    defaultAccountNumber
  );

  expect(store.getState().grpc.getSignMessageSignature).toBeNull();
  expect(store.getState().grpc.getSignMessageError).toBe(testError);

  await wait(() =>
    expect(mockLockAccount).toHaveBeenCalledWith(
      testWalletService,
      defaultAccountNumber
    )
  );
});
