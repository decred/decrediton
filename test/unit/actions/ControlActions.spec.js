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
  ticketBuyerAccountName,
  mockUnlockLockAndGetAccountsAttempt,
  selectedAccountNumberForTicketPurchase,
  selectedAccountForTicketPurchaseName
} from "./accountMocks.js";
import { MainNetParams, MAINNET, TESTNET } from "constants";
import {
  ERR_INVALID_ADDR_NETWORKPREFIX,
  ERR_INVALID_MASTERPUB_CHECKSUM,
  ERR_INVALID_MASTER_PUB_KEY
} from "../../../app/helpers/addresses";
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
const testDecodeMessageService = "test-decodeMessageService";
const testRawTx = "test-rawtx";
const testGetNextAddressResponse = {
  address: "test-address",
  publicKey: "publickey",
  accountNumber: 0
};
const testNewAccountName = "new-account-name";
const testRenameAccountResponse = "rename-account-response";
const testBeginHeight = 10;
const testBeginHash = "test-begin-hash";
const testSignedSignature = {
  transaction:
    "0100000001158f221fc00e28e5b51a474b95136d5fe981a48127a0f5d0b36e736cf5a99e780500000000ffffffff021e150a3a0000000000001976a91444c49f36d73d1f74a79c658b0164cc9c4a7d515d88ac00e1f5050000000000001976a914acc06227cc030c3ac272bcb4619c884b48cea68988ac000000000000000001000000400000000000000000ffffffff6b483045022100b17ffe4b00a0527831b7a51db35c82832d2b2bdd6a75c941d7c558dd48601f30022033d55c79365bcf2af2c1a2cc5b77874ef6415cb4fe666cf2ae332058e2a0b81a01210301484a2d3a34bdb100791632756af68c9505e2e035a289963ef1320cc441554e",
  unsignedInputIndexes: []
};
const testPublishTransactionResponse = {
  transactionHash:
    "865628391fc121d1bd8e7f4542d7f12886e4a1a69216db168864c77359e89662"
};
const testScript = [
  118,
  169,
  20,
  40,
  47,
  141,
  68,
  49,
  252,
  243,
  127,
  23,
  24,
  82,
  210,
  183,
  200,
  29,
  46,
  125,
  230,
  190,
  22,
  136,
  172
];
const testChangeScriptByAccount = {
  [defaultAccountNumber]: testScript
};
const decodedTransactionResponse = {
  outputs: [
    {
      script: [118]
    },
    {
      version: 0,
      script: testScript
    }
  ]
};
const testConstructTxResponse = {
  unsignedTransaction:
    "0100000001158f221fc00e28e5b51a474b95136d5fe981a48127a0f5d0b36e736cf5a99e781600000000ffffffff03b6511e2e0000000000001976a9140f3ef12d1b4d33e578a461f611964547dc4ccab188ac00c2eb0b0000000000001976a91486589ce5cad0538d95725ca5b8122ca437b3987688ac00e1f5050000000000001976a91486589ce5cad0538d95725ca5b8122ca437b3987688ac000000000000000001000000400000000000000000ffffffff00",
  changeIndex: 0,
  totalAmount: 300000000
};

const testGapLimit = "test-gap-limit";
const testDiscoverUsageResponse = "test-discoverUsageResponse";
const testMainnetAddress = "DsdyVKiVuS6hpaaTtV2tBq1CqUK9ya38kwK";
const testTestnetAddress = "TsWoR2B5QhqBas1pR4YmptEKcKBJoxpTBmB";
const testMessageVerificationService = "test-messageVerificationService";
const testGetVerifyMessageResponse = "test-GetVerifyMessageResponse";
const testGetAccountExtendedKeyResponse = { testKey: "test-key" };
const testPeerInfoResponse = { peerInfoList: { length: 124 } };
const testMasterPubKey =
  "tpubVoxF29y3PU8U1qPsCxjRYatWsZGBoVMYXk2FJbZoEPN4Y2oMawy9Cnuhph4mvKSCqpkkk9QeqnFR9VvyGdm3KwfCEQker14rZJXBPSAjGP8";
const testConfirmations = 2;
const testOutputs = [
  {
    amount: 100000000,
    destination: "test-dest-1"
  },
  {
    amount: 200000000,
    destination: "test-dest-2"
  }
];

