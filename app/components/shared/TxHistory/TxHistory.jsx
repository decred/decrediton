import { useState } from "react";
import { withRouter } from "react-router-dom";
import TxRow from "./TxRow";

// TxHistory is responsible for calling the right component row according to
// the Tx row type.
const TxHistory = ({ transactions = [], limit, overview, tsDate, history }) => {
  const [activeRow, setActiveRow] = useState(null);
  return transactions.map((tx, index) => {
    if (limit && index >= limit) return;
    if (!tx) return;
    const key = `${tx.spenderHash}-${tx.txHash}`;
    return (
      <TxRow
        key={key}
        {...{ tx, tsDate, overview, history, activeRow, setActiveRow }}
      />
    );
  });
};

export default withRouter(TxHistory);
