import React from "react";
import Status from "./Status";
import Balance from "../Balance";
import "../../style/TxHistory.less";

const Send = ({ txAccountName, txAmount, pending, date, receiveAddressStr, onClick }) => (
  <div className={onClick ? "transaction-out" : "transaction-out-overview"} {...{ onClick }}>
    <div className="transaction-amount">
      <div className="transaction-amount-number">-<Balance amount={txAmount} /></div>
      <div className="transaction-amount-hash">{receiveAddressStr}</div>
    </div>
    <Status {...{ txAccountName, pending, date }} />
  </div>
);

export default Send;
