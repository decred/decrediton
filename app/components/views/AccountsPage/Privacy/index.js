import * as act from "actions/AccountMixerActions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useReducer } from "react";
import { FormattedMessage as T } from "react-intl";
import PrivacyPage from "./Page";
import * as sel from "selectors";

function validateErrorReducer(state, action) {
  console.log(action)
  console.log(state)
  switch (action.type) {
  case "MIXED_ACCOUNT":
    return {
      ...state,
      mixedAccount: true
    };
  case "REMOVE_MIXED_ACCOUNT_ERROR":
    return {
      ...state,
      mixedAccount: false
    };
  case "CHANGE_ACCOUNT":
    return {
      ...state,
      changeAccount: true
    };
  case "REMOVE_CHANGE_ACCOUNT_ERROR":
    return {
      ...state,
      changeAccount: false
    };
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
  case "SAME_ACCOUNT":
      return {
        ...state,
        sameAccount: <T id="privacy.error.same-account" m="Mixed account and Change account can not be the same" />,
        mixedAccount: true,
        changeAccount: true
      };
  case "REMOVE_SAME_ACCOUNT_ERROR":
    return {
      ...state,
      sameAccount: null,
      mixedAccount: false,
      changeAccount: false
    };
  }
}

function Privacy() {
  const dispatch = useDispatch();
  const runAccountMixer = (request) => dispatch(act.runAccountMixer(request));
  const stopAccountMixer = () => dispatch(act.stopAccountMixer());
  const accountMixerRunning = useSelector(sel.getAccountMixerRunning);
  const [ mixedAccount, setMixedAccount ] = useState(null);
  const [ mixedAccountBranch, setMixedAccountBranch ] = useState(0);
  const [ changeAccount, setChangeAccount ] = useState(null);
  const [ error, dispatchError ] = useReducer(validateErrorReducer, {
    mixedAccount: null,
    changeAccount: null,
    mixedAccountBranch: null,
    sameAccount: null
  });
  const [ canStartMixer, setCanStartMixer ] = useState(false);

  function isValidStartMixer() {
    let isValid = true;
    if (mixedAccountBranch === "") {
      isValid = false;
      dispatchError({ type: "MIXED_ACCOUNT_BRANCH" });
    } else {
      dispatchError({ type: "REMOVE_MIXED_ACCOUNT_BRANCH_ERROR" });
    }

    if (!mixedAccount) {
      isValid = false;
      dispatchError({ type: "MIXED_ACCOUNT" });
    } else {
      dispatchError({ type: "REMOVE_MIXED_ACCOUNT_ERROR" });
    }
    if (!changeAccount) {
      isValid = false;
      dispatchError({ type: "CHANGE_ACCOUNT" });
    } else {
      dispatchError({ type: "REMOVE_CHANGE_ACCOUNT_ERROR" });
    }
  
    if (!mixedAccount || !changeAccount) return isValid;
    if (mixedAccount.value === changeAccount.value) {
      isValid = false;
      dispatchError({ type: "SAME_ACCOUNT" });
    } else {
      dispatchError({ type: "REMOVE_SAME_ACCOUNT_ERROR" });
    }

    return isValid;
  }

  async function onStartMixerAttempt(passphrase) {
    const request = {
      passphrase,
      mixedAccount: mixedAccount.value,
      changeAccount: changeAccount.value,
      mixedAccountBranch,
      csppServer: "cspp.decred.org:15760"
    };
    try {
      await runAccountMixer(request);
    } catch (error) {
      dispatchError({ type: "ACCOUNT_MIXER_START", error });
    }
  }

  useEffect(() => setCanStartMixer(isValidStartMixer()),
    [ mixedAccount, changeAccount, mixedAccountBranch ]);

  return <PrivacyPage {...{
    mixedAccount, setMixedAccount, mixedAccountBranch, setMixedAccountBranch,
    changeAccount, setChangeAccount, onStartMixerAttempt, canStartMixer, error,
    stopAccountMixer, onStartMixerAttempt, accountMixerRunning
  }} />;
}

export default Privacy;
