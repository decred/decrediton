import React from "react";
import "../../style/TxHistory.less";

const Status = ({ txAccountName, pending, date }) => (
  <div>
    <div className="transaction-account">
      <div className="transaction-account-name">{txAccountName}</div>
      <div className="transaction-account-indicator">
        {pending || date == null ? (
          <div className="indicator-pending">Pending</div>
        ) : (
          <div className="indicator-confirmed">Confirmed</div>
        )}
      </div>
    </div>
    {pending || date == null ? null : (
      <div className="transaction-time-date"><span>{date}</span></div>
    )}
  </div>
);

export default Status;
