import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as ca from "actions/ClientActions";
import * as ta from "actions/TransactionActions";
import * as vspa from "actions/VSPActions";
import { useSettings } from "hooks";
import { useVSP } from "hooks";

export const useVSPTicketsList = () => {
  // selectors
  const { vspTickets } = useVSP();

  const tsDate = useSelector(sel.tsDate);
  const noMoreTickets = useSelector(sel.noMoreStakeTxs);
  const ticketsFilter = useSelector(sel.ticketsFilter);
  const window = useSelector(sel.mainWindow);
  const hasVSPTicketsError = useSelector(sel.getHasVSPTicketsError);
  const defaultSpendingAccount = useSelector(sel.defaultSpendingAccount);
  const noMoreLiveTickets = useSelector(sel.getNoMoreLiveTickets);
  const isSyncingTickets = useSelector(sel.isSyncingTickets);
  const rememberedVspHost = useSelector(sel.getRememberedVspHost);
  const availableVSPs = useSelector(sel.getAvailableVSPs);
  const { isVSPListingEnabled } = useSettings();

  // actions
  const dispatch = useDispatch();
  const goBackHistory = () => dispatch(ca.goBackHistory());
  const getLiveTickets = () => {
    if (noMoreLiveTickets) {
      return;
    }
    dispatch(ta.getTransactions(true));
  };
  const changeTicketsFilter = (newFilter) =>
    dispatch(ta.changeTicketsFilter(newFilter));
  const getVSPTicketsByFeeStatus = (feeStatus) =>
    dispatch(vspa.getVSPTicketsByFeeStatus(feeStatus));
  const syncVSPTicketsRequest = ({ passphrase, vspHost, vspPubkey, account }) =>
    dispatch(
      vspa.syncVSPTicketsRequest({ passphrase, vspHost, vspPubkey, account })
    );

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
    noMoreLiveTickets,
    isSyncingTickets,
    rememberedVspHost,
    availableVSPs: isVSPListingEnabled ? availableVSPs : []
  };
};
