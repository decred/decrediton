// @flow
import Transaction from "./Transaction";
import Message from "./Message";
import {
  TRANSACTION_DIR_SENT,
  TRANSACTION_DIR_RECEIVED,
  TRANSACTION_DIR_TRANSFERRED,
  TRANSACTION_TYPES,
} from "wallet/service";

const transactionTypes = [
  TRANSACTION_DIR_SENT,
  TRANSACTION_DIR_RECEIVED,
  TRANSACTION_DIR_TRANSFERRED,
  ...Object.values(TRANSACTION_TYPES)
];

const Notification = ({ topNotification, progress, onDismissMessages, type, ...message }) =>
  (transactionTypes.indexOf(type) > -1)
    ? <Transaction {...{ topNotification, progress, onDismissMessages, type, ...message } } />
    : <Message {...{ topNotification, progress, onDismissMessages, ...message, type } } />;

export default Notification;
