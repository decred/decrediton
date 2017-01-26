// @flow
import React, { Component, PropTypes } from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import ErrorScreen from './ErrorScreen';
import RescanForm from '../containers/RescanForm';
import Balance from './Balance';
import SideBar from './SideBar';

const styles = {
  pageContentWrapper: {
    width: '100%',
    paddingBottom: '60px',
  },
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
  header: {
    backgroundColor: '#F9FBFC',
    textAlign: 'center',
    borderBottom: '1px solid #e2e2e2',
  },
  center: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
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
  small: {
    fontSize: '0.8em',
  },
  error: {
    color:'red'
  },
  buttons: {
    margin: 12
  },
  content: {
    position: 'absolute',
    top: '70px',
    left: '252px',
    bottom: '0px',
    right: '0px',
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

    const { getBalanceRequestAttempt, getBalanceResponse } = this.props;
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
        <div>
          <LinearProgress mode="determinate"
            min={rescanRequest !== null ? rescanRequest.getBeginHeight(): 0}
            max={getAccountsResponse !== null ? getAccountsResponse.getCurrentBlockHeight(): 100}
            value={rescanResponse !== null ? rescanResponse.getRescannedThrough() : 0} />
          <p>{rescanPercFisnished}%</p>
        </div>
      );
    }
    /* View that will be seen when user has a set Client */
    const homeView = (
      <div style={styles.content}>
        <div style={styles.center}>
          <div style={styles.header}>
						<p>My balance</p>
					</div>
				</div>
        <div style={styles.well}>
          {getBalanceResponse === null ? 'Please refresh' :
          <Balance onClick={!getBalanceRequestAttempt ? () => this.handleBalanceClick() : null}
          amount={getBalanceResponse.getTotal()} /> }
				</div>
        <div style={styles.center}>
          <div style={styles.header}>
            <p>Current block height</p>
					</div>
          <div style={styles.well}>
            <p>{getAccountsResponse === null ? '""' : getAccountsResponse.getCurrentBlockHeight() }</p>
          </div>
        </div>
        <div style={styles.center}>
          {rescanView}
        </div>
      </div>);

    if (walletService === null) {
      return(<ErrorScreen />);
    } else {
      return(
        <div style={styles.body}>
          <SideBar />
          {homeView}
        </div>);
    }
  }
}

export default Home;
