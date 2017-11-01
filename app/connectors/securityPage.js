import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as sm from "../actions/SignMessageActions";
import * as vm from "../actions/VerifyMessageActions";
import { getMessageVerificationServiceAttempt } from "../actions/ClientActions";
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
  getSignMessageAttempt: sm.signMessageAttempt,
  getSignMessageCleanStore: sm.signMessageCleanStore,
  getVerifyMessageAttempt: vm.verifyMessageAttempt,
  getVerifyMessageCleanStore: vm.verifyMessageCleanStore,
  getMessageVerificationServiceAttempt: getMessageVerificationServiceAttempt

}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps);
