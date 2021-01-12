import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { useSettings } from "hooks";
import { EXTERNALREQUEST_STAKEPOOL_LISTING } from "main_dev/externalRequests";

import * as vspa from "actions/VSPActions";
import * as ca from "actions/ControlActions.js";
import { listUnspentOutputs } from "actions/TransactionActions";
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
  const availableVSPsError = useSelector(sel.getDiscoverAvailableVSPError);
  const ticketAutoBuyerRunning = useSelector(sel.getTicketAutoBuyerRunning);
  const isLegacy = useSelector(sel.getIsLegacy);
  const isLoading = useSelector(sel.purchaseTicketsRequestAttempt);
  const notMixedAccounts = useSelector(sel.getNotMixedAccounts);

  const buyerVSP = useSelector(sel.buyerVSP);
  const buyerBalanceToMantain = useSelector(sel.buyerBalanceToMantain);
  const buyerAccount = useSelector(sel.buyerAccount);
  const rememberedVspHost = useSelector(sel.getRememberedVspHost);

  // VSP listing checks
  const { onAddAllowedRequestType, isVSPListingEnabled } = useSettings();

  const onEnableVSPListing = () => {
    onAddAllowedRequestType(EXTERNALREQUEST_STAKEPOOL_LISTING);
    discoverAvailableVSPs();
  };

  const dispatch = useDispatch();
  const discoverAvailableVSPs = useCallback(
    () => dispatch(vspa.discoverAvailableVSPs()),
    [dispatch]
  );
  const onPurchaseTicketV3 = useCallback(
    (passphrase, account, numTickets, vsp) =>
      dispatch(
        ca.newPurchaseTicketsAttempt(passphrase, account, numTickets, vsp)
      ),
    [dispatch]
  );
  const onEnableTicketAutoBuyer = useCallback(
    (passphrase, account, balanceToMaintain, vsp) =>
      dispatch(
        ca.startTicketBuyerV3Attempt(
          passphrase,
          account,
          balanceToMaintain,
          vsp
        )
      ),
    [dispatch]
  );
  const onDisableTicketAutoBuyer = useCallback(
    () => dispatch(ca.ticketBuyerCancel()),
    [dispatch]
  );
  const getTicketStatus = useCallback(
    (host, tickethash, passphrase) =>
      dispatch(vspa.getVSPTicketStatus(host, tickethash, passphrase)),
    [dispatch]
  );

  const getVSPTicketsByFeeStatus = (feeStatus) => {
    dispatch(vspa.getVSPTicketsByFeeStatus(feeStatus));
  };

  const toggleIsLegacy = (isLegacy) => {
    dispatch(vspa.toggleIsLegacy(isLegacy));
  };

  const onRevokeTickets = (passphrase) =>
    dispatch(ca.revokeTicketsAttempt(passphrase));

  const setRememberedVspHost = (vsp) =>
    dispatch(vspa.setRememberedVspHost(vsp));

  const onListUnspentOutputs = (accountNum) => dispatch(listUnspentOutputs(accountNum));

  // purchase cspp ticket
  const mixedAccount = useSelector(sel.getMixedAccount);
  const changeAccount = useSelector(sel.getChangeAccount);

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
    onPurchaseTicketV3,
    availableVSPs: isVSPListingEnabled ? availableVSPs : [],
    availableVSPsError,
    onDisableTicketAutoBuyer,
    getTicketStatus,
    ticketAutoBuyerRunning,
    buyerVSP,
    buyerAccount,
    buyerBalanceToMantain,
    getVSPTicketsByFeeStatus,
    isLegacy,
    toggleIsLegacy,
    mixedAccount,
    changeAccount,
    isLoading,
    rememberedVspHost,
    setRememberedVspHost,
    onRevokeTickets,
    notMixedAccounts,
    isVSPListingEnabled,
    onEnableVSPListing,
    onListUnspentOutputs
  };
};
