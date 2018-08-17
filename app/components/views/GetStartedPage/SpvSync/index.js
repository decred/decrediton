import {
  SpvSyncFormHeader as SpvSyncHeader,
  SpvSyncFormBody
} from "./Form";
import { getDcrwalletLastLogLine } from "wallet";

function parseLogLine(line) {
  const res = /^[\d :\-.]+ \[...\] (.+)$/.exec(line);
  return res ? res[1] : "";
}

const LastLogLinesFragment = ({ lastDcrwalletLogLine }) => (
  <div className="get-started-last-log-lines">
    <div className="last-dcrwallet-log-line">{lastDcrwalletLogLine}</div>
  </div>
);

@autobind
class SpvSyncBody extends React.Component {
  constructor(props)  {
    super(props);
    this.state = this.getInitialState();
  }

  componentDidMount() {
    this.props.setInterval(() => {
      console.log("sdfds");
      Promise
        .all([ getDcrwalletLastLogLine() ])
        .then(([ dcrwalletLine ]) => {
          const lastDcrwalletLogLine = parseLogLine(dcrwalletLine);
          if (lastDcrwalletLogLine !== this.lastDcrwalletLogLine)
          {
            this.lastDcrwalletLogLine = lastDcrwalletLogLine;
          }
        });
    }, 2000);
    if (this.props.walletPrivatePassphrase && this.props.fetchHeadersDone !== null) {
      this.props.onSpvSynces(this.props.walletPrivatePassphrase);
    }
  }

  componentWillUnmount() {
    this.resetState();
  }

  getInitialState() {
    return {
      lastDcrdLogLine: "",
      lastDcrwalletLogLine: "",
      passPhrase: "",
      hasAttemptedDiscover: false
    };
  }

  render() {
    const { passPhrase, hasAttemptedDiscover } = this.state;
    const { onSetPassPhrase, onSpvSync, onKeyDown } = this;
    const { spvInput } = this.props;

    return (
      <Aux>
        {!spvInput ? <LastLogLinesFragment {...{
          lastDcrwalletLogLine: this.lastDcrwalletLogLine }} /> :
          <SpvSyncFormBody
            {...{
              ...this.props,
              passPhrase,
              hasAttemptedDiscover,
              onSetPassPhrase,
              onSpvSync,
              onKeyDown
            }}
          />
        }
      </Aux>
    );
  }

  resetState() {
    this.setState(this.getInitialState());
  }

  onSetPassPhrase(passPhrase) {
    this.setState({ passPhrase });
  }

  onSpvSync() {
    const { passPhrase } = this.state;

    if (!passPhrase) {
      return this.setState({ hasAttemptedDiscover: true });
    }

    const { startSPVSync, onSetWalletPrivatePassphrase } = this.props;

    onSetWalletPrivatePassphrase && onSetWalletPrivatePassphrase(passPhrase);
    startSPVSync(passPhrase);
    this.resetState();
  }

  onKeyDown(e) {
    if(e.keyCode == 13) {   // Enter key
      e.preventDefault();
      this.onSpvSync();
    }
  }

}

export { SpvSyncHeader, SpvSyncBody };
