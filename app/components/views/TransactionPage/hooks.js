import { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMachine } from "@xstate/react";
import { fetchMachine } from "stateMachines/FetchStateMachine";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as ta from "actions/TransactionActions";
import * as clia from "actions/ClientActions";
import * as vspa from "actions/VSPActions";
import { find, compose, eq, get } from "fp";

export function useTransactionPage(txHash) {
  const isSPV = useSelector(sel.isSPV);
  const regularTxs = useSelector(sel.regularTransactions);
  const stakeTxs = useSelector(sel.stakeTransactions);
  const decodedTransactions = useSelector(sel.decodedTransactions);
  const agendas = useSelector(sel.allAgendas);
  const voteChoices = useSelector(sel.voteChoices);
  const getVSPTicketStatusAttempt = useSelector(sel.getVSPTicketStatusAttempt);
  const isSigningMessage = useSelector(sel.isSigningMessage);
  const getAgendaSelectedChoice = useCallback(
    (agendaId) =>
      get(
        ["choiceId"],
        find(compose(eq(agendaId), get(["agendaId"])), voteChoices)
      ),
    [voteChoices]
  );

  const viewedTransaction = regularTxs[txHash]
    ? regularTxs[txHash]
    : stakeTxs[txHash];
  const [decodedTx, setViewedDecodedTx] = useState(decodedTransactions[txHash]);
  const currentBlockHeight = useSelector(sel.currentBlockHeight);

  const dispatch = useDispatch();
  const abandonTransaction = useCallback(
    (txHash) => dispatch(clia.abandonTransactionAttempt(txHash)),
    [dispatch]
  );
  const decodeRawTransactions = useCallback(
    (hexTx, txHash) => dispatch(ta.decodeRawTransaction(hexTx, txHash)),
    [dispatch]
  );
  const getAmountFromTxInputs = useCallback(
    (decodedTx) => dispatch(ta.getAmountFromTxInputs(decodedTx)),
    [dispatch]
  );
  const publishUnminedTransactions = useCallback(
    () => dispatch(ca.publishUnminedTransactionsAttempt()),
    [dispatch]
  );

  const [VSPTicketStatus, setVSPTicketStatus] = useState(null);

  const getVSPTicketStatus = useCallback(
    (passphrase) => {
      dispatch(
        vspa.getVSPTicketStatus(passphrase, viewedTransaction, decodedTx)
      ).then((res) => setVSPTicketStatus(res));
    },
    [dispatch, viewedTransaction, decodedTx]
  );

  const [state, send] = useMachine(fetchMachine, {
    actions: {
      initial: () => {
        if (!viewedTransaction) return send("REJECT");
        if (!decodedTx) return send("FETCH");
        send("RESOLVE");
      },
      load: async () => {
        if (!decodedTx) {
          const decodedTx = decodeRawTransactions(
            viewedTransaction.rawTx,
            viewedTransaction.txHash
          );
          let decodedTxWithInputs = decodedTx;
          // if it is a regular transaction and transaction is not received,
          // we need to get the input amount from older txs. If it is not
          // a wallet input getAmountFromTxInputs will throw an error, which
          // we ignore.
          if (viewedTransaction.isStake) {
            // TODO
            // Add sstxcommitment address to vote txs after
            // https://github.com/decred/decrediton/pull/2577 being merged.
          } else {
            try {
              decodedTxWithInputs = await getAmountFromTxInputs(decodedTx);
            } catch (error) {
              // if item does not exists it probably is a wallet non input
              // so the amount was not founded. We can ignore it.
              if (!error.toString().includes("item does not exist")) {
                throw error;
              }
            }
          }
          setViewedDecodedTx(decodedTxWithInputs);
          return send({ type: "RESOLVE" });
        }
      }
    }
  });

  return {
    abandonTransaction,
    publishUnminedTransactions,
    currentBlockHeight,
    state,
    viewedTransaction,
    decodedTx,
    isSPV,
    agendas,
    getAgendaSelectedChoice,
    getVSPTicketStatus,
    getVSPTicketStatusAttempt,
    VSPTicketStatus,
    isSigningMessage
  };
}
