// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import ErrorScreen from './ErrorScreen';
import RescanForm from '../containers/RescanForm';

const styles = {
  mainArea: {
    backgroundColor:'#2971ff'
  },
  sideBar: {
    backgroundColor:'#2ed8a3'
  },
  error: {
    color:'red'
  },
  buttons: {
    margin: 12
  }
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
    const { getStakeInfoRequestAttempt, getStakeInfoResponse } = this.props;
    const { rescanRequest, rescanRequestAttempt, rescanError, rescanResponse } = this.props;
    const { getAccountsResponse } = this.props;
    var rescanPercFisnished;
    if (rescanResponse !== null && getAccountsResponse !== null && rescanRequest != null) {
      var totalBlocks = getAccountsResponse.current_block_height - rescanRequest.begin_height;
      var blocksFinished = rescanResponse.rescanned_through - rescanRequest.begin_height;
      rescanPercFisnished = (blocksFinished / totalBlocks) * 100;
    }
    var rescanView;
    if (rescanResponse === null) {
      rescanView = <RescanForm />
    } else {
      rescanView = (
        <div>
          <LinearProgress mode="determinate"
            min={rescanRequest !== null ? rescanRequest.begin_height: 0}
            max={getAccountsResponse !== null ? getAccountsResponse.current_block_height: 100}
            value={rescanResponse !== null ? rescanResponse.rescanned_through : 0} />
          <p>{rescanPercFisnished}%</p>
        </div>
      );
    }
    /* View that will be seen when user has a set Client */
    const homeView = (
      <div >
        <h1>Home Page</h1>
        <h3>Current block height: {getAccountsResponse === null ? 'Please refresh' : getAccountsResponse.current_block_height }</h3>
        <h3>Current balance: {getBalanceResponse === null ? 'Please refresh' : getBalanceResponse.total }</h3>
        <RaisedButton
          style={styles.buttons}
          disabled={getBalanceRequestAttempt}
          onClick={!getBalanceRequestAttempt ? () => this.handleBalanceClick() : null}
          label={getBalanceRequestAttempt ? 'Getting Balance...' : 'Get Balance'}/>
        <h3>StakeInfo: {getStakeInfoResponse === null ? 'Please refresh' : getStakeInfoResponse.pool_size}</h3>
        <RaisedButton
          style={styles.buttons}
          disabled={getStakeInfoRequestAttempt}
          onClick={!getStakeInfoRequestAttempt? () => this.props.getStakeInfoAttempt() : null}
          label={getStakeInfoRequestAttempt ? 'Getting Stake Info...' : 'Get Stake Info'}/>
        {rescanView}
      </div>);


    if (walletService === null) {
      return(<ErrorScreen />);
    } else {
      return(homeView);
    }
  }
}

export default Home;
