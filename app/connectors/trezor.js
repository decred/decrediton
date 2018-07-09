import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as trza from "../actions/TrezorActions";

const mapStateToProps = selectorMap({
  isTrezor: sel.isTrezor,
  waitingForPin: sel.trezorWaitingForPin,
  waitingForPassPhrase: sel.trezorWaitingForPassPhrase,
  device: sel.trezorDevice,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  cancelCurrentOperation: trza.cancelCurrentOperation,
  submitPin: trza.submitPin,
  submitPassPhrase: trza.submitPassPhrase,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
