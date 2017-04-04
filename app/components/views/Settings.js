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
    var settings = {
      currencyDisplay: tempSettings.currencyDisplay,
      network: tempSettings.network,
    };
    const settingsView = (
      <div style={SettingStyles.view}>
        <Header headerTitleOverview="Settings" />
        <div style={SettingStyles.content}>
          <div style={SettingStyles.label}>
            Displayed Units
          </div>
          <select defaultValue={currentSettings.currencyDisplay}
            onChange={(e) => {
              settings.currencyDisplay = e.target.value;
              updateStateSettingsChanged(settings);
            }}>
            <option value="DCR">DCR</option>
            <option value="atoms">atoms</option>
          </select>

          <div style={SettingStyles.label}>
            Network <span style={SettingStyles.restart}>(requires restart!)</span>
          </div>
          <select defaultValue={currentSettings.network}
            onChange={(e) => {
              settings.network = e.target.value;
              updateStateSettingsChanged(settings);
            }}>
            <option value="mainnet">mainnet</option>
            <option value="testnet">testnet</option>
          </select>

          <KeyBlueButton
            style={SettingStyles.saveSettingsButton}
            disabled={!settingsChanged}
            size="large"
            block={false}
            onClick={() => this.handleSaveSettingsClick(tempSettings)}>
            Save Settings
          </KeyBlueButton>
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
