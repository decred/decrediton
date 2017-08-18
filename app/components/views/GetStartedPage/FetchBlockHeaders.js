import React from "react";
import { GetStartedStyles } from "../ViewStyles";
import Header from "../../Header";
import DecredLoading from "../../DecredLoading";

const FetchBlockHeaders = ({
  startupError,
  isProcessing
}) => (
  <div style={GetStartedStyles.view}>
    <Header
      getStarted
      headerTop={startupError
        ? <div key="fetchHeadersError" style={GetStartedStyles.viewNotificationError}>{startupError}</div>
        : <div key="fetchHeadersError" ></div>}
      headerTitleOverview="Fetching block headers"/>
    <div style={GetStartedStyles.contentNewSeed}>
      {isProcessing ? (
        <div>
          <DecredLoading/>
          <div style={GetStartedStyles.fetchHeadersMessage}> If you are syncing the blockchain for the first time, this may take a while. </div>
        </div>
      ) : null}
    </div>
  </div>
);

export default FetchBlockHeaders;
