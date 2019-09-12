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
});

const mapDispatchToProps = dispatch => bindActionCreators({
  prepStartDaemon: da.prepStartDaemon,
  onRetryStartRPC: wla.startRpcRequestFunc,
  onStartDaemon: da.startDaemon,
  onConnectDaemon: da.connectDaemon,
  checkNetworkMatch: da.checkNetworkMatch,
  syncDaemon: da.syncDaemon,
  onGetAvailableWallets: da.getAvailableWallets,
  onStartWallet: da.startWallet,
  onRemoveWallet: da.removeWallet,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
