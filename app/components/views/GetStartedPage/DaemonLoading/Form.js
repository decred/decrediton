import React from "react";
import Header from "../../../Header";
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
    <div className="get-started-content-new-seed">
    {getDaemonStarted && getCurrentBlockCount ?
      <div className="get-started-content-instructions">
        <p>If you are starting decrediton for the first time, this may take a while.</p>
          <LinearProgress
            mode="determinate"
            min={0}
            max={getNeededBlocks}
            value={getCurrentBlockCount}
          />
          <div className="get-started-content-new-seed-create-button">
            {getCurrentBlockCount}/{getNeededBlocks} {getEstimatedTimeLeft}
            <div className="get-started-content-new-seed-create-button">
              <div className="get-started-content-confirm-wallet-create-input-left-padding"></div>
              <div className="get-started-content-confirm-wallet-create-input-right-padding">
                <KeyBlueButton
                  className="get-started-view-button-key-blue-wallet-new-seed"
                  onClick={doSkipDaemonSync}
                >Skip sync</KeyBlueButton>
              </div>
            </div>
          </div>
        </div> :
        <div></div> }
    </div>
  );

export { DaemonLoadingFormHeader, DaemonLoadingFormBody };
