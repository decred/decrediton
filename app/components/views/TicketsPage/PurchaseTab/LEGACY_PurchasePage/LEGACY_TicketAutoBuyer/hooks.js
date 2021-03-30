import { useSelector, useDispatch } from "react-redux";
import { useState, useCallback, useEffect } from "react";
import { compose, eq, get } from "fp";
import * as ca from "actions/ControlActions";
import * as sel from "selectors";

export const useTicketAutoBuyer = () => {
  const configuredVsps = useSelector(sel.configuredStakePools);
  const isRunning = useSelector(sel.isTicketAutoBuyerEnabled);

  const legacyBuyerBalanceToMaintain = useSelector(
    sel.legacyBuyerBalanceToMaintain
  );
  const legacyBuyerAccount = useSelector(sel.legacyBuyerAccount);
  const legacyBuyerVSP = useSelector(sel.legacyBuyerVSP);

  const [balanceToMaintain, setBalanceToMaintain] = useState(
    legacyBuyerBalanceToMaintain
  );
  const [account, setAccount] = useState(legacyBuyerAccount);
  const [vsp, setVsp] = useState(legacyBuyerVSP);

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
      if (!vsp.Host) {
        isValid = false;
      }
    } else {
      isValid = false;
    }
    // balance to mantain can be 0.
    return isValid && balanceToMaintain?.atomValue >= 0 && !!account;
  };
  const getVsp = () => {
    return vsp ? configuredVsps.find(compose(eq(vsp.Host), get("Host"))) : null;
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
    setBalanceToMaintain(legacyBuyerBalanceToMaintain);
    setAccount(legacyBuyerAccount);
    setVsp(legacyBuyerVSP);
    setClicked(false);
  };
  const vspHost = vsp && vsp.Host;

  const dispatch = useDispatch();
  const onEnableTicketAutoBuyer = useCallback(
    (passphrase, account, balanceToMaintain, vsp) =>
      dispatch(
        ca.startTicketBuyerV2Attempt(
          passphrase,
          account,
          balanceToMaintain,
          vsp
        )
      ),
    [dispatch]
  );

  const onStopAutoBuyer = useCallback(
    () => dispatch(ca.ticketBuyerV2Cancel()),
    [dispatch]
  );

  const onSaveAutoBuyerSettings = (balanceToMaintain, account, vsp) => {
    setIsValid(checkIsValid(vsp, balanceToMaintain, account));
    if (!isValid) {
      setClicked(true);
    } else {
      dispatch(
        ca.saveLegacyAutoBuyerSettings({
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
    vsp: getVsp(),
    setVsp,
    configuredVsps,
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
