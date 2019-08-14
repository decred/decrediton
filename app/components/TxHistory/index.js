import TxHistoryRow from "./TxHistoryRow";

const TxHistory = ({ transactions = [], limit, overview, tsDate }) => (
  <>
    {transactions.map( (tx, index) => {
      if(limit && index >= limit) return;
      return (
        <TxHistoryRow {...{ key: tx.txHash, overview, tx, tsDate }} />
      );
    })}
  </>
);

export default TxHistory;
