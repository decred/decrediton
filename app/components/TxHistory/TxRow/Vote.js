import React from "react";
import Status from "./Status";
import Radium from "radium";
import styles from "./styles";

const Vote = ({ accountName, pending, date, onClick }) => (
  <div  style={onClick ? styles.voteTx : styles.voteTxOverview} {...{ onClick }}>
    <div style={styles.transactionAmount}>Vote</div>
    <Status {...{ accountName, pending, date }} />
  </div>
);

export default Radium(Vote);
