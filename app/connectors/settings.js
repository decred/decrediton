import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { currencyDisplay, unitDivisor } from "../selectors";

const mapStateToProps = selectorMap({
  currencyDisplay,
  unitDivisor
});

export default connect(mapStateToProps);
