// @flow
import React, {Component} from "react";
import Header from "Header";
import HelpLink from "HelpLink";
import { FormattedMessage as T } from "react-intl";
import "style/Layout.less";
import "style/Help.less";

class Help extends Component{
  render() {
    return (
      <div className="page-view">
        <Header
          headerTitleOverview={<T id="help.title" m="Help" />}
        />
        <div className="page-content">
          <HelpLink className={"help-forum-icon"} href="https://forum.decred.org"><T id="help.forum" m="Forum" /> </HelpLink>
          <HelpLink className={"help-docs-icon"} href="https://docs.decred.org/"><T id="help.documentation" m="Documentation" /></HelpLink>
          <HelpLink className={"help-stakepools-icon"} href="https://decred.org/#modalOpen"><T id="help.stakepools" m=" Stakepools Overview" /></HelpLink>
          <HelpLink className={"help-github-icon"} href="https://github.com/decred/decrediton"><T id="help.github" m="Github" /></HelpLink>
          <HelpLink className={"help-freenode-icon"} href="https://github.com/decred/decrediton"><T id="help.freenode" m="Freenode" /></HelpLink>
        </div>
      </div>
    );
  }
}

export default Help;
