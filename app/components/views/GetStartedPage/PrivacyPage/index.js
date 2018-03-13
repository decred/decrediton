import { walletStartup } from "connectors";
import Page from "./Page";

class PrivacyPage extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return <Page
      {...this.props}
      {...this.state}
    />;
  }
}

export default walletStartup(PrivacyPage);
