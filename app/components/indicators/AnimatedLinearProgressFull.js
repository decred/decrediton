import "style/Loading.less";
import { HeaderTimeMsg } from "views/GetStartedPage/messages";
import { FormattedRelative } from "shared";
import { FormattedMessage as T } from "react-intl";

@autobind
class AnimatedLinearProgressFull extends React.Component {
  render() {
    const { min, max, error, getDaemonSynced, text, animationType,
      syncFetchHeadersLastHeaderTime, lastDcrwalletLogLine, getCurrentBlockCount, getDaemonStarted, getEstimatedTimeLeft} = this.props;
    const perComplete = (getCurrentBlockCount-min)/(max-min);
    const leftStartingPoint = perComplete ? perComplete*100 : 0;
    let finishDateEstimation = null;
    if (getEstimatedTimeLeft !== null) {
      finishDateEstimation = new Date();
      finishDateEstimation.setSeconds(finishDateEstimation.getSeconds() + getEstimatedTimeLeft);
    }
    return (
      <>
        <div className={"linear-progress " + animationType}>
          { getDaemonSynced ?
            <div className={"linear-progress-bar " + (error ? "error" : null)}
              style={error || getDaemonSynced ? {} : { width: `${perComplete*100}` + "%" }}>
            </div> :
            <>
              <div className={"linear-progress-bar " + ( error && "error" )}
                style={{ width: `${leftStartingPoint}%` }}>
              </div>
              <div className="is-row">
                { perComplete > 0.1  && perComplete < 1 && <div className="linear-progress-box one"    style={{ left: leftStartingPoint  }}/> }
                { perComplete > 0.25 && perComplete < 1 && <div className="linear-progress-box two"    style={{ left: leftStartingPoint + 200 }}/> }
                { perComplete > 0.4  && perComplete < 1 && <div className="linear-progress-box three"  style={{ left: leftStartingPoint + 200 }}/> }
                { perComplete > 0.6  && perComplete < 1 && <div className="linear-progress-box four"   style={{ left: leftStartingPoint + 200 }}/> }
                { perComplete > 0.75 && perComplete < 1 && <div className="linear-progress-box five"   style={{ left: leftStartingPoint + 200 }}/> }
                { perComplete > 0.9  && perComplete < 1 && <div className="linear-progress-box six"    style={{ left: leftStartingPoint + 200 }}/> }
              </div>
            </>}
          <div className={"linear-progress-text " + animationType}>
            {text}
          </div>
        </div>
        <div>
          { getDaemonStarted && getCurrentBlockCount && finishDateEstimation &&
            <div className="loader-bar-estimation">
              <T id="getStarted.chainLoading.syncEstimation" m="Blockchain download estimated complete: "/>
              <span className="bold"><FormattedRelative value={finishDateEstimation}/>({getCurrentBlockCount} / {max})</span>
            </div>
          }
          { getDaemonStarted && syncFetchHeadersLastHeaderTime &&
            <div className="loader-bar-estimation">
              <HeaderTimeMsg />
              <span className="bold">
                <FormattedRelative value={syncFetchHeadersLastHeaderTime}/>
              </span>
            </div>
          }
          { lastDcrwalletLogLine &&
            <div className="get-started-last-log-lines">
              <div className="last-dcrwallet-log-line">{lastDcrwalletLogLine}</div>
            </div>
          }
        </div>
      </>
    );
  }
}

export default AnimatedLinearProgressFull;
