import TxHistoryRow from "./TxHistoryRow";

const TxHistory = ({ transactions = [], limit }) => (
  <Aux>
    {transactions.map( (tx, index) => {
      if(limit && index >= limit)
        return;
      return (
        <TxHistoryRow {...{ key: tx.txHash, tx }} />
      );
    })}
  </Aux>
);

export default TxHistory;
