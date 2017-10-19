import React from "react";
import ReactToolTip from "react-tooltip";
import SecurityPageHeader from "./Header";
import securityPageConnector from "connectors/securityPage";
import "style/Layout.less";
import "style/StakePool.less";

const SecurityPage = ({
  location,
  onToggleSecurityMessage,
  children,
}) => {
  return (
    <div className="page-view">
      <SecurityPageHeader {...{ onToggleSecurityMessage, location }} />
      {children}
      <ReactToolTip type="info" effect="solid" />
    </div>
  );
};

export default securityPageConnector(SecurityPage);
