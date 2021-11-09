import ErrorScreen from "ErrorScreen";
import SettingsPage from "./Settings";
import { useSettings, useService } from "hooks";

export const SettingsTab = ({ setThemeName }) => {
  const {
    tempSettings,
    onSaveSettings,
    onChangeTempSettings,
    onAttemptChangePassphrase,
    changePassphraseRequestAttempt,
    isChangePassPhraseDisabled,
    currencies,
    locales,
    networks,
    areSettingsDirty,
    needNetworkReset,
    walletReady
  } = useSettings();
  const { walletService } = useService();

  const onSaveSettingsHandler = () =>
    onSaveSettings && onSaveSettings(tempSettings);

  return !walletService ? (
    <ErrorScreen />
  ) : (
    <SettingsPage
      {...{
        onAttemptChangePassphrase,
        onSaveSettings: onSaveSettingsHandler,
        changePassphraseRequestAttempt,
        isChangePassPhraseDisabled,
        tempSettings,
        onChangeTempSettings,
        currencies,
        locales,
        networks,
        areSettingsDirty,
        needNetworkReset,
        walletReady,
        setThemeName
      }}
    />
  );
};
