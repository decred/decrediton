import React from "react";
import TxHistoryRow from "./TxHistoryRow";
import dateFormat from "dateformat";
import "./fonts.css";

const TxHistory = ({ mined=[], unmined=[], showTxDetail }) => (
  <div>
    <div>
      {unmined.map(tx => <TxHistoryRow key={tx.txHash} pending {...{ tx }} />)}
      {!unmined.length ? (<p/>) : null}
    </div><div>
      {mined.map(tx => (
        <TxHistoryRow
          key={tx.txHash}
          {...{ showTxDetail, tx }}
          date={tx.txTimestamp ? dateFormat(new Date(tx.txTimestamp*1000), "mmm d yyyy, HH:MM:ss") : null}
        />
      ))}
      <p></p>
    </div>
  </div>
);

export default TxHistory;
