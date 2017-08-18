// @flow
import React from "react";
import TxRow from "./TxRow";
import dateFormat from "dateformat";
import "../fonts.css";

const History = ({ mined, unmined, showTxDetail }) => (
  <div>
    <div>
      {unmined.map(tx => <TxRow key={tx.txHash} pending {...tx} />)}
      {!unmined.length ? (<p/>) : null}
    </div><div>
      {mined.map(tx => (
        <TxRow
          key={tx.txHash}
          {...{ showTxDetail, ...tx}}
          date={tx.timestamp ? dateFormat(new Date(tx.timestamp*1000), "mmm d yyyy, HH:MM:ss") : null}
        />
      ))}
      <p></p>
    </div>
  </div>
);

export default History;
