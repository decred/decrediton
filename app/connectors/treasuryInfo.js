import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  treasuryBalance: sel.treasuryBalance,
});

export default connect(mapStateToProps);
