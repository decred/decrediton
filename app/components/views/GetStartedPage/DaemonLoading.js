import React from "react";
import Header from "../../Header";
import ShowError from "../../ShowError";
import "../../../style/GetStarted.less";

const DaemonLoading = ({
  getLoaderError,
  getVersionServiceError
}) => (
  <div className="get-started-view">
    <Header getStarted headerTitleOverview="Starting DCRD..." />
    <div className="get-started-content">
      <div className="get-started-content-title">
        <div className="get-started-content-title-text">checking wallet state...</div>
      </div>
      <div className="get-started-content-nest">
        <div>
          <ShowError error={getLoaderError} />
          <ShowError error={getVersionServiceError}/>
        </div>
      </div>
    </div>
  </div>
);

export default DaemonLoading;
