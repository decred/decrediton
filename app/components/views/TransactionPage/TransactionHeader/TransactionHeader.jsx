import { Balance } from "shared";
import { FormattedMessage as T, defineMessages, injectIntl } from "react-intl";
import {
  TRANSACTION_DIR_SENT,
  TRANSACTION_DIR_RECEIVED,
  TICKET_FEE,
  REGULAR,
  TICKET,
  LIVE,
  VOTE,
  VOTED,
  MISSED,
  REVOKED,
  EXPIRED,
  UNMINED,
  IMMATURE,
  REVOCATION,
  COINBASE,
  MIXED,
  SELFTRANSFER,
  OUT_ICON,
  TICKETFEE_ICON,
  IN_ICON,
  TICKET_ICON,
  VOTE_ICON,
  MISSED_ICON,
  REVOCATION_ICON,
  MIXED_ICON,
  SELF_ICON,
  UNMINED_ICON,
  IMMATURE_ICON
} from "constants/decrediton";
import { SlateGrayButton } from "buttons";
import { StandaloneHeader } from "layout";
import { useSelector, useDispatch } from "react-redux";
import * as ca from "actions/ClientActions";
import * as sel from "selectors";
import styles from "./TransactionHeader.module.css";

const messages = defineMessages({
  [TICKET]: { id: "txDetails.type.ticket", defaultMessage: "Ticket" },
  [VOTE]: { id: "txDetails.type.vote", defaultMessage: "Vote" },
  [REVOCATION]: {
    id: "txDetails.type.revocation",
    defaultMessage: "Revocation"
  },
  [COINBASE]: { id: "txDetails.type.coinbase", defaultMessage: "Coinbase" },
  [MISSED]: { id: "txDetails.type.missed", defaultMessage: "Missed" },
  [UNMINED]: { id: "txDetails.type.unmined", defaultMessage: "Unmined" },
  [IMMATURE]: { id: "txDetails.type.immature", defaultMessage: "Immature" },
  [LIVE]: { id: "txDetails.type.live", defaultMessage: "Live" },
  [VOTED]: { id: "txDetails.type.voted", defaultMessage: "Voted" },
  [REVOKED]: { id: "txDetails.type.revoked", defaultMessage: "Revoked" },
  [EXPIRED]: { id: "txDetails.type.expired", defaultMessage: "Expired" }
});

const headerIcons = {
  [TRANSACTION_DIR_RECEIVED]: IN_ICON,
  [TRANSACTION_DIR_SENT]: OUT_ICON,
  [TICKET_FEE]: TICKETFEE_ICON,
  [COINBASE]: IN_ICON,
  [TICKET]: TICKET_ICON,
  [VOTE]: VOTE_ICON,
  [IMMATURE]: IMMATURE_ICON,
  [UNMINED]: UNMINED_ICON,
  [MISSED]: MISSED_ICON,
  [REVOCATION]: REVOCATION_ICON,
  [MIXED]: MIXED_ICON,
  [SELFTRANSFER]: SELF_ICON
};

// If it is a regular tx we use txDirection instead
const icon = ({ txType, txDirection, status }) =>
  txType === REGULAR
    ? headerIcons[txDirection]
    : headerIcons[
        [MISSED, UNMINED, IMMATURE].includes(status) ? status : txType
      ];

const title = ({ txType, txAmount, txDirection, intl, status }) => {
  if (txType === REGULAR) {
    return (
      <Balance
        title
        bold
        amount={txDirection !== TRANSACTION_DIR_RECEIVED ? -txAmount : txAmount}
      />
    );
  } else if (txType === TICKET) {
    return `${intl.formatMessage(messages[txType])}, ${intl.formatMessage(
      messages[status]
    )}`;
  } else if (messages[txType]) {
    return intl.formatMessage(messages[txType]);
  } else if (messages[status]) {
    return intl.formatMessage(messages[status]);
  } else {
    console.error("unknown transaction");
    return "";
  }
};

const backBtn = ({ goBack }) => (
  <SlateGrayButton onClick={() => goBack()} className={styles.thinButton}>
    <T id="txDetails.backBtn" m="Back" />
  </SlateGrayButton>
);

