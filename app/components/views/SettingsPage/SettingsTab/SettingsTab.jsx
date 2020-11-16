import ErrorScreen from "ErrorScreen";
import SettingsPage from "./Settings";
import { useSettings, useService } from "hooks";

export const SettingsTab = () => {
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
    areSettingsDirty,
    isTicketAutoBuyerEnabled,
    needNetworkReset,
    walletName,
    walletReady
  } = useSettings();
  const { walletService } = useService();

  const onSaveSettingsHandler = () => onSaveSettings && onSaveSettings(tempSettings);

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
        areSettingsDirty,
        isTicketAutoBuyerEnabled,
        needNetworkReset,
        walletName,
        walletReady
      }}
    />
  );
};
