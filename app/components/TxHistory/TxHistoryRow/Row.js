import Status from "./Status";
import StatusSmall from "./StatusSmall";
import "style/TxHistory.less";

const Row = ({ txAccountName, pending, txTimestamp, onClick, className, children, overview }) => {
  const rowClsname = "tx-history-row";
  const StatusComponent = overview ? StatusSmall : Status;

  return (
    <div className={[ rowClsname, className ].join(" ")} {...{ onClick }}>
      {children}
      <StatusComponent {...{ txAccountName, pending, txTimestamp, overview }} />
    </div>
  );
};

export default Row;
