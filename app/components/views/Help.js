// @flow
import React, {Component} from 'react';
import SideBar from '../SideBar';
import Header from '../Header';
import HelpLink from '../HelpLink';
import { HelpStyles } from './ViewStyles';

class Help extends Component{
  render() {
    const helpView = (
      <div style={HelpStyles.view}>
        <Header
          headerTitleOverview="Help"
        />
        <div style={HelpStyles.content}>
            <HelpLink href="https://forum.decred.org">Forum</HelpLink>
            <HelpLink href="https://decred.slack.com">Chat</HelpLink>
            <HelpLink href="https://docs.decred.org/">Documentation</HelpLink>
            <HelpLink href="http://decred.org/index.html#modalOpen">Stakepools Overview</HelpLink>
            <HelpLink href="https://github.com/decred/decrediton/issues">Issues</HelpLink>
        </div>
      </div>
    );

    return(
      <div style={HelpStyles.body}>
        <SideBar />
        {helpView}
      </div>);

  }
}

export default Help;
