import { FormattedDate } from "react-intl";
import "style/TxHistory.less";
import { tsToDate } from "helpers/dateFormat";

const Status = ({ pending, txTimestamp }) => (
  <Aux>
    {!pending ? (
      <div className="transaction-time-date-spacer">
        <FormattedDate
          value={tsToDate(txTimestamp)}
          year='numeric'
          month='short'
          day='2-digit'
          hour='2-digit'
          minute='2-digit'
          hour12={false}
        />
      </div>) : (
        <div className="pending-overview-details">
          ...
      </div>
      )}
  </Aux>
);

export default Status;
