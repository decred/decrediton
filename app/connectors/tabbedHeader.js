import { connect } from "react-redux";
import * as sel from "../selectors";
import { selectorMap } from "../fp";

const mapStateToProps = selectorMap({
  isTestNet: sel.isTestNet,
  totalBalance: sel.totalBalance,
});

export default connect(mapStateToProps);
