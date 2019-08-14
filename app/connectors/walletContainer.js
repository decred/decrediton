import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  expandSideBar: sel.expandSideBar,
  sidebarOnBottom: sel.sidebarOnBottom
});

export default connect(mapStateToProps);
