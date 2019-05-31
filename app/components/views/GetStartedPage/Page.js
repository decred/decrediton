import { LinearProgressFull } from "indicators";
import { SlateGrayButton, InvisibleButton } from "buttons";
import "style/GetStarted.less";
import { LogsLinkMsg, SettingsLinkMsg, LearnBasicsMsg, UpdateAvailableLink,
  WhatsNewLink, LoaderTitleMsg, AboutModalButton } from "./messages";
import { StartDecrediton } from "./context";

const DaemonLoadingBody = ({
  updateAvailable, appVersion, onShowSettings, onShowLogs, StateComponent
}) => (
  <StartDecrediton.Consumer>
    {
      value => {
        const { getDaemonSynced } = value;
        return (
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
                  <LinearProgressFull {...{ getDaemonSynced }} />
                </div>
                { StateComponent && <StateComponent /> }

              </>
            </div>
          </div>
        );
      }
    }
  </StartDecrediton.Consumer>
);

export default DaemonLoadingBody;
