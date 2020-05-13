import { daemonStartup, settings } from "connectors";
import Page from "./Page";

@autobind
class SpvChoicePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <Page {...this.props} {...this.state} />;
  }
}

export default daemonStartup(settings(SpvChoicePage));
