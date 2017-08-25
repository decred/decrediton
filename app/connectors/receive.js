// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap, bool } from "../fp";
import { getNextAddressAttempt } from "../actions/ControlActions";
import {
  getNextAddressRequestAttempt,
  nextAddressAccount,
  nextAddress,
  visibleAccounts
} from "../selectors";

const mapStateToProps = selectorMap({
  isRequestingAddress: bool(getNextAddressRequestAttempt),
  nextAddressAccount,
  nextAddress,
  visibleAccounts
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getNextAddressAttempt
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
