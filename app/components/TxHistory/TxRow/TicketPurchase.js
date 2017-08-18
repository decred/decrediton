import React from "react";
import Status from "./Status";
import Radium from "radium";
import styles from "./styles";

const TicketPurchase = ({ accountName, pending, date, onClick }) => (
  <div style={onClick ? styles.ticketTx : styles.ticketTxOverview} {...{ onClick }}>
    <div style={styles.transactionAmount}>Ticket</div>
    <Status {...{ accountName, pending, date }} />
  </div>
);

export default Radium(TicketPurchase);
