import { useCallback } from "react";
import { FormattedMessage as T } from "react-intl";
import { classNames, Tooltip } from "pi-ui";
// XXX add index.js in SettingsTab dir to have one import statement for all
// settings components.
import NetworkSettings from "views/SettingsPage/SettingsTab/NetworkSettings";
import ProxySettings from "views/SettingsPage/SettingsTab/ProxySettings";
import PrivacySettings from "views/SettingsPage/SettingsTab/PrivacySettings";
import UISettings from "views/SettingsPage/SettingsTab/UISettings";
import TimezoneSettings from "views/SettingsPage/SettingsTab/TimezoneSettings";
import { Subtitle } from "shared";
import { KeyBlueButton } from "buttons";
import { GoBackMsg } from "../messages";
import * as configConstants from "constants/config";
import {
  useTheme,
  DEFAULT_LIGHT_THEME_NAME,
  DEFAULT_DARK_THEME_NAME
} from "pi-ui";
// XXX we shouldn't import other view css module here, this is breaking
// css modules encapsulation principle - instead the shared classes should be
// moved to a separate components and used in both places.
import settingsTabStyles from "views/SettingsPage/SettingsTab/Settings.module.css";
import { useSettings } from "hooks";
import { BackButton, BackButtonArea } from "../helpers";
import styles from "./Settings.module.css";
import * as wallet from "wallet";

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
    const config = wallet.getGlobalCfg();
    const oldTheme = config.get(configConstants.THEME);
    if (oldTheme != tempSettings.theme) {
      setThemeName(
        tempSettings.theme.includes("dark")
          ? DEFAULT_DARK_THEME_NAME
          : DEFAULT_LIGHT_THEME_NAME
      );
    }
    onSaveSettings(tempSettings);
    onSendBack();
  }, [onSaveSettings, onSendBack, tempSettings, setThemeName]);

  return (
    <>
      <div>
        <BackButtonArea className={styles.backButtonArea}>
          <Tooltip content={<GoBackMsg />}>
            <BackButton onClick={onSendBack} />
          </Tooltip>
        </BackButtonArea>
        <Subtitle title={<T id="settings.subtitle" m="Settings" />} />
        <div className={settingsTabStyles.wrapper}>
          <div className={settingsTabStyles.group}>
            <Subtitle
              title={
                <T id="settings.group-title.connectivity" m="Connectivity" />
              }
            />
            <div className={settingsTabStyles.columnWrapper}>
              <div className={settingsTabStyles.column}>
                <NetworkSettings
                  {...{
                    tempSettings,
                    onChangeTempSettings
                  }}
                />
              </div>
              <div className={settingsTabStyles.column}>
                <ProxySettings {...{ tempSettings, onChangeTempSettings }} />
              </div>
            </div>
          </div>

          <div
            className={classNames(
              settingsTabStyles.group,
              settingsTabStyles.general
            )}>
            <Subtitle
              title={<T id="settings.group-title.general" m="General" />}
            />
            <div className={settingsTabStyles.columnWrapper}>
              <div className={settingsTabStyles.column}>
                <UISettings
                  {...{ tempSettings, locales, onChangeTempSettings }}
                />
              </div>
              <div
                className={classNames(
                  settingsTabStyles.column,
                  settingsTabStyles.timezone
                )}>
                <TimezoneSettings {...{ tempSettings, onChangeTempSettings }} />
              </div>
            </div>
          </div>

          <div
            className={classNames(
              settingsTabStyles.group,
              settingsTabStyles.privacy
            )}>
            <Subtitle
              title={
                <T
                  id="settings.group-title.privacy-and-security"
                  m="Privacy and Security"
                />
              }
            />
            <div className={settingsTabStyles.columnWrapper}>
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
      <div className={settingsTabStyles.formSaveButtonWrapper}>
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
