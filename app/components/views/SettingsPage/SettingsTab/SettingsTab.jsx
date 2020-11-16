import { FormattedMessage as T } from "react-intl";
import ErrorScreen from "ErrorScreen";
import SettingsPage from "./Settings";
import { DescriptionHeader } from "layout";
import { useSettings, useService } from "hooks";

export const SettingsTabHeader = () => (
  <DescriptionHeader
    description={
      <T
        id="settings.description.settings"
        m="Changing network settings requires a restart"
      />
    }
  />
);

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
