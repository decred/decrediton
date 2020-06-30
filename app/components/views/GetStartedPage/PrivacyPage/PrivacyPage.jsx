import { useState } from "react";
import { daemonStartup, settings } from "connectors"; // XXX: use useSettings & useDaemonStartup hooks
import Page from "./Page";

const PrivacyPage = ({
  finishPrivacy,
  onSaveSettings,
  tempSettings,
  setupStandardPrivacy,
  setupDisabledPrivacy,
  isChangePassPhraseDisabled,
  changePassphraseRequestAttempt,
  onChangeTempSettings
}) => {
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
        onChangeTempSettings
      }}
    />
  );
};

export default daemonStartup(settings(PrivacyPage));
