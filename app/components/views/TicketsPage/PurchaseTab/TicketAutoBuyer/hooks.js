import { useSelector, useDispatch } from "react-redux";
import { useState, useCallback, useEffect } from "react";
import * as vspa from "actions/VSPActions";
import * as ca from "actions/ControlActions";
import * as sel from "selectors";

export const useTicketAutoBuyer = () => {
  const availableVSPs = useSelector(sel.getAvailableVSPs);
  const isRunning = useSelector(sel.getTicketAutoBuyerRunning);

  const buyerBalanceToMaintain = useSelector(sel.buyerBalanceToMaintain);
  const buyerAccount = useSelector(sel.buyerAccount);
  const buyerVSP = useSelector(sel.buyerVSP);

  const [balanceToMaintain, setBalanceToMaintain] = useState(
    buyerBalanceToMaintain
  );
  const [account, setAccount] = useState(buyerAccount);
  const [vsp, setVsp] = useState(buyerVSP);

  const notMixedAccounts = useSelector(sel.getNotMixedAccounts);
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

  useEffect(
    // we pass those values as parameter, so we don't need to add checkIsValid
    // into the dependecy array.
    () => {
      setIsValid(checkIsValid(vsp, balanceToMaintain, account));
    },
    [vsp, balanceToMaintain, account]
  );
  const getRunningIndicator = useSelector(sel.getRunningIndicator);

  const resetSettingsState = () => {
    setBalanceToMaintain(buyerBalanceToMaintain);
    setAccount(buyerAccount);
    setVsp(buyerVSP);
    setClicked(false);
  };
  const vspHost = vsp && vsp.host;

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

  const onStopAutoBuyer = useCallback(() => dispatch(ca.ticketBuyerCancel()), [
    dispatch
  ]);

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
    balanceToMaintain,
    setBalanceToMaintain,
    account,
    setAccount,
    vsp,
    setVsp,
    availableVSPs,
    isRunning,
    notMixedAccounts,
    getRunningIndicator,
    clicked,
    isValid,
    isSettingsModalVisible,
    showSettingsModal,
    hideSettingsModal,
    onClick,
    onStartAutoBuyer,
    onStopAutoBuyer,
    onSaveAutoBuyerSettings,
    vspHost
  };
};
