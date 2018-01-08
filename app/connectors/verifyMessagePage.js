import { connect } from "react-redux";
import * as sel from "../selectors";
import { verifyMessageAttempt, verifyMessageCleanStore } from "../actions/ControlActions";
import { getMessageVerificationServiceAttempt } from "../actions/ClientActions";
import { selectorMap } from "../fp";

const mapStateToProps = selectorMap({
  messageVerificationService: sel.messageVerificationService,
  verifyMessageError: sel.verifyMessageError,
  verifyMessageSuccess: sel.verifyMessageSuccess,
});

export default connect(mapStateToProps, { verifyMessageAttempt, verifyMessageCleanStore, getMessageVerificationServiceAttempt });
