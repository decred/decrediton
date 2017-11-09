// @flow
import React from "react";
import { Link } from "react-router";
import Balance from "Balance";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import "style/Header.less";

const messages = defineMessages({
  //same as the types used in index.js
  Ticket: {
    id: "notifications.type.ticket",
    defaultMessage: "Ticket"
  },
  Send: {
    id: "notifications.type.send",
    defaultMessage: "Send"
  },
  Transfer: {
    id: "notifications.type.transfer",
    defaultMessage: "Transfer"
  },
  Receive: {
    id: "notifications.type.receive",
    defaultMessage: "Receive"
  }
});

const Transaction = ({
  type,
  message,
  intl
}) => (
  <div className="snackbar-information">
    <div className="snackbar-information-row">
      <div className="snackbar-information-row-tx"><Link to={`/transactions/history/${message.txHash}`}>{message.txHash}</Link></div>
    </div>
    <div className="snackbar-information-row">
      <div className="snackbar-information-row-type">{intl.formatMessage(messages[type])}</div>
      <div className="snackbar-information-row-amount">
        <T id="notification.transfer.amount" m="Amount" />  <Balance amount={message.amount}/>
      </div>
      <div className="snackbar-information-row-fee">
        <T id="notification.transfer.fee" m="Fee" />  <Balance amount={message.fee}/>
      </div>
    </div>
  </div>
);

export default injectIntl(Transaction);
