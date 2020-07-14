import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";

import * as vspa from "actions/VSPActions";
import * as ca from "actions/ControlActions.js";
import * as sel from "selectors";

export const usePurchaseTab = () => {
  const spvMode = useSelector(sel.isSPV);
  const blocksNumberToNextTicket = useSelector(sel.blocksNumberToNextTicket);
  const sidebarOnBottom = useSelector(sel.sidebarOnBottom);
  const isWatchingOnly = useSelector(sel.isWatchingOnly);
  const spendingAccounts = useSelector(sel.spendingAccounts);
  const defaultSpendingAccount = useSelector(sel.defaultSpendingAccount);
  const ticketPrice = useSelector(sel.ticketPrice);
  const availableVSPs = useSelector(sel.getAvailableVSPs);
  const ticketAutoBuyerRunning = useSelector(sel.getTicketAutoBuyerRunning);
  const dispatch = useDispatch();
  const discoverAvailableVSPs = useCallback(() => dispatch(vspa.discoverAvailableVSPs()), [
    dispatch
  ]);
  const onEnableTicketAutoBuyer = useCallback((passphrase, account, balanceToMaintain, vsp) =>
    dispatch(ca.startTicketBuyerV3Attempt(
      passphrase,
      account,
      balanceToMaintain,
      vsp)
    ));
  const onDisableTicketAutoBuyer = useCallback(() => ca.ticketBuyerCancel());
  const getTicketStatus = useCallback((host, tickethash, passphrase) =>
    dispatch(vspa.getVSPTicketStatus(host, tickethash, passphrase)),
    [dispatch]
  );

  return {
    spvMode,
    blocksNumberToNextTicket,
    sidebarOnBottom,
    isWatchingOnly,
    spendingAccounts,
    defaultSpendingAccount,
    discoverAvailableVSPs,
    ticketPrice,
    onEnableTicketAutoBuyer,
    availableVSPs,
    onDisableTicketAutoBuyer,
    getTicketStatus,
    ticketAutoBuyerRunning
  };
};
