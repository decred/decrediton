// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import LoginForm from '../containers/LoginForm';
import LoaderForm from '../containers/LoaderForm';
import WalletExistForm from '../containers/WalletExistForm';
import WalletOpenForm from '../containers/WalletOpenForm';
import CreateWalletForm from '../containers/CreateWalletForm';
import RaisedButton from 'material-ui/RaisedButton';
import { Col, Row } from 'react-bootstrap';

const styles = {
  mainArea: {
    backgroundColor:"#2971ff"
  },
  sideBar: {
    backgroundColor:"#2ed8a3"
  },
  error: {
    color:"red"
  }
}

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

    /*  View that will be seen on fresh starts */
    const getStarted = (      
      <div >
        <Row>
          <Col xs={10} sm={10} md={8} lg={6} xsPush={1} smPush={1} mdPush={2} lgPush={3}>
            <Row>
              <p >{error}</p>
            </Row>
            <Row>
              <h3>Welcome to Decrediton</h3>
              <h5>Please enter the information below to connect to you dcrwallet</h5>
              <LoginForm />
            </Row>
          </Col>
        </Row>
      </div>);

    /*  View that will be when logging in is occuring */
    const getStartedLoggingIn = (
      <div >
        <Row>
          <Col sm={12} >
            Logging in!
          </Col>
        </Row>
      </div>);

    /* View that will be shown when an error on logging in occured */
    const getStartedError = (
      <div >
        <Row>
          <Col sm={12} >
            Logging in!
          </Col>
        </Row>
      </div>);

    /* View that will be seen when user has a set Client */
    const homeView = (      
      <div >
        <Row>
          <Col sm={12} >
            <h1>Home Page</h1>
            <h3>Current balance: {getBalanceResponse === null ? 'Please refresh' : getBalanceResponse.total }</h3>
            <RaisedButton                   
              primary={true}
              disabled={getBalanceRequestAttempt}
              onClick={!getBalanceRequestAttempt ? () => this.handleBalanceClick() : null}>
              {getBalanceRequestAttempt ? 'Getting Balance...' : 'Get Balance'}
            </RaisedButton>
            <h3>StakeInfo: {getStakeInfoResponse === null ? 'Please refresh' : getStakeInfoResponse.pool_size}</h3>
            <RaisedButton 
              disabled={getStakeInfoRequestAttempt}
              onClick={!getStakeInfoRequestAttempt? () => this.props.getStakeInfoAttempt() : null}>
              {getStakeInfoRequestAttempt ? 'Getting Stake Info...' : 'Get Stake Info'}
            </RaisedButton>
          </Col>
        </Row>
      </div>);

    const getStartedCreateWallet = (    
      <div >
        <Row>
          <Col sm={12} >
            <h1>Home Page</h1>
            <h3>Try and createWallet</h3>
            <CreateWalletForm />
          </Col>
        </Row>
      </div>);

    const getStartedWalletCreating = (      
      <div >
        <Row>
          <Col sm={12} >
            <p> Creating wallet </p>
          </Col>
        </Row>
      </div>);
    
    const getStartedWalletLoader = (      
      <div >
        <Row>
          <Col xs={10} sm={10} md={8} lg={6} xsPush={1} smPush={1} mdPush={2} lgPush={3}>
            <Row>
              <p >{error}</p>
            </Row>
            <Row>
              <RaisedButton type="submit"
                primary={true}
                onClick={() => {loaderRequest(address, port)}}>
                Get Started
              </RaisedButton>
            </Row>
          </Col>
        </Row>
      </div>);

    const getStartedGettingLoader = (      
      <div >
        <Row>
          <Col xs={10} sm={10} md={8} lg={6} xsPush={1} smPush={1} mdPush={2} lgPush={3}>
            <Row>
              <p >{error}</p>
            </Row>
            <Row>
              <h3>Getting wallet loader service</h3>
            </Row>
          </Col>
        </Row>
      </div>);
      
    const getStartedWalletExistRequest = (      
      <div >
        <Row>
          <Col xs={10} sm={10} md={8} lg={6} xsPush={1} smPush={1} mdPush={2} lgPush={3}>
            <Row>
              <p>{error}</p>
            </Row>
            <Row>
              <h3>Checking if wallet exists...</h3>
            </Row>
          </Col>
        </Row>
      </div>);

    const getStartedWalletExist = (      
      <div>
        <Row>
          <Col xs={10} sm={10} md={8} lg={6} xsPush={1} smPush={1} mdPush={2} lgPush={3}>
            <Row>
              <p>{error}</p>
            </Row>
            <Row>
              <h3>Check if wallet exists</h3>
            </Row>
          </Col>
        </Row>
      </div>);

    const getStartedWalletOpen = (      
      <div>
        <Row>
          <Col xs={10} sm={10} md={8} lg={6} xsPush={1} smPush={1} mdPush={2} lgPush={3}>
            <Row>
              <p >{error}</p>
            </Row>
            <Row>
              <h3>Opening wallet</h3>
              <h5>Please enter the information below to connect to you dcrwallet</h5>
              <WalletOpenForm />
            </Row>
          </Col>
        </Row>
      </div>);

    const getStartedOpeningWallet = (      
      <div>
        <Row>
          <Col xs={10} sm={10} md={8} lg={6} xsPush={1} smPush={1} mdPush={2} lgPush={3}>
            <Row>
              <p >{error}</p>
            </Row>
            <Row>
              <h3>Trying to open wallet</h3>
            </Row>
          </Col>
        </Row>
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
      return(getStartedWalletCreating)
    }
    // Step 2 wallet exist action complete, though
    // wallet does not exist
    
    if (walletExistResponse !== null && !walletExistResponse.exists) {
      return(getStartedCreateWallet)
    }
    // Step 2 action
    if (walletExistRequestAttempt) {
      return(getStartedWalletExistRequest)
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
};

export default Home;
