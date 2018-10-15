// @flow
import Transaction from "./Transaction";
import Message from "./Message";
import {
  TRANSACTION_DIR_SENT,
  TRANSACTION_DIR_RECEIVED,
  TRANSACTION_DIR_TRANSFERED,
  TRANSACTION_TYPES,
} from "wallet/service";

const transactionTypes = [
  TRANSACTION_DIR_SENT,
  TRANSACTION_DIR_RECEIVED,
  TRANSACTION_DIR_TRANSFERED,
  ...Object.values(TRANSACTION_TYPES)
];

const Notification = ({ topNotification, onDismissMessages, type, ...message }) =>
  (transactionTypes.indexOf(type) > -1)
    ? <Transaction {...{ topNotification, onDismissMessages, type, ...message } } />
    : <Message {...{ topNotification, onDismissMessages, ...message, type } } />;

export default Notification;
