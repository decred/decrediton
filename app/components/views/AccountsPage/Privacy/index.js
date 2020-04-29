import * as act from "actions/AccountMixerActions";
import { useDispatch, useSelector } from "react-redux";
import { useReducer } from "react";
import PrivacyPage from "./Page";
import * as sel from "selectors";
import ConfigMixer from "./ConfigMixer";

function validateErrorReducer(state, action) {
  switch (action.type) {
    case "ACCOUNT_MIXER_START":
      return {
        ...state,
        mixerStart: action.error
      };
  }
}

function Privacy({ isCreateAccountDisabled }) {
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
  const [error, dispatchError] = useReducer(validateErrorReducer, {
    mixedStart: null
  });

  if (!mixedAccount && !changeAccount) {
    return <ConfigMixer {...{ isCreateAccountDisabled, accounts }} />;
  }

  const getAccountName = (n) => {
    const account = accounts.find(({ accountNumber }) => accountNumber === n);
    return account ? account.accountName : null;
  };

  const mixedAccountName = getAccountName(mixedAccount);
  const changeAccountName = getAccountName(changeAccount);

  async function onStartMixerAttempt(passphrase) {
    const request = {
      passphrase,
      mixedAccount,
      changeAccount,
      mixedAccountBranch,
      csppServer: `${csppServer}:${csppPort}`
    };
    try {
      await runAccountMixer(request);
    } catch (error) {
      dispatchError({ type: "ACCOUNT_MIXER_START", error });
    }
  }

  return (
    <PrivacyPage
      {...{
        mixedAccountName,
        accountMixerRunning,
        error,
        csppServer,
        csppPort,
        changeAccountName,
        onStartMixerAttempt,
        stopAccountMixer,
        mixedAccountBranch
      }}
    />
  );
}

export default Privacy;
