import React from "react";
import Status from "./Status";
import { FormattedMessage } from "react-intl";
import "../../style/TxHistory.less";

const Vote = ({ txAccountName, pending, txTimestamp, onClick }) => (
  <div className={onClick ? "vote-tx" : "vote-tx-overview"} {...{ onClick }}>
    <div className="transaction-amount">
      <FormattedMessage id="transaction.type.vote" defaultMessage="Vote" />
    </div>
    <Status {...{ txAccountName, pending, txTimestamp }} />
  </div>
);

export default Vote;
