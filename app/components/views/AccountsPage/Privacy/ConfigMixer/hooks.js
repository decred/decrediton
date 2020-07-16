import { useDispatch } from "react-redux";
import { useState, useEffect, useCallback } from "react";
import { MIXED_ACCOUNT, CHANGE_ACCOUNT } from "constants";
import * as act from "actions/AccountMixerActions";

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
