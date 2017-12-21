import Logs from "./Page";
import {getDcrdLogs, getDcrwalletLogs, getDecreditonLogs} from "wallet";

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
    getDecreditonLogs()
    .then(logs => {
      this.setState({decreditonLogs: logs});
    })
    .catch(err => console.error(err));
  }

  hideDecreditonLogs() {
    this.setState({decreditonLogs: null});
  }

  showDcrdLogs() {
    getDcrdLogs()
    .then(logs => {
      this.setState({dcrdLogs: logs});
    })
    .catch(err => console.error(err));
  }

  hideDcrdLogs() {
    this.setState({dcrdLogs: null});
  }

  showDcrwalletLogs() {
    getDcrwalletLogs()
    .then(logs => {
      console.log("herere");
      console.log(typeof(logs));
      var dcrwalletLogs = Buffer.from(logs).toString("utf8");
      this.setState({dcrwalletLogs});
    })
    .catch(err => console.error(err));
  }

  hideDcrwalletLogs() {
    this.setState({dcrwalletLogs: null});
  }
}

export default LogsTab;