const initialState = {
  grpc: {
    balances: testBalances,
    walletService: testWalletService,
    ticketBuyerService: testTicketBuyerService,
    accountMixerService: testAccountMixerService,
    getTicketPriceResponse: {
      ticketPrice: 6309912196,
      height: 1007755
    },
    decodeMessageService: testDecodeMessageService,
    messageVerificationService: testMessageVerificationService
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
let mockGetNextAddress;
let mockRenameAccount;
let mockRescan;
let mockStartWalletServices;
let mockGetStartupWalletInfo;
let mockGetNextAccount;
let mockSignTransaction;
let mockPublishTransaction;
let mockDecodeRawTransaction;
let mockDiscoverUsage;
let mockLoadActiveDataFilters;
let mockVerifyMessage;
let mockPublishUnminedTransactions;
let mockGetAccountExtendedKey;
let mockGetPeerInfo;
let mockOnConfirmationDialogCallbacks;
let mockConstructTransaction;
let mockConstructSendAllTransaction;

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
  mockPurchaseTickets = wallet.purchaseTickets = jest.fn(() =>
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
  mockGetNextAddress = wallet.getNextAddress = jest.fn(() =>
    Promise.resolve(cloneDeep(testGetNextAddressResponse))
  );
  mockRenameAccount = wallet.renameAccount = jest.fn(() =>
    Promise.resolve(cloneDeep(testRenameAccountResponse))
  );
  mockStartWalletServices = clientActions.startWalletServices = jest.fn(
    () => () => {}
  );
  mockGetStartupWalletInfo = clientActions.getStartupWalletInfo = jest.fn(
    () => () => {}
  );
  mockGetNextAccount = wallet.getNextAccount = jest.fn(() => ({
    accountNumber: selectedAccountNumberForTicketPurchase
  }));
  mockSetAccountPassphrase = wallet.setAccountPassphrase = jest.fn(() => {});
  mockChangePassphrase = wallet.changePassphrase = jest.fn(() =>
    Promise.resolve({})
  );
  mockSignTransaction = wallet.signTransaction = jest.fn(
    () => testSignedSignature
  );
  mockPublishTransaction = wallet.publishTransaction = jest.fn(() =>
    Promise.resolve(testPublishTransactionResponse)
  );
  mockDecodeRawTransaction = wallet.decodeRawTransaction = jest.fn(
    () => decodedTransactionResponse
  );
  mockDiscoverUsage = wallet.discoverUsage = jest.fn(
    () => testDiscoverUsageResponse
  );
  mockLoadActiveDataFilters = wallet.loadActiveDataFilters = jest.fn(() => {});
  mockVerifyMessage = wallet.verifyMessage = jest.fn(() =>
    Promise.resolve(testGetVerifyMessageResponse)
  );
  mockPublishUnminedTransactions = wallet.publishUnminedTransactions = jest.fn(
    () => Promise.resolve()
  );
  mockGetAccountExtendedKey = wallet.getAccountExtendedKey = jest.fn(() =>
    Promise.resolve(testGetAccountExtendedKeyResponse)
  );
  mockGetPeerInfo = wallet.getPeerInfo = jest.fn(() =>
    Promise.resolve(testPeerInfoResponse)
  );
  mockOnConfirmationDialogCallbacks = wallet.onConfirmationDialogCallbacks = jest.fn(
    () => {}
  );
  mockConstructTransaction = wallet.constructTransaction = jest.fn(
    () => testConstructTxResponse
  );
  mockConstructSendAllTransaction = wallet.constructSendAllTransaction = jest.fn(
    () => testConstructTxResponse
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
  mockPurchaseTickets = wallet.purchaseTickets = jest.fn(() =>
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
  mockPurchaseTickets = wallet.purchaseTickets = jest.fn(() =>
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
  mockPurchaseTickets = wallet.purchaseTickets = jest.fn(() =>
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

test("test getNextAddressAttempt", async () => {
  const store = createStore(cloneDeep(initialState));
  const res = await store.dispatch(
    controlActions.getNextAddressAttempt(mixedAccountNumber)
  );

  expect(mockGetNextAddress).toHaveBeenCalledWith(
    testWalletService,
    mixedAccountNumber
  );
  const expectedRes = {
    ...testGetNextAddressResponse,
    accountNumber: mixedAccountNumber
  };
  expect(res).toStrictEqual(expectedRes);

  expect(store.getState().control.getNextAddressResponse).toStrictEqual(
    expectedRes
  );
  expect(store.getState().control.getNextAddressError).toBe("");
});

test("test getNextAddressAttempt - failed", async () => {
  mockGetNextAddress = wallet.getNextAddress = jest.fn(() =>
    Promise.reject(testError)
  );
  const store = createStore(cloneDeep(initialState));
  let catchedError;
  try {
    await store.dispatch(
      controlActions.getNextAddressAttempt(mixedAccountNumber)
    );
  } catch (error) {
    catchedError = error;
  }
  expect(catchedError).toBe(testError);

  expect(mockGetNextAddress).toHaveBeenCalledWith(
    testWalletService,
    mixedAccountNumber
  );

  expect(store.getState().control.getNextAddressResponse).toBe(undefined);
  expect(store.getState().control.getNextAddressError).toBe(testError);
});

test("test getNextChangeAddressAttempt", async () => {
  const store = createStore(cloneDeep(initialState));
  const res = await store.dispatch(
    controlActions.getNextChangeAddressAttempt()
  );

  expect(mockGetNextAddress).toHaveBeenCalledWith(
    testWalletService,
    changeAccountNumber
  );
  const expectedRes = {
    ...testGetNextAddressResponse,
    accountNumber: changeAccountNumber
  };
  expect(res).toStrictEqual(expectedRes);

  expect(store.getState().control.getNextChangeAddressResponse).toStrictEqual(
    expectedRes
  );
  expect(store.getState().control.getNextChangeAddressError).toBe("");
});

test("test getNextChangeAddressAttempt - failed", async () => {
  mockGetNextAddress = wallet.getNextAddress = jest.fn(() =>
    Promise.reject(testError)
  );
  const store = createStore(cloneDeep(initialState));
  let catchedError;
  try {
    await store.dispatch(controlActions.getNextChangeAddressAttempt());
  } catch (error) {
    catchedError = error;
  }
  expect(catchedError).toBe(testError);

  expect(mockGetNextAddress).toHaveBeenCalledWith(
    testWalletService,
    changeAccountNumber
  );

  expect(store.getState().control.getNextChangeAddressResponse).toBe(undefined);
  expect(store.getState().control.getNextChangeAddressError).toBe(testError);
});

test("test renameAccountAttempt", async () => {
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(
    controlActions.renameAccountAttempt(
      ticketBuyerAccountNumber,
      testNewAccountName
    )
  );

  expect(mockRenameAccount).toHaveBeenCalledWith(
    testWalletService,
    ticketBuyerAccountNumber,
    testNewAccountName
  );

  await wait(() =>
    expect(store.getState().control.renameAccountResponse).toBe(
      testRenameAccountResponse
    )
  );
  expect(store.getState().control.renameAccountError).toBeNull();
});

test("test renameAccountAttempt - failed", async () => {
  mockRenameAccount = wallet.renameAccount = jest.fn(() =>
    Promise.reject(testError)
  );
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(
    controlActions.renameAccountAttempt(
      ticketBuyerAccountNumber,
      testNewAccountName
    )
  );

  expect(mockRenameAccount).toHaveBeenCalledWith(
    testWalletService,
    ticketBuyerAccountNumber,
    testNewAccountName
  );

  await wait(() =>
    expect(store.getState().control.renameAccountError).toBe(testError)
  );
  expect(store.getState().control.renameAccountResponse).toBe(undefined);
});

test("test rescanAttempt - start and stop later", () => {
  const cbs = {};
  const mockCancel = jest.fn(() => {});
  const mockRescanCall = {
    on: (event, cb) => {
      cbs[event] = cb;
    },
    cancel: mockCancel
  };
  mockRescan = wallet.rescan = jest.fn(() => mockRescanCall);
  const store = createStore(cloneDeep(initialState));
  store.dispatch(
    controlActions.rescanAttempt(testBeginHeight, testBeginHash, true)
  );
  expect(mockRescan).toHaveBeenCalledWith(
    testWalletService,
    testBeginHeight,
    testBeginHash
  );
  expect(store.getState().control.rescanCall).toBeNull();
  expect(store.getState().control.rescanError).toBeNull();
  expect(store.getState().control.rescanRequest).toStrictEqual({
    beginHash: testBeginHash,
    beginHeight: testBeginHeight
  });
  expect(store.getState().control.rescanRequestAttempt).toBeTruthy();

  const testRescanData = "test-rescan-data";
  cbs.data(testRescanData);
  expect(store.getState().control.rescanResponse).toStrictEqual(testRescanData);
  expect(store.getState().control.rescanCall).toBe(mockRescanCall);

  store.dispatch(controlActions.rescanCancel());
  cbs.error("Cancelled");
  expect(store.getState().control.rescanCall).toBeNull();
  expect(store.getState().control.rescanError).toBe("");
  expect(store.getState().control.rescanRequest).toBeNull();
  expect(store.getState().control.rescanRequestAttempt).toBeFalsy();
  expect(store.getState().control.rescanResponse).toBeNull();
});

test("test rescanAttempt - at start up", () => {
  const cbs = {};
  const mockRescanCall = {
    on: (event, cb) => {
      cbs[event] = cb;
    }
  };
  mockRescan = wallet.rescan = jest.fn(() => mockRescanCall);
  const store = createStore(cloneDeep(initialState));
  store.dispatch(
    controlActions.rescanAttempt(testBeginHeight, testBeginHash, true)
  );
  expect(mockRescan).toHaveBeenCalledWith(
    testWalletService,
    testBeginHeight,
    testBeginHash
  );
  expect(store.getState().control.rescanRequestAttempt).toBeTruthy();

  cbs.end();

  expect(store.getState().control.rescanCall).toBeNull();
  expect(store.getState().control.rescanError).toBe("");
  expect(store.getState().control.rescanRequest).toBeNull();
  expect(store.getState().control.rescanRequestAttempt).toBeFalsy();
  expect(store.getState().control.rescanResponse).toBeNull();

  expect(mockStartWalletServices).toHaveBeenCalled();
  expect(mockGetStartupWalletInfo).not.toHaveBeenCalled();
});

test("test rescanAttempt - not at start up", () => {
  const cbs = {};
  const mockRescanCall = {
    on: (event, cb) => {
      cbs[event] = cb;
    }
  };
  mockRescan = wallet.rescan = jest.fn(() => mockRescanCall);
  const store = createStore(cloneDeep(initialState));
  store.dispatch(
    controlActions.rescanAttempt(testBeginHeight, testBeginHash, false)
  );
  expect(mockRescan).toHaveBeenCalledWith(
    testWalletService,
    testBeginHeight,
    testBeginHash
  );
  expect(store.getState().control.rescanRequestAttempt).toBeTruthy();

  cbs.end();

  expect(store.getState().control.rescanCall).toBeNull();
  expect(store.getState().control.rescanError).toBe("");
  expect(store.getState().control.rescanRequest).toBeNull();
  expect(store.getState().control.rescanRequestAttempt).toBeFalsy();
  expect(store.getState().control.rescanResponse).toBeNull();

  expect(mockStartWalletServices).not.toHaveBeenCalled();
  expect(mockGetStartupWalletInfo).toHaveBeenCalled();
});

test("test rescanAttempt - failed", async () => {
  const cbs = {};
  const mockRescanCall = {
    on: (event, cb) => {
      cbs[event] = cb;
    }
  };
  mockRescan = wallet.rescan = jest.fn(() => mockRescanCall);
  const store = createStore(cloneDeep(initialState));
  let catchedError;
  store
    .dispatch(
      controlActions.rescanAttempt(testBeginHeight, testBeginHash, false)
    )
    .then(() => {})
    .catch((error) => {
      catchedError = error;
    });

  expect(mockRescan).toHaveBeenCalledWith(
    testWalletService,
    testBeginHeight,
    testBeginHash
  );
  expect(store.getState().control.rescanRequestAttempt).toBeTruthy();

  cbs.error(testError);

  await wait(() => expect(catchedError).toBe(testError));
  expect(store.getState().control.rescanCall).toBeNull();
  expect(store.getState().control.rescanError).toBe(testError);
  expect(store.getState().control.rescanRequest).toStrictEqual({
    beginHash: testBeginHash,
    beginHeight: testBeginHeight
  });
  expect(store.getState().control.rescanRequestAttempt).toBeFalsy();
  expect(store.getState().control.rescanResponse).toBe(undefined);

  expect(mockStartWalletServices).not.toHaveBeenCalled();
  expect(mockGetStartupWalletInfo).not.toHaveBeenCalled();
});

test("test getNextAccountAttempt", async () => {
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(
    controlActions.getNextAccountAttempt(
      testPassphrase,
      selectedAccountForTicketPurchaseName
    )
  );

  expect(mockGetNextAccount).toHaveBeenCalledWith(
    testWalletService,
    testPassphrase,
    selectedAccountForTicketPurchaseName
  );

  expect(mockSetAccountPassphrase).toHaveBeenCalledWith(
    testWalletService,
    selectedAccountNumberForTicketPurchase,
    null,
    testPassphrase,
    testPassphrase
  );
  expect(store.getState().control.getNextAccountError).toBeNull();
  expect(store.getState().control.getNextAccountRequestAttempt).toBeFalsy();
  expect(store.getState().control.getNextAccountResponse).toStrictEqual({
    accountNumber: selectedAccountNumberForTicketPurchase
  });
});

test("test getNextAccountAttempt - failed", async () => {
  mockGetNextAccount = wallet.getNextAccount = jest.fn(() => {
    throw testError;
  });
  const store = createStore(cloneDeep(initialState));
  let catchedError;
  try {
    await store.dispatch(
      controlActions.getNextAccountAttempt(
        testPassphrase,
        selectedAccountForTicketPurchaseName
      )
    );
  } catch (error) {
    catchedError = error;
  }
  expect(catchedError).toBe(testError);

  expect(mockGetNextAccount).toHaveBeenCalledWith(
    testWalletService,
    testPassphrase,
    selectedAccountForTicketPurchaseName
  );

  expect(mockSetAccountPassphrase).not.toHaveBeenCalled();
  expect(store.getState().control.getNextAccountError).toBe(testError);
  expect(store.getState().control.getNextAccountRequestAttempt).toBeFalsy();
  expect(store.getState().control.getNextAccountResponse).toBe(undefined);
});

test("test getNextAccountAttempt - getNexsetAccountPassphrase failed", async () => {
  mockSetAccountPassphrase = wallet.setAccountPassphrase = jest.fn(() => {
    throw testError;
  });
  const store = createStore(cloneDeep(initialState));
  let catchedError;
  try {
    await store.dispatch(
      controlActions.getNextAccountAttempt(
        testPassphrase,
        selectedAccountForTicketPurchaseName
      )
    );
  } catch (error) {
    catchedError = error;
  }
  expect(catchedError).toBe(testError);

  expect(mockGetNextAccount).toHaveBeenCalledWith(
    testWalletService,
    testPassphrase,
    selectedAccountForTicketPurchaseName
  );

  expect(mockSetAccountPassphrase).toHaveBeenCalledWith(
    testWalletService,
    selectedAccountNumberForTicketPurchase,
    null,
    testPassphrase,
    testPassphrase
  );
  expect(store.getState().control.getNextAccountError).toBe(testError);
  expect(store.getState().control.getNextAccountRequestAttempt).toBeFalsy();
  expect(store.getState().control.getNextAccountResponse).toBe(undefined);

  await wait(() =>
    expect(store.getState().snackbar.messages).not.toBe(undefined)
  );
  expect(
    store.getState().snackbar.messages[0].message.defaultMessage
  ).toMatchInlineSnapshot(
    '"Update passphrase failed. Incorrect passphrase, please try again."'
  );
  expect(store.getState().snackbar.messages[0].values).toStrictEqual({
    originalError: testError
  });
  expect(store.getState().snackbar.messages[1].message.defaultMessage).toBe(
    "{originalError}"
  );
  expect(store.getState().snackbar.messages[1].values).toStrictEqual({
    originalError: testError
  });
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

  expect(store.getState().control.changePassphraseError).toBe(testError);
  expect(store.getState().control.changePassphraseRequestAttempt).toBeFalsy();
  expect(store.getState().control.changePassphraseResponse).toBe(undefined);
  expect(store.getState().control.changePassphraseSuccess).toBe(undefined);
});

test("test signTransactionAttempt", async () => {
  const {
    mockLockAccount,
    mockUnlockAccount
  } = mockUnlockLockAndGetAccountsAttempt();
  const store = createStore(
    cloneDeep({
      ...initialState,
      control: {
        ...initialState.control,
        changeScriptByAccount: testChangeScriptByAccount
      }
    })
  );
  await store.dispatch(
    controlActions.signTransactionAttempt(
      testPassphrase,
      testRawTx,
      defaultAccountNumber
    )
  );
  expect(mockUnlockAccount).toHaveBeenCalledWith(
    testWalletService,
    testPassphrase,
    defaultAccountNumber
  );

  expect(mockSignTransaction).toHaveBeenCalledWith(
    testWalletService,
    testDecodeMessageService,
    testRawTx
  );

  expect(mockPublishTransaction).toHaveBeenCalledWith(
    testWalletService,
    testSignedSignature.transaction
  );

  expect(mockDecodeRawTransaction).toHaveBeenCalledWith(
    Buffer.from(testSignedSignature.transaction, "hex"),
    MainNetParams
  );

  expect(mockLockAccount).toHaveBeenCalledWith(
    testWalletService,
    defaultAccountNumber
  );

  expect(store.getState().control.signTransactionRequestAttempt).toBeFalsy();
  expect(store.getState().control.signTransactionResponse).toBe(
    testSignedSignature
  );

  expect(store.getState().control.publishTransactionRequestAttempt).toBeFalsy();
  expect(store.getState().control.publishTransactionResponse).toBe(
    testPublishTransactionResponse.transactionHash
  );
  expect(store.getState().control.constructTxResponse).toBeNull();
  expect(store.getState().control.signTxResponse).toBeNull();
  expect(store.getState().control.changeScriptByAccount).toStrictEqual({});
});

test("test signTransactionAttempt - not found change script", async () => {
  const testChangeScriptByAccountCopy = {
    [defaultAccountNumber]: [...testScript, 1]
  };
  mockUnlockLockAndGetAccountsAttempt();
  const store = createStore(
    cloneDeep({
      ...initialState,
      control: {
        ...initialState.control,
        changeScriptByAccount: testChangeScriptByAccountCopy
      }
    })
  );
  await store.dispatch(
    controlActions.signTransactionAttempt(
      testPassphrase,
      testRawTx,
      defaultAccountNumber
    )
  );

  expect(store.getState().control.changeScriptByAccount).toStrictEqual(
    testChangeScriptByAccountCopy
  );
});

test("test signTransactionAttempt - failed", async () => {
  mockSignTransaction = wallet.signTransaction = jest.fn(() => {
    throw testError;
  });

  const {
    mockLockAccount,
    mockUnlockAccount
  } = mockUnlockLockAndGetAccountsAttempt();
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(
    controlActions.signTransactionAttempt(
      testPassphrase,
      testRawTx,
      defaultAccountNumber
    )
  );
  expect(mockUnlockAccount).toHaveBeenCalledWith(
    testWalletService,
    testPassphrase,
    defaultAccountNumber
  );

  expect(mockSignTransaction).toHaveBeenCalledWith(
    testWalletService,
    testDecodeMessageService,
    testRawTx
  );

  expect(mockPublishTransaction).not.toHaveBeenCalled();

  expect(mockDecodeRawTransaction).not.toHaveBeenCalled();

  expect(mockLockAccount).toHaveBeenCalledWith(
    testWalletService,
    defaultAccountNumber
  );

  expect(store.getState().control.signTransactionRequestAttempt).toBeFalsy();
  expect(store.getState().control.signTransactionResponse).toBeNull();
});

test("test signTransactionAttempt publish transaction failed", async () => {
  mockPublishTransaction = wallet.publishTransaction = jest.fn(() =>
    Promise.reject(testError)
  );
  const {
    mockLockAccount,
    mockUnlockAccount
  } = mockUnlockLockAndGetAccountsAttempt();
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(
    controlActions.signTransactionAttempt(
      testPassphrase,
      testRawTx,
      defaultAccountNumber
    )
  );
  expect(mockUnlockAccount).toHaveBeenCalledWith(
    testWalletService,
    testPassphrase,
    defaultAccountNumber
  );

  expect(mockSignTransaction).toHaveBeenCalledWith(
    testWalletService,
    testDecodeMessageService,
    testRawTx
  );

  expect(mockPublishTransaction).toHaveBeenCalledWith(
    testWalletService,
    testSignedSignature.transaction
  );

  expect(mockDecodeRawTransaction).not.toHaveBeenCalled();

  expect(mockLockAccount).toHaveBeenCalledWith(
    testWalletService,
    defaultAccountNumber
  );

  expect(store.getState().control.signTransactionRequestAttempt).toBeFalsy();
  expect(store.getState().control.signTransactionResponse).toBe(
    testSignedSignature
  );

  await wait(() =>
    expect(
      store.getState().control.publishTransactionRequestAttempt
    ).toBeFalsy()
  );
  expect(store.getState().control.publishTransactionResponse).toBe(undefined);
  expect(store.getState().control.constructTxResponse).toBe(undefined);
  expect(store.getState().control.signTxResponse).toBe(undefined);
  expect(store.getState().control.changeScriptByAccount).toBe(undefined);
});

test("test discoverUsageAttempt", async () => {
  const cbs = {};
  const mockCancel = jest.fn(() => {});
  const mockRescanCall = {
    on: (event, cb) => {
      cbs[event] = cb;
    },
    cancel: mockCancel
  };
  mockRescan = wallet.rescan = jest.fn(() => mockRescanCall);
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(controlActions.discoverUsageAttempt(testGapLimit));

  expect(mockDiscoverUsage).toHaveBeenCalledWith(
    testWalletService,
    testGapLimit
  );

  expect(mockLoadActiveDataFilters).toHaveBeenCalledWith(testWalletService);
  await wait(() =>
    expect(mockRescan).toHaveBeenCalledWith(testWalletService, 0, undefined)
  );
  expect(store.getState().control.discoverUsageAttempt).toBeFalsy();
});

test("test discoverUsageAttempt - failed", async () => {
  mockDiscoverUsage = wallet.discoverUsage = jest.fn(() => {
    throw testError;
  });
  mockRescan = wallet.rescan = jest.fn(() => {});
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(controlActions.discoverUsageAttempt(testGapLimit));

  expect(mockDiscoverUsage).toHaveBeenCalledWith(
    testWalletService,
    testGapLimit
  );

  expect(mockLoadActiveDataFilters).not.toHaveBeenCalled();
  expect(mockRescan).not.toHaveBeenCalled();
  expect(store.getState().control.discoverUsageAttempt).toBeFalsy();
});

test("test validateAddress - mainnet", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      settings: {
        ...initialState.settings,
        currentSettings: { network: MAINNET }
      }
    })
  );
  const res = await store.dispatch(
    controlActions.validateAddress(testMainnetAddress)
  );
  expect(mockValidateAddress).toHaveBeenCalledWith(
    testWalletService,
    testMainnetAddress
  );

  expect(res).toStrictEqual({
    accountNumber: defaultAccountNumber,
    error: null
  });
});

test("test validateAddress - testnet", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      settings: {
        ...initialState.settings,
        currentSettings: { network: TESTNET }
      }
    })
  );
  const res = await store.dispatch(
    controlActions.validateAddress(testTestnetAddress)
  );
  expect(mockValidateAddress).toHaveBeenCalledWith(
    testWalletService,
    testTestnetAddress
  );

  expect(res).toStrictEqual({
    accountNumber: defaultAccountNumber,
    error: null
  });
});

