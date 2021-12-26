import { useEffect } from "react";
import ErrorScreen from "ErrorScreen";
import PrivacyandSecuritySettings from "./PrivacyandSecuritySettings";
import { useSettings, useService } from "hooks";

const PrivacyandSecuritySettingsTab = () => {
  const {
    tempSettings,
    onSaveSettings,
    onChangeTempSettings,
    onAttemptChangePassphrase,
    changePassphraseRequestAttempt,
    isChangePassPhraseDisabled,
    areSettingsDirty,
    walletReady
  } = useSettings();
  const { walletService } = useService();

  useEffect(() => {
    if (areSettingsDirty) {
      onSaveSettings?.(tempSettings);
    }
  }, [areSettingsDirty, onSaveSettings, tempSettings]);

  return !walletService ? (
    <ErrorScreen />
  ) : (
    <PrivacyandSecuritySettings
      {...{
        tempSettings,
        onChangeTempSettings,
        onAttemptChangePassphrase,
        isChangePassPhraseDisabled,
        changePassphraseRequestAttempt,
        walletReady
      }}
    />
  );
};

export default PrivacyandSecuritySettingsTab;
