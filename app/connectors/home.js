import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "fp";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as cla from "actions/ClientActions";

const mapStateToProps = selectorMap({
  getTransactionsRequestAttempt: sel.getTransactionsRequestAttempt,
  getTicketsRequestAttempt: sel.getTicketsRequestAttempt,
  getAccountsResponse: sel.getAccountsResponse,
  spendableTotalBalance: sel.spendableTotalBalance,
  transactions: sel.homeHistoryTransactions,
  tickets: sel.homeHistoryTickets,
  revokeTicketsError: sel.revokeTicketsError,
  revokeTicketsSuccess: sel.revokeTicketsSuccess,
  hasTicketsToRevoke: sel.hasTicketsToRevoke,
  totalBalance: sel.totalBalance,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onRevokeTickets: ca.revokeTicketsAttempt,
  onClearRevokeTicketsError: ca.clearRevokeTicketsError,
  onClearRevokeTicketsSuccess: ca.clearRevokeTicketsSuccess,
  goToMyTickets: cla.goToMyTickets,
  goToTransactionHistory: cla.goToTransactionHistory,
}, dispatch);

export default connect(mapStateToProps,mapDispatchToProps);
