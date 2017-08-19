import React from "react";
import Status from "./Status";
import "../../../style/TxHistory.less";

const Vote = ({ accountName, pending, date, onClick }) => (
  <div className={onClick ? "vote-tx" : "vote-tx-overview"} {...{ onClick }}>
    <div className="transaction-amount">Vote</div>
    <Status {...{ accountName, pending, date }} />
  </div>
);

export default Vote;
