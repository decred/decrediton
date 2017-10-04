import React from "react";
import "../../style/TxHistory.less";
import { FormattedMessage as T } from "react-intl";
import { tsToDate } from "../../helpers/dateFormat";

const Status = ({ txAccountName, pending, txTimestamp }) => (
  <div className="transaction-status">
    <div className="transaction-account">
      <div className="transaction-account-name">{txAccountName}</div>
      <div className="transaction-account-indicator">
        {pending ? (
          <div className="indicator-pending">
            <T id="transaction.indicatorPending" m="Pending" />
          </div>
        ) : (
          <div className="indicator-confirmed">
            <T id="transaction.indicatorConfirmed" m="Confirmed" />
          </div>
        )}
      </div>
    </div>
    {pending ? (
      <div className="transaction-time-date-spacer"></div>
    ) : (
      <div className="transaction-time-date">
        <T id="transaction.timestamp"
          m="{timestamp, date, medium} {timestamp, time, medium}"
          values={{timestamp: tsToDate(txTimestamp)}}/>
      </div>
    )}
  </div>
);

export default Status;
