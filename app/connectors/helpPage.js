import { connect } from "react-redux";
import { selectorMap } from "fp";
import * as sel from "selectors";

const mapStateToProps = selectorMap({
  appVersion: sel.appVersion,
  updateAvailable: sel.updateAvailable,
});

export default connect(mapStateToProps);
