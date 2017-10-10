// @flow
import React from "react";
import "../../style/Header.less";

const Header = ({
  iconClassName, title, description, tabRoutes
}) => (
  <div>
    <div className="header">
      <div className="header-top"></div>

      <div className="header-title-overview">
        {title}
      </div>

      <div className="header-meta-overview">
        {description}
      </div>

      <div className="header-tabs">
        {tabRoutes.map(tabRoute => (
          <div className="header-tab">
            <div className="header-tab-title">{tabRoute.title}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Header;
