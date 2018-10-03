import { LogsTab } from "views/HelpPage/LogsTab";
import { Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";
import { LoaderBarBottom } from "indicators";
import { InvisibleButton } from "buttons";
import { LogsLinkMsg, SettingsLinkMsg, GoBackMsg, AboutModalButton } from "../messages";

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
          <AboutModalButton { ...{ appVersion, updateAvailable } } />
          {getWalletReady &&
            <InvisibleButton onClick={onShowSettings}>
              <SettingsLinkMsg />
            </InvisibleButton>
          }
          <InvisibleButton className="active">
            <LogsLinkMsg />
          </InvisibleButton>
        </div>
        <div className="go-back-screen-button-area">
          <Tooltip text={ <GoBackMsg /> }><div className="go-back-screen-button" onClick={onHideLogs}/></Tooltip>
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
