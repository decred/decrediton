import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as wla from "../actions/WalletLoaderActions";
import * as da from "../actions/DaemonActions";

const mapStateToProps = selectorMap({
  startStepIndex: sel.startStepIndex,
  isInputRequest: sel.isInputRequest,
  startupError: sel.startupError,
  confirmNewSeed: sel.confirmNewSeed,
  hasExistingWallet: sel.hasExistingWallet,
  isProcessing: sel.isStartupProcessing,
  getDaemonStarted: sel.getDaemonStarted,
  getDaemonSynced: sel.getDaemonSynced,
  getCurrentBlockCount: sel.getCurrentBlockCount,
  getNeededBlocks: sel.getNeededBlocks,
  getWalletReady: sel.getWalletReady,
  getEstimatedTimeLeft: sel.getEstimatedTimeLeft,
  isPrepared: sel.isPrepared,
  isTestNet: sel.isTestNet,
  network: sel.network,
  isAdvancedDaemon: sel.isAdvancedDaemon,
  openForm: sel.openForm,
  remoteAppdataError: sel.getRemoteAppdataError,
  rescanEndBlock: sel.rescanEndBlock,
  rescanStartBlock: sel.rescanStartBlock,
  rescanCurrentBlock: sel.rescanCurrentBlock,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onReturnToNewSeed: wla.createWalletGoBackNewSeed,
  onSetCreateWalletFromExisting: wla.createWalletExistingToggle,
  onDiscoverAddresses: wla.discoverAddressAttempt,
  onOpenWallet: wla.openWalletAttempt,
  onRetryStartRPC: wla.startRpcRequestFunc,
  doVersionCheck: wla.versionCheckAction,
  onStartDaemon: da.startDaemon,
  determineNeededBlocks: wla.determineNeededBlocks,
  setCredentialsAppdataError: da.setCredentialsAppdataError
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
