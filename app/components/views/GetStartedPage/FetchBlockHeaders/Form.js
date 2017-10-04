import React from "react";
import Header from "../../../Header";
import { FormattedMessage as T } from "react-intl";
import "../../../../style/GetStarted.less";

const FetchBlockHeadersFormHeader = ({
  startupError
}) => (
  <Header
    getStarted
    headerTitleOverview={<T id="getStarted.header.title" m="Setting up Decrediton" />}
    headerMetaOverview={<T id="getStarted.header.fetchingBlockHeaders.meta" m="Fetching block headers" />}
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
      <T id="getStarted.firstTimeSyncDelayReminder" m="If you are syncing the blockchain for the first time, this may take a while." />
    </div>
   ) : null;
};

export { FetchBlockHeadersFormHeader, FetchBlockHeadersFormBody };
