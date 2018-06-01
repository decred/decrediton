import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as ca from "../actions/ControlActions";

const mapStateToProps = selectorMap({
  expandSideBar: sel.expandSideBar,
  showingSidebarMenu: sel.showingSidebarMenu,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  modalShown: ca.modalShown,
  modalHidden: ca.modalHidden,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
