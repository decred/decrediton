import ErrorScreen from "ErrorScreen";
import SettingsPage from "./Settings";
import { useSettings, useService } from "hooks";

export const SettingsTab = () => {
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
    walletReady,
    onDiscoverUsage
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
        onDiscoverUsage
      }}
    />
  );
};
