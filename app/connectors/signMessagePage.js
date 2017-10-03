import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import { signMessageAttempt } from "../actions/SignMessage";

/*const mapStateToProps = selectorMap({
  signMessageError: sel.signMessageError,
  signMessageSuccess: sel.signMessageSuccess,
  signMessageResponse: sel.signMessageResponse,
});*/

function mapStateToProps(state) {
  // console.log(mapStateToPropsl(state, props));
  // console.log('TEST', state, props);

  return {
    signMessageError: state.grpc.getSignMessageError,
    signMessageSuccess: state.grpc.getSignMessageResponse ? state.grpc.getSignMessageResponse.toObject() : null,
  };
}

const mapDispatchToProps = dispatch => bindActionCreators({
  signMessageAttempt: signMessageAttempt,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
