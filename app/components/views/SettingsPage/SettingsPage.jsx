import ErrorScreen from "ErrorScreen";
import SettingsPage from "./Settings";
import { useSettings, useService } from "hooks";

const Settings = () => {
  const {
    onCloseWallet,
    tempSettings,
    onSaveSettings,
    onChangeTempSettings,
    onAttemptChangePassphrase,
    changePassphraseRequestAttempt,
    isChangePassPhraseDisabled,
    currencies,
    locales,
    networks,
    areSettingsDirty
  } = useSettings();
  const { walletService } = useService();

  const onSaveSettingsHandler = () => {
    onSaveSettings && onSaveSettings(tempSettings);
  };

  return !walletService ? (
    <ErrorScreen />
  ) : (
    <SettingsPage
      {...{
        onAttemptChangePassphrase,
        onSaveSettings: onSaveSettingsHandler,
        changePassphraseRequestAttempt,
        isChangePassPhraseDisabled,
        onCloseWallet,
        tempSettings,
        onChangeTempSettings,
        currencies,
        locales,
        networks,
        areSettingsDirty
      }}
    />
  );
};

export default Settings;
