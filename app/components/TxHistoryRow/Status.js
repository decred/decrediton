import React from "react";
import "../../style/TxHistory.less";

const Status = ({ txAccountName, pending, date }) => (
  <div className="transaction-status">
    <div className="transaction-account">
      <div className="transaction-account-name">{txAccountName}</div>
      <div className="transaction-account-indicator">
        {pending ? (
          <div className="indicator-pending">Pending</div>
        ) : (
          <div className="indicator-confirmed">Confirmed</div>
        )}
      </div>
    </div>
    {pending ? (
      <div className="transaction-time-date-spacer"></div>
    ) : (
      <div className="transaction-time-date"><span>{date}</span></div>
    )}
  </div>
);

export default Status;