test("test validateAddress - failed, mainnet address on testnet", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      settings: {
        ...initialState.settings,
        currentSettings: { network: TESTNET }
      }
    })
  );
  const res = await store.dispatch(
    controlActions.validateAddress(testMainnetAddress)
  );
  expect(mockValidateAddress).not.toHaveBeenCalled();
  expect(res.error).toBe(ERR_INVALID_ADDR_NETWORKPREFIX);
  expect(res.isValid).toBeFalsy();
  expect(res.getIsValid()).toBeFalsy();
});

test("test validateAddress - failed, wallet.validateAddress failed", async () => {
  mockValidateAddress = wallet.validateAddress = jest.fn(() => {
    throw testError;
  });
  const store = createStore(
    cloneDeep({
      ...initialState,
      settings: {
        ...initialState.settings,
        currentSettings: { network: TESTNET }
      }
    })
  );
  const res = await store.dispatch(
    controlActions.validateAddress(testTestnetAddress)
  );
  expect(mockValidateAddress).toHaveBeenCalledWith(
    testWalletService,
    testTestnetAddress
  );
  expect(res.error).toBe(testError);
  expect(res.isValid).toBeFalsy();
});

test("test verifyMessageAttempt", async () => {
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(
    controlActions.verifyMessageAttempt(
      testTestnetAddress,
      testMessage,
      testSignature
    )
  );
  expect(mockVerifyMessage).toHaveBeenCalledWith(
    testMessageVerificationService,
    testTestnetAddress,
    testMessage,
    testSignature
  );
  expect(store.getState().grpc.getVerifyMessageRequestAttempt).toBeFalsy();
  expect(store.getState().grpc.getVerifyMessageError).toBeNull();
  expect(store.getState().grpc.getVerifyMessageResponse).toBe(
    testGetVerifyMessageResponse
  );
});

