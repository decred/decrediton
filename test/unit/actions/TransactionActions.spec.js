import * as cla from "actions/TransactionActions";
import * as ca from "actions/ControlActions";
import * as wal from "wallet";
import * as sel from "selectors";
import * as cli from "actions/ClientActions";
import * as am from "actions/AccountMixerActions";
import { createStore } from "test-utils.js";
import {
  mockRegularTransactions,
  mockNormalizedRegularTransactions,
  mockNormalizedStakeTransactions,
  mockRegularTransactionList
} from "../components/views/TransactionPage/mocks.js";
import {
  mockStakeTransactionList,
  mockStakeTransactions
} from "../components/views/TransactionPage/mocks_stakeTransactions.js";
import { mockTickets } from "../components/views/TransactionPage/mocks_tickets.js";
import { mockDecodedTransactions } from "../components/views/TransactionPage/mocks_decodedTransactions.js";
import { mockSpenderTransactions } from "../components/views/TransactionPage/mocks_spenderTransactions.js";
import { isEqual, cloneDeep } from "lodash/fp";
import { TestNetParams } from "constants";
import { walletrpc as api } from "middleware/walletrpc/api_pb";
const { TransactionDetails } = api;
import {
  MaxNonWalletOutputs,
  TICKET,
  IMMATURE,
  VOTE,
  VOTED,
  REVOKED,
  BATCH_TX_COUNT,
  VSP_FEE_PROCESS_ERRORED,
  VSP_FEE_PROCESS_STARTED,
  VSP_FEE_PROCESS_PAID,
  VSP_FEE_PROCESS_CONFIRMED
} from "constants";
import { strHashToRaw, rawToHex, reverseRawHash, hexToBytes } from "helpers";

const controlActions = ca;
const transactionActions = cla;
const wallet = wal;
const selectors = sel;
const clientActions = cli;
const accountMixerActions = am;
const walletService = "walletService";
const initialState = {
  settings: {
    currentSettings: {
      network: "testnet"
    }
  },
  grpc: {
    walletService,
    getAccountsResponse: {
      accountsList: [
        {
          accountNumber: 0,
          accountName: "default"
        },
        {
          accountNumber: 1,
          accountName: "account-1"
        },
        {
          accountNumber: 2,
          accountName: "account-2"
        },
        {
          accountNumber: 3,
          accountName: "account-3"
        },
        {
          accountNumber: 4,
          accountName: "account-4"
        },
        {
          accountNumber: 5,
          accountName: "account-5"
        },
        {
          accountNumber: 6,
          accountName: "account-6"
        },
        {
          accountNumber: 7,
          accountName: "unmixed"
        },
        {
          accountNumber: 15,
          accountName: "account-15"
        },
        {
          accountNumber: 2147483647,
          accountName: "imported"
        }
      ]
    }
  }
};
const testRawTx = [1, 2, 3];
const testRawTxHex = Buffer.from(testRawTx, "hex");
const mockVspHost = "mock-vsp-host";

const mockRegularReceivedTxHash =
  "642e3756be5a38636dfcdc643da9c6f5be8c9a1015b4623ad9cab38ff0ceec8e";
const mockMissedTicketHash =
  "30dd06049d763ab474dbc39ffbe4bbd0ad6825e5bdf21b67dc046fda3ce55774";
const mockRegularPendingTxHash =
  "263f64a32f2f86ffda747242cfc620b0c42689f5c600ef2be22351f53bcd5b0d";
const mockUnminedTicketHash =
  "d6b457b87edf02391e9adb4021d830259178bc4c906129b55445f2918ad5fb6f";
const mockVoteTx =
  "843128b4209be24400f5c7452aad43c2a7592979fcce6de22695e501c6a4d3b4";
const mockVotedTicketHash =
  "6085cffd75245c4d2ae51c8dbe4651e54addc30693b016e8e061720589714f57";
const mockRegularMixedTxHash =
  "ee6dbff0efe2eeb8c803133284462849661709beab258fb57453997afd9f492c";
const mockRegularSelfTxHash =
  "9110b998c418a9007389627bc2ad51e888392f463bc7ccc30dcd927a2f0fa304";

const mockUnminedTransactions = [
  [
    mockRegularTransactions[mockRegularPendingTxHash],
    mockStakeTransactions[mockUnminedTicketHash]
  ],
  [],
  []
];
const mockMinedTransactions = [
  [], // unmined call
  [
    mockStakeTransactions[mockVoteTx],
    mockStakeTransactions[mockVotedTicketHash]
  ],
  []
];

const testChangeAccountId = 123;

let mockGetNextAddressAttempt;
let mockDecodeRawTransaction;
let mockValidateAddress;

let mockGetVSPTicketsByFeeStatus;
let mockGetBalanceUpdateAttempt;
let mockGetStakeInfoAttempt;
let mockCheckUnmixedAccountBalance;
let mockGetMixerAcctsSpendableBalances;

