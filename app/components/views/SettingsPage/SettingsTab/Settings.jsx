import { useCallback } from "react";
import {
  useTheme,
  classNames,
  DEFAULT_DARK_THEME_NAME,
  DEFAULT_LIGHT_THEME_NAME
} from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import { KeyBlueButton, ResetNetworkButton } from "buttons";
import NetworkSettings from "./NetworkSettings";
import ProxySettings from "./ProxySettings";
import PrivacySettings from "./PrivacySettings";
import UISettings from "./UISettings";
import MiscSettings from "./MiscSettings";
import TimezoneSettings from "./TimezoneSettings";
import { Subtitle } from "shared";
import styles from "./Settings.module.css";
import * as configConstants from "constants/config";
import { wallet } from "wallet-preload-shim";

const SettingsPage = ({
  areSettingsDirty,
  tempSettings,
  currencies,
  locales,
  onChangeTempSettings,
  onSaveSettings,
  onAttemptChangePassphrase,
  isChangePassPhraseDisabled,
  changePassphraseRequestAttempt,
  needNetworkReset,
  walletReady,
  onDiscoverUsage,
  gapLimit,
  setGapLimit,
  isValid,
  clicked,
  isDiscoverModalVisible,
  showDiscoverModal,
  hideDiscoverModal
}) => {
  const { setThemeName } = useTheme();
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
  }, [onSaveSettings, tempSettings, setThemeName]);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.group}>
          <Subtitle
            title={
              <T
                id="settings.getstartpage.group-title.connectivity"
                m="Connectivity"
              />
            }
          />
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
          <Subtitle
            title={
              <T id="settings.getstartpage.group-title.general" m="General" />
            }
          />
          <div className={styles.columnWrapper}>
            <div className={styles.column}>
              <UISettings
                {...{ tempSettings, locales, onChangeTempSettings }}
              />
            </div>
            <div className={classNames(styles.column, styles.timezone)}>
              <TimezoneSettings {...{ tempSettings, onChangeTempSettings }} />
            </div>
            {walletReady && (
              <div className={styles.column}>
                <MiscSettings
                  {...{
                    tempSettings,
                    currencies,
                    walletReady,
                    onChangeTempSettings,
                    onDiscoverUsage,
                    gapLimit,
                    setGapLimit,
                    isValid,
                    clicked,
                    isDiscoverModalVisible,
                    showDiscoverModal,
                    hideDiscoverModal
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className={classNames(styles.group, styles.privacy)}>
          <Subtitle
            title={
              <T
                id="settings.getstartpage.group-title.privacy-and-security"
                m="Privacy and Security"
              />
            }
          />
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

      <div className={styles.saveButtonWrapper}>
        <div className={styles.saveButton}>
          {needNetworkReset ? (
            <ResetNetworkButton
              modalTitle={
                <T id="settings.resetNetworkTitle" m="Reset required" />
              }
              buttonLabel={<T id="settings.save" m="Save" />}
              modalContent={
                <T
                  id="settings.resetNetworkContent"
                  m="The setting you have chosen to change requires Decrediton to be restarted.  Please confirm this action before proceeding."
                />
              }
              disabled={!areSettingsDirty}
              size="large"
              block={false}
              onSubmit={saveSettingsHandler}
            />
          ) : (
            <KeyBlueButton
              disabled={!areSettingsDirty}
              size="large"
              block={false}
              onClick={saveSettingsHandler}>
              <T id="settings.save" m="Save" />
            </KeyBlueButton>
          )}
        </div>
      </div>
    </>
  );
};

SettingsPage.propTypes = {
  areSettingsDirty: PropTypes.bool.isRequired,
  tempSettings: PropTypes.object.isRequired,
  networks: PropTypes.array.isRequired,
  currencies: PropTypes.array.isRequired,
  locales: PropTypes.array,
  onChangeTempSettings: PropTypes.func.isRequired,
  onSaveSettings: PropTypes.func.isRequired,
  onAttemptChangePassphrase: PropTypes.func,
  isChangePassPhraseDisabled: PropTypes.bool.isRequired,
  changePassphraseRequestAttempt: PropTypes.bool.isRequired
};

export default SettingsPage;