const subtitle = ({
  txType,
  isPending,
  enterTimestamp,
  timestamp,
  leaveTimestamp,
  ticketPrice,
  ticketReward,
  txDirection,
  tsDate,
  txInputs
}) => {
  let sentFromAccount = "";
  // This assumes all inputs are from same account.
  if (txDirection === TRANSACTION_DIR_SENT) {
    sentFromAccount = txInputs.length > 0 ? txInputs[0].accountName : "";
  }
  switch (txType) {
    case REVOCATION:
    case TICKET:
    case VOTE:
      return (
        <div className={styles.subtitle}>
          {!isPending ? (
            <div className={styles.subtitlePair}>
              <div className={styles.subtitleSentfrom}>
                <T id="txDetails.purchasedOn" m="Purchased On" />
              </div>
              <div className={styles.subtitleDate}>
                <T
                  id="txDetails.timestamp"
                  m="{timestamp, date, medium} {timestamp, time, medium}"
                  values={{
                    timestamp: tsDate(
                      enterTimestamp ? enterTimestamp : timestamp
                    )
                  }}
                />
              </div>
            </div>
          ) : (
            <div className={styles.subtitleDate}>
              <T id="txDetails.unConfirmed" m="Unconfirmed" />
            </div>
          )}
          {leaveTimestamp && (
            <div className={styles.subtitlePair}>
              <div className={styles.subtitleSentfrom}>
                <T id="txDetails.votedOn" m="Voted On" />
              </div>
              <div className={styles.subtitleDate}>
                <T
                  id="txDetails.timestamp"
                  m="{timestamp, date, medium} {timestamp, time, medium}"
                  values={{ timestamp: tsDate(leaveTimestamp) }}
                />
              </div>
            </div>
          )}
          {ticketPrice && (
            <div className={styles.subtitlePair}>
              <div className={styles.subtitleSentfrom}>
                <T id="txDetails.ticketCost" m="Ticket Cost" />
              </div>
              <div className={styles.subtitleAccount}>
                <Balance amount={ticketPrice} />
              </div>
            </div>
          )}
          {ticketReward && (
            <div className={styles.subtitlePair}>
              <div className={styles.subtitleSentfrom}>
                <T id="txDetails.reward" m="Reward" />
              </div>
              <div className={styles.subtitleAccount}>
                <Balance amount={ticketReward} />
              </div>
            </div>
          )}
        </div>
      );
    default:
      return (
        <div className={styles.subtitle}>
          {txDirection === TRANSACTION_DIR_SENT ? (
            <>
              <div className={styles.subtitleSentfrom}>
                <T id="txDetails.sentFrom" m="Sent From" />
              </div>
              <div className={styles.subtitleAccount}>{sentFromAccount}</div>
            </>
          ) : (
            <div />
          )}
          <div className={styles.subtitleDate}>
            {!isPending ? (
              <T
                id="txDetails.timestamp"
                m="{timestamp, date, medium} {timestamp, time, medium}"
                values={{ timestamp: tsDate(timestamp) }}
              />
            ) : (
              <T id="txDetails.unConfirmed" m="Unconfirmed" />
            )}
          </div>
        </div>
      );
  }
};

const TransactionHeader = ({
  txType,
  txAmount,
  isPending,
  enterTimestamp,
  timestamp,
  leaveTimestamp,
  ticketPrice,
  ticketReward,
  txDirection,
  intl,
  txInputs,
  mixedTx,
  selfTx,
  status
}) => {
  const dispatch = useDispatch();
  const tsDate = useSelector(sel.tsDate);
  const goBack = () => dispatch(ca.goBackHistory());
  const iconTxType = mixedTx ? MIXED : selfTx ? SELFTRANSFER : txType;
  return (
    <StandaloneHeader
      title={title({
        txType,
        txAmount,
        txDirection,
        intl,
        status
      })}
      iconType={icon({ txType: iconTxType, txDirection, status })}
      description={subtitle({
        txType,
        isPending,
        enterTimestamp,
        timestamp,
        leaveTimestamp,
        ticketPrice,
        ticketReward,
        txDirection,
        tsDate,
        txInputs,
        status
      })}
      actionButton={backBtn({ goBack })}
    />
  );
};

export default injectIntl(TransactionHeader);