test("test verifyMessageAttempt  - failed", async () => {
  mockVerifyMessage = wallet.verifyMessage = jest.fn(() =>
    Promise.reject(testError)
  );
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(
    controlActions.verifyMessageAttempt(
      testTestnetAddress,
      testMessage,
      testSignature
    )
  );
  expect(mockVerifyMessage).toHaveBeenCalledWith(
    testMessageVerificationService,
    testTestnetAddress,
    testMessage,
    testSignature
  );
  await wait(() =>
    expect(store.getState().grpc.getVerifyMessageRequestAttempt).toBeFalsy()
  );
  expect(store.getState().grpc.getVerifyMessageError).toBe(testError);
  expect(store.getState().grpc.getVerifyMessageResponse).toBe(undefined);
});

test("test publishUnminedTransactionsAttempt", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      grpc: {
        ...initialState.grpc,
        unminedTransactions: ["utx-1"]
      }
    })
  );
  await store.dispatch(controlActions.publishUnminedTransactionsAttempt());

  expect(mockPublishUnminedTransactions).toHaveBeenCalledWith(
    testWalletService
  );
  await wait(() =>
    expect(store.getState().snackbar.messages).not.toBe(undefined)
  );
  expect(
    store.getState().snackbar.messages[0].message.defaultMessage
  ).toMatchInlineSnapshot(
    '"Republished unmined transactions to the decred network."'
  );
});

