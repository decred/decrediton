import TransactionPage from "./Page";
import { transactionPage } from "connectors";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchMachine } from "stateMachines/FetchStateMachine";
import { DecredLoading } from "indicators";
import { useMachine } from "@xstate/react";
import { useState, useEffect } from "react";
import { find } from "fp";
import * as act from "actions/ClientActions";
import * as msg from "actions/DecodeMessageActions";
import * as sel from "selectors";

function Transaction () {
  const dispatch = useDispatch();
  const fetchMissingStakeTxData = () => dispatch(act.fetchMissingStakeTxData());
  const decodeRawTransactions = (hexTx) => dispatch(msg.decodeRawTransaction(hexTx));
  const { txHash } = useParams();
  const txHashToTicket = useSelector(sel.getTxHashToTicket);
  const decodedTransactions = useSelector(sel.decodedTransactions);
  const transactions = useSelector(sel.transactions);
  const [ viewedTransaction, setViewedTx ] = useState(find({ txHash }, transactions));
  console.log(find({ txHash }, transactions))
  const [ viewedDecodedTx, setViewedDecodedTx] = useState(decodedTransactions[txHash]);
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
              console.log(res)
              setViewedDecodedTx(res)
              send({ type: "RESOLVE", data: res })
            })
            .catch(error => {
              console.log(error)
              send({ type: "REJECT", error })
            });
        }
        const { txType, ticketPrice, leaveTimestamp } = viewedTransaction
        if ((txType === "Ticket" && !ticketPrice) || (txType == "Vote" && !leaveTimestamp)) {
          fetchMissingStakeTxData(viewedTransaction)
            .then(r => send("RESOLVE"))
            .catch(error => {
              console.log(error)
              send({ type: "REJECT", error })
            });
        }
      }
    }
  });

  switch (state.value) {
    case "idle":
      return <></>;
    case "loading":
      return <DecredLoading center />;
    case "success":
      return <TransactionPage {...{
        transactionDetails: viewedTransaction, decodedTransaction: viewedDecodedTx
      }}
    />;
    case "failure":
      return <p>Transaction not found</p>;
    default:
      return null;
  }
};

export default Transaction;
