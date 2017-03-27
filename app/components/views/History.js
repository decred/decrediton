// @flow
import React, { Component, PropTypes } from 'react';
import ErrorScreen from '../ErrorScreen';
import SideBar from '../SideBar';
import TxHistory from '../TxHistory';
import Balance from '../Balance';
import TxDetails from './TxDetails';
import Header from '../Header';

const styles = {
  body: {
    position: 'fixed',
    left: '0px',
    top: '50%',
    right: '0px',
    display: 'block',
    overflow: 'hidden',
    width: '1178px',
    height: '770px',
    marginTop: '-385px',
    marginRight: 'auto',
    marginLeft: 'auto',
    backgroundColor: '#FFF',
  },
  view: {
    width: '880px',
    height: '100%',
    float: 'right',
    backgroundColor: '#f3f6f6',
  },
  content: {
    overflow: 'auto',
    height: '556px',
    padding: '54px 60px 54px 80px',
  },
  transition1: {
    transition: 'all 100ms cubic-bezier(.86, 0, .07, 1)',
  },
  contentTitle: {
    display: 'block',
    height: '44px',
    marginRight: 'auto',
    marginBottom: '10px',
    marginLeft: 'auto',
    borderBottom: '1px solid transparent',
    color: '#596d81',
    fontSize: '27px',
    transition: 'all 250ms cubic-bezier(.86, 0, .07, 1)',
  },
  contentNest: {
    paddingTop: '1px',
  },
  contentTitleText: {
    display: 'inline-block',
    overflow: 'hidden',
    width: '500px',
    height: '100%',
    paddingTop: '13px',
    paddingRight: '20px',
    paddingLeft: '20px',
    float: 'left',
  },
  contentTitleButtonsArea: {
    float: 'right',
    height: '100%',
    paddingTop: '13px',
  },
  contentTitleButtonsText: {
    padding: '0px 10px 0px 10px',
  },
  contentTitleButtonsLeft: {
    marginTop: '3px',
    display: 'block',
    float: 'left',
    fontFamily: 'Inconsolata, monospace',
  },
  contentTitleButtonsRight: {
    marginTop: '3px',
    display: 'block',
    float: 'right',
    fontFamily: 'Inconsolata, monospace',
  }
};

class History extends Component{
  static propTypes = {
    walletService: PropTypes.object,
  };

  render() {
    const { walletService, getBalanceResponse,getAccountsResponse } = this.props;
    const { transactionDetails, setTransactionDetails, clearTransactionDetails } = this.props;
    const { txPerPage, transactionsInfo, paginatedTxs, getMinedPaginatedTransactions, currentPage } = this.props;
    const { getNetworkResponse } = this.props;
    const { unminedTransactions } = this.props;
    
    var totalPages = 1;
    if (transactionsInfo.length > 0) {
      totalPages = Math.floor(transactionsInfo.length / txPerPage) + 1;
    }

    const historyView = (
      <div style={styles.view}>
        <Header
          headerTitleOverview="Available Balance"
          headerMetaOverview={<Balance amount={getBalanceResponse !== null ? getBalanceResponse.getTotal() : 0} />}
        />
        <div style={styles.content}>
          <div style={styles.contentTitle}>
            <div style={styles.contentTitleText}>Recent Transactions</div>
            <div style={styles.contentTitleButtonsArea}>
              <button style={styles.contentTitleButtonsLeft} disabled={currentPage <= 1} onClick={()=>getMinedPaginatedTransactions(currentPage-1)}>&lt;</button>
              <span style={styles.contentTitleButtonsText}>{currentPage} of {totalPages}</span>
              <button style={styles.contentTitleButtonsRight} disabled={(currentPage + 1) * txPerPage > transactionsInfo.length}onClick={()=>getMinedPaginatedTransactions(currentPage+1)}>&gt;</button>
            </div>
          </div>
          <div style={styles.contentNest}>
            {paginatedTxs.length > 0 ?
              <TxHistory mined={paginatedTxs} showTxDetail={setTransactionDetails}/>  :
              <p>No transactions</p>
            }
          </div>
        </div>
      </div>);
    if (walletService === null) {
      return (<ErrorScreen />);
    } else {
      return(
        <div style={styles.body}>
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
