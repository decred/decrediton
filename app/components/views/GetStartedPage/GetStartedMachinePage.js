import { AnimatedLinearProgressFull } from "indicators";
import { SlateGrayButton, InvisibleButton } from "buttons";
import { LogsLinkMsg, SettingsLinkMsg, LearnBasicsMsg, UpdateAvailableLink,
  WhatsNewLink, LoaderTitleMsg, AboutModalButton } from "./messages";

export default ({
  updateAvailable, appVersion, onShowSettings, onShowLogs, StateComponent, getDaemonSynced,
  error, text, getCurrentBlockCount, animationType, getNeededBlocks, getDaemonStarted,
  getEstimatedTimeLeft, lastDcrwalletLogLine, ...props
}) => (
<>
  <div className="content-title">
    <LoaderTitleMsg />
  </div>
  <div className="loader-buttons">
    <SlateGrayButton className="tutorial-button" >
      <LearnBasicsMsg />
    </SlateGrayButton>
    <WhatsNewLink />
  </div>
  <div className="loader-bar">
    <AnimatedLinearProgressFull {...{ getDaemonStarted, getDaemonSynced, text, getCurrentBlockCount, animationType, min: 0,
      max: getNeededBlocks, getEstimatedTimeLeft, lastDcrwalletLogLine, disabled: false }} />
  </div>
  { error &&
    <div className="error launch-error">
      {error}
    </div>
  }
  { StateComponent && (React.isValidElement(StateComponent) ? StateComponent : <StateComponent {...{ ...props, getDaemonSynced }} />) }
</>
);