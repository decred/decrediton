import Logs from "./Page";
import {getDcrdLogs, getDcrwalletLogs, getDecreditonLogs} from "wallet";
import {logging} from "connectors";

@autobind
class LogsTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    let remoteDcrd = false;
    if (this.props.getCredentials && this.props.getCredentials.rpc_host) {
      remoteDcrd = true;
    }
    return {
      dcrdLogs: null,
      dcrwalletLogs: null,
      decreditonLogs: null,
      remoteDcrd: remoteDcrd,
    };
  }

  render() {
    const {showDecreditonLogs, showDcrdLogs, showDcrwalletLogs,
      hideDecreditonLogs, hideDcrdLogs, hideDcrwalletLogs
    } = this;
    const {
      dcrdLogs, dcrwalletLogs, decreditonLogs, remoteDcrd
    } = this.state;
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
          decreditonLogs,
          remoteDcrd }}
      />
    );
  }

  showDecreditonLogs() {
    getDecreditonLogs()
    .then(logs => {
      this.setState({decreditonLogs: Buffer.from(logs).toString("utf8")});
    })
    .catch(err => console.error(err));
  }

  hideDecreditonLogs() {
    this.setState({decreditonLogs: null});
  }

  showDcrdLogs() {
    getDcrdLogs()
    .then(logs => {
      this.setState({dcrdLogs: Buffer.from(logs).toString("utf8")});
    })
    .catch(err => console.error(err));
  }

  hideDcrdLogs() {
    this.setState({dcrdLogs: null});
  }

  showDcrwalletLogs() {
    getDcrwalletLogs()
    .then(logs => {
      this.setState({dcrwalletLogs: Buffer.from(logs).toString("utf8")});
    })
    .catch(err => console.error(err));
  }

  hideDcrwalletLogs() {
    this.setState({dcrwalletLogs: null});
  }
}

export default logging(LogsTab);
