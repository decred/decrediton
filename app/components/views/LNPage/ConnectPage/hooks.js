import { useState } from "react";
import { CREATE_LN_ACCOUNT } from "actions/LNActions";
import { useLNPage } from "../hooks";

// The below constant MUST match what TextToggle expects/uses.
const NEW_ACCOUNT = "left";

export function useConnectPage() {
  const {
    defaultAccount,
    lightningWalletExists,
    startDcrlnd,
    startAttempt,
    startupStage
  } = useLNPage();

  const [autopilotEnabled, setAutopilotEnabled] = useState(false);
  const [account, setAccount] = useState(defaultAccount);
  const [accountOption, setAccountOption] = useState(NEW_ACCOUNT);
  const [scbFile, setScbFile] = useState("");
  const [displayCreationWarning, setDisplayCreationWarning] = useState(
    !lightningWalletExists
  );

  const onChangeAccount = (account) => {
    setAccount(account);
  };

  const onLaunch = (passphrase) => {
    let accountAux = null;
    if (!lightningWalletExists) {
      if (accountOption === NEW_ACCOUNT) {
        accountAux = CREATE_LN_ACCOUNT;
      } else {
        accountAux = account.value;
      }
    }

    startDcrlnd(passphrase, autopilotEnabled, accountAux, scbFile);
  };

  const onChangeEnableAutopilot = () => {
    setAutopilotEnabled(!autopilotEnabled);
  };

  const onAccountOptionClick = (value) => {
    setAccountOption(value);
  };

  const onAcceptCreationWarning = () => {
    setDisplayCreationWarning(false);
  };

  return {
    lightningWalletExists,
    startAttempt,
    startupStage,
    autopilotEnabled,
    account,
    accountOption,
    scbFile,
    setScbFile,
    displayCreationWarning,
    onChangeAccount,
    onLaunch,
    onChangeEnableAutopilot,
    onAccountOptionClick,
    onAcceptCreationWarning
  };
}
