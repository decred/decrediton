import Status from "./Status";
import StatusSmall from "./StatusSmall";
import { diffBetweenTwoTs } from "helpers/dateFormat";
import "style/TxHistory.less";

const Row = ({
  txAccountName, pending, txTimestamp, onClick, className, children, overview, leaveTimestamp, enterTimestamp
}) => {
  const rowClsname = "tx-history-row";
  const StatusComponent = overview ? StatusSmall : Status;

  // ticket can have leaveTimestamp equals null, which is not voted yet
  const daysToVote = leaveTimestamp ? diffBetweenTwoTs(leaveTimestamp, enterTimestamp) : null;

  return (
    <div className={[ rowClsname, className ].join(" ")} {...{ onClick }}>
      {children}
      <StatusComponent {...{ txAccountName, pending, txTimestamp, overview, daysToVote }} />
    </div>
  );
};

export default Row;
