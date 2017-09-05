import React from "react";
import Header from "../../../Header";
import DecredLoading from "../../DecredLoading";
import LinearProgress from "material-ui/LinearProgress";
import KeyBlueButton from "../../../KeyBlueButton";
import "../../../../style/GetStarted.less";

const DaemonLoadingFormHeader = ({
  startupError,
  getDaemonStarted,
  getCurrentBlockCount,
}) => (
  <Header getStarted
    headerTitleOverview="Setting up Decrediton"
    headerMetaOverview={getDaemonStarted ? getCurrentBlockCount == null ? "Daemon started, waiting for rpc..." : "Blockchain syncing" : "Starting daemon"}
    headerTop={startupError
      ? <div key="pubError" className="get-started-view-notification-error">{startupError}</div>
      : <div key="pubError" ></div>}
  />
);

const DaemonLoadingFormBody = ({
    getCurrentBlockCount,
    getDaemonStarted,
    getNeededBlocks,
    getEstimatedTimeLeft,
    doSkipDaemonSync,
  }) => (
    <div className="get-started-view">
        <div className="get-started-content-nest">
          {getDaemonStarted && getCurrentBlockCount ?
          <div>
          <LinearProgress
            mode="determinate"
            min={0}
            max={getNeededBlocks}
            value={getCurrentBlockCount}
          />
          <div className="get-started-fetch-headers-message">
            {getCurrentBlockCount}/{getNeededBlocks} {getEstimatedTimeLeft}
            <KeyBlueButton
              className="get-started-rpc-retry-button"
              onClick={doSkipDaemonSync}
            >Skip sync</KeyBlueButton>
          </div>
          </div> :
          <div>
          </div> }
          <div className="get-started-fetch-headers-message">If you are syncing the blockchain for the first time, this may take a while.</div>
        </div>
      </div>
  );

export { DaemonLoadingFormHeader, DaemonLoadingFormBody };
