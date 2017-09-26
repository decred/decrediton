import React from "react";
import TxHistoryRow from "./TxHistoryRow";
import dateFormat from "dateformat";
import "../style/Fonts.less";

const TxHistory = ({ transactions=[] }) => (
  <div>
    <div>
      {transactions.map(tx => (
        <TxHistoryRow
          key={tx.txHash}
          pending={tx.txTimestamp ? false : true}
          {...{ tx }}
          date={tx.txTimestamp ? dateFormat(new Date(tx.txTimestamp*1000), "mmm d yyyy, HH:MM:ss") : null}
        />
      ))}
      <p></p>
    </div>
  </div>
);

export default TxHistory;
