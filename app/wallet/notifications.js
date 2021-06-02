import { walletrpc as api } from "middleware/walletrpc/api_pb";
import { withLog as log } from "./index";
import { streamedRequest } from "middleware/grpc/clientTracking";
import { rawHashToHex } from "helpers/byteActions";
import { formatTransaction, formatUnminedTransaction } from "./service";

const { TransactionNotificationsRequest, AccountNotificationsRequest } = api;

export const transactionNotifications = log(
  (walletService) =>
    streamedRequest(
      walletService,
      "transactionNotifications",
      new TransactionNotificationsRequest(),
      (data) => {
        const res = {};
        res.attachedBlocks = data.getAttachedBlocksList().map((b) => ({
          hash: rawHashToHex(b.getHash()),
          height: b.getHeight(),
          timestamp: b.getTimestamp(),
          approvesParent: b.getApprovesParent(),
          prevBlock: rawHashToHex(b.getPrevBlock()),
          transactions: b
            .getTransactionsList()
            .map((tx, i) => formatTransaction(b, tx, i))
        }));

        res.detachedBlocks = data
          .getDetachedBlocksList()
          .map((h) => rawHashToHex(h));

        res.detachedBlockHeaders = data
          .getDetachedBlockHeadersList()
          .map((b) => ({
            hash: rawHashToHex(b.getHash()),
            height: b.getHeight(),
            timestamp: b.getTimestamp(),
            prevBlock: rawHashToHex(b.getPrevBlock())
          }));

        res.unminedTransactions = data
          .getUnminedTransactionsList()
          .map((tx, i) => formatUnminedTransaction(tx, i));

        res.unminedTransactionHashes = data
          .getUnminedTransactionHashesList()
          .map((h) => rawHashToHex(h));

        return res;
      }
    ),
  "Get Transaction Notifications"
);

export const accountNotifications = log(
  (walletService) =>
    streamedRequest(
      walletService,
      "accountNotifications",
      new AccountNotificationsRequest()
    ),
  "Get Account Notifications"
);
