import React from "react";
import { GetStartedStyles } from "../ViewStyles";
import Header from "../../Header";

const FinalStartUp = () => (
  <div style={GetStartedStyles.view}>
    <Header getStarted headerTitleOverview="Final start up" />
    <div style={GetStartedStyles.content}>
      <div style={GetStartedStyles.contentTitle}>
        <div style={GetStartedStyles.contentTitleText}>Last steps if needed</div>
      </div>
      <div style={GetStartedStyles.contentNest}>
      </div>
    </div>
  </div>
);

export default FinalStartUp;
