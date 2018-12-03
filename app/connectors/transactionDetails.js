import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as ca from "../actions/ClientActions";
import * as cla from "../actions/ControlActions";

const mapStateToProps = selectorMap({
  currentBlockHeight: sel.currentBlockHeight,
  tsDate: sel.tsDate,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  goBackHistory: ca.goBackHistory,
  publishUnminedTransactions: cla.publishUnminedTransactionsAttempt,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
