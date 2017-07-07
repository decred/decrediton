// @flow
import React, { Component } from 'react';
import Radium from 'radium';
import { reverseHash } from '../../helpers/byteActions';
import Balance from '../Balance';
import Header from '../Header';
import dateFormat from 'dateformat';
import '../fonts.css';
import { shell } from 'electron';
import SlateGrayButton from '../SlateGrayButton';
import { TxDetailsStyles } from './ViewStyles';

class TxDetails extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { tx } = this.props;
    const { clearTxDetails } = this.props;
    const { getAccountsResponse } = this.props;
    const { getNetworkResponse } = this.props;
    var networkStr = '';
    if (getNetworkResponse !== null) {
      networkStr = getNetworkResponse.networkStr;
    }
    var txLink = 'https://'+networkStr.toString()+'.decred.org/tx/' + reverseHash(Buffer.from(tx.tx.getHash()).toString('hex'));
    var blockLink = 'https://'+networkStr.toString()+'.decred.org/block/' + reverseHash(Buffer.from(tx.blockHash).toString('hex'));

    var credits = tx.tx.getCreditsList();
    var debits = tx.tx.getDebitsList();

    var date = dateFormat(new Date(tx.timestamp*1000), 'mmm d yyyy, HH:MM:ss');
    var fee = tx.tx.getFee();

    var txDescription = '';
    var txAmount = 0;

    var walletValueUp = false;
    var transferred = false;
    var receiveAddressStr = Array();
    var totalDebit = 0;
    var totalFundsReceived = 0;
    var totalChange = 0;

    var previousAccount;
    for (var i = 0; i < debits.length; i++) {
      totalDebit += debits[i].getPreviousAmount();
      previousAccount = debits[i].getPreviousAccount();
    }
    var account;
    for (i = 0; i < credits.length; i++) {
      receiveAddressStr.push(credits[i].getAddress());
      if (!credits[i].getInternal()) {
        totalFundsReceived += credits[i].getAmount();
      } else {
        // Change coming back.
        totalChange += credits[i].getAmount();
      }
      account = credits[i].getAccount();
    }
    var accountName = 'Primary Account';
    if ( totalFundsReceived + totalChange + fee < totalDebit) {
      txDescription = {direction:'Sent', addressStr: null};
      txAmount = totalDebit - fee - totalChange - totalFundsReceived;
      walletValueUp = false;
      if (this.props.getAccountsResponse != null) {
        for (var y = 0; y < this.props.getAccountsResponse.getAccountsList().length; y++) {
          if (this.props.getAccountsResponse.getAccountsList()[y].getAccountNumber() == previousAccount) {
            accountName = this.props.getAccountsResponse.getAccountsList()[y].getAccountName();
            break;
          }
        }
      }
    } else if ( totalFundsReceived + totalChange + fee == totalDebit) {
      txDescription = {direction:'Transferred', addressStr: receiveAddressStr};
      txAmount = fee;
      walletValueUp = false;
      transferred = true;
      if (this.props.getAccountsResponse != null) {
        for (y = 0; y < this.props.getAccountsResponse.getAccountsList().length; y++) {
          if (this.props.getAccountsResponse.getAccountsList()[y].getAccountNumber() == previousAccount) {
            accountName = this.props.getAccountsResponse.getAccountsList()[y].getAccountName();
            break;
          }
        }
      }
    } else {
      txDescription = {direction:'Received at:',addressStr: receiveAddressStr};
      txAmount = totalFundsReceived;
      walletValueUp = true;
      if (this.props.getAccountsResponse != null) {
        for (var z = 0; z < this.props.getAccountsResponse.getAccountsList().length; z++) {
          if (this.props.getAccountsResponse.getAccountsList()[z].getAccountNumber() == account) {
            accountName = this.props.getAccountsResponse.getAccountsList()[z].getAccountName();
            break;
          }
        }
      }
    }
    return(
      <div style={TxDetailsStyles.view}>
        <Header
          headerTitleOverview={[<div key={accountName}>{accountName}</div>,
            <SlateGrayButton key="back" style={{float: 'right'}} onClick={() => clearTxDetails()}>back</SlateGrayButton>
          ]}
          headerMetaOverview={
            walletValueUp ?
          <div style={TxDetailsStyles.headerMetaTransactionDetailsIn}>
            <Balance amount={txAmount} />
            <div style={TxDetailsStyles.headerMetaTransactionDetailsTimeAndDate}>{date}</div>
          </div> :
            transferred ?
          <div style={TxDetailsStyles.headerMetaTransactionDetailsTransfer}>
            -<Balance amount={txAmount} />
            <div style={TxDetailsStyles.headerMetaTransactionDetailsTimeAndDate}>{date}</div>
          </div> :
          <div style={TxDetailsStyles.headerMetaTransactionDetailsOut}>
            -<Balance amount={txAmount} />
            <div style={TxDetailsStyles.headerMetaTransactionDetailsTimeAndDate}>{date}</div>
          </div>
          }/>
        <div style={TxDetailsStyles.content}>
          <div style={TxDetailsStyles.contentNest}>
            <div style={TxDetailsStyles.transactionDetailsTop}>
              <div style={TxDetailsStyles.transactionDetailsName}>Transaction:</div>
              <div style={TxDetailsStyles.transactionDetailsValue} onClick={function(x){shell.openExternal(x);}.bind(null, txLink)}><a>{reverseHash(Buffer.from(tx.tx.getHash()).toString('hex'))}</a></div>
              <div style={TxDetailsStyles.transactionDetailsName}>
                <div style={TxDetailsStyles.indicatorConfirmed}>confirmed</div>
              </div>
              {getAccountsResponse !== null ?
              <div style={TxDetailsStyles.transactionDetailsValue}>{getAccountsResponse.getCurrentBlockHeight() - tx.height} <span style={TxDetailsStyles.transactionDetailsValueText}>confirmations</span></div> :
              <div></div>
              }
              <div style={TxDetailsStyles.transactionDetailsDirection}>{txDescription.direction}</div>
              <div style={TxDetailsStyles.transactionDetailsOutputArea}>
                {txDescription.addressStr !== null ?
                  txDescription.addressStr.map(function(addressStr) {
                    return(<div style={TxDetailsStyles.transactionDetailsAddress} key={addressStr}>{addressStr}</div>);
                  }) :
                  <div></div>}
              </div>
              <div style={TxDetailsStyles.transactionDetailsName}>Transaction fee:</div>
              <div style={TxDetailsStyles.transactionDetailsValue}><Balance amount={fee} />
              </div>
            </div>
            <div style={TxDetailsStyles.transactionDetails}>
              <div style={TxDetailsStyles.transactionDetailsTitle}>Properties</div>
              <div style={TxDetailsStyles.transactionDetailsName}>Block:</div>
              <div style={TxDetailsStyles.transactionDetailsValue} onClick={function(x){shell.openExternal(x);}.bind(null, blockLink)}><a>{reverseHash(Buffer.from(tx.blockHash).toString('hex'))}</a></div>
              <div style={TxDetailsStyles.transactionDetailsName}>Height:</div>
              <div style={TxDetailsStyles.transactionDetailsValue}>{tx.height}</div>
            </div>
          </div>
        </div>
      </div>);
  }
}

export default Radium(TxDetails);