import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  isTestNet: sel.isTestNet,
  newUnminedMessage: sel.newUnminedMessage,
  spendableTotalBalance: sel.spendableTotalBalance,
});

export default connect(mapStateToProps);
