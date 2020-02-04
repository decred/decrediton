import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectorMap } from "fp";
import * as sel from "selectors";
import * as wla from "actions/WalletLoaderActions";
import * as da from "actions/DaemonActions";
import * as ca from "actions/ClientActions";
import * as trza from "actions/TrezorActions";

const mapStateToProps = selectorMap({
  isAdvancedDaemon: sel.isAdvancedDaemon,
  availableWallets: sel.sortedAvailableWallets,
  getDaemonSynced: sel.getDaemonSynced,
  getCurrentBlockCount: sel.getCurrentBlockCount,
  getNeededBlocks: sel.getNeededBlocks,
  getDaemonStarted: sel.getDaemonStarted,
  getEstimatedTimeLeft: sel.getEstimatedTimeLeft,

  maxWalletCount: sel.maxWalletCount,
  peerCount: sel.peerCount,
  synced: sel.synced,
  syncFetchMissingCfiltersAttempt: sel.syncFetchMissingCfiltersAttempt,
  syncFetchMissingCfiltersStart: sel.syncFetchMissingCfiltersStart,
  syncFetchMissingCfiltersEnd: sel.syncFetchMissingCfiltersEnd,
  syncFetchHeadersAttempt: sel.syncFetchHeadersAttempt,
  syncFetchHeadersCount: sel.syncFetchHeadersCount,
  syncFetchHeadersLastHeaderTime: sel.syncFetchHeadersLastHeaderTime,
  syncDiscoverAddressesAttempt: sel.syncDiscoverAddressesAttempt,
  syncRescanAttempt: sel.syncRescanAttempt,
  syncRescanProgress: sel.syncRescanProgress,
  syncFetchHeadersComplete: sel.syncFetchHeadersComplete,
  syncFetchTimeStart: sel.syncFetchTimeStart,
  firstBlockTime: sel.firstBlockTime,
  selectedWalletSelector: sel.getSelectedWallet
});

const mapDispatchToProps = dispatch => bindActionCreators({
  decreditonInit: da.decreditonInit,
  onRetryStartRPC: wla.startRpcRequestFunc,
  setSelectedWallet: wla.setSelectedWallet,
  getSelectedWallet: wla.getSelectedWallet,
  onStartDaemon: da.startDaemon,
  onConnectDaemon: da.connectDaemon,
  checkNetworkMatch: da.checkNetworkMatch,
  syncDaemon: da.syncDaemon,
  onGetAvailableWallets: da.getAvailableWallets,
  onStartWallet: da.startWallet,
  onRemoveWallet: da.removeWallet,
  goToError: ca.goToError,
  onCreateWallet: da.createWallet,
  getDcrwalletLogs: da.getDcrwalletLogs,
  trezorLoadDeviceList: trza.loadDeviceList,
  trezorEnable: trza.enableTrezor,
  trezorDisable: trza.disableTrezor,
  trezorAlertNoConnectedDevice: trza.alertNoConnectedDevice,
  trezorGetWalletCreationMasterPubKey: trza.getWalletCreationMasterPubKey  
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
