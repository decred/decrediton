import TxHistoryRow from "./TxHistoryRow";

const TxHistory = ({ transactions = [], limit, overview, tsDate, useModalForDetails }) => (
  <>
    {transactions.map( (tx, index) => {
      if(limit && index >= limit) return;
      return (
        <TxHistoryRow {...{ key: tx.txHash, overview, tx, tsDate, useModalForDetails }} />
      );
    })}
  </>
);

export default TxHistory;
