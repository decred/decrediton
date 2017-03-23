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
  contentNestToAddress: {
    width: '100%',
    height: '54px',
    paddingTop: '10px',
    float: 'left',
  },
  contentNestPrefixSend: {
    width: '200px',
    paddingRight: '15px',
    float: 'left',
    height: '100%',
    paddingTop: '5px',
    fontSize: '19px',
    textAlign: 'right',
    textTransform: 'capitalize',
  },
  contentNestAddressHashBlock: {
    position: 'relative',
    overflow: 'hidden',
    width: '311px',
    height: '34px',
    float: 'left',
    borderBottom: '1px solid #a9b4bf',
    fontSize: '13px',
  },
  inputForm: {
    position: 'relative',
    width: '100%',
    height: 'auto',
    minHeight: '44px',
  },
  contentNestAddressHashTo: {
    width: '96%',
    height: '100%',
    padding: '9px 0px 8px 10px',
    borderStyle: 'none',
    color: '#2971ff',
    fontSize: '13px',
    cursor: 'text',
    ':focus': {
      color: '#2971ff',
    },
  },
  viewNotificationError: {
    display: 'inline-block',
    marginRight: 'auto',
    marginLeft: 'auto',
    padding: '7px 20px',
    borderRadius: '5px',
    backgroundColor: '#fd714b',
    boxShadow: '0 3px 10px 0 rgba(0, 0, 0, .2)',
    color: '#fff',
    fontSize: '13px',
    textAlign: 'center',
  },
  viewNotificationSuccess: {
    display: 'inline-block',
    marginRight: 'auto',
    marginLeft: 'auto',
    padding: '7px 20px',
    borderRadius: '5px',
    backgroundColor: '#41bf53',
    boxShadow: '0 3px 10px 0 rgba(0, 0, 0, .2)',
    color: '#fff',
    fontSize: '13px',
    textAlign: 'center',
    textDecoration: 'none',
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
      addAccountName: '',
      privpass: null,
    };
  }
  addAccount() {
    if (this.state.addAccountName == '' || this.state.privpass == null) {
      return;
    }
    this.props.getNextAccountAttempt(this.state.privpass, this.state.addAccountName);
    setTimeout(this.setState({showAddAccount: false}),1000);
  }
  showAddAccount() {
    this.setState({showAddAccount: true});
  }
  hideAddAccount() {
    this.setState({showAddAccount: false, addAccountName: '', privpass: null});
  }
  updateAddAccountName(accountName) {
    this.setState({addAccountName: accountName});
  }
  render() {
    const { walletService, getAccountsResponse } = this.props;
    const { getNextAccountError, getNextAccountSuccess } = this.props;
    const accountsView = (
      <div style={styles.view}>
        <Header
          headerTitleOverview="Account Management"
          headerTop={[getNextAccountError !== null ?
            <div key="accountError" style={styles.viewNotificationError}>{getNextAccountError}</div> :
            <div key="accountError" ></div>,
            getNextAccountSuccess !== '' ?
            <div key="accountSuccess" style={styles.viewNotificationSuccess}>{getNextAccountSuccess}</div> :
            <div key="accountSuccess" ></div>,
          ]}
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
          headerTop={[getNextAccountError !== null ?
            <div key="accountError" style={styles.viewNotificationError}>{getNextAccountError}</div> :
            <div key="accountError" ></div>,
            getNextAccountSuccess !== '' ?
            <div key="accountSuccess" style={styles.viewNotificationSuccess}>{getNextAccountSuccess}</div> :
            <div key="accountSuccess" ></div>,
          ]}
        />
        <div style={styles.content}>
          <div style={styles.flexHeight}>
            <div style={styles.contentNestToAddress}>
              <div style={styles.contentNestPrefixSend}>To:</div>
              <div style={styles.contentNestAddressHashBlock}>
                <div style={styles.inputForm}>
                  <input
                    type="text"
                    style={styles.contentNestAddressHashTo}
                    placeholder="New Account Name"
                    onBlur={(e) =>{this.updateAddAccountName(e.target.value);}}/>
                </div>
              </div>
            </div>
            <div style={styles.contentNestToAddress} key="privatePassPhrase">
              <div style={styles.contentNestPrefixSend}>Private Passhrase:</div>
              <div style={styles.contentNestAddressHashBlock}>
                <div style={styles.inputForm}>
                  <input
                    id="privpass"
                    style={styles.contentNestAddressHashTo}
                    type="password"
                    placeholder="Private Password"
                    onBlur={(e) =>{this.setState({privpass: Buffer.from(e.target.value)});}}/>
                </div>
              </div>
            </div>
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
