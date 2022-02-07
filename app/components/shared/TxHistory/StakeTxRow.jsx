import { useMemo } from "react";
import { FormattedMessage as T } from "react-intl";
import { classNames, Tooltip } from "pi-ui";
import Row from "./Row";
import { Balance } from "shared";
import { diffBetweenTwoTs } from "helpers";
import { messageByType } from "./helpers";
import TicketPriceMessage from "./TicketPriceMessage";
import styles from "./TxHistory.module.css";

const StakeTxRow = ({
  className,
  timeMessage,
  overview,
  ticketPrice,
  ticketReward,
  leaveTimestamp,
  enterTimestamp,
  pending,
  txLeaveTs,
  accountName,
  txType,
  status,
  ...props
}) => {
  const ticketRewardMessage = useMemo(
    () => (
      <T
        id="history.ticket.rewardMesage"
        m={"{rewardLabel}: {reward}"}
        values={{
          rewardLabel: <T id="history.ticket.rewardLabel" m="Ticket Reward" />,
          reward: <Balance amount={ticketReward || 0} />
        }}
      />
    ),
    [ticketReward]
  );

  // ticket can have leaveTimestamp equals null, which is not voted yet
  const daysToVote = useMemo(
    () =>
      leaveTimestamp ? diffBetweenTwoTs(leaveTimestamp, enterTimestamp) : null,
    [enterTimestamp, leaveTimestamp]
  );

  const daysToVoteMessage = useMemo(
    () => (
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
    ),
    [daysToVote]
  );

  const showDaysToVote = daysToVote !== null && !isNaN(daysToVote);

  // If txType equals ticket, we use the message bype by the tx status, so we
  // can show the proper icon (Revoked, Voted). Although we show the message
  // as Purchased, to avoid confusion.
  const typeMsg =
    txType === "ticket"
      ? messageByType[status]
      : messageByType[txType] || "(unknown type)";
  return (
    <Row {...{ className, pending, ...props, overview }}>
      <div
        className={classNames(styles.myTickets, overview && styles.overview)}>
        <div className={styles.iconContainer}>
          <span className={classNames(styles[className], styles.icon)} />
        </div>
        <span className={styles.stakeType}>
          {overview ? (
            <T
              id="ticket.type.ticketLabel"
              m="Ticket, {typeMsg}"
              values={{
                typeMsg
              }}
            />
          ) : (
            typeMsg
          )}
        </span>
        {!pending && (
          <div className={styles.timeDateSpacer}>
            {txLeaveTs && timeMessage(txLeaveTs)}
          </div>
        )}
        <div className={styles.ticketPriceContainer}>
          <Tooltip content={<TicketPriceMessage ticketPrice={ticketPrice} />}>
            <Balance
              flat={overview}
              classNameWrapper={styles.ticketPrice}
              classNameSecondary={styles.ticketPriceSecondary}
              classNameUnit={styles.ticketPriceUnit}
              amount={ticketPrice}
            />
          </Tooltip>
        </div>
        <div className={styles.ticketDetailsContainer}>
          <div className={styles.ticketRewardContainer}>
            <Tooltip content={ticketRewardMessage}>
              <Balance
                noSmallAmount
                flat
                classNameWrapper={styles.ticketReward}
                classNameSecondary={styles.ticketRewardSecondary}
                classNameUnit={styles.ticketRewardUnit}
                amount={ticketReward}
              />
            </Tooltip>
          </div>
          {showDaysToVote ? (
            <div className={styles.daysToVoteContainer}>
              <Tooltip content={daysToVoteMessage}>
                <div className={styles.daysToVote}>
                  <T
                    id="statusSmall.daysToVotePlural"
                    m="{days, plural, one {# day} other {# days}}"
                    values={{ days: daysToVote }}
                  />
                </div>
              </Tooltip>
            </div>
          ) : (
            <div />
          )}
        </div>
        <div className={classNames(styles.accountName, styles.stakeAccount)}>
          {accountName}
        </div>
      </div>
    </Row>
  );
};

export default StakeTxRow;
