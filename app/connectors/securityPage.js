import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as ca from "../actions/SignMessageActions";
import { selectorMap } from "../fp";

const mapStateToProps = selectorMap({
  walletService: sel.walletService,
  signMessageError: sel.signMessageError,
  signMessageSuccess: sel.signMessageSuccess,
  messageVerificationService: sel.messageVerificationService,
  verifyMessageError: sel.verifyMessageError,
  verifyMessageSuccess: sel.verifyMessageSuccess,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getSignMessageAttempt: ca.signMessageAttempt,
  getSignMessageCleanStore: ca.signMessageCleanStore
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps);
