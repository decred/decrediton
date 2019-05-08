import Row from "./Row";
import { Balance } from "shared";
import { createElement as h } from "react";
import Status from "./Status";

const RegularTxRow = ({ txAmount, txDescription, txDirection, overview, txAccountName, pending, txTimestamp, tsDate, ...props }) => (
  <Row {...{ ...props, txAccountName, pending, overview, tsDate }}>
    <div className="is-row">
      <span className="icon" />
      <span className="transaction-amount-number"><Balance amount={txDirection !== "in" ? -txAmount : txAmount} /></span>
      {!pending && <Status {...{ overview, txAccountName, pending, txTimestamp, tsDate }} />}
    </div>
    <div className="transaction-amount-hash">{(txDescription.addressStr || []).join(", ")}</div>
  </Row>
);

export const RegularTxRowOfClass = (className) => {
  const Comp = ({ ...p }) => h(RegularTxRow, { className, ...p });
  Comp.displayName = `RegularTxRowOfClass: ${className}`;
  return Comp;
};