test("test publishUnminedTransactionsAttempt - failed", async () => {
  mockPublishUnminedTransactions = wallet.publishUnminedTransactions = jest.fn(
    () => Promise.reject(testError)
  );
  const store = createStore(
    cloneDeep({
      ...initialState,
      grpc: {
        ...initialState.grpc,
        unminedTransactions: ["utx-1"]
      }
    })
  );
  await store.dispatch(controlActions.publishUnminedTransactionsAttempt());

  expect(mockPublishUnminedTransactions).toHaveBeenCalledWith(
    testWalletService
  );
  await wait(() =>
    expect(store.getState().snackbar.messages).not.toBe(undefined)
  );
  expect(store.getState().snackbar.messages[0].message.defaultMessage).toBe(
    "{originalError}"
  );
  expect(store.getState().snackbar.messages[0].values).toStrictEqual({
    originalError: testError
  });
});

test("test publishUnminedTransactionsAttempt - not have unmined transactions", async () => {
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(controlActions.publishUnminedTransactionsAttempt());

  expect(mockPublishUnminedTransactions).not.toHaveBeenCalled();
});

test("test getAccountExtendedKeyAttempt", async () => {
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(
    controlActions.getAccountExtendedKeyAttempt(commitmentAccountNumber)
  );

  expect(mockGetAccountExtendedKey).toHaveBeenCalledWith(
    testWalletService,
    commitmentAccountNumber
  );

  expect(store.getState().control.getAccountExtendedKeyResponse).toStrictEqual({
    ...testGetAccountExtendedKeyResponse,
    accountNumber: commitmentAccountNumber
  });
  expect(store.getState().control.getAccountExtendedKeyAttempt).toBeFalsy();
});

