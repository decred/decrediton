// @flow
import React, {Component} from "react";
import SideBar from "../SideBar";
import Header from "../Header";
import HelpLink from "../HelpLink";
import { FormattedMessage } from "react-intl";
import "../../style/Layout.less";

class Help extends Component{
  render() {
    const helpView = (
      <div className="page-view">
        <Header
          headerTitleOverview={<FormattedMessage id="help.title" defaultMessage="Help" />}
        />
        <div className="page-content">
            <HelpLink href="https://forum.decred.org"><FormattedMessage id="help.forum" defaultMessage="Forum" /> </HelpLink>
            <HelpLink href="https://decred.slack.com"><FormattedMessage id="help.chat" defaultMessage="Chat" /></HelpLink>
            <HelpLink href="https://docs.decred.org/"><FormattedMessage id="help.documentation" defaultMessage="Documentation" /></HelpLink>
            <HelpLink href="https://decred.org/#modalOpen"><FormattedMessage id="help.stakepools" defaultMessage=" Stakepools Overview" /></HelpLink>
            <HelpLink href="https://github.com/decred/decrediton/issues"><FormattedMessage id="help.issues" defaultMessage="Issues" /></HelpLink>
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
