import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as ca from "../actions/ClientActions";

const mapStateToProps = selectorMap({
  walletService: sel.walletService,
  totalBalance: sel.totalBalance,
  transactions: sel.transactions,
  transactionsFilter: sel.transactionsFilter,
  noMoreTransactions: sel.noMoreTransactions,
  window: sel.mainWindow,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getTransactions: ca.getTransactions,
  changeTransactionsFilter: ca.changeTransactionsFilter,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
