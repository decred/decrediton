import TxHistoryRow from "./TxHistoryRow";

const TxHistory = ({ transactions=[] }) => (
  <div>
    {transactions.map(tx => (
      <TxHistoryRow {...{ key: tx.txHash, tx }} />
    ))}
  </div>
);

export default TxHistory;
