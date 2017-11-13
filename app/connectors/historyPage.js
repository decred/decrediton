import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as ca from "../actions/ClientActions";

const mapStateToProps = selectorMap({
  walletService: sel.walletService,
  txPerPage: sel.txPerPage,
  spendableTotalBalance: sel.spendableTotalBalance,
  transactions: sel.transactions,
  transactionsFilter: sel.transactionsFilter,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getTransactions: ca.getTransactions,
  changeTransactionsFilter: ca.changeTransactionsFilter,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
