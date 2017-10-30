import React from "react";
import { shell } from "electron";
import "style/MiscComponents.less";

const HelpLink = ({ className, href, children }) => (
  <div className={className} onClick={() => shell.openExternal(href)}>
    <div className="help-text">
      {children}
    </div>
  </div>
);

export default HelpLink;
