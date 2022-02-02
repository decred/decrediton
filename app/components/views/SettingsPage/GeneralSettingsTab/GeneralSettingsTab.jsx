import { useCallback, useEffect } from "react";
import { DEFAULT_DARK_THEME_NAME, DEFAULT_LIGHT_THEME_NAME } from "pi-ui";
import GeneralSettings from "./GeneralSettings";
import { useSettings } from "hooks";
import * as configConstants from "constants/config";
import { wallet } from "wallet-preload-shim";

const GeneralSettingsTab = ({
  wrapperClassName,
  uiBoxClassName,
  uiGroupClassName,
  timezoneBoxClassName,
  setThemeName
}) => {
  const {
    tempSettings,
    onSaveSettings,
    onChangeTempSettings,
    currencies,
    locales,
    areSettingsDirty,
    walletReady
  } = useSettings();

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

  return (
    <GeneralSettings
      {...{
        tempSettings,
        currencies,
        locales,
        onChangeTempSettings,
        walletReady,
        wrapperClassName,
        uiBoxClassName,
        uiGroupClassName,
        timezoneBoxClassName
      }}
    />
  );
};

GeneralSettingsTab.propTypes = {
  setThemeName: PropTypes.func,
  wrapperClassName: PropTypes.string,
  uiBoxClassName: PropTypes.string,
  uiGroupClassName: PropTypes.string,
  timezoneBoxClassName: PropTypes.string
};

export default GeneralSettingsTab;
