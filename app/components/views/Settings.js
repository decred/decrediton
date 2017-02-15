// @flow
import React, { Component, PropTypes } from 'react';
import ErrorScreen from '../ErrorScreen';
import Button from '../ButtonTanel';
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
  }
};

class Settings extends Component{
  static propTypes = {
    walletService: PropTypes.object,
    currencyDisplay: PropTypes.string
  };
  handleSaveSettingsClick = (settings) => {
    this.props.saveSettings(settings);
  }
  //handleCurrencyChange
  render() {
    const { walletService, currentSettings, settingsChanged, tempSettings, updateStateSettingsChanged } = this.props;
    var settings = {
      currencyDisplay: tempSettings.currencyDisplay,
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
          <Button
            style={styles.saveSettingsButton}
            disabled={!settingsChanged}
            size="large"
            block={false}
            onClick={() => this.handleSaveSettingsClick(tempSettings)}>
            Save Settings
          </Button>
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
