import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  isSignVerifyMessageDisabled: sel.isSignVerifyMessageDisabled,
});

export default connect(mapStateToProps);
