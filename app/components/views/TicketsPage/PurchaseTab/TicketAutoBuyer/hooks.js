import { useSelector, useDispatch } from "react-redux";
import { useState, useCallback, useEffect } from "react";
import { useIntl } from "react-intl";

import * as vspa from "actions/VSPActions";
import * as ca from "actions/ControlActions.js";
import * as sel from "selectors";

export const useTicketAutoBuyer = () => {
  const intl = useIntl();
  const availableVSPs = useSelector(sel.getAvailableVSPs);
  const ticketAutoBuyerRunning = useSelector(sel.getTicketAutoBuyerRunning);
  const notMixedAccounts = useSelector(sel.getNotMixedAccounts);

  const buyerVSP = useSelector(sel.buyerVSP);
  const buyerBalanceToMaintain = useSelector(sel.buyerBalanceToMaintain);
  const buyerAccount = useSelector(sel.buyerAccount);

  const [balanceToMaintain, setBalanceToMaintain] = useState(
    buyerBalanceToMaintain
  );
  const [account, setAccount] = useState(buyerAccount);
  const [vsp, setVsp] = useState(buyerVSP);
  // isValid check if we can show the modal to start the auto buyer.
  const [isValid, setIsValid] = useState(null);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);

  const showSettingsModal = () => setIsSettingsModalVisible(true);
  const hideSettingsModal = () => {
    resetSettingsState();
    setIsSettingsModalVisible(false);
  };
  // we use this bool flag so the error does not show before trying.
  const [clicked, setClicked] = useState(false);
  const onStartAutoBuyer = (passphrase) => {
    onEnableTicketAutoBuyer(
      passphrase,
      account,
      balanceToMaintain?.atomValue,
      vsp
    );
  };

  const checkIsValid = (vsp, balanceToMaintain, account) => {
    let isValid = true;
    if (vsp) {
      if (!vsp.pubkey || !vsp.host) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    // balance to mantain can be 0.
    return isValid && balanceToMaintain?.atomValue >= 0 && !!account;
  };

  const onClick = () => {
    setIsValid(checkIsValid(vsp, balanceToMaintain, account));
    if (!isValid) {
      setIsSettingsModalVisible(true);
    }
  };

  const onStopAutoBuyer = () => onDisableTicketAutoBuyer();

  useEffect(
    // we pass those values as parameter, so we don't need to add checkIsValid
    // into the dependecy array.
    () => {
      setIsValid(checkIsValid(vsp, balanceToMaintain, account));
    },
    [vsp, balanceToMaintain, account]
  );

  const resetSettingsState = () => {
    setBalanceToMaintain(buyerBalanceToMaintain);
    setAccount(buyerAccount);
    setVsp(buyerVSP);
    setClicked(false);
  };

  const dispatch = useDispatch();
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

  const getRunningIndicator = useSelector(sel.getRunningIndicator);
  const onSaveAutoBuyerSettings = (balanceToMaintain, account, vsp) => {
    setIsValid(checkIsValid(vsp, balanceToMaintain, account));
    if (!isValid) {
      setClicked(true);
    } else {
      dispatch(
        vspa.saveAutoBuyerSettings({
          balanceToMaintain,
          account,
          vsp
        })
      );
      setIsSettingsModalVisible(false);
    }
  };
  return {
    intl,
    balanceToMaintain,
    setBalanceToMaintain,
    account,
    setAccount,
    vsp,
    setVsp,
    availableVSPs,
    onEnableTicketAutoBuyer,
    onDisableTicketAutoBuyer,
    ticketAutoBuyerRunning,
    buyerAccount,
    buyerBalanceToMaintain,
    buyerVSP,
    notMixedAccounts,
    getRunningIndicator,
    isValid,
    clicked,
    isSettingsModalVisible,
    showSettingsModal,
    hideSettingsModal,
    onClick,
    onStartAutoBuyer,
    onStopAutoBuyer,
    onSaveAutoBuyerSettings
  };
};
