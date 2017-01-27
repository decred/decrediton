// @flow
import React, { Component, PropTypes } from 'react';
import ErrorScreen from './ErrorScreen';
import Button from './ButtonTanel';
import SideBar from './SideBar';
import qr from 'qr-image';

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
  header: {
    paddingRight: '80px',
    paddingLeft: '100px',
    backgroundColor: '#fff',
  },
  headerTop: {
    height: '106px',
    paddingBottom: '20px',
  },
  headerTitleOverview: {
    height: '54px',
    paddingTop: '13px',
    color: '#596d81',
    fontSize: '27px',
  },
  headerMetaOverview: {
    height: '54px',
    paddingTop: '5px',
    fontFamily: 'Inconsolata, monospace',
    fontSize: '53px',
  },
  content: {
    overflow: 'auto',
    height: '556px',
    padding: '54px 60px 54px 80px',
  },
};

class Settings extends Component{
  static propTypes = {
    walletService: PropTypes.object,
    currencyDisplay: PropTypes.string
  };
  handleSaveSettingsClick = (settings) => {
    console.log(this.props.currentSettings);
    console.log(settings);
    console.log(settings === this.props.currentSettings);
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
        <div style={styles.header}>
          <div style={styles.headerTop}></div>
          <div style={styles.headerTitleOverview}>Settings</div>
          <div style={styles.headerMetaOverview}>
          </div>
        </div>
        <div style={styles.content}>
          <select defaultValue={currentSettings.currencyDisplay}
            onChange={(e) => {
              settings.currencyDisplay = e.target.value;
              console.log(settings);
              this.props.updateStateSettingsChanged(settings);
            }}>
            <option value="DCR">DCR</option>
            <option value="atoms">atoms</option>
          </select>
          <Button
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
