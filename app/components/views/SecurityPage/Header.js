import React from "react";
import PropTypes from "prop-types";
import Header from "../../Header";
import TextToggle from "../../TextToggle";
import "../../../style/StakePool.less";

const SecurityPageHeader = ({
  onToggleSecurityMessage,
}) => (
  <Header
    headerTitleOverview={
      <div style={{height: "100%"}}>
        <div style={{float: "left"}}>
          Security Center
        </div>
      </div>
    }
    headerMetaOverview={
      (
        <div>
          <div className="stakepool-toggle">
            <TextToggle
              activeButton={"left"}
              leftText={"Sign message"}
              rightText={"Verify message"}
              toggleAction={onToggleSecurityMessage}
            />
          </div>
        </div>
      )
    }
  />
);

SecurityPageHeader.propTypes = {
  onToggleSecurityMessage: PropTypes.func.isRequired,
};

export default SecurityPageHeader;
