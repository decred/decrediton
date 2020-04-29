import { daemonStartup, settings } from "connectors";
import Page from "./Page";

@autobind
class PrivacyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showCustomPrivacy: false };
  }

  toggleCustomPrivacy() {
    this.setState({ showCustomPrivacy: !this.state.showCustomPrivacy });
  }

  acceptCustomPrivacy() {
    this.props.onSaveSettings(this.props.tempSettings);
    this.props.finishPrivacy();
  }

  render() {
    const { acceptCustomPrivacy, toggleCustomPrivacy } = this;
    return (
      <Page
        {...{
          ...this.props,
          ...this.state,
          acceptCustomPrivacy,
          toggleCustomPrivacy
        }}
      />
    );
  }
}

export default daemonStartup(settings(PrivacyPage));
