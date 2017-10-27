import Header from "../../../Header";
import LinearProgress from "material-ui/LinearProgress";
import { FormattedMessage as T, FormattedRelative } from "react-intl";
import "style/GetStarted.less";

const DaemonLoadingFormHeader = ({
  startupError,
  getDaemonStarted,
  getCurrentBlockCount,
}) => (
  <Header getStarted
    headerTitleOverview={<T id="getStarted.header.title" m="Setting up Decrediton" />}
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
  }) => (
    <div className="get-started-content-new-seed">
    {getDaemonStarted ? getCurrentBlockCount == null ?
      showLongWaitMessage ?
      <div className="get-started-fetch-headers-message">
        <T id="getStarted.chainLoading" m="The Decred chain is currently loading and may take a few minutes." />
      </div> :
      <div></div> :
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
      </div> :
      <div></div> }
    </div>
  );

export { DaemonLoadingFormHeader, DaemonLoadingFormBody };
