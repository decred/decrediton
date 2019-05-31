import "style/Loading.less";
import { FormattedMessage as T } from "react-intl";
import { StartDecrediton } from "views/GetStartedPage/context"

export const LinearProgressFull = () => (
  <StartDecrediton.Consumer>
    {
      state => {
        const { value, min, max, error, disabled, text, animationType, getDaemonSynced } = state;
        const perComplete = (value-min)/(max-min);
        const leftStartingPoint = perComplete*95 + "%";
        return (
          <div className="linear-progress">
            { (getDaemonSynced || !disabled) &&
              <div className={error ? "linear-progress-bar error" : "linear-progress-bar"} style={error || getDaemonSynced ? {} : { width: `${perComplete*100}` + "%" }}>
                { (!getDaemonSynced && !error) &&
                  <>
                    { perComplete > 0.1  && perComplete < 1 && <div className="linear-progress-box one"    style={{ left: leftStartingPoint }}/> }
                    { perComplete > 0.25 && perComplete < 1 && <div className="linear-progress-box two"    style={{ left: leftStartingPoint }}/> }
                    { perComplete > 0.4  && perComplete < 1 && <div className="linear-progress-box three"  style={{ left: leftStartingPoint }}/> }
                    { perComplete > 0.6  && perComplete < 1 && <div className="linear-progress-box four"   style={{ left: leftStartingPoint }}/> }
                    { perComplete > 0.75 && perComplete < 1 && <div className="linear-progress-box five"   style={{ left: leftStartingPoint }}/> }
                    { perComplete > 0.9  && perComplete < 1 && <div className="linear-progress-box six"    style={{ left: leftStartingPoint }}/> }
                  </>
                }
              </div>
            }
            <div className={(getDaemonSynced || !disabled) ? "linear-progress-text loading " + animationType: "linear-progress-text " + animationType}>
              {text ? text :
                disabled && !getDaemonSynced ?
                  <T id="loaderBar.Waiting" m="Waiting for daemon connection..." /> :
                  getDaemonSynced ? <T id="loaderBar.Loaded" m="Blockchain loaded" /> :
                    <T id="loaderBar.Loading" m="Blockchain syncing" />}
            </div>
          </div>
        )
      }
    }
  </StartDecrediton.Consumer>
)

export default LinearProgressFull;
