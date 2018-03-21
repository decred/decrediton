import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
import * as ca from "../actions/ControlActions";

const mapStateToProps = selectorMap({
});

const mapDispatchToProps = dispatch => bindActionCreators({
  modalShown: ca.modalShown,
  modalHidden: ca.modalHidden,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
