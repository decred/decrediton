
import React from "react";
import KeyBlueButton from "../../KeyBlueButton";
import SideBar from "../../SideBar";
import Header from "../../Header";
import ChangePassphraseModal from "../../ChangePassphraseModal";
import "../../../style/StakePool.less";
import "../../../style/Settings.less";

const SettingsPage = ({
  changePassphraseError,
  changePassphraseSuccess,
  areSettingsDirty,
  tempSettings,
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
  <div className="settings-body">
    <SideBar />
    <div className="settings-view">
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
        <div className={isShowingChangePassphrase ? "settings-content-blur" : "settings-content"}>
          <div className="settings-row">
            <div className="settings-label">
              Displayed Units
            </div>
            <div className="settings-input">
              <select
                className="settings-input-select"
                value={tempSettings.currencyDisplay}
                onChange={(e) => onChangeCurrencyDisplay(e.target.value)}
              >
                <option className="settings-input-select-option" value="DCR">DCR</option>
                <option className="settings-input-select-option" value="atoms">atoms</option>
              </select>
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-label">
              Network <span className="settings-restart">(requires restart!)</span>
            </div>
            <div className="settings-input">
              <select
                className="settings-input-select"
                value={tempSettings.network}
                onChange={(e) => onChangeNetwork(e.target.value)}
              >
                <option className="settings-input-select-option" value="mainnet">mainnet</option>
                <option className="settings-input-select-option" value="testnet">testnet</option>
              </select>
            </div>
          </div>
          <div className="settings-save-button">
            <KeyBlueButton
              disabled={!areSettingsDirty}
              size="large"
              block={false}
              onClick={onSaveSettings}>
              Save Settings
            </KeyBlueButton>
          </div>
          <div className="settings-save-button">
              <KeyBlueButton
                onClick={onShowChangePassphrase}>
                Update Private Passphrase
              </KeyBlueButton>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SettingsPage;
