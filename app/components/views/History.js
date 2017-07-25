// @flow
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import ErrorScreen from '../ErrorScreen';
import SideBar from '../SideBar';
import TxHistory from '../TxHistory';
import Balance from '../Balance';
import TxDetails from './TxDetails';
import Header from '../Header';
import { HistoryStyles } from './ViewStyles';
import Select from 'react-select';

class History extends Component{
  static propTypes = {
    walletService: PropTypes.object,
  };
  constructor(props) {
    var txTypes = Array();
    if (props.regularTransactionsInfo.length != 0 || props.ticketTransactionsInfo.length != 0 || props.voteTransactionsInfo.length != 0 || props.revokeTransactionsInfo.length != 0) {
      txTypes.push({value:'All', label:'All'});
    } else if (props.regularTransactionsInfo.length != 0) {
      txTypes.push({value:'Regular', label:'Regular'});
    } else if (props.ticketTransactionsInfo.length != 0) {
      txTypes.push({value:'Tickets', label:'Tickets'});
    } else if (props.voteTransactionsInfo.length != 0) {
      txTypes.push({value:'Votes', label:'Votes'});
    } else if (props.revokeTransactionsInfo.length != 0) {
      txTypes.push({value:'Revokes', label:'Revokes'});
    }
    super(props);
    this.state = {
      currentPage: 0,
      paginatedTxs: props.regularTransactionsInfo.length >= props.txPerPage  ? props.regularTransactionsInfo.slice(0,props.txPerPage) : props.regularTransactionsInfo.slice(0,props.regularTransactionsInfo.length),
      selectedTypeArray: props.regularTransactionsInfo,
      selectedType: 'Regular',
      transactionDetails: null,
      detailType: null,
      txTypes: txTypes,
    };
  }
  pageForward() {
    const { txPerPage } = this.props;
    const { currentPage, selectedTypeArray } = this.state;
    var newPaginatedTxs = (currentPage+2) * txPerPage > selectedTypeArray.length ?
      selectedTypeArray.slice((currentPage+1)*txPerPage, selectedTypeArray.length) :
      selectedTypeArray.slice((currentPage+1)*txPerPage, (currentPage+2) * txPerPage);
    this.setState({paginatedTxs: newPaginatedTxs, currentPage: currentPage+1});
  }

  pageBackward() {
    const { txPerPage } = this.props;
    const { currentPage, selectedTypeArray } = this.state;
    var newPaginatedTxs = selectedTypeArray.slice((currentPage-1) * txPerPage, (currentPage)*txPerPage);
    this.setState({paginatedTxs: newPaginatedTxs, currentPage: currentPage-1});
  }
  updateSelectedType(type) {
    var selectedTypeArray;
    if (type == 'Regular') {
      const { regularTransactionsInfo } = this.props;
      selectedTypeArray = regularTransactionsInfo;
    } else if (type == 'Tickets') {
      const { ticketTransactionsInfo } = this.props;
      selectedTypeArray = ticketTransactionsInfo;
    } else if (type == 'Votes') {
      const { voteTransactionsInfo } = this.props;
      selectedTypeArray = voteTransactionsInfo;
    } else if (type == 'Revokes') {
      const { revokeTransactionsInfo } = this.props;
      selectedTypeArray = revokeTransactionsInfo;
    } else if (type == 'All') {
      const { regularTransactionsInfo } = this.props;
      const { ticketTransactionsInfo } = this.props;
      const { voteTransactionsInfo } = this.props;
      const { revokeTransactionsInfo } = this.props;
      var allTransactions = Array();
      for (var i = 0; i < regularTransactionsInfo.length; i++) {
        allTransactions.push(regularTransactionsInfo[i]);
      }
      for (i = 0; i < ticketTransactionsInfo.length; i++) {
        allTransactions.push(ticketTransactionsInfo[i]);
      }
      for (i = 0; i < voteTransactionsInfo.length; i++) {
        allTransactions.push(voteTransactionsInfo[i]);
      }
      for (i = 0; i < revokeTransactionsInfo.length; i++) {
        allTransactions.push(revokeTransactionsInfo[i]);
      }
      allTransactions.sort(function (a,b) {
        return b.timestamp - a.timestamp;
      });
      selectedTypeArray = allTransactions;
    }
    var paginatedTxs = selectedTypeArray.length >= this.props.txPerPage  ? selectedTypeArray.slice(0,this.props.txPerPage) : selectedTypeArray.slice(0,selectedTypeArray.length);
    this.setState({selectedType: type, currentPage: 0, selectedTypeArray: selectedTypeArray, paginatedTxs: paginatedTxs});
  }
  setTransactionDetails(tx, type) {
    this.setState({transactionDetails: tx, detailType: type});
  }
  clearTransactionDetails() {
    this.setState({transactionDetails: null});
  }

