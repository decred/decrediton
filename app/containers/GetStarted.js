// @flow
import React, { Component } from "react";
import { autobind } from "core-decorators";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectorMap } from "../fp";
import {
  startStepIndex,
  isStartupProcessing as isProcessing,
  getVersionServiceError,
  versionInvalidError,
  getLoaderError,
  startupError,
  confirmNewSeed,
  hasExistingWallet,
} from "../selectors";
import {
  createWalletGoBackNewSeed as onReturnToNewSeed,
  createWalletExistingToggle as onSetCreateWalletFromExisting,
  discoverAddressAttempt as onDiscoverAddresses,
  openWalletAttempt as onOpenWallet,
  startRpcRequestFunc as onRetryStartRPC,
  versionCheckAction as doVersionCheck
} from "../actions/WalletLoaderActions";
import GetStartedPage from "../components/views/GetStartedPage";

@autobind
class GetStarted extends Component {
  componentDidMount() {
    this.props.doVersionCheck();
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
  getVersionServiceError,
  versionInvalidError,
  getLoaderError,
  startupError,
  confirmNewSeed,
  hasExistingWallet,
  isProcessing
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onReturnToNewSeed,
  onSetCreateWalletFromExisting,
  onDiscoverAddresses,
  onOpenWallet,
  onRetryStartRPC,
  doVersionCheck
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GetStarted);
