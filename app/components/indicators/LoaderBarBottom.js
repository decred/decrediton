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
    const { getCurrentBlockCount, getNeededBlocks, getEstimatedTimeLeft } = this.props;
    let finishDateEstimation = null;
    if (getEstimatedTimeLeft !== null) {
      finishDateEstimation = new Date();
      finishDateEstimation.setSeconds(finishDateEstimation.getSeconds() + getEstimatedTimeLeft);
    }
    return ( getCurrentBlockCount &&
      <div className="loader-bar-bottom">
        <div className="loader-bar-estimation">
          <span className="normal"><T id="getStarted.chainLoading.syncEstimation.small" m="Loading Decred blockchain, estimated time left"/></span>
          <span className="bold"> {finishDateEstimation ? <FormattedRelative value={finishDateEstimation}/> : "--"} ({getCurrentBlockCount} / {getNeededBlocks})</span>
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
