import { FormattedMessage as T, FormattedRelative } from "react-intl";
import { LinearProgressSmall } from "indicators";

@autobind
class LoaderBarBottom extends React.Component {
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

  render() {
    const { getCurrentBlockCount, getNeededBlocks, getEstimatedTimeLeft, getDaemonSynced } = this.props;
    let finishDateEstimation = null;
    if (getEstimatedTimeLeft !== null) {
      finishDateEstimation = new Date();
      finishDateEstimation.setSeconds(finishDateEstimation.getSeconds() + getEstimatedTimeLeft);
    }
    return ( getCurrentBlockCount && !getDaemonSynced &&
      <div className="loader-bar-bottom">
        <div className="loader-bar-estimation">
          <span className="normal">{finishDateEstimation ? <T id="getStarted.chainLoading.syncEstimation.small" m="Loading Decred blockchain, completion estimated"/> : null}</span>
          <span className="bold"> {finishDateEstimation ? <FormattedRelative value={finishDateEstimation}/> : null} ({getCurrentBlockCount} / {getNeededBlocks})</span>
        </div>
        <LinearProgressSmall
          min={0}
          max={getNeededBlocks}
          value={getCurrentBlockCount}
        />
      </div>
    );
  }
}
export default LoaderBarBottom;
