import React from "react";
import "../../style/TxHistory.less";
import { FormattedDate, FormattedTime } from "react-intl";
import { tsToDate } from "../../helpers/dateFormat";

const Status = ({ txAccountName, pending, txTimestamp }) => (
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
      <div className="transaction-time-date">
        { /* TODO: componentize */ }
        <FormattedDate value={tsToDate(txTimestamp)} />
        <span> </span>
        <FormattedTime value={tsToDate(txTimestamp)} />
      </div>
    )}
  </div>
);

export default Status;
