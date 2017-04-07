import React, { Component } from 'react';
import Radium from 'radium';
import Balance from './Balance';
import ArrowRightGray from './icons/arrow-right-gray.svg';
import ArrowRightKeyBlue from './icons/arrow-right-key-blue.svg';
import './fonts.css';

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
};

class AccountRow extends Component {
  render() {
    const { account } = this.props;
    return (
          <div style={styles.accountRow} key={account.getAccountNumber()} onClick={this.props.onClick}>
            <div style={styles.accountName}>{account.getAccountName()}</div>
            <div style={styles.accountBalance}><Balance amount={account.getTotalBalance()} /></div>
          </div>);
  }
}

export default Radium(AccountRow);
