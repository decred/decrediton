import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as ta from "actions/TransactionActions";

export function useHistoryTab() {
  const window = useSelector(sel.mainWindow);
  const tsDate = useSelector(sel.tsDate);
  const currencyDisplay = useSelector(sel.currencyDisplay);
  const unitDivisor = useSelector(sel.unitDivisor);
  const transactions = useSelector(sel.filteredRegularTxs);
  const transactionsFilter = useSelector(sel.transactionsFilter);
  const noMoreTransactions = useSelector(sel.noMoreRegularTxs);
  const totalBalance = useSelector(sel.totalBalance);
  const transactionsRequestAttempt = useSelector(
    sel.getTransactionsRequestAttempt
  );

  const dispatch = useDispatch();

  const onGetTransactions = (isStake) => dispatch(ta.getTransactions(isStake));

  const onChangeTransactionsFilter = useCallback(
    (newFilter) => dispatch(ta.changeTransactionsFilter(newFilter)),
    [dispatch]
  );

  return {
    window,
    tsDate,
    currencyDisplay,
    unitDivisor,
    transactions,
    transactionsFilter,
    totalBalance,
    noMoreTransactions,
    onGetTransactions,
    onChangeTransactionsFilter,
    transactionsRequestAttempt
  };
}
