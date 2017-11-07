import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as ca from "../actions/ControlActions";

const mapDispatchToProps = dispatch => bindActionCreators({
  onGetNextAccountAttempt: ca.getNextAccountAttempt
}, dispatch);

export default connect(null, mapDispatchToProps);
