// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as ca from "../actions/ControlActions";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  rescanRequest: sel.rescanRequest,
  rescanStartBlock: sel.rescanStartBlock,
  rescanEndBlock: sel.rescanEndBlock,
  rescanCurrentBlock: sel.rescanCurrentBlock,
  rescanPercentFinished: sel.rescanPercentFinished
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  rescanAttempt: ca.rescanAttempt,
  rescanCancel: ca.rescanCancel
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
