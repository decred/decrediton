import { useState } from "react";
import { useDaemonStartup, useMountEffect } from "hooks";
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
  animationType,
  initialAnimationType
}) => {
  const {
    isSPV,
    getNeededBlocks,
    getEstimatedTimeLeft,
    selectedWalletSelector,
    getCurrentBlockCount,
    syncFetchHeadersLastHeaderTime,
    getDcrwalletLogs,
    getDaemonSynced,
    onGetDcrdLogs
  } = useDaemonStartup();
  const [lastDcrwalletLogLine, setLogLine] = useState("");
  const [lastDcrdLogLine, setDcrdLogLine] = useState("");

  useMountEffect(() => {
    setInterval(async () => {
      try {
        const lastDcrwalletLogLine = await getDcrwalletLogs();
        setLogLine(lastDcrwalletLogLine);
      } catch (err) {
        console.log(err);
      }
    }, 2000);
    setInterval(async () => {
      try {
        const lastDcrdLogLine = await onGetDcrdLogs();
        setDcrdLogLine(lastDcrdLogLine);
      } catch (err) {
        console.log(err);
      }
    }, 2000);
  }, [setInterval, getDcrwalletLogs, onGetDcrdLogs]);

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
      <div className={classNames(styles.linearProgress)}>
        {getDaemonSynced || isSPV ? (
          <>
            <div
              className={classNames(
                styles.linearProgressBar,
                error && styles.error
              )}
              style={
                error || getDaemonSynced || !perComplete
                  ? {}
                  : { width: `${perComplete * 100}` + "%" }
              }></div>
            <div
              className={classNames(
                styles.linearProgressText,
                animationType && animationType
              )}>
              {text}
            </div>
          </>
        ) : (
          <>
            <div
              className={classNames(
                styles.linearProgressBar,
                error && styles.error
              )}
              style={{ width: `${leftStartingPoint}%` }}></div>
            <div className={styles.isRow}>
              {perComplete > 0.1 && perComplete < 1 && (
                <div
                  className={classNames(styles.linearProgressBox, styles.one)}
                  style={{ left: leftStartingPoint }}
                />
              )}
              {perComplete > 0.25 && perComplete < 1 && (
                <div
                  className={classNames(styles.linearProgressBox, styles.two)}
                  style={{ left: leftStartingPoint + 200 }}
                />
              )}
              {perComplete > 0.4 && perComplete < 1 && (
                <div
                  className={classNames(styles.linearProgressBox, styles.three)}
                  style={{ left: leftStartingPoint + 200 }}
                />
              )}
              {perComplete > 0.6 && perComplete < 1 && (
                <div
                  className={classNames(styles.linearProgressBox, styles.four)}
                  style={{ left: leftStartingPoint + 200 }}
                />
              )}
              {perComplete > 0.75 && perComplete < 1 && (
                <div
                  className={classNames(styles.linearProgressBox, styles.fives)}
                  style={{ left: leftStartingPoint + 200 }}
                />
              )}
              {perComplete > 0.9 && perComplete < 1 && (
                <div
                  className={classNames(styles.linearProgressBox, styles.six)}
                  style={{ left: leftStartingPoint + 200 }}
                />
              )}
            </div>
            <div
              className={classNames(
                styles.linearProgressText,
                animationType ?? animationType,
                leftStartingPoint == 0 && initialAnimationType,
                leftStartingPoint == 0 && styles.initial
              )}>
              {text}
            </div>
          </>
        )}
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
        {!getDaemonSynced && lastDcrdLogLine && !selectedWalletSelector && (
          <div className={styles.lastLogLines}>
            <div>{lastDcrdLogLine}</div>
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
