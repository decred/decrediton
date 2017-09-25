import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  spendingAccounts: sel.spendingAccounts,
  visibleAccounts: sel.visibleAccounts,
  defaultSpendingAccount: sel.defaultSpendingAccount
});

export default connect(mapStateToProps);
