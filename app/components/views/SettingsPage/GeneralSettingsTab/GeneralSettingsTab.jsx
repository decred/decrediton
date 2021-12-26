import { useCallback, useEffect } from "react";
import { DEFAULT_DARK_THEME_NAME, DEFAULT_LIGHT_THEME_NAME } from "pi-ui";
import ErrorScreen from "ErrorScreen";
import GeneralSettings from "./GeneralSettings";
import { useSettings, useService } from "hooks";
import * as configConstants from "constants/config";
import { wallet } from "wallet-preload-shim";

const GeneralSettingsTab = ({ setThemeName }) => {
  const {
    tempSettings,
    onSaveSettings,
    onChangeTempSettings,
    currencies,
    locales,
    areSettingsDirty,
    walletReady
  } = useSettings();
  const { walletService } = useService();

  const onSaveSettingsHandler = useCallback(() => {
    const config = wallet.getGlobalCfg();
    const oldTheme = config.get(configConstants.THEME);
    if (oldTheme != tempSettings.theme) {
      setThemeName(
        tempSettings.theme.includes("dark")
          ? DEFAULT_DARK_THEME_NAME
          : DEFAULT_LIGHT_THEME_NAME
      );
    }
    onSaveSettings?.(tempSettings);
  }, [onSaveSettings, setThemeName, tempSettings]);

  useEffect(() => {
    if (areSettingsDirty) {
      onSaveSettingsHandler();
    }
  }, [areSettingsDirty, onSaveSettingsHandler]);

  return !walletService ? (
    <ErrorScreen />
  ) : (
    <GeneralSettings
      {...{
        tempSettings,
        currencies,
        locales,
        onChangeTempSettings,
        walletReady
      }}
    />
  );
};

GeneralSettingsTab.propTypes = {
  setThemeName: PropTypes.func
};

export default GeneralSettingsTab;
