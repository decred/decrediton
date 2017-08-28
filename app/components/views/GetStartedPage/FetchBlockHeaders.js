import React from "react";
import Header from "../../Header";
import DecredLoading from "../../DecredLoading";
import "../../../style/GetStarted.less";

const FetchBlockHeaders = ({
  startupError,
  isProcessing
}) => (
  <div className="get-started-view">
    <Header
      getStarted
      headerTop={startupError
        ? <div key="fetchHeadersError" className="get-started-view-notification-error">{startupError}</div>
        : <div key="fetchHeadersError" ></div>}
      headerTitleOverview="Fetching block headers"/>
    <div className="get-started-content-new-seed">
      {isProcessing ? (
        <div>
          <DecredLoading/>
          <div className="get-started-fetch-headers-message">If you are syncing the blockchain for the first time, this may take a while.</div>
        </div>
      ) : null}
    </div>
  </div>
);

export default FetchBlockHeaders;
