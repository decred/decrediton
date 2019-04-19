import { FormattedDate, FormattedTime, FormattedMessage as T } from "react-intl";
import { Tooltip } from "shared";
import "style/TxHistory.less";

// TODO: use a global component for these indicators
const indicators = {
  [true]: <span className="indicator pending"><T id="transaction.indicatorPending" m="Pending" /></span>,
  [false]: <span className="indicator confirmed"><T id="transaction.indicatorConfirmed" m="Confirmed" /></span>
};

const Status = ({ overview, txAccountName, pending, txTimestamp, tsDate, onClick }) => overview ? (
  <>
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
  </>
) : (
  <>
    <div className="transaction-status">
      <span className="transaction-account-name">{txAccountName}</span>
      {indicators[!!pending]}
    </div>
    {pending ? <div className="transaction-time-date-spacer" /> : (
      <div className="transaction-time-date">
        <T id="transaction.timestamp"
          m="{timestamp, date, medium} {timestamp, time, medium}"
          values={{ timestamp: tsDate(txTimestamp) }}/>
      </div>
    )}
  </>
);

export default Status;
