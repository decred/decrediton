import ReactTimeout from "react-timeout";
import {
  DaemonLoadingFormHeader as DaemonLoadingHeader,
  DaemonLoadingFormBody
} from "./Form";

@autobind
class DaemonLoadingBodyBase extends React.Component {
  constructor(props)  {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      showLongWaitMessage: false,
      neededBlocksDeterminedAt: new Date(),
    };
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    this.timeoutId = this.props.setTimeout(() => {
      if (this.mounted) {
        this.setState({ showLongWaitMessage: true });
      }
    }, 2000);
    const neededBlocksInterval = this.props.network === "mainnet"
      ? 5 * 60 * 1000
      : 2 * 60 * 1000;
    this.props.setInterval(this.props.determineNeededBlocks, neededBlocksInterval);
  }

  render() {
    const { showLongWaitMessage } = this.state;
    const secondsLeft = this.props.getEstimatedTimeLeft;
    let finishDateEstimation = null;
    if (secondsLeft !== null) {
      finishDateEstimation = new Date();
      finishDateEstimation.setSeconds(finishDateEstimation.getSeconds() + secondsLeft);
    }
    return (
      <DaemonLoadingFormBody
        {...{
          ...this.props,
          showLongWaitMessage,
          finishDateEstimation
        }}
      />
    );
  }
}
const DaemonLoadingBody = ReactTimeout(DaemonLoadingBodyBase);

export { DaemonLoadingHeader, DaemonLoadingBody };
