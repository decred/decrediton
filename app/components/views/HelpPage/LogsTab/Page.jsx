import { FormattedMessage as T } from "react-intl";
import { Subtitle } from "shared";
import { classNames } from "pi-ui";
import styles from "./LogsTab.module.css";

const Logs = ({
  showDcrdLogs,
  showDcrwalletLogs,
  onShowDcrdLogs,
  onShowDcrwalletLogs,
  onHideDcrdLogs,
  onHideDcrwalletLogs,
  dcrdLogs,
  dcrwalletLogs,
  isDaemonRemote,
  isDaemonStarted,
  walletReady,
  decreditonLogs,
  showDecreditonLogs,
  onShowDecreditonLogs,
  onHideDecreditonLogs,
  lnActive,
  lnStartAttempt,
  dcrlndLogs,
  showDcrlndLogs,
  onShowDcrlndLogs,
  onHideDcrlndLogs
}) => (
  <>
    <Subtitle title={<T id="logs.subtitle" m="System Logs" />} />
    {!isDaemonRemote && isDaemonStarted ? (
      !showDcrdLogs ? (
        <div className={classNames(styles.logArea, styles.hidden)}>
          <div
            className={classNames(styles.title, styles.hidden)}
            onClick={onShowDcrdLogs}>
            <T id="help.logs.dcrd" m="dcrd" />
          </div>
        </div>
      ) : (
        <div className={classNames(styles.logArea, styles.expanded)}>
          <div
            className={classNames(styles.title, styles.expanded)}
            onClick={onHideDcrdLogs}>
            <T id="help.logs.dcrd" m="dcrd" />
          </div>
          <div className={styles.logs}>
            <textarea rows="30" value={dcrdLogs} disabled />
          </div>
        </div>
      )
    ) : (
      <div />
    )}
    {!walletReady ? null : !showDcrwalletLogs ? (
      <div className={classNames(styles.logArea, styles.hidden)}>
        <div
          className={classNames(styles.title, styles.hidden)}
          onClick={onShowDcrwalletLogs}>
          <T id="help.logs.dcrwallet" m="dcrwallet" />
        </div>
      </div>
    ) : (
      <div className={classNames(styles.logArea, styles.expanded)}>
        <div
          className={classNames(styles.title, styles.expanded)}
          onClick={onHideDcrwalletLogs}>
          <T id="help.logs.dcrwallet" m="dcrwallet" />
        </div>
        <div className="log-area-logs">
          <textarea rows="30" value={dcrwalletLogs} disabled />
        </div>
      </div>
    )}
    {!showDecreditonLogs ? (
      <div className={classNames(styles.logArea, styles.hidden)}>
        <div
          className={classNames(styles.title, styles.hidden)}
          onClick={onShowDecreditonLogs}>
          <T id="help.logs.decrediton" m="decrediton" />
        </div>
      </div>
    ) : (
      <div className={classNames(styles.logArea, styles.expanded)}>
        <div
          className={classNames(styles.title, styles.expanded)}
          onClick={onHideDecreditonLogs}>
          <T id="help.logs.decrediton" m="decrediton" />
        </div>
        <div className={styles.logs}>
          <textarea rows="30" value={decreditonLogs} disabled />
        </div>
      </div>
    )}
    {!lnActive &&
    !lnStartAttempt ? null : !showDcrlndLogs ? (
      <div className={classNames(styles.logArea, styles.hidden)}>
        <div
          className={classNames(styles.title, styles.hidden)}
          onClick={onShowDcrlndLogs}>
          <T id="help.logs.dcrlnd" m="dcrlnd" />
        </div>
      </div>
    ) : (
      <div className={classNames(styles.logArea, styles.expanded)}>
        <div
          className={classNames(styles.title, styles.expanded)}
          onClick={onHideDcrlndLogs}>
          <T id="help.logs.dcrlnd" m="dcrlnd" />
        </div>
        <div className={styles.logs}>
          <textarea rows="30" value={dcrlndLogs} disabled />
        </div>
      </div>
    )}
  </>
);

export default Logs;