test("test getAccountExtendedKeyAttempt failed", async () => {
  mockGetAccountExtendedKey = wallet.getAccountExtendedKey = jest.fn(() =>
    Promise.reject(testError)
  );
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(
    controlActions.getAccountExtendedKeyAttempt(commitmentAccountNumber)
  );

  expect(mockGetAccountExtendedKey).toHaveBeenCalledWith(
    testWalletService,
    commitmentAccountNumber
  );

  expect(store.getState().control.getAccountExtendedKeyResponse).toBeNull();
  expect(store.getState().control.getAccountExtendedKeyAttempt).toBeFalsy();
});

test("test getPeerInfo", async () => {
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(controlActions.getPeerInfo());

  expect(mockGetPeerInfo).toHaveBeenCalledWith(testWalletService);
  expect(store.getState().grpc.peersCount).toBe(
    testPeerInfoResponse.peerInfoList.length
  );
});

test("test getPeerInfo - failed", async () => {
  mockGetPeerInfo = wallet.getPeerInfo = jest.fn(() =>
    Promise.reject(testError)
  );
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(controlActions.getPeerInfo());

  expect(mockGetPeerInfo).toHaveBeenCalledWith(testWalletService);
  expect(store.getState().grpc.peersCount).toBe(undefined);
  expect(store.getState().grpc.getPeerInfoError).toBe(testError);
});

test("test setAccountsPass", async () => {
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(controlActions.setAccountsPass(testPassphrase));

  testBalances.forEach(({ accountNumber, accountName }, index) => {
    if (accountName !== "imported") {
      expect(mockSetAccountPassphrase).toHaveBeenNthCalledWith(
        index + 1,
        testWalletService,
        accountNumber,
        null,
        testPassphrase,
        testPassphrase
      );
    }
  });
});

test("test setAccountsPass - failed", async () => {
  mockSetAccountPassphrase = wallet.setAccountPassphrase = jest.fn(() => {
    throw testError;
  });
  const store = createStore(cloneDeep(initialState));
  let catchedError;
  try {
    await store.dispatch(controlActions.setAccountsPass(testPassphrase));
  } catch (error) {
    catchedError = error;
  }
  expect(catchedError).toBe(testError);
});

test("test listenForConfirmationDialogRequests", async () => {
  let requestedCb;
  let hiddenCb;
  mockOnConfirmationDialogCallbacks = wallet.onConfirmationDialogCallbacks = jest.fn(
    (rcb, hcb) => {
      requestedCb = rcb;
      hiddenCb = hcb;
    }
  );
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(controlActions.listenForConfirmationDialogRequests());

  expect(store.getState().control.confirmationDialogModalVisible).toBe(
    undefined
  );
  expect(mockOnConfirmationDialogCallbacks).toHaveBeenCalled();

  requestedCb();
  expect(store.getState().control.confirmationDialogModalVisible).toBeTruthy();
  hiddenCb();
  expect(store.getState().control.confirmationDialogModalVisible).toBeFalsy();
});

test("test [show/hide]AboutModalMacOS", async () => {
  const store = createStore(cloneDeep(initialState));
  expect(store.getState().control.aboutModalMacOSVisible).toBe(undefined);
  await store.dispatch(controlActions.showAboutModalMacOS());
  expect(store.getState().control.aboutModalMacOSVisible).toBeTruthy();

  await store.dispatch(controlActions.hideAboutModalMacOS());
  expect(store.getState().control.aboutModalMacOSVisible).toBeFalsy();
});

test("test [show/hide]CantCloseModal", async () => {
  const store = createStore(cloneDeep(initialState));
  expect(store.getState().control.cantCloseModalVisible).toBe(undefined);
  await store.dispatch(controlActions.showCantCloseModal());
  expect(store.getState().control.cantCloseModalVisible).toBeTruthy();

  await store.dispatch(controlActions.hideCantCloseModal());
  expect(store.getState().control.cantCloseModalVisible).toBeFalsy();
});

test("test validateMasterPubKey", async () => {
  const store = createStore(cloneDeep(initialState));
  const res = await store.dispatch(
    controlActions.validateMasterPubKey(testMasterPubKey)
  );
  expect(res).toStrictEqual({ isValid: true, error: null });
});

test("test validateMasterPubKey - invalid master pub key", async () => {
  const store = createStore(cloneDeep(initialState));
  const res = await store.dispatch(controlActions.validateMasterPubKey(null));
  expect(res).toStrictEqual({
    isValid: false,
    error: ERR_INVALID_MASTER_PUB_KEY
  });
});

test("test validateMasterPubKey - invalid master pub key check sum", async () => {
  const store = createStore(cloneDeep(initialState));
  const res = await store.dispatch(
    controlActions.validateMasterPubKey(testMasterPubKey.toUpperCase())
  );
  expect(res).toStrictEqual({
    isValid: false,
    error: ERR_INVALID_MASTERPUB_CHECKSUM
  });
});

