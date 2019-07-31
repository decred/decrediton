import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as wla from "../actions/WalletLoaderActions";
import * as da from "../actions/DaemonActions";

const mapStateToProps = selectorMap({
  isAdvancedDaemon: sel.isAdvancedDaemon,
  availableWallets: sel.sortedAvailableWallets,
  getDaemonSynced: sel.getDaemonSynced,
  getCurrentBlockCount: sel.getCurrentBlockCount,
  getNeededBlocks: sel.getNeededBlocks,

  openForm: sel.openForm,

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
});

const mapDispatchToProps = dispatch => bindActionCreators({
  prepStartDaemon: da.prepStartDaemon,
  onRetryStartRPC: wla.startRpcRequestFunc,
  setSelectedWallet: wla.setSelectedWallet,
  getSelectedWallet: wla.getSelectedWallet,
  onStartDaemon: da.startDaemon,
  onConnectDaemon: da.connectDaemon,
  checkNetworkMatch: da.checkNetworkMatch,
  syncDaemon: da.syncDaemon,
  onGetAvailableWallets: da.getAvailableWallets,
  onStartWallet: da.startWallet,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
