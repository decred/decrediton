import "style/Loading.less";
import { daemonStartup } from "connectors";
import { HeaderTimeMsg } from "views/GetStartedPage/messages";
import { FormattedRelative } from "shared";
import { FormattedMessage as T } from "react-intl";
import ReactTimeout from "react-timeout";

@autobind
class AnimatedLinearProgressFull extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastDcrwalletLogLine: ""
    };
  }

  componentDidMount() {
    this.props.setInterval(async () => {
      try {
        const lastDcrwalletLogLine = await this.props.getDcrwalletLogs();
        this.setState({ lastDcrwalletLogLine });
      } catch (err) {
        console.log(err);
      }
    }, 2000);
  }

  render() {
    const {
      min,
      error,
      getDaemonSynced,
      text,
      animationType,
      syncFetchHeadersLastHeaderTime,
      getCurrentBlockCount,
      selectedWalletSelector,
      getEstimatedTimeLeft,
      getNeededBlocks,
      isSPV
    } = this.props;
    const perComplete = (getCurrentBlockCount - min) / (getNeededBlocks - min);
    const leftStartingPoint = perComplete ? perComplete * 100 : 0;
    let finishDateEstimation = null;
    if (getEstimatedTimeLeft !== null) {
      finishDateEstimation = new Date();
      finishDateEstimation.setSeconds(
        finishDateEstimation.getSeconds() + getEstimatedTimeLeft
      );
    }
    const { lastDcrwalletLogLine } = this.state;

    return (
      <>
        <div className={"linear-progress " + animationType}>
          {getDaemonSynced || isSPV ? (
            <div
              className={"linear-progress-bar " + (error ? "error" : null)}
              style={
                error || getDaemonSynced
                  ? {}
                  : { width: `${perComplete * 100}` + "%" }
              }></div>
          ) : (
            <>
              <div
                className={"linear-progress-bar " + (error && "error")}
                style={{ width: `${leftStartingPoint}%` }}></div>
              <div className="is-row">
                {perComplete > 0.1 && perComplete < 1 && (
                  <div
                    className="linear-progress-box one"
                    style={{ left: leftStartingPoint }}
                  />
                )}
                {perComplete > 0.25 && perComplete < 1 && (
                  <div
                    className="linear-progress-box two"
                    style={{ left: leftStartingPoint + 200 }}
                  />
                )}
                {perComplete > 0.4 && perComplete < 1 && (
                  <div
                    className="linear-progress-box three"
                    style={{ left: leftStartingPoint + 200 }}
                  />
                )}
                {perComplete > 0.6 && perComplete < 1 && (
                  <div
                    className="linear-progress-box four"
                    style={{ left: leftStartingPoint + 200 }}
                  />
                )}
                {perComplete > 0.75 && perComplete < 1 && (
                  <div
                    className="linear-progress-box five"
                    style={{ left: leftStartingPoint + 200 }}
                  />
                )}
                {perComplete > 0.9 && perComplete < 1 && (
                  <div
                    className="linear-progress-box six"
                    style={{ left: leftStartingPoint + 200 }}
                  />
                )}
              </div>
            </>
          )}
          <div className={"linear-progress-text " + animationType}>{text}</div>
        </div>
        <div>
          {getCurrentBlockCount && !getDaemonSynced && (
            <div className="loader-bar-estimation">
              <T
                id="getStarted.chainLoading.syncEstimation"
                m="Blockchain download estimated complete: "
              />
              <span className="bold">
                {finishDateEstimation && (
                  <FormattedRelative value={finishDateEstimation} />
                )}
                ({getCurrentBlockCount} / {getNeededBlocks})
              </span>
            </div>
          )}
          {selectedWalletSelector && syncFetchHeadersLastHeaderTime && (
            <div className="loader-bar-estimation">
              <HeaderTimeMsg />
              <span className="bold">
                <FormattedRelative value={syncFetchHeadersLastHeaderTime} />
              </span>
            </div>
          )}
          {selectedWalletSelector && lastDcrwalletLogLine && (
            <div className="get-started-last-log-lines">
              <div className="last-dcrwallet-log-line">
                {lastDcrwalletLogLine}
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default ReactTimeout(daemonStartup(AnimatedLinearProgressFull));
