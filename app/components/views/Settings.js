// @flow
import React, { Component } from "react";
import { PropTypes } from "prop-types";
import ErrorScreen from "../ErrorScreen";
import KeyBlueButton from "../KeyBlueButton";
import SideBar from "../SideBar";
import Header from "../Header";
import ChangePassphraseModal from "../ChangePassphraseModal";
import { SettingStyles, StakePoolStyles } from "./ViewStyles";

class Settings extends Component{
  static propTypes = {
    walletService: PropTypes.object,
    currencyDisplay: PropTypes.string,
    network: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state = {
      changePassphraseModal: false,
    };
  }
  componentWillMount() {
    this.props.clearChangePassphraseError();
    this.props.clearChangePassphraseSuccess();
  }
  updatePassphrase(oldPass, newPass, priv) {
    this.props.changePassphraseAttempt(oldPass, newPass, priv);
    this.setState({changePassphraseModal: false});
  }
  handleSaveSettingsClick = (settings) => {
    this.props.saveSettings(settings);
  }
  showPassphraseModal() {
    this.setState({changePassphraseModal: true});
  }
  render() {
    const { walletService, currentSettings, settingsChanged, tempSettings, updateStateSettingsChanged } = this.props;
    const { changePassphraseError, changePassphraseSuccess } = this.props;
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
            changePassphraseSuccess !== undefined && changePassphraseSuccess !== "" ?
            <div key="configSuccess"  style={StakePoolStyles.viewNotificationSuccess}><div style={StakePoolStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearChangePassphraseSuccess()}/>{changePassphraseSuccess}</div> :
            <div key="configSuccess" ></div>,
          ]}
          headerTitleOverview="Settings" />
        <div>
          <ChangePassphraseModal
            hidden={!this.state.changePassphraseModal}
            updatePassphrase={(oldPass, newPass, priv) => this.updatePassphrase(oldPass, newPass, priv)}
            cancelPassphrase={()=>this.setState({changePassphraseModal: false})}
            heading={<div></div>}
            description={""}
          />
          <div style={this.state.changePassphraseModal ? SettingStyles.contentBlur : SettingStyles.content}>
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
                  onClick={() => this.showPassphraseModal()}>
                  Update Private Passphrase
                </KeyBlueButton>
            </div>
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