beforeEach(() => {
  mockGetNextAddressAttempt = controlActions.getNextAddressAttempt = jest.fn(
    () => () => {}
  );
  mockValidateAddress = wallet.validateAddress = jest.fn(() => ({
    isMine: true
  }));
  selectors.isTestNet = jest.fn(() => true);
  selectors.getChangeAccount = jest.fn(() => testChangeAccountId);
  mockDecodeRawTransaction = wallet.decodeRawTransaction = jest.fn((p) => {
    const txHex = rawToHex(p);
    if (mockDecodedTransactions[txHex]) {
      const decodedSpender = mockDecodedTransactions[txHex];
      decodedSpender.inputs = decodedSpender.inputs.map((input) => ({
        ...input,
        sigScript: hexToBytes(input.sigScript)
      }));
      decodedSpender.outputs = decodedSpender.outputs.map((output) => ({
        ...output,
        script: hexToBytes(output.script)
      }));
      return cloneDeep(decodedSpender);
    }
    const tx = mockRegularTransactionList.find((tx) => tx.rawTx === txHex);
    if (tx) {
      const res = tx.outputs.map((output) => ({
        decodedScript: { address: output.address },
        value: output.value
      }));
      return { outputs: res };
    }
  });
  mockValidateAddress = wallet.validateAddress = jest.fn((_, address) => {
    let isMine = true;
    Object.keys(mockNormalizedRegularTransactions).forEach((key) => {
      const tx = mockNormalizedRegularTransactions[key];
      tx.outputs.forEach((output) => {
        if (output.address === address) {
          isMine = output.isChange;
        }
      });
    });
    return { isMine };
  });

  wallet.getTicket = jest.fn((_, p) => {
    const txHash = reverseRawHash(p);
    if (mockTickets[txHash]) {
      return cloneDeep(mockTickets[txHash]);
    }
    let ticket;
    mockStakeTransactionList.forEach((tx) => {
      if (tx.ticket?.txHash == txHash) {
        ticket = tx.ticket;
      }
      if (tx.spender?.txHash == txHash) {
        ticket = tx.spender;
      }
    });
    return cloneDeep(ticket);
  });

  wallet.getTransaction = jest.fn((_, txHash) => {
    if (mockSpenderTransactions[txHash]) {
      return cloneDeep(mockSpenderTransactions[txHash]);
    }
  });

  mockGetVSPTicketsByFeeStatus = wallet.getVSPTicketsByFeeStatus = jest.fn(
    (_, feeStatus) =>
      Promise.resolve({
        ticketHashes:
          feeStatus === VSP_FEE_PROCESS_PAID
            ? [mockMissedTicketHash]
            : feeStatus === VSP_FEE_PROCESS_ERRORED
            ? [mockVotedTicketHash]
            : feeStatus === VSP_FEE_PROCESS_STARTED
            ? [mockUnminedTicketHash]
            : []
      })
  );
  mockGetBalanceUpdateAttempt = clientActions.getBalanceUpdateAttempt = jest.fn(
    () => () => Promise.resolve()
  );
  mockGetStakeInfoAttempt = clientActions.getStakeInfoAttempt = jest.fn(
    () => () => Promise.resolve()
  );
  mockCheckUnmixedAccountBalance = accountMixerActions.checkUnmixedAccountBalance = jest.fn(
    () => () => Promise.resolve()
  );
  mockGetMixerAcctsSpendableBalances = clientActions.getMixerAcctsSpendableBalances = jest.fn(
    () => () => {}
  );
});

test("test transactionNormalizer and ticketNormalizer", async () => {
  const store = createStore(initialState);

  const txs = [
    ...cloneDeep(mockRegularTransactionList),
    ...cloneDeep(mockStakeTransactionList)
  ];
  const expectedNormalizedTxs = {
    ...cloneDeep(mockNormalizedRegularTransactions),
    ...cloneDeep(mockNormalizedStakeTransactions)
  };

  const normalizedTransactions = await transactionActions.normalizeBatchTx(
    walletService,
    TestNetParams,
    store.dispatch,
    txs
  );

  const normalizedTransacitonsList = {};
  normalizedTransactions.forEach((tx) => {
    normalizedTransacitonsList[tx.txHash] = tx;
  });
  expect(
    isEqual(normalizedTransacitonsList, expectedNormalizedTxs)
  ).toBeTruthy();
});

test("test changeTransactionsFilter", () => {
  const testTransactionFilter = {
    search: null,
    listDirection: "desc",
    types: [],
    directions: [],
    maxAmount: null,
    minAmount: null
  };
  const store = createStore({
    grpc: {
      transactionsFilter: testTransactionFilter,
      regularTransactions: "initial",
      getRegularTxsAux: "initial"
    }
  });

  // not changing list direction, regularTransactions and getRegularTxsAux shouldn't touched
  store.dispatch(
    transactionActions.changeTransactionsFilter(testTransactionFilter)
  );
  expect(
    isEqual(store.getState().grpc.transactionsFilter, testTransactionFilter)
  ).toBeTruthy();
  expect(
    isEqual(store.getState().grpc.regularTransactions, "initial")
  ).toBeTruthy();
  expect(
    isEqual(store.getState().grpc.getRegularTxsAux, "initial")
  ).toBeTruthy();

  // change list direction
  const newFilter = { listDirection: "new-listDirection" };
  store.dispatch(transactionActions.changeTransactionsFilter(newFilter));

  expect(
    isEqual(store.getState().grpc.transactionsFilter, newFilter)
  ).toBeTruthy();

  expect(isEqual(store.getState().grpc.regularTransactions, {})).toBeTruthy();
  expect(
    isEqual(store.getState().grpc.getRegularTxsAux, {
      noMoreTransactions: false,
      lastTransaction: null
    })
  ).toBeTruthy();
});

test("test changeTicketsFilter", () => {
  const testTicketsFilter = {
    listDirection: "desc",
    status: null,
    vspFeeStatus: null
  };
  const store = createStore({
    grpc: {
      ticketsFilter: testTicketsFilter,
      stakeTransactions: "initial",
      getStakeTxsAux: "initial"
    }
  });

  // not changing list direction, stakeTransactions and getStakeTxsAux shouldn't touched
  store.dispatch(transactionActions.changeTicketsFilter(testTicketsFilter));
  expect(
    isEqual(store.getState().grpc.ticketsFilter, testTicketsFilter)
  ).toBeTruthy();
  expect(
    isEqual(store.getState().grpc.stakeTransactions, "initial")
  ).toBeTruthy();
  expect(isEqual(store.getState().grpc.getStakeTxsAux, "initial")).toBeTruthy();

  // change list direction
  const newFilter = { listDirection: "new-listDirection" };
  store.dispatch(transactionActions.changeTicketsFilter(newFilter));

  expect(isEqual(store.getState().grpc.ticketsFilter, newFilter)).toBeTruthy();

  expect(isEqual(store.getState().grpc.stakeTransactions, {})).toBeTruthy();
  expect(
    isEqual(store.getState().grpc.getStakeTxsAux, {
      noMoreTransactions: false,
      lastTransaction: null
    })
  ).toBeTruthy();
});

