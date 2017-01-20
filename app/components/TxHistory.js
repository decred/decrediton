import React, { Component } from 'react';
//import { reverseHash } from '../helpers/byteActions';
import Sent from './icons/Sent';
import Receive from './icons/Receive';
import LeftArrow from './icons/LeftArrow';
import Balance from './Balance';
const styles = {
  historyContainer: {
    width: '100%',
    maxWidth: '100%',
    margin: 'auto',
  },
  transactionRow: {
    padding: '8px 0 10px 0',
    display: 'block',
    borderBottom: '1px solid #e2e2e2',
    fontSize: '2.25rem',
    fontWeight: '600',
    backgroundColor: '#ffffff',
    width: '100%',
    float: 'left',
    position: 'relative',
    minHeight: '1px',
    boxSizing: 'border-box',
  },
  txAmount: {
    position: 'absolute',
    paddingTop: '16px',
    fontSize:'1.0rem',
  },
  txDateSince: {
    float: 'right',
    paddingTop: '16px',
    fontSize: '1.0rem',
    fontWeight: 'normal',
  },
  txArrow: {
    height: '13px',
    width: '13px',
    margin: '-2px 15px',
    backgroundColor: 'transparent',
  }
};

class TxHistory extends Component {
  render() {
    const mined = this.props.mined;
    const unmined = this.props.unmined;
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var today = new Date();
    mined.sort(function(a, b) {
      return b.getTimestamp() - a.getTimestamp();
    });
    return (
      <div>
      <div style={styles.historyContainer}>
        {unmined.map(function(tx) {
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
              <div style={styles.transactionRow} key={j}>
                <Receive />
                <span style={styles.txAmount}><Balance amount={txAmount} /></span>
                <span style={styles.txDateSince}>{diffDays} Days Since
                  <LeftArrow />
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
                <div style={styles.transactionRow} key={j}>
                  <Sent />
                  <span style={styles.txAmount}>-<Balance amount={txAmount} /></span>
                  <span style={styles.txDateSince}>{diffDays} Days Since
                    <LeftArrow />
                  </span>
                </div>);
            }
        })}
      </div>
      <div style={styles.historyContainer}>
        {mined.map(function(txs) {
          var parseDate = new Date(txs.getTimestamp()*1000);
          var diffDays = Math.round(Math.abs((parseDate.getTime() - today.getTime())/(oneDay)));
          //var s = Buffer.from(tx.transaction.getMinedTransactions().getTransactionsList()[0].getHash()).toString('hex');
          //var reversed = reverseHash(s);
          var minedTxs = txs.getTransactionsList();
          return (minedTxs.map(function(tx, j) {
            var credits = tx.getCreditsList();
            var debits = tx.getDebitsList();
            if (debits.length == 0) {
              var txAmount = 0;
              for(var k = 0; k < credits.length; k++){
                txAmount += credits[k].getAmount();
              }
              return (
              <div style={styles.transactionRow} key={j}>
                <Receive />
                <span style={styles.txAmount}><Balance amount={txAmount} /></span>
                <span style={styles.txDateSince}>{diffDays} Days Since
                  <LeftArrow />
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
                <div style={styles.transactionRow} key={j}>
                  <Sent />
                  <span style={styles.txAmount}>-<Balance amount={txAmount} /></span>
                  <span style={styles.txDateSince}>{diffDays} Days Since
                    <LeftArrow />
                  </span>
                </div>);
            }
          }));
        })}
      </div>
      </div>);
  }
}

export default TxHistory;
