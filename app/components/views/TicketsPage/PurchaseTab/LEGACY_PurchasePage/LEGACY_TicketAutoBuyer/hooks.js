import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import { useIntl } from "react-intl";

export const useTicketAutoBuyer = () => {
  const configuredStakePools = useSelector(sel.configuredStakePools);
  const defaultSpendingAccount = useSelector(sel.defaultSpendingAccount);
  const selectedStakePool = useSelector(sel.selectedStakePool);
  const ticketBuyerSettings = useSelector(sel.ticketBuyerConfig);
  const intl = useIntl();
  const notMixedAccounts = useSelector(sel.getNotMixedAccounts);
  const getRunningIndicator = useSelector(sel.getRunningIndicator);

  const [clicked, setClicked] = useState(false); // we use this bool flag so the error does not show before trying.
  const [balanceToMaintainError] = useState(false);
  const [stakePool, setStakePool] = useState(
    ticketBuyerSettings ? ticketBuyerSettings.stakepool : selectedStakePool
  );
  const [account, setAccount] = useState(
    ticketBuyerSettings ? ticketBuyerSettings.account : defaultSpendingAccount
  );
  const [balanceToMaintain, setBalanceToMaintain] = useState(
    ticketBuyerSettings ? ticketBuyerSettings.balanceToMaintain : 0
  );

  // legacy ticket auto buyer selectors
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
  const onDisableTicketAutoBuyer = useCallback(
    () => dispatch(ca.ticketBuyerV2Cancel()),
    [dispatch]
  );
  const isTicketAutoBuyerEnabled = useSelector(sel.isTicketAutoBuyerEnabled);

  return {
    configuredStakePools,
    intl,
    notMixedAccounts,
    getRunningIndicator,
    clicked,
    setClicked,
    balanceToMaintainError,
    stakePool,
    setStakePool,
    account,
    setAccount,
    balanceToMaintain,
    setBalanceToMaintain,
    isTicketAutoBuyerEnabled,
    onEnableTicketAutoBuyer,
    onDisableTicketAutoBuyer
  };
};
