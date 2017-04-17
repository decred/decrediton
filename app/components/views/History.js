// @flow
import React, { Component, PropTypes } from 'react';
import ErrorScreen from '../ErrorScreen';
import SideBar from '../SideBar';
import TxHistory from '../TxHistory';
import Balance from '../Balance';
import TxDetails from './TxDetails';
import Header from '../Header';
import { HistoryStyles } from './ViewStyles';

class History extends Component{
  static propTypes = {
    walletService: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      paginatedTxs: props.regularTransactionsInfo.length >= props.txPerPage  ? props.regularTransactionsInfo.slice(0,props.txPerPage) : props.regularTransactionsInfo.slice(0,props.regularTransactionsInfo.length),
      selectedTypeArray: props.regularTransactionsInfo,
      selectedType: 'Regular',
      transactionDetails: null,
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
    }
    var paginatedTxs = selectedTypeArray.length >= this.props.txPerPage  ? selectedTypeArray.slice(0,this.props.txPerPage) : selectedTypeArray.slice(0,selectedTypeArray.length);
    this.setState({selectedType: type, currentPage: 0, selectedTypeArray: selectedTypeArray, paginatedTxs: paginatedTxs});
  }
  setTransactionDetails(tx) {
    this.setState({transactionDetails: tx});
  }
  clearTransactionDetails() {
    this.setState({transactionDetails: null});
  }

  render() {
    const { walletService, getBalanceResponse, getAccountsResponse } = this.props;
    const { txPerPage } = this.props;
    const { regularTransactionsInfo, ticketTransactionsInfo, voteTransactionsInfo, revokeTransactionsInfo } = this.props;
    const { getNetworkResponse } = this.props;

    var totalPages = 1;
    if (this.state.selectedTypeArray.length > 0) {
      totalPages = Math.floor(this.state.selectedTypeArray.length / txPerPage) + 1;
    }

    var selectTxTypes = (
      <select
        defaultValue={this.state.selectedType}
        style={HistoryStyles.selectTxTypes}
        onChange={(e) =>{this.updateSelectedType(e.target.value);}}
        >
        <option style={HistoryStyles.selectTxTypesN} value='Regular' label='Regular' disabled={regularTransactionsInfo.length == 0}/>
        <option style={HistoryStyles.selectTxTypesN} value='Tickets' label='Tickets' disabled={ticketTransactionsInfo.length == 0}/>
        <option style={HistoryStyles.selectTxTypesN} value='Votes' label='Votes' disabled={voteTransactionsInfo.length == 0}/>
        <option style={HistoryStyles.selectTxTypesN} value='Revokes' label='Revokes' disabled={revokeTransactionsInfo.length == 0}/>
      </select>);

    const historyView = (
      <div style={HistoryStyles.view}>
        <Header
          headerTitleOverview="Available Balance"
          headerMetaOverview={<Balance amount={getBalanceResponse !== null ? getBalanceResponse.getTotal() : 0} />}
        />
        <div style={HistoryStyles.content}>
          <div style={HistoryStyles.contentTitle}>
            <div style={HistoryStyles.contentTitleText}>Recent Transactions</div>
            {selectTxTypes}
            <div style={HistoryStyles.contentTitleButtonsArea}>
              <button style={HistoryStyles.contentTitleButtonsLeft} disabled={this.state.currentPage < 1} onClick={()=>this.pageBackward()}>&lt;</button>
              <span style={HistoryStyles.contentTitleButtonsText}>{this.state.currentPage + 1} of {totalPages}</span>
              <button style={HistoryStyles.contentTitleButtonsRight} disabled={(this.state.currentPage + 1) * txPerPage > this.state.selectedTypeArray.length}onClick={()=>this.pageForward()}>&gt;</button>
            </div>
          </div>
          <div style={HistoryStyles.contentNest}>
            {this.state.paginatedTxs.length > 0 ?
              <TxHistory getAccountsResponse={getAccountsResponse} mined={this.state.paginatedTxs} showTxDetail={(tx) => this.setTransactionDetails(tx)}/>  :
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
          <TxDetails tx={this.state.transactionDetails} clearTxDetails={() => this.clearTransactionDetails()} getAccountsResponse={getAccountsResponse} getNetworkResponse={getNetworkResponse}/>
          }
        </div>);
    }
  }
}

export default History;
