// @flow
import React, { Component, } from 'react';
import { PropTypes } from 'prop-types';
import ErrorScreen from '../ErrorScreen';
import SideBar from '../SideBar';
import Header from '../Header';
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
      addAccountName: '',
      privpass: null,
      addAccountNameError: null,
      addAccountPrivPassError: null,
    };
  }
  componentWillMount() {
    this.props.clearNewAccountSuccess();
    this.props.clearNewAccountError();
    this.props.clearRenameAccountSuccess();
    this.props.clearRenameAccountError();
  }
  addAccount() {
    var checkErrors = false;
    if (this.state.addAccountName == '') {
      this.setState({addAccountNameError: '*You must enter an account name'});
      checkErrors = true;
    }
    if (this.state.privpass == null) {
      this.setState({addAccountPrivPassError: '*Please enter your private passphrase'});
      checkErrors = true;
    }
    if (this.state.addAccountNameError !== null || this.state.addAccountPrivPassError !== null ||
       checkErrors) {
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
  updateAddAccountName(accountName) {
    this.setState({addAccountName: accountName, addAccountNameError: null});
  }
  updatePrivPass(privpass) {
    this.setState({privpass: Buffer.from(privpass), addAccountPrivPassError: null});
  }
  render() {
    const { walletService, balances } = this.props;
    const { getNextAccountError, getNextAccountSuccess } = this.props;
    const { getNextAccountRequestAttempt } = this.props;
    const { renameAccountError, renameAccountSuccess } = this.props;
    var sortedBalances = balances;
    sortedBalances.sort(function(a, b) {
      return a.accountNumber - b.accountNumber;
    });
    const accountsView = (
      <div style={AccountStyles.view}>
        <Header
          headerTitleOverview="Accounts"
          headerTop={[getNextAccountError !== null ?
            <div key="accountError" style={AccountStyles.viewNotificationError}><div style={AccountStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearNewAccountError()}></div>{getNextAccountError}</div> :
            <div key="accountError" ></div>,
            getNextAccountSuccess !== null ?
            <div key="accountSuccess" style={AccountStyles.viewNotificationSuccess}><div style={AccountStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearNewAccountSuccess()}></div>{getNextAccountSuccess}</div> :
            <div key="accountSuccess" ></div>,
            renameAccountSuccess !== null ?
            <div key="renameAccountSuccess" style={AccountStyles.viewNotificationSuccess}><div style={AccountStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearRenameAccountSuccess()}></div>{renameAccountSuccess}</div> :
            <div key="renameAccountSuccess" ></div>,
            renameAccountError !== null ?
            <div key="renameAccountError" style={AccountStyles.viewNotificationError}><div style={AccountStyles.contentNestAddressDeleteIcon} onClick={() => this.props.clearRenameAccountError()}></div>{renameAccountError}</div> :
            <div key="renameAccountError" ></div>,
          ]}
          headerMetaOverview={
            <KeyBlueButton
            style={AccountStyles.contentAddNewAccount}
            onClick={() => this.showAddAccount()}>
            Add New
            </KeyBlueButton>
          }
        />
        <div style={AccountStyles.content}>
          {getNextAccountRequestAttempt ?
            <div style={AccountStyles.content}>
              <CircularProgress style={AccountStyles.loading} size={125} thickness={6}/>
            </div> :
            sortedBalances !== null ?
              <div style={AccountStyles.contentNest}>
              {sortedBalances.map((account) => {
                return (<AccountRow key={'accountRow' + account.accountName} account={account} renameAccount={(name, number) => this.props.renameAccountAttempt(name, number)} hideAccount={(name) => this.props.hideAccount(name)} showAccount={(name) => this.props.showAccount(name)}/>);
              })}
              </div>:
              <div></div>
            }
        </div>
      </div>);
    const addAccountView = (
      <div style={AccountStyles.view}>
        <Header
          headerTitleOverview="Accounts"
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
                    onBlur={(e) => this.updateAddAccountName(e.target.value)}/>
                </div>
              </div>
              <div style={AccountStyles.accountFormInputError}>
                {this.state.addAccountNameError}
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
                    onBlur={(e) => this.updatePrivPass(e.target.value)}/>
                </div>
              </div>
              <div style={AccountStyles.accountFormInputError}>
                {this.state.addAccountPrivPassError}
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
    if (walletService === null) {
      return (<ErrorScreen />);
    } else {
      return(
        <div style={AccountStyles.body}>
          <SideBar />
          {this.state.showAddAccount ? addAccountView : accountsView}
        </div>);
    }
  }
}

export default Accounts;
