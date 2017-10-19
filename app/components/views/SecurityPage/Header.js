import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage as T } from "react-intl";
import { Link } from "react-router";
import Header from "../../Header";
import "style/StakePool.less";

const SecurityPageHeader = ({ location }) => {
  let left = "text-toggle-button-left";
  let right = "text-toggle-button-right";
  const active = "text-toggle-button-active";
  location.pathname === "/security/sign" ? left = [left, active].join(" ") : right = [right, active].join(" ");
  return (
    <Header
      headerTitleOverview={
        <div style={{height: "100%"}}>
          <div style={{float: "left"}}>
            <T id="securitycenter.header.title" m="Security Center" />
          </div>
        </div>
      }
      headerMetaOverview={
        (
          <div>
            <div className="stakepool-toggle">
              <div className="text-toggle">
                <Link to="/security/sign" className={ left }>
                  <T id="securitycenter.header.toggle.sign" m="Sign message" />
                </Link>
                <Link to="/security/verify" className={ right }>
                  <T id="securitycenter.header.toggle.verify" m="Verify message" />
                </Link>
              </div>
            </div>
          </div>
        )
      }
    />
  );
};

SecurityPageHeader.propTypes = {
  location: PropTypes.object.isRequired
};

export default SecurityPageHeader;
