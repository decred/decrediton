import Status from "./Status";
import StatusSmall from "./StatusSmall";
import "style/TxHistory.less";

const Row = ({
  txAccountName, pending, txTimestamp, onClick, className, children, overview, tsDate
}) => {
  const rowClsname = "tx-history-row";
  const StatusComponent = overview ? StatusSmall : Status;
  const overviewTxIsPending = overview && pending;


  return (
    <div className={[ "tx-history-row-wrapper", overviewTxIsPending ? "is-overview-pending" : null ].join(" ")}>
      <div className={[ rowClsname, className,overviewTxIsPending ? "is-row-pending" : null ].join(" ")} {...{ onClick }}>
        {children}
        {!overviewTxIsPending ?
          <StatusComponent {...{ txAccountName, pending, txTimestamp, overview, tsDate }} /> : null}
      </div>
      {overviewTxIsPending && <StatusComponent {...{ txAccountName, pending, txTimestamp, overview, onClick, tsDate }} />}
    </div>
  );
};

export default Row;
