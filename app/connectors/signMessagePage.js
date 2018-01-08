import { connect } from "react-redux";
import * as sel from "../selectors";
import { signMessageAttempt, signMessageCleanStore } from "../actions/ControlActions";
import { selectorMap } from "../fp";

const mapStateToProps = selectorMap({
  signMessageError: sel.signMessageError,
  signMessageSuccess: sel.signMessageSuccess,
  walletService: sel.walletService,
});

export default connect(mapStateToProps, { signMessageAttempt, signMessageCleanStore });