test("test checkAccountsToUpdate function", () => {
  // update accounts related to the transaction balance.
  const newlyUnminedTransactions = [
    {
      credits: [{ account: 0 }, { account: 1 }],
      debits: [{ previousAccount: 2 }, { previousAccount: 3 }]
    }
  ];

  const newlyMinedTransactions = [
    {
      credits: [{ account: 4 }, { account: 5 }],
      debits: [{ previousAccount: 6 }, { previousAccount: 7 }]
    },
    // duplicates
    {
      credits: [{ account: 1 }, { account: 1 }],
      debits: [{ previousAccount: 6 }, { previousAccount: 6 }]
    }
  ];
  //

  const accountsToUpdate = transactionActions.checkAccountsToUpdate([
    ...newlyUnminedTransactions,
    ...newlyMinedTransactions
  ]);

  expect(isEqual(accountsToUpdate, [0, 1, 2, 3, 4, 5, 6, 7])).toBeTruthy();
});

test("test transactionsMaturingHeights function", () => {
  const txs = [
    {
      height: 10,
      type: TransactionDetails.TransactionType.TICKET_PURCHASE,
      credits: [{ account: 4 }, { account: 5 }],
      debits: [{ previousAccount: 6 }, { previousAccount: 7 }]
    },
    {
      height: 10, // same height
      type: TransactionDetails.TransactionType.TICKET_PURCHASE,
      credits: [{ account: 4 }, { account: 5 }, { account: 9 }], // additional account
      debits: [{ previousAccount: 6 }, { previousAccount: 7 }]
    },
    {
      height: 100,
      type: TransactionDetails.TransactionType.TICKET_PURCHASE,
      credits: [{ account: 4 }],
      debits: [{ previousAccount: 7 }]
    },
    {
      height: 200,
      type: TransactionDetails.TransactionType.VOTE,
      credits: [{ account: 5 }],
      debits: [{ previousAccount: 6 }]
    },
    {
      height: 200,
      type: TransactionDetails.TransactionType.REVOCATION,
      credits: [{ account: 5 }],
      debits: [{ previousAccount: 6 }]
    },
    {
      height: 300,
      type: TransactionDetails.TransactionType.VOTE,
      credits: [{ account: 9 }],
      debits: [{ previousAccount: 9 }]
    }
  ];
  const res = transactionActions.transactionsMaturingHeights(
    txs,
    TestNetParams
  );
  expect(
    isEqual(res, {
      11: [4, 5, 6, 7, 9], // height(10) +  SStxChangeMaturity(1)
      26: [4, 5, 6, 7, 9], // height(10) +  TicketMaturity(16)
      6154: [4, 5, 6, 7, 9], // height(10) +  TicketExpiry(6144)

      101: [4, 7], // height(100) +  SStxChangeMaturity(1)
      116: [4, 7], // height(100) +  TicketMaturity(16)
      6244: [4, 7], // height(100) +  TicketExpiry(6144)

      216: [5, 6], // height(200) +  CoinbaseMaturity(16)

      316: [9] // height(200) +  CoinbaseMaturity(16)
    })
  ).toBeTruthy();
});

test("test getNewAccountAddresses function", () => {
  const store = createStore({});
  const txs = [
    {
      credits: [{ account: 4 }, { account: 5 }]
    },
    {
      credits: [{ account: 4 }, { account: 5 }, { account: 9 }] // additional account
    },
    {
      credits: [{ account: 4 }]
    }
  ];
  store.dispatch(transactionActions.getNewAccountAddresses(txs));

  expect(mockGetNextAddressAttempt).toHaveBeenNthCalledWith(1, 4);
  expect(mockGetNextAddressAttempt).toHaveBeenNthCalledWith(2, 5);
  expect(mockGetNextAddressAttempt).toHaveBeenNthCalledWith(3, 9);
});

test("test checkForStakeTransactions function", () => {
  expect(
    transactionActions.checkForStakeTransactions([
      {
        isStake: undefined
      }
    ])
  ).toBeFalsy();

  expect(
    transactionActions.checkForStakeTransactions([
      {
        isStake: false
      },
      {
        isStake: false
      }
    ])
  ).toBeFalsy();

  expect(
    transactionActions.checkForStakeTransactions([
      {
        isStake: true
      },
      {
        isStake: false
      },
      {
        isStake: undefined
      }
    ])
  ).toBeTruthy();
});

test("test divideTransactions function", () => {
  const txs = [
    {
      txHash: "stakeTxHash",
      isStake: true
    },
    {
      txHash: "regularTxHash",
      isStake: false
    },
    {
      txHash: "unknownTxHash",
      isStake: undefined
    },
    {
      txHash: "stakeTxHash2",
      isStake: true
    }
  ];
  const res = transactionActions.divideTransactions(txs);
  expect(
    isEqual(res, {
      stakeTransactions: {
        stakeTxHash: { txHash: "stakeTxHash", isStake: true },
        stakeTxHash2: { txHash: "stakeTxHash2", isStake: true }
      },
      regularTransactions: {
        regularTxHash: { txHash: "regularTxHash", isStake: false },
        unknownTxHash: { txHash: "unknownTxHash", isStake: undefined }
      }
    })
  ).toBeTruthy();
});

test("test getNonWalletOutputs function (called with less than MaxNonWalletOutputs)", async () => {
  const tx = {
    rawTx: [1, 2, 3]
  };
  const mockDecodedTx = {
    outputs: [
      { decodedScript: { address: "test-address-1" }, value: 1 },
      { decodedScript: { address: "test-address-2" }, value: 2 }
    ]
  };
  mockDecodeRawTransaction = wallet.decodeRawTransaction = jest.fn(
    () => mockDecodedTx
  );
  mockValidateAddress = wallet.validateAddress = jest.fn((_, address) => ({
    // first output will be mine, the rest is not
    isMine: address === mockDecodedTx.outputs[0].decodedScript.address
  }));
  const updatedOutputs = await transactionActions.getNonWalletOutputs(
    walletService,
    TestNetParams,
    tx
  );
  expect(mockDecodeRawTransaction).toHaveBeenCalledWith(
    testRawTxHex,
    TestNetParams
  );
  expect(mockValidateAddress).toHaveBeenCalledTimes(
    mockDecodedTx.outputs.length
  );
  expect(mockValidateAddress).toHaveBeenNthCalledWith(
    1,
    walletService,
    "test-address-1"
  );
  expect(mockValidateAddress).toHaveBeenNthCalledWith(
    2,
    walletService,
    "test-address-2"
  );
  expect(
    isEqual(updatedOutputs, [
      { address: "test-address-1", value: 1, isChange: true },
      { address: "test-address-2", value: 2, isChange: false }
    ])
  ).toBeTruthy();
});

