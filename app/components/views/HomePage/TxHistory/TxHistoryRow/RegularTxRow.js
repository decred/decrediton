import Row from "./Row";
import { Balance } from "shared";
import { createElement as h } from "react";

const RegularTxRow = ({ txAmount, txDescription, negativeAmount, ...props }) => (
  <Row {...props}>
    <div className="transaction-info-overview">
      <span className="icon" />
      <span className="transaction-amount-number"><Balance amount={txAmount} negative={negativeAmount} /></span>
      <div className="transaction-amount-hash">{(txDescription.addressStr || []).join(", ")}</div>
    </div>
  </Row>
);

export const RegularTxRowOfClass = (className, negativeAmount) => {
  const Comp = ({ ...p }) => {
    if(p.pending) {
      className += " Pending";
    }
    return h(RegularTxRow, { className, negativeAmount, ...p });
  };
  Comp.displayName = `RegularTxRowOfClass: ${className}`;
  return Comp;
};
