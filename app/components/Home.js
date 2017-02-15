// @flow
import React, { Component, PropTypes } from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import ErrorScreen from './ErrorScreen';
import RescanForm from '../components/RescanForm';
import Balance from './Balance';
import SideBar from './SideBar';
import Search from './icons/search.svg';
import TxHistory from './TxHistory';
import Header from './Header';
import './fonts.css';

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
    width: '600px',
    height: '100%',
    paddingTop: '13px',
    paddingRight: '20px',
    paddingLeft: '20px',
    float: 'left',
  },

  contentTitleButtonSearch: {
    width: '60px',
    height: '100%',
    cursor: 'pointer',
    paddingRight: '20px',
    paddingLeft: '20px',
    float: 'right',
    backgroundImage: `url(${Search})`,
    backgroundPosition: '50% 50%',
    backgroundSize: '20px',
    backgroundRepeat: 'no-repeat',
    ':hover': {
      opacity: '0.8',
    }
  },

  contentTitleButtonSearchTransition1: {
    width: '60px',
    height: '100%',
    cursor: 'pointer',
  },

  contentTitleTextActive: {
    color: '#2971ff',
  },

  contentTitleActive: {
    borderBottom: '1px solid #2971ff',
  },

  headerMetaCurrency: {
    fontSize: '23px',
  },
};

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
    const { paginatedTxs } = this.props;
    const { getBalanceResponse } = this.props;
    const { rescanRequest, rescanResponse } = this.props;
    const { getAccountsResponse } = this.props;

    var rescanPercFisnished;
    if (rescanResponse !== null && getAccountsResponse !== null && rescanRequest != null) {
      var totalBlocks = getAccountsResponse.getCurrentBlockHeight() - rescanRequest.getBeginHeight();
      var blocksFinished = rescanResponse.getRescannedThrough() - rescanRequest.getBeginHeight();
      rescanPercFisnished = (blocksFinished / totalBlocks) * 100;
      rescanPercFisnished = rescanPercFisnished.toFixed(2);
    }
    var rescanView;
    if (rescanResponse === null) {
      rescanView = <RescanForm />;
    } else {
      rescanView = (
        <div style={styles.view}>
          <Header headerTitleOverview="Rescanning">
            <LinearProgress mode="determinate"
              min={rescanRequest !== null ? rescanRequest.getBeginHeight(): 0}
              max={getAccountsResponse !== null ? getAccountsResponse.getCurrentBlockHeight(): 100}
              value={rescanResponse !== null ? rescanResponse.getRescannedThrough() : 0} />
            <p>{rescanPercFisnished}%</p>
            <p>{rescanResponse.getRescannedThrough()}/{getAccountsResponse.getCurrentBlockHeight()}</p>
          </Header>
        </div>
      );
    }

    const homeView = (
      <div style={styles.view}>
        <Header 
          headerTitleOverview="Available Balance"
          headerMetaOverview={<Balance amount={getBalanceResponse !== null ? getBalanceResponse.getTotal() : 0} />}
        />
        <div style={styles.content}>
          <div style={styles.contentTitle}>
            <div style={styles.contentTitleText}>Recent Transactions</div>
          </div>
          <div style={styles.contentNest}>
            {paginatedTxs.length > 0 ?
              <TxHistory mined={paginatedTxs}/>  :
              <p>No transactions</p>
            }
          </div>
        </div>
      </div>);

    if (walletService === null) {
      return(<ErrorScreen />);
    } else {
      return(
        <div style={styles.body}>
          <SideBar />
          {rescanRequest ?
            rescanView :
            homeView
          }
        </div>);
    }
  }
}

export default Home;


/*
  This is the transaction search button that needs to get implemented
  <div style={styles.contentTitleButtonSearch}></div>

*/
