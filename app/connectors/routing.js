import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as ca from "../actions/ClientActions";

const mapStateToProps = selectorMap({
  location: sel.location
});

const mapDispatchToProps = dispatch => bindActionCreators({
  goBackHistory: ca.goBackHistory,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
