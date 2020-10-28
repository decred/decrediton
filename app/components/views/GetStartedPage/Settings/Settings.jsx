import { useCallback } from "react";
import { classNames } from "pi-ui";
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
import stylesSettigs from "views/SettingsPage/Settings.module.css";
import stylesGetStarted from "../GetStarted.module.css";
import { useSettings } from "hooks";

const SetttingsForm = ({ onSendBack }) => {
  const { setThemeName } = useTheme();
  const {
    areSettingsDirty,
    tempSettings,
    locales,
    onChangeTempSettings,
    onSaveSettings,
    onAttemptChangePassphrase,
    isChangePassPhraseDisabled,
    changePassphraseRequestAttempt,
    walletReady
  } = useSettings();
  const saveSettingsHandler = useCallback(() => {
    const config = getGlobalCfg();
    const oldTheme = config.get(configConstants.THEME);
    if (oldTheme != tempSettings.theme) {
      setThemeName(tempSettings.theme);
    }
    onSaveSettings(tempSettings);
    onSendBack();
  }, [onSaveSettings, onSendBack, tempSettings, setThemeName]);
  const styles = {
    ...stylesSettigs,
    ...stylesGetStarted
  };
  return (
    <>
      <div className={classNames(styles.logs, styles.settings)}>
        <div className={styles.goBackScreenButtonArea}>
          <Tooltip text={<GoBackMsg />}>
            <div className={styles.goBackScreenButton} onClick={onSendBack} />
          </Tooltip>
        </div>
        <Subtitle title={<T id="settings.subtitle" m="Settings" />} />
        <div className={styles.wrapper}>
          <div className={styles.group}>
            <Subtitle title={
              <T id="settings.group-title.connectivity" m="Connectivity" />
            } />
            <div className={styles.columnWrapper}>
              <div className={styles.column}>
                <NetworkSettings
                  {...{
                    tempSettings,
                    onChangeTempSettings
                  }}
                />
              </div>
              <div className={styles.column}>
                <ProxySettings {...{ tempSettings, onChangeTempSettings }} />
              </div>
            </div>
          </div>

          <div className={classNames(styles.group, styles.general)}>
            <Subtitle title={
              <T id="settings.group-title.general" m="General" />
            } />
            <div className={styles.columnWrapper}>
              <div className={styles.column}>
                <UISettings
                  {...{ tempSettings, locales, onChangeTempSettings }}
                />
              </div>
              <div className={classNames(styles.column, styles.timezone)}>
                <TimezoneSettings {...{ tempSettings, onChangeTempSettings }} />
              </div>
            </div>
          </div>

          <div className={classNames(styles.group, styles.privacy)}>
            <Subtitle title={
              <T
                id="settings.group-title.privacy-and-security"
                m="Privacy and Security"
              />
            } />
            <div className={styles.columnWrapper}>
                <PrivacySettings
                  {...{
                    tempSettings,
                    onAttemptChangePassphrase,
                    isChangePassPhraseDisabled,
                    onChangeTempSettings,
                    walletReady,
                    changePassphraseRequestAttempt
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      <div className={styles.formSaveButtonWrapper}>
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

export default SetttingsForm;
