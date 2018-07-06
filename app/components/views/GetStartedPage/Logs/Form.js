import { LogsTab } from "views/HelpPage/LogsTab";
import { Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";
import { LoaderBarBottom } from "indicators";
import { InvisibleButton, AboutModalButtonInvisible } from "buttons";

export default ({
  onHideLogs,
  onShowSettings,
  getCurrentBlockCount,
  getNeededBlocks,
  getEstimatedTimeLeft,
  getWalletReady,
  appVersion,
  updateAvailable,
}) => (
  <div className="page-body getstarted">
    <div className="getstarted loader logs">
      <div className="content-title">
        <div className="loader-settings-logs">
          <AboutModalButtonInvisible version={appVersion} updateAvailable={updateAvailable} buttonLabel={<T id="help.about" m="About Decrediton" />}/>
          {getWalletReady &&
            <InvisibleButton onClick={onShowSettings}>
              <T id="getStarted.btnSettings" m="Settings" />
            </InvisibleButton>
          }
          <InvisibleButton className="active">
            <T id="getStarted.btnLogs" m="Logs" />
          </InvisibleButton>
        </div>
        <div className="go-back-screen-button-area">
          <Tooltip text={ <T id="logs.goBack" m="Go back" /> }><div className="go-back-screen-button" onClick={onHideLogs}/></Tooltip>
        </div>
        <T id="getStarted.logsTitle" m="Logs" />
      </div>
      <div className="log-container">
        <LogsTab />
      </div>
      <LoaderBarBottom  {...{ getCurrentBlockCount, getNeededBlocks, getEstimatedTimeLeft }}  />
    </div>
  </div>
);
