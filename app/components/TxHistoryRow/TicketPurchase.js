import React from "react";
import Status from "./Status";
import { FormattedMessage as T } from "react-intl";
import "../../style/TxHistory.less";

const TicketPurchase = ({ txAccountName, pending, txTimestamp, onClick }) => (
  <div className={onClick ? "ticket-tx" : "ticket-tx-overview"} {...{ onClick }}>
    <div className="transaction-amount">
      <T id="transaction.type.ticket" m="Ticket" />
    </div>
    <Status {...{ txAccountName, pending, txTimestamp }} />
  </div>
);

export default TicketPurchase;
