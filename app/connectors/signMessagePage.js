import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as ca from "../actions/ControlActions";
import * as trza from "../actions/TrezorActions";

const mapStateToProps = selectorMap({
  signMessageError: sel.signMessageError,
  signMessageSignature: sel.signMessageSignature,
  isSigningMessage: sel.isSigningMessage,
  walletService: sel.walletService,
  isSignMessageDisabled: sel.isSignMessageDisabled,
  isTrezor: sel.isTrezor,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  signMessageAttempt: ca.signMessageAttempt,
  validateAddress: ca.validateAddress,
  signMessageCleanStore: ca.signMessageCleanStore,
  signMessageAttemptTrezor: trza.signMessageAttemptTrezor,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
