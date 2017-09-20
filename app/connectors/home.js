import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  getTransactionsRequestAttempt: sel.getTransactionsRequestAttempt,
  getAccountsResponse: sel.getAccountsResponse,
  txPerPage: sel.txPerPage,
  spendableTotalBalance: sel.spendableTotalBalance,
  transactions: sel.transactions,
  synced: sel.synced,
  unmined: sel.unmined,
  mined: sel.homeHistoryMined
});

export default connect(mapStateToProps);
