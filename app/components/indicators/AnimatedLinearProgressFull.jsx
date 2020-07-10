import { useState, useEffect } from "react";
import { useDaemonStartup } from "hooks";
import "style/Loading.less"; // XXX: continue css module here!
import { HeaderTimeMsg } from "views/GetStartedPage/messages";
import { FormattedRelative } from "shared";
import { FormattedMessage as T } from "react-intl";
import ReactTimeout from "react-timeout";
import { classNames } from "pi-ui";
import styles from "./indicators.module.css";

const AnimatedLinearProgressFull = ({
  setInterval,
  min,
  error,
  text,
  animationType
}) => {
  const {
    isSPV,
    getNeededBlocks,
    getEstimatedTimeLeft,
    selectedWalletSelector,
    getCurrentBlockCount,
    syncFetchHeadersLastHeaderTime,
    getDcrwalletLogs,
    getDaemonSynced
  } = useDaemonStartup();
  const [lastDcrwalletLogLine, setLogLine] = useState("");

  useEffect(() => {
    setInterval(async () => {
      try {
        const lastDcrwalletLogLine = await getDcrwalletLogs();
        setLogLine(lastDcrwalletLogLine);
      } catch (err) {
        console.log(err);
      }
    }, 2000);
  }, [setInterval, getDcrwalletLogs]);

  const perComplete = (getCurrentBlockCount - min) / (getNeededBlocks - min);
  const leftStartingPoint = perComplete ? perComplete * 100 : 0;
  let finishDateEstimation = null;
  if (getEstimatedTimeLeft !== null) {
    finishDateEstimation = new Date();
    finishDateEstimation.setSeconds(
      finishDateEstimation.getSeconds() + getEstimatedTimeLeft
    );
  }
  return (
    <>
      <div className={classNames("linear-progress", animationType)}>
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
          <div className={styles.loaderBarEstimation}>
            <T
              id="getStarted.chainLoading.syncEstimation"
              m="Blockchain download estimated complete: "
            />
            <span className={styles.bold}>
              {finishDateEstimation && (
                <FormattedRelative value={finishDateEstimation} />
              )}
              ({getCurrentBlockCount} / {getNeededBlocks})
            </span>
          </div>
        )}
        {selectedWalletSelector && syncFetchHeadersLastHeaderTime && (
          <div className={styles.loaderBarEstimation}>
            <HeaderTimeMsg />
            <span className={styles.bold}>
              <FormattedRelative value={syncFetchHeadersLastHeaderTime} />
            </span>
          </div>
        )}
        {selectedWalletSelector && lastDcrwalletLogLine && (
          <div className={styles.lastLogLines}>
            <div>{lastDcrwalletLogLine}</div>
          </div>
        )}
      </div>
    </>
  );
};

export default ReactTimeout(AnimatedLinearProgressFull);
