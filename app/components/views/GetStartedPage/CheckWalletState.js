import React from "react";
import { GetStartedStyles } from "../ViewStyles";
import Header from "../../Header";
import ShowError from "../../ShowError";

const CheckWalletState = ({
  getLoaderError,
  getVersionServiceError
}) => (
  <div style={GetStartedStyles.view}>
    <Header getStarted headerTitleOverview="Getting started" />
    <div style={GetStartedStyles.content}>
      <div style={GetStartedStyles.contentTitle}>
        <div style={GetStartedStyles.contentTitleText}>checking wallet state...</div>
      </div>
      <div style={GetStartedStyles.contentNest}>
        <div>
          <ShowError error={getLoaderError} />
          <ShowError error={getVersionServiceError}/>
        </div>
      </div>
    </div>
  </div>
);

export default CheckWalletState;
