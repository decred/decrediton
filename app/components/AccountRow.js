import React, { Component } from 'react';
import SlateGrayButton from './SlateGrayButton';
import KeyBlueButton from './KeyBlueButton';
import Radium from 'radium';
import Balance from './Balance';
import ArrowRightGray from './icons/arrow-right-gray.svg';
import ArrowRightKeyBlue from './icons/arrow-right-key-blue.svg';
import './fonts.css';
import { AccountStyles } from './views/ViewStyles.js';

const styles = {
  accountContainer: {
    width: '100%',
    maxWidth: '100%',
    margin: 'auto',
  },

  accountRow: {
    height: '52px',
    paddingRight: '45px',
    paddingLeft: '56px',
    borderBottom: '1px solid #e7eaed',
    backgroundColor: '#fff',
    cursor: 'pointer',
    backgroundImage: `url(${ArrowRightGray})`,
    backgroundPosition: '97% 50%',
    backgroundSize: '5px 10px',
    backgroundRepeat: 'no-repeat',
    ':hover': {
      backgroundColor: 'rgba(212, 240, 253, .5)',
      backgroundImage: `url(${ArrowRightKeyBlue})`,
      backgroundSize: '5px',
    },
    transition: 'all 100ms cubic-bezier(0.86, 0, 0.07, 1) 0s'
  },

  accountBalance: {
    width: '50%',
    height: '36px',
    paddingTop: '16px',
    float: 'right',
    color: '#0c1e3e',
    fontSize: '18px',
    textAlign: 'right',
    fontWeight: '700',
  },
  accountName: {
    width: '50%',
    height: '36px',
    paddingTop: '17px',
    float: 'left',
    fontFamily: 'Inconsolata, monospace',
    fontSize: '20x',
    lineHeight: '24px',
  },
  accountDetails: {
    height: '200px',
    backgroundColor: '#f3f6f6',
  }
};

class AccountRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAccountDetails: false,
      showRenameAccount: false,
    };
  }
  render() {
    const { account, balance } = this.props;
    return (
        <div>
          <div style={styles.accountRow} key={account.getAccountNumber()} onClick={() => this.setState({showAccountDetails: true})}>
            <div style={styles.accountName}>{account.getAccountName()}</div>
            <div style={styles.accountBalance}><Balance amount={account.getTotalBalance()} /></div>
          </div>
          {this.state.showAccountDetails ?
            this.state.showRenameAccount ?
            <div style={styles.accountDetails} key={'details'+account.getAccountNumber()}>
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
                  {this.state.renameAccountNameError}
                </div>
              </div>
              <KeyBlueButton
                style={AccountStyles.contentConfirmNewAccount}
                onClick={() => this.props.renameAccount()}>
                Rename
              </KeyBlueButton>
              <SlateGrayButton
                style={AccountStyles.contentHideNewAccount}
                onClick={() => this.setState({showRenameAccount: false})}>
                Cancel
              </SlateGrayButton>
            </div> :
            <div style={styles.accountDetails} key={'details'+account.getAccountNumber()}>
              <div style={AccountStyles.accountDetailsRow}>
                <div style={AccountStyles.accountDetailsLabel}>Total Balance:</div>
                <div style={AccountStyles.accountDetailsInput}>
                  {balance.total}
                </div>
              </div>
              <SlateGrayButton key="back" style={{float: 'right'}} onClick={() => this.setState({showAccountDetails: false})}>back</SlateGrayButton>
              <KeyBlueButton
                style={AccountStyles.contentConfirmNewAccount}
                onClick={() => this.setState({showRenameAccount: true})}>
                Rename Account
              </KeyBlueButton>
            </div> :
            <div></div>
          }
      </div>);
  }
}

export default Radium(AccountRow);
