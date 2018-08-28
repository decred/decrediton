import { FormattedDate, FormattedTime, FormattedMessage as T } from "react-intl";
import "style/TxHistory.less";
import { Tooltip } from "shared";

const StatusSmall = ({ pending, txTimestamp, onClick, tsDate }) => {

  return (
    <Aux>
      {!pending ? (
        <div className="transaction-time-date-spacer">
          <T
            id="txHistory.statusSmall.date"
            defaultMessage="{day} {month} {year} {time}"
            values={{
              day: <FormattedDate value={tsDate(txTimestamp)} day="2-digit" />,
              month: <FormattedDate value={tsDate(txTimestamp)} month="short" />,
              year: <FormattedDate value={tsDate(txTimestamp)} year="numeric" />,
              time: <FormattedTime value={tsDate(txTimestamp)} hour12={false} />,
            }}
          />
        </div>) : (
        <Tooltip text={<T id="txHistory.Pending" m="Pending" />}>
          <div className="pending-overview-details" onClick={onClick}/>
        </Tooltip>
      )}
    </Aux>
  );
};

export default StatusSmall;
