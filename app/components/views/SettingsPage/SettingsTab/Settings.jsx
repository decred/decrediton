import { useCallback } from "react";
import { DEFAULT_DARK_THEME_NAME, DEFAULT_LIGHT_THEME_NAME } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import { KeyBlueButton, ResetNetworkButton } from "buttons";
import {
  NetworkSettings,
  ProxySettings,
  PrivacySettings,
  UISettings,
  MiscSettings,
  TimezoneSettings
} from "./groups";
import { Subtitle } from "shared";
import styles from "./Settings.module.css";
import * as configConstants from "constants/config";
import { wallet } from "wallet-preload-shim";
import { Wrapper, Group, ColumnWrapper, Column } from "./helpers";

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
  setThemeName
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

  return (
    <>
      <Wrapper>
        <Group>
          <Subtitle
            title={
              <T
                id="settings.getstartpage.group-title.connectivity"
                m="Connectivity"
              />
            }
          />
          <ColumnWrapper>
            <Column>
              <NetworkSettings
                {...{
                  tempSettings,
                  onChangeTempSettings
                }}
              />
            </Column>
            <Column>
              <ProxySettings {...{ tempSettings, onChangeTempSettings }} />
            </Column>
          </ColumnWrapper>
        </Group>

        <Group className={styles.general}>
          <Subtitle
            title={
              <T id="settings.getstartpage.group-title.general" m="General" />
            }
          />
          <ColumnWrapper>
            <Column>
              <UISettings
                {...{ tempSettings, locales, onChangeTempSettings }}
              />
            </Column>
            <Column className={styles.timezone}>
              <TimezoneSettings {...{ tempSettings, onChangeTempSettings }} />
            </Column>
            {walletReady && (
              <Column>
                <MiscSettings
                  {...{
                    tempSettings,
                    currencies,
                    walletReady,
                    onChangeTempSettings
                  }}
                />
              </Column>
            )}
          </ColumnWrapper>
        </Group>

        <Group className={styles.privacy}>
          <Subtitle
            title={
              <T
                id="settings.getstartpage.group-title.privacy-and-security"
                m="Privacy and Security"
              />
            }
          />
          <ColumnWrapper>
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
          </ColumnWrapper>
        </Group>
      </Wrapper>

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
