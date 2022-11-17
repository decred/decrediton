import * as cla from "actions/TransactionActions";
import { createStore } from "test-utils.js";
import {
  mockRegularTransactions,
  mockStakeTransactions,
  mockNormalizedRegularTransactions,
  mockNormalizedStakeTransactions
} from "../components/views/TransactionPage/mocks.js";
import { isEqual, cloneDeep } from "lodash/fp";

const transactionActions = cla;
const initialState = {
  settings: {
    currentSettings: {
      network: "testnet"
    }
  },
  grpc: {
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
          accountName: "mixed"
        },
        {
          accountNumber: 7,
          accountName: "unmixed"
        },
        {
          accountNumber: 15,
          accountName: "account-15"
        }
      ]
    }
  }
};

const normalizeTransactions = (txs, store) =>
  Object.keys(txs).reduce((normalizedMap, txHash) => {
    const tx = txs[txHash];
    if (tx.isStake) {
      normalizedMap[txHash] = store.dispatch(
        transactionActions.stakeTransactionNormalizer(tx)
      );
    } else {
      normalizedMap[txHash] = store.dispatch(
        transactionActions.regularTransactionNormalizer(tx)
      );
    }
    return normalizedMap;
  }, {});

test("test transactionNormalizer and ticketNormalizer", () => {
  const store = createStore(initialState);

  const txs = {
    ...cloneDeep(mockRegularTransactions),
    ...cloneDeep(mockStakeTransactions)
  };
  const expectedNormalizedTxs = {
    ...cloneDeep(mockNormalizedRegularTransactions),
    ...cloneDeep(mockNormalizedStakeTransactions)
  };

  const normalizedTransactions = normalizeTransactions(txs, store);
  expect(isEqual(normalizedTransactions, expectedNormalizedTxs)).toBeTruthy();
});
