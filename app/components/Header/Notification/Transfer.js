// @flow
import React from "react";
import Balance from "../../Balance";
import styles from "../styles";

const Transfer = ({
  type,
  txHash,
  amount,
  fee
}) => (
  <div style={styles.SnackbarInformation}>
    <div style={styles.SnackbarInformationRow}>
      <div style={styles.SnackbarInformationRowTx}>{txHash}</div>
    </div>
    <div style={styles.SnackbarInformationRow}>
      <div style={styles.SnackbarInformationRowType}>{type}</div>
      <div style={styles.SnackbarInformationRowAmount}>
        Amount  <Balance amount={amount}/>
      </div>
      <div style={styles.SnackbarInformationRowFee}>
        Fee  <Balance amount={fee}/>
      </div>
    </div>
  </div>
);

export default Transfer;
