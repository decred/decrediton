import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import * as act from "actions/AccountMixerActions";
import * as sel from "selectors";

export function usePrivacy() {
  const dispatch = useDispatch();
  const runAccountMixer = useCallback((request) => dispatch(act.runAccountMixer(request)), [dispatch]);
  const stopAccountMixer = useCallback(() => dispatch(act.stopAccountMixer()), [dispatch]);
  const accountMixerRunning = useSelector(sel.getAccountMixerRunning);
  const mixedAccount = useSelector(sel.getMixedAccount);
  const changeAccount = useSelector(sel.getChangeAccount);
  const csppServer = useSelector(sel.getCsppServer);
  const csppPort = useSelector(sel.getCsppPort);
  const mixedAccountBranch = useSelector(sel.getMixedAccountBranch);
  const accounts = useSelector(sel.sortedAccounts);
  const accountMixerError = useSelector(sel.getAccountMixerError);

  const getAccountName = useCallback((n) => {
    const account = accounts.find(({ accountNumber }) => accountNumber === n);
    return account ? account.accountName : null;
  }, [accounts]);

  const mixedAccountName = getAccountName(mixedAccount);
  const changeAccountName = getAccountName(changeAccount);

  const onStartMixerAttempt = useCallback((passphrase) => {
    const request = {
      passphrase,
      mixedAccount,
      changeAccount,
      mixedAccountBranch,
      csppServer: `${csppServer}:${csppPort}`
    };
    runAccountMixer(request).then(r => r).catch(err => err);
  }, [
    mixedAccount,
    changeAccount,
    mixedAccountBranch,
    csppServer,
    csppPort,
    runAccountMixer
  ]);

  return {
    stopAccountMixer,
    accountMixerRunning,
    mixedAccount,
    changeAccount,
    csppServer,
    csppPort,
    mixedAccountBranch,
    accounts,
    accountMixerError,
    mixedAccountName,
    changeAccountName,
    onStartMixerAttempt
  };
};
