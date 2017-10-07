// @flow
import React, {Component} from "react";
import Header from "../Header";
import HelpLink from "../HelpLink";
import { FormattedMessage as T } from "react-intl";
import "../../style/Layout.less";

class Help extends Component{
  render() {
    return (
      <div className="page-view">
        <Header
          headerTitleOverview={<T id="help.title" m="Help" />}
        />
        <div className="page-content">
            <HelpLink href="https://forum.decred.org"><T id="help.forum" m="Forum" /> </HelpLink>
            <HelpLink href="https://decred.slack.com"><T id="help.chat" m="Chat" /></HelpLink>
            <HelpLink href="https://docs.decred.org/"><T id="help.documentation" m="Documentation" /></HelpLink>
            <HelpLink href="https://decred.org/#modalOpen"><T id="help.stakepools" m=" Stakepools Overview" /></HelpLink>
            <HelpLink href="https://github.com/decred/decrediton/issues"><T id="help.issues" m="Issues" /></HelpLink>
        </div>
      </div>
    );
  }
}

export default Help;
