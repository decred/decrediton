import { useMemo } from "react";
import Row from "./Row";
import { FormattedMessage as T } from "react-intl";
import { Balance, Tooltip } from "shared";
import { diffBetweenTwoTs } from "helpers/dateFormat";
import { classNames } from "pi-ui";
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
  txTs,
  accountName,
  txType,
  ...props
}) => {
  const status = className;

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

  const typeMsg = messageByType[txType] || "(unknown type)";

  return overview ? (
    <Row {...{ className, overview, pending, ...props }}>
      <div className="is-row">
        <span className={classNames(styles[className], styles.icon)} />
        <span
          className={classNames(styles.stakeType, overview && styles.overview)}>
          {typeMsg}
        </span>
        {!pending && (
          <div className={styles.timeDateSpacer}>{timeMessage(txTs)}</div>
        )}
      </div>
      <div className={styles.priceReward}>
        <Tooltip text={<TicketPriceMessage ticketPrice={ticketPrice} />}>
          <Balance amount={ticketPrice} />
        </Tooltip>
        <Tooltip text={ticketRewardMessage}>
          <Balance
            classNameWrapper={classNames(
              styles.ticketReward,
              overview && styles.overview
            )}
            amount={ticketReward}
            noSmallAmount
          />
        </Tooltip>
        {daysToVote !== null && !isNaN(daysToVote) && (
          <Tooltip text={daysToVoteMessage}>
            <div className={styles.daysToVote}>
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
      <div className={styles.myTickets}>
        <div>
          <span className={classNames(styles[className], styles.icon)} />
          <span className={styles.stakeType}>{typeMsg}</span>
        </div>
        <Balance
          bold
          classNameAmount={styles.myTicketsPrice}
          classNameUnit={styles.noBold}
          amount={ticketPrice}
        />
        <Balance
          classNameWrapper={styles.ticketReward}
          noSmallAmount
          amount={ticketReward}
        />
        {daysToVote !== null && !isNaN(daysToVote) ? (
          <Tooltip text={daysToVoteMessage}>
            <div className={styles.daysToVote}>
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
        <div className={styles.accountName}>{accountName}</div>
        {!pending && <div>{timeMessage(txTs)}</div>}
      </div>
    </Row>
  );
};

export default StakeTxRow;
