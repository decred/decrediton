// @flow
import React, { Component, PropTypes } from 'react';
import WalletOpenForm from '../containers/WalletOpenForm';
import CreateWalletForm from '../components/CreateWalletForm';
import DiscoverAddressForm from '../components/DiscoverAddressForm';
import CircularProgress from 'material-ui/CircularProgress';
import LinearProgress from 'material-ui/LinearProgress';
import Dialog from 'material-ui/Dialog';
import ShowError from './ShowError';
import Radium from 'radium';
import SideBar from './SideBar';

import {
  Step,
  Stepper,
  StepLabel,
  StepContent
} from 'material-ui/Stepper';
import FlatButton from 'material-ui/FlatButton';

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
  header: {
    paddingRight: '80px',
    paddingLeft: '100px',
    backgroundColor: '#fff',
  },
  content: {
    overflow: 'auto',
    height: '556px',
    padding: '54px 60px 54px 80px',
  },

  transition1: {
    transition: 'all 100ms cubic-bezier(.86, 0, .07, 1)',
  },
  headerTop: {
    height: '106px',
    paddingBottom: '20px',
  },
  headerTitleOverview: {
    height: '54px',
    paddingTop: '13px',
    color: '#596d81',
    fontSize: '27px',
  },
  headerMetaOverview: {
    height: '54px',
    paddingTop: '5px',
    fontFamily: 'Inconsolata, monospace',
    fontSize: '53px',
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
    const { fetchHeadersResponse, neededBlocks } = this.props;
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
          <h5>Please enter the information below to connect to your dcrwallet</h5>
          <WalletOpenForm/>
      </div>);
    }
    const getStartedWalletOpen = (openingWallet);


    var creatingWallet;
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
          <CreateWalletForm/>
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

    var ibdBlockProgress = 0.00;
    if (fetchHeadersResponse !== null) {
      ibdBlockProgress = (fetchHeadersResponse.getMainChainTipBlockHeight() / neededBlocks) * 100;
      ibdBlockProgress = ibdBlockProgress.toFixed(2);
    }
    var fetchingHeaders;
    if (fetchHeadersRequestAttempt) {
      fetchingHeaders = (
        <div>
          <LinearProgress mode="determinate"
            min={0}
            max={neededBlocks}
            value={fetchHeadersResponse !== null ? fetchHeadersResponse.getMainChainTipBlockHeight() : 0.0} />
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

    var startupStepView = (<div>something went wrong</div>);

    if (stepIndex <= 1) {
      // Initial Step
      startupStepView = (
      <div style={styles.view}>
        <div style={styles.header}>
          <div style={styles.headerTop}></div>
          <div style={styles.headerTitleOverview}>Getting started</div>
          <div style={styles.headerMetaOverview}>
            
          </div>
        </div>
        <div style={styles.content}>
          <div style={styles.contentTitle}>
            <div style={styles.contentTitleText}>checking wallet state...</div>
          </div>
          <div style={styles.contentNest}>
            {getStartedWalletLoader}
          </div>
        </div>
      </div>
      );
    } else if (stepIndex == 2 &&
            walletExistResponse !== null 
            && walletExistResponse.getExists()) {
      // Wallet has been shown to exist and public password != 'public'
       startupStepView = (
      <div style={styles.view}>
        <div style={styles.header}>
          <div style={styles.headerTop}></div>
          <div style={styles.headerTitleOverview}>Open wallet</div>
          <div style={styles.headerMetaOverview}>
          </div>
        </div>
        <div style={styles.content}>
          <div style={styles.contentTitle}>
            <div style={styles.contentTitleText}></div>
          </div>
          <div style={styles.contentNest}>
            {getStartedWalletOpen}
          </div>
        </div>
      </div>
      );
    } else if (stepIndex == 2) {
      // Wallet does not exist
     startupStepView = (
      <div style={styles.view}>
        <div style={styles.header}>
          <div style={styles.headerTop}></div>
          <div style={styles.headerTitleOverview}>Create a Wallet</div>
          <div style={styles.headerMetaOverview}>
          </div>
        </div>
        <div style={styles.content}>
          <div style={styles.contentTitle}>
            <div style={styles.contentTitleText}>Text stuff</div>
          </div>
          <div style={styles.contentNest}>
            {getStartedWalletCreate}
          </div>
        </div>
      </div>
      );
    } else if  (stepIndex == 3 || stepIndex == 4) {
      // Get startrpc and subscribe
      startupStepView = (
        <div style={styles.view}>
          <div style={styles.header}>
            <div style={styles.headerTop}></div>
            <div style={styles.headerTitleOverview}>Starting RPC and subscribing block notifications</div>
            <div style={styles.headerMetaOverview}>
            </div>
          </div>
          <div style={styles.content}>
            <div style={styles.contentTitle}>
              <div style={styles.contentTitleText}>Start RPC, Subscribe Block</div>
            </div>
            <div style={styles.contentNest}>
              {startRpc}
            </div>
          </div>
        </div>
      );  
    } else if  (stepIndex == 5) {
      // Get private passphrase for discover address request
      startupStepView = (
        <div style={styles.view}>
          <div style={styles.header}>
            <div style={styles.headerTop}></div>
            <div style={styles.headerTitleOverview}>Private passphrase</div>
            <div style={styles.headerMetaOverview}>
            </div>
          </div>
          <div style={styles.content}>
            <div style={styles.contentTitle}>
              <div style={styles.contentTitleText}>For discover addresses</div>
            </div>
            <div style={styles.contentNest}>
              {getStartedDiscoverAddress}
            </div>
          </div>
        </div>
      );
    } else if  (stepIndex == 6) {
      // Fetch headers
      startupStepView = (
        <div style={styles.view}>
          <div style={styles.header}>
            <div style={styles.headerTop}></div>
            <div style={styles.headerTitleOverview}>Fetch headers</div>
            <div style={styles.headerMetaOverview}>
            </div>
          </div>
          <div style={styles.content}>
            <div style={styles.contentTitle}>
              <div style={styles.contentTitleText}>Catching up block chain</div>
            </div>
            <div style={styles.contentNest}>
              {fetchHeaders}
            </div>
          </div>
        </div>
      );
    } else if  (stepIndex >= 7) {
      // Final Steps
      startupStepView = (
        <div style={styles.view}>
          <div style={styles.header}>
            <div style={styles.headerTop}></div>
            <div style={styles.headerTitleOverview}>Final start up</div>
            <div style={styles.headerMetaOverview}>
            </div>
          </div>
          <div style={styles.content}>
            <div style={styles.contentTitle}>
              <div style={styles.contentTitleText}>Last steps if needed</div>
            </div>
            <div style={styles.contentNest}>
            </div>
          </div>
        </div>
      );
    
                <Step>
                  <StepLabel>Start RPC Concensus</StepLabel>
                  <StepContent>
                    {startRpc}
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>Subscribe to Block Notifications</StepLabel>
                  <StepContent>
                    {}
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>Discover Addresses</StepLabel>
                  <StepContent>
                    
                  </StepContent>
                </Step>
                <Step>

              </Stepper>
            </div>
          </div>
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
            <SideBar gettingStarted={true}/>
            {stepper}
          </div>);
      } else {
        return (<ShowError error={versionInvalidError}/>);
      }
    }

  }
}

export default Radium(Home);
