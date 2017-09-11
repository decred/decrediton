import React from "react";
import Status from "./Status";
import "../../style/TxHistory.less";

const TicketPurchase = ({ txAccountName, pending, date, onClick }) => (
  <div className={onClick ? "ticket-tx" : "ticket-tx-overview"} {...{ onClick }}>
    <div className="transaction-amount">Ticket</div>
    <Status {...{ txAccountName, pending, date }} />
  </div>
);

export default TicketPurchase;
