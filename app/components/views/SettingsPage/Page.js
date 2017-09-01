import React from "react";
import KeyBlueButton from "../../KeyBlueButton";
import SideBar from "../../SideBar";
import Header from "../../Header";
import ChangePassphraseModal from "../../ChangePassphraseModal";
import { SettingStyles, StakePoolStyles } from "../ViewStyles";

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
  <div style={SettingStyles.body}>
    <SideBar />
    <div style={SettingStyles.view}>
      <Header
        headerTop={[
          changePassphraseError ? (
            <div key="updateStakePoolError" style={StakePoolStyles.viewNotificationError}>
              <div
                style={StakePoolStyles.contentNestAddressDeleteIcon}
                onClick={onClearChangePassphraseError}
              />
              {changePassphraseError}
            </div>
          ) : null,
          changePassphraseSuccess ? (
            <div key="configSuccess"  style={StakePoolStyles.viewNotificationSuccess}>
              <div
                style={StakePoolStyles.contentNestAddressDeleteIcon}
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
        <div style={isShowingChangePassphrase ? SettingStyles.contentBlur : SettingStyles.content}>
          <div style={SettingStyles.settingsRow}>
            <div style={SettingStyles.settingsLabel}>
              Displayed Units
            </div>
            <div style={SettingStyles.settingsInput}>
              <select
                style={SettingStyles.settingsInputSelect}
                value={tempSettings.currencyDisplay}
                onChange={(e) => onChangeCurrencyDisplay(e.target.value)}
              >
                <option style={SettingStyles.settingsInputSelectOption} value="DCR">DCR</option>
                <option style={SettingStyles.settingsInputSelectOption} value="atoms">atoms</option>
              </select>
            </div>
          </div>
          <div style={SettingStyles.settingsRow}>
            <div style={SettingStyles.settingsLabel}>
              Network <span style={SettingStyles.restart}>(requires restart!)</span>
            </div>
            <div style={SettingStyles.settingsInput}>
              <select
                style={SettingStyles.settingsInputSelect}
                value={tempSettings.network}
                onChange={(e) => onChangeNetwork(e.target.value)}
              >
                <option style={SettingStyles.settingsInputSelectOption} value="mainnet">mainnet</option>
                <option style={SettingStyles.settingsInputSelectOption} value="testnet">testnet</option>
              </select>
            </div>
          </div>
          <div style={SettingStyles.settingsSaveButton}>
            <KeyBlueButton
              disabled={!areSettingsDirty}
              size="large"
              block={false}
              onClick={onSaveSettings}>
              Save Settings
            </KeyBlueButton>
          </div>
          <div style={SettingStyles.settingsSaveButton}>
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
