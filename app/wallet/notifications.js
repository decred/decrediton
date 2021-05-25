import { walletrpc as api } from "middleware/walletrpc/api_pb";
import { withLog as log } from "./index";
import { shimStreamedResponse } from "helpers/electronRenderer";

const { TransactionNotificationsRequest, AccountNotificationsRequest } = api;

export const transactionNotifications = log(
  async (walletService) =>
    shimStreamedResponse(
      await walletService.transactionNotifications(
        new TransactionNotificationsRequest()
      )
    ),
  "Get Transaction Notifications"
);

export const accountNotifications = log(
  async (walletService) =>
    shimStreamedResponse(
      await walletService.accountNotifications(
        new AccountNotificationsRequest()
      )
    ),
  "Get Account Notifications"
);
