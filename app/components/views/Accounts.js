// @flow
import React, { Component, PropTypes } from 'react';
import ErrorScreen from '../ErrorScreen';
import SideBar from '../SideBar';
import Header from '../Header';
import Balance from '../Balance';
import KeyBlueButton from '../KeyBlueButton';
import SlateGrayButton from '../SlateGrayButton';
import CircularProgress from 'material-ui/CircularProgress';
import { AccountStyles } from './ViewStyles.js';
import AccountRow from '../AccountRow';

class Accounts extends Component{
  static propTypes = {
    walletService: PropTypes.object,
  };
  constructor(props)  {
    super(props);
    this.state = {
      showAddAccount: false,
      showAccountDetails: false,
      showAccountDetailsAccount: null,
      showRenameAccount: false,
      renameAccountName: '',
      renameAccountNumber: -1,
      addAccountName: '',
      privpass: null,
      accountRenameNameError: null,
      addAccountNameError: null,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.getAccountsResponse != nextProps.getAccountsResponse) {
      this.setState({showRenameAccount: false, showAccountDetails: false, showAccountDetailsAccount: null});
    }
  }
  componentWillMount() {
    this.props.clearNewAccountSuccess();
    this.props.clearNewAccountError();
    this.props.clearRenameAccountSuccess();
    this.props.clearRenameAccountError();
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
    this.props.clearNewAccountSuccess();
    this.props.clearNewAccountError();
    this.props.clearRenameAccountSuccess();
    this.props.clearRenameAccountError();
  }
  hideAddAccount() {
    this.setState({showAddAccount: false, addAccountName: '', privpass: null});
    this.props.clearNewAccountSuccess();
    this.props.clearNewAccountError();
    this.props.clearRenameAccountSuccess();
    this.props.clearRenameAccountError();
  }
  showRenameAccount(accountNumber) {
    this.setState({showRenameAccount: true, renameAccountNumber: accountNumber, renameAccountName: ''});
    this.props.clearNewAccountSuccess();
    this.props.clearNewAccountError();
    this.props.clearRenameAccountSuccess();
    this.props.clearRenameAccountError();
  }
  hideRenameAccount() {
    this.setState({showRenameAccount:false, renameAccountNumber: -1, renameAccountName: ''});
    this.props.clearNewAccountSuccess();
    this.props.clearNewAccountError();
    this.props.clearRenameAccountSuccess();
    this.props.clearRenameAccountError();
  }
  renameAccount() {
    if (this.state.renameAccountName == '' || this.state.renameAccountNumber == -1) {
      console.log(this.state.renameAccountNumber, this.state.renameAccountName);
      return;
    }
    this.props.renameAccountAttempt(this.state.renameAccountNumber, this.state.renameAccountName);
    this.hideRenameAccount();
  }
  showAccountDetailsView(account) {
    this.setState({showAccountDetails: true, showAccountDetailsAccount: account});
    this.props.clearNewAccountSuccess();
    this.props.clearNewAccountError();
    this.props.clearRenameAccountSuccess();
    this.props.clearRenameAccountError();
  }
  hideAccountDetails() {
    this.setState({showAccountDetails: false, showAccountDetailsAccount: null});
    this.props.clearNewAccountSuccess();
    this.props.clearNewAccountError();
    this.props.clearRenameAccountSuccess();
    this.props.clearRenameAccountError();
  }
  updateAddAccountName(accountName) {
    this.setState({addAccountName: accountName});
  }
  updateRenameAccountName(accountName) {
    this.setState({renameAccountName: accountName});
  }
  render() {
    const { walletService, getAccountsResponse } = this.props;
    const { getNextAccountError, getNextAccountSuccess } = this.props;
    const { getNextAccountRequestAttempt } = this.props;
    const { renameAccountError, renameAccountSuccess } = this.props;
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
            renameAccountSuccess !== null ?
            <div key="renameAccountSuccess" style={AccountStyles.viewNotificationSuccess}><div style={AccountStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearRenameAccountSuccess()}></div>{renameAccountSuccess}</div> :
            <div key="renameAccountSuccess" ></div>,
          ]}
          headerMetaOverview={
            <KeyBlueButton
            style={AccountStyles.contentAddNewAccount}
            onClick={() => this.showAddAccount()}>
            Add New Account
            </KeyBlueButton>
          }
        />
        <div style={AccountStyles.content}>
          {getNextAccountRequestAttempt ?
            <div style={AccountStyles.content}>
              <CircularProgress style={AccountStyles.loading} size={125} thickness={6}/>
            </div> :
            getAccountsResponse !== null ?
              <div style={AccountStyles.contentNest}>
              {getAccountsResponse.getAccountsList().map((account) => {
                if (account.getAccountName() !== 'imported') {
                  return (<AccountRow key={account.getAccountName()} account={account} onClick={() => this.showAccountDetailsView(account)}/>);
                }
              })}
              </div>:
              <div></div>
            }
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
            <div style={AccountStyles.accountFormRow}>
              <div style={AccountStyles.accountFormLabel}>Account Name:</div>
              <div style={AccountStyles.accountFormInput}>
                <div style={AccountStyles.inputForm}>
                  <input
                    type="text"
                    style={AccountStyles.contentNestAddressHashTo}
                    placeholder="New Account Name"
                    maxLength="50"
                    onBlur={(e) =>{this.updateAddAccountName(e.target.value);}}/>
                </div>
              </div>
              <div style={AccountStyles.accountFormInputError}>
                {this.state.addAccountNameError}sdfsadf
              </div>
            </div>
            <div style={AccountStyles.accountFormRow} key="privatePassPhrase">
              <div style={AccountStyles.accountFormLabel}>Private Passhrase:</div>
              <div style={AccountStyles.accountFormInput}>
                <div style={AccountStyles.inputForm}>
                  <input
                    id="privpass"
                    style={AccountStyles.contentNestAddressHashTo}
                    type="password"
                    placeholder="Private Password"
                    onBlur={(e) =>{this.setState({privpass: Buffer.from(e.target.value)});}}/>
                </div>
              </div>
              <div style={AccountStyles.accountFormInputError}>
                {this.state.addAccountPrivPassError}tests1
              </div>
            </div>
          </div>
          <KeyBlueButton
           style={AccountStyles.contentConfirmNewAccount}
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
    const accountDetails = (
      <div style={AccountStyles.view}>
        <Header
          headerTitleOverview={[<div key={1}>Total account balance</div>,
            <SlateGrayButton key="back" style={{float: 'right'}} onClick={() => this.hideAccountDetails()}>back</SlateGrayButton>]}
          headerTop={renameAccountError !== null ?
            <div key="renameAccountError" style={AccountStyles.viewNotificationError}><div style={AccountStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearRenameAccountError()}>{renameAccountError}</div></div> :
            <div key="renameAccountError" ></div>
          }
          headerMetaOverview={
              this.state.showAccountDetailsAccount !== null?
             <Balance amount={this.state.showAccountDetailsAccount.getTotalBalance()}/>:
             <div></div>
          }
        />
        <div style={AccountStyles.content}>
          {this.state.showAccountDetailsAccount !== null ?
          <div>
            <div style={AccountStyles.accountDetailsRow}>
              <div style={AccountStyles.accountDetailsLabel}>Account Name:</div>
              <div style={AccountStyles.accountDetailsInput}>
                {this.state.showAccountDetailsAccount.getAccountName()}
              </div>
            </div>
            <div style={AccountStyles.accountDetailsRow}>
              <div style={AccountStyles.accountDetailsLabel}>Account Number:</div>
              <div style={AccountStyles.accountDetailsInput}>
                {this.state.showAccountDetailsAccount.getAccountNumber()}
              </div>
            </div>
            <KeyBlueButton
              style={AccountStyles.contentConfirmNewAccount}
              onClick={() => this.showRenameAccount(this.state.showAccountDetailsAccount.getAccountNumber())}>
              Rename Account
            </KeyBlueButton>
          </div>
          :
          <div></div>
          }
        </div>
      </div>
    );
    const renameAccount = (
      <div style={AccountStyles.view}>
        <Header
        headerTitleOverview="Rename Account"
        />
        <div style={AccountStyles.content}>
          <div style={AccountStyles.flexHeight}>
            <div style={AccountStyles.accountFormRow}>
              <div style={AccountStyles.accountFormLabel}>New Account Name:</div>
              <div style={AccountStyles.accountFormInput}>
                <div style={AccountStyles.inputForm}>
                  <input
                    type="text"
                    style={AccountStyles.contentNestAddressHashTo}
                    placeholder="New Account Name"
                    maxLength="50"
                    onBlur={(e) =>{this.updateRenameAccountName(e.target.value);}}/>
                </div>
              </div>
              <div style={AccountStyles.accountFormInputError}>
                {this.state.accountRenameNameError}teste
              </div>
            </div>
          </div>
          <KeyBlueButton
           style={AccountStyles.contentConfirmNewAccount}
           onClick={() => this.renameAccount()}>
           Rename
          </KeyBlueButton>
          <SlateGrayButton
           style={AccountStyles.contentHideNewAccount}
           onClick={() => this.hideRenameAccount()}>
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
            !this.state.showAccountDetails ?
              accountsView :
                !this.state.showRenameAccount ?
                  accountDetails :
                    renameAccount :
            addAccountView
          }
        </div>);
    }
  }
}

export default Accounts;
