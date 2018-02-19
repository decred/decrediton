import Row from "./Row";
import { createElement as h } from "react";
import { FormattedMessage as T } from "react-intl";

const messageByType = { // TODO: use constants instead of string
  "Ticket": <T id="transaction.type.ticket" m="Ticket" />,
  "Revocation": <T id="transaction.type.revoke" m="Revoke" />,
  "Vote": <T id="transaction.type.vote" m="Vote" />,
};

const StakeTxRow = ({ ...props }) => (
  <Row {...props}>
    <div className="transaction-info-overview">
      <span className="icon" />
      <span className="transaction-stake-type">{messageByType[props.className.split(" ")[0]] || "(unknown type)"}</span>
    </div>
  </Row>
);

export const StakeTxRowOfType = (className) => {
  const Comp = ({ ...p }) => {
    if(p.pending) {
      className += " Pending";
    }
    return h(StakeTxRow, { className, ...p });
  };
  Comp.displayName = `StakeTxRowOfClass: ${className}`;
  return Comp;
};
