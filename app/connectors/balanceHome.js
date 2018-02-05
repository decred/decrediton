import { connect } from "react-redux";
import { selectorMap } from "fp";
import * as sel from "selectors";

const mapStateToProps = selectorMap({
  totalBalance: sel.totalBalance,
  lockedTotalBalance: sel.lockedBalance,
  spendableAndLockedBalance: sel.spendableAndLockedBalance,
});

export default connect(mapStateToProps);
