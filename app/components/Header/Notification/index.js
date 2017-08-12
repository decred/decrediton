// @flow
import React from "react";
import Transfer from "./Transfer";
import Message from "./Message";

const Notification = ({ type, ...props }) =>
  (type === "Ticket" || type === "Send" || type === "Transfer" || type === "Receive")
    ? <Transfer {...{ type, ...props } } />
    : <Message {...{ type, ...props } } />;

export default Notification;
