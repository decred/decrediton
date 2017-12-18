import { transactionLink } from "connectors";
import { shell } from "electron";
import "style/MiscComponents.less";

const TransactionLink = ({ txHash, txURLBuilder }) => (
  <a className="transaction-link" onClick={(e) => {e.preventDefault(); e.stopPropagation(); shell.openExternal(txURLBuilder(txHash)); }}>{txHash}</a>
);

export default transactionLink(TransactionLink);