test("test getNonWalletOutputs function (called with more outputs than MaxNonWalletOutputs)", async () => {
  const tx = {
    rawTx: [1, 2, 3]
  };
  const mockDecodedTx = {
    outputs: []
  };

  for (let i = 0; i <= MaxNonWalletOutputs + 1; i++) {
    mockDecodedTx.outputs.push({
      decodedScript: { address: `test-address-${i}` },
      value: i
    });
  }

  mockDecodeRawTransaction = wallet.decodeRawTransaction = jest.fn(
    () => mockDecodedTx
  );
  const updatedOutputs = await transactionActions.getNonWalletOutputs(
    walletService,
    TestNetParams,
    tx
  );
  expect(mockDecodeRawTransaction).toHaveBeenCalledWith(
    testRawTxHex,
    TestNetParams
  );
  expect(mockValidateAddress).not.toHaveBeenCalled();
  expect(
    isEqual(
      updatedOutputs,
      mockDecodedTx.outputs.map((output) => ({
        address: output.decodedScript.address,
        value: output.value
      }))
    )
  ).toBeTruthy();
});

test("test getNonWalletOutputs function fails", async () => {
  const tx = {
    rawTx: [1, 2, 3]
  };

  mockDecodeRawTransaction = wallet.decodeRawTransaction = jest.fn(() => {
    throw "error";
  });
  let error;
  try {
    await transactionActions.getNonWalletOutputs(
      walletService,
      TestNetParams,
      tx
    );
  } catch (e) {
    error = e;
  }
  expect(mockDecodeRawTransaction).toHaveBeenCalledWith(
    testRawTxHex,
    TestNetParams
  );
  expect(mockValidateAddress).not.toHaveBeenCalled();
  expect(isEqual(error, "error")).toBeTruthy();
});

test("test getMissingStakeTxData function (REVOKED)", async () => {
  const tx = {
    rawTx: [1, 2, 3]
  };
  const mockDecodedTx = {
    inputs: [{ prevTxId: "test-prev-tx-id-1" }]
  };
  const mockTicket = {
    ticket: "e3bae353b60cb90af66e277ce80fa238e942675e3a2cbe45331b9a010dd006bc"
  };
  mockDecodeRawTransaction = wallet.decodeRawTransaction = jest.fn(
    () => mockDecodedTx
  );

  const mockGetTicket = (wallet.getTicket = jest.fn(() => mockTicket));
  const res = await transactionActions.getMissingStakeTxData(
    walletService,
    TestNetParams,
    tx
  );
  expect(mockGetTicket).toHaveBeenCalledWith(
    walletService,
    strHashToRaw(mockDecodedTx.inputs[0].prevTxId)
  );
  expect(mockDecodeRawTransaction).toHaveBeenCalledWith(
    testRawTxHex,
    TestNetParams
  );
  expect(
    isEqual(res, { ticket: mockTicket.ticket, spender: tx, status: REVOKED })
  ).toBeTruthy();
});

test("test getMissingStakeTxData function (REVOKED, more than one inputs)", async () => {
  const tx = {
    rawTx: [1, 2, 3]
  };
  const mockDecodedTx = {
    inputs: [
      {
        prevTxId:
          "e3bae353b60cb90af66e277ce80fa238e942675e3a2cbe45331b9a010dd006bc"
      },
      {
        prevTxId:
          "045bd5f19c97b926fe4d090c06a2c25481f5f32d5cefc31ffb36ef86e140b199"
      },
      {
        prevTxId:
          "51cd137ae3bbe9acebd9dc6b364b6bf8350602db783e78de6a345f264d592068"
      }
    ]
  };
  const mockTicket = { ticket: "test-ticket-data" };
  mockDecodeRawTransaction = wallet.decodeRawTransaction = jest.fn(
    () => mockDecodedTx
  );

  const mockGetTicket = (wallet.getTicket = jest.fn(() => mockTicket));
  const res = await transactionActions.getMissingStakeTxData(
    walletService,
    TestNetParams,
    tx
  );
  expect(mockGetTicket).toHaveBeenCalledWith(
    walletService,
    strHashToRaw(mockDecodedTx.inputs[1].prevTxId) // use the second input, if it's present
  );
  expect(mockDecodeRawTransaction).toHaveBeenCalledWith(
    testRawTxHex,
    TestNetParams
  );
  expect(
    isEqual(res, { ticket: mockTicket.ticket, spender: tx, status: REVOKED })
  ).toBeTruthy();
});

test("test getMissingStakeTxData function (VOTED)", async () => {
  const tx = {
    rawTx: [1, 2, 3],
    txType: VOTE
  };
  const mockDecodedTx = {
    inputs: [{ prevTxId: "test-prev-tx-id-1" }]
  };
  const mockTicket = {
    ticket: "e3bae353b60cb90af66e277ce80fa238e942675e3a2cbe45331b9a010dd006bc"
  };
  mockDecodeRawTransaction = wallet.decodeRawTransaction = jest.fn(
    () => mockDecodedTx
  );

  const mockGetTicket = (wallet.getTicket = jest.fn(() => mockTicket));
  const res = await transactionActions.getMissingStakeTxData(
    walletService,
    TestNetParams,
    tx
  );
  expect(mockGetTicket).toHaveBeenCalledWith(
    walletService,
    strHashToRaw(mockDecodedTx.inputs[0].prevTxId)
  );
  expect(mockDecodeRawTransaction).toHaveBeenCalledWith(
    testRawTxHex,
    TestNetParams
  );
  expect(
    isEqual(res, { ticket: mockTicket.ticket, spender: tx, status: VOTED })
  ).toBeTruthy();
});

