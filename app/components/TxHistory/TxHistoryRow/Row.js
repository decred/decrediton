import Status from "./Status";
import "style/TxHistory.less";

const Row = ({
  txAccountName, pending, txTimestamp, onClick, className, children, overview, tsDate
}) => {
  const overviewTxIsPending = overview && pending;

  return (
    <div className={[ "tx-history-row-wrapper", overviewTxIsPending && "is-overview-pending" ].join(" ")}>
      <div className={[ "tx-history-row", className,overviewTxIsPending && "is-row-pending" ].join(" ")} {...{ onClick }}>
        {children}
      </div>
      {overviewTxIsPending && <Status {...{ txAccountName, pending, txTimestamp, overview, onClick, tsDate }} />}
    </div>
  );
};

export default Row;
