import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectorMap, substruct } from "../fp";
import * as selectors from "../selectors";
import * as walletLoaderActions from "../actions/WalletLoaderActions";
import * as daemonActions from "../actions/DaemonActions";

const mapStateToProps = selectorMap({
  ...substruct({
    startStepIndex: null,
    isInputRequest: null,
    startupError: null,
    confirmNewSeed: null,
    hasExistingWallet: null,
    isStartupProcessing: "isProcessing",
    getDaemonStarted: null,
    getDaemonSynced: null,
    getCurrentBlockCount: null,
    getNeededBlocks: null,
    getWalletReady: null,
    getEstimatedTimeLeft: null,
    isPrepared: null
  }, selectors)
});

const mapDispatchToProps = dispatch => bindActionCreators({
  ...substruct({
    createWalletGoBackNewSeed: "onReturnToNewSeed",
    createWalletExistingToggle: "onSetCreateWalletFromExisting",
    discoverAddressAttempt: "onDiscoverAddresses",
    openWalletAttempt: "onOpenWallet",
    startRpcRequestFunc: "onRetryStartRPC",
    versionCheckAction: "doVersionCheck"
  }, walletLoaderActions),
  ...substruct({
    startDaemon: "doStartDaemon",
    skipDaemonSync: "doSkipDaemonSync"
  }, daemonActions)
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
