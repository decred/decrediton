import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
import * as ca from "../actions/SnackbarActions";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  messages: sel.snackbarMessages,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onDismissAllMessages: ca.dismissAllMessages,
  dispatchSingleMessage: ca.dispatchSingleMessage,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
