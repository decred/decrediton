import { useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as ta from "actions/TransactionActions";
import { MIXED } from "constants";

export function useHistoryTab() {
  const window = useSelector(sel.mainWindow);
  const tsDate = useSelector(sel.tsDate);
  const currencyDisplay = useSelector(sel.currencyDisplay);
  const unitDivisor = useSelector(sel.unitDivisor);
  const transactions = useSelector(sel.regularTransactions);
  const txFilter = useSelector(sel.transactionsFilter);

  // filteredTransactions filters a list of transactions given a filtering object.
  //
  // Currently supported filters in the txFilter object:
  // - type (array): Array of types a transaction must belong to, to be accepted.
  //   Currently, just the MIXED type is supported
  // - directions (array): Array of allowed directions for regular
  //   transactions (sent/received/transferred/ticketfee)
  //
  // If empty, all transactions are accepted.
  const filteredTransactions = useMemo(
    () =>
      Object.keys(transactions)
        .map((hash) => transactions[hash])
        .filter(
          (v) =>
            txFilter.directions.length == 0 || // All directions
            txFilter.directions.includes(v.txDirection)
        )
        .filter((v) =>
          txFilter.search
            ? v.creditAddresses.find(
                (address) =>
                  address.length > 1 &&
                  address
                    .toLowerCase()
                    .indexOf(txFilter.search.toLowerCase()) !== -1
              ) != undefined ||
              v.txHash.toLowerCase().includes(txFilter.search.toLowerCase())
            : true
        )
        .filter((v) =>
          txFilter.minAmount ? Math.abs(v.txAmount) >= txFilter.minAmount : true
        )
        .filter((v) =>
          txFilter.maxAmount ? Math.abs(v.txAmount) <= txFilter.maxAmount : true
        )
        .filter(
          (v) =>
            (txFilter.directions.length == 0 && txFilter.types.length == 0) || // All directions
            v.mixedTx == txFilter.types.includes(MIXED)
        ),

    [transactions, txFilter]
  );

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
    transactions: filteredTransactions,
    transactionsFilter: txFilter,
    totalBalance,
    noMoreTransactions,
    onGetTransactions,
    onChangeTransactionsFilter,
    transactionsRequestAttempt
  };
}
