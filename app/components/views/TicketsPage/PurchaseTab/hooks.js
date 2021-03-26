import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { useSettings } from "hooks";
import { EXTERNALREQUEST_STAKEPOOL_LISTING } from "constants";

import { purchaseTicketsV3 as trezorPurchseTicketsV3 } from "actions/TrezorActions.js";
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
  const autoBuyerRunning = useSelector(sel.isTicketAutoBuyerEnabled);
  const ticketAutoBuyerRunning = useSelector(sel.getTicketAutoBuyerRunning);
  const isLegacy = useSelector(sel.getIsLegacy);
  const isLoading = useSelector(sel.purchaseTicketsRequestAttempt);
  const notMixedAccounts = useSelector(sel.getNotMixedAccounts);
  const isTrezor = useSelector(sel.isTrezor);
  const isPurchasingTicketsTrezor = useSelector(sel.isPurchasingTicketsTrezor);

  const rememberedVspHost = useSelector(sel.getRememberedVspHost);
  const visibleAccounts = useSelector(sel.visibleAccounts);

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
    (passphrase, account, numTickets, vsp) => {
      if (isTrezor) {
        dispatch(trezorPurchseTicketsV3(account, numTickets, vsp));
      } else {
        dispatch(
          ca.newPurchaseTicketsAttempt(passphrase, account, numTickets, vsp)
        );
      }
    },
    [dispatch, isTrezor]
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

  const getVSPTicketsByFeeStatus = (feeStatus) => {
    dispatch(vspa.getVSPTicketsByFeeStatus(feeStatus));
  };

  const toggleIsLegacy = (isLegacy) => {
    if (autoBuyerRunning) {
      // stop runnig legacy autobuyer
      dispatch(ca.ticketBuyerV2Cancel());
    }
    if (ticketAutoBuyerRunning) {
      // stop running new autobuyer
      dispatch(ca.ticketBuyerCancel());
    }
    dispatch(vspa.toggleIsLegacy(isLegacy));
  };

  const setRememberedVspHost = (vsp) =>
    dispatch(vspa.setRememberedVspHost(vsp));

  const onListUnspentOutputs = (accountNum) =>
    dispatch(listUnspentOutputs(accountNum));

  // purchase cspp ticket
  const mixedAccount = useSelector(sel.getMixedAccount);
  const changeAccount = useSelector(sel.getChangeAccount);

  const getRunningIndicator = useSelector(sel.getRunningIndicator);

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
    ticketAutoBuyerRunning,
    getVSPTicketsByFeeStatus,
    isLegacy,
    toggleIsLegacy,
    mixedAccount,
    changeAccount,
    isLoading,
    rememberedVspHost,
    setRememberedVspHost,
    notMixedAccounts,
    isVSPListingEnabled,
    onEnableVSPListing,
    onListUnspentOutputs,
    getRunningIndicator,
    visibleAccounts,
    isPurchasingTicketsTrezor
  };
};
