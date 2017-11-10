import { service, settings } from "connectors";
import ErrorScreen from "../../ErrorScreen";
import SettingsPage from "./Page";

@autobind
class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingChangePassphrase: false
    };
  }

  render() {
    const {
      locales,
      onShowChangePassphrase,
      onCancelChangePassphrase,
      onAttemptChangePassphrase,
      onChangeNetwork,
      onChangeCurrencyDisplay,
      onChangeLocale,
      onSaveSettings
    } = this;

    return !this.props.walletService ? <ErrorScreen /> : (
      <SettingsPage
        {...{
          networks: [{name: "testnet"}, {name: "mainnet"}],
          currencies: [{name: "DCR"}, {name: "atoms"}],
          locales: locales,
          ...this.props, ...this.state }}
        {...{
          onShowChangePassphrase,
          onCancelChangePassphrase,
          onAttemptChangePassphrase,
          onChangeNetwork,
          onChangeCurrencyDisplay,
          onChangeLocale,
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

  onChangeLocale(locale) {
    const { onChangeTempSettings, tempSettings } = this.props;
    onChangeTempSettings && onChangeTempSettings({ ...tempSettings, locale });
  }

  onSaveSettings() {
    const { onSaveSettings, tempSettings } = this.props;
    onSaveSettings && onSaveSettings(tempSettings);
  }
}

export default settings(service(Settings));
