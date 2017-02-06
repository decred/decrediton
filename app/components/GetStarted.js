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
import NewExistingSeedToggle from './NewExistingSeedToggle';
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
    backgroundColor: '#0c1e3e',
  },
  header: {
    paddingRight: '80px',
    paddingLeft: '100px',
    backgroundColor: '#596d81',
    height: '214px',
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
  },
  headerTitleOverview: {
    height: '41px',
    color: '#fff',
    fontSize: '27px',
  },
  headerMetaOverview: {
    float: 'left',
    clear: 'left',
    height: '54px',
    width: '50%',
    fontSize: '13px',
    color: '#c4cbd2',
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
  toggleNewExisting(side) {
    if (side == 'right') {
      this.props.createWalletExistingToggle(true);
    } else if (side == 'left') {
      this.props.createWalletExistingToggle(false);
    }
  }
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

    var ibdBlockProgress = 0.00;
    if (fetchHeadersResponse !== null) {
      ibdBlockProgress = (fetchHeadersResponse.getMainChainTipBlockHeight() / neededBlocks) * 100;
      ibdBlockProgress = ibdBlockProgress.toFixed(2);
    }

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
          <div style={styles.headerTitleOverview}>Opening Wallet</div>
          <div style={styles.headerMetaOverview}>
            Please enter the information below to  create your dcrwallet
          </div>
        </div>
        <div style={styles.content}>
          <div style={styles.contentTitle}>
            <div style={styles.contentTitleText}></div>
          </div>
          <div style={styles.contentNest}>
            { walletOpenRequestAttempt ? 
              <CircularProgress size={80} thickness={6}/> :
              <WalletOpenForm />
            }
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
          <div style={styles.headerMetaOverview}></div>
          <NewExistingSeedToggle 
            activeButton={"left"} 
            leftText={"New seed"}
            rightText={"Existing Seed"}
            toggleAction={(e)=>{this.toggleNewExisting(e)}}/>
        </div>
        {walletCreateRequestAttempt ? 
          <CircularProgress size={80} thickness={6}/> :
          <CreateWalletForm existing={this.props.createWalletExistingd}/>}
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
              { startRpcRequestAttempt ? 
                <CircularProgress size={80} thickness={6}/> :
                <div>Some unexpected error occured, please check logs</div>
              }
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
            <div style={styles.headerTitleOverview}>Opening Wallet</div>
            <div style={styles.headerMetaOverview}>
              Please enter the information below to  create your dcrwallet
            </div>
          </div>
          <div style={styles.content}>
            <div style={styles.contentTitle}>
              <div style={styles.contentTitleText}>For discover addresses</div>
            </div>
            <div style={styles.contentNest}>
              { discoverAddressRequestAttempt ? 
                <CircularProgress size={80} thickness={6}/> : 
                <DiscoverAddressForm />
              }
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
              { fetchHeadersRequestAttempt ? 
                <div>
                  <LinearProgress mode="determinate"
                    min={0}
                    max={neededBlocks}
                    value={fetchHeadersResponse !== null ? fetchHeadersResponse.getMainChainTipBlockHeight() : 0.0} />
                  <p>{ibdBlockProgress}%</p>
                </div> :
                <div></div>
              }
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
    }
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
            <div style={styles.view}>
              {startupStepView}
            </div>
          </div>);
      } else {
        return (<ShowError error={versionInvalidError}/>);
      }
    }

  }
}

export default Radium(Home);
