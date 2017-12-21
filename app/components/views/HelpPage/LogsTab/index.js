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
    var logs = this.props.getDecreditonLogs();
    this.setState({decreditonLogs: logs});
  }

  hideDecreditonLogs() {
    this.setState({decreditonLogs: null});
  }

  showDcrdLogs() {
    var logs = this.props.getDcrdLogs();
    this.setState({decreditonLogs: logs});
  }

  hideDcrdLogs() {
    this.setState({dcrdLogs: null});
  }

  showDcrwalletLogs() {
    var logs = this.props.getDcrwalletLogs();
    this.setState({decreditonLogs: logs});
  }

  hideDcrwalletLogs() {
    this.setState({dcrwalletLogs: null});
  }
}

export default LogsTab;
