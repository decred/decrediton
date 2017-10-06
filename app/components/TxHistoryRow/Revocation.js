import React from "react";
import Status from "./Status";
import { FormattedMessage as T } from "react-intl";
import "../../style/TxHistory.less";

const Revocation = ({ txAccountName, pending, txTimestamp, onClick }) => (
  <div className={onClick ? "revoke-tx" : "revoke-tx-overview"} {...{ onClick }}>
    <div className="transaction-amount">
      <T id="transaction.type.revoke" m="Revoke" />
    </div>
    <Status {...{ txAccountName, pending, txTimestamp }} />
  </div>
);

export default Revocation;
