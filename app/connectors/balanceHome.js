import { connect } from "react-redux";
import { selectorMap } from "fp";
import * as sel from "selectors";

const mapStateToProps = selectorMap({
  lockedTotalBalance: sel.lockedBalance,
  spendableTotalBalance: sel.spendableTotalBalance,
  spendableAndLockedBalance: sel.spendableAndLockedBalance,
});

export default connect(mapStateToProps);
