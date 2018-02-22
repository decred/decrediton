import LinearProgress from "material-ui/LinearProgress";
import { FormattedMessage as T, FormattedRelative } from "react-intl";
import { SlateGrayButton } from "buttons";
import "style/GetStarted.less";

export default ({
  getCurrentBlockCount,
  getDaemonStarted,
  getNeededBlocks,
  showLongWaitMessage,
  finishDateEstimation,
  onShowSettings,
  onShowLogs,
}) => (
  <div className="page-body getstarted">
    <div className="getstarted content">
      {getDaemonStarted ? getCurrentBlockCount == null ?
        showLongWaitMessage ?
          <Aux>
            <div className="get-started-fetch-headers-message">
              <T id="getStarted.chainLoading" m="The Decred chain is currently loading and may take a few minutes." />
            </div>
            <div className="get-started-bottom-buttons">
              <SlateGrayButton onClick={onShowLogs}>
                <T id="getStarted.btnLogs" m="Logs" />
              </SlateGrayButton>
            </div>
          </Aux> :
          <div></div> :
        <Aux>
          <div className="get-started-content-instructions">
            <div className="get-started-content-instructions-blockchain-syncing">
              <div className="get-started-instructions-txt">
                <T id="getStarted.chainLoadingDelayReminder" m="If you are starting decrediton for the first time, this may take a while." />
              </div>
            </div>
            <LinearProgress
              mode="determinate"
              min={0}
              max={getNeededBlocks}
              value={getCurrentBlockCount}
            />
            <p>
              <T
                id="getStarted.chainLoading.syncEstimation"
                m="Estimated ending {timeEstimation} ({currentBlockCount} / {neededBlocks})"
                values={{
                  timeEstimation: (finishDateEstimation !== null
                    ? <FormattedRelative value={finishDateEstimation}/>
                    : "---"),
                  currentBlockCount: getCurrentBlockCount,
                  neededBlocks: getNeededBlocks
                }}
              />
            </p>
          </div>
          <div className="get-started-bottom-buttons">
            <SlateGrayButton onClick={onShowSettings}>
              <T id="getStarted.btnSettings" m="Application Settings" />
            </SlateGrayButton>
            <SlateGrayButton onClick={onShowLogs}>
              <T id="getStarted.btnLogs" m="Logs" />
            </SlateGrayButton>
          </div>
        </Aux> :
        <div></div> }
    </div>
  </div>
);
