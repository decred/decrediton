import React, { Component } from 'react';
import TxRow from './TxRow';
import dateFormat from 'dateformat';
import './fonts.css';

class TxHistory extends Component {
  render() {
    const { showTxDetail } = this.props;
    const { mined, unmined } = this.props;
    if (mined !== null && mined !== undefined && mined.length > 0 ) {
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
          {unmined !== null && unmined !== undefined && unmined.length > 0 ?
            unmined.map(function(tx) {
              var credits = tx.getCreditsList();
              var debits = tx.getDebitsList();
              var fee = tx.getFee();

              var txDescription = '';
              var txAmount = 0;

              var receiveAddressStr = '';
              var totalDebit = 0;
              var totalFundsReceived = 0;
              var totalChange = 0;
              for (var i = 0; i < debits.length; i++) {
                totalDebit += debits[i].getPreviousAmount();
              }
              for (i = 0; i < credits.length; i++) {
                if (!credits[i].getInternal()) {
                  var spacing = ', ';
                  if (i != credits.length - 1) {
                    spacing = '';
                  }
                  if (receiveAddressStr === '') {
                    receiveAddressStr = credits[i].getAddress();
                  } else {
                    receiveAddressStr += spacing + credits[i].getAddress();
                  }
                  totalFundsReceived += credits[i].getAmount();
                } else {
                  spacing = ', ';
                  if (i != credits.length - 1) {
                    spacing = '';
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
                return (<TxRow key={Buffer.from(tx.getHash()).toString('hex')} txInfo={tx} direction={'out'} pending txAmount={txAmount} txDescription={txDescription} />);
              } else {
                txDescription = {direction:'Received at:',addressStr: receiveAddressStr};
                txAmount = totalFundsReceived;
                return (<TxRow key={Buffer.from(tx.getHash()).toString('hex')} txInfo={tx} direction={'in'} pending txAmount={txAmount} txDescription={txDescription} />);
              }
            })
            : <p></p>
          }
        </div>
        <div>
          {mined !== null && mined !== undefined && mined.length > 0 ?
            mined.map(function(txInfo) {
              var tx = txInfo.tx;
              var credits = tx.getCreditsList();
              var debits = tx.getDebitsList();

              var date = dateFormat(new Date(txInfo.timestamp*1000), 'mmm d yyyy, HH:MM:ss');
              var fee = tx.getFee();

              var txDescription = '';
              var txAmount = 0;

              var receiveAddressStr = '';
              var totalDebit = 0;
              var totalFundsReceived = 0;
              var totalChange = 0;
              for (var i = 0; i < debits.length; i++) {
                totalDebit += debits[i].getPreviousAmount();
              }
              for (i = 0; i < credits.length; i++) {
                if (!credits[i].getInternal()) {
                  var spacing = ', ';
                  if (i != credits.length - 1) {
                    spacing = '';
                  }
                  if (receiveAddressStr === '') {
                    receiveAddressStr = credits[i].getAddress();
                  } else {
                    receiveAddressStr += spacing + credits[i].getAddress();
                  }
                  totalFundsReceived += credits[i].getAmount();
                } else {
                  spacing = ', ';
                  if (i != credits.length - 1) {
                    spacing = '';
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
                return (<TxRow key={Buffer.from(tx.getHash()).toString('hex')} txInfo={txInfo} direction={'out'} showTxDetail={showTxDetail} txAmount={txAmount} txDescription={txDescription} date={date}/>);
              } else {
                txDescription = {direction:'Received at:',addressStr: receiveAddressStr};
                txAmount = totalFundsReceived;
                return (<TxRow key={Buffer.from(tx.getHash()).toString('hex')} txInfo={txInfo} direction={'in'} showTxDetail={showTxDetail} txAmount={txAmount} txDescription={txDescription} date={date}/>);
              }
            }) :
          <div></div>
        }
        </div>
      </div>);
  }
}

export default TxHistory;
