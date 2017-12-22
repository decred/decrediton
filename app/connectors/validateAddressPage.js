import { connect } from "react-redux";
import * as sel from "../selectors";
import { validateAddress } from "actions/ControlActions";
import { selectorMap } from "fp";

const mapStateToProps = selectorMap({
  validateAddressError: sel.validateAddressError,
  validateAddressSuccess: sel.validateAddressSuccess,
  validateAddressRequestAttempt: sel.validateAddressRequestAttempt
});

export default connect(mapStateToProps, { validateAddress });
