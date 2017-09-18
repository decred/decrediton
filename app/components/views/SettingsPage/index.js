import React, { Component } from "react";
import { autobind } from "core-decorators";
import service from "../../../connectors/service";
import settings from "../../../connectors/settings";
import ErrorScreen from "../../ErrorScreen";
import SettingsPage from "./Page";

@autobind
class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingChangePassphrase: false
    };
  }

  componentWillMount() {
    this.props.onClearChangePassphraseError();
    this.props.onClearChangePassphraseSuccess();
  }

  render() {
    const {
      onShowChangePassphrase,
      onCancelChangePassphrase,
      onAttemptChangePassphrase,
      onChangeNetwork,
      onChangeCurrencyDisplay,
      onSaveSettings
    } = this;

    return !this.props.walletService ? <ErrorScreen /> : (
      <SettingsPage
        {...{
          networks: [{name: "testnet"}, {name: "mainnet"}],
          currencies: [{name: "DCR"}, {name: "atoms"}],
          ...this.props, ...this.state }}
        {...{
          onShowChangePassphrase,
          onCancelChangePassphrase,
          onAttemptChangePassphrase,
          onChangeNetwork,
          onChangeCurrencyDisplay,
          onSaveSettings
        }}
      />
    );
  }

  onShowChangePassphrase() {
    this.setState({ isShowingChangePassphrase: true });
  }

  onAttemptChangePassphrase(oldPass, newPass, priv) {
    const { onAttemptChangePassphrase } = this.props;
    this.onCancelChangePassphrase();
    onAttemptChangePassphrase && onAttemptChangePassphrase(oldPass, newPass, priv);
  }

  onCancelChangePassphrase() {
    this.setState({ isShowingChangePassphrase: false });
  }

  onChangeNetwork(network) {
    const { onChangeTempSettings, tempSettings } = this.props;
    onChangeTempSettings && onChangeTempSettings({ ...tempSettings, network });
  }

  onChangeCurrencyDisplay(currencyDisplay) {
    const { onChangeTempSettings, tempSettings } = this.props;
    onChangeTempSettings && onChangeTempSettings({ ...tempSettings, currencyDisplay });
  }

  onSaveSettings() {
    const { onSaveSettings, tempSettings } = this.props;
    onSaveSettings && onSaveSettings(tempSettings);
  }
}

export default settings(service(Settings));
