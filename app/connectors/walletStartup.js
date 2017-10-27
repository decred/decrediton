import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as wla from "../actions/WalletLoaderActions";
import * as da from "../actions/DaemonActions";
import { showSidebarMenu, showSidebar, hideSidebarMenu } from "../actions/SidebarActions";

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
  network: sel.network,
  versionInvalid: sel.versionInvalid
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onReturnToNewSeed: wla.createWalletGoBackNewSeed,
  onSetCreateWalletFromExisting: wla.createWalletExistingToggle,
  onDiscoverAddresses: wla.discoverAddressAttempt,
  onOpenWallet: wla.openWalletAttempt,
  onRetryStartRPC: wla.startRpcRequestFunc,
  doVersionCheck: wla.versionCheckAction,
  doStartDaemon: da.startDaemon,
  determineNeededBlocks: wla.determineNeededBlocks,
  showSidebarMenu,
  showSidebar,
  hideSidebarMenu,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
