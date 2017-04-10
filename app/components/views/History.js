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
      paginatedTxs: props.transactionsInfo.length >= props.txPerPage  ? props.transactionsInfo.slice(0,props.txPerPage) : props.transactionsInfo.slice(0,props.transactionsInfo.length),
    };
  }
  pageForward() {
    const { transactionsInfo, txPerPage } = this.props;
    const { currentPage } = this.state;
    var newPaginatedTxs = (currentPage+2) * txPerPage > transactionsInfo.length ?
      transactionsInfo.slice((currentPage+1)*txPerPage, transactionsInfo.length) :
      transactionsInfo.slice((currentPage+1)*txPerPage, (currentPage+2) * txPerPage);
    this.setState({paginatedTxs: newPaginatedTxs, currentPage: currentPage+1});
  }

  pageBackward() {
    const { transactionsInfo, txPerPage } = this.props;
    const { currentPage } = this.state;
    var newPaginatedTxs = transactionsInfo.slice((currentPage-1) * txPerPage, (currentPage)*txPerPage);
    this.setState({paginatedTxs: newPaginatedTxs, currentPage: currentPage-1});
  }
  render() {
    const { walletService, getBalanceResponse, getAccountsResponse } = this.props;
    const { transactionDetails, setTransactionDetails, clearTransactionDetails } = this.props;
    const { txPerPage, transactionsInfo } = this.props;
    const { getNetworkResponse } = this.props;

    var totalPages = 1;
    if (transactionsInfo.length > 0) {
      totalPages = Math.floor(transactionsInfo.length / txPerPage) + 1;
    }

    const historyView = (
      <div style={HistoryStyles.view}>
        <Header
          headerTitleOverview="Available Balance"
          headerMetaOverview={<Balance amount={getBalanceResponse !== null ? getBalanceResponse.getTotal() : 0} />}
        />
        <div style={HistoryStyles.content}>
          <div style={HistoryStyles.contentTitle}>
            <div style={HistoryStyles.contentTitleText}>Recent Transactions</div>
            <div style={HistoryStyles.contentTitleButtonsArea}>
              <button style={HistoryStyles.contentTitleButtonsLeft} disabled={this.state.currentPage < 1} onClick={()=>this.pageBackward()}>&lt;</button>
              <span style={HistoryStyles.contentTitleButtonsText}>{this.state.currentPage + 1} of {totalPages}</span>
              <button style={HistoryStyles.contentTitleButtonsRight} disabled={(this.state.currentPage + 1) * txPerPage > transactionsInfo.length}onClick={()=>this.pageForward()}>&gt;</button>
            </div>
          </div>
          <div style={HistoryStyles.contentNest}>
            {this.state.paginatedTxs.length > 0 ?
              <TxHistory getAccountsResponse={getAccountsResponse} mined={this.state.paginatedTxs} showTxDetail={setTransactionDetails}/>  :
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
          { transactionDetails === null ?
          historyView :
          <TxDetails tx={transactionDetails} clearTxDetails={clearTransactionDetails} getAccountsResponse={getAccountsResponse} getNetworkResponse={getNetworkResponse}/>
          }
        </div>);
    }
  }
}

export default History;
