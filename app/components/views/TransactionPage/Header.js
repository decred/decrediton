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
import { classNames } from "pi-ui";

const messages = defineMessages({
  [TICKET]: { id: "txDetails.type.ticket", defaultMessage: "Ticket" },
  [VOTE]: { id: "txDetails.type.vote", defaultMessage: "Vote" },
  [REVOCATION]: { id: "txDetails.type.revoke", defaultMessage: "Revoke" },
  [COINBASE]: { id: "txDetails.type.coinbase", defaultMessage: "Coinbase" }
});

const headerIcons = {
  [TRANSACTION_DIR_RECEIVED]: "tx-detail-icon-in",
  [TRANSACTION_DIR_SENT]: "tx-detail-icon-out",
  [TICKET_FEE]: "tx-detail-icon-ticketfee",
  [COINBASE]: "tx-detail-icon-in",
  [TICKET]: "tx-detail-icon-ticket",
  [VOTE]: "tx-detail-icon-vote",
  [REVOCATION]: "tx-detail-icon-revocation",
  [MIXED]: "tx-detail-icon-mixed",
  [SELFTRANSFER]: "tx-detail-icon-self"
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
    titleComp = titleComp + ", Voted";
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
        <div className={styles.txDetailsSubtitle}>
          {!isPending ? (
            <div className={styles.txDetailsSubtitlePair}>
              <div className={styles.txDetailsSubtitleSentfrom}>
                <T id="txDetails.purchasedOn" m="Purchased On" />
              </div>
              <div
                className={classNames(
                  styles.txDetailsSubtitleDate,
                  styles.blueValueHighlightMixin
                )}>
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
            <div
              className={classNames(
                styles.txDetailsSubtitleDate,
                styles.blueValueHighlightMixin
              )}>
              <T id="txDetails.unConfirmed" m="Unconfirmed" />
            </div>
          )}
          {leaveTimestamp && (
            <div className={styles.txDetailsSubtitlePair}>
              <div className={styles.txDetailsSubtitleSentfrom}>
                <T id="txDetails.votedOn" m="Voted On" />
              </div>
              <div
                className={classNames(
                  styles.txDetailsSubtitleDate,
                  styles.blueValueHighlightMixin
                )}>
                <T
                  id="txDetails.timestamp"
                  m="{timestamp, date, medium} {timestamp, time, medium}"
                  values={{ timestamp: tsDate(leaveTimestamp) }}
                />
              </div>
            </div>
          )}
          {ticketPrice && (
            <div className={styles.txDetailsSubtitlePair}>
              <div className={styles.txDetailsSubtitleSentfrom}>
                <T id="txDetails.ticketCost" m="Ticket Cost" />
              </div>
              <div
                className={classNames(
                  styles.txDetailsSubtitleAccount,
                  styles.blueValueHighlightMixin
                )}>
                <Balance amount={ticketPrice} />
              </div>
            </div>
          )}
          {ticketReward && (
            <div className={styles.txDetailsSubtitlePair}>
              <div className={styles.txDetailsSubtitleSentfrom}>
                <T id="txDetails.reward" m="Reward" />
              </div>
              <div
                className={classNames(
                  styles.txDetailsSubtitleAccount,
                  styles.blueValueHighlightMixin
                )}>
                <Balance amount={ticketReward} />
              </div>
            </div>
          )}
        </div>
      );
    default:
      return (
        <div className={styles.txDetailsSubtitle}>
          {txDirection === TRANSACTION_DIR_SENT ? (
            <>
              <div className={styles.txDetailsSubtitleSentfrom}>
                <T id="txDetails.sentFrom" m="Sent From" />
              </div>
              <div
                className={classNames(
                  styles.txDetailsSubtitleAccount,
                  styles.blueValueHighlightMixin
                )}>
                {sentFromAccount}
              </div>
            </>
          ) : (
            <div />
          )}
          <div
            className={classNames(
              styles.txDetailsSubtitleDate,
              styles.blueValueHighlightMixin
            )}>
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

const Header = ({
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

export default injectIntl(Header);
