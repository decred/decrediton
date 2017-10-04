import React from "react";
import PropTypes from "prop-types";
import ReactToolTip from "react-tooltip";
import SideBar from "../../SideBar";
import SignMessage from "../../SignMessage";
import VerifyMessage from "../../VerifyMessage";
import SecurityPageHeader from "./Header";
import "../../../style/Layout.less";
import "../../../style/StakePool.less";

const SecurityPage = ({
  isShowingVerifyMessage,
  onToggleSecurityMessage,
}) => {
  return (
    <div className="page-body">
      <SideBar />
      <div className="page-view">
        <SecurityPageHeader {...{ onToggleSecurityMessage }} />
        {isShowingVerifyMessage
            ? <VerifyMessage />
            : <SignMessage />
        }
      </div>
      <ReactToolTip type="info" effect="solid" />
    </div>
  );
};

SecurityPage.propTypes = {
  isShowingVerify: PropTypes.bool,
  onToggleSecurityMessage: PropTypes.func.isRequired,
};

export default SecurityPage;
