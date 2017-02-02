import React, { Component } from 'react';
//import { reverseHash } from '../helpers/byteActions';
import Balance from './Balance';
import IndicatorPending from './icons/indicator-pending.svg';
import IndicatorConfirmed from './icons/indicator-confirmed.svg';
import PlusSmall from './icons/plus-small.svg';
import MinusSmall from './icons/minus-small.svg';
import ArrowRightGray from './icons/arrow-right-gray.svg';
import ArrowRightKeyBlue from './icons/arrow-right-key-blue.svg';
import dateFormat from 'dateformat';
import './fonts.css';

const styles = {
  historyContainer: {
    width: '100%',
    maxWidth: '100%',
    margin: 'auto',
  },
  indicatorPending: {
    display: 'inline-block',
    padding: '5px 8px 5px 20px',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderRadius: '3px',
    fontSize: '12px',
    lineHeight: '8px',
    textAlign: 'right',
    textTransform: 'capitalize',
    borderColor: '#2971ff',
    backgroundImage: `url(${IndicatorPending})`,
    backgroundPosition: '6px 50%',
    backgroundSize: '10px',
    backgroundRepeat: 'no-repeat',
    color: '#2971ff',
  },

  indicatorConfirmed: {
    display: 'inline-block',
    padding: '5px 8px 5px 20px',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderRadius: '3px',
    fontSize: '12px',
    lineHeight: '8px',
    textAlign: 'right',
    textTransform: 'capitalize',
    borderColor: '#2ed8a3',
    backgroundImage: `url(${IndicatorConfirmed})`,
    backgroundPosition: '6px 50%',
    backgroundSize: '10px',
    backgroundRepeat: 'no-repeat',
    color: '#2ed8a3',
  },

  transactionIn: {
    height: '52px',
    paddingRight: '45px',
    paddingLeft: '56px',
    borderBottom: '1px solid #e7eaed',
    backgroundColor: '#fff',
    cursor: 'pointer',
    backgroundImage: `url(${ArrowRightGray}),url(${PlusSmall})`,
    backgroundPosition: '97% 50%, 20px 50%',
    backgroundSize: '5px 10px, 16px 16px',
    backgroundRepeat: 'no-repeat, no-repeat',
    ':hover': {
      backgroundColor: 'rgba(212, 240, 253, .5)',
      backgroundImage: `url(${ArrowRightKeyBlue}),url(${PlusSmall})`,
      backgroundSize: '5px, 16px',
    },
    transition: 'all 100ms cubic-bezier(0.86, 0, 0.07, 1) 0s'
  },

  transactionOut: {
    height: '52px',
    paddingRight: '45px',
    paddingLeft: '56px',
    borderBottom: '1px solid #e7eaed',
    backgroundColor: '#fff',
    cursor: 'pointer',
    backgroundImage: `url(${ArrowRightGray}),url(${MinusSmall})`,
    backgroundPosition: '97% 50%, 20px 50%',
    backgroundSize: '5px 10px, 16px 16px',
    backgroundRepeat: 'no-repeat, no-repeat',
    ':hover': {
      backgroundColor: 'rgba(212, 240, 253, .5)',
      backgroundImage: `url(${ArrowRightKeyBlue}),url(${MinusSmall})`,
      backgroundSize: '5px, 16px',
    },
    transition: 'all 100ms cubic-bezier(0.86, 0, 0.07, 1) 0s'
  },

  transactionAmount: {
    width: '44%',
    height: '39px',
    paddingTop: '13px',
    float: 'left',
  },

  transactionAccount: {
    width: '34%',
    height: '100%',
    float: 'left',
  },

  transactionTimeDate: {
    width: '22%',
    height: '36px',
    paddingTop: '16px',
    float: 'left',
    color: '#0c1e3e',
    fontSize: '13px',
    textAlign: 'right',
  },

  transactionAccountName: {
    width: '45%',
    height: '36px',
    paddingTop: '17px',
    paddingRight: '0px',
    float: 'left',
    fontSize: '11px',
    textAlign: 'right',
  },

  transactionAccountIndicator: {
    width: '50%',
    height: '35px',
    paddingTop: '17px',
    paddingLeft: '10px',
    float: 'left',
  },

  transactionAmountNumber: {
    fontFamily: 'Inconsolata, monospace',
    fontSize: '19px',
    lineHeight: '13px',
    fontWeight: '700',
  },

  transactionAmountHash: {
    fontFamily: 'Inconsolata, monospace',
    color: '#c4cbd2',
    fontSize: '11px',
    lineHeight: '11px',
  },

  transactionAmountNumberCurrency: {
    fontSize: '13px',
    fontWeight: '400',
  },

  transactionAmountNumberNumberFormatSmall: {
    fontSize: '13px',
  },
};

