// @flow
import React, { Component, PropTypes } from 'react';
import ErrorScreen from '../ErrorScreen';
import KeyBlueButton from '../KeyBlueButton';
import SideBar from '../SideBar';
import Header from '../Header';
import { SettingStyles } from './ViewStyles';

class Settings extends Component{
  static propTypes = {
    walletService: PropTypes.object,
    currencyDisplay: PropTypes.string,
    network: PropTypes.string,
  };
  handleSaveSettingsClick = (settings) => {
    this.props.saveSettings(settings);
  }

  render() {
    const { walletService, currentSettings, settingsChanged, tempSettings, updateStateSettingsChanged } = this.props;
    const { changePassphraseError, changePassphraseResponse } = this.props;
    var settings = {
      currencyDisplay: tempSettings.currencyDisplay,
      network: tempSettings.network,
    };
    const settingsView = (
      <div style={SettingStyles.view}> 
        <Header
          headerTop={
          [
            changePassphraseError !== null ?
            <div key="updateStakePoolError" style={StakePoolStyles.viewNotificationError}><div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearChangePassphraseError()}/>{changePassphraseError}</div> :
            <div key="updateStakePoolError" ></div>,
            changePassphraseSuccess !== undefined && changePassphraseSuccess !== '' ?
            <div key="configSuccess"  style={StakePoolStyles.viewNotificationSuccess}><div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearChangePassphraseSuccess()}/>{changePassphraseSuccess}</div> :
            <div key="configSuccess" ></div>,
          ]}
          headerTitleOverview="Settings" />
        <div style={SettingStyles.content}>
          <div style={SettingStyles.settingsRow}>
            <div style={SettingStyles.settingsLabel}>
              Displayed Units
            </div>
            <div style={SettingStyles.settingsInput}>
              <select
                style={SettingStyles.settingsInputSelect}
                defaultValue={currentSettings.currencyDisplay}
                onChange={(e) => {
                  settings.currencyDisplay = e.target.value;
                  updateStateSettingsChanged(settings);
                }}>
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
                defaultValue={currentSettings.network}
                onChange={(e) => {
                  settings.network = e.target.value;
                  updateStateSettingsChanged(settings);
                }}>
                <option style={SettingStyles.settingsInputSelectOption} value="mainnet">mainnet</option>
                <option style={SettingStyles.settingsInputSelectOption} value="testnet">testnet</option>
              </select>
            </div>
          </div>
          <div style={SettingStyles.settingsSaveButton}>
            <KeyBlueButton
              disabled={!settingsChanged}
              size="large"
              block={false}
              onClick={settingsChanged ? () => this.handleSaveSettingsClick(tempSettings): null}>
              Save Settings
            </KeyBlueButton>
          </div>
          <div style={SettingStyles.settingsSaveButton}>
              <KeyBlueButton
                onClick={settingsChanged ? () => this.handleSaveSettingsClick(tempSettings): null}>
                Update Private Passphrase
              </KeyBlueButton>
          </div>
        </div>
      </div>
    );
    if (walletService === null) {
      return (<ErrorScreen />);
    } else {
      return(
        <div style={SettingStyles.body}>
          <SideBar />
          {settingsView}
        </div>);
    }
  }
}

export default Settings;
