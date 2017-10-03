import React from "react";
import Header from "../../../Header";
import { FormattedMessage } from "react-intl";
import "../../../../style/GetStarted.less";

const FetchBlockHeadersFormHeader = ({
  startupError
}) => (
  <Header
    getStarted
    headerTitleOverview={<FormattedMessage id="getStarted.header.title" defaultMessage="Setting up Decrediton" />}
    headerMetaOverview={<FormattedMessage id="getStarted.header.fetchingBlockHeaders.meta" defaultMessage="Fetching block headers" />}
    headerTop={startupError
      ? <div key="fetchHeadersError" className="get-started-view-notification-error">{startupError}</div>
      : <div key="fetchHeadersError" ></div>} />
);

const FetchBlockHeadersFormBody = ({
  isProcessing,
  showLongWaitMessage
}) => {
  return isProcessing && showLongWaitMessage ? (
    <div className="get-started-fetch-headers-message">
      <FormattedMessage id="getStarted.firstTimeSyncDelayReminder" defaultMessage="If you are syncing the blockchain for the first time, this may take a while." />
    </div>
   ) : null;
};

export { FetchBlockHeadersFormHeader, FetchBlockHeadersFormBody };
