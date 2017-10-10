import { connect } from "react-redux";
import * as sel from "../selectors";
import { selectorMap } from "../fp";

const mapStateToProps = selectorMap({
  walletService: sel.walletService,
});

export default connect(mapStateToProps);
