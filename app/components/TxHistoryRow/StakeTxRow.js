import Row from "./Row";
import { createElement as h } from "react";
import { FormattedMessage as T } from "react-intl";

const messageByType = { // TODO: use constants instead of string
  "Ticket": <T id="transaction.type.ticket" m="Ticket" />,
  "Revocation": <T id="transaction.type.revoke" m="Revoke" />,
  "Vote": <T id="transaction.type.vote" m="Vote" />,
};

const StakeTxRow = ({ txType, ...props }) => (
  <Row {...{ className: txType, ...props}}>
    <div className="transaction-info">
      <span className="icon" />
      <span className="transaction-stake-type">{messageByType[txType] || "(unknown type)"}</span>
    </div>
  </Row>
);

export const StakeTxRowOfType = (txType) => {
  const Comp = ({ ...p }) => h(StakeTxRow, { txType, ...p });
  Comp.displayName = `StakeTxRowOfClass: ${txType}`;
  return Comp;
};
