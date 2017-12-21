// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as da from "../actions/DaemonActions";

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getDcrdLogs: da.getDcrdLogs,
  getDcrwalletLogs: da.getDcrwalletLogs,
  getDecreditonLogs: da.getDecreditonLogs,
}, dispatch);

export default connect(mapDispatchToProps);