  render() {
    const { walletService, balances, getAccountsResponse } = this.props;
    const { txPerPage } = this.props;
    const { getNetworkResponse } = this.props;

    var totalPages = 1;
    if (this.state.selectedTypeArray.length > 0) {
      totalPages = Math.ceil(this.state.selectedTypeArray.length / txPerPage);

    }

    var selectTxTypes = (
      <div style={HistoryStyles.selectTxTypesArea}>
        <div style={HistoryStyles.selectTxTypesLabel}>Tx Type:</div>
        <Select
          clearable={false}
          style={{zIndex:'9'}}
          onChange={(val) => this.updateSelectedType(val)}
          placeholder={'Select type...'}
          multi={false}
          value={'Regular'}
          valueKey="value" labelKey="label"
          options={this.state.txTypes}/>
      </div>);
    var totalBalance = 0;
    if (balances !== null) {
      for (var i = 0; i < balances.length; i++) {
        if (balances[i].accountName !== 'imported') {
          totalBalance += balances[i].spendable;
        }
      }
    }
    const historyView = (
      <div style={HistoryStyles.view}>
        <Header
          headerTitleOverview="Available Balance"
          headerMetaOverview={<Balance amount={totalBalance} />}
        />
        <div style={HistoryStyles.content}>
          <div style={HistoryStyles.contentTitle}>
            <div style={HistoryStyles.contentTitleText}>Recent Transactions</div>
            {selectTxTypes}
            <div style={HistoryStyles.contentTitleButtonsArea}>
              <button style={HistoryStyles.contentTitleButtonsLeft} disabled={this.state.currentPage < 1} onClick={()=>this.pageBackward()}>&lt;</button>
              <span style={HistoryStyles.contentTitleButtonsText}>{this.state.currentPage + 1} of {totalPages}</span>
              <button style={HistoryStyles.contentTitleButtonsRight} disabled={(this.state.currentPage + 1) * txPerPage >= this.state.selectedTypeArray.length}onClick={()=>this.pageForward()}>&gt;</button>
            </div>
          </div>
          <div style={HistoryStyles.contentNest}>
            {this.state.paginatedTxs.length > 0 ?
              <TxHistory getAccountsResponse={getAccountsResponse} mined={this.state.paginatedTxs} showTxDetail={(tx, type) => this.setTransactionDetails(tx, type)}/>  :
              <p>No transactions</p>
            }
          </div>
        </div>
      </div>);
    if (walletService === null) {
      return (<ErrorScreen />);
    } else {
      return(
        <div style={HistoryStyles.body}>
          <SideBar />
          { this.state.transactionDetails === null ?
          historyView :
          <TxDetails tx={this.state.transactionDetails} detailType={this.state.detailType} clearTxDetails={() => this.clearTransactionDetails()} getAccountsResponse={getAccountsResponse} getNetworkResponse={getNetworkResponse}/>
          }
        </div>);
    }
  }
}

export default History;
