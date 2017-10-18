import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { showSidebar, hideSidebarMenu } from "../actions/SidebarActions";

const mapDispatchToProps = dispatch => bindActionCreators({
  showSidebar,
  hideSidebarMenu,
}, dispatch);

export default connect(null, mapDispatchToProps);
