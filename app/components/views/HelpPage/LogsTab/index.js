import Logs from "./Page";
import { getDcrdLogs, getDcrwalletLogs, getDecreditonLogs } from "wallet";
import { logging } from "connectors";
import { DescriptionHeader } from "layout";
import { FormattedMessage as T } from "react-intl";

export const LogsTabHeader = () =>
  <DescriptionHeader
    description={<T id="help.description.logs" m="Please find your current logs below to look for any issue or error you are having." />}
  />;
@autobind
class LogsTabBody extends React.Component {
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
    const { showDecreditonLogs, showDcrdLogs, showDcrwalletLogs,
      hideDecreditonLogs, hideDcrdLogs, hideDcrwalletLogs
    } = this;
    const { isDaemonRemote, isDaemonStarted } = this.props;
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
          decreditonLogs,
          isDaemonRemote,
          isDaemonStarted
        }}
      />
    );
  }

  showDecreditonLogs() {
    getDecreditonLogs()
      .then(logs => {
        this.setState({ decreditonLogs: Buffer.from(logs).toString("utf8") });
      })
      .catch(err => console.error(err));
  }

  hideDecreditonLogs() {
    this.setState({ decreditonLogs: null });
  }

  showDcrdLogs() {
    getDcrdLogs()
      .then(logs => {
        this.setState({ dcrdLogs: Buffer.from(logs).toString("utf8") });
      })
      .catch(err => console.error(err));
  }

  hideDcrdLogs() {
    this.setState({ dcrdLogs: null });
  }

  showDcrwalletLogs() {
    getDcrwalletLogs()
      .then(logs => {
        this.setState({ dcrwalletLogs: Buffer.from(logs).toString("utf8") });
      })
      .catch(err => console.error(err));
  }

  hideDcrwalletLogs() {
    this.setState({ dcrwalletLogs: null });
  }
}

export const LogsTab = logging(LogsTabBody);
