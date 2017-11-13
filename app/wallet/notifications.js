import Promise from "promise";
import { TransactionNotificationsRequest, AccountNotificationsRequest} from "middleware/walletrpc/api_pb";
import { transactionNtfs, accountNtfs } from "middleware/grpc/client";

export const getTransactionNotifications = (walletService) =>
  new Promise((resolve) =>
    transactionNtfs(walletService, new TransactionNotificationsRequest(), (data) => resolve(data)));

export const getAccountNotifications = (walletService) =>
  new Promise((resolve) =>
    accountNtfs(walletService, new AccountNotificationsRequest(), (data) => resolve(data)));
