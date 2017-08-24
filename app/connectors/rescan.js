// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import { rescanAttempt } from "../actions/ControlActions";
import {
  rescanRequest,
  rescanStartBlock,
  rescanEndBlock,
  rescanCurrentBlock,
  rescanPercentFinished
} from "../selectors";

const mapStateToProps = selectorMap({
  rescanRequest,
  rescanStartBlock,
  rescanEndBlock,
  rescanCurrentBlock,
  rescanPercentFinished
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  rescanAttempt
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
