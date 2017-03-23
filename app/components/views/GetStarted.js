// @flow
import React, { Component, PropTypes } from 'react';
import CreateWalletForm from '../CreateWalletForm';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import ShowError from '../ShowError';
import Radium from 'radium';
import SideBar from '../SideBar';
import NewExistingSeedToggle from '../NewExistingSeedToggle';
import Header from '../Header';
import KeyBlueButton from '../KeyBlueButton';
import SlateGrayButton from '../SlateGrayButton';

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
  },
  viewButtonKeyBlueWalletNewSeed: {
    float: 'left',
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
  },
  viewNotificationError: {
    display: 'inline-block',
    marginRight: 'auto',
    marginLeft: 'auto',
    padding: '7px 20px',
    borderRadius: '5px',
    backgroundColor: '#fd714b',
    boxShadow: '0 3px 10px 0 rgba(0, 0, 0, .2)',
    color: '#fff',
    fontSize: '13px',
    textAlign: 'center',
  },
  viewNotificationSuccess: {
    display: 'inline-block',
    marginRight: 'auto',
    marginLeft: 'auto',
    padding: '7px 20px',
    borderRadius: '5px',
    backgroundColor: '#41bf53',
    boxShadow: '0 3px 10px 0 rgba(0, 0, 0, .2)',
    color: '#fff',
    fontSize: '13px',
    textAlign: 'center',
    textDecoration: 'none',
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
    const { fetchHeadersRequestAttempt, fetchHeadersError } = this.props;

    const getStartedWalletLoader = (
      <div>
        <ShowError error={getLoaderError} />
        <ShowError error={getVersionServiceError}/>
      </div>);

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
          headerTop={ walletOpenError !== null ?
              <div key="walletOpenError" style={styles.viewNotificationError}>{walletOpenError}</div> :
              <div key="walletOpenError" ></div>
          }
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
                  <KeyBlueButton style={styles.viewButtonKeyBlueWalletNewSeed} onClick={()=>this.openWalletButton()}>Open Wallet</KeyBlueButton>
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
        <Header
          getStarted
          headerTop={ walletCreateError !== null ?
            <div key="walletCreateError" style={styles.viewNotificationError}>{walletCreateError}</div> :
            <div key="walletCreateError" ></div>
          }
          headerTitleOverview={'Create a Wallet'}>
          {!this.props.confirmNewSeed ?
            <NewExistingSeedToggle
              activeButton={'left'}
              leftText={'New seed'}
              rightText={'Existing Seed'}
              toggleAction={(e)=>{this.toggleNewExisting(e);}}/> :
            <SlateGrayButton style={styles.viewButtonGoBack} onClick={()=>this.props.createWalletGoBackNewSeed()}>Back</SlateGrayButton>
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
          <Header
            getStarted
            headerTop={ startRpcError !== null ?
              <div key="startRpcError" style={styles.viewNotificationError}>{startRpcError}</div> :
              <div key="startRpcError" ></div>
            }
            headerTitleOverview="Starting RPC and subscribing block notifications"/>
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
            headerTop={ discoverAddressError !== null ?
              <div key="pubError" style={styles.viewNotificationError}>{discoverAddressError}</div> :
              <div key="pubError" ></div>
            }
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
                    <KeyBlueButton style={styles.viewButtonKeyBlueWalletNewSeed} onClick={()=>this.discoverAddressesButton()}>Scan</KeyBlueButton>
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
          <Header
            getStarted
            headerTop={ fetchHeadersError !== null ?
              <div key="fetchHeadersError" style={styles.viewNotificationError}>{fetchHeadersError}</div> :
              <div key="fetchHeadersError" ></div>
            }
            headerTitleOverview="Fetching block headers"/>
          <div style={styles.contentNewSeed}>
            { fetchHeadersRequestAttempt ?
            <CircularProgress style={styles.loading} size={125} thickness={6}/> :
            <div></div>
            }
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
      <KeyBlueButton
        onClick={() => this.handleDisclaimerOK()}
      >
        OK, I Understand
      </KeyBlueButton>
      ,
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
