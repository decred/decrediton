import React from "react";
import Header from "../../../Header";
import "../../../../style/GetStarted.less";

const FetchBlockHeadersFormHeader = ({
  startupError
}) => (
  <Header
    getStarted
    headerTitleOverview="Setting up Decrediton"
    headerMetaOverview="Fetching block headers"
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
      If you are syncing the blockchain for the first time, this may take a while.
    </div>
   ) : null;
};

export { FetchBlockHeadersFormHeader, FetchBlockHeadersFormBody };
