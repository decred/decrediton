import { useCallback, useDispatch, useSelector } from "react-redux";
import { useReducer } from "react";
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
