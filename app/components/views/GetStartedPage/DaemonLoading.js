import React from "react";
import Header from "../../Header";
import DecredLoading from "../../DecredLoading";
import LinearProgress from "material-ui/LinearProgress";
import KeyBlueButton from "../../KeyBlueButton";
import "../../../style/GetStarted.less";

const DaemonLoading = ({
  getCurrentBlockCount,
  getDaemonStarted,
  getNeededBlocks,
  getEstimatedTimeLeft,
  doSkipDaemonSync,
}) => (
  <div className="get-started-view">
    <Header getStarted headerTitleOverview="Starting DCRD..." />
    <div className="get-started-content">
      <div className="get-started-content-title">
        {getDaemonStarted ?
          (getCurrentBlockCount == null ?
            <div className="get-started-content-title-text">Daemon started, waiting for rpc...</div> :
            <div className="get-started-content-title-text">Blockchain syncing:</div>
          ) :
        <div className="get-started-content-title-text">Starting daemon...</div>
        }
      </div>
      <div className="get-started-content-nest">
        {getDaemonStarted && getCurrentBlockCount ?
        <div>
        <LinearProgress
          mode="determinate"
          min={0}
          max={getNeededBlocks}
          value={getCurrentBlockCount}
        />
        <div className="get-started-fetch-headers-message">{getCurrentBlockCount}/{getNeededBlocks}</div>
        <div className="get-started-fetch-headers-message">{getEstimatedTimeLeft}</div>
        <KeyBlueButton
          className="get-started-rpc-retry-button"
          onClick={doSkipDaemonSync}
        >Skip sync</KeyBlueButton>
        </div> :
        <div>
        </div> }
        <DecredLoading/>
        <div className="get-started-fetch-headers-message">If you are syncing the blockchain for the first time, this may take a while.</div>
      </div>
    </div>
  </div>
);

export default DaemonLoading;
