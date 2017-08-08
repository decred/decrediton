// @flow
import React from "react";
import { shell } from "electron";
import "../style/MiscComponents.less";

class HelpLink extends React.Component {
  render() {
    return (
      <a className="help-link" onClick={function(x){shell.openExternal(x);}.bind(null, this.props.href)}>
        {this.props.children}
      </a>
    );
  }
}

export default HelpLink;
