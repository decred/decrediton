// @flow
import React, { Component, PropTypes } from 'react';
import CreateWalletForm from '../CreateWalletForm';
import CircularProgress from 'material-ui/CircularProgress';
import LinearProgress from 'material-ui/LinearProgress';
import Dialog from 'material-ui/Dialog';
import ShowError from '../ShowError';
import Radium from 'radium';
import SideBar from '../SideBar';
import NewExistingSeedToggle from '../NewExistingSeedToggle';
import FlatButton from 'material-ui/FlatButton';
import Header from '../Header';

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
  viewButtonGoBack: {
    marginRight: '80px',
    marginBottom: '20px',
    display: 'inline-block',
    padding: '17px 18px 18px',
    float: 'right',
    borderRadius: '5px',
    backgroundColor: '#8997A5',
    boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.2)',
    color: '#FFF',
    fontSize: '13px',
    lineHeight: '9px',
    fontWeight: '600',
    textAlign: 'center',
    textDecoration: 'none',
    textTransform: 'capitalize',
    ':hover': {
      backgroundColor: '#596d81',
    },
    ':active': {
      boxShadow: '0 0 0 0 rgba(0, 0, 0, .22)',
    }
  },
  viewButtonKeyBlueWalletNewSeed: {
    float: 'left',
    display: 'inline-block',
    padding: '17px 18px 18px',
    borderRadius: '5px',
    backgroundColor: '#2971FF',
    boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.2)',
    transitionProperty: 'none',
    color: '#FFF',
    fontSize: '13px',
    lineHeight: '9px',
    fontWeight: '600',
    textAlign: 'center',
    textDecoration: 'none',
    textTransform: 'capitalize',
    ':hover': {
      backgroundColor: '#1b58ff',
    },
    ':active': {
      boxShadow: '0 0 0 0 rgba(0, 0, 0, .2)',
    }
  },
  contentNewSeed: {
    overflow: 'auto',
    height: '556px',
    padding: '54px 80px 54px 80px',
  },
  contentNewSeedPrivPass: {
    paddingTop: '10px',
    height: '80px',
  },
  contentConfirmWalletCreateInputLeft: {
    width: '187px',
    marginRight: '20px',
    float: 'left',
    color: '#E7EAED',
    fontSize: '19px',
    textAlign: 'right',
    letterSpacing: '-0.1px',
  },
  contentConfirmWalletCreateInputLeftPadding: {
    width: '187px',
    marginRight: '20px',
    float: 'left',
    color: '#E7EAED',
    fontSize: '19px',
    textAlign: 'right',
    letterSpacing: '-0.1px',
    paddingTop: '23px',
  },
  contentConfirmWalletCreateInputRight: {
    width: '540px',
    float: 'left',
    clear: 'right',
  },
  contentConfirmWalletCreateInputRightPadding: {
    marginBottom: '5px',
    width: '300px',
    paddingTop: '11px',
    float: 'left',
    clear: 'right',
  },
  inputPrivatePassword: {
    backgroundColor: 'transparent',
    width: '100%',
    minHeight: '44px',
    paddingRight: '10px',
    paddingLeft: '10px',
    borderStyle: 'none none solid',
    borderBottom: '1px solid #69D5F7',
    color: '#69D5F7',
    fontSize: '19px',
    lineHeight: 'normal',
    margin: '0px',
    boxSizing: 'border-box',
  },
  inputForm: {
    MozAppearance: 'none !important',
    position: 'relative',
    width: '100%',
    height: 'auto',
    minHeight: '44px',
  },
  inputFormError: {
    color: 'red',
  },
  contentNewSeedCreateButton: {
    height: '80px',
    float: 'left',
  },
  loading: {
    marginTop: '110px',
    marginLeft: '268px',
  },
  linearLoading: {
    backgroundColor: 'white',
  }
};

