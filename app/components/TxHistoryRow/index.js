import React from "react";
import TicketPurchase from "./TicketPurchase";
import Vote from "./Vote";
import Revocation from "./Revocation";
import Send from "./Send";
import Receive from "./Receive";
import Transfer from "./Transfer";

const TxRow = ({
  showTxDetail,
  date,
  pending,
  tx
}) => {
  const Component = (tx.txType === "Ticket") ? (
    TicketPurchase
  ) : (tx.txType === "Vote") ? (
    Vote
  ) : (tx.txType === "Revocation") ? (
    Revocation
  ) : (tx.txDirection === "out") ? (
    Send
  ) : (tx.txDirection === "in") ? (
    Receive
  ) : (tx.txDirection === "transfer") ? (
    Transfer
  ) : null;
  return Component ? (
    <Component
      {...{
        ...tx,
        date,
        pending,
        onClick: showTxDetail ? () => showTxDetail(tx) : null,
        receiveAddressStr: (tx.txDescription.addressStr || []).join(", "),
      }}
    />
  ) : null;
};

export default TxRow;
