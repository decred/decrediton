import { useSelector, useDispatch } from "react-redux";
import { useCallback, useMemo } from "react";
import { useSettings } from "hooks";
import { EXTERNALREQUEST_STAKEPOOL_LISTING } from "constants";

import * as vspa from "actions/VSPActions";
import * as ca from "actions/ControlActions.js";
import { listUnspentOutputs } from "actions/TransactionActions";
import * as sel from "selectors";
import { isEqual } from "lodash/fp";

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

  const rememberedVspHost = useSelector(sel.getRememberedVspHost);
  const visibleAccounts = useSelector(sel.visibleAccounts);

  const selectedAccountForTicketPurchase = useSelector(
    sel.selectedAccountForTicketPurchase
  );
  const account = useMemo(() => {
    const accountName =
      selectedAccountForTicketPurchase || defaultSpendingAccount.name;
    return visibleAccounts?.find((a) => isEqual(a.name, accountName));
  }, [
    visibleAccounts,
    selectedAccountForTicketPurchase,
    defaultSpendingAccount
  ]);

  const selectedVSP = useSelector(sel.selectedVSP);

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

  const setRememberedVspHost = useCallback(
    (vsp) => dispatch(vspa.setRememberedVspHost(vsp)),
    [dispatch]
  );

  const onListUnspentOutputs = (accountNum) =>
    dispatch(listUnspentOutputs(accountNum));

  const setAccount = useCallback(
    (account) => {
      dispatch({ type: vspa.SET_ACCOUNT_FOR_TICKET_PURCHASE, account });
    },
    [dispatch]
  );

  const setVSP = useCallback(
    (vsp) => {
      if (!isEqual(selectedVSP, vsp)) {
        dispatch({ type: vspa.SET_SELECTED_VSP, selectedVSP: vsp });
      }
    },
    [dispatch, selectedVSP]
  );

  // purchase cspp ticket
  const mixedAccount = useSelector(sel.getMixedAccount);
  const changeAccount = useSelector(sel.getChangeAccount);

  const getRunningIndicator = useSelector(sel.getRunningIndicator);

  const vsp = useMemo(() => {
    if (selectedVSP) {
      return selectedVSP;
    } else if (rememberedVspHost) {
      // reset rememberedVspHost if it's outdated
      if (
        availableVSPs?.find(
          (availableVSP) => availableVSP.host === rememberedVspHost.host
        )?.outdated === true
      ) {
        setRememberedVspHost(null);
        return null;
      } else {
        return { host: rememberedVspHost.host };
      }
    } else {
      return null;
    }
  }, [rememberedVspHost, availableVSPs, selectedVSP, setRememberedVspHost]);

  const numTicketsToBuy = useSelector(sel.numVSPicketsToBuy) ?? 1;
  const setNumTicketsToBuy = useCallback(
    (numTicketsToBuy) => {
      dispatch({
        type: vspa.SET_NUM_TICKETS_TO_BUY,
        numVSPicketsToBuy: numTicketsToBuy
      });
    },
    [dispatch]
  );

  return {
    spvMode,
    blocksNumberToNextTicket,
    sidebarOnBottom,
    isWatchingOnly,
    spendingAccounts,
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
    account,
    setAccount,
    vsp,
    setVSP,
    numTicketsToBuy,
    setNumTicketsToBuy
  };
};
