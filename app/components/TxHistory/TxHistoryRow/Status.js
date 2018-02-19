import { FormattedMessage as T } from "react-intl";
import { tsToDate } from "helpers/dateFormat";
import "style/TxHistory.less";

// TODO: use a global component for these indicators
const indicators = {
  [true]: <span className="indicator pending"><T id="transaction.indicatorPending" m="Pending" /></span>,
  [false]: <span className="indicator confirmed"><T id="transaction.indicatorConfirmed" m="Confirmed" /></span>
};

const Status = ({ txAccountName, pending, txTimestamp }) => (
  <Aux>
    <div className="transaction-status">
      <span className="transaction-account-name">{txAccountName}</span>
      {indicators[!!pending]}
    </div>
    {pending ? <div className="transaction-time-date-spacer" /> : (
      <div className="transaction-time-date">
        <T id="transaction.timestamp"
          m="{timestamp, date, medium} {timestamp, time, medium}"
          values={{ timestamp: tsToDate(txTimestamp) }}/>
      </div>
    )}
  </Aux>
);

export default Status;
