import { LinearProgressFull } from "indicators";
import { FormattedMessage as T, FormattedRelative } from "react-intl";
import { SlateGrayButton, InvisibleButton, KeyBlueButton } from "buttons";
import { PasswordInput } from "inputs";
import "style/GetStarted.less";
import { LogsLinkMsg, SettingsLinkMsg, HeaderTimeMsg, DiscoverLabelMsg,
  DiscoverAccountsInfoMsg, ScanBtnMsg, LearnBasicsMsg, UpdateAvailableLink,
  WhatsNewLink, LoaderTitleMsg, AboutModalButton, messages } from "./messages";
import { StartDecrediton } from "./context";

const DaemonLoadingBody = ({
  updateAvailable, appVersion, onShowSettings, onShowLogs, StateComponent
}) => (
  <StartDecrediton.Consumer>
    {
      value => {
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
                  <LinearProgressFull />
                </div>
                { StateComponent && <StateComponent /> }

              </>
            </div>
          </div>
        )
      }
    }
  </StartDecrediton.Consumer>
);

export default DaemonLoadingBody;
