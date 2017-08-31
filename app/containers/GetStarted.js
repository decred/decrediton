// @flow
import React, { Component } from "react";
import { autobind } from "core-decorators";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectorMap } from "../fp";
import {
  startStepIndex,
  isInputRequest,
  isStartupProcessing as isProcessing,
  startupError,
  confirmNewSeed,
  hasExistingWallet,
  daemonStarted,
  daemonSyncing,
  daemonSynced,
  walletReady,
} from "../selectors";
import {
  createWalletGoBackNewSeed as onReturnToNewSeed,
  createWalletExistingToggle as onSetCreateWalletFromExisting,
  discoverAddressAttempt as onDiscoverAddresses,
  openWalletAttempt as onOpenWallet,
  startRpcRequestFunc as onRetryStartRPC,
  versionCheckAction as doVersionCheck
} from "../actions/WalletLoaderActions";
import {
  startDaemon as doStartDaemon,
  checkDaemon as doCheckDaemon,
  startWallet as doStartWallet,
} from "../actions/DaemonActions";
import GetStartedPage from "../components/views/GetStartedPage";

@autobind
class GetStarted extends Component {
  componentDidMount() {
    this.props.doStartDaemon("USER", "PASSWORD");
  }

  render() {
    const { onDiscoverAddresses } = this;
    return <GetStartedPage {...{...this.props, onDiscoverAddresses}} />;
  }

  onDiscoverAddresses(privatePassPhrase) {
    this.props.onDiscoverAddresses(true, privatePassPhrase);
  }
}

const mapStateToProps = selectorMap({
  startStepIndex,
  isInputRequest,
  startupError,
  confirmNewSeed,
  hasExistingWallet,
  isProcessing,
  daemonStarted,
  daemonSyncing,
  daemonSynced,
  walletReady,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onReturnToNewSeed,
  onSetCreateWalletFromExisting,
  onDiscoverAddresses,
  onOpenWallet,
  onRetryStartRPC,
  doVersionCheck,
  doStartDaemon,
  doCheckDaemon,
  doStartWallet,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GetStarted);
