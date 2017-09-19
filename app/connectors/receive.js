// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap, bool } from "../fp";
import * as ca from "../actions/ControlActions";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  isRequestingAddress: bool(sel.getNextAddressRequestAttempt),
  nextAddressAccount: sel.nextAddressAccount,
  nextAddress: sel.nextAddress,
  visibleAccounts: sel.visibleAccounts
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getNextAddressAttempt: ca.getNextAddressAttempt
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
