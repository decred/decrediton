import React from "react";
import Status from "./Status";
import "../../style/TxHistory.less";

const Revocation = ({ txAccountName, pending, txTimestamp, onClick }) => (
  <div className={onClick ? "revoke-tx" : "revoke-tx-overview"} {...{ onClick }}>
    <div className="transaction-amount">Revoke</div>
    <Status {...{ txAccountName, pending, txTimestamp }} />
  </div>
);

export default Revocation;
