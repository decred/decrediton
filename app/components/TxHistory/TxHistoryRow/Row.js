import Status from "./Status";
import "style/TxHistory.less";

const Row = ({ txAccountName, pending, txTimestamp, onClick, className, children }) => (
  <div className={"tx-history-row " + className} {...{ onClick }}>
    {children}
    <Status {...{ txAccountName, pending, txTimestamp }} />
  </div>
);

export default Row;
