import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  daemonError: sel.daemonError,
  walletError: sel.walletError,
});

export default connect(mapStateToProps);
