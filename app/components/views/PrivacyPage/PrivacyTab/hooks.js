import { useEffect, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as act from "actions/AccountMixerActions";
import * as ca from "actions/ClientActions";
import * as cta from "actions/ControlActions";
import { getPrivacyLogs } from "actions/DaemonActions";
import * as sel from "selectors";
import { useMountEffect } from "hooks";

export function usePrivacy() {
  const dispatch = useDispatch();
  const runAccountMixer = (request) => dispatch(act.runAccountMixer(request));
  const checkUnmixedAccountBalance = useCallback(
    (changeAccount) => dispatch(act.checkUnmixedAccountBalance(changeAccount)),
    [dispatch]
  );
  const stopAccountMixer = () => dispatch(act.stopAccountMixer());
  const onDisableTicketAutoBuyer = useCallback(
    () => dispatch(cta.ticketBuyerCancel()),
    [dispatch]
  );
  const onGetPrivacyLogs = () => dispatch(getPrivacyLogs());
  const accountMixerRunning = useSelector(sel.getAccountMixerRunning);
  const isAutoBuyerRunning = useSelector(sel.getTicketAutoBuyerRunning);
  const mixedAccount = useSelector(sel.getMixedAccount);
  const changeAccount = useSelector(sel.getChangeAccount);
  const mixedAccountBranch = useSelector(sel.getMixedAccountBranch);
  const balances = useSelector(sel.balances);
  const accounts = balances
    .slice()
    .sort((a, b) => a.accountNumber - b.accountNumber);
  const accountMixerError = useSelector(sel.getAccountMixerError);
  const isMixerDisabled = useSelector(sel.getIsMixerDisabled);
  const createMixerAccountAttempt = useSelector(sel.createMixerAccountAttempt);
  const allowSendFromUnmixed = useSelector(sel.getAllowSendFromUnmixed);
  const mixedAccountSpendableBalance = useSelector(
    sel.getMixedAccountSpendableBalance
  );
  const changeAccountSpendableBalance = useSelector(
    sel.getChangeAccountSpendableBalance
  );
  const getMixerAcctsSpendableBalances = useCallback(
    () => dispatch(ca.getMixerAcctsSpendableBalances()),
    [dispatch]
  );
  const defaultSpendingAccountDisregardMixedAccount = useSelector(
    sel.defaultSpendingAccountDisregardMixedAccount,
    shallowEqual
  );
  const isCreateAccountDisabled = useSelector(sel.isWatchingOnly);
  useMountEffect(() => {
    getMixerAcctsSpendableBalances();
  });

  const createNeededAccounts = (
    passphrase,
    mixedAccountName,
    changeAccountName
  ) =>
    dispatch(
      act.createNeededAccounts(passphrase, mixedAccountName, changeAccountName)
    );

  const toggleAllowSendFromUnmixed = (allow) =>
    dispatch(act.toggleAllowSendFromUnmixed(allow));

  useEffect(() => {
    changeAccount && checkUnmixedAccountBalance(changeAccount);
  }, [changeAccount, checkUnmixedAccountBalance]);

  const onStartMixerAttempt = (passphrase) => {
    const request = {
      passphrase,
      mixedAccount,
      changeAccount,
      mixedAccountBranch
    };
    runAccountMixer(request)
      .then((r) => r)
      .catch((err) => err);
  };

  const getRunningIndicator = useSelector(sel.getRunningIndicator);

  return {
    stopAccountMixer,
    accountMixerRunning,
    mixedAccount,
    changeAccount,
    accounts,
    isMixerDisabled,
    accountMixerError,
    onStartMixerAttempt,
    createNeededAccounts,
    createMixerAccountAttempt,
    onGetPrivacyLogs,
    allowSendFromUnmixed,
    toggleAllowSendFromUnmixed,
    mixedAccountSpendableBalance,
    changeAccountSpendableBalance,
    defaultSpendingAccountDisregardMixedAccount,
    isCreateAccountDisabled,
    getRunningIndicator,
    onDisableTicketAutoBuyer,
    isAutoBuyerRunning
  };
}
