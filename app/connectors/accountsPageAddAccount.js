import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as ca from "../actions/ControlActions";

const mapStateToProps = selectorMap({
  getNextAccountSuccess: sel.getNextAccountSuccess,
  getNextAccountError: sel.getNextAccountError
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onGetNextAccountAttempt: ca.getNextAccountAttempt
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
