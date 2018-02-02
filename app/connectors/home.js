import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as clientActions from "actions/ClientActions";

const mapStateToProps = selectorMap({
  getTransactionsRequestAttempt: sel.getTransactionsRequestAttempt,
  getAccountsResponse: sel.getAccountsResponse,
  spendableTotalBalance: sel.spendableTotalBalance,
  transactions: sel.homeHistoryTransactions,
  revokeTicketsError: sel.revokeTicketsError,
  revokeTicketsSuccess: sel.revokeTicketsSuccess,
  hasTicketsToRevoke: sel.hasTicketsToRevoke,
  totalBalance: sel.totalBalance,
  lockedTotalBalance: sel.lockedBalance,
  spendableAndLockedByDay: sel.spendableAndLockedByDay,
  noMoreTransactions: sel.noMoreTransactions,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getTransactions: clientActions.getTransactions,
  onRevokeTickets: ca.revokeTicketsAttempt,
  onClearRevokeTicketsError: ca.clearRevokeTicketsError,
  onClearRevokeTicketsSuccess: ca.clearRevokeTicketsSuccess,
}, dispatch);

export default connect(mapStateToProps,mapDispatchToProps);
