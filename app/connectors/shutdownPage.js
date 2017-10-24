import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { showSidebarMenu, showSidebar, hideSidebarMenu } from "../actions/SidebarActions";
import * as da from "../actions/DaemonActions";

const mapDispatchToProps = dispatch => bindActionCreators({
  cleanShutdown: da.cleanShutdown,
  showSidebarMenu,
  showSidebar,
  hideSidebarMenu,
}, dispatch);

export default connect(null, mapDispatchToProps);
