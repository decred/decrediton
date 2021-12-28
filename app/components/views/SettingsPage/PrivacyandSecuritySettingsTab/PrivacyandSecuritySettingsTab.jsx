import { useEffect } from "react";
import PrivacyandSecuritySettings from "./PrivacyandSecuritySettings";
import { useSettings } from "hooks";

const PrivacyandSecuritySettingsTab = ({ wrapperClassName, boxClassName }) => {
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

  useEffect(() => {
    if (areSettingsDirty) {
      onSaveSettings?.(tempSettings);
    }
  }, [areSettingsDirty, onSaveSettings, tempSettings]);

  return (
    <PrivacyandSecuritySettings
      {...{
        tempSettings,
        onChangeTempSettings,
        onAttemptChangePassphrase,
        isChangePassPhraseDisabled,
        changePassphraseRequestAttempt,
        walletReady,
        wrapperClassName,
        boxClassName
      }}
    />
  );
};

export default PrivacyandSecuritySettingsTab;
