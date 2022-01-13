import PrivacyContent from "./PrivacyContent";
import ConfigMixer from "./ConfigMixer";
import { usePrivacy } from "./hooks";
import { useMountEffect } from "hooks";
import { useState } from "react";
import ReactTimeout from "react-timeout";

const Privacy = ({ setInterval }) => {
  const {
    stopAccountMixer,
    accountMixerRunning,
    mixedAccount,
    changeAccount,
    accounts,
    accountMixerError,
    isMixerDisabled,
    onStartMixerAttempt,
    onGetPrivacyLogs,
    allowSendFromUnmixed,
    toggleAllowSendFromUnmixed,
    showInsufficientBalanceWarning,
    defaultSpendingAccountDisregardMixedAccount,
    mixedAccountSpendableBalance,
    changeAccountSpendableBalance,
    getRunningIndicator,
    isCreateAccountDisabled,
    isAutoBuyerRunning,
    onDisableTicketAutoBuyer
  } = usePrivacy();

  const [logs, setLogs] = useState("");
  const [showingSendUnmixModal, showModal] = useState(false);
  const onToggleSendFromUnmixed = () => {
    if (showingSendUnmixModal) {
      toggleAllowSendFromUnmixed(true);
      showModal(false);
    }
  };
  const onChangeCheckbox = () => {
    if (!allowSendFromUnmixed) {
      showModal(true);
      return;
    }
    toggleAllowSendFromUnmixed(false);
  };

  useMountEffect(() => {
    // get initial logs
    onGetPrivacyLogs()
      .then((privacyLogs) => setLogs(privacyLogs.toString("utf-8")))
      .catch((err) => err);

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
        isMixerDisabled,
        onStartMixerAttempt,
        stopAccountMixer,
        logs,
        allowSendFromUnmixed,
        showingSendUnmixModal,
        onToggleSendFromUnmixed,
        showModal,
        onChangeCheckbox,
        mixedAccount,
        changeAccount,
        showInsufficientBalanceWarning,
        defaultSpendingAccountDisregardMixedAccount,
        mixedAccountSpendableBalance,
        changeAccountSpendableBalance,
        accounts,
        getRunningIndicator,
        isAutoBuyerRunning,
        onDisableTicketAutoBuyer
      }}
    />
  );
};

export default ReactTimeout(Privacy);