class Home extends Component{
  toggleNewExisting(side) {
    if (side == 'right') {
      this.props.createWalletExistingToggle(true);
    } else if (side == 'left') {
      this.props.createWalletExistingToggle(false);
    }
  }
  discoverAddressesButton() {
    if (this.state.privpass == '' ) {
      return;
    }
    this.props.discoverAddressAttempt(true, this.state.privpass);
    this.setState({privpass:''});
  }
  openWalletButton() {
    if (this.state.pubpass == '') {
      return;
    }
    this.props.openWalletAttempt(this.state.pubpass);
    this.setState({pubpass:''});
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
    const { walletCreateRequestAttempt } = this.props;
    const { walletOpenRequestAttempt } = this.props;
    const { walletExistResponse } = this.props;
    const { startRpcRequestAttempt } = this.props;
    const { discoverAddressRequestAttempt } = this.props;
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
        <Header getStarted headerTitleOverview="Getting started" />
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
        <Header getStarted
          headerTitleOverview="Opening Wallet"
          headerMetaOverview="Please enter the information below to  create your dcrwallet"
        />
        <div style={styles.contentNewSeed}>
          { walletOpenRequestAttempt ?
            <CircularProgress style={styles.loading} size={125} thickness={6}/> :
            <div style={styles.contentNewSeedCreateButton}>
              <div style={styles.contentConfirmWalletCreateInputLeftPadding}>Decrypt Wallet:</div>
              <div style={styles.contentConfirmWalletCreateInputRightPadding}>
                <div style={styles.inputForm}>
                  <form style={styles.inputForm}>
                    <input
                      style={styles.inputPrivatePassword}
                      type="password"
                      placeholder="Private Passphrase"
                      onBlur={(e)=>this.setState({pubpass:e.target.value})}/>
                  </form>
                </div>
              </div>
              <div style={styles.contentNewSeedCreateButton}>
                <div style={styles.contentConfirmWalletCreateInputLeftPadding}></div>
                <div style={styles.contentConfirmWalletCreateInputRightPadding}>
                  <a style={styles.viewButtonKeyBlueWalletNewSeed} onClick={()=>this.openWalletButton()}>Open Wallet</a>
                </div>
              </div>
            </div>
            }
          </div>
        </div>
      );
    } else if (stepIndex == 2) {
      // Wallet does not exist
      startupStepView = (
      <div style={styles.view}>
        <Header getStarted headerTitleOverview={'Create a Wallet'}>
          {!this.props.confirmNewSeed ?
            <NewExistingSeedToggle
              activeButton={'left'}
              leftText={'New seed'}
              rightText={'Existing Seed'}
              toggleAction={(e)=>{this.toggleNewExisting(e);}}/> :
            <div style={styles.viewButtonGoBack} onClick={()=>this.props.createWalletGoBackNewSeed()}>Back</div>
          }
        </Header>
        {walletCreateRequestAttempt ?
        <div style={styles.contentNewSeed}>
          <CircularProgress style={styles.loading} size={125} thickness={6}/>
        </div>  :
          <CreateWalletForm existing={this.props.createWalletExisting}/>}
      </div>
      );
    } else if  (stepIndex == 3 || stepIndex == 4) {
      // Get startrpc and subscribe
      startupStepView = (
        <div style={styles.view}>
          <Header getStarted headerTitleOverview="Starting RPC and subscribing block notifications"/>
          <div style={styles.content}>
            <div style={styles.contentTitle}>
              <div style={styles.contentTitleText}>Start RPC, Subscribe Block</div>
            </div>
            <div style={styles.contentNest}>
              { startRpcRequestAttempt ?
                <CircularProgress style={styles.loading} size={125} thickness={6}/> :
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
          <Header getStarted
            headerTitleOverview="Opening Wallet"
            headerMetaOverview="Please enter the information below to load your dcrwallet"/>
          <div style={styles.contentNewSeed}>
            { discoverAddressRequestAttempt ?
            <CircularProgress style={styles.loading} size={125} thickness={6}/> :
              <div style={styles.contentNewSeedCreateButton}>
                <div style={styles.contentConfirmWalletCreateInputLeftPadding}>Scan for used addresses:</div>
                <div style={styles.contentConfirmWalletCreateInputRightPadding}>
                  <div style={styles.inputForm}>
                    <form style={styles.inputForm}>
                      <input
                        style={styles.inputPrivatePassword}
                        type="password"
                        placeholder="Private Passphrase"
                        onBlur={(e)=>this.setState({privpass:e.target.value})}/>
                    </form>
                  </div>
                </div>
                <div style={styles.contentNewSeedCreateButton}>
                  <div style={styles.contentConfirmWalletCreateInputLeftPadding}></div>
                  <div style={styles.contentConfirmWalletCreateInputRightPadding}>
                    <a style={styles.viewButtonKeyBlueWalletNewSeed} onClick={()=>this.discoverAddressesButton()}>Scan</a>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      );
    } else if  (stepIndex == 6) {
      // Fetch headers
      startupStepView = (
        <div style={styles.view}>
          <Header getStarted headerTitleOverview="Catching up block chain"/>
          <div style={styles.contentNewSeed}>
            <div style={styles.contentNest}>
              { fetchHeadersRequestAttempt ?
                <div>
                  <LinearProgress mode="determinate"
                    style={styles.linearLoading}
                    min={0}
                    max={neededBlocks}
                    value={fetchHeadersResponse !== null ? fetchHeadersResponse.getMainChainTipBlockHeight() : 0.0} />
                  <p style={{color:'white'}}>{ibdBlockProgress}%</p>
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
          <Header getStarted headerTitleOverview="Final start up" />
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
            Decrediton is currently under heavy development and in an alpha-state.  While we have tested
            the code thoroughly, we suggest using caution on Mainnet.  Use at your own risk!
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

/*
                  <LinearProgress mode="determinate"
                    min={0}
                    max={neededBlocks}
                    value={fetchHeadersResponse !== null ? fetchHeadersResponse.getMainChainTipBlockHeight() : 0.0} />
                    */
