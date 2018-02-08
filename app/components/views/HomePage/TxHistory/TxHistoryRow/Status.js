import { FormattedMessage as T } from "react-intl";
import "style/TxHistory.less";

const Status = ({ txAccountName, pending }) => (
  <Aux>
    <div className="transaction-status">
      <span className="transaction-account-name">{txAccountName}</span>
      {pending ? <span className="indicator pending"><T id="transaction.indicatorPending" m="Pending" /></span> : null}
    </div>
    {pending ? <div className="transaction-time-date-spacer" /> : null}
  </Aux>
);

export default Status;
