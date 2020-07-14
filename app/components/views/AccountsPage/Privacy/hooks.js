import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useReducer, useCallback } from "react";
import { MIXED_ACCOUNT, CHANGE_ACCOUNT } from "constants";
import * as act from "actions/AccountMixerActions";
import * as sel from "selectors";

export function usePrivacy(validateErrorReducer) {
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
  const [error, dispatchError] = useReducer(validateErrorReducer, {
    mixedStart: null
  });

  return {
    runAccountMixer,
    stopAccountMixer,
    accountMixerRunning,
    mixedAccount,
    changeAccount,
    csppServer,
    csppPort,
    mixedAccountBranch,
    accounts,
    error,
    dispatchError
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
