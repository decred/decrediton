// @flow
import React, {Component} from "react";
import SideBar from "../SideBar";
import Header from "../Header";
import HelpLink from "../HelpLink";
import "../../style/Layout.less";

class Help extends Component{
  render() {
    const helpView = (
      <div className="page-view">
        <Header
          headerTitleOverview="Help"
        />
        <div className="page-content">
            <HelpLink href="https://forum.decred.org">Forum</HelpLink>
            <HelpLink href="https://decred.slack.com">Chat</HelpLink>
            <HelpLink href="https://docs.decred.org/">Documentation</HelpLink>
            <HelpLink href="https://decred.org/#modalOpen">Stakepools Overview</HelpLink>
            <HelpLink href="https://github.com/decred/decrediton/issues">Issues</HelpLink>
        </div>
      </div>
    );

    return(
      <div className="page-body">
        <SideBar />
        {helpView}
      </div>);

  }
}

export default Help;
