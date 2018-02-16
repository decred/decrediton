import { FormattedDate, FormattedMessage } from "react-intl";
import "style/TxHistory.less";
import { tsToDate } from "helpers/dateFormat";

const Status = ({ pending, txTimestamp }) => (
  <Aux>
    {!pending ? (
      <div className="transaction-time-date-spacer">
        <FormattedMessage
          id="myId"
          defaultMessage="{day} {month} {year} {hour}:{minute}"
          values={{
            day: <FormattedDate value={tsToDate(txTimestamp)} day="2-digit"/>,
            month: <FormattedDate value={tsToDate(txTimestamp)} month="short"/>,
            year: <FormattedDate value={tsToDate(txTimestamp)} year="numeric"/>,
            hour: <FormattedDate value={tsToDate(txTimestamp)} hour="2-digit" hour12={false}/>,
            minute: <FormattedDate value={tsToDate(txTimestamp)} minute="2-digit"/>
          }}
        />
      </div>) : (
      <div className="pending-overview-details">
          ...
      </div>
    )}
  </Aux>
);

export default Status;
