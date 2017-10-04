import { connect } from "react-redux";
import * as sel from "../selectors";
import { signMessageAttempt, signMessageCleanStore } from "../actions/SignMessage";
import { selectorMap } from "../fp";

const mapStateToProps = selectorMap({
  signMessageError: sel.signMessageError,
  signMessageSuccess: sel.signMessageSuccess,
});

export default connect(mapStateToProps, { signMessageAttempt, signMessageCleanStore });