test("test constructTransactionAttempt", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      control: {
        ...initialState.control,
        changeScriptByAccount: testChangeScriptByAccount
      }
    })
  );
  await store.dispatch(
    controlActions.constructTransactionAttempt(
      defaultAccountNumber,
      testConfirmations,
      testOutputs
    )
  );

  expect(mockConstructTransaction).toHaveBeenCalledWith(
    testWalletService,
    defaultAccountNumber,
    testConfirmations,
    testOutputs,
    { script: testChangeScriptByAccount[defaultAccountNumber] }
  );

  expect(store.getState().control.constructTxResponse).toStrictEqual({
    ...testConstructTxResponse,
    rawTx:
      "3031303030303030303131353866323231666330306532386535623531613437346239353133366435666539383161343831323761306635643062333665373336636635613939653738313630303030303030306666666666666666303362363531316532653030303030303030303030303139373661393134306633656631326431623464333365353738613436316636313139363435343764633463636162313838616330306332656230623030303030303030303030303139373661393134383635383963653563616430353338643935373235636135623831323263613433376233393837363838616330306531663530353030303030303030303030303139373661393134383635383963653563616430353338643935373235636135623831323263613433376233393837363838616330303030303030303030303030303030303130303030303034303030303030303030303030303030303066666666666666663030"
  });
  expect(store.getState().control.changeScriptByAccount).toStrictEqual({
    [defaultAccountNumber]:
      decodedTransactionResponse.outputs[testConstructTxResponse.changeIndex]
        .script
  });
  expect(store.getState().control.constructTxLowBalance).toBeFalsy();
});

test("test constructTransactionAttempt - negative change index", async () => {
  const testConstructTxResponseCopy = {
    ...testConstructTxResponse,
    changeIndex: -1
  };
  mockConstructTransaction = wallet.constructTransaction = jest.fn(
    () => testConstructTxResponseCopy
  );
  const store = createStore(
    cloneDeep({
      ...initialState,
      control: {
        ...initialState.control,
        changeScriptByAccount: testChangeScriptByAccount
      }
    })
  );
  await store.dispatch(
    controlActions.constructTransactionAttempt(
      defaultAccountNumber,
      testConfirmations,
      testOutputs
    )
  );

  expect(mockConstructTransaction).toHaveBeenCalledWith(
    testWalletService,
    defaultAccountNumber,
    testConfirmations,
    testOutputs,
    { script: testChangeScriptByAccount[defaultAccountNumber] }
  );

  expect(store.getState().control.constructTxResponse).toStrictEqual({
    ...testConstructTxResponseCopy,
    rawTx:
      "3031303030303030303131353866323231666330306532386535623531613437346239353133366435666539383161343831323761306635643062333665373336636635613939653738313630303030303030306666666666666666303362363531316532653030303030303030303030303139373661393134306633656631326431623464333365353738613436316636313139363435343764633463636162313838616330306332656230623030303030303030303030303139373661393134383635383963653563616430353338643935373235636135623831323263613433376233393837363838616330306531663530353030303030303030303030303139373661393134383635383963653563616430353338643935373235636135623831323263613433376233393837363838616330303030303030303030303030303030303130303030303034303030303030303030303030303030303066666666666666663030"
  });
  expect(store.getState().control.changeScriptByAccount).toStrictEqual(
    testChangeScriptByAccount
  );
  expect(store.getState().control.constructTxLowBalance).toBeFalsy();
});

test("test constructTransactionAttempt - change script not found in a private wallet", async () => {
  const testConstructTxResponseCopy = {
    ...testConstructTxResponse,
    changeIndex: -1
  };
  mockConstructTransaction = wallet.constructTransaction = jest.fn(
    () => testConstructTxResponseCopy
  );
  const store = createStore(
    cloneDeep({
      ...initialState,
      control: {
        ...initialState.control,
        changeScriptByAccount: testChangeScriptByAccount
      }
    })
  );
  await store.dispatch(
    controlActions.constructTransactionAttempt(
      mixedAccountNumber,
      testConfirmations,
      testOutputs
    )
  );

  expect(mockConstructTransaction).toHaveBeenCalledWith(
    testWalletService,
    mixedAccountNumber,
    testConfirmations,
    testOutputs,
    {
      address: testAddress
    }
  );

  expect(store.getState().control.constructTxResponse).toStrictEqual({
    ...testConstructTxResponseCopy,
    rawTx:
      "3031303030303030303131353866323231666330306532386535623531613437346239353133366435666539383161343831323761306635643062333665373336636635613939653738313630303030303030306666666666666666303362363531316532653030303030303030303030303139373661393134306633656631326431623464333365353738613436316636313139363435343764633463636162313838616330306332656230623030303030303030303030303139373661393134383635383963653563616430353338643935373235636135623831323263613433376233393837363838616330306531663530353030303030303030303030303139373661393134383635383963653563616430353338643935373235636135623831323263613433376233393837363838616330303030303030303030303030303030303130303030303034303030303030303030303030303030303066666666666666663030"
  });
  expect(store.getState().control.changeScriptByAccount).toStrictEqual(
    testChangeScriptByAccount
  );
  expect(store.getState().control.constructTxLowBalance).toBeFalsy();
});

test("test constructTransactionAttempt - change script not found in a non private wallet", async () => {
  const testConstructTxResponseCopy = {
    ...testConstructTxResponse,
    changeIndex: -1
  };
  mockConstructTransaction = wallet.constructTransaction = jest.fn(
    () => testConstructTxResponseCopy
  );
  const store = createStore(
    cloneDeep({
      ...initialState,
      control: {
        ...initialState.control,
        changeScriptByAccount: testChangeScriptByAccount
      },
      walletLoader: {
        mixedAccount: null,
        changeAccount: null
      }
    })
  );
  await store.dispatch(
    controlActions.constructTransactionAttempt(
      ticketBuyerAccountNumber,
      testConfirmations,
      testOutputs
    )
  );

  expect(mockConstructTransaction).toHaveBeenCalledWith(
    testWalletService,
    ticketBuyerAccountNumber,
    testConfirmations,
    testOutputs,
    undefined // change destination will be filled by dcrwallet
  );

  expect(store.getState().control.constructTxResponse).toStrictEqual({
    ...testConstructTxResponseCopy,
    rawTx:
      "3031303030303030303131353866323231666330306532386535623531613437346239353133366435666539383161343831323761306635643062333665373336636635613939653738313630303030303030306666666666666666303362363531316532653030303030303030303030303139373661393134306633656631326431623464333365353738613436316636313139363435343764633463636162313838616330306332656230623030303030303030303030303139373661393134383635383963653563616430353338643935373235636135623831323263613433376233393837363838616330306531663530353030303030303030303030303139373661393134383635383963653563616430353338643935373235636135623831323263613433376233393837363838616330303030303030303030303030303030303130303030303034303030303030303030303030303030303066666666666666663030"
  });
  expect(store.getState().control.changeScriptByAccount).toStrictEqual(
    testChangeScriptByAccount
  );
  expect(store.getState().control.constructTxLowBalance).toBeFalsy();
});

