import { connect } from "react-redux";
import { selectorMap } from "fp";
import { bindActionCreators } from "redux";
import * as sel from "selectors";
import * as ta from "actions/TransactionActions";

const mapStateToProps = selectorMap({
  startRequestHeight: sel.startRequestHeight,
  ticketsFilter: sel.ticketsFilter,
  currentBlockHeight: sel.currentBlockHeight
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      cancelGetTransactions: ta.cancelGetTransactions
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps);
