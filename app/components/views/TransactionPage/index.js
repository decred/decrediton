import TransactionPage from "./Page";
import { FormattedMessage as T, defineMessages, injectIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchMachine } from "stateMachines/FetchStateMachine";
import { DecredLoading } from "indicators";
import { useMachine } from "@xstate/react";
import { useState } from "react";
import { Balance } from "shared";
import { SlateGrayButton } from "buttons";
import { StandaloneHeader, StandalonePage } from "layout";
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
import * as ta from "actions/TransactionActions";
import * as ca from "actions/ClientActions";
import * as sel from "selectors";

// TODO use constants instead
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

function Transaction({ intl }) {
  const { txHash } = useParams();
  const dispatch = useDispatch();
  const goBack = () => dispatch(ca.goBackHistory());
  const abandonTransaction = () => dispatch(ca.abandonTransaction(txHash));
  const fetchMissingStakeTxData = () => dispatch(ta.fetchMissingStakeTxData());
  const decodeRawTransactions = (hexTx) =>
    dispatch(ta.decodeRawTransaction(hexTx, txHash));
  const tsDate = useSelector(sel.tsDate);
  const decodedTransactions = useSelector(sel.decodedTransactions);
  const transactions = useSelector(sel.regularTransactions);
  const viewedTransaction = transactions[txHash];
  const [viewedDecodedTx, setViewedDecodedTx] = useState(
    decodedTransactions[txHash]
  );
  const [state, send] = useMachine(fetchMachine, {
    actions: {
      initial: () => {
        if (!viewedTransaction) return send("REJECT");
        if (!viewedDecodedTx) return send("FETCH");
        send("RESOLVE");
      },
      load: () => {
        if (!viewedDecodedTx) {
          const decodedTx = decodeRawTransactions(viewedTransaction.rawTx);
          console.log(decodedTx);
          setViewedDecodedTx(decodedTx);
          return send({ type: "RESOLVE", data: decodedTx });
        }
        const { txType, ticketPrice, leaveTimestamp } = viewedTransaction;
        if (
          (txType === TICKET && !ticketPrice) ||
          (txType == VOTE && !leaveTimestamp)
        ) {
          fetchMissingStakeTxData(viewedTransaction)
            .then(() => send("RESOLVE"))
            .catch((error) => {
              console.log(error);
              send({ type: "REJECT", error });
            });
        }
      }
    }
  });
  const {
    txType,
    txInputs,
    txAmount,
    txDirection,
    timestamp,
    ticketReward,
    enterTimestamp,
    leaveTimestamp,
    ticketPrice
  } = viewedTransaction;
  console.log(viewedTransaction);
  const isConfirmed = !!timestamp;
  // If it is a regular tx we use txDirection instead
  const icon =
    txType === REGULAR ? headerIcons[txDirection] : headerIcons[txType];

  let title =
    txType !== REGULAR ? (
      intl.formatMessage(messages[txType])
    ) : (
      <Balance
        title
        bold
        amount={txDirection !== "in" ? -txAmount : txAmount}
      />
    );
  if (txType == TICKET && ticketReward) {
    title = title + ", Voted";
  }
  let sentFromAccount = "";
  // This assumes all inputs are from same account.
  if (txDirection == "out") {
    sentFromAccount = txInputs.length > 0 ? txInputs[0].accountName : "";
  }

  const backBtn = (
    <SlateGrayButton onClick={() => goBack()} className="thin-button">
      <T id="txDetails.backBtn" m="Back" />
    </SlateGrayButton>
  );

  let subtitle = <div />;

  switch (txType) {
    case TICKET:
    case VOTE:
      subtitle = (
        <div className="tx-details-subtitle">
          {isConfirmed ? (
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
                      txType == VOTE && enterTimestamp
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
      subtitle = (
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
            {isConfirmed ? (
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

  const header = (
    <StandaloneHeader
      title={title}
      iconClassName={icon}
      description={subtitle}
      actionButton={backBtn}
    />
  );

  const getStateComponent = () => {
    switch (state.value) {
      case "idle":
        return <></>;
      case "loading":
        return <DecredLoading center />;
      case "success":
        return (
          <TransactionPage
            {...{
              transactionDetails: viewedTransaction,
              decodedTransaction: viewedDecodedTx,
              abandonTransaction
            }}
          />
        );
      case "failure":
        return <p>Transaction not found</p>;
      default:
        return null;
    }
  };

  return (
    <StandalonePage header={header} className="txdetails-standalone-page">
      {getStateComponent()}
    </StandalonePage>
  );
}

export default injectIntl(Transaction);
