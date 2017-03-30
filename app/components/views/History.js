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
    var newPaginatedTxs = (currentPage+1) * txPerPage > transactionsInfo.length ?
      transactionsInfo.slice(currentPage*txPerPage, transactionsInfo.length) :
      transactionsInfo.slice(currentPage*txPerPage, (currentPage+1) * txPerPage);
    this.setState({paginatedTxs: newPaginatedTxs, currentPage: currentPage+1});
  }

  pageBackward() {
    const { transactionsInfo, txPerPage } = this.props;
    const { currentPage } = this.state;
    var newPaginatedTxs = transactionsInfo.slice((currentPage-1) * txPerPage, currentPage*txPerPage);
    this.setState({paginatedTxs: newPaginatedTxs, currentPage: currentPage-1});
  }
  render() {
    console.log(this.state.currentPage);
    const { walletService, getBalanceResponse, getAccountsResponse } = this.props;
    const { transactionDetails, setTransactionDetails, clearTransactionDetails } = this.props;
    const { txPerPage, transactionsInfo } = this.props;
    const { getNetworkResponse } = this.props;


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
              <button style={styles.contentTitleButtonsLeft} disabled={this.state.currentPage < 1} onClick={()=>this.pageBackward()}>&lt;</button>
              <span style={styles.contentTitleButtonsText}>{this.state.currentPage + 1} of {totalPages}</span>
              <button style={styles.contentTitleButtonsRight} disabled={(this.state.currentPage + 1) * txPerPage > transactionsInfo.length}onClick={()=>this.pageForward()}>&gt;</button>
            </div>
          </div>
          <div style={styles.contentNest}>
            {this.state.paginatedTxs.length > 0 ?
              <TxHistory mined={this.state.paginatedTxs} showTxDetail={setTransactionDetails}/>  :
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
