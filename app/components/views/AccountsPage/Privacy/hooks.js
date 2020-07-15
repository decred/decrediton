import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useCallback } from "react";
import { MIXED_ACCOUNT, CHANGE_ACCOUNT } from "constants";
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

  const onStartMixerAttempt = useCallback(async (passphrase) => {
    const request = {
      passphrase,
      mixedAccount,
      changeAccount,
      mixedAccountBranch,
      csppServer: `${csppServer}:${csppPort}`
    };
    await runAccountMixer(request);
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

export function useConfigMixer(accounts) {
  const [areAccountsAvailable, setAreAvailable] = useState(null);
  const [mixedAccountName, setMixedAccountName] = useState("");
  const [changeAccountName, setChangeAccountName] = useState("");

  const dispatch = useDispatch();
  const onSubmit = useCallback((passphrase) =>
    dispatch(act.createNeededAccounts(passphrase, mixedAccountName, changeAccountName)),
    [dispatch, mixedAccountName, changeAccountName]
  );
  const isValid = useCallback(() => !(!mixedAccountName || !changeAccountName), [mixedAccountName, changeAccountName]);
  const checkAvailableAccounts = useCallback(() => {
    const mixedExists = accounts.find(
      ({ accountName }) => accountName === MIXED_ACCOUNT
    );
    const changeExists = accounts.find(
      ({ accountName }) => accountName === CHANGE_ACCOUNT
    );

    return !mixedExists && !changeExists;
  }, [accounts]);

  useEffect(() => {
    if (checkAvailableAccounts()) {
      setAreAvailable(true);
      setMixedAccountName(MIXED_ACCOUNT);
      setChangeAccountName(CHANGE_ACCOUNT);
    }
  }, [checkAvailableAccounts]);

  return {
    areAccountsAvailable,
    mixedAccountName,
    setMixedAccountName,
    changeAccountName,
    setChangeAccountName,
    onSubmit,
    isValid
  };
}
