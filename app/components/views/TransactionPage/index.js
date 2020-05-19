import TransactionPage from "./Page";
import Header from "./Header"
import { FormattedMessage as T, defineMessages, injectIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchMachine } from "stateMachines/FetchStateMachine";
import { DecredLoading } from "indicators";
import { useMachine } from "@xstate/react";
import { useState, useEffect } from "react";
import { StandaloneHeader, StandalonePage } from "layout";
import * as ta from "actions/TransactionActions";
import * as sel from "selectors";

function Transaction({ intl }) {
  const { txHash } = useParams();
  const dispatch = useDispatch();
  const abandonTransaction = () => dispatch(ca.abandonTransaction(txHash));
  const fetchMissingStakeTxData = () => dispatch(ta.fetchMissingStakeTxData());
  const decodeRawTransactions = (hexTx) =>
    dispatch(ta.decodeRawTransaction(hexTx, txHash));
  const getAmountFromTxInputs = (decodedTx) => dispatch(ta.getAmountFromTxInputs(decodedTx));
  const tsDate = useSelector(sel.tsDate);
  const decodedTransactions = useSelector(sel.decodedTransactions);
  const transactions = useSelector(sel.transactionsMap);
  const regularTxs = useSelector(sel.regularTransactions);
  const stakeTxs = useSelector(sel.stakeTransactions);
  // txFromMap from map are not completed, as they have not bein normalized
  // yet.
  const txFromMap = transactions[txHash];
  const [viewedTransaction, setViewedTx] = useState(null);
  const [viewedDecodedTx, setViewedDecodedTx] = useState(
    decodedTransactions[txHash]
  );
  const [state, send] = useMachine(fetchMachine, {
    actions: {
      initial: () => {
        if (!txFromMap) return send("REJECT");
        if (!viewedDecodedTx) return send("FETCH");
        send("RESOLVE");
      },
      load: async () => {
        if (!viewedDecodedTx) {
          console.log(viewedTransaction)
          const decodedTx = decodeRawTransactions(txFromMap.rawTx);
          const decodedTxWithInputs = await getAmountFromTxInputs(decodedTx);
          console.log(decodedTxWithInputs);
          setViewedDecodedTx(decodedTxWithInputs);
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
  useEffect(() => {
    console.log(txHash)
    const viewedTx = txFromMap.isStake ? stakeTxs[txHash] : regularTxs[txHash];
    console.log(viewedTx)
    setViewedTx(viewedTx)
  }, [state])

  switch (state.value) {
    case "idle":
      return <></>;
    case "loading":
      return (
        <StandalonePage header={Header({...viewedTransaction})} className="txdetails-standalone-page">
          <DecredLoading center />
        </StandalonePage>
      )
    case "success":
      return (
        <StandalonePage header={Header({...viewedTransaction})} className="txdetails-standalone-page">
          <TransactionPage
            {...{
              transactionDetails: viewedTransaction,
              decodedTransaction: viewedDecodedTx,
              abandonTransaction
            }}
          />
        </StandalonePage>
      );
    case "failure":
      return <p>Transaction not found</p>;
    default:
      return null;
  }
}

export default injectIntl(Transaction);
