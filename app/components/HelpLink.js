import React from "react";
import { shell } from "electron";
import "../style/MiscComponents.less";

const HelpLink = ({ href, children }) => (
  <a className="help-link" onClick={() => shell.openExternal(href)}>{children}</a>
);

export default HelpLink;
