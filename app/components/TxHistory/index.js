import TxHistoryRow from "./TxHistoryRow";

const TxHistory = ({ transactions=[] }) => (
  <Aux>
    {transactions.map(tx => (
      <TxHistoryRow {...{ key: tx.txHash, tx }} />
    ))}
  </Aux>
);

export default TxHistory;
