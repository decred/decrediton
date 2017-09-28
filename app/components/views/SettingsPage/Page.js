
import React from "react";
import KeyBlueButton from "../../KeyBlueButton";
import { FormattedMessage } from "react-intl";
import SideBar from "../../SideBar";
import Header from "../../Header";
import ChangePassphraseModal from "../../ChangePassphraseModal";
import Select from "react-select";
import "../../../style/Layout.less";
import "../../../style/StakePool.less";
import "../../../style/Settings.less";

const SettingsPage = ({
  changePassphraseError,
  changePassphraseSuccess,
  areSettingsDirty,
  tempSettings,
  networks,
  currencies,
  locales,
  isShowingChangePassphrase,
  onShowChangePassphrase,
  onCancelChangePassphrase,
  onAttemptChangePassphrase,
  onChangeCurrencyDisplay,
  onChangeNetwork,
  onChangeLocale,
  onSaveSettings,
  onClearChangePassphraseSuccess,
  onClearChangePassphraseError
}) => (
  <div className="page-body">
    <SideBar />
    <div className="page-view">
      <Header
        headerTop={[
          changePassphraseError ? (
            <div key="updateStakePoolError" className="stakepool-view-notification-error">
              <div
                className="stakepool-content-nest-address-delete-icon"
                onClick={onClearChangePassphraseError}
              />
              {changePassphraseError}
            </div>
          ) : null,
          changePassphraseSuccess ? (
            <div key="configSuccess"  className="stakepool-view-notification-success">
              <div
                className="stakepool-content-nest-address-delete-icon"
                onClick={onClearChangePassphraseSuccess}
              />
              {changePassphraseSuccess}
            </div>
          ) : null
        ]}
        headerTitleOverview="Settings" />
      <div>
        <ChangePassphraseModal
          hidden={!isShowingChangePassphrase}
          updatePassphrase={onAttemptChangePassphrase}
          cancelPassphrase={onCancelChangePassphrase}
        />
        <div className={isShowingChangePassphrase ? "page-content-blur" : "page-content"}>

          <div className="settings-row">
            <div className="settings-label">
              <FormattedMessage id="settings.locale" defaultMessage="Locale" />
            </div>
            <div className="settings-input">

              <Select
                value={tempSettings.locale}
                onChange={(newLocale) => onChangeLocale(newLocale.key)}
                clearable={false}
                multi={false}
                valueKey="key" labelKey="description"
                options={locales}
              />
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-label">
              <FormattedMessage id="settings.displayedUnits" defaultMessage="Displayed Units" />
            </div>
            <div className="settings-input">

              <Select
                value={tempSettings.currencyDisplay}
                onChange={(newCurrency) => onChangeCurrencyDisplay(newCurrency.name)}
                clearable={false}
                multi={false}
                valueKey="name" labelKey="name"
                options={currencies}
              />
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-label">
              <FormattedMessage id="settings.network"
                defaultMessage="Network" />
               <span className="settings-restart"> (
                 <FormattedMessage id="settings.requiresRestart" defaultMessage="requires restart" />
                )</span>
            </div>
            <div className="settings-input">

              <Select
                value={tempSettings.network}
                onChange={(newNet) => onChangeNetwork(newNet.name)}
                clearable={false}
                multi={false}
                valueKey="name" labelKey="name"
                options={networks}
              />
            </div>
          </div>
          <div className="settings-action-buttons">
            <div className="settings-save-button">
              <KeyBlueButton
                disabled={!areSettingsDirty}
                size="large"
                block={false}
                onClick={onSaveSettings}>
                <FormattedMessage id="settings.save" defaultMessage="Save Settings" />
              </KeyBlueButton>
            </div>
            <div className="settings-update-passphrase-button">
                <KeyBlueButton
                  onClick={onShowChangePassphrase}>
                  <FormattedMessage id="settings.updatePrivatePassphrase" defaultMessage="Update Private Passphrase" />
                </KeyBlueButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SettingsPage;
