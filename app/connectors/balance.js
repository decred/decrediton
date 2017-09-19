import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  currencyDisplay: sel.currencyDisplay
});

export default connect(mapStateToProps);
