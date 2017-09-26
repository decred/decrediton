// @flow
import React from "react";
import { Link } from "react-router";
import Balance from "../../Balance";
import "../../../style/Header.less";

const Transfer = ({
  type,
  txHash,
  amount,
  fee
}) => (
  <div className="snackbar-information">
    <div className="snackbar-information-row">
      <div className="snackbar-information-row-tx"><Link to={`/transactions/${txHash}`}>{txHash}</Link></div>
    </div>
    <div className="snackbar-information-row">
      <div className="snackbar-information-row-type">{type}</div>
      <div className="snackbar-information-row-amount">
        Amount  <Balance amount={amount}/>
      </div>
      <div className="snackbar-information-row-fee">
        Fee  <Balance amount={fee}/>
      </div>
    </div>
  </div>
);

export default Transfer;
