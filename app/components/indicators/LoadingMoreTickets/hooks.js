import { useDispatch, useSelector } from "react-redux";
import * as ta from "actions/TransactionActions";
import * as sel from "selectors";

export function useLoadingMoreTickets() {
  const startRequestHeight = useSelector(sel.startRequestHeight);
  const ticketsFilter = useSelector(sel.ticketsFilter);
  const currentBlockHeight = useSelector(sel.currentBlockHeight);
  const stakeTransactionsCancel = useSelector(sel.getStakeTransactionsCancel);
  const transactionsRequestAttempt = useSelector(
    sel.getTransactionsRequestAttempt
  );

  const dispatch = useDispatch();
  const onToggleGetTransactions = () => dispatch(ta.toggleGetTransactions());

  return {
    startRequestHeight,
    ticketsFilter,
    currentBlockHeight,
    transactionsRequestAttempt,
    stakeTransactionsCancel,
    onToggleGetTransactions
  };
}
