import { useDispatch, useSelector } from "react-redux";
import * as act from "actions/AccountMixerActions";
import { getPrivacyLogs } from "actions/DaemonActions";
import * as sel from "selectors";

export function usePrivacy() {
  const dispatch = useDispatch();
  const runAccountMixer = (request) => dispatch(act.runAccountMixer(request));
  const stopAccountMixer = () => dispatch(act.stopAccountMixer());
  const onGetPrivacyLogs = () => dispatch(getPrivacyLogs());
  const accountMixerRunning = useSelector(sel.getAccountMixerRunning);
  const mixedAccount = useSelector(sel.getMixedAccount);
  const changeAccount = useSelector(sel.getChangeAccount);
  const csppServer = useSelector(sel.getCsppServer);
  const csppPort = useSelector(sel.getCsppPort);
  const accounts = useSelector(sel.sortedAccounts);
  const accountMixerError = useSelector(sel.getAccountMixerError);
  const createMixerAccountAttempt = useSelector(sel.createMixerAccountAttempt);
  const createNeededAccounts = (
    passphrase,
    mixedAccountName,
    changeAccountName
  ) =>
    dispatch(
      act.createNeededAccounts(passphrase, mixedAccountName, changeAccountName)
    );

  const onStartMixerAttempt = (passphrase) => {
    const request = {
      passphrase,
      mixedAccount,
      changeAccount,
      mixedAccountBranch: 0,
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
    onGetPrivacyLogs
  };
}
