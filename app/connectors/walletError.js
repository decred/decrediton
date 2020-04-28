import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  getNetworkError: sel.getNetworkError,
});

export default connect(mapStateToProps);
