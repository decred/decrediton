import { walletStartup, settings } from "connectors";
import Page from "./Page";

@autobind
class PrivacyPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = { showCustomPrivacy: false };
  }

  setupCustomPrivacy() {
    this.setState({ showCustomPrivacy: true });
  }

  cancelCustomPrivacy() {
    this.setState({ showCustomPrivacy: false });
  }

  acceptCustomPrivacy() {
    this.props.onSaveSettings(this.props.tempSettings);
    this.props.finishPrivacy();
  }

  render() {
    const { setupCustomPrivacy, cancelCustomPrivacy, acceptCustomPrivacy } = this;
    return <Page
      {...this.props}
      {...this.state}
      setupCustomPrivacy={setupCustomPrivacy}
      cancelCustomPrivacy={cancelCustomPrivacy}
      acceptCustomPrivacy={acceptCustomPrivacy}
    />;
  }
}

export default walletStartup(settings(PrivacyPage));
