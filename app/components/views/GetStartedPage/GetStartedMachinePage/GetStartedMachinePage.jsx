import { classNames } from "pi-ui";
import { AnimatedLinearProgressFull } from "indicators";
import styles from "./GetStartedMachinePage.module.css";
import { Header } from "../helpers";

export default ({
  StateComponent,
  getDaemonSynced,
  error,
  availableWalletsError,
  text,
  getCurrentBlockCount,
  animationType,
  getNeededBlocks,
  getDaemonStarted,
  getEstimatedTimeLeft,
  lastDcrwalletLogLine,
  isSPV,
  onShowReleaseNotes,
  onShowTutorial,
  appVersion,
  daemonWarning,
  ...props
}) => (
  <>
    <Header {...{ onShowTutorial, onShowReleaseNotes, appVersion }} />
    <div className={styles.loaderBar}>
      <AnimatedLinearProgressFull
        {...{
          getDaemonStarted,
          getDaemonSynced,
          isSPV,
          text,
          getCurrentBlockCount,
          animationType,
          initialAnimationType: styles.initial,
          min: 0,
          max: getNeededBlocks,
          getEstimatedTimeLeft,
          lastDcrwalletLogLine,
          disabled: false
        }}
      />
    </div>
    {error && (
      <div className={classNames(styles.error, styles.launchError)}>
        {error}
      </div>
    )}
    {availableWalletsError && (
      <div className={classNames(styles.error, styles.launchError)}>
        {availableWalletsError}
      </div>
    )}
    {daemonWarning && (
      <div className={classNames(styles.daemonWarning)}>{daemonWarning}</div>
    )}

    {StateComponent &&
      (React.isValidElement(StateComponent) ? (
        StateComponent
      ) : (
        <StateComponent {...{ ...props }} />
      ))}
  </>
);
