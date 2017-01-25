// @flow
import React, { Component, PropTypes } from 'react';
import ErrorScreen from './ErrorScreen';
import SideBar from './SideBar';
import TxHistory from './TxHistory';
import Balance from './Balance';
import CircularProgress from 'material-ui/CircularProgress';

const styles = {
  body: {
    height: '100%'
  },
  pageWrap: {
    minHeight: '100%',
    /* equal to footer height */
    marginBottom: '-142px',


    ':after': {
      content: '',
      display: 'block',
    },
  },
  header: {
    border:'1px solid #000',
    width:'100px',
    height:'20px',
    margin:'0 0 5px 0',
  },
  content: {
    position: 'absolute',
    top: '78px',
    left: '252px',
    bottom: '0px',
    right: '0px',
  },
  well: {
    width: 'auto',
    fontWeight: 'bold',
    //font-family: $inconsolata;
    fontSize: '1.2rem',
    backgroundColor:'#e9f8fe',
    padding: '5px 5px',
    margin: '20px 0 15px 0',
    border: '2px solid #cacfd6',
    borderRadius: '2px',
    textAlign: 'center',
    color: '#0c1e3e',
    boxShadow: 'none!important',
  },
  currentPage: {
    margin: '20px',
  },
};

class History extends Component{
  static propTypes = {
    walletService: PropTypes.object,
  };

  render() {
    const { walletService, getBalanceResponse, getBalanceRequestAttempt } = this.props;
    const { getTransactionsRequest, txPerPage, transactionsInfo, paginatingTxs, paginatedTxs, getMinedPaginatedTransactions, currentPage } = this.props;
    const historyView = (
      <div style={styles.content}>
        <h3>Available Balance:</h3>
        <div style={styles.well}>
          {getBalanceResponse === null ? 'Please refresh' :
              <Balance onClick={!getBalanceRequestAttempt ? () => this.handleBalanceClick() : null}
              amount={getBalanceResponse.getTotal()} /> }
        </div>
        {paginatedTxs.length > 0 || (paginatingTxs && paginatedTxs.length == 0) ?
          <div>
          {!getTransactionsRequest ?
          <div>
            <button disabled={currentPage <= 1} onClick={()=>getMinedPaginatedTransactions(currentPage-1)}>Newer</button>
            <span style={styles.currentPage}>Page {currentPage}</span>
            <button disabled={(currentPage + 1) * txPerPage > transactionsInfo.length}onClick={()=>getMinedPaginatedTransactions(currentPage+1)}>Older</button>
            {!paginatingTxs ?
              <TxHistory mined={paginatedTxs}/> :
              <CircularProgress size={80} thickness={6}/>
            }
          </div> :
          <div>
            <CircularProgress size={80} thickness={6}/>
            <p>Loading Transactions</p>
          </div>
          }
          </div> :
          <p>No transactions</p>
        }
      </div>);
    if (walletService === null) {
      return (<ErrorScreen />);
    } else {
      return(
        <div style={styles.body}>
          <SideBar />
          {historyView}
        </div>);
    }
  }
}

export default History;
