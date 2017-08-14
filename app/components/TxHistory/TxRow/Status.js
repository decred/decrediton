import React from "react";
import styles from "./styles";

const Status = ({ accountName, pending, date }) => (
  <div>
    <div style={styles.transactionAccount}>
      <div style={styles.transactionAccountName}>{accountName}</div>
      <div style={styles.transactionAccountIndicator}>
        {pending ? (
          <div style={styles.indicatorPending}>Pending</div>
        ) : (
          <div style={styles.indicatorConfirmed}>Confirmed</div>
        )}
      </div>
    </div>
    {pending ? null : (
      <div style={styles.transactionTimeDate}><span>{date}</span></div>
    )}
  </div>
);

export default Status;
