import { FormattedMessage as T } from "react-intl";
import { StandaloneHeader, StandalonePage } from "layout";
import { ChangePassphraseButton, KeyBlueButton, CloseWalletModalButton, ResetNetworkButton } from "buttons";
import { WatchOnlyWarnNotification } from "shared";
import GeneralSettings from "./GeneralSettings";
import PrivacySettings from "./PrivacySettings";
import ProxySettings from "./ProxySettings";
import TimezoneSettings from "./TimezoneSettings";
import "style/StakePool.less";
import "style/Settings.less";
import UIThemeSettings from "./UIThemeSettings";

const closeWalletModalContent = (walletName) =>
  <T
    id="settings.closeWalletModalContent"
    m="Are you sure you want to close {walletName} and return to the launcher?"
    values={{ walletName }}
  />;

const closeWalletWithAutobuyerModal = (walletName) =>
  <T
    id="settings.closeWalletModalWithAutobuyerModal"
    m="Are you sure you want to close {walletName} and return to the launcher? The auto ticket buyer is still running. If you proceed, it will be closed and no more tickets will be purchased."
    values={{ walletName }}
  />;

const SettingsPageHeader = ({ onCloseWallet, walletName, isTicketAutoBuyerEnabled }) =>
  <StandaloneHeader
    title={<T id="settings.title" m="Settings"/>}
    iconClassName="settings"
    description={<T id="settings.description" m="Changing network settings requires a restart"/>}
    actionButton={
      <CloseWalletModalButton
        modalTitle={<T id="settings.closeWalletModalTitle" m="Confirmation Required" />}
        buttonLabel={<T id="settings.closeWalletModalOk" m="Close Wallet" />}
        modalContent={ isTicketAutoBuyerEnabled ? closeWalletWithAutobuyerModal(walletName) : closeWalletModalContent(walletName) }
        onSubmit={onCloseWallet}/>}
  />;

const SettingsPage = ({
  areSettingsDirty,
  tempSettings,
  networks,
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
}) => (
  <StandalonePage header={<SettingsPageHeader {...{ onCloseWallet, walletName, isTicketAutoBuyerEnabled }} />} className="settings-standalone-page">
    <div className="settings-wrapper">
      <div className="settings-columns">
        <GeneralSettings {...{ tempSettings, networks, currencies, locales, walletReady,
          onChangeTempSettings }} />
        <ProxySettings {...{ tempSettings, onChangeTempSettings }} />
        <UIThemeSettings {...{ tempSettings, onChangeTempSettings }} />
      </div>
      <div className="settings-columns">
        <div className="settings-security">
          <div className="settings-column-title"><T id="settings.security.title" m="Security" /></div>
          <div className="settings-action-buttons">
            <div disabled={isChangePassPhraseDisabled} className="settings-update-passphrase-button">
              <T id="settings.updatePrivatePassphrase" m="Update Private Passphrase" />
              <WatchOnlyWarnNotification isActive={ isChangePassPhraseDisabled }>
                <ChangePassphraseButton
                  className={[
                    isChangePassPhraseDisabled ? "change-password-disabled-icon" : "",
                    changePassphraseRequestAttempt ? "change-password-loading" : "" ].join(" ")}
                  isDisabled={isChangePassPhraseDisabled}
                  modalTitle={<T id="settings.changeConfirmation" m="Change your passphrase" />}
                  onSubmit={onAttemptChangePassphrase} />
              </WatchOnlyWarnNotification>
            </div>
          </div>
        </div>
        <PrivacySettings {...{ tempSettings, onChangeTempSettings }} />
        <TimezoneSettings {...{ tempSettings, onChangeTempSettings }} />
      </div>
    </div>

    <div className="settings-save-button-wrapper">
      <div className="settings-save-button">
        {needNetworkReset ?
          <ResetNetworkButton
            modalTitle={<T id="settings.resetNetworkTitle" m="Reset required" />}
            buttonLabel={<T id="settings.save" m="Save" />}
            modalContent={
              <T id="settings.resetNetworkContent" m="The setting you have chosen to change requires Decrediton to be restarted.  Please confirm this action before proceeding."/>}
            disabled={!areSettingsDirty}
            size="large"
            block={false}
            onSubmit={onSaveSettings}/>:
          <KeyBlueButton
            disabled={!areSettingsDirty}
            size="large"
            block={false}
            onClick={onSaveSettings}>
            <T id="settings.save" m="Save" />
          </KeyBlueButton>
        }
      </div>
    </div>
  </StandalonePage>
);

SettingsPage.propTypes = {
  areSettingsDirty: PropTypes.bool.isRequired,
  tempSettings: PropTypes.object.isRequired,
  networks: PropTypes.array.isRequired,
  currencies: PropTypes.array.isRequired,
  locales: PropTypes.array,
  onChangeTempSettings: PropTypes.func.isRequired,
  onSaveSettings: PropTypes.func.isRequired,
  onAttemptChangePassphrase: PropTypes.func,
  isChangePassPhraseDisabled: PropTypes.bool.isRequired
};

export default SettingsPage;
