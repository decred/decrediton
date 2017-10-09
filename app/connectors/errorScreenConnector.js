import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import { hideSidebarMenu, hideSidebar } from "../actions/SidebarActions";

const mapStateToProps = selectorMap({
  getTransactionsRequestAttempt: sel.getTransactionsRequestAttempt,
  getAccountsResponse: sel.getAccountsResponse,
  txPerPage: sel.txPerPage,
  spendableTotalBalance: sel.spendableTotalBalance,
  synced: sel.synced,
  transactions: sel.homeHistoryTransactions
});

export default connect(mapStateToProps, { hideSidebarMenu, hideSidebar });
