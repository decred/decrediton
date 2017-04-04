// @flow
import React, { Component, PropTypes } from 'react';
import ErrorScreen from '../ErrorScreen';
import SideBar from '../SideBar';
import Header from '../Header';
import Balance from '../Balance';
import KeyBlueButton from '../KeyBlueButton';
import SlateGrayButton from '../SlateGrayButton';
import CircularProgress from 'material-ui/CircularProgress';
import AccountStyles from './ViewStyles.js';

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
  componentWillMount() {
    this.props.clearNewAccountSuccess();
    this.props.clearNewAccountError();
  }
  addAccount() {
    if (this.state.addAccountName == '' || this.state.privpass == null) {
      return;
    }
    this.props.getNextAccountAttempt(this.state.privpass, this.state.addAccountName);
    this.hideAddAccount();
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
    const { getNextAccountRequestAttempt } = this.props;
    const accountsView = (
      <div style={AccountStyles.view}>
        <Header
          headerTitleOverview="Account Management"
          headerTop={[getNextAccountError !== null ?
            <div key="accountError" style={AccountStyles.viewNotificationError}><div style={AccountStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearNewAccountError()}></div>{getNextAccountError}</div> :
            <div key="accountError" ></div>,
            getNextAccountSuccess !== null ?
            <div key="accountSuccess" style={AccountStyles.viewNotificationSuccess}><div style={AccountStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearNewAccountSuccess()}></div>{getNextAccountSuccess}</div> :
            <div key="accountSuccess" ></div>,
          ]}
        />
        <div style={AccountStyles.content}>
          {getNextAccountRequestAttempt ?
            <div style={AccountStyles.content}>
              <CircularProgress style={AccountStyles.loading} size={125} thickness={6}/>
            </div> :
            getAccountsResponse !== null ?
              <div style={AccountStyles.flexHeight}>
              {getAccountsResponse.getAccountsList().map(function(account) {
                return (
                <div style={AccountStyles.accountRow} key={account.getAccountName()}>
                  <span style={AccountStyles.accountName}>{account.getAccountName()}</span>
                  <span style={AccountStyles.accountBalance}><Balance amount={account.getTotalBalance()}/></span>
                </div>);
              })}
              </div>  :
              <div></div>
            }

          <KeyBlueButton
           style={AccountStyles.contentAddNewAccount}
           onClick={() => this.showAddAccount()}>
           Add New Account
          </KeyBlueButton>
        </div>
      </div>);
    const addAccountView = (
      <div style={AccountStyles.view}>
        <Header
          headerTitleOverview="Account Management"
          headerTop={[getNextAccountError !== null ?
            <div key="accountError" style={AccountStyles.viewNotificationError}>{getNextAccountError}</div> :
            <div key="accountError" ></div>,
            getNextAccountSuccess !== null ?
            <div key="accountSuccess" style={AccountStyles.viewNotificationSuccess}>{getNextAccountSuccess}</div> :
            <div key="accountSuccess" ></div>,
          ]}
        />

        <div style={AccountStyles.content}>
          <div style={AccountStyles.flexHeight}>
            <div style={AccountStyles.contentNestToAddress}>
              <div style={AccountStyles.contentNestPrefixSend}>Account Name:</div>
              <div style={AccountStyles.contentNestAddressHashBlock}>
                <div style={AccountStyles.inputForm}>
                  <input
                    type="text"
                    style={AccountStyles.contentNestAddressHashTo}
                    placeholder="New Account Name"
                    maxLength="50"
                    onBlur={(e) =>{this.updateAddAccountName(e.target.value);}}/>
                </div>
              </div>
            </div>
            <div style={AccountStyles.contentNestToAddress} key="privatePassPhrase">
              <div style={AccountStyles.contentNestPrefixSend}>Private Passhrase:</div>
              <div style={AccountStyles.contentNestAddressHashBlock}>
                <div style={AccountStyles.inputForm}>
                  <input
                    id="privpass"
                    style={AccountStyles.contentNestAddressHashTo}
                    type="password"
                    placeholder="Private Password"
                    onBlur={(e) =>{this.setState({privpass: Buffer.from(e.target.value)});}}/>
                </div>
              </div>
            </div>
          </div>
          <KeyBlueButton
           style={AccountStyles.contentAddNewAccount}
           onClick={() => this.addAccount()}>
           Confirm
          </KeyBlueButton>
          <SlateGrayButton
           style={AccountStyles.contentHideNewAccount}
           onClick={() => this.hideAddAccount()}>
           Cancel
          </SlateGrayButton>
        </div>
        }
      </div>
    );
    if (walletService === null) {
      return (<ErrorScreen />);
    } else {
      return(
        <div style={AccountStyles.body}>
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
