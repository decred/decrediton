import Logs from "./Page";
import { getDcrdLogs, getDcrwalletLogs, getDecreditonLogs } from "wallet";
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
    this.getLogs();
  }

  componentDidUpdate() {
    if(this.state.interval) {
      return;
    }
    const interval = this.props.setInterval(() => {
      this.getLogs();
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
      decreditonLogs: "",
      showDcrdLogs: false,
      showDcrwalletLogs: false,
      showDecreditonLogs: false
    };
  }

  render() {
    const { onShowDecreditonLogs, onShowDcrdLogs, onShowDcrwalletLogs,
      onHideDecreditonLogs, onHideDcrdLogs, onHideDcrwalletLogs
    } = this;
    return (
      <Logs
        {...{
          ...this.props,
          ...this.state,
          onShowDecreditonLogs,
          onShowDcrdLogs,
          onShowDcrwalletLogs,
          onHideDecreditonLogs,
          onHideDcrdLogs,
          onHideDcrwalletLogs,
        }}
      />
    );
  }

  getLogs() {
    return Promise
      .all([ getDcrdLogs(), getDcrwalletLogs(), getDecreditonLogs() ])
      .then(([ rawDcrdLogs, rawDcrwalletLogs, decreditonLogs ]) => {
        const dcrdLogs = Buffer.from(rawDcrdLogs).toString("utf8");
        const dcrwalletLogs = Buffer.from(rawDcrwalletLogs).toString("utf8");
        if ( dcrdLogs !== this.state.dcrdLogs ) {
          this.setState({ dcrdLogs });
        }
        if ( dcrwalletLogs !== this.state.dcrwalletLogs ) {
          this.setState({ dcrwalletLogs });
        }
        if ( decreditonLogs !== this.state.decreditonLogs ) {
          this.setState({ decreditonLogs });
        }
      });
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
