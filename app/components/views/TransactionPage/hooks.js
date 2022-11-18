import { useCallback, useState, useEffect } from "react";
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

  const findViewedTransaction = useCallback(
    () => (regularTxs[txHash] ? regularTxs[txHash] : stakeTxs[txHash]),
    [txHash, regularTxs, stakeTxs]
  );

  const [viewedTransaction, setViewedTransaction] = useState(() =>
    findViewedTransaction()
  );
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

  const noMoreTransactions = useSelector(sel.noMoreRegularTxs);
  const noMoreTickets = useSelector(sel.noMoreStakeTxs);
  const transactionsRequestAttempt = useSelector(
    sel.getTransactionsRequestAttempt
  );
  const onGetTransactions = useCallback(
    (isStake) => dispatch(ta.getTransactions(isStake)),
    [dispatch]
  );

  const decodeTx = useCallback(
    async (tx) => {
      const decodedTx = decodeRawTransactions(tx.rawTx, tx.txHash);
      let decodedTxWithInputs = decodedTx;
      // if it is a regular transaction and transaction is not received,
      // we need to get the input amount from older txs. If it is not
      // a wallet input getAmountFromTxInputs will throw an error, which
      // we ignore.
      if (tx.isStake) {
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
    },
    [decodeRawTransactions, getAmountFromTxInputs]
  );

  const [state, send] = useMachine(fetchMachine, {
    actions: {
      initial: () => {
        if (!decodedTx || !viewedTransaction) return send("FETCH");
        send("RESOLVE");
      },
      load: () => {
        if (viewedTransaction && !decodedTx) {
          decodeTx(viewedTransaction).then(() => send("RESOLVE"));
        } else if (viewedTransaction) {
          send("RESOLVE");
        }
      }
    }
  });

  useEffect(() => {
    // if `findViewedTransaction` can't find the transaction identified
    // by the txHash in the `regularTxs` or in `stakeTxs` which are
    // fetched already, fetch more txs from the dcrwallet until we
    // find it, or until there are no more transactions to get.
    const tx = findViewedTransaction();

    if (tx) {
      // tx has been found, decode it and resolve fetchmachine
      setViewedTransaction(tx);
      decodeTx(tx).then(() => send("RESOLVE"));
      return;
    }

    if (transactionsRequestAttempt) {
      return;
    }

    if (noMoreTransactions && noMoreTickets) {
      // fetched all txs, but not found the tx.
      // send fetchmachine to reject and show error
      send("REJECT");
      return;
    }
    if (!noMoreTickets) {
      onGetTransactions(true);
      return;
    }
    if (!noMoreTransactions) {
      onGetTransactions(false);
      return;
    }
  }, [
    findViewedTransaction,
    noMoreTransactions,
    noMoreTickets,
    transactionsRequestAttempt,
    onGetTransactions,
    decodeTx,
    send
  ]);

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
