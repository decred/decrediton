// @flow
import React, {Component} from 'react';
import ErrorScreen from '../ErrorScreen';
import SideBar from '../SideBar';
import Header from '../Header';
import HelpLink from '../HelpLink';

const styles = {
  body: {
    position: 'fixed',
    left: '0px',
    top: '50%',
    right: '0px',
    display: 'block',
    overflow: 'hidden',
    width: '1178px',
    height: '770px',
    marginTop: '-385px',
    marginRight: 'auto',
    marginLeft: 'auto',
    backgroundColor: '#FFF',
  },
  view: {
    width: '880px',
    height: '100%',
    float: 'right',
    backgroundColor: '#f3f6f6',
  },
  content: {
    overflow: 'auto',
    height: '556px',
    padding: '54px 60px 54px 80px',
  },
  img: {
    width: '250px',
    paddingLeft: '244px',
  },
  center: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  }
};

class Help extends Component{
  render() {
    const helpView = (
      <div style={styles.view}>
        <Header
          headerTitleOverview="Help"
        />
        <div style={styles.content}>
            <HelpLink href="https://forum.decred.org">Forum</HelpLink>
            <HelpLink href="https://decred.slack.com">Chat</HelpLink>
            <HelpLink href="https://github.com/decred/decrediton/issues">Issues</HelpLink>
        </div>
      </div>
    );

    return(
      <div style={styles.body}>
        <SideBar />
        {helpView}
      </div>);
    
  }
}

export default Help;
