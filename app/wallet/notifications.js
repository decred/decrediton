import Promise from "promise";
import { TransactionNotificationsRequest, AccountNotificationsRequest } from "middleware/walletrpc/api_pb";
import { transactionNtfs, accountNtfs } from "middleware/grpc/client";
import { withLog as log } from "./index";

export const getTransactionNotifications = log((walletService) =>
  new Promise((resolve) =>
    transactionNtfs(walletService, new TransactionNotificationsRequest(), (data) => resolve(data))),
"Get Transaction Notifications");

export const getAccountNotifications = log((walletService) =>
  new Promise((resolve) =>
    accountNtfs(walletService, new AccountNotificationsRequest(), (data) => resolve(data))),
"Get Account Notifications");
