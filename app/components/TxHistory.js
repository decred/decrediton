import React from "react";
import TxHistoryRow from "./TxHistoryRow";
import "../style/Fonts.less";

const TxHistory = ({ transactions=[] }) => (
  <div>
    <div>
      {transactions.map(tx => (
        <TxHistoryRow
          key={tx.txHash}
          pending={tx.txTimestamp ? false : true}
          {...{ tx }}
        />
      ))}
      <p></p>
    </div>
  </div>
);

export default TxHistory;
