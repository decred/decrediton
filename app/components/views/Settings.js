// @flow
import React, { Component, PropTypes } from 'react';
import ErrorScreen from '../ErrorScreen';
import KeyBlueButton from '../KeyBlueButton';
import SideBar from '../SideBar';
import Header from '../Header';

const styles = {
  body: {
    position: 'fixed',
    left: '0px',
    top: '50%',
    right: '0px',
    display: 'block',
    overflow: 'hidden',
    width: '1178px',
    height: '770px',
    marginTop: '-385px',
    marginRight: 'auto',
    marginLeft: 'auto',
    backgroundColor: '#FFF',
  },
  view: {
    width: '880px',
    height: '100%',
    float: 'right',
    backgroundColor: '#f3f6f6',
  },
  content: {
    overflow: 'auto',
    height: '556px',
    padding: '54px 60px 54px 80px',
  },
  saveSettingsButton: {
    float: 'right',
  },
  restart: {
    fontWeight: 'bold',
  }
};

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
      <div style={styles.view}>
        <Header headerTitleOverview="Settings" />
        <div style={styles.content}>
          <div style={styles.label}>
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

          <div style={styles.label}>
            Network <span style={styles.restart}>(requires restart!)</span>
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
            style={styles.saveSettingsButton}
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
        <div style={styles.body}>
          <SideBar />
          {settingsView}
        </div>);
    }
  }
}

export default Settings;
