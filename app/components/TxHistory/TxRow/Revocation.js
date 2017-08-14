import React from "react";
import Status from "./Status";
import Radium from "radium";
import styles from "./styles";

const Revocation = ({ accountName, pending, date, onClick }) => (
  <div style={onClick ? styles.revokeTx : styles.revokeTxOverview} {...{ onClick }}>
    <div style={styles.transactionAmount}>Revoke</div>
    <Status {...{ accountName, pending, date }} />
  </div>
);

export default Radium(Revocation);
