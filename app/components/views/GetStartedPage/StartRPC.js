import { KeyBlueButton } from "buttons";
import { ShowError } from "shared";
import { FormattedMessage as T } from "react-intl";
import { getDcrdLastLogLine, getDcrwalletLastLogLine } from "wallet";
import ReactTimeout from "react-timeout";
import "style/GetStarted.less";

function parseLogLine(line) {
  const res = /^[\d :\-.]+ \[...\] (.+)$/.exec(line);
  return res ? res[1] : "";
}

const LastLogLinesFragment = ({ lastDcrdLogLine, lastDcrwalletLogLine }) => (
  <div className="get-started-last-log-lines">
    <div className="last-dcrd-log-line">{lastDcrdLogLine}</div>
    <div className="last-dcrwallet-log-line">{lastDcrwalletLogLine}</div>
  </div>
);

const StartupErrorFragment = ({ onRetryStartRPC }) => (
  <div className="advanced-page-form">
    <div className="advanced-daemon-row">
      <ShowError className="get-started-error" error="Connection to dcrd failed, please try and reconnect." />
    </div>
    <div className="loader-bar-buttons">
      <KeyBlueButton className="get-started-rpc-retry-button" onClick={onRetryStartRPC}>
        <T id="getStarted.retryBtn" m="Retry" />
      </KeyBlueButton>
    </div>
  </div>
);

@autobind
class StartRPCBody extends React.Component {

  constructor(props) {
    super(props);
    this.state = { lastDcrdLogLine: "", lastDcrwalletLogLine: "" };
  }

  componentDidMount() {
    this.props.setInterval(() => {
      Promise
        .all([ getDcrdLastLogLine(), getDcrwalletLastLogLine() ])
        .then(([ dcrdLine, dcrwalletLine ]) => {
          const lastDcrdLogLine = parseLogLine(dcrdLine);
          const lastDcrwalletLogLine = parseLogLine(dcrwalletLine);
          if ( lastDcrdLogLine !== this.state.lastDcrdLogLine ||
              lastDcrwalletLogLine !== this.state.lastDcrwalletLogLine)
          {
            this.setState({ lastDcrdLogLine, lastDcrwalletLogLine });
          }
        });
    }, 2000);
  }

  render () {
    const { startupError, getCurrentBlockCount } = this.props;

    return (
      <Aux>
        {!getCurrentBlockCount && <LastLogLinesFragment {...this.state} />}
        {startupError && <StartupErrorFragment {...this.props} />}
      </Aux>
    );
  }
}

export default ReactTimeout(StartRPCBody);
