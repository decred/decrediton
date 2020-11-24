import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import * as act from "actions/AccountMixerActions";
import * as ca from "actions/ClientActions";
import { getPrivacyLogs } from "actions/DaemonActions";
import * as sel from "selectors";

export function usePrivacy() {
  const dispatch = useDispatch();
  const runAccountMixer = (request) => dispatch(act.runAccountMixer(request));
  const stopAccountMixer = () => dispatch(act.stopAccountMixer());
  const showInsufficientBalanceWarning = () =>
    dispatch({ error: "", type: act.RUNACCOUNTMIXER_INSUFFICIENT_BALANCE });
  const onGetPrivacyLogs = () => dispatch(getPrivacyLogs());
  const accountMixerRunning = useSelector(sel.getAccountMixerRunning);
  const mixedAccount = useSelector(sel.getMixedAccount);
  const changeAccount = useSelector(sel.getChangeAccount);
  const csppServer = useSelector(sel.getCsppServer);
  const csppPort = useSelector(sel.getCsppPort);
  const mixedAccountBranch = useSelector(sel.getMixedAccountBranch);
  const balances = useSelector(sel.balances);
  const accounts = balances
    .slice()
    .sort((a, b) => a.accountNumber - b.accountNumber);
  const accountMixerError = useSelector(sel.getAccountMixerError);
  const createMixerAccountAttempt = useSelector(sel.createMixerAccountAttempt);
  const allowSendFromUnmixed = useSelector(sel.getAllowSendFromUnmixed);

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

  const defaultSpendingAccountDisregardMixedAccount = useSelector(
    sel.defaultSpendingAccountDisregardMixedAccount
  );

  const getMixerAcctsSpendableBalances = useCallback(
    () => dispatch(ca.getMixerAcctsSpendableBalances()),
    [dispatch]
  );
  const mixedAccountSpendableBalance = useSelector(
    sel.getMixedAccountSpendableBalance
  );
  const changeAccountSpendableBalance = useSelector(
    sel.getChangeAccountSpendableBalance
  );
  const hasChangeAccountEnoughFunds = useSelector(
    sel.hasChangeAccountEnoughFunds
  );

  const onStartMixerAttempt = (passphrase) => {
    const request = {
      passphrase,
      mixedAccount,
      changeAccount,
      mixedAccountBranch,
      csppServer: `${csppServer}:${csppPort}`
    };
    runAccountMixer(request)
      .then((r) => r)
      .catch((err) => err);
  };

  return {
    stopAccountMixer,
    accountMixerRunning,
    mixedAccount,
    changeAccount,
    accounts,
    accountMixerError,
    onStartMixerAttempt,
    createNeededAccounts,
    createMixerAccountAttempt,
    onGetPrivacyLogs,
    allowSendFromUnmixed,
    toggleAllowSendFromUnmixed,
    showInsufficientBalanceWarning,
    defaultSpendingAccountDisregardMixedAccount,
    getMixerAcctsSpendableBalances,
    mixedAccountSpendableBalance,
    changeAccountSpendableBalance,
    hasChangeAccountEnoughFunds
  };
}
