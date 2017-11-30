import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as da from "../actions/DaemonActions";

const mapDispatchToProps = dispatch => bindActionCreators({
  cleanShutdown: da.cleanShutdown,
}, dispatch);

export default connect(null, mapDispatchToProps);
