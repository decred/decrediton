import { useCallback } from "react";
import { useTheme } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import { StandaloneHeader, StandalonePage } from "layout";
import {
  KeyBlueButton,
  CloseWalletModalButton,
  ResetNetworkButton
} from "buttons";
import { getGlobalCfg } from "config";
import NetworkSettings from "./NetworkSettings";
import ProxySettings from "./ProxySettings";
import PrivacySettings from "./PrivacySettings";
import UISettings from "./UISettings";
import MiscSettings from "./MiscSettings";
import TimezoneSettings from "./TimezoneSettings";
import "style/StakePool.less";
import "style/Settings.less";
import * as configConstants from "constants/config";

const closeWalletModalContent = (walletName) => (
  <T
    id="settings.closeWalletModalContent"
    m="Are you sure you want to close {walletName} and return to the launcher?"
    values={{ walletName }}
  />
);

const closeWalletWithAutobuyerModal = (walletName) => (
  <T
    id="settings.closeWalletModalWithAutobuyerModal"
    m="Are you sure you want to close {walletName} and return to the launcher? The auto ticket buyer is still running. If you proceed, it will be closed and no more tickets will be purchased."
    values={{ walletName }}
  />
);

const SettingsPageHeader = ({
  onCloseWallet,
  walletName,
  isTicketAutoBuyerEnabled
}) => (
  <StandaloneHeader
    title={<T id="settings.title" m="Settings" />}
    iconClassName="settings"
    description={
      <T
        id="settings.description"
        m="Changing network settings requires a restart"
      />
    }
    actionButton={
      <CloseWalletModalButton
        modalTitle={
          <T id="settings.closeWalletModalTitle" m="Confirmation Required" />
        }
        buttonLabel={<T id="settings.closeWalletModalOk" m="Close Wallet" />}
        modalContent={
          isTicketAutoBuyerEnabled
            ? closeWalletWithAutobuyerModal(walletName)
            : closeWalletModalContent(walletName)
        }
        onSubmit={onCloseWallet}
      />
    }
  />
);

const SettingsPage = ({
  areSettingsDirty,
  tempSettings,
  currencies,
  locales,
  onChangeTempSettings,
  onSaveSettings,
  onAttemptChangePassphrase,
  onCloseWallet,
  isChangePassPhraseDisabled,
  changePassphraseRequestAttempt,
  needNetworkReset,
  walletName,
  walletReady,
  isTicketAutoBuyerEnabled
}) => {
  const { setThemeName } = useTheme();
  const saveSettingsHandler = useCallback(() => {
    const config = getGlobalCfg();
    const oldTheme = config.get(configConstants.THEME);
    if (oldTheme != tempSettings.theme) {
      setThemeName(tempSettings.theme);
    }
    onSaveSettings(tempSettings);
  }, [onSaveSettings, tempSettings, setThemeName]);

  return (
    <StandalonePage
      header={
        <SettingsPageHeader
          {...{ onCloseWallet, walletName, isTicketAutoBuyerEnabled }}
        />
      }
      className="settings-standalone-page">
      <div className="settings-wrapper">
        <div className="settings-group">
          <div className="settings-group-title">
            <T
              id="settings.getstartpage.group-title.connectivity"
              m="Connectivity"
            />
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
            <T id="settings.getstartpage.group-title.general" m="General" />
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
            {walletReady && (
              <div className="settings-column">
                <MiscSettings
                  {...{
                    tempSettings,
                    currencies,
                    walletReady,
                    onChangeTempSettings
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="settings-group privacy">
          <div className="settings-group-title">
            <T
              id="settings.getstartpage.group-title.privacy-and-security"
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

      <div className="settings-save-button-wrapper">
        <div className="settings-save-button">
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
    </StandalonePage>
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
