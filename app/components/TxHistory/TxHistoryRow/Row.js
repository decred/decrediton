import Status from "./Status";
import StatusSmall from "./StatusSmall";
import { diffBetweenTwoTs } from "helpers/dateFormat";
import "style/TxHistory.less";

const Row = ({
  txAccountName, pending, txTimestamp, onClick, className, children, overview, leaveTimestamp, enterTimestamp
}) => {
  const rowClsname = "tx-history-row";
  const StatusComponent = overview ? StatusSmall : Status;
  const daysToVote = diffBetweenTwoTs(leaveTimestamp, enterTimestamp);

  return (
    <div className={[ rowClsname, className ].join(" ")} {...{ onClick }}>
      {children}
      <StatusComponent {...{ txAccountName, pending, txTimestamp, overview, daysToVote }} />
    </div>
  );
};

export default Row;
