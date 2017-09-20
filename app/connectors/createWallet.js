import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as wla from "../actions/WalletLoaderActions";
import { getSeedService } from "../wallet/seed";

const mapStateToProps = selectorMap({
  seedService: getSeedService,
  createWalletExisting: sel.createWalletExisting,
  confirmNewSeed: sel.confirmNewSeed,
  network: sel.network
});

const mapDispatchToProps = dispatch => bindActionCreators({
  createWalletConfirmNewSeed: wla.createWalletConfirmNewSeed,
  createWalletGoBackNewSeed: wla.createWalletGoBackNewSeed,
  createWalletRequest: wla.createWalletRequest
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
