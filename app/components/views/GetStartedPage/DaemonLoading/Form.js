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
    headerMetaOverview={getDaemonStarted ? getCurrentBlockCount == null ? "Preparing backgorund process" : "Downloading blockchain" : "Starting background process"}
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
        <div className="get-started-content-instructions-blockchain-syncing">
          <span className="left">If you are starting decrediton for the first time, this may take a while.</span>
          <span className="right"
            data-html={true}
            data-tip="<b>ATTENTION:</b> <br> You may skip the initial blockchain download, but be aware that<br>
                      all transactions may not be found until the chain is fully synced.<br>
                      As a result, your balance may be incorrect until fully synced.">
            <KeyBlueButton
              className="get-started-view-button-key-blue-wallet-new-seed"
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
          <span className="left">{getEstimatedTimeLeft}</span> <span className="right">{getCurrentBlockCount}/{getNeededBlocks}</span>
        </p>
      </div> :
      <div></div> }
    </div>
  );

export { DaemonLoadingFormHeader, DaemonLoadingFormBody };
