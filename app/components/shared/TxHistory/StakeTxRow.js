import Row from "./Row";
import { FormattedMessage as T } from "react-intl";
import { Balance, Tooltip } from "shared";
import { diffBetweenTwoTs } from "helpers/dateFormat";
import * as txTypes from "constants/Decrediton";
import cx from "classnames";

const messageByType = {
  [txTypes.TICKET]: <T id="transaction.type.ticket" m="Purchased" />,
  [txTypes.VOTE]: <T id="transaction.type.vote" m="Voted" />,
  [txTypes.VOTED]: <T id="transaction.type.voted" m="Voted" />,
  [txTypes.REVOCATION]: <T id="transaction.type.revocation" m="Revoked" />,
  [txTypes.UNMINED]: <T id="transaction.type.unmined" m="Unmined" />,
  [txTypes.IMMATURE]: <T id="transaction.type.immature" m="Immature" />,
  [txTypes.MISSED]: <T id="transaction.type.missed" m="Missed" />,
  [txTypes.EXPIRED]: <T id="transaction.type.expired" m="Expired" />,
  [txTypes.REVOKED]: <T id="transaction.type.revoked" m="Revoked" />,
  [txTypes.LIVE]: <T id="transaction.type.live" m="Live" />
};

export const StakeTxRow = ({
  className,
  timeMessage,
  overview,
  ticketPrice,
  ticketReward,
  leaveTimestamp,
  enterTimestamp,
  pending,
  txTs,
  accountName,
  ...props
}) => {
  const status = className;

  const ticketRewardMessage = (
    <T
      id="history.ticket.rewardMesage"
      m={"{rewardLabel}: {reward}"}
      values={{
        rewardLabel: <T id="history.ticket.rewardLabel" m="Ticket Reward" />,
        reward: <Balance amount={ticketReward || 0} />
      }}
    />
  );

  const ticketPriceMessage = (
    <T
      id="ticket.priceMessage"
      m={"{ticketPriceLabel}: {ticketPrice}"}
      values={{
        ticketPriceLabel: <T id="ticket.priceLabel" m="Ticket Price" />,
        ticketPrice: <Balance amount={ticketPrice || 0} />
      }}
    />
  );

  // ticket can have leaveTimestamp equals null, which is not voted yet
  const daysToVote = leaveTimestamp
    ? diffBetweenTwoTs(leaveTimestamp, enterTimestamp)
    : null;

  const daysToVoteMessage = (
    <T
      id="ticket.daysToVoteMessage"
      m={"{daysToVoteLabel}: {daysToVote}"}
      values={{
        daysToVoteLabel: (
          <T id="ticket.daysToVoteLabel" m="Ticket Days To Vote" />
        ),
        daysToVote: daysToVote || 0
      }}
    />
  );

  const typeMsg = messageByType[status] || "(unknown type)";

  return overview ? (
    <Row {...{ className, overview, pending, ...props }}>
      <div className="is-row">
        <span className="icon" />
        <span className={cx("transaction-stake-type", overview && "overview")}>
          {typeMsg}
        </span>
        {!pending && (
          <div className="transaction-time-date-spacer">
            {timeMessage(txTs)}
          </div>
        )}
      </div>
      <div className="transaction-info-price-reward">
        <Tooltip text={ticketPriceMessage}>
          <Balance amount={ticketPrice} />
        </Tooltip>
        <Tooltip text={ticketRewardMessage}>
          <Balance
            classNameWrapper={cx(
              "stake-transaction-ticket-reward",
              overview && "overview"
            )}
            amount={ticketReward}
            noSmallAmount
          />
        </Tooltip>
        {daysToVote !== null && !isNaN(daysToVote) && (
          <Tooltip text={daysToVoteMessage}>
            <div className="transaction-info-overview-days-to-vote">
              <T
                id="statusSmall.daysToVotePlural"
                m="{days, plural, one {# day} other {# days}}"
                values={{ days: daysToVote }}
              />
            </div>
          </Tooltip>
        )}
      </div>
    </Row>
  ) : (
    <Row {...{ className, pending, ...props }}>
      <div className="my-tickets-table">
        <div>
          <span className="icon" />
          <span className="transaction-stake-type">{typeMsg}</span>
        </div>
        <Balance
          bold
          classNameAmount="my-tickes-price"
          classNameUnit="no-bold"
          amount={ticketPrice}
        />
        <Balance
          classNameWrapper="stake-transaction-ticket-reward"
          noSmallAmount
          amount={ticketReward}
        />
        {daysToVote !== null && !isNaN(daysToVote) ? (
          <Tooltip text={daysToVoteMessage}>
            <div className="transaction-info-overview-days-to-vote">
              <T
                id="statusSmall.daysToVotePlural"
                m="{days, plural, one {# day} other {# days}}"
                values={{ days: daysToVote }}
              />
            </div>
          </Tooltip>
        ) : (
          <div />
        )}
        <div className="transaction-account-name">{accountName}</div>
        {!pending && <div className="">{timeMessage(txTs)}</div>}
      </div>
    </Row>
  );
};
