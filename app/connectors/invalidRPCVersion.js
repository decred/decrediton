import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  requiredWalletRPCVersion: sel.requiredWalletRPCVersion,
  walletRPCVersion: sel.walletRPCVersion
});

export default connect(mapStateToProps);
