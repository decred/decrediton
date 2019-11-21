import { Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";
import "style/TxHistory.less";

const Row = ({
  pending, onClick, className, children, overview
}) => {
  const overviewTxIsPending = overview && pending ? "is-row tx-overview-pending" : null;

  return (
    <div className={[ overview ? "tx-overview-row" : "tx-history-row is-row", overviewTxIsPending ].join(" ")}>
      <div className={[ "tx-info", className ].join(" ")} {...{ onClick }}>
        {children}
      </div>
      { pending &&
        <Tooltip text={<T id="txHistory.Pending" m="Pending" />}>
          <div className="pending-overview-details" onClick={onClick}/>
        </Tooltip> }
    </div>
  );
};

export default Row;
