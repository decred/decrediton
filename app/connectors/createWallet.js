import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "fp";
import * as sel from "selectors";
import * as wla from "actions/WalletLoaderActions";
import * as ca from "actions/ClientActions";

const mapStateToProps = selectorMap({
  createWalletExisting: sel.createWalletExisting,
  isCreatingWallet: sel.isCreatingWallet,
  confirmNewSeed: sel.confirmNewSeed,
  createNewWallet: sel.createNewWallet,
  isTestNet: sel.isTestNet,
  isWatchOnly: sel.isWatchOnly,
  masterPubKey: sel.masterPubKey,
  maxWalletCount: sel.maxWalletCount,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  createWalletConfirmNewSeed: wla.createWalletConfirmNewSeed,
  createWalletGoBackNewSeed: wla.createWalletGoBackNewSeed,
  createWalletRequest: wla.createWalletRequest,
  copySeedToClipboard: ca.copySeedToClipboard,
  createWatchOnlyWalletRequest: wla.createWatchOnlyWalletRequest,
  generateSeed: wla.generateSeed,
  decodeSeed: wla.decodeSeed,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
