// @flow
import React from "react";
import styles from "../styles";

const Message = ({
  type,
  txHash
}) => (
  <div style={styles.SnackbarInformation}>
    <div style={styles.SnackbarInformationRow}>
      <div style={styles.SnackbarInformationRowTx}>{txHash}</div>
    </div>
    <div style={styles.SnackbarInformationRow}>
      <div style={styles.SnackbarInformationRowType}>{type}</div>
    </div>
  </div>
);

export default Message;
