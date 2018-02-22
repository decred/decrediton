import { FormattedDate, FormattedTime, FormattedMessage as T } from "react-intl";
import "style/TxHistory.less";
import { tsToDate } from "helpers/dateFormat";
import { Tooltip } from "shared";

const StatusSmall = ({ pending, txTimestamp, daysToVote, onClick }) => (
  <Aux>
    {!pending ? (
      <div className="transaction-time-date-spacer">
        <T
          id="myId"
          defaultMessage="{day} {month} {year} {time}"
          values={{
            day: <FormattedDate value={tsToDate(txTimestamp)} day="2-digit"/>,
            month: <FormattedDate value={tsToDate(txTimestamp)} month="short"/>,
            year: <FormattedDate value={tsToDate(txTimestamp)} year="numeric"/>,
            time: <FormattedTime value={tsToDate(txTimestamp)} hour12={false}/>,
          }}
        />
        {daysToVote !== null && !isNaN(daysToVote) && (
          <div className="transaction-info-overview-days-to-vote">
            <div className="transaction-info-overview-lock-icon"></div>
            <span className="transaction-info-overview-days-to-vote-number">{daysToVote}</span>
            <T id="statusSmall.daysToVote" m="days" />
          </div>
        )}
      </div>) : (
      <Tooltip text={<T id="txHistory.Pending" m="Pending"/>}>
        <div className="pending-overview-details" onClick={ onClick }>
          ...
        </div>
      </Tooltip>

    )}
  </Aux>
);

export default StatusSmall;
