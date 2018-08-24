import TxHistoryRow from "./TxHistoryRow";

const TxHistory = ({ transactions = [], limit, overview, tsDate }) => (
  <Aux>
    {transactions.map( (tx, index) => {
      if(limit && index >= limit)
        return;
      return (
        <TxHistoryRow {...{ key: tx.txHash, overview, tx, tsDate }} />
      );
    })}
  </Aux>
);

export default TxHistory;