test("test getMissingStakeTxData function (VOTED, ticket NOT_FOUND)", async () => {
  const tx = {
    rawTx: [1, 2, 3],
    txType: VOTE
  };
  const mockDecodedTx = {
    inputs: [{ prevTxId: "test-prev-tx-id-1" }]
  };
  mockDecodeRawTransaction = wallet.decodeRawTransaction = jest.fn(
    () => mockDecodedTx
  );

  const mockGetTicket = (wallet.getTicket = jest.fn(() => {
    throw "NOT_FOUND";
  }));
  const res = await transactionActions.getMissingStakeTxData(
    walletService,
    TestNetParams,
    tx
  );
  expect(mockGetTicket).toHaveBeenCalledWith(
    walletService,
    strHashToRaw(mockDecodedTx.inputs[0].prevTxId)
  );
  expect(mockDecodeRawTransaction).toHaveBeenCalledWith(
    testRawTxHex,
    TestNetParams
  );
  expect(
    isEqual(res, { ticket: undefined, spender: tx, status: VOTED })
  ).toBeTruthy();
});

test("test getMissingStakeTxData function (VOTED, getting tickket fails with unknown error)", async () => {
  const tx = {
    rawTx: [1, 2, 3],
    txType: VOTE
  };
  const mockDecodedTx = {
    inputs: [{ prevTxId: "test-prev-tx-id-1" }]
  };
  mockDecodeRawTransaction = wallet.decodeRawTransaction = jest.fn(
    () => mockDecodedTx
  );

  const mockGetTicket = (wallet.getTicket = jest.fn(() => {
    throw "UNKNOWN_ERROR";
  }));
  let error;
  let res;
  try {
    res = await transactionActions.getMissingStakeTxData(
      walletService,
      TestNetParams,
      tx
    );
  } catch (e) {
    error = e;
  }
  expect(error).toBe("UNKNOWN_ERROR");
  expect(mockGetTicket).toHaveBeenCalledWith(
    walletService,
    strHashToRaw(mockDecodedTx.inputs[0].prevTxId)
  );
  expect(mockDecodeRawTransaction).toHaveBeenCalledWith(
    testRawTxHex,
    TestNetParams
  );
  expect(res).toBe(undefined);
});

test("test getMissingStakeTxData function (TICKET)", async () => {
  const tx = {
    rawTx: [1, 2, 3],
    txType: TICKET,
    txHash: "caa80c92647a4b7cc205de8326a1759138be6a9a884e7984b3cf908aa4a840db"
  };
  const mockTicket = {
    status: IMMATURE,
    spender: {
      hash: "045bd5f19c97b926fe4d090c06a2c25481f5f32d5cefc31ffb36ef86e140b199"
    },
    ticket: {
      vspHost: mockVspHost
    }
  };
  const mockTransaction = "mock-transaction";
  const mockGetTicket = (wallet.getTicket = jest.fn(() => mockTicket));
  const mockGetTransaction = (wallet.getTransaction = jest.fn(
    () => mockTransaction
  ));
  const res = await transactionActions.getMissingStakeTxData(
    walletService,
    TestNetParams,
    tx
  );
  expect(mockGetTicket).toHaveBeenCalledWith(
    walletService,
    strHashToRaw(tx.txHash)
  );
  expect(mockGetTransaction).toHaveBeenCalledWith(
    walletService,
    mockTicket.spender.hash
  );
  expect(
    isEqual(res, {
      ticket: { ...tx, vspHost: mockVspHost },
      spender: mockTransaction,
      status: IMMATURE
    })
  ).toBeTruthy();
});

test("test getMissingStakeTxData function (TICKET, transaction is NOT_FOUND)", async () => {
  const tx = {
    rawTx: [1, 2, 3],
    txType: TICKET,
    txHash: "caa80c92647a4b7cc205de8326a1759138be6a9a884e7984b3cf908aa4a840db"
  };
  const mockTicket = {
    status: IMMATURE,
    spender: {
      hash: "045bd5f19c97b926fe4d090c06a2c25481f5f32d5cefc31ffb36ef86e140b199"
    },
    ticket: {
      vspHost: mockVspHost
    }
  };
  const mockGetTicket = (wallet.getTicket = jest.fn(() => mockTicket));
  const mockGetTransaction = (wallet.getTransaction = jest.fn(() =>
    Promise.reject("NOT_FOUND")
  ));
  const res = await transactionActions.getMissingStakeTxData(
    walletService,
    TestNetParams,
    tx
  );
  expect(mockGetTicket).toHaveBeenCalledWith(
    walletService,
    strHashToRaw(tx.txHash)
  );
  expect(mockGetTransaction).toHaveBeenCalledWith(
    walletService,
    mockTicket.spender.hash
  );
  expect(
    isEqual(res, {
      ticket: { ...tx, vspHost: mockVspHost },
      spender: undefined,
      status: IMMATURE
    })
  ).toBeTruthy();
});

test("test getMissingStakeTxData function (TICKET, getting transaction fails with UNKNOWN_ERROR)", async () => {
  const tx = {
    rawTx: [1, 2, 3],
    txType: TICKET,
    txHash: "caa80c92647a4b7cc205de8326a1759138be6a9a884e7984b3cf908aa4a840db"
  };
  const mockTicket = {
    status: IMMATURE,
    spender: {
      hash: "045bd5f19c97b926fe4d090c06a2c25481f5f32d5cefc31ffb36ef86e140b199"
    },
    ticket: {
      vspHost: mockVspHost
    }
  };
  const mockGetTicket = (wallet.getTicket = jest.fn(() => mockTicket));
  const mockGetTransaction = (wallet.getTransaction = jest.fn(() =>
    Promise.reject("UNKNOWN_ERROR")
  ));
  let error, res;
  try {
    res = await transactionActions.getMissingStakeTxData(
      walletService,
      TestNetParams,
      tx
    );
  } catch (e) {
    error = e;
  }
  expect(error).toBe("UNKNOWN_ERROR");
  expect(mockGetTicket).toHaveBeenCalledWith(
    walletService,
    strHashToRaw(tx.txHash)
  );
  expect(mockGetTransaction).toHaveBeenCalledWith(
    walletService,
    mockTicket.spender.hash
  );
  expect(res).toBe(undefined);
});

