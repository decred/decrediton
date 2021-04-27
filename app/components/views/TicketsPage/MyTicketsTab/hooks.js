import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as ca from "actions/ClientActions";
import * as ta from "actions/TransactionActions";

let qrPage = 0;
const TICKET_QR_PAGE = "TICKET_QR_PAGE";

export const useTicketsList = () => {
  const dispatch = useDispatch();

  // selectors
  const tickets = useSelector(sel.filteredStakeTxs);
  const tsDate = useSelector(sel.tsDate);
  const noMoreTickets = useSelector(sel.noMoreStakeTxs);
  const ticketsFilter = useSelector(sel.ticketsFilter);
  const window = useSelector(sel.mainWindow);

  // actions
  const goBackHistory = () => dispatch(ca.goBackHistory());
  const getTickets = (isStake) => dispatch(ta.getTransactions(isStake));
  const changeTicketsFilter = (newFilter) =>
    dispatch(ta.changeTicketsFilter(newFilter));
  const setQRPage = (page) => {
    qrPage = page;
    dispatch({ type: TICKET_QR_PAGE });
  };

  return {
    tickets,
    tsDate,
    noMoreTickets,
    ticketsFilter,
    window,
    goBackHistory,
    getTickets,
    qrPage,
    setQRPage,
    changeTicketsFilter
  };
};
