import * as act from "actions/AccountMixerActions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useReducer } from "react";
import { FormattedMessage as T } from "react-intl";
import PrivacyPage from "./Page";
import * as sel from "selectors";
import ConfigMixer from "./ConfigMixer";

function validateErrorReducer(state, action) {
  switch (action.type) {
  case "MIXED_ACCOUNT_BRANCH":
    return {
      ...state,
      mixedAccountBranch: <T id="privacy.error.mixed.branch" m="Missing Mixed Account Branch" />
    };
  case "REMOVE_MIXED_ACCOUNT_BRANCH_ERROR":
    return {
      ...state,
      mixedAccountBranch: null
    };
  case "ACCOUNT_MIXER_START":
    return {
      ...state,
      mixerStart: action.error
    };
  }
}

function Privacy({
  isCreateAccountDisabled
}) {
  const dispatch = useDispatch();
  const runAccountMixer = (request) => dispatch(act.runAccountMixer(request));
  const stopAccountMixer = () => dispatch(act.stopAccountMixer());
  const accountMixerRunning = useSelector(sel.getAccountMixerRunning);
  const mixedAccount = useSelector(sel.getMixedAccount);
  const changeAccount = useSelector(sel.getChangeAccount);
  const csppServer = useSelector(sel.getCsppServer);
  const csppPort = useSelector(sel.getCsppPort);
  const accounts = useSelector(sel.sortedAccounts);
  const [ mixedAccountBranch, setMixedAccountBranch ] = useState(0);
  const [ error, dispatchError ] = useReducer(validateErrorReducer, {
    mixedAccountBranch: null
  });
  const [ canStartMixer, setCanStartMixer ] = useState(false);
  useEffect(() => setCanStartMixer(isValidStartMixer()), [ mixedAccountBranch ]);


  if (!mixedAccount && !changeAccount) {
    return <ConfigMixer {...{ isCreateAccountDisabled, accounts }} />;
  }

  const getAccountName = (n) => {
    const account = accounts.find( ({ accountNumber }) => accountNumber === n );
    return account ? account.accountName : null;
  };

  const mixedAccountName = getAccountName(mixedAccount);
  const changeAccountName = getAccountName(changeAccount);

  function isValidStartMixer() {
    let isValid = true;
    if (mixedAccountBranch === "") {
      isValid = false;
      dispatchError({ type: "MIXED_ACCOUNT_BRANCH" });
    } else {
      dispatchError({ type: "REMOVE_MIXED_ACCOUNT_BRANCH_ERROR" });
    }

    return isValid;
  }

  async function onStartMixerAttempt(passphrase) {
    const request = {
      passphrase,
      mixedAccount,
      changeAccount,
      mixedAccountBranch,
      csppServer: "cspp.decred.org:15760"
    };
    try {
      await runAccountMixer(request);
    } catch (error) {
      dispatchError({ type: "ACCOUNT_MIXER_START", error });
    }
  }

  return <PrivacyPage {...{
    mixedAccountName, mixedAccountBranch, setMixedAccountBranch,
    changeAccountName, onStartMixerAttempt, canStartMixer, error,
    stopAccountMixer, accountMixerRunning, csppServer, csppPort
  }} />;
}

export default Privacy;
