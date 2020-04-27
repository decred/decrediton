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
import * as ta from "actions/TransactionActions";
import * as ca from "actions/ClientActions";
import * as msg from "actions/DecodeMessageActions";
import * as sel from "selectors";

const messages = defineMessages({
  Ticket: { id: "txDetails.type.ticket", defaultMessage: "Ticket" },
  Vote: { id: "txDetails.type.vote", defaultMessage: "Vote" },
  Revocation: { id: "txDetails.type.revoke", defaultMessage: "Revoke" },
  Coinbase: { id: "txDetails.type.coinbase", defaultMessage: "Coinbase" }
});

const headerIcons = {
  in: "tx-detail-icon-in",
  out: "tx-detail-icon-out",
  Coinbase: "tx-detail-icon-in",
  transfer: "tx-detail-icon-transfer",
  Ticket: "tx-detail-icon-ticket",
  Vote: "tx-detail-icon-vote",
  Revocation: "tx-detail-icon-revocation"
};

function Transaction({ intl }) {
  const { txHash } = useParams();
  const dispatch = useDispatch();
  const goBack = () => dispatch(ca.goBackHistory());
  const abandonTransaction = () => dispatch(ca.abandonTransaction(txHash));
  const fetchMissingStakeTxData = () => dispatch(ta.fetchMissingStakeTxData());
  const decodeRawTransactions = (hexTx) => dispatch(msg.decodeRawTransaction(hexTx));
  const tsDate = useSelector(sel.tsDate);
  const decodedTransactions = useSelector(sel.decodedTransactions);
  const transactionsMap = useSelector(sel.transactionsMap);
  const viewedTransaction = transactionsMap[txHash];
  const [ viewedDecodedTx, setViewedDecodedTx ] = useState(decodedTransactions[txHash]);
  const [ state, send ] = useMachine(fetchMachine, {
    actions: {
      initial: () => {
        if (!viewedTransaction) return send("REJECT");
        if (!viewedDecodedTx) return send("FETCH");
        send("RESOLVE");
      },
      load: () => {
        if (!viewedDecodedTx) {
          return decodeRawTransactions(viewedTransaction.rawTx)
            .then(res => {
              setViewedDecodedTx(res);
              send({ type: "RESOLVE", data: res });
            })
            .catch(error => {
              console.log(error);
              send({ type: "REJECT", error });
            });
        }
        const { txType, ticketPrice, leaveTimestamp } = viewedTransaction;
        if ((txType === "Ticket" && !ticketPrice) || (txType == "Vote" && !leaveTimestamp)) {
          fetchMissingStakeTxData(viewedTransaction)
            .then(() => send("RESOLVE"))
            .catch(error => {
              console.log(error);
              send({ type: "REJECT", error });
            });
        }
      }
    }
  });
  const {
    txType, txInputs, txAmount, txDirection, txTimestamp, ticketReward, ticketPrice,
    enterTimestamp, leaveTimestamp
  } = viewedTransaction;
  const isConfirmed = !!txTimestamp;
  // If it is a regular tx we use txDirection instead
  const icon = txType === "Regular" ? headerIcons[txDirection] : headerIcons[txType];

  let title = txType !== "Regular" ? intl.formatMessage(messages[txType]) :
    <Balance title bold amount={txDirection !== "in" ? -txAmount : txAmount} />;
  if (txType == "Ticket" && ticketReward) {
    title = title + ", Voted";
  }
  let sentFromAccount = "";
  // This assumes all inputs are from same account.
  if (txDirection == "out") {
    sentFromAccount = txInputs.length > 0 ? txInputs[0].accountName : "";
  }

  const backBtn =
    <SlateGrayButton onClick={() => goBack()} className="thin-button">
      <T id="txDetails.backBtn" m="Back" />
    </SlateGrayButton>;

  let subtitle = <div />;

  switch (txType) {
  case "Ticket":
  case "Vote":
    subtitle =
        <div className="tx-details-subtitle">
          {isConfirmed ?
            <div className="tx-details-subtitle-pair">
              <div className="tx-details-subtitle-sentfrom"><T id="txDetails.purchasedOn" m="Purchased On" /></div>
              <div className="tx-details-subtitle-date">
                <T id="txDetails.timestamp" m="{timestamp, date, medium} {timestamp, time, medium}" values={{ timestamp: tsDate(txType == "Vote" && enterTimestamp ? enterTimestamp : txTimestamp) }} />
              </div>
            </div> :
            <div className="tx-details-subtitle-date">
              <T id="txDetails.unConfirmed" m="Unconfirmed" />
            </div>
          }
          {leaveTimestamp && <div className="tx-details-subtitle-pair"><div className="tx-details-subtitle-sentfrom"><T id="txDetails.votedOn" m="Voted On" /></div><div className="tx-details-subtitle-date"><T id="txDetails.timestamp" m="{timestamp, date, medium} {timestamp, time, medium}" values={{ timestamp: tsDate(leaveTimestamp) }} /></div></div>}
          {ticketPrice && <div className="tx-details-subtitle-pair"><div className="tx-details-subtitle-sentfrom"><T id="txDetails.ticketCost" m="Ticket Cost" /></div><div className="tx-details-subtitle-account"><Balance amount={ticketPrice} /></div></div>}
          {ticketReward && <div className="tx-details-subtitle-pair"><div className="tx-details-subtitle-sentfrom"><T id="txDetails.reward" m="Reward" /></div><div className="tx-details-subtitle-account"><Balance amount={ticketReward} /></div></div>}
        </div>;
    break;
  default:
    subtitle =
        <div className="tx-details-subtitle">
          {txDirection == "out" ? <><div className="tx-details-subtitle-sentfrom"><T id="txDetails.sentFrom" m="Sent From" /></div><div className="tx-details-subtitle-account">{sentFromAccount}</div></> : <div />}
          <div className="tx-details-subtitle-date">{isConfirmed ? <T id="txDetails.timestamp" m="{timestamp, date, medium} {timestamp, time, medium}" values={{ timestamp: tsDate(txTimestamp) }} /> : <T id="txDetails.unConfirmed" m="Unconfirmed" />}</div>
        </div>;
  }

  const header =
    <StandaloneHeader
      title={title}
      iconClassName={icon}
      description={subtitle}
      actionButton={backBtn}
    />;

  const getStateComponent = () => {
    switch (state.value) {
    case "idle":
      return <></>;
    case "loading":
      return <DecredLoading center />;
    case "success":
      return <TransactionPage {...{
        transactionDetails: viewedTransaction, decodedTransaction: viewedDecodedTx, abandonTransaction
      }}
      />;
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
