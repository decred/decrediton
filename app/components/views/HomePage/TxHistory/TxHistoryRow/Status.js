import { FormattedMessage as T } from "react-intl";
import { tsToDate } from "helpers/dateFormat";
import "style/TxHistory.less";

const Status = ({ pending, txTimestamp, onClick }) => (
  <Aux>
    {!pending ? (
      <div className="transaction-time-date-spacer">
        <T id="transaction.timestamp"
          m="{timestamp, date, medium} {timestamp, time, medium}"
          values={{ timestamp: tsToDate(txTimestamp) }} />
      </div>) : (
      <div className="pending-overview-details" {...{ onClick }}>
        ...
      </div>
    )}
  </Aux>
);

export default Status;
