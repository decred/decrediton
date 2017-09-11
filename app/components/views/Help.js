// @flow
import React, {Component} from "react";
import SideBar from "../SideBar";
import Header from "../Header";
import HelpLink from "../HelpLink";
import "../../style/Help.less";

class Help extends Component{
  render() {
    const helpView = (
      <div className="help-view">
        <Header
          headerTitleOverview="Help"
        />
        <div className="help-content">
            <HelpLink href="https://forum.decred.org">Forum</HelpLink>
            <HelpLink href="https://decred.slack.com">Chat</HelpLink>
            <HelpLink href="https://docs.decred.org/">Documentation</HelpLink>
            <HelpLink href="http://decred.org/index.html#modalOpen">Stakepools Overview</HelpLink>
            <HelpLink href="https://github.com/decred/decrediton/issues">Issues</HelpLink>
        </div>
      </div>
    );

    return(
      <div className="help-body">
        <SideBar />
        {helpView}
      </div>);

  }
}

export default Help;
