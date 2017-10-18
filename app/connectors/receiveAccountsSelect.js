import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as ca from "../actions/ControlActions";

const mapStateToProps = selectorMap({
  account: sel.nextAddressAccount
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getNextAddressAttempt: ca.getNextAddressAttempt
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
