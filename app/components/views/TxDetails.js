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
import { TransactionDetails }  from '../../middleware/walletrpc/api_pb';

class TxDetails extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { tx } = this.props;
    const { detailType } = this.props;
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

    var txAmount = 0;
    var sendAddressStr = Array();
    var receiveAddressStr = Array();
    var totalDebit = 0;
    var totalFundsReceived = 0;
    var totalChange = 0;
    for (var i = 0; i < debits.length; i++) {
      totalDebit += debits[i].getPreviousAmount();
      for (var y = 0; y < this.props.getAccountsResponse.getAccountsList().length; y++) {
        if (this.props.getAccountsResponse.getAccountsList()[y].getAccountNumber() == debits[i].getPreviousAccount()) {
          sendAddressStr.push({account:this.props.getAccountsResponse.getAccountsList()[y].getAccountName(), amount: debits[i].getPreviousAmount()});
          break;
        }
      }
    }
    for (i = 0; i < credits.length; i++) {
      receiveAddressStr.push({address: credits[i].getAddress(), amount:credits[i].getAmount()});
      if (!credits[i].getInternal()) {
        totalFundsReceived += credits[i].getAmount();
      } else {
        // Change coming back.
        totalChange += credits[i].getAmount();
      }
    }
    var headerMeta;
    if (detailType == null) {
      if ( totalFundsReceived + totalChange + fee < totalDebit) {
        txAmount = totalDebit - fee - totalChange - totalFundsReceived;
        headerMeta = (
          <div style={TxDetailsStyles.headerMetaTransactionDetailsOut}>
            -<Balance amount={txAmount} />
            <div style={TxDetailsStyles.headerMetaTransactionDetailsTimeAndDate}>{date}</div>
          </div>
        );
      } else if ( totalFundsReceived + totalChange + fee == totalDebit) {
        txAmount = fee;
        headerMeta = (
          <div style={TxDetailsStyles.headerMetaTransactionDetailsTransfer}>
            -<Balance amount={txAmount} />
            <div style={TxDetailsStyles.headerMetaTransactionDetailsTimeAndDate}>{date}</div>
          </div>
        );
      } else {
        txAmount = totalFundsReceived;
        headerMeta = (
          <div style={TxDetailsStyles.headerMetaTransactionDetailsIn}>
            <Balance amount={txAmount} />
            <div style={TxDetailsStyles.headerMetaTransactionDetailsTimeAndDate}>{date}</div>
          </div>
        );
      }
    } else {
      var typeStr;
      if (detailType == TransactionDetails.TransactionType.TICKET_PURCHASE) {
        typeStr = 'Ticket';
      } else if (detailType == TransactionDetails.TransactionType.VOTE) {
        typeStr = 'Vote';
      } else if (detailType == TransactionDetails.TransactionType.REVOCATION) {
        typeStr = 'Revocation';
      }
      headerMeta = (
          <div style={TxDetailsStyles.headerMetaTransactionDetailsStakeTx}>
            {typeStr}
            <div style={TxDetailsStyles.headerMetaTransactionDetailsTimeAndDate}>{date}</div>
          </div>
        );
    }
    return(
      <div style={TxDetailsStyles.view}>
        <Header
          headerTitleOverview={<SlateGrayButton key="back" style={{float: 'right'}} onClick={() => clearTxDetails()}>back</SlateGrayButton>}
          headerMetaOverview={headerMeta}/>
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
              <div style={TxDetailsStyles.transactionDetailsOverview}>
                <div style={TxDetailsStyles.transactionDetailsOverviewTitle}>
                  <div style={TxDetailsStyles.transactionDetailsOverviewTitleConsumed}>Used Inputs</div>
                  <div style={TxDetailsStyles.transactionDetailsOverviewTitleCreated}>New Wallet Outputs</div>
                </div>
                <div style={TxDetailsStyles.transactionDetailsInputArea}>
                  {sendAddressStr !== null ?
                    sendAddressStr.map(function(addressStr,i) {
                      return(
                        <div key={'row-input'+i} style={TxDetailsStyles.transactionDetailsRow}>
                          <div style={TxDetailsStyles.transactionDetailsAddress} key={addressStr.account}>{addressStr.account}</div>
                          <div style={TxDetailsStyles.transactionDetailsAmount} key={addressStr.account+addressStr.amount}><Balance amount={addressStr.amount}/></div>
                        </div>);
                    }) :
                    <div></div>}
                </div>
                <div style={TxDetailsStyles.transactionDetailsOutputArea}>
                  {receiveAddressStr !== null ?
                    receiveAddressStr.map(function(addressStr,i) {
                      return(
                        <div key={'row-output'+i} style={TxDetailsStyles.transactionDetailsRow}>
                          <div style={TxDetailsStyles.transactionDetailsAddress} key={addressStr.address}>{addressStr.address}</div>
                          <div style={TxDetailsStyles.transactionDetailsAmount} key={addressStr.amount+addressStr.address}><Balance amount={addressStr.amount}/></div>
                        </div>);
                    }) :
                    <div></div>}
                </div>
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