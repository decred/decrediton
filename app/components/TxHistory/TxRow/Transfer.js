import React from "react";
import Status from "./Status";
import Balance from "../../Balance";
import Radium from "radium";
import styles from "./styles";

const Transfer = ({ accountName, txAmount, pending, date, receiveAddressStr, onClick }) => (
  <div style={onClick ? styles.transactionTransfer : styles.transactionTransferOverview } {...{ onClick }}>
    <div style={styles.transactionAmount}>
      <div style={styles.transactionAmountNumber}>-<Balance amount={txAmount} /></div>
      <div style={styles.transactionAmountHash}>{receiveAddressStr}</div>
    </div>
    <Status {...{ accountName, pending, date }} />
  </div>
);

export default Radium(Transfer);
