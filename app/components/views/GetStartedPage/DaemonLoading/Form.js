import React from "react";
import Header from "../../../Header";
import LinearProgress from "material-ui/LinearProgress";
import KeyBlueButton from "../../../KeyBlueButton";
import "../../../../style/GetStarted.less";
import ReactToolTip from "react-tooltip";

const DaemonLoadingFormHeader = ({
  startupError,
  getDaemonStarted,
  getCurrentBlockCount,
}) => (
  <Header getStarted
    headerTitleOverview="Setting up Decrediton"
    headerMetaOverview={getDaemonStarted ? getCurrentBlockCount == null ? "Preparing background process" : "Downloading blockchain" : "Starting background process"}
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
    showLongWaitMessage,
  }) => (
    <div className="get-started-content-new-seed">
    {getDaemonStarted ? getCurrentBlockCount == null ?
      showLongWaitMessage ?
      <div className="get-started-fetch-headers-message">
        The Decred chain is currently loading and may take a few minutes.
      </div> :
      <div></div> :
      <div className="get-started-content-instructions">
        <div className="get-started-content-instructions-blockchain-syncing">
          <div className="get-started-instructions-txt">
            If you are starting decrediton for the first time, this may take a while.
          </div>
          <span
            className="get-started-skip-sync-button-and-tip"
            data-html={true}
            data-tip="<b>ATTENTION:</b> <br> You may skip the initial blockchain download, but be aware that<br>
                      all transactions may not be found until the chain is fully synced.<br>
                      As a result, your balance may be incorrect until fully synced.">
            <KeyBlueButton
              className="get-started-button-skip-sync"
              onClick={doSkipDaemonSync}
            >Skip sync</KeyBlueButton>
          </span>
          <ReactToolTip place="left" type="info" effect="solid"/>
        </div>
        <LinearProgress
          mode="determinate"
          min={0}
          max={getNeededBlocks}
          value={getCurrentBlockCount}
        />
        <p>
          <span>{getEstimatedTimeLeft}</span> <span>{getCurrentBlockCount}/{getNeededBlocks}</span>
        </p>
      </div> :
      <div></div> }
    </div>
  );

export { DaemonLoadingFormHeader, DaemonLoadingFormBody };
