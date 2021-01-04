import { AnimatedLinearProgressFull } from "indicators";
import { SlateGrayButton } from "buttons";
import { LearnBasicsMsg, WhatsNewLink, LoaderTitleMsg } from "./messages";
import { classNames } from "pi-ui";
import styles from "./GetStarted.module.css";

export default ({
  StateComponent,
  getDaemonSynced,
  error,
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
    <div className={styles.contentTitle}>
      <LoaderTitleMsg />
    </div>
    <div className={styles.loaderButtons}>
      <SlateGrayButton
        onClick={onShowTutorial}
        className={styles.tutorialButton}>
        <LearnBasicsMsg />
      </SlateGrayButton>
      <WhatsNewLink {...{ onShowReleaseNotes, appVersion }} />
    </div>
    <div className={styles.loaderBar}>
      <AnimatedLinearProgressFull
        {...{
          getDaemonStarted,
          getDaemonSynced,
          isSPV,
          text,
          getCurrentBlockCount,
          animationType,
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
