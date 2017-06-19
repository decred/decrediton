import React, { Component } from 'react';
import SlateGrayButton from './SlateGrayButton';
import KeyBlueButton from './KeyBlueButton';
import Radium from 'radium';
import Balance from './Balance';
import ArrowRightGray from './icons/arrow-right-gray.svg';
import ArrowRightKeyBlue from './icons/arrow-right-key-blue.svg';
import './fonts.css';
import { AccountStyles } from './views/ViewStyles.js';
import WalletGray from './icons/wallet-gray.svg';

const styles = {
  accountRow: {
    position: 'relative',
    overflow: 'hidden',
    height: '77px',
    borderTop: '1px solid #F0F4F4',
    backgroundColor: '#FFF',
    backgroundImage: `url(${ArrowRightGray})`,
    backgroundPosition: '60px 24px',
    backgroundSize: '5px auto',
    backgroundRepeat: 'no-repeat',
    transition: 'all 100ms ease-in-out 0s',
    ':hover': {
      backgroundColor: 'rgba(212, 240, 253, .5)',
      backgroundImage: `url(${ArrowRightKeyBlue})`,
      backgroundSize: '5px',
    },
    cursor: 'pointer',
  },
  accountRowTopTop: {
    width: '100%',
    height: '40px',
    paddingLeft: '80px',
    float: 'left',
  },
  accountRowTopBottom: {
    width: '100%',
    height: '37px',
    paddingLeft: '80px',
    float: 'left',
    fontSize: '12px',
  },
  accountRowTopLastTx: {
    display: 'inline-block',
    height: '100%',
    paddingTop: '4px',
    color: '#132F4B',
  },
  accountRowTopSpendable: {
    width: 'auto',
    height: '100%',
    float: 'right',
    paddingRight: '100px',
  },
  accountRowWalletIcon: {
    position: 'absolute',
    left: '0px',
    top: '0px',
    bottom: '0px',
    width: '50px',
    height: '100%',
    marginRight: '30px',
    float: 'left',
    backgroundImage: `url(${WalletGray})`,
    backgroundPosition: '50% 20px',
    backgroundSize: '20px auto',
    backgroundRepeat: 'no-repeat',
  },
  accountRowTopAccountName: {
    height: '100%',
    paddingTop: '19px',
    float: 'left',
    color: '#0C1E3E',
    fontSize: '19px',
  },
  accountRowTopAccountFunds: {
    paddingTop: '18px',
    paddingRight: '100px',
    float: 'right',
    fontFamily: 'Inconsolata,monospace',
    color: '#0C1E3E',
    fontSize: '20px',
    fontWeight: '700',
  },
  accountRowDetailsTop: {
    position: 'relative',
    zIndex: '0',
    width: '100%',
    height: '77px',
    minWidth: '100px',
    paddingRight: '20px',
    float: 'left',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'all 100ms ease-in-out 0s',
  },
  accountRowDetailsBottom: {
    width: '100%',
    paddingRight: '20px',
    paddingLeft: '20px',
    float: 'left',
  },
  accountRowDetailsBottomTitle: {
    width: '100%',
    height: '30px',
    float: 'left',
    fontSize: '19px',
  },
  accountRowDetailsBottomTitleName: {
    width: '140px',
    height: '100%',
    paddingTop: '2px',
    paddingRight: '20px',
    float: 'left',
    color: '#596D81',
    textAlign: 'right',
  },
  accountRowDetailsBottomSpec: {
    width: '100%',
    height: 'auto',
    float: 'left',
    color: '#0C1E3E',
    fontSize: '12px',
  },
  accountRowDetailsBottomSpecLast: {
    paddingBottom: '9px',
    borderBottom: '1px solid #E7EAED',
    width: '100%',
    height: 'auto',
    float: 'left',
    color: '#0C1E3E',
    fontSize: '12px',
  },
  accountRowDetailsBottomSpecName: {
    width: '140px',
    height: '26px',
    paddingRight: '20px',
    float: 'left',
    textAlign: 'right',
  },
  accountRowDetailsBottomSpecValue: {
    height: '26px',
    float: 'left',
    fontDamily: 'Inconsolata,monospace',
    fontWeight: '700',
  },
  accountRowDetailsCfg: {

  },
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
          <div style={this.state.showAccountDetails ? styles.accountRowDetailsTop : styles.accountRow} key={account.getAccountNumber()} onClick={this.state.showAccountDetails ? () => this.setState({showAccountDetails: false}) : () => this.setState({showAccountDetails: true})}>
            <div style={styles.accountRowTopTop}>
              <div style={styles.accountRowWalletIcon}/>
              <div style={styles.accountRowTopAccountName}>{account.getAccountName()}</div>
              <div style={styles.accountRowTopAccountFunds}><Balance amount={balance.total}/></div>
            </div>
            <div style={styles.accountRowTopBottom}>
              <div style={styles.accountRowTopLastTx}></div>
              <div style={styles.accountRowTopSpendable}>Spendable <Balance amount={balance.spendable}/></div>
            </div>
          </div>
          {this.state.showAccountDetails ?
            this.state.showRenameAccount ?
            <div style={styles.accountRowDetailsBottom} key={'details'+account.getAccountNumber()}>
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
            <div style={styles.accountRowDetailsBottom} key={'details'+account.getAccountNumber()}>
              <div style={styles.accountRowDetailsBottomTitle}>
                <div style={styles.accountRowDetailsBottomTitleName}>
                  Balances
                </div>
              </div>
              <div style={styles.accountRowDetailsBottomSpec}>
                <div style={styles.accountRowDetailsBottomSpecName}>Total</div>
                <div style={styles.accountRowDetailsBottomSpecValue}><Balance amount={balance.total}/></div>
              </div>
              <div style={styles.accountRowDetailsBottomSpec}>
                <div style={styles.accountRowDetailsBottomSpecName}>Spendable</div>
                <div style={styles.accountRowDetailsBottomSpecValue}><Balance amount={balance.spendable}/></div>
              </div>
              <div style={styles.accountRowDetailsBottomSpec}>
                <div style={styles.accountRowDetailsBottomSpecName}>Immature Rewards</div>
                <div style={styles.accountRowDetailsBottomSpecValue}><Balance amount={balance.immatureReward}/></div>
              </div>
              <div style={styles.accountRowDetailsBottomSpec}>
                <div style={styles.accountRowDetailsBottomSpecName}>Locked By Tickets</div>
                <div style={styles.accountRowDetailsBottomSpecValue}><Balance amount={balance.lockedByTickets}/></div>
              </div>
              <div style={styles.accountRowDetailsBottomSpec}>
                <div style={styles.accountRowDetailsBottomSpecName}>Voting Authority</div>
                <div style={styles.accountRowDetailsBottomSpecValue}><Balance amount={balance.votingAuthority}/></div>
              </div>
              <div style={styles.accountRowDetailsBottomSpecLast}>
                <div style={styles.accountRowDetailsBottomSpecName}>Immature Stake Generation</div>
                <div style={styles.accountRowDetailsBottomSpecValue}><Balance amount={balance.immatureStakeGeneration}/></div>
              </div>
              {account.getAccountName() !== 'imported' ?
                <KeyBlueButton
                  style={AccountStyles.contentConfirmNewAccount}
                  onClick={() => this.setState({showRenameAccount: true})}>
                  Rename Account
                </KeyBlueButton> :
                <div></div>
              }
            </div> :
            <div></div>
          }
      </div>);
  }
}

export default Radium(AccountRow);
