import { useDispatch, useSelector } from "react-redux";
import * as act from "actions/AccountMixerActions";
import * as sel from "selectors";

export function usePrivacy() {
  const dispatch = useDispatch();
  const runAccountMixer = (request) => dispatch(act.runAccountMixer(request));
  const stopAccountMixer = () => dispatch(act.stopAccountMixer());
  const accountMixerRunning = useSelector(sel.getAccountMixerRunning);
  const mixedAccount = useSelector(sel.getMixedAccount);
  const changeAccount = useSelector(sel.getChangeAccount);
  const csppServer = useSelector(sel.getCsppServer);
  const csppPort = useSelector(sel.getCsppPort);
  const mixedAccountBranch = useSelector(sel.getMixedAccountBranch);
  const accounts = useSelector(sel.sortedAccounts);
  const accountMixerError = useSelector(sel.getAccountMixerError);
  const createNeededAccounts = (
    passphrase,
    mixedAccountName,
    changeAccountName
  ) =>
    dispatch(
      act.createNeededAccounts(passphrase, mixedAccountName, changeAccountName)
    );

  const getAccountName = (n) => {
    const account = accounts.find(({ accountNumber }) => accountNumber === n);
    return account ? account.accountName : null;
  };

  const mixedAccountName = getAccountName(mixedAccount);
  const changeAccountName = getAccountName(changeAccount);

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
    csppServer,
    csppPort,
    mixedAccountBranch,
    accounts,
    accountMixerError,
    mixedAccountName,
    changeAccountName,
    onStartMixerAttempt,
    createNeededAccounts
  };
}
