import Logs from "./Page";
import { getDcrdLogs, getDcrwalletLogs } from "wallet";
import { logging } from "connectors";
import { DescriptionHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import ReactTimeout from "react-timeout";

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

  componentDidMount() {
    const interval = this.props.setInterval(() => {
      Promise
        .all([ getDcrdLogs(), getDcrwalletLogs() ])
        .then(([ rawDcrdLogs, rawDcrwalletLogs ]) => {
          const dcrdLogs = Buffer.from(rawDcrdLogs).toString("utf8");
          const dcrwalletLogs = Buffer.from(rawDcrwalletLogs).toString("utf8");
          if ( dcrdLogs !== this.state.dcrdLogs )
            this.setState({ dcrdLogs });
          if ( dcrwalletLogs !== this.state.dcrwalletLogs )
            this.setState({ dcrwalletLogs });
        });
    }, 2000);
    this.setState({ interval });
  }

  componentWillUnmount() {
    this.props.clearInterval(this.state.interval);
  }

  getInitialState() {
    return {
      interval: null,
      dcrdLogs: "",
      dcrwalletLogs: "",
      decreditonLogs: null,
      showDcrdLogs: false,
      showDcrwalletLogs: false,
      showDecreditonLogs: false
    };
  }

  render() {
    const { onShowDecreditonLogs, onShowDcrdLogs, onShowDcrwalletLogs,
      onHideDecreditonLogs, onHideDcrdLogs, onHideDcrwalletLogs
    } = this;
    const { isDaemonRemote, isDaemonStarted } = this.props;
    const {
      dcrdLogs, dcrwalletLogs, decreditonLogs, showDcrdLogs, showDcrwalletLogs, showDecreditonLogs
    } = this.state;
    return (
      <Logs
        {...{
          ...this.props, ...this.state }}
        {...{
          showDecreditonLogs,
          showDcrdLogs,
          showDcrwalletLogs,
          onShowDecreditonLogs,
          onShowDcrdLogs,
          onShowDcrwalletLogs,
          onHideDecreditonLogs,
          onHideDcrdLogs,
          onHideDcrwalletLogs,
          dcrdLogs,
          dcrwalletLogs,
          decreditonLogs,
          isDaemonRemote,
          isDaemonStarted
        }}
      />
    );
  }

  onShowDecreditonLogs() {
    this.setState({ showDecreditonLogs: true });
  }

  onHideDecreditonLogs() {
    this.setState({ showDecreditonLogs: false });
  }

  onShowDcrdLogs() {
    this.setState({ showDcrdLogs: true });
  }

  onHideDcrdLogs() {
    this.setState({ showDcrdLogs: false });
  }

  onShowDcrwalletLogs() {
    this.setState({ showDcrwalletLogs: true });
  }

  onHideDcrwalletLogs() {
    this.setState({ showDcrwalletLogs: false });
  }
}

export const LogsTab = ReactTimeout(logging(LogsTabBody));
