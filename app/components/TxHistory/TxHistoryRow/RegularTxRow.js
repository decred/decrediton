import Row from "./Row";
import { Balance } from "shared";
import { createElement as h } from "react";
import Status from "./Status";

const RegularTxRow = ({ txAmount, txDescription, txDirection, txAccountName, pending, txTimestamp, overview, onClick, tsDate, ...props }) => (
  <Row {...{ onClick, ...props, }}>
    <div className="transaction-info-row">
      <span className="icon" />
      <span className="transaction-amount-number"><Balance amount={txDirection !== "in" ? -txAmount : txAmount} /></span>
      <Status {...{ txAccountName, pending, txTimestamp, overview, onClick, tsDate }} />
    </div>
    <div className="transaction-info-row transaction-amount-hash">{(txDescription.addressStr || []).join(", ")}</div>
  </Row>
);

export const RegularTxRowOfClass = (className) => {
  const Comp = ({ ...p }) => h(RegularTxRow, { className, ...p });
  Comp.displayName = `RegularTxRowOfClass: ${className}`;
  return Comp;
};
