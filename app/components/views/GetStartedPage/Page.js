import { AnimatedLinearProgressFull } from "indicators";
import { SlateGrayButton, InvisibleButton } from "buttons";
import "style/GetStarted.less";
import { LogsLinkMsg, SettingsLinkMsg, LearnBasicsMsg, UpdateAvailableLink,
  WhatsNewLink, LoaderTitleMsg, AboutModalButton } from "./messages";

const DaemonLoadingBody = ({
  updateAvailable, appVersion, onShowSettings, onShowLogs, StateComponent, getDaemonSynced,
  error, text, getCurrentBlockCount, animationType, getNeededBlocks, ...props
}) => (
  <div className="page-body getstarted">
    <div className="getstarted loader">
      <div className="loader-settings-logs">
        {updateAvailable && <UpdateAvailableLink updateAvailable={updateAvailable} /> }
        <>
          <AboutModalButton { ...{ appVersion, updateAvailable } } />
          <InvisibleButton onClick={onShowSettings}>
            <SettingsLinkMsg />
          </InvisibleButton>
          <InvisibleButton onClick={onShowLogs}>
            <LogsLinkMsg />
          </InvisibleButton>
        </>
      </div>
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
          <AnimatedLinearProgressFull {...{ getDaemonSynced, text, value: getCurrentBlockCount, animationType, min: 0,
            max: getNeededBlocks, disabled: false }} />
        </div>
        {
          error &&
          <div className="error launch-error">
            {error}
          </div>
        }
        { StateComponent && <StateComponent {...{ ...props, getDaemonSynced }} /> }
      </>
    </div>
  </div>
);
export default DaemonLoadingBody;
