import Status from "./Status";
import "style/TxHistory.less";

const Row = ({ txAccountName, pending, onClick, className, children }) => (
  <div className={"tx-history-row " + className} {...{ onClick }}>
    {children}
    <Status {...{ txAccountName, pending }} />
  </div>
);

export default Row;
