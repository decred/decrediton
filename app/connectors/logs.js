// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as ca from "../actions/DaemonActions";

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getDcrdLogs: ca.getDcrdLogs,
  getDcrwalletLogs: ca.getDcrwalletLogs,
  getDecreditonLogs: ca.getDecreditonLogs,
}, dispatch);

export default connect(mapDispatchToProps);
