import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import { hideSidebar, hideSidebarMenu } from "../actions/SidebarActions";

const mapStateToProps = selectorMap({
  getNetworkError: sel.getNetworkError,
});

export default connect(mapStateToProps, { hideSidebarMenu, hideSidebar });
