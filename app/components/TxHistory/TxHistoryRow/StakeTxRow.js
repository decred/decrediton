import Row from "./Row";
import { createElement as h } from "react";
import { FormattedMessage as T } from "react-intl";
import { Balance, Tooltip } from "shared";
import { diffBetweenTwoTs } from "helpers/dateFormat";

const messageByType = { // TODO: use constants instead of string
  "Ticket": <T id="transaction.type.ticket" m="Purchased" />,
  "Revocation": <T id="transaction.type.revoke" m="Revoked" />,
  "Vote": <T id="transaction.type.vote" m="Voted" />,
  "ticket": <T id="transaction.type.ticket" m="Purchased" />,
  "revocation": <T id="transaction.type.revoke" m="Revoked" />,
  "voted": <T id="transaction.type.voted" m="Voted" />,
  "unmined": <T id="transaction.type.unmined" m="Unmined" />,
  "immature": <T id="transaction.type.immature" m="Immature" />,
  "missed": <T id="transaction.type.missed" m="Missed" />,
  "expired": <T id="transaction.type.expired" m="Expired" />,
  "revoked": <T id="transaction.type.revoked" m="Revoked" />,
  "live": <T id="transaction.type.live" m="Live" />,
};

const StakeTxRow = ({ status, ...props }) => {
  const { overview, ticketPrice, ticketReward, leaveTimestamp, enterTimestamp } = props;

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

  // ticket can have leaveTimestamp equals null, which is not voted yet
  const daysToVote = leaveTimestamp ? diffBetweenTwoTs(leaveTimestamp, enterTimestamp) : null;

  const daysToVoteLabel = <T id="ticket.daysToVoteLabel" m="Ticket Days To Vote" />;
  const daysToVoteMessage = <T id="ticket.daysToVoteMessage"
    m={"{daysToVoteLabel}: {daysToVote}"}
    values={{
      daysToVoteLabel: daysToVoteLabel,
      daysToVote: daysToVote || 0,
    }} />;

  return overview ?
    (
      <Row {...{ className: status, ...props }}>
        <div className="transaction-info transaction-stake-info-overview">
          <span className="icon" />
          <span className="transaction-stake-type-overview">{messageByType[status] || "(unknown type)"}</span>
          <div className="transaction-info-price-reward">
            <Tooltip text={ticketPriceMessage}>
              <Balance classNameWrapper="stake-transaction-ticket-price" amount={ticketPrice} />
            </Tooltip>
            <Tooltip text={ticketRewardMessage}>
              <Balance classNameWrapper="stake-transaction-ticket-reward" amount={ticketReward} noSmallAmount />
            </Tooltip>
            {daysToVote !== null && !isNaN(daysToVote) && (
              <Tooltip text={daysToVoteMessage}>
                <div className="transaction-info-overview-days-to-vote">
                  <span className="transaction-info-overview-days-to-vote-number">{daysToVote}</span>
                  <T id="statusSmall.daysToVote" m="days" />
                </div>
              </Tooltip>
            )}
          </div>
        </div>
      </Row>
    ) : (
      <Row {...{ className: status , ...props }}>
        <div className="transaction-info">
          <span className="icon" />
          <span className="transaction-stake-type">{messageByType[status] || "(unknown type)"}</span>
        </div>
      </Row>
    );
};

export const StakeTxRowOfType = (status) => {
  const Comp = ({ ...p }) => h(StakeTxRow, { status, ...p });
  Comp.displayName = `StakeTxRowOfClass: ${status}`;
  return Comp;
};
