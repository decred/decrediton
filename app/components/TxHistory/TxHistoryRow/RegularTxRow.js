import Row from "./Row";
import { Balance } from "shared";
import { createElement as h } from "react";
import { timeMessage } from "./index";

const RegularTxRow = ({ txAmount, txDescription, txDirection, overview, txAccountName, pending, txTs, ...props }) => (
  <Row {...{ ...props, txAccountName, pending, overview }}>
    <div className="is-row">
      <span className="icon" />
      <span className="transaction-amount-number"><Balance amount={txDirection !== "in" ? -txAmount : txAmount} /></span>
      {!overview &&
        <div className="transaction-status">
          <span className="transaction-account-name">{txAccountName}</span>
        </div>}
      {!pending &&
        <div className="transaction-time-date-spacer">
          {timeMessage(txTs, props.intl)}
        </div>}
    </div>
    <div className="transaction-amount-hash">{(txDescription.addressStr || []).join(", ")}</div>
  </Row>
);

export const RegularTxRowOfClass = (className) => {
  const Comp = ({ ...p }) => h(RegularTxRow, { className, ...p });
  Comp.displayName = `RegularTxRowOfClass: ${className}`;
  return Comp;
};
