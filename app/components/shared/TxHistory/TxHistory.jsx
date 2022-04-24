import { withRouter } from "react-router-dom";
import TxRow from "./TxRow";

// TxHistory is responsible for calling the right component row according to
// the Tx row type.
const TxHistory = ({ transactions = [], limit, overview, tsDate, history }) =>
  transactions.map((tx, index) => {
    if (limit && index >= limit) return;
    if (!tx) return;
    const key = `${tx.spenderHash}-${tx.txHash}`;
    return <TxRow key={key} {...{ tx, tsDate, overview, history }} />;
  });

export default withRouter(TxHistory);
