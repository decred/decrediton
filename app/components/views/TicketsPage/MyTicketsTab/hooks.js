import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as ca from "actions/ClientActions";
import * as ta from "actions/TransactionActions";

export const useTicketsList = () => {
  const tickets = useSelector(sel.filteredStakeTxs);
  const tsDate = useSelector(sel.tsDate);
  const noMoreTickets = useSelector(sel.noMoreStakeTxs);
  const ticketsFilter = useSelector(sel.ticketsFilter);
  const window = useSelector(sel.mainWindow);

  const dispatch = useDispatch();
  const goBackHistory = useCallback(() => dispatch(ca.goBackHistory()), [
    dispatch
  ]);
  const getTickets = useCallback(
    (isStake) => dispatch(ta.getTransactions(isStake)),
    [dispatch]
  );
  const changeTicketsFilter = useCallback(
    (newFilter) => dispatch(ta.changeTicketsFilter(newFilter)),
    [dispatch]
  );

  return {
    tickets,
    tsDate,
    noMoreTickets,
    ticketsFilter,
    window,
    goBackHistory,
    getTickets,
    changeTicketsFilter
  };
};
