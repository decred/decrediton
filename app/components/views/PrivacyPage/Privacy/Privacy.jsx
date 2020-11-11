import PrivacyContent from "./PrivacyContent";
import ConfigMixer from "./ConfigMixer/ConfigMixer";
import { usePrivacy } from "./hooks";
import { useMountEffect } from "hooks";
import { useState } from "react";
import ReactTimeout from "react-timeout";

const Privacy = ({ isCreateAccountDisabled, setInterval }) => {
  const {
    stopAccountMixer,
    accountMixerRunning,
    mixedAccount,
    changeAccount,
    accounts,
    accountMixerError,
    onStartMixerAttempt,
    onGetPrivacyLogs,
    allowSendFromUnmixed,
    toggleAllowSendFromUnmixed
  } = usePrivacy();

  const [logs, setLogs] = useState("");
  useMountEffect(() => {
    // get initial logs
    onGetPrivacyLogs()
      .then(privacyLogs => setLogs(privacyLogs.toString("utf-8")))
      .catch(err => err);

    const privacyInterval = setInterval(async () => {
      try {
        const privacyLogs = await onGetPrivacyLogs();
        setLogs(privacyLogs.toString("utf-8"));
      } catch (err) {
        console.log(err);
      }
    }, 2000);

    // Cleanup intervals on unmount
    return () => {
      clearInterval(privacyInterval);
    };
  });

  return !mixedAccount && !changeAccount ? (
    <ConfigMixer {...{ isCreateAccountDisabled, accounts }} />
  ) : (
    <PrivacyContent
      {...{
        accountMixerRunning,
        accountMixerError,
        onStartMixerAttempt,
        stopAccountMixer,
        logs,
        allowSendFromUnmixed,
        toggleAllowSendFromUnmixed
      }}
    />
  );
};

export default ReactTimeout(Privacy);
