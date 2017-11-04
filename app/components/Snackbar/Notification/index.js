// @flow
import Transaction from "./Transaction";
import Message from "./Message";

const Notification = ({ type, ...message }) =>
  (type === "Ticket" || type === "Send" || type === "Transfer" || type === "Receive")
    ? <Transaction {...{ type, ...message } } />
    : <Message {...{ ...message, type } } />;

export default Notification;
