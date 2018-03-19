import { LogsTab } from "views/HelpPage/LogsTab";
import { Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";
import { LoaderBarBottom } from "indicators";
import { InvisibleButton } from "buttons";

export default ({
  onHideLogs,
  onShowSettings,
  getCurrentBlockCount,
  getNeededBlocks,
  getEstimatedTimeLeft
}) => (
  <div className="page-body getstarted">
    <div className="getstarted loader logs">
      <div className="content-title">
        <div className="loader-settings-logs">
          <InvisibleButton onClick={onShowSettings}>
            <T id="getStarted.btnSettings" m="Settings" />
          </InvisibleButton>
          <InvisibleButton className="active">
            <T id="getStarted.btnLogs" m="Logs" />
          </InvisibleButton>
        </div>
        <Tooltip text={ <T id="logs.goBack" m="Go back" /> }><div className="go-back-screen-button" onClick={onHideLogs}/></Tooltip>
        <T id="getStarted.logsTitle" m="Logs" />
      </div>
      <div className="log-container">
        <LogsTab />
      </div>
      <LoaderBarBottom  {...{ getCurrentBlockCount, getNeededBlocks, getEstimatedTimeLeft }}  />
    </div>
  </div>
);
