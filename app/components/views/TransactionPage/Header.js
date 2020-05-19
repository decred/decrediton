import { Balance } from "shared";
import { FormattedMessage as T, defineMessages, injectIntl } from "react-intl";
import {
  OUT,
  IN,
  TRANSACTION_DIR_TRANSFERRED,
  REGULAR,
  TICKET,
  VOTE,
  REVOCATION,
  COINBASE
} from "constants/Decrediton";
import { SlateGrayButton } from "buttons";
import { StandaloneHeader } from "layout";
import { useSelector, useDispatch } from "react-redux";
import * as ca from "actions/ClientActions";
import * as sel from "selectors";

const messages = defineMessages({
  [TICKET]: { id: "txDetails.type.ticket", defaultMessage: "Ticket" },
  [VOTE]: { id: "txDetails.type.vote", defaultMessage: "Vote" },
  [REVOCATION]: { id: "txDetails.type.revoke", defaultMessage: "Revoke" },
  [COINBASE]: { id: "txDetails.type.coinbase", defaultMessage: "Coinbase" }
});

const headerIcons = {
  [IN]: "tx-detail-icon-in",
  [OUT]: "tx-detail-icon-out",
  [COINBASE]: "tx-detail-icon-in",
  [TRANSACTION_DIR_TRANSFERRED]: "tx-detail-icon-transfer",
  [TICKET]: "tx-detail-icon-ticket",
  [VOTE]: "tx-detail-icon-vote",
  [REVOCATION]: "tx-detail-icon-revocation"
};

// If it is a regular tx we use txDirection instead
const icon = ({ txType, txDirection }) =>
  txType === REGULAR ? headerIcons[txDirection] : headerIcons[txType];

const title = ({ txType, txAmount, txDirection, ticketReward, intl }) => {
  let titleComp;
  txType !== REGULAR ? (
    titleComp = intl.formatMessage(messages[txType])
  ) : (
      titleComp = <Balance
        title
        bold
        amount={txDirection !== IN ? -txAmount : txAmount}
      />
    );
  if (txType === TICKET && ticketReward) {
    titleComp = titleComp + ", Voted";
  }
}

const backBtn = ({ goBack, }) => (
  <SlateGrayButton onClick={() => goBack()} className="thin-button">
    <T id="txDetails.backBtn" m="Back" />
  </SlateGrayButton>
);

const subtitle = ({
  txType, isPending, enterTimestamp, timestamp, leaveTimestamp, ticketPrice, ticketReward, txDirection, tsDate, txInputs
}) => {
  let sentFromAccount = "";
  // This assumes all inputs are from same account.
  if (txDirection === "out") {
    sentFromAccount = txInputs.length > 0 ? txInputs[0].accountName : "";
  }
  switch (txType) {
    case REVOCATION:
    case TICKET:
    case VOTE:
      return (
        <div className="tx-details-subtitle">
          {!isPending ? (
            <div className="tx-details-subtitle-pair">
              <div className="tx-details-subtitle-sentfrom">
                <T id="txDetails.purchasedOn" m="Purchased On" />
              </div>
              <div className="tx-details-subtitle-date">
                <T
                  id="txDetails.timestamp"
                  m="{timestamp, date, medium} {timestamp, time, medium}"
                  values={{
                    timestamp: tsDate(
                      ((txType === VOTE || txType === REVOCATION) &&
                      enterTimestamp)
                        ? enterTimestamp
                        : timestamp
                    )
                  }}
                />
              </div>
            </div>
          ) : (
              <div className="tx-details-subtitle-date">
                <T id="txDetails.unConfirmed" m="Unconfirmed" />
              </div>
            )}
          {leaveTimestamp && (
            <div className="tx-details-subtitle-pair">
              <div className="tx-details-subtitle-sentfrom">
                <T id="txDetails.votedOn" m="Voted On" />
              </div>
              <div className="tx-details-subtitle-date">
                <T
                  id="txDetails.timestamp"
                  m="{timestamp, date, medium} {timestamp, time, medium}"
                  values={{ timestamp: tsDate(leaveTimestamp) }}
                />
              </div>
            </div>
          )}
          {ticketPrice && (
            <div className="tx-details-subtitle-pair">
              <div className="tx-details-subtitle-sentfrom">
                <T id="txDetails.ticketCost" m="Ticket Cost" />
              </div>
              <div className="tx-details-subtitle-account">
                <Balance amount={ticketPrice} />
              </div>
            </div>
          )}
          {ticketReward && (
            <div className="tx-details-subtitle-pair">
              <div className="tx-details-subtitle-sentfrom">
                <T id="txDetails.reward" m="Reward" />
              </div>
              <div className="tx-details-subtitle-account">
                <Balance amount={ticketReward} />
              </div>
            </div>
          )}
        </div>
      );
      break;
    default:
      return (
        <div className="tx-details-subtitle">
          {txDirection == "out" ? (
            <>
              <div className="tx-details-subtitle-sentfrom">
                <T id="txDetails.sentFrom" m="Sent From" />
              </div>
              <div className="tx-details-subtitle-account">
                {sentFromAccount}
              </div>
            </>
          ) : (
              <div />
            )}
          <div className="tx-details-subtitle-date">
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
}

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
  txInputs
}) => {
  const dispatch = useDispatch();
  const tsDate = useSelector(sel.tsDate);
  const date = tsDate(enterTimestamp)
  const goBack = () => dispatch(ca.goBackHistory());
  return <StandaloneHeader
    title={title({ txType, txAmount, txDirection, ticketReward, intl })}
    iconClassName={icon({ txType, txDirection })}
    description={subtitle({
      txType, isPending, enterTimestamp, timestamp, leaveTimestamp, ticketPrice, ticketReward, txDirection, tsDate, txInputs
    })}
    actionButton={backBtn({ goBack })}
  />;
}

export default injectIntl(Header);
