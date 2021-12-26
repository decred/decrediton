import { useState, useEffect, useCallback } from "react";
import ErrorScreen from "ErrorScreen";
import ConnectivitySettings from "./ConnectivitySettings";
import { useSettings, useService } from "hooks";

const ConnectivitySettingsTab = () => {
  const {
    tempSettings,
    onSaveSettings,
    onChangeTempSettings,
    areSettingsDirty,
    needNetworkReset,
    resetSettingsState
  } = useSettings();
  const { walletService } = useService();

  const onSaveSettingsHandler = useCallback(
    () => onSaveSettings && onSaveSettings(tempSettings),
    [tempSettings, onSaveSettings]
  );

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  useEffect(() => {
    if (areSettingsDirty) {
      if (needNetworkReset) {
        setShowConfirmModal(true);
      } else {
        onSaveSettingsHandler();
      }
    }
  }, [areSettingsDirty, needNetworkReset, onSaveSettingsHandler]);

  const onCancelConfirmModal = () => {
    setShowConfirmModal(false);
    resetSettingsState();
  };

  return !walletService ? (
    <ErrorScreen />
  ) : (
    <ConnectivitySettings
      {...{
        onSaveSettings: onSaveSettingsHandler,
        tempSettings,
        onChangeTempSettings,
        showConfirmModal,
        onCancelConfirmModal
      }}
    />
  );
};

export default ConnectivitySettingsTab;
