import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "fp";
import * as sel from "selectors";
import * as wla from "actions/WalletLoaderActions";
import * as ca from "actions/ClientActions";
import { getSeedService } from "wallet/seed";

const mapStateToProps = selectorMap({
  seedService: getSeedService,
  createWalletExisting: sel.createWalletExisting,
  isCreatingWallet: sel.isCreatingWallet,
  confirmNewSeed: sel.confirmNewSeed,
  isTestNet: sel.isTestNet
});

const mapDispatchToProps = dispatch => bindActionCreators({
  createWalletConfirmNewSeed: wla.createWalletConfirmNewSeed,
  createWalletGoBackNewSeed: wla.createWalletGoBackNewSeed,
  createWalletRequest: wla.createWalletRequest,
  copySeedToClipboard: ca.copySeedToClipboard,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
