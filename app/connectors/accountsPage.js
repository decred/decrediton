import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  walletService: sel.walletService
});

export default connect(mapStateToProps);
