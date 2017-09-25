import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  getTransactionsRequestAttempt: sel.getTransactionsRequestAttempt,
  spendableTotalBalance: sel.spendableTotalBalance,
  synced: sel.synced,
  transactions: sel.homeHistoryTransactions
});

export default connect(mapStateToProps);
