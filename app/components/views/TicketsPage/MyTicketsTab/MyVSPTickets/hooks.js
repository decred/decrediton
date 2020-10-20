import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as ca from "actions/ClientActions";
import * as ta from "actions/TransactionActions";
import * as vspa from "actions/VSPActions";

export const useVSPTicketsList = () => {
  const dispatch = useDispatch();

  // selectors
  const vspTickets = useSelector(sel.getVSPTickets);

  const tsDate = useSelector(sel.tsDate);
  const noMoreTickets = useSelector(sel.noMoreStakeTxs);
  const ticketsFilter = useSelector(sel.ticketsFilter);
  const window = useSelector(sel.mainWindow);

  // actions
  const goBackHistory = () => dispatch(ca.goBackHistory());
  const getTickets = (isStake) => dispatch(ta.getTransactions(isStake));
  const changeTicketsFilter = (newFilter) =>
    dispatch(ta.changeTicketsFilter(newFilter));
  const getVSPTicketsByFeeStatus = (feeStatus) => dispatch(vspa.getVSPTicketsByFeeStatus(feeStatus));

  return {
    tsDate,
    noMoreTickets,
    ticketsFilter,
    window,
    goBackHistory,
    getTickets,
    changeTicketsFilter,
    getVSPTicketsByFeeStatus,
    vspTickets
  };
};
