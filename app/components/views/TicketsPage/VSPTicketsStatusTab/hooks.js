import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as ca from "actions/ClientActions";
import * as ta from "actions/TransactionActions";
import * as vspa from "actions/VSPActions";

export const useVSPTicketsList = () => {
  // selectors
  const vspTickets = useSelector(sel.getVSPTickets);

  const tsDate = useSelector(sel.tsDate);
  const noMoreTickets = useSelector(sel.noMoreStakeTxs);
  const ticketsFilter = useSelector(sel.ticketsFilter);
  const window = useSelector(sel.mainWindow);
  const hasVSPTicketsError = useSelector(sel.getHasVSPTicketsError);
  const defaultSpendingAccount = useSelector(sel.defaultSpendingAccount);
  const noMoreLiveTickets = useSelector(sel.getNoMoreLiveTickets);

  // actions
  const dispatch = useDispatch();
  const goBackHistory = () => dispatch(ca.goBackHistory());
  const getLiveTickets = (isStake) => {
    if (noMoreLiveTickets) {
      return;
    }
    dispatch(ta.getTransactions(isStake));
  };
  const changeTicketsFilter = (newFilter) =>
    dispatch(ta.changeTicketsFilter(newFilter));
  const getVSPTicketsByFeeStatus = (feeStatus) => dispatch(vspa.getVSPTicketsByFeeStatus(feeStatus));
  const syncVSPTicketsRequest = ({ passphrase, vspHost, vspPubkey, account }) => dispatch(vspa.syncVSPTicketsRequest({ passphrase, vspHost, vspPubkey, account }));

  return {
    tsDate,
    noMoreTickets,
    ticketsFilter,
    window,
    goBackHistory,
    getLiveTickets,
    changeTicketsFilter,
    getVSPTicketsByFeeStatus,
    vspTickets,
    hasVSPTicketsError,
    defaultSpendingAccount,
    syncVSPTicketsRequest,
    noMoreLiveTickets
  };
};
