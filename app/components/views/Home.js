// @flow
import React, { Component, PropTypes } from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import CircularProgress from 'material-ui/CircularProgress';
import ErrorScreen from '../ErrorScreen';
import Balance from '../Balance';
import SideBar from '../SideBar';
import TxHistory from '../TxHistory';
import Header from '../Header';
import '../fonts.css';
import { HomeStyles } from './ViewStyles';

class Home extends Component{
  constructor(props) {
    super(props);
  }

  static propTypes = {
    walletService: PropTypes.object,

    getBalanceRequestAttempt: PropTypes.bool.isRequired,
    getStakeInfoRequestAttempt: PropTypes.bool.isRequired,
  }

  handleBalanceClick = () => {
    this.props.getBalanceAttempt(0,1);
  }

  render() {
    const { walletService } = this.props;
    const { regularTransactionsInfo, txPerPage } = this.props;
    const { getBalanceResponse } = this.props;
    const { getTransactionsRequestAttempt } = this.props;
    const { rescanRequest, rescanResponse } = this.props;
    const { getAccountsResponse } = this.props;
    const { synced } = this.props;
    const { unmined } = this.props;

    var transactionMessage = '';
    if (regularTransactionsInfo.length == 0) {
      transactionMessage = 'No transactions';
    }
    var paginatedTxs = unmined.length > 0 ?
    unmined.length > txPerPage ? Array() :
    regularTransactionsInfo.length + unmined.length >= txPerPage  ? regularTransactionsInfo.slice(0,txPerPage-unmined.length) : regularTransactionsInfo.slice(0,regularTransactionsInfo.length+unmined.length):
    regularTransactionsInfo.length >= txPerPage  ? regularTransactionsInfo.slice(0,txPerPage) : regularTransactionsInfo.slice(0,regularTransactionsInfo.length);

    var rescanPercFisnished;
    if (rescanResponse !== null && getAccountsResponse !== null && rescanRequest != null) {
      var totalBlocks = getAccountsResponse.getCurrentBlockHeight() - rescanRequest.getBeginHeight();
      var blocksFinished = rescanResponse.getRescannedThrough() - rescanRequest.getBeginHeight();
      rescanPercFisnished = (blocksFinished / totalBlocks) * 100;
      rescanPercFisnished = rescanPercFisnished.toFixed(2);
    }

    const homeView = (
      <div style={HomeStyles.view}>
        {rescanRequest ?
          <Header headerTitleOverview="Rescanning">
            <LinearProgress mode="determinate"
              min={rescanRequest !== null ? rescanRequest.getBeginHeight(): 0}
              max={getAccountsResponse !== null ? getAccountsResponse.getCurrentBlockHeight(): 100}
              value={rescanResponse !== null ? rescanResponse.getRescannedThrough() : 0} />
            <p>{rescanPercFisnished}%</p>
            <p>{rescanResponse.getRescannedThrough()}/{getAccountsResponse.getCurrentBlockHeight()}</p>
          </Header>:
          <Header
            headerTop={ !synced ?
                <div key="notSynced" style={HomeStyles.viewNotificationNotSynced}>
                  Wallet not synced. Note: Balances will not be accurate until syncing is complete.
                </div> :
                <div key="notSynced" ></div>
            }
            headerTitleOverview="Available Balance"
            headerMetaOverview={<Balance amount={getBalanceResponse !== null ? getBalanceResponse.getTotal() : 0} />}
          />
        }
        {!getTransactionsRequestAttempt ?
          <div style={HomeStyles.content}>
            <div style={HomeStyles.contentTitle}>
              <div style={HomeStyles.contentTitleText}>Recent Transactions</div>
            </div>
            <div style={HomeStyles.contentNest}>
              {unmined.length > 0 ?
                <TxHistory getAccountsResponse={getAccountsResponse} unmined={unmined}/>  :
                <p></p>
              }
              {paginatedTxs.length > 0 ?
                <TxHistory getAccountsResponse={getAccountsResponse} mined={paginatedTxs}/>  :
                <p>{transactionMessage}</p>
              }
            </div>
          </div> :
          <div style={HomeStyles.content}>
            <CircularProgress style={HomeStyles.loading} size={125} thickness={6}/> :
          </div>
        }
      </div>);

    if (walletService === null) {
      return(<ErrorScreen />);
    } else {
      return(
        <div style={HomeStyles.body}>
          <SideBar />
          {homeView}
        </div>);
    }
  }
}

export default Home;


/*
  This is the transaction search button that needs to get implemented
  <div style={HomeStyles.contentTitleButtonSearch}></div>

*/
