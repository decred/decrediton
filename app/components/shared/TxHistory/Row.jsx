import { Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";
import { classNames } from "pi-ui";
import "style/TxHistory.less";

const Row = ({ pending, onClick, className, children, overview }) => (
  <div
    className={classNames(
      overview && pending && "is-row tx-overview-pending",
      overview && "tx-overview-row",
      !overview && "tx-history-row is-row"
    )}>
    <div className={classNames("tx-info", className)} onClick={onClick}>
      {children}
    </div>
    {pending && (
      <Tooltip text={<T id="txHistory.Pending" m="Pending" />}>
        <div className="pending-overview-details" onClick={onClick} />
      </Tooltip>
    )}
  </div>
);

export default Row;
