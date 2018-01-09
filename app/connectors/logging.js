// @flow
import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  getCredentials: sel.getCredentials,
  walletReady: sel.getWalletReady,
});

export default connect(mapStateToProps);
