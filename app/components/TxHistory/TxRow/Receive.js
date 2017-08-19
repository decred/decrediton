import React from "react";
import Status from "./Status";
import Balance from "../../Balance";

const Receive = ({ accountName, txAmount, pending, date, receiveAddressStr, onClick }) => (
  <div className={onClick ? "transaction-in" : "transaction-in-overview"} {...{ onClick }}>
    <div className="transaction-amount">
      <div className="transaction-amount-number"><Balance amount={txAmount} /></div>
      <div className="transaction-amount-hash">{receiveAddressStr}</div>
    </div>
    <Status {...{ accountName, pending, date }} />
  </div>
);

export default Receive;
