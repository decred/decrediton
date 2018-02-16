import Status from "./Status";
import "style/TxHistory.less";

const Row = ({ txAccountName, pending, txTimestamp, onClick, className, children }) => (
  <div className={"tx-history-overview-row " + className} >
    {children}
    <Status {...{ txAccountName, pending, txTimestamp, onClick }} />
  </div>
);

export default Row;
