import React from "react";
import Header from "../../Header";
import DecredLoading from "../../DecredLoading";
import "../../../style/GetStarted.less";

const DaemonLoading = ({
  currentBlockCount,
  daemonStarted,
}) => (
  <div className="get-started-view">
    <Header getStarted headerTitleOverview="Starting DCRD..." />
    <div className="get-started-content">
      <div className="get-started-content-title">
        {daemonStarted ?
          (currentBlockCount !== null ?
            <div className="get-started-content-title-text">Daemon started, waiting for rpc to start</div> :
            <div className="get-started-content-title-text">{currentBlockCount}</div>
          ) :
        <div className="get-started-content-title-text">Starting daemon...</div>
        }
      </div>
      <div className="get-started-content-nest">
        <DecredLoading/>
        <div className="get-started-fetch-headers-message">If you are syncing the blockchain for the first time, this may take a while.</div>
      </div>
    </div>
  </div>
);

export default DaemonLoading;
