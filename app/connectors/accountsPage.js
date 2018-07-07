import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  walletService: sel.walletService,
  isCreateAccountDisabled: sel.isCreateAccountDisabled,
});

export default connect(mapStateToProps);
