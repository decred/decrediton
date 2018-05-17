import { FormattedDate, FormattedTime, FormattedMessage as T } from "react-intl";
import "style/TxHistory.less";
import { tsToDate } from "helpers/dateFormat";
import { Tooltip } from "shared";

const StatusSmall = ({ pending, txTimestamp, onClick }) => {

  return (
    <Aux>
      {!pending ? (
        <div className="transaction-time-date-spacer">
          <T
            id="txHistory.statusSmall.date"
            defaultMessage="{day} {month} {year} {time}"
            values={{
              day: <FormattedDate value={tsToDate(txTimestamp)} day="2-digit" />,
              month: <FormattedDate value={tsToDate(txTimestamp)} month="short" />,
              year: <FormattedDate value={tsToDate(txTimestamp)} year="numeric" />,
              time: <FormattedTime value={tsToDate(txTimestamp)} hour12={false} />,
            }}
          />
        </div>) : (
        <Tooltip text={<T id="txHistory.Pending" m="Pending" />}>
          <div className="pending-overview-details" onClick={onClick}>
            ...
          </div>
        </Tooltip>
      )}
    </Aux>
  );
};

export default StatusSmall;
