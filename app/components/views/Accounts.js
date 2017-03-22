// @flow
import React, { Component, PropTypes } from 'react';
import ErrorScreen from '../ErrorScreen';
import SideBar from '../SideBar';
import Header from '../Header';
import Balance from '../Balance';
import KeyBlueButton from '../KeyBlueButton';
import SlateGrayButton from '../SlateGrayButton';
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
  },
  accountRow: {
    width: '100%',
    height: '54px',
    paddingTop: '10px',
    float: 'left',
    borderBottom: '1px black solid',
  },
  accountName: {
    width: '25%',
    paddingRight: '15px',
    float: 'left',
    height: '100%',
    paddingTop: '5px',
    fontSize: '19px',
    textAlign: 'right',
  },
  accountBalance: {
    width: '50%',
    float: 'left',
    height: '100%',
    paddingTop: '5px',
    fontSize: '19px',
    textAlign: 'right',
  },
  accountRename: {
    width: '25%',
    float: 'left',
    height: '100%',
    paddingTop: '5px',
    fontSize: '19px',
    textAlign: 'right',
  },
  flexHeight: {
    border: '1px black solid',
    backgroundColor: '#fff',
    height:'372px',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  contentAddNewAccount: {
    marginTop: '20px',
    float: 'left',
  },
  contentHideNewAccount: {
    marginTop: '20px',
    float: 'right',
  },
};

class Accounts extends Component{
  static propTypes = {
    walletService: PropTypes.object,
  };
  constructor(props)  {
    super(props);
    this.state = {
      showAddAccount: false,
    };
  }
  addAccount() {
    console.log("Add account");
  }
  showAddAccount() {
    this.setState({showAddAccount: true});
  }
  hideAddAccount() {
    this.setState({showAddAccount: false});
  }
  render() {
    const { walletService, getAccountsResponse } = this.props;

    const accountsView = (
      <div style={styles.view}>
        <Header
          headerTitleOverview="Account Management"
        />
        <div style={styles.content}>
          <div style={styles.flexHeight}>
            {getAccountsResponse !== null ?
              getAccountsResponse.getAccountsList().map(function(account) {
              return (
                <div style={styles.accountRow} key={account.getAccountName()}>
                  <span style={styles.accountName}>{account.getAccountName()}</span>
                  <span style={styles.accountBalance}><Balance amount={account.getTotalBalance()}/></span>
                </div>);
              }) :
              <div></div>
            }
          </div>
          <KeyBlueButton
           style={styles.contentAddNewAccount} 
           onClick={() => this.showAddAccount()}>
           Add New Account
          </KeyBlueButton>
        </div>
      </div>);
    const addAccountView = (
      <div style={styles.view}>
        <Header
          headerTitleOverview="Account Management"
        />
        <div style={styles.content}>
          <div style={styles.flexHeight}>
          </div>
          <KeyBlueButton
           style={styles.contentAddNewAccount} 
           onClick={() => this.addAccount()}>
           Confirm
          </KeyBlueButton>
          <SlateGrayButton
           style={styles.contentHideNewAccount} 
           onClick={() => this.hideAddAccount()}>
           Cancel
          </SlateGrayButton>
        </div>
      </div>
    );
    if (walletService === null) {
      return (<ErrorScreen />);
    } else {
      return(
        <div style={styles.body}>
          <SideBar />
          {!this.state.showAddAccount ? 
          accountsView :
          addAccountView
          }
        </div>);
    }
  }
}

export default Accounts;
