import Status from "./Status";
import "style/TxHistory.less";

const Row = ({
  txAccountName, pending, onClick, className, children, overview, tsDate
}) => {
  const overviewTxIsPending = overview && pending;

  return (
    <div className={[ overview ? "tx-overview-row" : "tx-history-row", overviewTxIsPending ? "is-row tx-overview-pending" : null ].join(" ")}>
      <div className={[ "tx-info", className ].join(" ")} {...{ onClick }}>
        {children}
      </div>
      {overviewTxIsPending && <Status {...{ txAccountName, pending, overview, onClick, tsDate }} />}
    </div>
  );
};

export default Row;
