import { connect } from "react-redux";
import { selectorMap } from "fp";
import * as sel from "selectors";

const mapStateToProps = selectorMap({
  balanceSent: sel.balanceSent,
  balanceReceived: sel.balanceReceived,
  sentAndReceivedTransactions: sel.sentAndReceivedTransactions,
});

export default connect(mapStateToProps);
