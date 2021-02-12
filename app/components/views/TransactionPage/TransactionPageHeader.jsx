import { Balance } from "shared";
import { FormattedMessage as T, defineMessages, injectIntl } from "react-intl";
import {
  TRANSACTION_DIR_SENT,
  TRANSACTION_DIR_RECEIVED,
  TICKET_FEE,
  REGULAR,
  TICKET,
  VOTE,
  REVOCATION,
  COINBASE,
  MIXED,
  SELFTRANSFER
} from "constants/Decrediton";
import { SlateGrayButton } from "buttons";
import { StandaloneHeader } from "layout";
import { useSelector, useDispatch } from "react-redux";
import * as ca from "actions/ClientActions";
import * as sel from "selectors";
import styles from "./TransactionPage.module.css";

const messages = defineMessages({
  [TICKET]: { id: "txDetails.type.ticket", defaultMessage: "Ticket" },
  [VOTE]: { id: "txDetails.type.vote", defaultMessage: "Vote" },
  [REVOCATION]: { id: "txDetails.type.revoke", defaultMessage: "Revoke" },
  [COINBASE]: { id: "txDetails.type.coinbase", defaultMessage: "Coinbase" }
});

const headerIcons = {
  [TRANSACTION_DIR_RECEIVED]: "in",
  [TRANSACTION_DIR_SENT]: "out",
  [TICKET_FEE]: "ticketfee",
  [COINBASE]: "in",
  [TICKET]: "ticket",
  [VOTE]: "vote",
  [REVOCATION]: "revocation",
  [MIXED]: "mixed",
  [SELFTRANSFER]: "self"
};

// If it is a regular tx we use txDirection instead
const icon = ({ txType, txDirection }) =>
  txType === REGULAR ? headerIcons[txDirection] : headerIcons[txType];

const title = ({ txType, txAmount, txDirection, ticketReward, intl }) => {
  let titleComp;
  txType !== REGULAR
    ? (titleComp = intl.formatMessage(messages[txType]))
    : (titleComp = (
      <Balance
        title
        bold
        amount={
          txDirection !== TRANSACTION_DIR_RECEIVED ? -txAmount : txAmount
        }
      />
    ));
  if (txType === TICKET && ticketReward) {
    titleComp = `${titleComp}, Voted`;
  }
  return titleComp;
};

const backBtn = ({ goBack }) => (
  <SlateGrayButton onClick={() => goBack()} className="thin-button">
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
              <div className={styles.subtitleAccount}>
                {sentFromAccount}
              </div>
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

const TransactionPageHeader = ({
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
  selfTx
}) => {
  const dispatch = useDispatch();
  const tsDate = useSelector(sel.tsDate);
  const goBack = () => dispatch(ca.goBackHistory());
  const iconTxType = mixedTx ? MIXED : selfTx ? SELFTRANSFER : txType;
  return (
    <StandaloneHeader
      title={title({ txType, txAmount, txDirection, ticketReward, intl })}
      iconClassName={icon({ txType: iconTxType, txDirection })}
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
        txInputs
      })}
      actionButton={backBtn({ goBack })}
    />
  );
};

export default injectIntl(TransactionPageHeader);