test("test getMissingStakeTxData function (TICKET, spender hash is missing)", async () => {
  const tx = {
    rawTx: [1, 2, 3],
    txType: TICKET,
    txHash: "caa80c92647a4b7cc205de8326a1759138be6a9a884e7984b3cf908aa4a840db"
  };
  const mockTicket = {
    status: IMMATURE,
    spender: {},
    ticket: {
      vspHost: mockVspHost
    }
  };
  const mockGetTicket = (wallet.getTicket = jest.fn(() => mockTicket));
  const res = await transactionActions.getMissingStakeTxData(
    walletService,
    TestNetParams,
    tx
  );
  expect(mockGetTicket).toHaveBeenCalledWith(
    walletService,
    strHashToRaw(tx.txHash)
  );
  expect(
    isEqual(res, {
      ticket: { ...tx, vspHost: mockVspHost },
      spender: undefined,
      status: IMMATURE
    })
  ).toBeTruthy();
});

test("test getMissingStakeTxData function (TICKET, getting ticket fails with unknown error)", async () => {
  const tx = {
    rawTx: [1, 2, 3],
    txType: TICKET,
    txHash: "caa80c92647a4b7cc205de8326a1759138be6a9a884e7984b3cf908aa4a840db"
  };
  const mockGetTicket = (wallet.getTicket = jest.fn(() => {
    throw "UNKNOWN_ERROR";
  }));
  let error;
  let res;
  try {
    res = await transactionActions.getMissingStakeTxData(
      walletService,
      TestNetParams,
      tx
    );
  } catch (e) {
    error = e;
  }
  expect(error).toBe("UNKNOWN_ERROR");
  expect(mockGetTicket).toHaveBeenCalledWith(
    walletService,
    strHashToRaw(tx.txHash)
  );
  expect(res).toBe(undefined);
});

test("test getStartupTransactions (empty list)", async () => {
  const initialState = { grpc: { walletService } };
  const store = createStore(initialState);
  const mockGetTransactions = (wallet.getTransactions = jest.fn(() => ({
    unmined: [],
    mined: []
  })));

  await store.dispatch(transactionActions.getStartupTransactions());

  expect(mockGetTransactions).toHaveBeenNthCalledWith(
    1,
    walletService,
    -1,
    -1,
    50
  );

  expect(
    isEqual(store.getState().grpc, {
      walletService,
      recentRegularTransactions: [],
      recentStakeTransactions: [],
      maturingBlockHeights: {},
      stakeTransactions: {},
      regularTransactions: {}
    })
  ).toBeTruthy();
});

test("test getStartupTransactions", async () => {
  const store = createStore(initialState);

  let callCount = 0;
  const mockGetTransactions = (wallet.getTransactions = jest.fn(() => {
    const res = {
      unmined: cloneDeep(mockUnminedTransactions[callCount]),
      mined: cloneDeep(mockMinedTransactions[callCount])
    };
    callCount += 1;
    return res;
  }));

  await store.dispatch(transactionActions.getStartupTransactions());

  expect(mockGetTransactions).toHaveBeenNthCalledWith(
    1,
    walletService,
    -1,
    -1,
    50
  );

  const expectedStoreValues = {
    walletService,
    getAccountsResponse: initialState.grpc.getAccountsResponse,
    maturingBlockHeights: {
      0: [0],
      15: [0],
      6143: [0],
      919843: [0, 15],
      919858: [0, 15],
      925986: [0, 15],
      932753: [15, 0]
    },
    recentRegularTransactions: [
      mockNormalizedRegularTransactions[mockRegularPendingTxHash]
    ],
    recentStakeTransactions: [
      mockNormalizedStakeTransactions[mockUnminedTicketHash],
      mockNormalizedStakeTransactions[mockVoteTx],
      mockNormalizedStakeTransactions[mockVotedTicketHash]
    ],
    stakeTransactions: {
      [mockUnminedTicketHash]:
        mockNormalizedStakeTransactions[mockUnminedTicketHash],
      [mockVoteTx]: mockNormalizedStakeTransactions[mockVoteTx],
      [mockVotedTicketHash]:
        mockNormalizedStakeTransactions[mockVotedTicketHash]
    },
    regularTransactions: {
      [mockRegularPendingTxHash]:
        mockNormalizedRegularTransactions[mockRegularPendingTxHash]
    }
  };

  expect(isEqual(store.getState().grpc, expectedStoreValues)).toBeTruthy();
});

const getInitialStateForGetTransactions = (listDirection = "desc") => {
  const initialStateCopy = cloneDeep(initialState);
  initialStateCopy.grpc.currentBlockHeight = 964427;
  initialStateCopy.grpc.regularTransactions = {
    [mockRegularReceivedTxHash]: cloneDeep(
      mockNormalizedRegularTransactions[mockRegularReceivedTxHash]
    )
  };
  initialStateCopy.grpc.stakeTransactions = {
    [mockMissedTicketHash]: cloneDeep(
      mockNormalizedStakeTransactions[mockMissedTicketHash]
    )
  };
  initialStateCopy.grpc.transactionsFilter = {
    listDirection,
    types: [],
    directions: []
  };
  initialStateCopy.grpc.ticketsFilter = {
    listDirection
  };
  initialStateCopy.grpc.getRegularTxsAux = {
    noMoreTransactions: false,
    lastTransaction: null
  };
  initialStateCopy.grpc.getStakeTxsAux = {
    noMoreTransactions: false,
    lastTransaction: null
  };
  return initialStateCopy;
};

