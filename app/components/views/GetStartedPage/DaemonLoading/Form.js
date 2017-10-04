import React from "react";
import Header from "../../../Header";
import LinearProgress from "material-ui/LinearProgress";
import KeyBlueButton from "../../../KeyBlueButton";
import { FormattedMessage, FormattedRelative, injectIntl, defineMessages } from "react-intl";
import "../../../../style/GetStarted.less";
import ReactToolTip from "react-tooltip";

const messages = defineMessages({
  skipBtnTip: {
    id: "getStarted.chainLoading.skipBtn.tip",
    defaultMessage: `ATTENTION<br>
      You may skip the initial blockchain download, but be aware that
      all transactions may not be found until the chain is fully synced.
      As a result, your balance may be incorrect until fully synced.`
  }
});

const DaemonLoadingFormHeader = ({
  startupError,
  getDaemonStarted,
  getCurrentBlockCount,
}) => (
  <Header getStarted
    headerTitleOverview={<FormattedMessage id="getStarted.header.title" defaultMessage="Setting up Decrediton" />}
    headerMetaOverview={getDaemonStarted
      ? getCurrentBlockCount == null
        ? <FormattedMessage id="getStarted.header.daemonLoading.meta" defaultMessage="Preparing background process" />
        : <FormattedMessage id="getStarted.header.downloadingBlockchain.meta" defaultMessage="Downloading blockchain" />
      : <FormattedMessage id="getStarted.header.startingProcess.meta" defaultMessage="Starting background process" />}
    headerTop={startupError
      ? <div key="pubError" className="get-started-view-notification-error">{startupError}</div>
      : <div key="pubError" ></div>}
  />
);

const DaemonLoadingFormBodyBase = ({
    getCurrentBlockCount,
    getDaemonStarted,
    getNeededBlocks,
    doSkipDaemonSync,
    showLongWaitMessage,
    finishDateEstimation,
    intl
  }) => (
    <div className="get-started-content-new-seed">
    {getDaemonStarted ? getCurrentBlockCount == null ?
      showLongWaitMessage ?
      <div className="get-started-fetch-headers-message">
        <FormattedMessage id="getStarted.chainLoading" defaultMessage="The Decred chain is currently loading and may take a few minutes." />
      </div> :
      <div></div> :
      <div className="get-started-content-instructions">
        <div className="get-started-content-instructions-blockchain-syncing">
          <div className="get-started-instructions-txt">
            <FormattedMessage id="getStarted.chainLoadingDelayReminder" defaultMessage="If you are starting decrediton for the first time, this may take a while." />
          </div>
          <span
            className="get-started-skip-sync-button-and-tip"
            data-multiline={true}
            data-tip={intl.formatMessage(messages.skipBtnTip)}>
            <KeyBlueButton
              className="get-started-button-skip-sync"
              onClick={doSkipDaemonSync}
            >
              <FormattedMessage id="getStarted.chainLoading.skipBtn" defaultMessage="Skip Sync" />
            </KeyBlueButton>
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
          <FormattedMessage
            id="getStarted.chainLoading.syncEstimation"
            defaultMessage="Estimated ending {timeEstimation} ({currentBlockCount} / {neededBlocks})"
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
const DaemonLoadingFormBody = injectIntl(DaemonLoadingFormBodyBase);

export { DaemonLoadingFormHeader, DaemonLoadingFormBody };
