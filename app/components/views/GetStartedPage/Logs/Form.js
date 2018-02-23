import { LogsTab } from "views/HelpPage/LogsTab";
import { Tooltip } from "shared";
import { FormattedMessage as T, FormattedRelative } from "react-intl";
import { LinearProgressSmall } from "indicators";
import { InvisibleButton } from "buttons";

export default ({
  onHideLogs,
  getCurrentBlockCount,
  getNeededBlocks,
  onShowSettings,
  finishDateEstimation
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
      <LogsTab />
      <div className="loader-bar-bottom">
        <div className="loader-bar-estimation">
          <span className="normal"><T id="getStarted.chainLoading.syncEstimation.small" m="Loading Decred blockchain, estimated time left"/></span>
          <span className="bold"> {finishDateEstimation ? <FormattedRelative value={finishDateEstimation}/> : "--"} ({getCurrentBlockCount} / {getNeededBlocks})</span>
        </div>
        <LinearProgressSmall
          min={0}
          max={getNeededBlocks}
          value={getCurrentBlockCount}
        />
      </div>
    </div>
  </div>
);
