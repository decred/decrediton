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
    const transactions = this.props.transactions;
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var today = new Date();
    return (
      <div style={styles.historyContainer}>
        {transactions.map(function(tx, i) {
          var parseDate = new Date(tx.transaction.getMinedTransactions().getTimestamp()*1000);
          var diffDays = Math.round(Math.abs((parseDate.getTime() - today.getTime())/(oneDay)));
          //var s = Buffer.from(tx.transaction.getMinedTransactions().getTransactionsList()[0].getHash()).toString('hex');
          //var reversed = reverseHash(s);
          var credits = tx.transaction.getMinedTransactions().getTransactionsList()[0].getCreditsList();
          var debits = tx.transaction.getMinedTransactions().getTransactionsList()[0].getDebitsList();
          if (debits.length == 0) {
            var txAmount = credits[0].getAmount();
            return (
            <div style={styles.transactionRow} key={i}>
              <Receive />
              <span style={styles.txAmount}><Balance amount={txAmount} /></span>
              <span style={styles.txDateSince}>{diffDays} Days Since
                <LeftArrow />
              </span>
            </div>);
          } else {
            var returnedAmount = credits[0].getAmount();
            var prevAmount = debits[0].getPreviousAmount();
            var txAmount = prevAmount - returnedAmount;
            return (
              <div style={styles.transactionRow} key={i}>
                <Sent />
                <span style={styles.txAmount}><Balance amount={txAmount} /></span>
                <span style={styles.txDateSince}>{diffDays} Days Since
                  <LeftArrow />
                </span>
              </div>);
          }
        })}
      </div>);
  }
}

export default TxHistory;
