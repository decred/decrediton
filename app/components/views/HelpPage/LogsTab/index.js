import Logs from "./Page";
import { getLogFile } from "helpers";

@autobind
class LogsTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      dcrdLogs: null,
      dcrwalletLogs: null,
      decreditonLogs: null,
    };
  }

  render() {
    const {showDecreditonLogs, showDcrdLogs, showDcrwalletLogs,
      hideDecreditonLogs, hideDcrdLogs, hideDcrwalletLogs
    } = this;
    const {
      dcrdLogs, dcrwalletLogs, decreditonLogs
    } = this.state;
    return (
      <Logs
        {...{
          showDecreditonLogs,
          showDcrdLogs,
          showDcrwalletLogs,
          hideDecreditonLogs,
          hideDcrdLogs,
          hideDcrwalletLogs,
          dcrdLogs,
          dcrwalletLogs,
          decreditonLogs }}
      />
    );
  }

  showDecreditonLogs() {
    const { decreditonLogPath } = this.props;
    this.setState({decreditonLogs: getLogFile(decreditonLogPath)});
  }

  hideDecreditonLogs() {
    this.setState({decreditonLogs: null});
  }

  showDcrdLogs() {
    const { dcrdLogPath } = this.props;
    this.setState({decreditonLogs: getLogFile(dcrdLogPath)});
  }

  hideDcrdLogs() {
    this.setState({dcrdLogs: null});
  }

  showDcrwalletLogs() {
    const { dcrwalletLogPath } = this.props;
    this.setState({decreditonLogs: getLogFile(dcrwalletLogPath)});
  }

  hideDcrwalletLogs() {
    this.setState({dcrwalletLogs: null});
  }
}

export default LogsTab;
