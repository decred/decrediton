import * as cla from "actions/TransactionActions";
import { createStore } from "test-utils.js";
import { wait } from "@testing-library/react";
import {
  mockRegularTransactions,
  mockStakeTransactions,
  mockNormalizedRegularTransactions
} from "../components/views/TransactionPage/mocks.js";
import { isEqual, cloneDeep } from "lodash/fp";

const transactionActions = cla;

test("test transactionNormalizer", async () => {
  const store = createStore({
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
          }
        ]
      }
    }
  });

  const txs = {
    ...cloneDeep(mockRegularTransactions),
    ...cloneDeep(mockStakeTransactions) // stake txs should not be processed
  };

  const normalizedTransaction = await store.dispatch(
    transactionActions.normalizeRegularTransactions(txs)
  );

  expect(
    isEqual(normalizedTransaction, mockNormalizedRegularTransactions)
  ).toBeTruthy();
});
