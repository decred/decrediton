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
    console.log(typeof(showDcrdLogs));
    return (
      <Logs
        {...{
          ...this.props, ...this.state }}
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
    this.setState({decreditonLogs: getLogFile("/home/user/.config/decrediton/decrediton.log")});
  }

  hideDecreditonLogs() {
    this.setState({decreditonLogs: null});
  }

  showDcrdLogs() {
    const { dcrdLogPath } = this.props;
    this.setState({decreditonLogs: getLogFile("/home/user/.dcrd/logs/testnet2/dcrd.log")});
  }

  hideDcrdLogs() {
    this.setState({dcrdLogs: null});
  }

  showDcrwalletLogs() {
    const { dcrwalletLogPath } = this.props;
    this.setState({decreditonLogs: getLogFile("/home/user/.config/decrediton/logs/testnet2/dcrwallet.log")});
  }

  hideDcrwalletLogs() {
    this.setState({dcrwalletLogs: null});
  }
}

export default LogsTab;
