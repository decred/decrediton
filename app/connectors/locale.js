import { connect } from "react-redux";
import { selectorMap } from "fp";
import * as sel from "selectors";

const mapStateToProps = selectorMap({
  currentLocaleName: sel.currentLocaleName,
});

export default connect(mapStateToProps);
