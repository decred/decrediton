import { connect } from "react-redux";
import * as sel from "../selectors";
import { selectorMap } from "../fp";

const mapStateToProps = selectorMap({
  uiAnimations: sel.uiAnimations,
});

export default connect(mapStateToProps);
