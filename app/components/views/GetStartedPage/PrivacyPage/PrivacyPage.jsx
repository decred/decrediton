import { useState } from "react";
import { useDaemonStartup, useSettings } from "hooks";
import Page from "./Page";

const PrivacyPage = () => {
  const {
    isChangePassPhraseDisabled,
    changePassphraseRequestAttempt,
    onSaveSettings,
    tempSettings,
    onChangeTempSettings
  } = useSettings();
  const {
    finishPrivacy,
    setupStandardPrivacy,
    setupDisabledPrivacy,
    isTestNet
  } = useDaemonStartup();
  const [showCustomPrivacy, setShowCustomPrivacy] = useState(false);

  const toggleCustomPrivacy = () => setShowCustomPrivacy(!showCustomPrivacy);

  const acceptCustomPrivacy = () => {
    onSaveSettings(tempSettings);
    finishPrivacy();
  };

  return (
    <Page
      {...{
        onSaveSettings,
        tempSettings,
        acceptCustomPrivacy,
        toggleCustomPrivacy,
        setupStandardPrivacy,
        setupDisabledPrivacy,
        finishPrivacy,
        showCustomPrivacy,
        isChangePassPhraseDisabled,
        changePassphraseRequestAttempt,
        onChangeTempSettings,
        isTestNet
      }}
    />
  );
};

export default PrivacyPage;
