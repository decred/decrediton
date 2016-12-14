// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import LoginForm from '../containers/LoginForm';
import LoaderForm from '../containers/LoaderForm';
import WalletExistForm from '../containers/WalletExistForm';
import WalletOpenForm from '../containers/WalletOpenForm';
import CreateWalletForm from '../containers/CreateWalletForm';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';

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
    address: PropTypes.string.isRequired,
    port: PropTypes.string.isRequired,
    passphrase: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isLoggingIn: PropTypes.bool.isRequired,
    client: PropTypes.object,
    error: PropTypes.string,

    getBalanceRequestAttempt: PropTypes.bool.isRequired,
    getStakeInfoRequestAttempt: PropTypes.bool.isRequired,

    getLoaderRequestAttempt: PropTypes.bool.isRequired,
    walletCreateRequestAttempt: PropTypes.bool.isRequired,
    walletExistRequestAttempt: PropTypes.bool.isRequired,
    walletOpenRequestAttempt: PropTypes.bool.isRequired,
  }

  handleBalanceClick = () => {
    this.props.getBalanceAttempt(0,1);
  }

  render() {
    const { address, port } = this.props;
    const { isLoggedIn, isLoggingIn, client, error} = this.props;

    const { getBalanceRequestAttempt, getBalanceResponse } = this.props;
    const { getStakeInfoRequestAttempt, getStakeInfoResponse } = this.props;

    const { loader, getLoaderRequestAttempt, getLoaderError, loaderRequest } = this.props;
    const { walletCreateResponse, walletCreateRequestAttempt, walletCreateError } = this.props;
    const { walletOpenResponse, walletOpenRequestAttempt, walletOpenError } = this.props;
    const { walletExistResponse, walletExistRequestAttempt, walletExistError } = this.props;
    const { walletCloseResponse, walletCloseRequestAttempt, walletCloseError } = this.props;
    const { startRpcResponse, startRpcRequestAttempt, startRpcError } = this.props;
    const { loadActiveDataFiltersAttempt } = this.props;
    
    /*  View that will be seen on fresh starts */
    const getStarted = (
      <div>
        <p>{error}</p>
        <h3>Welcome to Decrediton</h3>
        <h5>Please enter the information below to connect to you dcrwallet</h5>
        <LoginForm />
      </div>);

    /*  View that will be when logging in is occuring */
    const getStartedLoggingIn = (
      <div >
        Logging in
        <LinearProgress mode="indeterminate" />
      </div>);

    /* View that will be shown when an error on logging in occured */
    const getStartedError = (
      <div >
        <p> {error} </p>
      </div>);

    /* View that will be seen when user has a set Client */
    const homeView = (
      <div >
        <h1>Home Page</h1>
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
        <RaisedButton
          style={styles.buttons}
          onClick={() => this.props.loadActiveDataFiltersAttempt()}
          label='Load Active Data Filters'/>
      </div>);

    const getStartedCreateWallet = (
      <div>
        <CreateWalletForm />
      </div>);

    const getStartedWalletCreating = (
      <div >
        <h3> Creating wallet </h3>
        <LinearProgress mode="indeterminate" />
      </div>);

    const getStartedWalletLoader = (
      <div >
        <p>{error}</p>
        <RaisedButton type="submit"
          style={styles.buttons}
          primary={true}
          onClick={() => {loaderRequest(address, port);}}
          label='Get Started'/>
      </div>);

    const getStartedGettingLoader = (
      <div >
        <h3>Getting wallet loader service</h3>
        <LinearProgress mode="indeterminate" />
      </div>);

    const getStartedWalletExistRequest = (
      <div >
        <h3>Checking if wallet exists</h3>
        <LinearProgress mode="indeterminate" />
      </div>);

    const getStartedWalletExist = (
      <div>
        <p>{error}</p>
        <h3>Check if wallet exists</h3>
      </div>);

    const getStartedWalletOpen = (
      <div>
        <p >{error}</p>
        <h3>Opening wallet</h3>
        <h5>Please enter the information below to connect to you dcrwallet</h5>
        <WalletOpenForm />
      </div>);

    const getStartedOpeningWallet = (
      <div>
        <h3>Opening wallet</h3>
        <LinearProgress mode="indeterminate" />
      </div>);

    // Step 4 complete
    if (isLoggedIn) {
      if (client === undefined) {
        return(getStarted);
      } else {
        return(homeView);
      }
    }
    // Step 4 action
    if (isLoggingIn) {
      return (getStartedLoggingIn);
    }
    // Step 3 complete/ Step 4 start
    if (walletOpenResponse !== null) {
      return(getStarted);
    }
    // Step 3 action
    if (walletOpenRequestAttempt) {
      return (getStartedOpeningWallet);
    }
    // Step 2 complete/ Step 3 start
    if (walletExistResponse !== null && walletExistResponse.exists) {
      return(getStartedWalletOpen);
    }
    // Step 2b creating wallet
    if (walletCreateRequestAttempt) {
      return(getStartedWalletCreating);
    }
    // Step 2 wallet exist action complete, though
    // wallet does not exist

    if (walletExistResponse !== null && !walletExistResponse.exists) {
      return(getStartedCreateWallet);
    }
    // Step 2 action
    if (walletExistRequestAttempt) {
      return(getStartedWalletExistRequest);
    }
    // Step 1 complete/ Step 2 start
    if (loader !== null) {
      return(getStartedWalletExist);
    }

    // Step 1 action
    if (getLoaderRequestAttempt) {
      return (getStartedGettingLoader);
    }
    // Step 1 start
    return (getStartedWalletLoader);
  }
}

export default Home;
