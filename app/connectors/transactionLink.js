import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({
  txURLBuilder: sel.txURLBuilder
});

export default connect(mapStateToProps);
