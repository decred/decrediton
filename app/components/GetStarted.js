// @flow
import React, { Component, PropTypes } from 'react';
import WalletOpenForm from '../containers/WalletOpenForm';
import CreateWalletForm from '../containers/CreateWalletForm';
import DiscoverAddressForm from '../containers/DiscoverAddressForm';
import CircularProgress from 'material-ui/CircularProgress';
import LinearProgress from 'material-ui/LinearProgress';
import Dialog from 'material-ui/Dialog';
import ShowError from './ShowError';
import Header from './Header';
import SideBar from './SideBar';
import Footer from './Footer';
import Radium from 'radium';

import {
  Step,
  Stepper,
  StepLabel,
  StepContent
} from 'material-ui/Stepper';
import FlatButton from 'material-ui/FlatButton';

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
    border:'1px solid #000',
    margin:'5px 0 5px 0',
  },
};

class Home extends Component{

  handleDisclaimerOK = () => {
    this.props.disclaimerOKAction();
  }
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
    const { curBlocks, neededBlocks } = this.props;
    const { stepIndex } = this.props;
    const { disclaimerOK } = this.props;
    const { versionInvalid, versionInvalidError } = this.props;
    const { getVersionServiceError } = this.props;
    const { getLoaderError } = this.props;
    const { walletCreateRequestAttempt, walletCreateError } = this.props;
    const { walletOpenRequestAttempt, walletOpenError } = this.props;
    const { walletExistResponse } = this.props;
    const { startRpcRequestAttempt, startRpcError } = this.props;
    const { discoverAddressRequestAttempt, discoverAddressError } = this.props;
    const { fetchHeadersRequestAttempt } = this.props;
    const { generateRandomSeedResponse } = this.props;

    const getStartedWalletLoader = (
      <div>
        <ShowError error={getLoaderError} />
        <ShowError error={getVersionServiceError}/>
      </div>);
    var openingWallet;
    if (walletOpenRequestAttempt) {
      openingWallet = (
        <div>
          <CircularProgress size={80} thickness={6}/>
        </div>
      );
    } else {
      openingWallet = (
        <div>
          <ShowError error={walletOpenError} />
          <h3>Opening wallet</h3>
          <h5>Please enter the information below to connect to you dcrwallet</h5>
          <WalletOpenForm/>
      </div>);
    }
    const getStartedWalletOpen = (openingWallet);


    var creatingWallet;
    var seedReady = (<div></div>);
    if (generateRandomSeedResponse !== null) {
      seedReady = (<CreateWalletForm seedText={generateRandomSeedResponse}/>);
    }
    if (walletCreateRequestAttempt) {
      creatingWallet = (
        <div>
          <CircularProgress size={80} thickness={6}/>
        </div>
      );
    } else {
      creatingWallet = (
        <div>
          <ShowError error={walletCreateError} />
          <h3>Create wallet</h3>
          <h5>Please enter the information below to create your dcrwallet</h5>
          {seedReady}
        </div>
      );
    }
    const getStartedWalletCreate = (creatingWallet);

    var startRpc;
    if (startRpcRequestAttempt) {
      startRpc = (
        <div>
          <CircularProgress size={80} thickness={6}/>
        </div>
      );
    } else {
      startRpc = (
      <div>
        <ShowError error={startRpcError} />
      </div>
      );
    }

    var discoveringAddresses;
    if (discoverAddressRequestAttempt) {
      discoveringAddresses = (
        <div>
          <CircularProgress size={80} thickness={6}/>
        </div>
      );
    } else {
      discoveringAddresses = (
      <div>
        <ShowError error={discoverAddressError} />
        <h3>Discover used addresses</h3>
        <h5>Please enter your private password below to discover accounts:</h5>
        <DiscoverAddressForm />
      </div>);
    }
    const getStartedDiscoverAddress = (discoveringAddresses);

    var ibdBlockProgress;
    ibdBlockProgress = (curBlocks / neededBlocks) * 100;
    ibdBlockProgress = ibdBlockProgress.toFixed(2);

    var fetchingHeaders;
    if (fetchHeadersRequestAttempt) {
      fetchingHeaders = (
        <div>
          <LinearProgress mode="determinate"
            min={0}
            max={neededBlocks}
            value={curBlocks} />
          <p>{ibdBlockProgress}%</p>
        </div>
      );
    } else {
      fetchingHeaders = (
      <div>
      </div>);
    }
    const fetchHeaders = (fetchingHeaders);
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

    var openOrCreate;
    if (walletExistResponse !== null && walletExistResponse.getExists()) {
      openOrCreate = getStartedWalletOpen;
    } else {
      openOrCreate = getStartedWalletCreate;
    }

    const stepper = (
      <div style={styles.content}>
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
              {openOrCreate}
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Start RPC Concensus</StepLabel>
            <StepContent>
              {startRpc}
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Fetch Headers</StepLabel>
            <StepContent>
              {fetchHeaders}
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Discover Addresses</StepLabel>
            <StepContent>
              {getStartedDiscoverAddress}
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
    const actions = [
      <FlatButton
        label="OK, I Understand"
        primary={true}
        onTouchTap={this.handleDisclaimerOK}
      />,
    ];
    if (!disclaimerOK) {
      return (
        <div>
          <Dialog
            title="Disclaimer"
            actions={actions}
            modal={true}
            open={true}
          >
            Decrediton is currently under heavy development and currently in an alpha-state.  While we have tested
            the code thoroughly, we suggest avoiding using on Mainnet.  Use at your own risk!
          </Dialog>
        </div>);
    } else {
      if (!versionInvalid) {
        return (
          <div style={styles.body}>
            <div style={styles.pageWrap}>
              <SideBar />
              <Header />
              {stepper}
            </div>
            <Footer />
          </div>);
      } else {
        return (<ShowError error={versionInvalidError}/>);
      }
    }

  }
}

export default Radium(Home);
