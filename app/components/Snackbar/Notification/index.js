// @flow
import Transaction from "./Transaction";
import Message from "./Message";
import {
  TRANSACTION_DIR_SENT,
  TRANSACTION_DIR_RECEIVED,
  TICKET_FEE,
  TICKET,
  VOTE,
  REVOCATION
} from "constants/Decrediton";

const transactionTypes = [
  TRANSACTION_DIR_SENT,
  TRANSACTION_DIR_RECEIVED,
  TICKET_FEE,
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
}) => {
  return transactionTypes.indexOf(type) > -1 ? (
    <Transaction
      {...{ topNotification, progress, onDismissMessages, type, ...message }}
    />
  ) : (
    <Message
      {...{ topNotification, progress, onDismissMessages, ...message, type }}
    />
  );
};

export default Notification;
