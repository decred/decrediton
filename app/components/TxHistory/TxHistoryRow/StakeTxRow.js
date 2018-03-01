import Row from "./Row";
import { createElement as h } from "react";
import { FormattedMessage as T } from "react-intl";
import { Balance, Tooltip } from "shared";

const messageByType = { // TODO: use constants instead of string
  "Ticket": <T id="transaction.type.ticket" m="Ticket" />,
  "Revocation": <T id="transaction.type.revoke" m="Revoke" />,
  "Vote": <T id="transaction.type.vote" m="Vote" />,
  "ticket": <T id="transaction.type.ticket" m="Ticket" />,
  "revocation": <T id="transaction.type.revoke" m="Revoke" />,
  "voted": <T id="transaction.type.voted" m="Voted" />,
  "unmined": <T id="transaction.type.unmined" m="Unmined" />,
  "immature": <T id="transaction.type.immature" m="Immature" />,
  "missed": <T id="transaction.type.missed" m="Missed" />,
  "expired": <T id="transaction.type.expired" m="Expired" />,
  "revoked": <T id="transaction.type.revoked" m="Revoked" />,
  "live": <T id="transaction.type.live" m="Live" />,
};

// ToDo Add status to transactions selector, so we can use status instead of txType
// to show on transactions history page
const StakeTxRow = ({ status, txType, ...props }) => {
  const { overview, ticketPrice, ticketReward } = props;

  const rewardLabel = <T id="ticket.rewardLabel" m="Ticket Reward" />;
  const ticketRewardMessage = <T id="ticket.rewardMesage"
    m={"{rewardLabel}: {reward}"}
    values={{
      rewardLabel: rewardLabel,
      reward: <Balance amount={ticketReward || 0} />,
    }} />;

  const ticketPriceLabel = <T id="ticket.priceLabel" m="Ticket Price" />;
  const ticketPriceMessage = <T id="ticket.priceMessage"
    m={"{ticketPriceLabel}: {ticketPrice}"}
    values={{
      ticketPriceLabel: ticketPriceLabel,
      ticketPrice: <Balance amount={ticketPrice || 0} />,
    }} />;

  return overview ?
    (
      <Row {...{ className: status, ...props }}>
        <div className="transaction-info transaction-stake-info-overview">
          <div><span className="icon" /></div>
          <div>
            <span className="transaction-stake-type-overview">{messageByType[status] || "(unknown type)"}</span>
            <div className="transaction-info-price-reward">
              <Tooltip text={ticketPriceMessage}>
                <Balance classNameWrapper="stake-transaction-ticket-price" amount={ticketPrice} />
              </Tooltip>
              <Tooltip text={ticketRewardMessage}>
                <span className="transaction-info-overview-reward-icon"/>
                <Balance classNameWrapper="stake-transaction-ticket-reward" amount={ticketReward} noSmallAmount />
              </Tooltip>
            </div>
          </div>
        </div>
      </Row>
    ) : (
      <Row {...{ className: txType, ...props }}>
        <div className="transaction-info">
          <span className="icon" />
          <span className="transaction-stake-type">{messageByType[txType] || "(unknown type)"}</span>
        </div>
      </Row>
    );
};

export const StakeTxRowOfType = (txType) => {
  const Comp = ({ ...p }) => h(StakeTxRow, { txType, ...p });
  Comp.displayName = `StakeTxRowOfClass: ${txType}`;
  return Comp;
};
