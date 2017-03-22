// @flow
import React, { Component, PropTypes } from 'react';
import ErrorScreen from '../ErrorScreen';
import SideBar from '../SideBar';
import Header from '../Header';

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
  transition1: {
    transition: 'all 100ms cubic-bezier(.86, 0, .07, 1)',
  },
  contentTitle: {
    display: 'block',
    height: '44px',
    marginRight: 'auto',
    marginBottom: '10px',
    marginLeft: 'auto',
    borderBottom: '1px solid transparent',
    color: '#596d81',
    fontSize: '27px',
    transition: 'all 250ms cubic-bezier(.86, 0, .07, 1)',
  },
  contentNest: {
    paddingTop: '1px',
  },
  contentTitleText: {
    display: 'inline-block',
    overflow: 'hidden',
    width: '500px',
    height: '100%',
    paddingTop: '13px',
    paddingRight: '20px',
    paddingLeft: '20px',
    float: 'left',
  },
  contentTitleButtonsArea: {
    float: 'right',
    height: '100%',
    paddingTop: '13px',
  },
  contentTitleButtonsText: {
    padding: '0px 10px 0px 10px',
  },
  contentTitleButtonsLeft: {
    marginTop: '3px',
    display: 'block',
    float: 'left',
    fontFamily: 'Inconsolata, monospace',
  },
  contentTitleButtonsRight: {
    marginTop: '3px',
    display: 'block',
    float: 'right',
    fontFamily: 'Inconsolata, monospace',
  }
};

class Accounts extends Component{
  static propTypes = {
    walletService: PropTypes.object,
  };

  render() {
    const { walletService, getAccountsResponse } = this.props;

    const accountsView = (
      <div style={styles.view}>
        <Header
          headerTitleOverview="Account Management"
        />
        <div style={styles.content}>
          <div style={styles.contentTitle}>
            <div style={styles.contentTitleText}>Accounts</div>
          </div>
          <div style={styles.contentNest}>
          </div>
        </div>
      </div>);
    if (walletService === null) {
      return (<ErrorScreen />);
    } else {
      return(
        <div style={styles.body}>
          <SideBar />
          {accountsView}
        </div>);
    }
  }
}

export default Accounts;
