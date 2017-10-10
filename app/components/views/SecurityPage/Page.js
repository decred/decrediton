import React from "react";
import PropTypes from "prop-types";
import ReactToolTip from "react-tooltip";
import SecurityPageHeader from "./Header";
import "../../../style/Layout.less";
import "../../../style/StakePool.less";

const SecurityPage = ({
  onToggleSecurityMessage,
  children,
}) => {
  return (
    <div className="page-view">
      <SecurityPageHeader {...{ onToggleSecurityMessage }} />
      {children}
      <ReactToolTip type="info" effect="solid" />
    </div>
  );
};

SecurityPage.propTypes = {
  onToggleSecurityMessage: PropTypes.func.isRequired,
  children: PropTypes.object.isRequired,
};

export default SecurityPage;
