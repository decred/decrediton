// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import LoginForm from '../containers/LoginForm';
import LoaderForm from '../containers/LoaderForm';
import WalletExistForm from '../containers/WalletExistForm';
import WalletOpenForm from '../containers/WalletOpenForm';
import CreateWalletForm from '../containers/CreateWalletForm';
import ShowError from './ShowError';
import {
  Step,
  Stepper,
  StepLabel,
  StepContent
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
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
    // Step 0
    getLoaderRequestAttempt: PropTypes.bool.isRequired,
    // Step 1
    walletExistRequestAttempt: PropTypes.bool.isRequired,
    // Step 2
    walletCreateRequestAttempt: PropTypes.bool.isRequired,
    walletOpenRequestAttempt: PropTypes.bool.isRequired,
    // Step 3
    startRpcRequestAttempt: PropTypes.bool.isRequired,
    // Step 4
    discoverAddressRequestAttempt: PropTypes.bool.isRequired,
    // Step 5
    fetchHeadersRequestAttempt: PropTypes.bool.isRequired,
    // Step 6
    subscribeBlockNtfnsRequestAttempt: PropTypes.bool.isRequired,
    // Final Prep
    getWalletServiceRequestAttempt: PropTypes.bool.isRequired,
    loadActiveDataFiltersRequestAttempt: PropTypes.bool.isRequired,
    walletService: PropTypes.object,


    stepIndex: PropTypes.number.isRequired,
  }

  render() {
    const { stepIndex } = this.props;

    const { address, port } = this.props;

    const { loader, getLoaderRequestAttempt, getLoaderError, loaderRequest } = this.props;
    /*
    const { walletCreateResponse, walletCreateRequestAttempt, walletCreateError } = this.props;
    const { walletOpenResponse, walletOpenRequestAttempt, walletOpenError } = this.props;
    const { walletExistResponse, walletExistRequestAttempt, walletExistError } = this.props;
    const { walletCloseResponse, walletCloseRequestAttempt, walletCloseError } = this.props;
    const { startRpcResponse, startRpcRequestAttempt, startRpcError } = this.props;
    const { loadActiveDataFiltersAttempt } = this.props;


    const getStarted = (
      <div>
        <p>{error}</p>
        <h3>Welcome to Decrediton</h3>
        <h5>Please enter the information below to connect to you dcrwallet</h5>
        <LoginForm />
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
      */
    const getStartedWalletLoader = (
      <div >
        <RaisedButton type="submit"
          style={styles.buttons}
          primary={true}
          onClick={() => {loaderRequest(address, port);}}
          label='Get Started'/>
      </div>);
    const blah = "blahblahblah";
    const getStartedWalletOpen = (
      <div>
        <ShowError error={blah} />
        <h3>Opening wallet</h3>
        <h5>Please enter the information below to connect to you dcrwallet</h5>
        <WalletOpenForm />
      </div>);
      /*
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
    */

    var openOrCreate = 'Create Wallet';

    const stepper = (
      <div style={{width: '100%',  margin: 'auto'}}>
        <Stepper activeStep={stepIndex} orientation="vertical">
          <Step>
            <StepLabel>Get Wallet Loader Service</StepLabel>
            <StepContent>
              {getStartedWalletLoader}
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Wallet Exist</StepLabel>
            <StepContent>
              {}
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Wallet Create/Open</StepLabel>
            <StepContent>
              {getStartedWalletOpen}
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Start RPC Concensus</StepLabel>
            <StepContent>
              {}
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Discover Addresses</StepLabel>
            <StepContent>
              {}
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Fetch Headers</StepLabel>
            <StepContent>
              {}
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Subscribe to Block Notifications</StepLabel>
            <StepContent>
              {}
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Final Prep</StepLabel>
            <StepContent>
              {}
            </StepContent>
          </Step>
        </Stepper>
      </div>
    );


    return (stepper);

  }
}

export default Home;
