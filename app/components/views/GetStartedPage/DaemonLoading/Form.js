import Header from "../DefaultHeader";
import LinearProgress from "material-ui/LinearProgress";
import { FormattedMessage as T, FormattedRelative } from "react-intl";
import { SlateGrayButton } from "buttons";
import "style/GetStarted.less";

const DaemonLoadingFormHeader = ({
  startupError,
  getDaemonStarted,
  getCurrentBlockCount,
}) => (
  <Header
    headerMetaOverview={getDaemonStarted
      ? getCurrentBlockCount == null
        ? <T id="getStarted.header.daemonLoading.meta" m="Preparing background process" />
        : <T id="getStarted.header.downloadingBlockchain.meta" m="Downloading blockchain" />
      : <T id="getStarted.header.startingProcess.meta" m="Starting background process" />}
    headerTop={startupError
      ? <div key="pubError" className="get-started-view-notification-error">{startupError}</div>
      : <div key="pubError" ></div>}
  />
);

const DaemonLoadingFormBody = ({
  getCurrentBlockCount,
  getDaemonStarted,
  getNeededBlocks,
  showLongWaitMessage,
  finishDateEstimation,
  onShowSettings,
  onShowLogs,
}) => (
  <div className="get-started-content-new-seed">
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
              <T id="getStarted.chainLoadingDelayReminder" m="If you are starting Hxify for the first time, this may take a while." />
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
);

export { DaemonLoadingFormHeader, DaemonLoadingFormBody };
