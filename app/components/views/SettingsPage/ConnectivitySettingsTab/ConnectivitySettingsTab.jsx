import { useState, useEffect, useCallback } from "react";
import ConnectivitySettings from "./ConnectivitySettings";
import { useSettings } from "hooks";

const ConnectivitySettingsTab = ({
  wrapperClassName,
  groupWrapperClassName
}) => {
  const {
    tempSettings,
    onSaveSettings,
    onChangeTempSettings,
    areSettingsDirty,
    needNetworkReset,
    resetSettingsState
  } = useSettings();

  const onSaveSettingsHandler = useCallback(() => {
    setShowConfirmModal(false);
    onSaveSettings && onSaveSettings(tempSettings);
  }, [tempSettings, onSaveSettings]);

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

  return (
    <ConnectivitySettings
      {...{
        onSaveSettings: onSaveSettingsHandler,
        tempSettings,
        onChangeTempSettings,
        showConfirmModal,
        onCancelConfirmModal,
        wrapperClassName,
        groupWrapperClassName
      }}
    />
  );
  // );
};

export default ConnectivitySettingsTab;
