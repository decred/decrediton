import { useCallback } from "react";
import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "pi-ui";
import {
  NetworkSettings,
  ProxySettings,
  PrivacySettings,
  UISettings,
  TimezoneSettings
} from "views/SettingsPage/SettingsTab/groups";
import { Subtitle } from "shared";
import { KeyBlueButton } from "buttons";
import { GoBackMsg } from "../messages";
import * as configConstants from "constants/config";
import {
  useTheme,
  DEFAULT_LIGHT_THEME_NAME,
  DEFAULT_DARK_THEME_NAME
} from "pi-ui";
import { Wrapper, Group } from "views/SettingsPage/helpers";
import { useSettings } from "hooks";
import { BackButton, BackButtonArea } from "../helpers";
import styles from "./Settings.module.css";
import { wallet } from "wallet-preload-shim";

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
        <Wrapper>
          <Group>
            <Subtitle
              title={
                <T id="settings.group-title.connectivity" m="Connectivity" />
              }
            />
            <NetworkSettings
              {...{
                tempSettings,
                onChangeTempSettings
              }}
            />
            <ProxySettings {...{ tempSettings, onChangeTempSettings }} />
          </Group>

          <Group className={styles.general}>
            <Subtitle
              title={<T id="settings.group-title.general" m="General" />}
            />
            <UISettings {...{ tempSettings, locales, onChangeTempSettings }} />
            <TimezoneSettings {...{ tempSettings, onChangeTempSettings }} />
          </Group>

          <Group className={styles.privacy}>
            <Subtitle
              title={
                <T
                  id="settings.group-title.privacy-and-security"
                  m="Privacy and Security"
                />
              }
            />
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
          </Group>
        </Wrapper>
      </div>
      <div className={styles.saveButtonWrapper}>
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
