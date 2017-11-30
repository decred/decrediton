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
      onShowChangePassphrase,
      onCancelChangePassphrase,
      onAttemptChangePassphrase,
      onSaveSettings
    } = this;

    return !this.props.walletService ? <ErrorScreen /> : (
      <SettingsPage
        {...{
          ...this.props, ...this.state }}
        {...{
          onShowChangePassphrase,
          onCancelChangePassphrase,
          onAttemptChangePassphrase,
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

  onSaveSettings() {
    const { onSaveSettings, tempSettings } = this.props;
    onSaveSettings && onSaveSettings(tempSettings);
  }
}

export default settings(service(Settings));
