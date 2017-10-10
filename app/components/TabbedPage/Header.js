// @flow
import React from "react";
import { Link } from "react-router";
import "../../style/Header.less";

const Header = ({
  iconClassName, title, description, tabRoutes
}) => (
  <div>
    <div className="header">
      <div className="header-top"></div>

      <div className="tabbedheader-title">
        <span className={"tabbedheader-icon " + (iconClassName ? iconClassName : "")} />
        {title}
      </div>

      <div className="tabbedheader-description">
        {description}
      </div>

      <div className="tabbedheader-tabs">
        {tabRoutes.map(tabRoute => (
          <Link
            to={tabRoute.route}
            className="tabbedheader-tab"
            activeClassName="active"
            key={tabRoute.route}
          >
            {tabRoute.title}
          </Link>
        ))}
      </div>
    </div>
  </div>
);

export default Header;