class TxHistory extends Component {
  render() {
    const { showTxDetail } = this.props;
    const { mined, unmined } = this.props;
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var today = new Date();
    if (mined !== null && mined.length > 0 ) {
      mined.sort(function(a, b) {
        return b.timestamp - a.timestamp;
      });
    }
    if (unmined !== null && unmined !== undefined && unmined.length > 0 ) {
      unmined.sort(function(a, b) {
        return b.timestamp - a.timestamp;
      });
    }
    return (
      <div>
        <div>
          {unmined !== null && unmined !== undefined && unmined.length > 0 ? <p> Unmined Transaction </p> : null}
          {unmined !== null && unmined !== undefined && unmined.length > 0 ?
            unmined.map(function(tx) {
              var parseDate = new Date(tx.getTimestamp()*1000);
              var diffDays = Math.round(Math.abs((parseDate.getTime() - today.getTime())/(oneDay)));
              var credits = tx.getCreditsList();
              var debits = tx.getDebitsList();
              if (debits.length == 0) {
                var txAmount = 0;
                for(var k = 0; k < credits.length; k++){
                  txAmount += credits[k].getAmount();
                }
                return (
                <div style={styles.transactionRow} key={tx.getHash()}>
                  <span style={styles.txAmount}><Balance amount={txAmount} /></span>
                  <span style={styles.txDateSince}>{diffDays} Days Since
                    <span style={styles.leftArrow} />
                  </span>
                </div>);
              } else {
                var prevAmount = 0;
                txAmount = 0;
                var returnedAmount = 0;
                for(k = 0; k < credits.length; k++){
                  returnedAmount += credits[k].getAmount();
                }
                for(k = 0; k < debits.length; k++){
                  prevAmount += debits[k].getPreviousAmount();
                }
                txAmount = prevAmount - returnedAmount;
                return (
                  <div style={styles.transactionRow} key={tx.getHash()}>
                    <span style={styles.txAmount}>-<Balance amount={txAmount} /></span>
                    <span style={styles.txDateSince}>{diffDays} Days Since
                      <span style={styles.leftArrow} />
                    </span>
                  </div>);
              }
            })
            : <p></p>
          }
        </div>
        <div>
          {mined.map(function(tx) {
            var credits = tx.getCreditsList();
            var debits = tx.getDebitsList();

            var date = dateFormat(new Date(tx.timestamp*1000), 'mmm d yyyy, HH:MM:ss');
            var fee = tx.getFee();
            
            var txDescription = '';
            var txAmount = 0;

            var walletValueUp = false;

            var sentAddressStr = '';
            var receiveAddressStr = '';
            var totalDebit = 0;
            var totalFundsReceived = 0;
            var totalChange = 0;
            for (var i = 0; i < debits.length; i++) {
              console.log(debits.length, i, "debit", debits[i].getPreviousAmount());
              totalDebit += debits[i].getPreviousAmount();
            }
            for (var i = 0; i < credits.length; i++) {
              console.log(credits.length, i, "credit", credits[i].getAddress(), credits[i].getInternal());
              if (!credits[i].getInternal()) {
                var spacing = ", ";
                if (i != credits.length - 1) {
                  spacing = ""; 
                }
                if (receiveAddressStr === '') {
                  receiveAddressStr = credits[i].getAddress();
                } else {
                  receiveAddressStr += spacing + credits[i].getAddress();
                }
                totalFundsReceived += credits[i].getAmount();
              } else {
                var spacing = ", ";
                if (i != credits.length - 1) {
                  spacing = ""; 
                }
                if (receiveAddressStr === '') {
                  receiveAddressStr = credits[i].getAddress();
                } else {
                  receiveAddressStr += spacing + credits[i].getAddress();
                }
                // Change coming back.
                totalChange += credits[i].getAmount();
              }
            }

            if ( totalFundsReceived + totalChange + fee < totalDebit) {
              txDescription = {direction:'Sent', addressStr: ''};
              txAmount = totalDebit - fee - totalChange - totalFundsReceived;
              walletValueUp = false;
              return (
                <div style={styles.transactionOut} key={tx.getHash()} onClick={showTxDetail !== undefined ? () => {showTxDetail(tx)}:null}>
                  <div style={styles.transactionAmount}>
                    <div style={styles.transactionAmountNumber}>-<Balance amount={txAmount} /></div>
                    <div style={styles.transactionAmountHash}>{txDescription.addressStr}</div>
                  </div>
                  <div style={styles.transactionAccount}>
                    <div style={styles.transactionAccountName}>Primary account</div>
                    <div style={styles.transactionAccountIndicator}>
                      <div style={styles.indicatorConfirmed}>Confirmed</div>
                    </div>
                  </div>
                  <div style={styles.transactionTimeDate}><span>{date}</span></div>
                </div>);
            } else {
              txDescription = {direction:'Received at:',addressStr: receiveAddressStr}
              txAmount = totalFundsReceived;
              walletValueUp = true;
              return (
                <div style={styles.transactionIn} key={tx.getHash()} onClick={showTxDetail !== undefined ? () => {showTxDetail(tx)}:null}>
                  <div style={styles.transactionAmount}>
                    <div style={styles.transactionAmountNumber}><Balance amount={txAmount} /></div>
                    <div style={styles.transactionAmountHash}>{txDescription.addressStr}</div>
                  </div>
                  <div style={styles.transactionAccount}>
                    <div style={styles.transactionAccountName}>Primary account</div>
                    <div style={styles.transactionAccountIndicator}>
                      <div style={styles.indicatorConfirmed}>Confirmed</div>
                    </div>
                  </div>
                  <div style={styles.transactionTimeDate}><span>{date}</span></div>
                </div>);
            }
          })}
        </div>
      </div>);
  }
}

export default TxHistory;