test("test constructTransactionAttempt - constructTxRequestAttempt is in progress", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      control: {
        ...initialState.control,
        constructTxRequestAttempt: true
      }
    })
  );
  await store.dispatch(
    controlActions.constructTransactionAttempt(
      defaultAccountNumber,
      testConfirmations,
      testOutputs
    )
  );

  expect(mockConstructTransaction).not.toHaveBeenCalled();
});

test("test constructTransactionAttempt - send all", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      control: {
        ...initialState.control,
        changeScriptByAccount: testChangeScriptByAccount
      }
    })
  );
  await store.dispatch(
    controlActions.constructTransactionAttempt(
      defaultAccountNumber,
      testConfirmations,
      testOutputs,
      true
    )
  );

  expect(mockConstructTransaction).not.toHaveBeenCalled();
  expect(mockConstructSendAllTransaction).toHaveBeenCalledWith(
    testWalletService,
    defaultAccountNumber,
    testConfirmations,
    testOutputs,
    undefined // changeScript
  );

  expect(store.getState().control.constructTxResponse).toStrictEqual({
    ...testConstructTxResponse,
    //
    rawTx:
      "3031303030303030303131353866323231666330306532386535623531613437346239353133366435666539383161343831323761306635643062333665373336636635613939653738313630303030303030306666666666666666303362363531316532653030303030303030303030303139373661393134306633656631326431623464333365353738613436316636313139363435343764633463636162313838616330306332656230623030303030303030303030303139373661393134383635383963653563616430353338643935373235636135623831323263613433376233393837363838616330306531663530353030303030303030303030303139373661393134383635383963653563616430353338643935373235636135623831323263613433376233393837363838616330303030303030303030303030303030303130303030303034303030303030303030303030303030303066666666666666663030"
  });
  expect(store.getState().control.changeScriptByAccount).toStrictEqual(
    testChangeScriptByAccount
  );
  expect(store.getState().control.constructTxLowBalance).toBeFalsy();
});

test("test constructTransactionAttempt - failed", async () => {
  mockConstructTransaction = wallet.constructTransaction = jest.fn(() => {
    throw testError;
  });
  const store = createStore(
    cloneDeep({
      ...initialState,
      control: {
        ...initialState.control,
        changeScriptByAccount: testChangeScriptByAccount
      }
    })
  );
  await store.dispatch(
    controlActions.constructTransactionAttempt(
      defaultAccountNumber,
      testConfirmations,
      testOutputs
    )
  );

  expect(mockConstructTransaction).toHaveBeenCalledWith(
    testWalletService,
    defaultAccountNumber,
    testConfirmations,
    testOutputs,
    { script: testChangeScriptByAccount[defaultAccountNumber] }
  );

  expect(store.getState().control.constructTxResponse).toBeNull();
  expect(store.getState().control.constructTxLowBalance).toBeFalsy();

  expect(store.getState().snackbar.messages[0].message.defaultMessage).toBe(
    "{originalError}"
  );
  expect(store.getState().snackbar.messages[0].values).toStrictEqual({
    originalError: testError
  });
});

test("test constructTransactionAttempt - failed - violates the unused address gap limit policy", async () => {
  const errorMsg = "...violates the unused address gap limit policy...";
  mockConstructTransaction = wallet.constructTransaction = jest.fn(() => {
    throw errorMsg;
  });
  const store = createStore(
    cloneDeep({
      ...initialState,
      control: {
        ...initialState.control,
        changeScriptByAccount: testChangeScriptByAccount
      }
    })
  );
  await store.dispatch(
    controlActions.constructTransactionAttempt(
      defaultAccountNumber,
      testConfirmations,
      testOutputs
    )
  );

  expect(mockConstructTransaction).toHaveBeenCalledWith(
    testWalletService,
    defaultAccountNumber,
    testConfirmations,
    testOutputs,
    { script: testChangeScriptByAccount[defaultAccountNumber] }
  );

  expect(store.getState().control.constructTxResponse).toBeNull();
  expect(store.getState().control.constructTxLowBalance).toBeFalsy();

  expect(store.getState().snackbar.messages[0].message.defaultMessage).toBe(
    "{originalError}"
  );
  expect(store.getState().snackbar.messages[0].values).toStrictEqual({
    originalError: errorMsg
  });
  expect(mockGetNextAddress).toHaveBeenCalledWith(
    testWalletService,
    defaultAccountNumber,
    1 // kind
  );
});

test("test constructTransactionAttempt - failed", async () => {
  mockConstructTransaction = wallet.constructTransaction = jest.fn(() => {
    throw testError;
  });
  const store = createStore(
    cloneDeep({
      ...initialState,
      control: {
        ...initialState.control,
        changeScriptByAccount: testChangeScriptByAccount
      }
    })
  );
  await store.dispatch(
    controlActions.constructTransactionAttempt(
      defaultAccountNumber,
      testConfirmations,
      testOutputs
    )
  );

  expect(mockConstructTransaction).toHaveBeenCalledWith(
    testWalletService,
    defaultAccountNumber,
    testConfirmations,
    testOutputs,
    { script: testChangeScriptByAccount[defaultAccountNumber] }
  );

  expect(store.getState().control.constructTxResponse).toBeNull();
  expect(store.getState().control.constructTxLowBalance).toBeFalsy();

  expect(store.getState().snackbar.messages[0].message.defaultMessage).toBe(
    "{originalError}"
  );
  expect(store.getState().snackbar.messages[0].values).toStrictEqual({
    originalError: testError
  });
});

test("test constructTransactionAttempt - failed - insufficient balance", async () => {
  mockConstructTransaction = wallet.constructTransaction = jest.fn(() => {
    throw "...insufficient balance...";
  });
  const store = createStore(
    cloneDeep({
      ...initialState,
      control: {
        ...initialState.control,
        changeScriptByAccount: testChangeScriptByAccount
      }
    })
  );
  await store.dispatch(
    controlActions.constructTransactionAttempt(
      defaultAccountNumber,
      testConfirmations,
      testOutputs
    )
  );

  expect(mockConstructTransaction).toHaveBeenCalledWith(
    testWalletService,
    defaultAccountNumber,
    testConfirmations,
    testOutputs,
    { script: testChangeScriptByAccount[defaultAccountNumber] }
  );

  expect(store.getState().control.constructTxLowBalance).toBeTruthy();
});
