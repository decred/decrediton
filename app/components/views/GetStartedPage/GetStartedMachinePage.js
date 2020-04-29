import { AnimatedLinearProgressFull } from "indicators";
import { SlateGrayButton } from "buttons";
import { LearnBasicsMsg, WhatsNewLink, LoaderTitleMsg } from "./messages";

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
  ...props
}) => (
  <>
    <div className="content-title">
      <LoaderTitleMsg />
    </div>
    <div className="loader-buttons">
      <SlateGrayButton onClick={onShowTutorial} className="tutorial-button">
        <LearnBasicsMsg />
      </SlateGrayButton>
      <WhatsNewLink {...{ onShowReleaseNotes, appVersion }} />
    </div>
    <div className="loader-bar">
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
    {error && <div className="error launch-error">{error}</div>}
    {StateComponent &&
      (React.isValidElement(StateComponent) ? (
        StateComponent
      ) : (
        <StateComponent {...{ ...props }} />
      ))}
  </>
);
