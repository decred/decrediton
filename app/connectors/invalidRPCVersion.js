import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { showSidebar, hideSidebarMenu } from "../actions/SidebarActions";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  requiredWalletRPCVersion: sel.requiredWalletRPCVersion,
  walletRPCVersion: sel.walletRPCVersion
});

const mapDispatchToProps = dispatch => bindActionCreators({
  showSidebar,
  hideSidebarMenu,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