test("test getTransactions (fetching regular txs)", async () => {
  const initialStateCopy = cloneDeep(getInitialStateForGetTransactions());
  const store = createStore(initialStateCopy);

  let callCount = 0;
  const mockGetTransactions = (wallet.getTransactions = jest.fn(() => {
    const res = {
      unmined: cloneDeep(mockUnminedTransactions[callCount]),
      mined: cloneDeep(mockMinedTransactions[callCount])
    };
    callCount += 1;
    return res;
  }));

  await store.dispatch(transactionActions.getTransactions());

  expect(mockGetTransactions).toHaveBeenNthCalledWith(
    1,
    walletService,
    -1,
    -1,
    0
  );
  expect(mockGetTransactions).toHaveBeenNthCalledWith(
    2,
    walletService,
    initialStateCopy.grpc.currentBlockHeight,
    1,
    BATCH_TX_COUNT
  );
  expect(mockGetTransactions).toHaveBeenNthCalledWith(
    3,
    walletService,
    mockStakeTransactions[mockVotedTicketHash].height - 1, // last transaction's height -1
    1,
    BATCH_TX_COUNT
  );

  const expectedRegularTransactions = {
    ...initialStateCopy.grpc.regularTransactions,
    [mockRegularPendingTxHash]:
      mockNormalizedRegularTransactions[mockRegularPendingTxHash]
  };
  // stakeTransactions and getStakeTxsAux shuld not changed
  expect(
    isEqual(
      store.getState().grpc.stakeTransactions,
      initialStateCopy.grpc.stakeTransactions
    )
  ).toBeTruthy();
  expect(
    isEqual(
      store.getState().grpc.getStakeTxsAux,
      initialStateCopy.grpc.getStakeTxsAux
    )
  ).toBeTruthy();
  expect(
    isEqual(
      store.getState().grpc.regularTransactions,
      expectedRegularTransactions
    )
  ).toBeTruthy();

  expect(
    isEqual(store.getState().grpc.getRegularTxsAux, {
      noMoreTransactions: true,
      lastTransaction: mockNormalizedStakeTransactions[mockVotedTicketHash]
    })
  ).toBeTruthy();
});

test("test getTransactions (fetching regular txs, listing asc)", async () => {
  const initialStateCopy = getInitialStateForGetTransactions("asc");
  const store = createStore(initialStateCopy);

  let callCount = 0;
  const mockGetTransactions = (wallet.getTransactions = jest.fn(() => {
    const res = {
      unmined: cloneDeep(mockUnminedTransactions[callCount]),
      mined: cloneDeep(mockMinedTransactions[callCount])
    };
    callCount += 1;
    return res;
  }));

  await store.dispatch(transactionActions.getTransactions());

  expect(mockGetTransactions).toHaveBeenNthCalledWith(
    1,
    walletService,
    -1,
    -1,
    0
  );
  expect(mockGetTransactions).toHaveBeenNthCalledWith(
    2,
    walletService,
    1,
    initialStateCopy.grpc.currentBlockHeight,
    BATCH_TX_COUNT
  );
  expect(mockGetTransactions).toHaveBeenNthCalledWith(
    3,
    walletService,
    mockStakeTransactions[mockVotedTicketHash].height + 1, // last transaction's height + 1
    initialStateCopy.grpc.currentBlockHeight,
    BATCH_TX_COUNT
  );

  const expectedRegularTransactions = {
    ...initialStateCopy.grpc.regularTransactions,
    [mockRegularPendingTxHash]:
      mockNormalizedRegularTransactions[mockRegularPendingTxHash]
  };
  // stakeTransactions and getStakeTxsAux shuld not changed
  expect(
    isEqual(
      store.getState().grpc.stakeTransactions,
      initialStateCopy.grpc.stakeTransactions
    )
  ).toBeTruthy();
  expect(
    isEqual(
      store.getState().grpc.getStakeTxsAux,
      initialStateCopy.grpc.getStakeTxsAux
    )
  ).toBeTruthy();
  expect(
    isEqual(
      store.getState().grpc.regularTransactions,
      expectedRegularTransactions
    )
  ).toBeTruthy();

  expect(
    isEqual(store.getState().grpc.getRegularTxsAux, {
      noMoreTransactions: true,
      lastTransaction: mockNormalizedStakeTransactions[mockVotedTicketHash]
    })
  ).toBeTruthy();
});

test("test getTransactions (fetching stake txs)", async () => {
  const initialStateCopy = getInitialStateForGetTransactions();
  const store = createStore(initialStateCopy);

  let callCount = 0;
  const mockGetTransactions = (wallet.getTransactions = jest.fn(() => {
    const res = {
      unmined: cloneDeep(mockUnminedTransactions[callCount]),
      mined: cloneDeep(mockMinedTransactions[callCount])
    };
    callCount += 1;
    return res;
  }));

  await store.dispatch(transactionActions.getTransactions(true));

  expect(mockGetTransactions).toHaveBeenNthCalledWith(
    1,
    walletService,
    -1,
    -1,
    0
  );
  expect(mockGetTransactions).toHaveBeenNthCalledWith(
    2,
    walletService,
    initialStateCopy.grpc.currentBlockHeight,
    1,
    BATCH_TX_COUNT
  );
  expect(mockGetTransactions).toHaveBeenNthCalledWith(
    3,
    walletService,
    mockStakeTransactions[mockVotedTicketHash].height - 1, // last transaction's height -1
    1,
    BATCH_TX_COUNT
  );

  const expectedStakeTransactions = {
    ...initialStateCopy.grpc.stakeTransactions,
    [mockUnminedTicketHash]:
      mockNormalizedStakeTransactions[mockUnminedTicketHash],
    [mockVoteTx]: mockNormalizedStakeTransactions[mockVoteTx],
    [mockVotedTicketHash]: mockNormalizedStakeTransactions[mockVotedTicketHash]
  };

  // regularTransactions and getRegularTxsAux shuld not changed
  expect(
    isEqual(
      store.getState().grpc.regularTransactions,
      initialStateCopy.grpc.regularTransactions
    )
  ).toBeTruthy();
  expect(
    isEqual(
      store.getState().grpc.getRegularTxsAux,
      initialStateCopy.grpc.getRegularTxsAux
    )
  ).toBeTruthy();
  expect(
    isEqual(store.getState().grpc.stakeTransactions, expectedStakeTransactions)
  ).toBeTruthy();

  expect(
    isEqual(store.getState().grpc.getStakeTxsAux, {
      noMoreTransactions: true,
      lastTransaction: mockNormalizedStakeTransactions[mockVotedTicketHash]
    })
  ).toBeTruthy();
});

const getInitialStateForNewTransactionsReceived = () => {
  const initialStateCopy = cloneDeep(initialState);
  initialStateCopy.grpc.unminedTransactions = [];
  initialStateCopy.grpc.regularTransactions = {
    [mockRegularReceivedTxHash]: cloneDeep(
      mockNormalizedRegularTransactions[mockRegularReceivedTxHash]
    )
  };
  initialStateCopy.grpc.stakeTransactions = {
    [mockMissedTicketHash]: cloneDeep(
      mockNormalizedStakeTransactions[mockMissedTicketHash]
    )
  };
  initialStateCopy.grpc.recentRegularTransactions = [
    cloneDeep(mockNormalizedRegularTransactions[mockRegularSelfTxHash])
  ];
  initialStateCopy.grpc.recentStakeTransactions = [];

  return initialStateCopy;
};

