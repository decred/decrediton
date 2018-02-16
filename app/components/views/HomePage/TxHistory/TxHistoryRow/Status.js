import { FormattedMessage as T } from "react-intl";
import { tsToDate } from "helpers/dateFormat";
import "style/TxHistory.less";

const Status = ({ pending, txTimestamp }) => (
  <Aux>
    <div className="transaction-time-date-spacer">
      <T id="transaction.timestamp"
        m="{timestamp, date, medium} {timestamp, time, medium}"
        values={{ timestamp: tsToDate(txTimestamp) }} />
    </div>
    {pending ? (
      <div className="pending-details">
        ...
      </div>
    ) : null}
  </Aux>
);

export default Status;
