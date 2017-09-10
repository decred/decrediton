import React from "react";
import Status from "./Status";
import "../../style/TxHistory.less";

const Revocation = ({ txAccountName, pending, date, onClick }) => (
  <div className={onClick ? "revoke-tx" : "revoke-tx-overview"} {...{ onClick }}>
    <div className="transaction-amount">Revoke</div>
    <Status {...{ txAccountName, pending, date }} />
  </div>
);

export default Revocation;
