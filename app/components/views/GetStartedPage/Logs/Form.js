import { LogsTab } from "views/HelpPage/LogsTab";
import { FormattedMessage as T, FormattedRelative } from "react-intl";
import { LinearProgressSmall } from "indicators";

export default ({
  onHideLogs,
  getCurrentBlockCount,
  getNeededBlocks,
  finishDateEstimation
}) => (
  <div className="page-body getstarted">
    <div className="getstarted loader logs">
      <div className="content-title">
        <T id="getStarted.logsTitle" m="Logs" />
      </div>
      <LogsTab />
      <div className="go-back-screen-button" onClick={onHideLogs} />
      <div className="loader-bar-bottom">
        <div className="loader-bar-estimation">
          <span className="normal"><T id="getStarted.chainLoading.syncEstimation.small" m="Loading Decred blockchain, estimated time left"/></span>
          <span className="bold"> {finishDateEstimation ? <FormattedRelative value={finishDateEstimation}/> : "--"} ({getCurrentBlockCount} / {getNeededBlocks})</span>
        </div>
        <LinearProgressSmall
          min={0}
          max={100}
          value={50}
        />
      </div>
    </div>
  </div>
);
