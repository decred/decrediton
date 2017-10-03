import React from "react";
import Header from "../../Header";
import { FormattedMessage } from "react-intl";
import "../../../style/GetStarted.less";

const DaemonLoading = () => (
  <div className="get-started-view">
    <Header getStarted headerTitleOverview={<FormattedMessage id="getStarted.startingDaemonsOverview" defaultMessage="Starting DCRD..." />} />
    <div className="get-started-content">
      <div className="get-started-content-title">
        <div className="get-started-content-title-text">
          <FormattedMessage id="getStarted.startingDaemons" defaultMessage="Starting daemon and wallet" />
        </div>
      </div>
      <div className="get-started-content-nest">
        <div>
        </div>
      </div>
    </div>
  </div>
);

export default DaemonLoading;
