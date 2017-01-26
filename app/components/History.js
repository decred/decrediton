// @flow
import React, { Component, PropTypes } from 'react';
import ErrorScreen from './ErrorScreen';
import SideBar from './SideBar';
import TxHistory from './TxHistory';
import Balance from './Balance';
import CircularProgress from 'material-ui/CircularProgress';

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
  content: {
    width: '880px',
    height: '100%',
    float: 'right',
    backgroundColor: '#f3f6f6',
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
