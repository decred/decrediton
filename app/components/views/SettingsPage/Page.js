
import React from "react";
import KeyBlueButton from "../../KeyBlueButton";
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
  isShowingChangePassphrase,
  onShowChangePassphrase,
  onCancelChangePassphrase,
  onAttemptChangePassphrase,
  onChangeCurrencyDisplay,
  onChangeNetwork,
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
              Displayed Units
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
              Network <span className="settings-restart">(requires restart!)</span>
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
                Save Settings
              </KeyBlueButton>
            </div>
            <div className="settings-update-passphrase-button">
                <KeyBlueButton
                  onClick={onShowChangePassphrase}>
                  Update Private Passphrase
                </KeyBlueButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SettingsPage;
