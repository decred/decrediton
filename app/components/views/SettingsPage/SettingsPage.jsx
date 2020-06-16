import ErrorScreen from "ErrorScreen";
import SettingsPage from "./Settings";
import { useSettings, useService } from "hooks";

const Settings = () => {
  const {
    onCloseWallet,
    tempSettings,
    onSaveSettings,
    onChangeTempSettings
  } = useSettings();
  const { walletService } = useService();

  const onAttemptChangePassphrase = (oldPass, newPass, priv) => {
    const { onAttemptChangePassphrase } = this.props;
    onAttemptChangePassphrase &&
      onAttemptChangePassphrase(oldPass, newPass, priv);
  };

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
        onCloseWallet,
        tempSettings,
        onChangeTempSettings
      }}
    />
  );
};

export default Settings;
