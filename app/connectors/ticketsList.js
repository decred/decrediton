import { connect } from "react-redux";
import { selectorMap } from "fp";
import { bindActionCreators } from "redux";
import * as sel from "selectors";
import * as ca from "actions/ClientActions";
import * as ta from "actions/TransactionActions";

const mapStateToProps = selectorMap({
  tickets: sel.filteredStakeTxs,
  tsDate: sel.tsDate,
  noMoreTickets: sel.noMoreTransactions,
  ticketsFilter: sel.ticketsFilter,
  window: sel.mainWindow
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      goBackHistory: ca.goBackHistory,
      getTickets: ta.getTransactions,
      changeTicketsFilter: ta.changeTicketsFilter
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps);
