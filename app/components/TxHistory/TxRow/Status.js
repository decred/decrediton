import React from "react";
import "../../../style/TxHistory.less";

const Status = ({ accountName, pending, date }) => (
  <div>
    <div className="transaction-account">
      <div className="transaction-account-name">{accountName}</div>
      <div className="transaction-account-indicator">
        {pending ? (
          <div className="indicator-pending">Pending</div>
        ) : (
          <div className="indicator-confirmed">Confirmed</div>
        )}
      </div>
    </div>
    {pending ? null : (
      <div className="transaction-time-date"><span>{date}</span></div>
    )}
  </div>
);

export default Status;
