import { useCallback } from "react";
import NetworkSettings from "views/SettingsPage/NetworkSettings";
import ProxySettings from "views/SettingsPage/ProxySettings";
import PrivacySettings from "views/SettingsPage/PrivacySettings";
import UISettings from "views/SettingsPage/UISettings";
import TimezoneSettings from "views/SettingsPage/TimezoneSettings";
import { Tooltip, Subtitle } from "shared";
import { FormattedMessage as T } from "react-intl";
import { KeyBlueButton } from "buttons";
import { GoBackMsg } from "../messages";
import { getGlobalCfg } from "config";
import * as configConstants from "constants/config";
import { useTheme } from "pi-ui";

export default ({
  areSettingsDirty,
  tempSettings,
  locales,
  onChangeTempSettings,
  onSaveSettings,
  onAttemptChangePassphrase,
  isChangePassPhraseDisabled,
  changePassphraseRequestAttempt,
  onSendBack
}) => {
  const { setThemeName } = useTheme();
  const saveSettingsHandler = useCallback(() => {
    const config = getGlobalCfg();
    const oldTheme = config.get(configConstants.THEME);
    if (oldTheme != tempSettings.theme) {
      setThemeName(tempSettings.theme);
    }
    onSaveSettings(tempSettings);
    onSendBack();
  }, [onSaveSettings, onSendBack, tempSettings, setThemeName]);
  return (
    <>
      <div className="getstarted loader logs settings">
        <div className="go-back-screen-button-area">
          <Tooltip text={<GoBackMsg />}>
            <div className="go-back-screen-button" onClick={onSendBack} />
          </Tooltip>
        </div>
        <Subtitle title={<T id="settings.subtitle" m="Settings" />} />
        <div className="settings-wrapper">
          <div className="settings-group">
            <div className="settings-group-title">
              <T id="settings.group-title.connectivity" m="Connectivity" />
            </div>
            <div className="settings-column-wrapper">
              <div className="settings-column">
                <NetworkSettings
                  {...{
                    tempSettings,
                    onChangeTempSettings
                  }}
                />
              </div>
              <div className="settings-column">
                <ProxySettings {...{ tempSettings, onChangeTempSettings }} />
              </div>
            </div>
          </div>

          <div className="settings-group general">
            <div className="settings-group-title">
              <T id="settings.group-title.general" m="General" />
            </div>
            <div className="settings-column-wrapper">
              <div className="settings-column">
                <UISettings
                  {...{ tempSettings, locales, onChangeTempSettings }}
                />
              </div>
              <div className="settings-column timezone">
                <TimezoneSettings {...{ tempSettings, onChangeTempSettings }} />
              </div>
            </div>
          </div>

          <div className="settings-group privacy">
            <div className="settings-group-title">
              <T
                id="settings.group-title.privacy-and-security"
                m="Privacy and Security"
              />
            </div>
            <div className="settings-column-wrapper">
              <div className="settings-column">
                <PrivacySettings
                  {...{
                    tempSettings,
                    onAttemptChangePassphrase,
                    isChangePassPhraseDisabled,
                    onChangeTempSettings,
                    changePassphraseRequestAttempt
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="save-button-wrapper">
        <KeyBlueButton
          disabled={!areSettingsDirty}
          size="large"
          block={false}
          onClick={saveSettingsHandler}>
          <T id="getStarted.settings.save" m="Save" />
        </KeyBlueButton>
      </div>
    </>
  );
};
