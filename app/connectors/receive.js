// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as ca from "../actions/ControlActions";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  nextAddress: sel.nextAddress,
  account: sel.nextAddressAccount
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getNextAddressAttempt: ca.getNextAddressAttempt
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps);
