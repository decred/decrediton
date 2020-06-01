import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as ta from "actions/TransactionActions";

const mapStateToProps = selectorMap({
  walletService: sel.walletService,
  totalBalance: sel.totalBalance,
  transactions: sel.filteredRegularTxs,
  transactionsFilter: sel.transactionsFilter,
  noMoreTransactions: sel.noMoreRegularTxs,
  window: sel.mainWindow,
  tsDate: sel.tsDate
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getTransactions: ta.getTransactions,
      changeTransactionsFilter: ta.changeTransactionsFilter
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps);