test("test newTransactionsReceived (received empty lists)", async () => {
  const initialStateCopy = getInitialStateForNewTransactionsReceived();
  const store = createStore(initialStateCopy);

  await store.dispatch(transactionActions.newTransactionsReceived([], []));

  expect(mockGetVSPTicketsByFeeStatus).not.toHaveBeenCalled();
  expect(mockGetBalanceUpdateAttempt).not.toHaveBeenCalled();
  expect(mockGetStakeInfoAttempt).not.toHaveBeenCalled();
  expect(mockCheckUnmixedAccountBalance).not.toHaveBeenCalled();
  expect(mockGetMixerAcctsSpendableBalances).not.toHaveBeenCalled();

  // console.log(store.getState().grpc);

  expect(
    isEqual(store.getState().grpc.regularTransactions, {
      [mockRegularReceivedTxHash]:
        mockNormalizedRegularTransactions[mockRegularReceivedTxHash]
    })
  ).toBeTruthy();
  expect(
    isEqual(store.getState().grpc.stakeTransactions, {
      [mockMissedTicketHash]:
        mockNormalizedStakeTransactions[mockMissedTicketHash]
    })
  ).toBeTruthy();

  expect(
    isEqual(store.getState().grpc.recentRegularTransactions, [
      mockNormalizedRegularTransactions[mockRegularSelfTxHash]
    ])
  ).toBeTruthy();
  expect(
    isEqual(store.getState().grpc.recentStakeTransactions, [])
  ).toBeTruthy();
  expect(isEqual(store.getState().grpc.unminedTransactions, [])).toBeTruthy();
});

test("test newTransactionsReceived", async () => {
  const initialStateCopy = getInitialStateForNewTransactionsReceived();
  const store = createStore(initialStateCopy);

  const newlyUnminedTransactions = [
    cloneDeep(mockRegularTransactions[mockRegularPendingTxHash]),
    cloneDeep(mockStakeTransactions[mockUnminedTicketHash])
  ];
  const newlyMinedTransactions = [
    cloneDeep(mockStakeTransactions[mockVoteTx]),
    cloneDeep(mockRegularTransactions[mockRegularMixedTxHash]),
    cloneDeep(mockStakeTransactions[mockVotedTicketHash])
  ];

  await store.dispatch(
    transactionActions.newTransactionsReceived(
      newlyMinedTransactions,
      newlyUnminedTransactions
    )
  );

  expect(mockGetVSPTicketsByFeeStatus).toHaveBeenNthCalledWith(
    1,
    walletService,
    VSP_FEE_PROCESS_ERRORED
  );
  expect(mockGetVSPTicketsByFeeStatus).toHaveBeenNthCalledWith(
    2,
    walletService,
    VSP_FEE_PROCESS_STARTED
  );
  expect(mockGetVSPTicketsByFeeStatus).toHaveBeenNthCalledWith(
    3,
    walletService,
    VSP_FEE_PROCESS_PAID
  );
  expect(mockGetVSPTicketsByFeeStatus).toHaveBeenNthCalledWith(
    4,
    walletService,
    VSP_FEE_PROCESS_CONFIRMED
  );
  expect(mockGetBalanceUpdateAttempt).toHaveBeenCalledWith(0, 0);
  expect(mockGetStakeInfoAttempt).toHaveBeenCalled();
  expect(mockCheckUnmixedAccountBalance).toHaveBeenCalledWith(
    testChangeAccountId
  );
  expect(mockGetMixerAcctsSpendableBalances).toHaveBeenCalled();

  expect(
    isEqual(store.getState().grpc.regularTransactions, {
      [mockRegularPendingTxHash]:
        mockNormalizedRegularTransactions[mockRegularPendingTxHash],
      [mockRegularMixedTxHash]:
        mockNormalizedRegularTransactions[mockRegularMixedTxHash],
      [mockRegularReceivedTxHash]:
        mockNormalizedRegularTransactions[mockRegularReceivedTxHash]
    })
  ).toBeTruthy();
  expect(
    isEqual(store.getState().grpc.stakeTransactions, {
      [mockUnminedTicketHash]: {
        ...mockNormalizedStakeTransactions[mockUnminedTicketHash],
        feeStatus: VSP_FEE_PROCESS_STARTED.toString()
      },
      [mockVoteTx]: mockNormalizedStakeTransactions[mockVoteTx],
      [mockVotedTicketHash]: {
        ...mockNormalizedStakeTransactions[mockVotedTicketHash],
        feeStatus: VSP_FEE_PROCESS_ERRORED
      },
      [mockMissedTicketHash]: {
        ...mockNormalizedStakeTransactions[mockMissedTicketHash],
        feeStatus: VSP_FEE_PROCESS_PAID
      }
    })
  ).toBeTruthy();

  expect(
    isEqual(store.getState().grpc.recentRegularTransactions, [
      mockNormalizedRegularTransactions[mockRegularPendingTxHash],
      mockNormalizedRegularTransactions[mockRegularMixedTxHash],
      mockNormalizedRegularTransactions[mockRegularSelfTxHash]
    ])
  ).toBeTruthy();

  expect(
    isEqual(store.getState().grpc.recentStakeTransactions, [
      {
        ...mockNormalizedStakeTransactions[mockUnminedTicketHash],
        feeStatus: VSP_FEE_PROCESS_STARTED.toString()
      },
      mockNormalizedStakeTransactions[mockVoteTx],
      {
        ...mockNormalizedStakeTransactions[mockVotedTicketHash],
        feeStatus: VSP_FEE_PROCESS_ERRORED
      }
    ])
  ).toBeTruthy();

  expect(
    isEqual(store.getState().grpc.unminedTransactions, [
      mockNormalizedRegularTransactions[mockRegularPendingTxHash],
      {
        ...mockNormalizedStakeTransactions[mockUnminedTicketHash],
        feeStatus: VSP_FEE_PROCESS_STARTED.toString()
      }
    ])
  ).toBeTruthy();
});
