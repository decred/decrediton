import { useCallback, useEffect, useState } from "react";
import { DEFAULT_DARK_THEME_NAME, DEFAULT_LIGHT_THEME_NAME } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import { KeyBlueButton, ResetNetworkButton } from "buttons";
import {
  NetworkSettings,
  ProxySettings,
  PrivacySettings,
  UISettings,
  MiscSettings,
  TimezoneSettings,
  PrivatePassphraseSettings
} from "./groups";
import { Subtitle } from "shared";
import styles from "./Settings.module.css";
import * as configConstants from "constants/config";
import { wallet } from "wallet-preload-shim";
import { Wrapper, Group, GroupWrapper } from "../helpers";
import { ConfirmModal } from "modals";

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
  setThemeName,
  resetSettingsState
}) => {
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

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  useEffect(() => {
    if (areSettingsDirty) {
      if (needNetworkReset) {
        setShowConfirmModal(true);
      } else {
        saveSettingsHandler();
      }
    }
  }, [areSettingsDirty]);

  return (
    <>
      <Wrapper>
        <GroupWrapper>
          <Group>
            <Subtitle
              className={styles.subtitle}
              title={
                <T id="settings.getstartpage.group-title.network" m="Network" />
              }
            />
            <NetworkSettings
              {...{
                tempSettings,
                onChangeTempSettings
              }}
            />
          </Group>
        </GroupWrapper>

        <GroupWrapper>
          <Group>
            <Subtitle
              className={styles.subtitle}
              title={
                <T id="settings.getstartpage.group-title.proxy" m="Proxy" />
              }
            />
            <ProxySettings {...{ tempSettings, onChangeTempSettings }} />
          </Group>
        </GroupWrapper>

        <GroupWrapper className={styles.twoColumns}>
          <Group>
            <Subtitle
              className={styles.subtitle}
              title={
                <T
                  id="settings.getstartpage.group-title.timezone"
                  m="Timezone"
                />
              }
            />
            <TimezoneSettings {...{ tempSettings, onChangeTempSettings }} />
          </Group>

          {walletReady && (
            <Group>
              <Subtitle
                className={styles.subtitle}
                title={
                  <T id="settings.getstartpage.group-title.misc" m="Misc" />
                }
              />
              <MiscSettings
                {...{
                  tempSettings,
                  currencies,
                  onChangeTempSettings
                }}
              />
            </Group>
          )}
        </GroupWrapper>

        <GroupWrapper>
          <Group>
            <Subtitle
              className={styles.subtitle}
              title={<T id="settings.getstartpage.group-title.ui" m="UI" />}
            />
            <UISettings {...{ tempSettings, locales, onChangeTempSettings }} />
          </Group>
        </GroupWrapper>

        {walletReady && (
          <GroupWrapper>
            <Group>
              <Subtitle
                className={styles.subtitle}
                title={
                  <T
                    id="settings.getstartpage.group-title.privatePassphrase"
                    m="Private Passphrase"
                  />
                }
              />
              <PrivatePassphraseSettings
                {...{
                  onAttemptChangePassphrase,
                  isChangePassPhraseDisabled,
                  changePassphraseRequestAttempt
                }}
              />
            </Group>
          </GroupWrapper>
        )}

        <GroupWrapper>
          <Group>
            <Subtitle
              className={styles.subtitle}
              title={
                <T
                  id="settings.getstartpage.group-title.privacy-and-security"
                  m="Privacy and Security"
                />
              }
            />
            <PrivacySettings
              {...{
                tempSettings,
                onChangeTempSettings
              }}
            />
          </Group>
        </GroupWrapper>
      </Wrapper>

      <ConfirmModal
        show={showConfirmModal}
        modalTitle={<T id="settings.resetNetworkTitle" m="Reset required" />}
        buttonLabel={<T id="settings.save" m="Save" />}
        modalContent={
          <T
            id="settings.resetNetworkContent"
            m="The setting you have chosen to change requires Decrediton to be restarted.  Please confirm this action before proceeding."
          />
        }
        size="large"
        block={false}
        onSubmit={saveSettingsHandler}
        onCancelModal={() => {
          setShowConfirmModal(false);
          resetSettingsState();
        }}
      />
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
