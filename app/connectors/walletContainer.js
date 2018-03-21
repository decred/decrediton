import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  expandSideBar: sel.expandSideBar,
});

export default connect(mapStateToProps);
