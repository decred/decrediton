// @flow
import Transaction from "./Transaction";
import Message from "./Message";
import {
  TRANSACTION_DIR_SENT,
  TRANSACTION_DIR_RECEIVED,
  TRANSACTION_DIR_TRANSFERRED,
  TICKET,
  VOTE,
  REVOCATION
} from "constants/Decrediton";

const transactionTypes = [
  TRANSACTION_DIR_SENT,
  TRANSACTION_DIR_RECEIVED,
  TRANSACTION_DIR_TRANSFERRED,
  TICKET,
  VOTE,
  REVOCATION
];

const Notification = ({
  topNotification,
  progress,
  onDismissMessages,
  type,
  ...message
}) =>
  transactionTypes.indexOf(type) > -1 ? (
    <Transaction
      {...{ topNotification, progress, onDismissMessages, type, ...message }}
    />
  ) : (
    <Message
      {...{ topNotification, progress, onDismissMessages, ...message, type }}
    />
  );

export default Notification;
