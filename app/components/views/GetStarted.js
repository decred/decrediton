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
import { GetStartedStyles } from './ViewStyles';

class Home extends Component{
  toggleNewExisting(side) {
    if (side == 'right') {
      this.props.createWalletExistingToggle(true);
    } else if (side == 'left') {
      this.props.createWalletExistingToggle(false);
    }
  }
  discoverAddressesButton() {
    if (this.state.privpass == '') {
      this.setState({privPassError: '*Please enter your private password'})
      return;
    } 
    if (this.state.privPassError !== null) {
      return;
    }
    this.props.discoverAddressAttempt(true, this.state.privpass);
    this.setState({privpass:''});
  }
  openWalletButton() {
    if (this.state.pubpass == '') {
      this.setState({pubPassError: '*Please enter your public password'})
      return;
    } 
    if (this.state.pubPassError !== null) {
      return;
    }
    this.props.openWalletAttempt(this.state.pubpass);
    this.setState({pubpass:''});
  }
  handleDisclaimerOK = () => {
    this.props.disclaimerOKAction();
  }
  updatePubPass(pubPass) {
    if (pubPass !== '') {
      this.setState({pubpass: pubPass, pubPassError: null})
    } else {
      this.setState({pubPassError: '*Please enter your public password'})
    }
  }
  updatePrivPass(privPass) {
    if (privPass !== '') {
      this.setState({privpass: privPass, privPassError: null})
    } else {
      this.setState({privPassError: '*Please enter your private password'})
    }
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
      <div style={GetStartedStyles.view}>
        <Header getStarted headerTitleOverview="Getting started" />
        <div style={GetStartedStyles.content}>
          <div style={GetStartedStyles.contentTitle}>
            <div style={GetStartedStyles.contentTitleText}>checking wallet state...</div>
          </div>
          <div style={GetStartedStyles.contentNest}>
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
      <div style={GetStartedStyles.view}>
        <Header getStarted
          headerTop={ walletOpenError !== null ?
              <div key="walletOpenError" style={GetStartedStyles.viewNotificationError}>{walletOpenError}</div> :
              <div key="walletOpenError" ></div>
          }
          headerTitleOverview="Opening Wallet"
          headerMetaOverview="Please enter the information below to  create your dcrwallet"
        />
        <div style={GetStartedStyles.contentNewSeed}>
          { walletOpenRequestAttempt ?
            <CircularProgress style={GetStartedStyles.loading} size={125} thickness={6}/> :
            <div style={GetStartedStyles.contentNewSeedCreateButton}>
              <div style={GetStartedStyles.contentConfirmWalletCreateInputLeftPadding}>Decrypt Wallet:</div>
              <div style={GetStartedStyles.contentConfirmWalletCreateInputRightPadding}>
                <div style={GetStartedStyles.inputForm}>
                  <form style={GetStartedStyles.inputForm}>
                    <input
                      style={GetStartedStyles.inputPrivatePassword}
                      type="password"
                      placeholder="Private Passphrase"
                      onBlur={(e)=>this.updatePubPass(e.target.value)}/>
                  </form>
                </div>
              </div>
              <div style={GetStartStyles.pubPassError}>
                {this.state.pubPassError}
              </div>
              <div style={GetStartedStyles.contentNewSeedCreateButton}>
                <div style={GetStartedStyles.contentConfirmWalletCreateInputLeftPadding}></div>
                <div style={GetStartedStyles.contentConfirmWalletCreateInputRightPadding}>
                  <KeyBlueButton style={GetStartedStyles.viewButtonKeyBlueWalletNewSeed} onClick={()=>this.openWalletButton()}>Open Wallet</KeyBlueButton>
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
      <div style={GetStartedStyles.view}>
        <Header
          getStarted
          headerTop={ walletCreateError !== null ?
            <div key="walletCreateError" style={GetStartedStyles.viewNotificationError}>{walletCreateError}</div> :
            <div key="walletCreateError" ></div>
          }
          headerTitleOverview={'Create a Wallet'}>
          {!this.props.confirmNewSeed ?
            <NewExistingSeedToggle
              activeButton={'left'}
              leftText={'New seed'}
              rightText={'Existing Seed'}
              toggleAction={(e)=>{this.toggleNewExisting(e);}}/> :
            <SlateGrayButton style={GetStartedStyles.viewButtonGoBack} onClick={()=>this.props.createWalletGoBackNewSeed()}>Back</SlateGrayButton>
          }
        </Header>
        {walletCreateRequestAttempt ?
        <div style={GetStartedStyles.contentNewSeed}>
          <CircularProgress style={GetStartedStyles.loading} size={125} thickness={6}/>
        </div>  :
          <CreateWalletForm existing={this.props.createWalletExisting}/>}
      </div>
      );
    } else if  (stepIndex == 3 || stepIndex == 4) {
      // Get startrpc and subscribe
      startupStepView = (
        <div style={GetStartedStyles.view}>
          <Header
            getStarted
            headerTop={ startRpcError !== null ?
              <div key="startRpcError" style={GetStartedStyles.viewNotificationError}>{startRpcError}</div> :
              <div key="startRpcError" ></div>
            }
            headerTitleOverview="Starting RPC and subscribing block notifications"/>
          <div style={GetStartedStyles.content}>
            <div style={GetStartedStyles.contentTitle}>
              <div style={GetStartedStyles.contentTitleText}>Start RPC, Subscribe Block</div>
            </div>
            <div style={GetStartedStyles.contentNest}>
              { startRpcRequestAttempt ?
                <CircularProgress style={GetStartedStyles.loading} size={125} thickness={6}/> :
                <div>Some unexpected error occured, please check logs</div>
              }
            </div>
          </div>
        </div>
      );
    } else if  (stepIndex == 5) {
      // Get private passphrase for discover address request
      startupStepView = (
        <div style={GetStartedStyles.view}>
          <Header getStarted
            headerTop={ discoverAddressError !== null ?
              <div key="pubError" style={GetStartedStyles.viewNotificationError}>{discoverAddressError}</div> :
              <div key="pubError" ></div>
            }
            headerTitleOverview="Opening Wallet"
            headerMetaOverview="Please enter the information below to load your dcrwallet"/>
          <div style={GetStartedStyles.contentNewSeed}>
            { discoverAddressRequestAttempt ?
            <CircularProgress style={GetStartedStyles.loading} size={125} thickness={6}/> :
              <div style={GetStartedStyles.contentNewSeedCreateButton}>
                <div style={GetStartedStyles.contentConfirmWalletCreateInputLeftPadding}>Scan for used addresses:</div>
                <div style={GetStartedStyles.contentConfirmWalletCreateInputRightPadding}>
                  <div style={GetStartedStyles.inputForm}>
                    <form style={GetStartedStyles.inputForm}>
                      <input
                        style={GetStartedStyles.inputPrivatePassword}
                        type="password"
                        placeholder="Private Passphrase"
                        onBlur={(e)=>this.updatePrivPass(e.target.value)}/>
                    </form>
                  </div>
                </div>
                <div style={GetStartStyles.privPassError}>
                  {this.state.privPassError}
                </div>
                <div style={GetStartedStyles.contentNewSeedCreateButton}>
                  <div style={GetStartedStyles.contentConfirmWalletCreateInputLeftPadding}></div>
                  <div style={GetStartedStyles.contentConfirmWalletCreateInputRightPadding}>
                    <KeyBlueButton style={GetStartedStyles.viewButtonKeyBlueWalletNewSeed} onClick={()=>this.discoverAddressesButton()}>Scan</KeyBlueButton>
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
        <div style={GetStartedStyles.view}>
          <Header
            getStarted
            headerTop={ fetchHeadersError !== null ?
              <div key="fetchHeadersError" style={GetStartedStyles.viewNotificationError}>{fetchHeadersError}</div> :
              <div key="fetchHeadersError" ></div>
            }
            headerTitleOverview="Fetching block headers"/>
          <div style={GetStartedStyles.contentNewSeed}>
            { fetchHeadersRequestAttempt ?
            <CircularProgress style={GetStartedStyles.loading} size={125} thickness={6}/> :
            <div></div>
            }
          </div>
        </div>
      );
    } else if  (stepIndex >= 7) {
      // Final Steps
      startupStepView = (
        <div style={GetStartedStyles.view}>
          <Header getStarted headerTitleOverview="Final start up" />
          <div style={GetStartedStyles.content}>
            <div style={GetStartedStyles.contentTitle}>
              <div style={GetStartedStyles.contentTitleText}>Last steps if needed</div>
            </div>
            <div style={GetStartedStyles.contentNest}>
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
          <div style={GetStartedStyles.body}>
            <SideBar gettingStarted={true}/>
            <div style={GetStartedStyles.view}>
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
