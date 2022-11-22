import { useSelector, useDispatch } from "react-redux";
import { useState, useCallback } from "react";
import * as vspa from "actions/VSPActions";
import * as ca from "actions/ControlActions";
import * as sel from "selectors";

export const useTicketAutoBuyer = () => {
  const isRunning = useSelector(sel.getTicketAutoBuyerRunning);
  const isGetVSPAttempt = useSelector(sel.isGetVSPAttempt);

  const buyerBalanceToMaintain = useSelector(sel.buyerBalanceToMaintain);
  const buyerAccount = useSelector(sel.buyerAccount);
  const buyerMaxFeePercentage = useSelector(sel.buyerMaxFeePercentage);

  const [balanceToMaintain, setBalanceToMaintain] = useState(
    buyerBalanceToMaintain
  );
  const [account, setAccount] = useState(buyerAccount);
  const [vsp, setVsp] = useState(null);
  const [maxFeePercentage, setMaxFeePercentage] = useState(
    buyerMaxFeePercentage
  );

  const notMixedAccounts = useSelector(sel.getNotMixedAccounts);
  // isValid check if we can show the modal to start the auto buyer.
  const [isValid, setIsValid] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

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

  const [isValidationInProgress, setIsValidationInProgress] = useState(false);
  const onValidate = async () => {
    setIsValidationInProgress(true);
    const randomVSP = await getRandomVSP(maxFeePercentage);
    const isSettingsValid = checkIsValid(randomVSP, balanceToMaintain, account);
    setIsValid(isSettingsValid);
    if (!isSettingsValid) {
      setIsSettingsModalVisible(true);
    } else {
      setVsp(randomVSP);
    }
    setIsValidationInProgress(false);
    return isSettingsValid;
  };

  const getRunningIndicator = useSelector(sel.getRunningIndicator);

  const resetSettingsState = () => {
    setBalanceToMaintain(buyerBalanceToMaintain);
    setAccount(buyerAccount);
    setMaxFeePercentage(buyerMaxFeePercentage);
    setClicked(false);
    setErrorMsg(null);
  };
  const vspHost = vsp && vsp.host;

  const dispatch = useDispatch();
  const onEnableTicketAutoBuyer = useCallback(
    (passphrase, account, balanceToMaintain, vsp) =>
      dispatch(
        ca.startTicketBuyerAttempt(passphrase, account, balanceToMaintain, vsp)
      ),
    [dispatch]
  );

  const onStopAutoBuyer = useCallback(
    () => dispatch(ca.ticketBuyerCancel()),
    [dispatch]
  );

  const getRandomVSP = async (maxFeePercentage) => {
    let randomVSP;
    if (maxFeePercentage) {
      try {
        setIsValid(true);
        randomVSP = await dispatch(vspa.getRandomVSP(maxFeePercentage));
      } catch (error) {
        setErrorMsg(error.message);
      }
    }
    return randomVSP;
  };

  const onSaveAutoBuyerSettings = async ({
    balanceToMaintain,
    account,
    maxFeePercentage
  }) => {
    setErrorMsg(null);
    const randomVSP = await getRandomVSP(maxFeePercentage);
    const isSettingsValid = checkIsValid(randomVSP, balanceToMaintain, account);
    setIsValid(isSettingsValid);
    if (!isSettingsValid) {
      setClicked(true);
    } else {
      dispatch(
        vspa.saveAutoBuyerSettings(balanceToMaintain, account, maxFeePercentage)
      );
      setIsSettingsModalVisible(false);
    }
  };

  return {
    balanceToMaintain,
    setBalanceToMaintain,
    account,
    setAccount,
    isRunning,
    isGetVSPAttempt,
    isValidationInProgress,
    notMixedAccounts,
    getRunningIndicator,
    clicked,
    isValid,
    errorMsg,
    isSettingsModalVisible,
    showSettingsModal,
    hideSettingsModal,
    onValidate,
    onStartAutoBuyer,
    onStopAutoBuyer,
    onSaveAutoBuyerSettings,
    vspHost,
    maxFeePercentage,
    setMaxFeePercentage
  };
};
